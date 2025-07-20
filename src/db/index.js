import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

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