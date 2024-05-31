import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'; 
// 'fs' is file system that help to read write on the file. mainly we need a file path.

// In our file system our file are linked or unlinked
// Linked means attached and Unlinked means delete the files
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnClodinary = async (loaclFilePath) => {
   try{
     if(!loaclFilePath) return null;
     // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(loaclFilePath, {
        resource_type: "auto"
     })
     fs.unlinkSync(loaclFilePath)
     return response
   }catch(error){
     fs.unlinkSync(loaclFilePath) // remove the locally saved temporary file as the upload operation got failed
     return null;
   }
}

export { uploadOnClodinary }