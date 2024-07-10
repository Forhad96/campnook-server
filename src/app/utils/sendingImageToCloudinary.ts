import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs/promises';
    // Configuration
    cloudinary.config({
      cloud_name: 'dzubr705q',
      api_key: '957641958718868',
      api_secret: 'rcfbqPZdr1ROM2QzP3y8Yl6TdiE', // Click 'View Credentials' below to copy your API secret
    });


const sendingImageToCloudinary = async (imageName: string, path: string) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });
    console.log(uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(imageName, {
      fetch_format: 'auto',
      quality: 'auto',
    });
    console.log(optimizeUrl);

    // after uploading delete the upload file
    deleteFile(path)
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(imageName, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });
    console.log(autoCropUrl);

    // Return the results
    return {
      uploadResult,
      optimizeUrl,
      autoCropUrl,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export default sendingImageToCloudinary;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });



async function deleteFile(filePath:string) {
  try {
    await fs.unlink(filePath);
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
}