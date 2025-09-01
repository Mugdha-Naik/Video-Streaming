import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './db/index.js'
import { app } from './app.js'

dotenv.config({
    path: './env'
})

// Connect to MongoDB first
connectDB()
.then(() => {
    // Start the server after successful DB connection
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    })
})
.catch((error) => {
    console.log("MONGODB connection failed !!!", error)
})

// Handle app errors
app.on('error', (error) => {
    console.log("Our application is not able to talk with the DB", error);
    throw error
})