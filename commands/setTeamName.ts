import {SlashCommandBuilder} from "@discordjs/builders";
import {GameManager} from "../src/game/gameManager";
import {GameState} from "../src/game/gameStates";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setteamname')
        .setDescription("Change your team's name")
        .addStringOption(option => option.setName('teamname').setDescription('Enter your new name!').setRequired(true)),
    game: null,
    async execute(interaction) {
        //get current game
        this.game = GameManager.getGameInstance();

        //check if the game is started/in a round and if the person running the command is participating
        if (this.game == null || this.game.getState() !== GameState.NAMING_TEAMS) {
            interaction.reply({content: 'You cannot name your team right now.', ephemeral: true})
            return;
        } else if (!this.game.hasPlayer(interaction.user.id)) {
            interaction.reply({content: 'You are not participating in this game.', ephemeral: true})
            return;
        }

        let name = interaction.options.getString('teamname');

        this.game.setTeamName(name, interaction.user.id);
        interaction.reply({content: 'Name changed to: ' + name + '!', ephemeral: true})
    }
}
