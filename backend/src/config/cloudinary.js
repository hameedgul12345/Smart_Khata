import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simple upload function using buffer
export const uploadOnCloudinary = (fileBuffer) => {
  if (!fileBuffer) throw new Error("File buffer is required for upload");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "profiles" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export default cloudinary;
