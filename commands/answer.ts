import {SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('answer')
        .setDescription('Submit an answer')
        .addStringOption(option => option.setName('answer').setDescription('Enter your answer!').setRequired(true)),
    async execute(interaction: any) {
    }
}
