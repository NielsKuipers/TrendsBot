import {SlashCommandBuilder} from "@discordjs/builders";
import User from '../database/models/user';
import {MessageEmbed} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Look at your stats'),
    async execute(interaction: any) {
        const user = await User.findById(interaction.user.id);

        if (!user){
            await interaction.reply({content: 'User not found', ephemeral: true})
            return;
        }

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(interaction.user.tag + '\'s' + ' stats')
            .addFields(
                {name: 'Games played ', value: user.gamesPlayed.toString(), inline: true},
                {name: 'Games won ', value: user.gamesWon.toString(), inline: true},
                {name: 'Games lost ', value: user.gamesLost.toString(), inline: true},
                {name: 'Highest score ', value: user.highestScore.toString(), inline: true},
            )

        await interaction.reply({embeds: [embed]});
    }
}
