const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadoncloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) {
            throw new Error('No file path provided');
        }
        const result = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto', // Automatically detect the resource type
        });
        //file has been uploaded to cloudinary
        console.log('File uploaded successfully and unlinked successfully now');
                fs.unlinkSync(localfilepath);
        return result;
    } catch (error) { 
        console.error('Error uploading file to Cloudinary:', error);
        fs.unlinkSync(localfilepath); // remove the temprory saved file from local storage as operation failed
        return null;
    }
}

module.exports = {
    uploadoncloudinary
};