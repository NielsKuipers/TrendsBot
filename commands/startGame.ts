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
    timer: 10000,
    players: [[], []],
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
            .setDescription('Press Join to join in!')
            .addFields({name: 'Team 1', value: '\u200b', inline: true}, {name: 'Team 2', value: '\u200b', inline: true})

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = interaction.channel.createMessageComponentCollector({time: this.timer});

        //start countdown
        let intervalTimer = this.timer / 1000;
        let interval = setInterval(async () => {
            embed.setTitle('Starting in: ' + (intervalTimer - 1) + ' seconds');
            intervalTimer--;
            await interaction.editReply({embeds: [embed]});

            if (intervalTimer === 0)
                clearInterval(interval);
        }, 1000);

        //whenever you press the button add/remove a player to/from the embed
        collector.on('collect', async (i: ButtonInteraction) => {
            const user = i.user.tag;

            if (i.customId === 'join') {
                //check which team has the least members and add to that one
                const team = (this.players[0].length > this.players[1].length) ? 1 : 0;

                embed.fields[team].value += user + '\n';
                await i.update({embeds: [embed], components: [row]});
                this.players[team].push(user);
            } else {
                const team = this.players.findIndex(t => t.includes(user));

                if(team !== -1) {
                    this.players[team] = this.players[team].filter(p => p !== user);
                    const field = embed.fields[team].value;
                    embed.fields[team].value = field.replace(user + '\n', '');

                    await i.update({embeds: [embed], components: [row]});
                } else {
                    await i.reply({content: 'You are not participating in this game', ephemeral: true});
                }
            }
        });
    }
}