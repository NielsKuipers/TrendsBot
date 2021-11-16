export abstract class Trends {
    private static gTrends = require('google-trends-api');

    public static async getDifference(answers: string[], teams: number): Promise<number[]> {
        let scores: number[] = [];

        for (let i = teams - 1; i >= 0; i--) {
            if (!answers[i] || answers[i].length === 0) {
                scores.unshift(0);
                answers.splice(i, 1);
            } else
                scores.unshift(1);
        }

        //if no one answered just return 0
        if(!scores.includes(1))
            return scores;
        //TODO: add check for only 1 answer

        let date = new Date(Date.now());
        date.setMonth(date.getMonth() - 1);

        answers.push('candleholder in my car');

        const result = await this.gTrends.interestOverTime({ keyword: answers, startTime: date});
        const { default: {averages} } = JSON.parse(result);

        for (let i = 0; i < teams; i++){
            let j = 0;

            if(scores[i] !== 0){
                scores[i] = averages[j];
                j++;
            }
        }

        return scores;
    }
}