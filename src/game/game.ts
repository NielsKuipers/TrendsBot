import {Trends} from "./trends";
import {Team} from "./team";
import Topic, {ITopic} from "../../database/models/topic";
import {ITerm} from "../../database/models/term";
import {GameState} from "./gameStates";
import {TextChannel} from "discord.js";
import {Messages} from "../ui/messages";
import {Timer} from "../ui/timer";
import {setTimeout} from "timers/promises";
import {GameManager} from "./gameManager";

require('../../database/models/term');

export class Game {
    private teams: Team[];
    private topics: ITopic[];
    private currentTopic: ITopic;
    private words: ITerm[];
    private currentWord: string;
    private currentState: GameState;
    private answerTime = 5000;
    private breakTime = 3000;
    private dbManager = GameManager.getDBInstance();

    constructor() {
        this.teams = [];
    }

    async startGame(players: Team[], interaction){
        await this.loadTopics();
        this.teams = players;
        this.runGame(interaction.channel);
    }

    async runGame(channel: TextChannel) {
        const topic: ITopic = this.currentTopic;
        let round = 1;
        const totalRounds = this.currentTopic.terms.length + 1;

        while (this.getState() !== GameState.NOT_PLAYING) {
            this.setState(GameState.IN_ROUND);
            const word = this.getCurrentWord();

            //create embed with current round and chosen word
            let msg = Messages.createRoundEmbed(round, word, topic.name);
            let curRound = await channel.send({embeds: [msg]})
            Timer.setCountdown(msg, curRound, this.answerTime, 'Round ' + round + ' ends in ');
            await setTimeout(this.answerTime + 1000);

            //show round results
            const results = await this.endRound();
            Messages.showResults(curRound, results, round);
            await setTimeout(5000);

            round++;
            if (round > totalRounds) {
                let finalResults = await Messages.createResultEmbed(round, this.teams, true);
                await channel.send({embeds: [finalResults]});

                const teams = this.teams;
                const highScore = this.getHighestScore();

                for (let i = 0; i < teams.length; i++) {
                    const teamScore = teams[i].getTotalScore();
                    const won = highScore === teamScore;

                    for (let player of teams[i].getPlayers())
                        await this.dbManager.handleUser(player, won, teamScore);
                }

                this.setState(GameState.NOT_PLAYING);
            } else {
                //show total game results and countdown for next round
                this.setState(GameState.BETWEEN_ROUND);
                let breakMsg = await Messages.createResultEmbed(round, this.teams);
                let curRoundResults = await channel.send({embeds: [breakMsg]})
                Timer.setCountdown(breakMsg, curRoundResults, this.breakTime, 'Round ' + round + ' starts in ');
                await setTimeout(this.breakTime + 1000);
            }
        }
    }

    answer(answer: string, player: string): void {
        const teamNumber: number = this.teams.findIndex(i => i.hasPlayer(player));
        this.teams[teamNumber].setAnswer(answer);
    }

    async endRound(): Promise<any> {
        let answers: string[] = [];
        for (let team of this.teams)
            answers.push(team.getCurrentAnswer());

        if (!this.words || this.words.length !== 0)
            this.chooseWord();

        const score = await Trends.getDifference([...answers], this.teams.length);
        const result = {answers: answers, score: score};

        for (let i = 0; i < this.teams.length; i++) {
            this.teams[i].addScore(score[i]);
            this.teams[i].setAnswer('');
        }

        return result;
    }

    private chooseWord(): void {
        //get a random word from the current topic and remove it from the array to avoid duplicates
        let randInt = Math.floor(Math.random() * this.words.length);

        this.currentWord = this.words[randInt].term;
        this.words.splice(randInt, 1);
    }

    getCurrentWord(): string {
        return this.currentWord;
    }

    getHighestScore(): number {
        let result: number = 0;

        for (let team of this.teams) {
            const score = team.getTotalScore();
            if (score > result) result = score;
        }

        return result;
    }

    async loadTopics() {
        this.topics = await Topic.find().populate('terms');
        this.currentTopic = await this.topics[Math.floor(Math.random() * this.topics.length)];
        this.words = this.currentTopic.terms;
        this.chooseWord();
    }

    getState() {
        return this.currentState;
    }

    setState(state: GameState) {
        this.currentState = state;
    }

    hasPlayer(playerId) {
        for(let team of this.teams) {
            if(team.hasPlayer(playerId))
                return true;
        }

        return false;
    }
}