// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";
// const app = express();
// (async()=>{
//     try{
//     await mongoose.connect(`${process.env.MONGOOSE_URI}/${DB_NAME}`);
//     app.on("error",(err)=>{
//         console.error(err)
//     })
//     app.listen(process.env.PORT,()=>{
//         console.log(`Server is running on port ${process.env.PORT}`)
//     })
//     } catch(e){
//         console.error(e);
//         throw e;
//     }
// })();


import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";

const app = express();

const connectToDatabase = async () => {
    console.log(process.env.MONGOOSE_URI)
    try {
        await mongoose.connect(`${process.env.MONGOOSE_URI}/${DB_NAME}`);
        console.log("Connected to the database");
    } catch (e) {
        console.error("Database connection error:", e);
        throw e;
    }
};

const startServer = () => {
    app.on("error", (err) => {
        console.error("Server error:", err);
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

(async () => {
    await connectToDatabase();
    startServer();
})();