// it will verify if the user exists or not
// if exits remove refreshTokens

import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

// here we dont use res anywhere that is why _ can also be used here
export const verifyJWT = asyncHandler(async( req, _, next) =>{
    try {
        // we have the access of cookies in the user, bec we used middleware cookieParser earlier
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // for web || for mobile 
    
        if(!token){
            throw new apiError(401, "Unauthorized request...");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
        
        if(!user){
    
            // TODO: discuss about frontend
            throw new apiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token");
    }
} )