export class Team {
    private players: string[] = [];
    private totalScore: number = 0;
    private currentAnswer: string = '';

    getPlayers(): string[] {
        return this.players;
    }

    addPlayer(player: string) {
        this.players.push(player);
    }

    removePlayer(player: string) {
        const index = this.players.indexOf(player, 0);

        if(index > -1){
            this.players.splice(index, 1);
        }
    }

    addScore(score: number) {
        this.totalScore += score;
    }

    getTotalScore() {
        return this.totalScore;
    }

    setAnswer(answer: string) {
        this.currentAnswer = answer;
    }

    getCurrentAnswer(): string {
        return this.currentAnswer;
    }

    hasPlayer(player: string): boolean {
        return this.players.includes(player);
    }
}