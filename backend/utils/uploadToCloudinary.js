import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadTicketToCloudinary = async (pdfPath) => {
  const result = await cloudinary.uploader.upload(pdfPath, {
    resource_type: "raw", // important for PDF
    folder: "bus_tickets",
    public_id: path.basename(pdfPath, ".pdf"),
  });
  return result.secure_url;
};
