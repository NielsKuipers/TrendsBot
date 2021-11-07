export class Trends {
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

    answer(answer: string): void {
        this.answer1 = answer;
    }

    getAnswer(): string {
        return this.answer1;
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