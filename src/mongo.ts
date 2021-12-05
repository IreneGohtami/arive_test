import { MONGO_URI } from "./config";
import mongoose from "mongoose";

export async function connect() {
    mongoose.Promise = Promise;
    mongoose.connect(MONGO_URI);

    const db = mongoose.connection;

    db.once('open', function callback() {
        console.log('Connection with database succeeded.');
    });
    db.on('error', err => console.error('Error connecting to mongodb', err));
}