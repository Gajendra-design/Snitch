import mongoose from 'mongoose'
import { config } from './env.js';

export const connectDb = async ()=>{
    await mongoose.connect(config.MONGO_URL)
    console.log('mongo DB connected successfully');
    
}