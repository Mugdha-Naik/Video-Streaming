import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'


//while connecting DB remember 2 things
//1. use async always bec request when comes takes time
//2. to avoid and check for error always use Try and Catch
// so we know that we need to write all this code again and again 
// to talk with the DB. Therefore, what if we wrapped all this in a utility function
const connectDB = async() =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("MONGODB connection Failed", console.error());
        process.exit(1)

        //instead of throw we will use process here
        //node js gives access of process without even importing it
        //read about it
        //clg connectioInstance!!!!!!1!!!!!!!!!!!!!!

    }
}

export default connectDB