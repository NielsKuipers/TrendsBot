import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playtrends')
        .setDescription('Starts a game of trends'),
    async execute(interaction:any) {
        await interaction.reply('hoi');
    }
}