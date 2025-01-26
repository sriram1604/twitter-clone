import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectionDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDb is connected");
        
    }catch(err){
        console.log(`error in connecting db : ${err}`);
        process.exit(1);
    }
} 

export default connectionDB