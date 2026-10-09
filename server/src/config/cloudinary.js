// Import Cloudinary v2 using CommonJS
const { v2: cloudinary } = require("cloudinary");

// Configure Cloudinary
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
  console.log("Cloudinary configured successfully.");

  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection successful:", result);
  } catch (error) {
    console.error("Cloudinary connection failed:", error);
  }
};

module.exports = connectCloudinary;
