import mongoose from "mongoose";
import User from "./models/user";

export class DBmanager {
    constructor() {
        DBmanager.connect();
    }

    private static async connect() {
        await mongoose.connect(process.env.MONGO_URL, {
            keepAlive: true
        })
    }

    public async addUser(tag: string, won: boolean, highScore: number) {
        const user = await new User({
            tag: tag,
            gamesPlayed: 1,
            gamesWon: 0,
            gamesLost: 0,
            highestScore: highScore
        });

        won ? user.gamesWon++ : user.gamesLost++;

        await user.save();
    }
}