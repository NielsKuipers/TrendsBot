import {Message, MessageEmbed} from "discord.js";
import {Team} from "../game/team";

export class Messages {

    static createRoundEmbed(round: number, word: string, topic: string): MessageEmbed {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Round ' + round)
            .setDescription('Use /answer to submit an answer!')
            .addFields(
                {name: 'Current topic: ', value: topic, inline: true},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: 'Pair a term with: ', value: word, inline: true}
            )
    }

    static createResultEmbed(round: number, teams: Team[], gameOver: boolean = false) {
        let fields = [];
        let title = 'Round ' + (round) + ' starts in: 10';
        let description = 'Current scores:';

        //sort teams based on highest score
        teams.sort((a, b) => b.getTotalScore() - a.getTotalScore());
        for (let i = 0; i < teams.length; i++) {
            fields.push(
                {name: 'Place #' + (i + 1), value: 'Team name', inline: true},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: 'Total score: ', value: teams[i].getTotalScore() + ' points!', inline: true},
            )
        }

        if (gameOver) {
            title = 'Game over! Team' + ' team name ' + 'has won!';
            description = 'Total scores:'
        }

        return new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            .setDescription(description)
            .setFields(fields);
    }

    static showResults(msg: Message, results: any, round: number) {
        const embed = msg.embeds[0];
        let fields = [];
        for (let i = 0; i < results.answers.length; i++) {
            if (!results.answers[i] || results.answers[i].length === 0) results.answers[i] = 'Nothing';

            fields.push(
                {name: 'Team ' + (i + 1) + ' answered: ', value: results.answers[i], inline: true},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: 'They scored: ', value: results.score[i] + ' points!', inline: true},
            );
        }

        embed
            .setTitle('Round ' + round + ' results:')
            .setDescription('')
            .setFields(fields);

        msg.edit({embeds: [embed]});
    }
}