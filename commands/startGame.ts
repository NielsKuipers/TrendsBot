import {SlashCommandBuilder} from "@discordjs/builders";
import {
    ButtonInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed
} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playtrends')
        .setDescription('Starts a game of trends'),
    timer: 5000,
    players: [],
    async execute(interaction: any) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('join')
                    .setLabel('Join')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('leave')
                    .setLabel('Leave')
                    .setStyle('DANGER')
            );

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Game starting!')
            .setDescription('Press Join to join in!');

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        let amountOfPlayers = 0;
        const collector = interaction.channel.createMessageComponentCollector({time: this.timer});

        //start countdown
        let intervalTimer = this.timer / 1000;
        let interval = setInterval(async () => {
            embed.setTitle('Starting in: ' + (intervalTimer -1) + ' seconds');
            intervalTimer--;
            await interaction.editReply({embeds: [embed]});

            if(intervalTimer === 0)
                clearInterval(interval);
        }, 1000);

        //whenever you press the button add a player to the embed
        collector.on('collect', async (i: ButtonInteraction) => {
            amountOfPlayers++;

            if (amountOfPlayers === 2) {
                row.components.at(0).setDisabled(true);
                embed.setDescription('maximum amount of players reached');
            }

            if (i.customId === 'join') {
                embed.addField('Player ' + amountOfPlayers, i.user.tag, true);
                await i.update({embeds: [embed], components: [row]});
                this.players.push(i.user.tag);
            }
        });
    }
}