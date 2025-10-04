import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env');
}

export function connectDB() {
    console.log('Connecting to MongoDB...');
    return mongoose.connect(MONGO_URI);
}

export default connectDB;