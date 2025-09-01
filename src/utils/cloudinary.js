import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath){
            console.log("No local file path provided");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("Local file does not exist:", localFilePath);
            return null;
        }

        // Check cloudinary configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            // console.log("Cloudinary configuration missing. Please check your environment variables.");

            // sync matlab remove the file then move ahead
            // async means background me file remove hoti jayegi
            fs.unlinkSync(localFilePath)
            return response;
        }

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        return response;
    }catch(error){
        console.error("Cloudinary upload error:", error);
        // Only try to delete file if it exists
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);       // remove the locally saved temporary file as the upload operation got failed
                console.log("Local file deleted after failed upload");
            } catch (deleteError) {
                console.error("Error deleting local file:", deleteError);
            }
        }
        return null;
    }
}

export {uploadOnCloudinary}