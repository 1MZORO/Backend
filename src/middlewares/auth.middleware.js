import {asyncHandler} from "../utils/asynchandler.js";
import { apiError } from "../utils/apierror.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const jwtVerify = asyncHandler(async (res,req,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new apiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new apiError(401, "Invalid Access Token")
        }

        req.user = user
        next()
    }catch(error){
        throw new apiError(401, error?.message || "Invalid access token")
    }
})
