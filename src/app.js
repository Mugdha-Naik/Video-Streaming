import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
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

export {app}