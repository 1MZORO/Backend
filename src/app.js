import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    limit: "12kb",
}));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes
import user from "./routes/user.router.js";

// using routes

app.use("/api/v1/users",user)
//app.use("/login",userRouter)
export {app};