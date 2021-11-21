import fs from 'fs';
import {
    Client,
    Collection,
    Intents,
    Message,
    MessageEmbed,
    TextChannel
} from 'discord.js'
import {Game} from './game/game'
import {setTimeout} from 'timers/promises'
import {DBmanager} from "../database/dbmanager";
import {Team} from "./game/team";

require('./deploy-commands');

const client: any = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const dbManager: DBmanager = new DBmanager();

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
}

const answerTime = 10000;
let playing = false;
let game = new Game();

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
                game = await new Game();
                await joinGame(res);
                playing = true;
                runGame(interaction.channel);
                break;
            case 'answer':
                const answer: string = interaction.options.getString('answer');

                if (answer.includes(game.getCurrentWord())) {
                    confirmAnswer(interaction.options.getString('answer'), interaction.user.tag);
                    interaction.reply({content: 'Answer received!', ephemeral: true})
                } else
                    interaction.reply({
                        content: 'Your answer must include the word ' + game.getCurrentWord(),
                        ephemeral: true
                    })
                break;
        }
    }
});

client.login(process.env.TOKEN);

async function runGame(channel: TextChannel) {
    const topic = game.getTopic();
    let round = 1;
    const totalRounds = topic.words.length + 1;

    while (playing) {
        const word = game.getCurrentWord();

        //create embed with current round and chosen word
        let msg = createRoundEmbed(round, word, topic.name);
        let curRound = await channel.send({embeds: [msg]})
        setCountdown(msg, curRound, answerTime, 'Round ' + round + ' ends in ');

        await setTimeout(11000);
        const results = await game.endRound();
        showResults(curRound, results, round);
        await setTimeout(5000);

        round++;
        if (round > totalRounds) {
            // const team = game.getPlayers();
            // const teamWon = game.
            //
            // for (let i = 0; i <  team.length, i++;)
            //     for (let player of team[i]){
            //
            //     }

            break;
        }
    }
}

async function joinGame(players: Team[]) {
    await game.joinGame(players);
}

function confirmAnswer(answer: string, player: string) {
    game.answer(answer, player);
}

function setCountdown(embed: MessageEmbed, msg: Message, time: number, text: string) {
    let intervalTimer = time / 1000;

    let interval = setInterval(async () => {
        embed.setTitle(text + ' ' + (intervalTimer) + ' seconds');
        intervalTimer--;
        await msg.edit({embeds: [embed]});

        if (intervalTimer <= 0)
            clearInterval(interval);
    }, 1000);
}

function createRoundEmbed(round: number, word: string, topic: string): MessageEmbed {
    return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Round ' + round)
        .setDescription('You have ')
        .addFields(
            {name: 'Current topic: ', value: topic, inline: true},
            {name: '\u200b', value: '\u200b', inline: true},
            {name: 'Pair a term with: ', value: word, inline: true}
        )
}

function showResults(msg: Message, results: any, round: number) {
    const embed = msg.embeds[0];
    let fields = [];
    for (let i = 0; i < results.answers.length; i++) {
        if (!results.answers[i] || results.answers[i].length === 0) results.answers[i] = 'Nothing';

        fields.push(
            {name: 'Team ' + (i + 1) + ' answered: ', value: results.answers[i], inline: true},
            {name: '\u200b', value: '\u200b', inline: true},
            {name: 'They scored: ', value: results.score[i] + ' points!', inline: true},
        );
    }

    embed
        .setTitle('Round ' + round + ' results:')
        .setDescription('')
        .setFields(fields);

    msg.edit({embeds: [embed]});
}