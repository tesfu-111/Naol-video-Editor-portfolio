import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ChevronDown, Sparkles, Play, ArrowRight, Camera, Upload, Check, Video } from 'lucide-react';

interface HeroSectionProps {
  onExploreWork: () => void;
  onWorkTogether: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreWork, onWorkTogether }) => {
  const { settings, isAdmin, updateSettings, uploadFile } = usePortfolio();
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const showVideo =
    settings.heroBgMode === 'video' &&
    !!settings.heroVideoUrl &&
    !videoFailed &&
    !prefersReducedMotion;

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#15171C]">
      {/* BACKGROUND MEDIA CONTAINER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Always present fallback image (used in Image mode OR when video is loading/fails/reduced-motion) */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 ${
            showVideo && videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url("${settings.heroImageUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=2000&q=80'}")`,
          }}
        />

        {/* Video Mode background */}
        {settings.heroBgMode === 'video' && settings.heroVideoUrl && !prefersReducedMotion && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => {
              setVideoFailed(true);
              setVideoLoaded(false);
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* High-End Dark Gradient Overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15171C] via-[#15171C]/65 to-[#15171C]/75" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#15171C]/40 to-[#15171C]/90" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 text-center text-white sm:px-8">
        {/* Modern Label Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-[#B9F45A] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B9F45A]">
            Available for Select Projects
          </span>
          <span className="text-white/30">•</span>
          <span className="text-xs text-[#D0D4DF]">Commercial & Creator Work</span>
        </div>

        {/* Oversized Editorial Headline */}
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-balance">
          {settings.heroHeadline || 'I Turn Raw Footage Into Powerful Stories.'}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl font-normal text-[#C5CAD4] leading-relaxed">
          {settings.heroSubtitle || 'Video Editor | Cinematic Storytelling | Motion Graphics.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onExploreWork}
            className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-[#635BFF] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#635BFF]/30 transition-all hover:bg-[#5248e5] hover:scale-105 active:scale-95 sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
            <span>{settings.primaryBtnText || 'Explore My Work'}</span>
          </button>

          <button
            onClick={onWorkTogether}
            className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/40 active:scale-95 sm:w-auto"
          >
            <span>{settings.secondaryBtnText || "Let's Work Together"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#B9F45A]" />
          </button>
        </div>

        {/* Current Active Background Mode pill badge & Quick Admin Switcher */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 text-xs rounded-full bg-black/50 border border-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="text-[#A0A4AE]">Active Mode:</span>
            <span className="font-mono text-[#B9F45A] font-bold uppercase tracking-wider">
              {settings.heroBgMode === 'video' ? 'Looped Video' : 'Photo / Portrait'}
            </span>
          </div>

          {/* Admin Direct Photo & Mode Quick Controls */}
          

          {uploadMessage && (
            <div className="text-xs font-semibold text-[#B9F45A] bg-[#B9F45A]/20 border border-[#B9F45A]/40 px-3 py-1 rounded-lg animate-in fade-in">
              {uploadMessage}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={onExploreWork}
        aria-label="Scroll down to work"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A4AE]">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#B9F45A]" />
      </button>
    </section>
  );
};
