export class Team {
    private players: string[];
    private totalScore: number;
    private answered: string[];
    private currentAnswer: string = '';

    addPlayers(players: string[]) {
        this.players = players;
    }

    addScore(score: number){
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


    getAnswered() {
        return this.answered;
    }

    hasPlayer(player: string): boolean {
        return this.players.includes(player);
    }
}