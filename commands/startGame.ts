import {SlashCommandBuilder} from "@discordjs/builders";
import {
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageEmbed, MessageSelectMenu
} from "discord.js";
import {Team} from '../src/game/team';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playtrends')
        .setDescription('Starts a game of trends')
        .addIntegerOption(o =>
            o.setName('teams')
                .setDescription('The amount of teams to play with')
                .setRequired(true)
                .addChoice('2', 2)
                .addChoice('3', 3)
                .addChoice('4', 4)),
    timer: 10000,
    players: [],
    async execute(interaction: any) {
        //clear player array before adding players
        this.players.length = 0;

        //add the selected amount of teams
        for (let i = 0; i < interaction.options.getInteger('teams'); i++)
            this.players.push(new Team());

        const teamSelect = new MessageSelectMenu()
            .setCustomId('teamSelect')
            .setPlaceholder('Select team')
            .addOptions([{label: '\u200b', value: '\u200b'}]);

        const buttonRow = new MessageActionRow()
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

        const selectRow = new MessageActionRow();

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Game starting!')
            .setDescription('Press Join to join in!')

        let options = [];
        for (let i = 0; i < interaction.options.getInteger('teams'); i++) {
            options.push({label: 'Team ' + (i + 1), value: `${i}`});
            embed.addField('Team ' + (i + 1), '\u200b', true);
        }
        teamSelect.setOptions(options);
        selectRow.addComponents(teamSelect);

        await interaction.reply({
            embeds: [embed],
            components: [buttonRow]
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
        collector.on('collect', async (i: Interaction) => {
            const user = i.user.tag;
            const userID = i.user.id;

            if (i.isButton()) {
                if (i.customId === 'join')
                    await i.reply({content: 'Select a team to join', components: [selectRow], ephemeral: true})
                else if (i.customId === 'leave') {
                    const team = this.players.findIndex(t => t.hasPlayer(userID));

                    if (team !== -1) {
                        this.players[team].removePlayer(userID);
                        const field = embed.fields[team].value;
                        embed.fields[team].value = field.replace(user + '\n', '');

                        await i.update({embeds: [embed], components: [buttonRow]});
                    } else {
                        await i.reply({content: 'You are not participating in this game', ephemeral: true});
                    }
                }
            } else if (i.isSelectMenu() && i.customId === 'teamSelect') {
                const selectedTeam = i.values[0];

                embed.fields[selectedTeam].value += user + '\n';
                this.players[selectedTeam].addPlayer(userID);
                await i.update({content: 'Team joined!', components: []});

                return;
            }
        });
    }
}