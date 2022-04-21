import {Game} from "./game";
import {DBmanager} from "../../database/dbmanager";
import {Team} from "./team";
import {GameState} from "./gameStates";

export class GameManager {
    private static gameInstance: Game = null;
    private static dbManager: DBmanager;

    static getGameInstance() {
        return this.gameInstance;
    }

    static setGameInstance(instance: Game) {
        GameManager.gameInstance = instance;
    }

    static getDBInstance() {
        return this.dbManager;
    }

    static connectToDb() {
        this.dbManager = new DBmanager();
    }

    static createGame() {
        this.setGameInstance(new Game());
        this.gameInstance.setState(GameState.JOINING);
    }

    static startGame(players: Team[], interaction) {
        this.getGameInstance().startGame(players, interaction);
    }
}