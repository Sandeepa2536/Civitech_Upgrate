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
