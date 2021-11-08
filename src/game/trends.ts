export abstract class Trends {
    private static gTrends = require('google-trends-api');

    public static async getDifference(answer1: string, answer2: string): Promise<number[]>{
        let date = new Date(Date.now());
        date.setMonth(date.getMonth() - 1);

        const result = await this.gTrends.interestOverTime({ keyword: [answer1, answer2], startTime: date});
        const { default: {averages} } = JSON.parse(result);

        return averages;
    }
}