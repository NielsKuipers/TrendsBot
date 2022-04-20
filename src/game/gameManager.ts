import {Game} from "./game";

export class GameManager {
    private static gameInstance: Game;

    static getGameInstance() {
        return this.gameInstance;
    }

    static setGameInstance(instance: Game) {
        GameManager.gameInstance = instance;
        return this.gameInstance;
    }

}