import env from "@server/app/validate-env";
import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary API Secret:", env.CLOUDINARY_API_SECRET ? "Loaded" : "MISSING!");

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
