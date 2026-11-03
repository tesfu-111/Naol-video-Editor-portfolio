import { VideoType } from '../types';

export interface VideoInfo {
  type: VideoType;
  embedUrl: string | null;
  directUrl: string | null;
  isValid: boolean;
  driveId?: string;
}

export function parseVideoSource(url: string | undefined | null): VideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'mp4', embedUrl: null, directUrl: null, isValid: false };
  }

  const trimmed = url.trim();

  // 1. YouTube
  const ytMatch =
    trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/) ||
    trimmed.match(/^[a-zA-Z0-9_-]{11}$/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      directUrl: null,
      isValid: true,
    };
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]{6,12})/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`,
      directUrl: null,
      isValid: true,
    };
  }

  // 3. Google Drive
  const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const driveId = driveMatch[1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      directUrl: null,
      driveId,
      isValid: true,
    };
  }

  // 4. Direct Uploads & MP4 / WebM / Quicktime
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('blob:') ||
    /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(trimmed) ||
    trimmed.includes('firebasestorage.googleapis.com') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return {
      type: trimmed.startsWith('/uploads/') ? 'direct' : 'mp4',
      embedUrl: null,
      directUrl: trimmed,
      isValid: true,
    };
  }

  return {
    type: 'mp4',
    embedUrl: null,
    directUrl: trimmed,
    isValid: true,
  };
}
