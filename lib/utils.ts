/**
 * Extracts the YouTube Video ID from various YouTube URL formats.
 * Supports standard watch URLs, youtu.be, shorts, and live URLs.
 */
export const getYouTubeId = (url: string) => {
  if (!url) return null;
  
  // Robust regex for various YouTube URL formats
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  
  if (match) return match[1];
  
  // Fallback for 11-char IDs provided directly
  return url.length === 11 ? url : null;
};

/**
 * Resolves an image path to a valid URL.
 * Handles:
 * 1. Full URLs (http/https)
 * 2. Absolute paths (/...)
 * 3. Relative paths (image.jpg -> /projects/image.jpg)
 * 4. Sub-folder paths (projects/image.jpg -> /projects/image.jpg)
 */
export const resolveImageUrl = (path: string | null | undefined) => {
  if (!path) return "/projects/image1.png";
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;
  if (path.startsWith('/')) return path;
  
  // Handle paths that might be stored as "projects/image.jpg"
  if (path.startsWith('projects/')) return `/${path}`;
  
  // Default to projects folder for simple filenames
  return `/projects/${path}`;
};
