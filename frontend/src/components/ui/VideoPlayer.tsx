'use client';
import { useState, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  onEnded?: () => void;
}

export default function VideoPlayer({ videoUrl, title, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(pct);
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const pct = Number(e.target.value);
    videoRef.current.currentTime = (pct / 100) * videoRef.current.duration;
    setProgress(pct);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = Number(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Check if it's a Cloudinary video URL or a YouTube URL
  const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  if (isYoutube) {
    const videoId = getYoutubeId(videoUrl);
    return (
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  return (
    <div
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => { setIsPlaying(false); onEnded?.(); }}
        onClick={togglePlay}
      />

      {/* Overlay controls */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Play/Pause big button */}
        <button onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center focus:outline-none">
          {!isPlaying && (
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
              <svg className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </button>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {title && <p className="text-slate-900 text-sm font-medium truncate">{title}</p>}
          {/* Seek bar */}
          <input
            type="range" min={0} max={100} value={progress}
            onChange={handleSeek}
            className="w-full h-1 accent-indigo-500 cursor-pointer"
            id="video-seek-bar"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-slate-900 hover:text-violet-600 transition-colors" id="video-play-btn">
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input type="range" min={0} max={1} step={0.1} value={volume}
                  onChange={handleVolume}
                  className="w-20 h-1 accent-indigo-500 cursor-pointer"
                  id="video-volume-bar"
                />
              </div>
              <span className="text-slate-600 text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <button onClick={toggleFullscreen} className="text-slate-600 hover:text-slate-900 transition-colors" id="video-fullscreen-btn">
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
