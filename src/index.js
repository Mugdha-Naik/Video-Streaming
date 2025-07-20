import dotenv from 'dotenv'

//require('dotenv').config({path: './env'})

//but the above line ruins the consistency of our code
//it is not wrong, it will work but not consistent

import connectDB from './db/index.js'

dotenv.config({
    path: './env'
})

connectDB()

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