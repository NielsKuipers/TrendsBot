import {Trends} from "./trends";

export class Game {
    private answer1: string = '';
    private answer2: string = '';
    private players: string [][];

    //TODO: change topics from from database :)
    private halloween = {name: 'Halloween', words: ['pumpkin', 'candy', 'killer']};
    private cars = {name: 'Cars', words: ['wheel', 'engine', 'door']};
    private topics = [this.halloween, this.cars];
    private readonly currentTopic: any;
    private readonly words: string[];
    private currentWord: string;

    constructor() {
        this.players = [[], []];
        this.currentTopic = this.topics[Math.floor(Math.random() * this.topics.length)];
        this.words = this.currentTopic.words;
        this.chooseWord();
    }

    answer(answer: string, player: string): void {
        const number: number = this.players.findIndex(i => i.includes(player));

        if (number === 0)
            this.answer1 = answer;
        else
            this.answer2 = answer;
    }

    async endRound(): Promise<any> {
        this.chooseWord();
        const score = await Trends.getDifference(this.answer1, this.answer2);
        const result = {answers: [this.answer1.slice(), this.answer2.slice()], score: score};

        this.answer1 = this.answer2 = '';
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
        this.players = players;
    }

    getTopic(): any {
        return this.currentTopic;
    }
}