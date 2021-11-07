import {Trends} from "./trends";

export class Game {
    answer1: string;
    answer2: string;
    players: string[];

    constructor() {
        this.players = [];
    }

    async playRound(): Promise<number> {
        await this.timeout(5000);
        return 1;
    }

    answer(answer: string, player: string): void {
        const number: number = this.players.indexOf(player);

        if(number === 0)
            this.answer1 = answer;
        else
            this.answer2 = answer;
    }

    async getRoundResult(): Promise<number[]> {
       return await Trends.getDifference(this.answer1, this.answer2, 'a');
    }

    joinGame(players: string[]): void {
        this.players = players;
    }

    getPlayers(): string[] {
        return this.players;
    }

    timeout(ms): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}