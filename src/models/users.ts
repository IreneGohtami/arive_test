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
    name: { type: String, required: true },
    hobbies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "hobbies"
    }]
};

export const UserSchema = new mongoose.Schema(definition, options);

export default mongoose.model('users', UserSchema);