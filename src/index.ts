import fs from 'fs';
import {Client, Collection, Intents, TextChannel} from 'discord.js'
import {Game} from './game/game'
import {setTimeout} from 'timers/promises'
import {DBmanager} from "../database/dbmanager";
import {Team} from "./game/team";
import {ITopic} from "../database/models/topic";
import {Timer} from "./ui/timer";
import {Messages} from "./ui/messages";
import {GameState} from "./game/gameStates";
import {GameManager} from "./game/gameManager";

require('./deploy-commands');

const client: any = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const dbManager: DBmanager = new DBmanager();

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
}

const answerTime = 5000;
const breakTime = 3000;
let game: Game;

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'There was an error executing this command', ephemeral: true})
        }

        switch (command.data.name) {
            case 'playtrends':
                const res = await setTimeout(command.timer, command.players);
                game = GameManager.setGameInstance(new Game());
                game.setState(GameState.JOINING);
                await game.loadTopics();
                await joinGame(res);
                runGame(interaction.channel);
                break;
        }
    }
});

client.login(process.env.TOKEN);

async function runGame(channel: TextChannel) {
    const topic: ITopic = await game.getTopic();
    let round = 1;
    const totalRounds = game.getTotalrounds();

    while (game.getState() !== GameState.NOT_PLAYING) {
        game.setState(GameState.IN_ROUND);
        const word = game.getCurrentWord();

        //create embed with current round and chosen word
        let msg = Messages.createRoundEmbed(round, word, topic.name);
        let curRound = await channel.send({embeds: [msg]})
        Timer.setCountdown(msg, curRound, answerTime, 'Round ' + round + ' ends in ');
        await setTimeout(answerTime + 1000);

        //show round results
        const results = await game.endRound();
        Messages.showResults(curRound, results, round);
        await setTimeout(5000);

        round++;
        if (round > totalRounds) {
            let finalResults = await Messages.createResultEmbed(round, game.getTeams(), true);
            await channel.send({embeds: [finalResults]});

            const teams = game.getTeams();
            const highScore = game.getHighestScore();

            for (let i = 0; i < teams.length; i++) {
                const teamScore = teams[i].getTotalScore();
                const won = highScore === teamScore;

                for (let player of teams[i].getPlayers())
                    await dbManager.handleUser(player, won, teamScore);
            }

            game.setState(GameState.NOT_PLAYING);
        } else {
            //show total game results and countdown for next round
            game.setState(GameState.BETWEEN_ROUND);
            let breakMsg = await Messages.createResultEmbed(round, game.getTeams());
            let curRoundResults = await channel.send({embeds: [breakMsg]})
            Timer.setCountdown(breakMsg, curRoundResults, breakTime, 'Round ' + round + ' starts in ');
            await setTimeout(breakTime + 1000);
        }
    }
}

async function joinGame(players: Team[]) {
    await game.joinGame(players);
}