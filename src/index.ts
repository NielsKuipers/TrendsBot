import fs from 'fs';
import {Client, Collection, Intents, Message, MessageEmbed, TextChannel} from 'discord.js'
import dotenv from 'dotenv'
import {Game} from "./game/game"
import {setTimeout} from 'timers/promises'

require('./deploy-commands');

dotenv.config();
const client: any = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
}


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

                if (answer.includes(game.getCurrentWord())){
                    confirmAnswer(interaction.options.getString('answer'), interaction.user.tag);
                    interaction.reply({ content: 'Answer received!', ephemeral: true})
                }
                else
                    interaction.reply({ content: 'Your answer must include the word ' + game.getCurrentWord(), ephemeral: true})
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

        await setTimeout(10000);
        const results = await game.endRound();
        showResults(curRound, results, round);
        await setTimeout(5000);

        round++;
        if (round > totalRounds)
            break;
    }
}

async function joinGame(players: string[]) {
    await game.joinGame(players);
}

function confirmAnswer(answer: string, player: string) {
    game.answer(answer, player);
}

function createRoundEmbed(round: number, word: string, topic: string): MessageEmbed {
    return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Round ' + round)
        .setDescription('Use the /answer command to submit your answer')
        .addFields(
            {name: 'Current topic: ', value: topic, inline: true},
            {name: 'Pair a term with: ', value: word, inline: true}
        )
}

function showResults(msg: Message, results: any, round: number) {
    const embed = msg.embeds[0];

    embed
        .setTitle('Round ' + round + ' results:')
        .setDescription('')
        .addFields(
            {name: 'Player 1 answered: ', value: results.answers[0], inline: true},
            {name: 'Player 2 answered: ', value: results.answers[1], inline: true}
        )

    msg.edit({embeds: [embed]});
}