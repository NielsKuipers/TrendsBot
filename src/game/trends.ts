export abstract class Trends {
    private static gTrends = require('google-trends-api');

    public static async getDifference(answers: string[], teams: number): Promise<number[]> {
        let scores: number[] = [];

        //if a team has answered give them a temporary score of 1
        for (let i = teams - 1; i >= 0; i--) {
            if (!answers[i] || answers[i].length === 0) {
                scores.unshift(0);
                answers.splice(i, 1);
            } else
                scores.unshift(1);
        }

        //if no one answered return 0 or if only 1 person answered give them 100 points
        if (!scores.includes(1))
            return scores;
        else if (scores.filter(i => i === 1).length === 1) {
            scores[scores.indexOf(1)] = 100;
            return scores;
        }

        let date = new Date(Date.now());
        date.setMonth(date.getMonth() - 1);

        const result = await this.gTrends.interestOverTime({keyword: answers, startTime: date});
        const {default: {averages}} = JSON.parse(result);

        //if your team answered give them the points earned with it
        let j = 0;
        for (let i = 0; i < teams; i++) {
            if (scores[i] !== 0) {
                scores[i] = averages[j];
                j++;
            }
        }

        return scores;
    }
}