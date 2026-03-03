import { useEffect, useRef, useState } from 'react';

// Shared video instance that spans multiple sections
export const SharedBackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let isSeeking = false;

    // Seamless loop: restart before video ends to prevent visible jump (throttled)
    let lastCheck = 0;
    const handleTimeUpdate = () => {
      if (isSeeking) return;
      
      // Throttle checks to reduce CPU usage (check every 100ms instead of every frame)
      const now = Date.now();
      if (now - lastCheck < 100) return;
      lastCheck = now;
      
      // If video is within 0.1 seconds of the end, seamlessly restart
      if (video.duration && video.currentTime >= video.duration - 0.1) {
        isSeeking = true;
        video.currentTime = 0;
        // Small delay to ensure smooth transition
        setTimeout(() => {
          isSeeking = false;
        }, 50);
      }
    };

    // Fallback: restart instantly when video ends
    const handleEnded = () => {
      if (!isSeeking) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    };

    // Fade-in when metadata is loaded
    const handleLoadedMetadata = () => {
      setIsLoaded(true);
    };

    // Ensure video plays
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Video autoplay prevented:', error);
      });
    }

    // Performance: pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 600ms ease-out',
        animation: isLoaded ? 'videoPulse 14s ease-in-out infinite' : 'none',
        willChange: 'opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <style>{`
        @keyframes videoPulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }
      `}</style>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{ 
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <source src="/videos/bg4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

