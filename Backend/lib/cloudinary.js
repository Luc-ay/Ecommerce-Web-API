import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: proccess.env.CLOUDINARY_API_KEY,
  api_secret: proccess.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
