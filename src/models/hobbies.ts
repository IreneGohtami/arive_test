import { string } from 'joi';
import mongoose from 'mongoose';

const options = {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            return ret;
        }
    }
};

const definition = {
    passionLevel: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Very-High'] },
    name: { type: String, required: true },
    year: { type: Number, required: true }
};

export const HobbySchema = new mongoose.Schema(definition, options);

export default mongoose.model('hobbies', HobbySchema);