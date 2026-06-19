import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME_HERE',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY_HERE',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET_HERE',
});

export default cloudinary;
