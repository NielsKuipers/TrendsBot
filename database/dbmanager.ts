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

    public async userExists(id: string): Promise<boolean> {
        const user = await User.countDocuments({_id: id}).limit(1);
        return user === 1;
    }

    public async addUser(tag: string, won: boolean, highScore: number) {
        const user = await new User({
            _id: tag,
            gamesPlayed: 1,
            gamesWon: 0,
            gamesLost: 0,
            highestScore: highScore
        });

        won ? user.gamesWon++ : user.gamesLost++;
        await user.save();
    }

    async updateUser(tag: string, won: boolean, teamScore: number) {
        let user = await User.findById(tag);
        user.gamesPlayed++;
        won ? user.gamesWon++ : user.gamesLost++;
        if (teamScore > user.highestScore) user.highestScore = teamScore;

        await User.updateOne({_id: tag}, user);
    }

    async handleUser(tag: string, won: boolean, teamScore: number) {
        const user = await this.userExists(tag);

        if (!user) await this.addUser(tag, won, teamScore);
        else await this.updateUser(tag, won, teamScore);
    }
}