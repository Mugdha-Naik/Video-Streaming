import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'

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

export {registerUser};