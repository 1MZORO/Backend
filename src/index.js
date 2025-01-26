import connectToDatabase from "./db/conn.js";
import {app} from "./app.js";
connectToDatabase().then(
    ()=>{
        app.on("error", (err) => {
            console.error("error occur while connecting to db", err);
        });
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server started at port ${process.env.PORT || 3000}`);
        });
    }
).catch((err) => console.log("Error connecting to database", err));