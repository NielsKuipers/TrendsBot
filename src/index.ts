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

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
}

GameManager.connectToDb();

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
    }
});

client.login(process.env.TOKEN);