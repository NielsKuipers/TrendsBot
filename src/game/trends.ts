export abstract class Trends {
    private static gTrends = require('google-trends-api');

    public static async getDifference(answer1: string, answer2: string): Promise<number[]>{
        if((!answer1 || answer1.length === 0) && (!answer2 || answer2.length === 0))
            return [0, 0];

        if(!answer1 || answer1.length === 0)
            return [0, 100];
        else if (!answer2 || answer2.length === 0)
            return [100, 0];

        let date = new Date(Date.now());
        date.setMonth(date.getMonth() - 1);

        const result = await this.gTrends.interestOverTime({ keyword: [answer1, answer2], startTime: date});
        const { default: {averages} } = JSON.parse(result);

        return averages;
    }
}