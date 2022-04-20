import {SlashCommandBuilder} from "@discordjs/builders";
import {GameManager} from "../src/game/gameManager";
import {GameState} from "../src/game/gameStates";
import {Game} from "../src/game/game";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('answer')
        .setDescription('Submit an answer')
        .addStringOption(option => option.setName('answer').setDescription('Enter your answer!').setRequired(true)),
    game: null,
    async execute(interaction) {
        //get current game
        this.game = GameManager.getGameInstance();

        //check if the game is started/in a round and if the person answering is participating
        if (this.game == null || this.game.getState() !== GameState.IN_ROUND) {
            interaction.reply({content: 'The game is not currently in a round.', ephemeral: true})
            return;
        } else if (!this.game.hasPlayer(interaction.user.id)) {
            interaction.reply({content: 'You are not participating in this game.', ephemeral: true})
            return;
        }

        const answer: string = interaction.options.getString('answer').toLowerCase();
        let strippedAnswer: string = answer.replace(this.game.getCurrentWord().toLowerCase(), "");

        //check if answer has the given prompt in it
        if (!strippedAnswer || strippedAnswer.trim().length === 0) {
            interaction.reply({
                content: 'Your answer must pair something with ' + this.game.getCurrentWord(),
                ephemeral: true
            })
        } else if (answer.includes(this.game.getCurrentWord().toLowerCase())) {
            confirmAnswer(interaction.options.getString('answer'), interaction.user.id, this.game);
            interaction.reply({content: 'Answer received!', ephemeral: true})
        } else
            interaction.reply({
                content: 'Your answer must include the word ' + this.game.getCurrentWord(),
                ephemeral: true
            })
    }
}

function confirmAnswer(answer: string, player: string, game: Game) {
    game.answer(answer, player);
}
