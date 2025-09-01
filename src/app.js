import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import multer from 'multer'
//app is a common variable given here
const app =  express()

// app.use => used for middlewares and configuration settings
//on Production level we also define what regions allow this cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true

    //read about this

    //define this CORS_ORIGIN in .env
}))

// data will come from many places in the backend,
// json, url etc. but we dont want to flood our system with so much of json data
// therefore, we put a limit

app.use(express.json({limit: "16kb"}))          // limit for json
app.use(express.urlencoded({extended: true, limit: "16kb"}))        // limit for url
app.use(express.static("public"))               // for static things like files and folders
//static is used to store pdfs, imgs, folders, to store in the server publically
app.use(cookieParser())
//cookie-parser will be used to store and access (CRUD) the cookies of the user's browser

// ROUTES IMPORT......
// import is written by convention at the end of all the above configuration

import userRouter from './routes/user.routes.js'


// ROUTES DECLERATION...
// we used to use app.get() to declare routes earlier, bec we used to define the router there in that file
// by ourselved as well as in that file only we were accessing those routes 
// but if the port is not given there itself, we use middlewares... app.use()
app.use("/api/v1/users/", userRouter);
// the above middleware contains prefix of the router, followed by route in user.router file
// http://localhost:8000/api/v1/users/regsiter

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files uploaded.'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
        });
    }
    
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed!'
        });
    }
    
    return res.status(500).json({
        success: false,
        message: 'Internal server error: ' + err.message
    });
});

export {app}