import {Model, Schema, model} from 'mongoose';

export interface IUser {
    _id: string;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    highestScore: number;
}

interface IUserModel extends Model<IUser> {
}

const schema = new Schema<IUser>(
    {
        _id: {type: String, required: true},
        gamesPlayed: {type: Number, required: true},
        gamesWon: {type: Number, required: true},
        gamesLost: {type: Number, required: true},
        highestScore: {type: Number, required: true},
    },
    {discriminatorKey: 'user'}
);

const User: IUserModel = model<IUser, IUserModel>('User', schema);

export default User;