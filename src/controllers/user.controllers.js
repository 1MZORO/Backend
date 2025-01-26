import {asyncHandler} from "../utils/asynchandler.js";
import { apiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiresponse.js";

const accessAndRefreshTokenGenrator = async(userId) => {
    try{
        const user = User.findById(userId)
        const accessToken = user.generateAccessTocken()
        const refreshToken = user.generateRefreshTocken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
        return {accessToken,refreshToken}
    }catch(e){
        throw new apiError(500,"something went wrong while generating refresh and access token")
    }

}
const registerUser = asyncHandler(async (req,res) => {
    const {fullName, email ,username, password } = req.body
    console.log("email ",email)
    if([fullName, email ,username, password].some((fields)=> fields?.trim() === "")){
            throw new apiError(400,"All fields are required")
        }
        const existedUser = await User.findOne({
            $or:[
                {email},
                {username}
            ]
        })
    if(existedUser){
        throw new apiError(409,"User already existed")
    }
    console.log("Existed user ",existedUser)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("ALP ",avatarLocalPath)
    // console.log("req.file ",req.files)
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar is required")
    }

    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    console.log("Cloud url avatar ",avatar)
    if(!avatar){
        throw new apiError(400,"Avatar upload failed & it required !!")
    }
    const user = await User.create({
        fullName,
        email,
        username : username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })
    console.log("user created ",user)
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(500,"User registration failed")
    }

    return res.status(201).json(
        new apiResponse(201,"User Registered Successfully",createdUser)
    )
})

const  loginUser = asyncHandler( async (req,res) => {
    const {username , email , password} = res.body
    if(!(username || email)){
        throw new apiError(400,"Username or Email is required")
    }

    const user = await User.findById({
       $or: [
            {username},
            {email}
        ]
    })

    if(!user){
        throw new apiError(404,"User not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401,"Password Incorrect ")
    }

    const {accessToken,refreshToken} = accessAndRefreshTokenGenrator(user._id)

    const loggedInUser = await User.findById(user._id).select("-passowrd -refreshToken")

    const option = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken.option)
    .json(
        new apiResponse(
            200,
            "Logged In Successful",
            {
                user: loggedInUser,accessToken,refreshToken
            }
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            },
            
        },{
            new:true
        }
    )  

    const option = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",option).clearCookie("refreshToken",option).json(
        new apiResponse(201,"Logout Successfully !!",{})
    )
})
export {registerUser , loginUser , logoutUser};