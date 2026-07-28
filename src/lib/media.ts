import { env } from './env';

/**
 * Utility to convert local or database media paths into Cloudinary CDN URLs.
 * 
 * Configured Cloudinary Cloud Name: dtlp3p1sa
 * 
 * Supports:
 * - Direct HTTP / HTTPS URLs (returns unchanged)
 * - Base64 data strings (returns unchanged)
 * - Relative paths like "/public/dog-data-img/affenpinscher.jpg" -> "https://res.cloudinary.com/dtlp3p1sa/image/upload/public/dog-data-img/affenpinscher.jpg"
 * - Relative paths like "uploads/my-dog.jpg" -> "https://res.cloudinary.com/dtlp3p1sa/image/upload/uploads/my-dog.jpg"
 */
export function getCloudinaryUrl(mediaPath?: string): string | undefined {
  if (!mediaPath) return undefined;
  
  // If already a full URL or data URI, return as-is
  if (/^(https?:\/\/|data:|blob:)/i.test(mediaPath)) {
    return mediaPath;
  }

  const cloudName = env.cloudinaryCloudName || 'dtlp3p1sa';
  
  // Normalize windows backslashes and strip leading slashes
  const cleanPath = mediaPath.replace(/\\/g, '/').replace(/^\/+/, '');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
}

export function mediaUrl(mediaPath?: string): string | undefined {
  return getCloudinaryUrl(mediaPath);
}
