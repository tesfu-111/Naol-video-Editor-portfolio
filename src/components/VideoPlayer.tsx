import React, { useState, useRef } from 'react';
import { parseVideoSource } from '../lib/videoHelper';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  title?: string;
  autoplay?: boolean;
  aspectRatio?: 'video' | 'vertical' | 'cinema';
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  thumbnail,
  title,
  autoplay = false,
  aspectRatio = 'video',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoInfo = parseVideoSource(url);

  const aspectClass =
    aspectRatio === 'vertical'
      ? 'aspect-[9/16] max-w-[380px] mx-auto'
      : aspectRatio === 'cinema'
      ? 'aspect-[2.39/1]'
      : 'aspect-video';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setHasError(true));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If video is embedded (YouTube, Vimeo, Google Drive)
  if (videoInfo.embedUrl) {
    return (
      <div className={`relative w-full overflow-hidden rounded-xl bg-black ${aspectClass} ${className}`}>
        <iframe
          src={videoInfo.embedUrl}
          title={title || 'Portfolio Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
        {videoInfo.type === 'drive' && (
          <div className="absolute bottom-2 right-2 z-10">
            <a
              href={`https://drive.google.com/file/d/${videoInfo.driveId}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-black/80 px-2.5 py-1 text-xs text-white backdrop-blur hover:bg-black"
            >
              <ExternalLink className="h-3 w-3" /> Open in Drive
            </a>
          </div>
        )}
      </div>
    );
  }

  // If Direct / HTML5 video source
  const directSrc = videoInfo.directUrl || url;

  if (hasError) {
    return (
      <div className={`relative flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-[#15171C] p-6 text-center text-white ${aspectClass} ${className}`}>
        <AlertCircle className="mb-2 h-10 w-10 text-red-400" />
        <h4 className="font-medium text-white">Video Playback Unavailable</h4>
        <p className="mt-1 text-xs text-[#737783] max-w-sm">
          The video stream or source file could not be decoded. Please verify file permissions or link formatting.
        </p>
        <a
          href={directSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-medium text-white hover:bg-[#5248e5]"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open Direct Video Link
        </a>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-black ${aspectClass} ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={directSrc}
        poster={thumbnail}
        autoPlay={autoplay}
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onError={() => setHasError(true)}
        onClick={togglePlay}
        className="h-full w-full object-contain cursor-pointer"
      />

      {/* Center Play Overlay when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#635BFF]/90 text-white shadow-2xl backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
        >
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </button>
      )}

      {/* Modern Player Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 transition-opacity duration-200 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Slider */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#635BFF] hover:h-2 transition-all"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-[#B9F45A] transition-colors">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </button>
            <button onClick={toggleMute} className="hover:text-[#B9F45A] transition-colors">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="font-mono text-[11px] text-[#A0A4AE]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {title && <span className="hidden truncate font-medium text-xs md:inline-block max-w-[200px]">{title}</span>}
            <button onClick={toggleFullscreen} className="hover:text-[#B9F45A] transition-colors">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
