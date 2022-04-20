import {SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setteamname')
        .setDescription("Change your team's name")
        .addStringOption(option => option.setName('teamname').setDescription('Enter your new name!').setRequired(true)),
    async execute() {
    }
}
