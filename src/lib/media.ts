import { env } from './env';

/**
 * Utility to convert local or database media paths into Cloudinary CDN URLs.
 * 
 * Configured Cloudinary Cloud Name: dtlp3p1sa
 * 
 * Supports:
 * - Direct HTTP / HTTPS URLs (returns unchanged)
 * - Base64 data strings (returns unchanged)
 * - Relative paths like "dog-data-img/affenpinscher.jpg" -> "https://res.cloudinary.com/dtlp3p1sa/image/upload/dog-data-img/affenpinscher.jpg"
 * - Relative paths like "uploads/dog/my-dog.jpg" -> "https://res.cloudinary.com/dtlp3p1sa/image/upload/uploads/dog/my-dog.jpg"
 * - Backslashes formatting
 * - Duplicate Cloudinary URL prevention
 */
export function getCloudinaryUrl(mediaPath?: string): string | undefined {
  if (!mediaPath) return undefined;

  let clean = mediaPath.replace(/\\/g, '/').trim();

  // Prevent duplicate Cloudinary URLs
  if (clean.includes('res.cloudinary.com')) {
    const matches = clean.match(/(https?:\/\/res\.cloudinary\.com\/[^\/]+\/(?:image|video)\/upload\/)(.+)/i);
    if (matches) {
      const base = matches[1];
      let subPath = matches[2];
      subPath = subPath.replace(/^https?:\/\/res\.cloudinary\.com\/[^\/]+\/(?:image|video)\/upload\//i, '');
      return `${base}${subPath.replace(/^\/+/, '')}`;
    }
    return clean;
  }

  // If already a full URL or data URI, return as-is
  if (/^(https?:\/\/|data:|blob:)/i.test(clean)) {
    return clean;
  }

  const cloudName = env.cloudinaryCloudName;
  if (!cloudName) {
    return clean;
  }

  // Strip leading slashes
  clean = clean.replace(/^\/+/, '');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${clean}`;
}

export function mediaUrl(mediaPath?: string): string | undefined {
  return getCloudinaryUrl(mediaPath);
}
