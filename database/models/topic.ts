import {Model, Schema, model} from 'mongoose';
import {ITerm} from "./term";

export interface ITopic {
    name: string,
    description: string,
    terms: ITerm[]
}

interface ITopicModel extends Model<ITopic> {
}

const schema = new Schema<ITopic>(
    {
        name: {type: String, required: true},
        description: {type: String, required: false},
        terms: [{type: Schema.Types.ObjectId, ref: 'Term', required: true}]
    },
    {discriminatorKey: 'topic'}
);

const Topic: ITopicModel = model<ITopic, ITopicModel>('Topic', schema);

export default Topic;
