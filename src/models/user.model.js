import mongoose from "mongoose";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    })

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bycrypt.hash(this.password,10);
    next(); 
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bycrypt.compare(password,this.password);
}

userSchema.methods.generateAccessTocken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.generateRefreshTocken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

    export const User = mongoose.model("User", userSchema);