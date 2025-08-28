import dotenv from 'dotenv'

//require('dotenv').config({path: './env'})

//but the above line ruins the consistency of our code
//it is not wrong, it will work but not consistent

import connectDB from './db/index.js'

dotenv.config({
    path: './env'
})


// in professional codebases we usually see that whenever an async method is used 
// it returns a promise
connectDB()
.then(() => {

; async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error', (error) => {
            console.log("Our application is not able to talk with the DB", error);
            throw error

        //many a times we see listeners if importing app via express
        //sometimes even if DB is connected maybe express is still not working
        //then app via express throws an error to tell there is something wrong
        })

        //we listen to start the server after connected to MongoDB
        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server is running at port: ${process.env.PORT}`);
        })
    }catch(error){
        console.error("ERROR", error)
        throw error
    }}
})
.catch((error) => {
    console.log("MONGODB connection failed !!!", error)
})


//an async code was written for db
//every async function returns a promise




//make sure to download the env variables at the initial state itself
// as early as possible so that as our application loads we want all out env var to load
// therefore, we require dotenv













// import express from 'express'
// const app = express()

// ;( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error', (error) => {
//             console.log("ERROR", error);
//             throw error
//         })

//         //many a times we see listeners if importing app via express
//         //sometimes even if DB is connected maybe express is still not working
//         //then app via express throws an error to tell there is something wrong

//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port ${process.env.PORT}`);
//         })
//     }catch(error){
//         console.log("ERROR", error)
//         throw err
//     }
// }) ()