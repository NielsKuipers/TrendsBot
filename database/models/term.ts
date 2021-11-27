import {Model, Schema, model} from 'mongoose';

export interface ITerm {
    term: string,
}

interface ITermModel extends Model<ITerm> {
}

const schema = new Schema<ITerm>(
    {
        term: {type: String, required: true},
    },
    {discriminatorKey: 'Term'}
);

const Term: ITermModel = model<ITerm, ITermModel>('Term', schema);

export default Term;
