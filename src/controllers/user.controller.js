import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'
import {jwt} from 'jsonwebtoken'
import { use } from 'bcrypt/promises.js'

// creating a method for generating access and refresh tokens

const generateAccessAndRefreshTokens = async(userId) =>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // we need to save refreshToken in the DB so that user does not have to login multiple again and again
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});     // save is a method in mongoDB

        // now we have 2 things refrence of refresh and access token and refresh token saved in DB
        // return them for below algorithm
        return {accessToken, refreshToken};

    }catch(error){
        throw new apiError(500, 'Something went wrong while generating access and refresh tokens');
    }
}

// asyncHandler is our higher order function that accepts a function
const registerUser = asyncHandler( async(req, res) => {
    // STEP 1) get user details from frontend
    // STEP 2) validation - not empty should be checked atleast, followed by others if needed
    // STEP 3) check if user already exists - using username, email
    // STEP 4) check for files, images - here avatar (required)
    // STEP 5) upload them to cloudinary, check for avatar again if uploaded correctly
    // STEP 6) create a user object - create entry in db
    // STEP 7) remove password and refresh token field from response
    // STEP 8) check for user creation - if null or created successfully
    // STEP 9) if user is created successfully -  return res 
    // STEP 10) if user not created successfully - return error

    // STEP 1) get user details from frontend
    const {fullname, email, username, password} = req.body
    
    
    // if(fullname === ""){
    //     throw new apiError(400, "fullname is required")
    // }

    // but this above syntax becomes hard if there are a lot of fields to check
    // therefore we use logic

    // STEP 2) validation - not empty should be checked atleast, followed by others if needed

    if( 
        [fullname, email, username, password].some((field) => typeof field !== "string" || field.trim() === "")
    ){
        throw new apiError(400, "All fields are required");
    }

    // STEP 3) check if user already exists - using username, email

    const exstingUser = await User.findOne({
        $or: [{username}, {email}]
        // $or is used to check, if username and email matches if yes it returns that existingUser
    })

    if(exstingUser){
        throw new apiError(409, "User with your username and email already exists");
    }
    console.log(req.files);

    // STEP 4) check for files, images - here avatar (required)

    const avatarLocalPath = req.files?.avatar[0]?.path 
    // console.log(req.files?.avatar[0]?.path)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is required...");
    }

    // STEP 5) upload them to cloudinary, check for avatar again if uploaded correctly

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new apiError(400, "Avatar file is required... ");
    }

    // STEP 6) create a user object - create entry in db

    const user = await User.create({
        fullname,
        avatar: avatar.url,

        // a corner case
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // STEP 7) remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        // yaha hum wo likhenge jo jo nahi chahiye
        // - represents minus
        "-password -refreshToken"
    )

    // STEP 9) if user is created successfully - return res 

    if(!createdUser){
        throw new apiError(500, "something went wrong while registering the user");
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user registered...")
    )
}) 

// now we make our login
const loginUser = asyncHandler(async (req, res) => {

    //ALGORITHM 

    // req body se data le aao
    // check for if email and username exists
    // find the user 
    // if the user is found, check their password
    // if password wrong -> password wrong print
    // if password correct -> then we need to generate access and refresh token
    // send these tokens in cookies (secure cookies)
    // send response to the that successfully logged in

    // we dont know that what the user has sent currently for logging in
    // email username or password -> so taking all three now to check

    // yaha hum wo likhenge jisse hum login karwana chahte hai
    const {email, username, password} = req.body
    console.log(email);

    // if we want both username and email, but if any of them is missing we throw error
    if(!username && !email){
        throw new apiError(400, 'username and email is required');
    }

    // Here is an alternative of above code based on logic if we need either username or email 
    // if(!(username || email)){
        // throw new ApiError(400, "either username or email is required")
    //}

    // to find value of the user, if matches with username or password
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    // if the User does not match with email and username
    
    if(!user){
        throw new apiError(400, "user does not exist");
    }

    // if user found

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401, 'Invalid user credentials');
    }

    // if password correct -> then we need to generate access and refresh token
    // get this below var from above that we created to get refresh and access token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    

    // send these tokens in cookies (secure cookies)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // send the other information other than password and refreshToken to the user

    // cookies can only be modified by the server, not on the frontend part
    // they are only visible in frontend
    const options = {
        httpOnly: true,
        secure: true,
    }
    //.cookie(key, value)
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(

            // didnt understand -> check apiResponse file
            200, {
                user: loggedInUser,accessToken,
                refreshToken
            },
            "User logged in successfully" 
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {

    //ALGORITHM
    // 1. remove cookies and refreshToken

    // but there is a problem:
    // in the loginUser method we had the access of the user refreshToken
    // but after that method the access is gone too
    // to have the access of the refreshToken we needed email, username, password
    // but when the user wants to logout why you will tell the user to enter username, password, and email again
    // therefore, we create a custom middleware for accessing that


    // now we have used our custom middleware and updated our req with new req.user
    // this user has the reference of the refreshToken as well now
    await User.findByIdAndUpdate(
        req.user._id,
        {
        $set: {
            refreshToken: undefined,    // remove refreshToken
        }
    },
    {
        
        new: true,
        
    }
    ) 

    // clear cookies now
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"))
     
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "unauthorized request or refresh token expired");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, //token
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user =await User.findById(decodedToken?._id)
    
        if(!user){
            throw new apiError(401, "invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401,"Refresh Token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("access token", accessToken, options)
        .cookie("refresh token", newrefreshToken)
        .json(
            new apiResponse(
                200,
                {accessToken, refreshToken : newrefreshToken},
                "access token refreshed"
            )
        )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token");
    }

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};