import { Router } from "express";
import { registerUser, loginUser, logoutUser} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";

const user = Router()
user.route("/register").post(
  upload.fields([
    {
      name:"avatar",
      maxCount: 1,
    },

    {
      name:"coverImage",
      maxCount:1
    }
  ]), registerUser)
user.route("/login").post(loginUser)
user.route("/logout").post(jwtVerify,logoutUser)
export default user;
