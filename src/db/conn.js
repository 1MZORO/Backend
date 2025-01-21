import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectToDatabase = async () => {
    try {
        await mongoose.connect(`${process.env.MONGOOSE_URI}/${DB_NAME}`);
        console.log("Mongo DB Connection successful !!");                
    } catch (e){
        console.error("Mongo DB Connection failed !!",e);
        throw e;
    }
}
export default connectToDatabase;