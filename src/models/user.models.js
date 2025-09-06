import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'

import bcrypt from "bcrypt";

// jwt is a bearer token
// whoever has the token can acces data

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, ' username is required '],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
            // to enable any field in DB we use index: true
            // there are other ways too, but this is optimized
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            trim: true,
            unique: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: [true, 'Please enter your fullname'],
            trim: true,
            index: true,
        },
        avatar : {
            type: String,       // coludinary url
            required: [true, 'Please provide an Avatar before moving ahead'],
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
        
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

// JUST before the DB has been saved, execute this middleware
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();       
})

userSchema.methods.isPasswordCorrect = async function(password){
    // it compares 2 password, user given and encrypted
                  // user given, encrypted
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )      // sign method generates tokens
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);