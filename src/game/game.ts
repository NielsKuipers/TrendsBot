import {Trends} from "./trends";
import {Team} from "./team";

export class Game {
    private teams: Team[] = [new Team(), new Team()];

    //TODO: change topics from from database :)
    private halloween = {name: 'Halloween', words: ['pumpkin', 'candy', 'killer']};
    private cars = {name: 'Cars', words: ['wheel', 'engine', 'door']};
    private topics = [this.halloween, this.cars];
    private readonly currentTopic: any;
    private readonly words: string[];
    private currentWord: string;

    constructor() {
        this.currentTopic = this.topics[Math.floor(Math.random() * this.topics.length)];
        this.words = this.currentTopic.words;
        this.chooseWord();
    }

    answer(answer: string, player: string): void {
        const teamNumber: number = this.teams.findIndex(i => i.hasPlayer(player));
        this.teams[teamNumber].setAnswer(answer);
    }

    async endRound(): Promise<any> {
        let answers: string[] = [];
        for (let team of this.teams)
            answers.push(team.getCurrentAnswer());

        this.chooseWord();
        const score = await Trends.getDifference(answers, this.teams.length);
        const result = {answers: answers, score: score};

        for (let i = 0; i < this.teams.length; i++){
            this.teams[i].addScore(score[i]);
            this.teams[i].setAnswer('');
        }

        return result;
    }

    private chooseWord(): void {
        //get a random word from the current topic and remove it from the array to avoid duplicates
        let randInt = Math.floor(Math.random() * this.words.length);

        this.currentWord = this.words[randInt];
        this.words.splice(randInt, 1);
    }

    getCurrentWord(): string {
        return this.currentWord;
    }

    joinGame(players: string[][]): void {
        for (let i = 0; i < players.length; i++)
            this.teams[i].addPlayers(players[i]);
    }

    getTopic(): any {
        return this.currentTopic;
    }

    getPlayers(): Team[] {
        return this.teams;
    }
}