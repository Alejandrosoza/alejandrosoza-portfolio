import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const CLOUDINARY_FOLDERS = {
  photos: "alejandrosoza/photos",
  thumbnails: "alejandrosoza/thumbnails",
  behindTheScenes: "alejandrosoza/behind-the-scenes",
  cv: "alejandrosoza/documents",
} as const;

export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const { width = 1200, height, quality = 80 } = options || {};
  const transforms = [
    `f_auto`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    "c_limit",
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
