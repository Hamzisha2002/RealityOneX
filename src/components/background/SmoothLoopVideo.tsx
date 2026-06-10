import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SmoothLoopVideoProps {
  src: string;
  className?: string;
  overlay?: React.ReactNode;
  crossfadeSeconds?: number;
  dimPulse?: boolean;
  startOffsetSeconds?: number;
  endOffsetSeconds?: number;
}

export const SmoothLoopVideo = ({
  src,
  className,
  overlay,
  crossfadeSeconds = 1.8,
  dimPulse = true,
  startOffsetSeconds = 0.25,
  endOffsetSeconds = 0.9,
}: SmoothLoopVideoProps) => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<0 | 1>(0);
  const swappingRef = useRef(false);
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const getVideos = useCallback(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    return videoA && videoB ? ([videoA, videoB] as const) : null;
  }, []);

  useEffect(() => {
    const videos = getVideos();
    if (!videos) return;

    const [videoA, videoB] = videos;
    let frameId = 0;
    let resetTimer = 0;

    const play = (video: HTMLVideoElement) => video.play().catch(() => {
      // Browser may delay autoplay until user interaction.
    });

    const prepareVideo = (video: HTMLVideoElement) => {
      const safeDuration = video.duration || 1;
      const seekTo = Math.min(startOffsetSeconds, Math.max(safeDuration - 0.1, 0));
      video.currentTime = seekTo;
    };

    const startLoopSwap = () => {
      if (swappingRef.current || document.hidden) return;

      const current = videos[activeRef.current];
      const duration = current.duration;
      if (!duration || Number.isNaN(duration)) return;

      const fadeStartAt = Math.max(duration - endOffsetSeconds - crossfadeSeconds, startOffsetSeconds + 0.5);
      if (current.currentTime < fadeStartAt) return;

      swappingRef.current = true;
      const nextIndex = activeRef.current === 0 ? 1 : 0;
      const next = videos[nextIndex];
      prepareVideo(next);
      void play(next);

      window.setTimeout(() => {
        activeRef.current = nextIndex;
        setActiveVideo(nextIndex);
      }, 80);

      resetTimer = window.setTimeout(() => {
        current.pause();
        prepareVideo(current);
        swappingRef.current = false;
      }, crossfadeSeconds * 1000 + 260);
    };

    const tick = () => {
      startLoopSwap();
      frameId = window.requestAnimationFrame(tick);
    };

    const handleLoaded = () => setIsLoaded(true);
    const handleEnded = () => {
      const current = videos[activeRef.current];
      prepareVideo(current);
      void play(current);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        videoA.pause();
        videoB.pause();
        window.cancelAnimationFrame(frameId);
      } else {
        void play(videos[activeRef.current]);
        frameId = window.requestAnimationFrame(tick);
      }
    };

    videoA.addEventListener('loadeddata', handleLoaded);
    videoB.addEventListener('loadeddata', handleLoaded);
    videoA.addEventListener('ended', handleEnded);
    videoB.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibility);

    prepareVideo(videoA);
    prepareVideo(videoB);
    void play(videoA);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(resetTimer);
      videoA.removeEventListener('loadeddata', handleLoaded);
      videoB.removeEventListener('loadeddata', handleLoaded);
      videoA.removeEventListener('ended', handleEnded);
      videoB.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [crossfadeSeconds, endOffsetSeconds, getVideos, startOffsetSeconds]);

  const videoClass = 'absolute inset-0 h-full w-full object-cover will-change-opacity [backface-visibility:hidden] [transform:translateZ(0)]';

  return (
    <div
      className={cn('absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none', className)}
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 700ms ease-out' }}
      aria-hidden="true"
    >
      <video
        ref={videoARef}
        className={videoClass}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{ opacity: activeVideo === 0 ? 1 : 0, transition: `opacity ${crossfadeSeconds}s linear` }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        className={videoClass}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{ opacity: activeVideo === 1 ? 1 : 0, transition: `opacity ${crossfadeSeconds}s linear` }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {dimPulse && <div className="absolute inset-0 animate-[videoPulse_16s_ease-in-out_infinite] bg-transparent" />}
      {overlay}
    </div>
  );
};
