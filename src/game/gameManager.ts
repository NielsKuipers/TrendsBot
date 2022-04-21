import {Game} from "./game";
import {DBmanager} from "../../database/dbmanager";
import {Team} from "./team";
import {setTimeout} from "timers/promises";
import {GameState} from "./gameStates";
import {Interaction} from "discord.js";

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

    static startGame(players: Team[], interaction) {
        this.setGameInstance(new Game());
        this.getGameInstance().startGame(players, interaction);
    }
}