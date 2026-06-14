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

/**
 * Re-optimizes a stored Cloudinary image. Accepts either a bare public ID
 * or a full Cloudinary delivery URL (extracting the public ID from it).
 */
export function getOptimizedImageUrl(
  url: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (!url) return "";
  const match = url.match(/\/upload\/(?:[a-z0-9_,.]+\/)?(?:v\d+\/)?(.+)$/i);
  const publicId = match ? match[1] : url;
  return getCloudinaryUrl(publicId, options);
}
