import fs from 'fs';
import {Client, Collection, Intents} from 'discord.js'
import dotenv from 'dotenv'
import {Game} from "./game/game"
import { setTimeout } from 'timers/promises'
import {Trends} from "./game/trends";

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
                runGame();
                break;
            case 'answer':
                answer(interaction.options.getString('answer'), interaction.user.tag);
                break;
        }
    }
});

client.login(process.env.TOKEN);

async function runGame() {
    while(playing){
        const roundScore = await setTimeout(5000, game.getRoundResult());
        console.log(roundScore);
    }
}

async function joinGame(players: string[]) {
    await game.joinGame(players);
}

function answer(answer: string, player: string) {
    game.answer(answer, player);
}