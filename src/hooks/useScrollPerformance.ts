import { useEffect } from 'react';

/**
 * Hook to optimize scroll performance globally
 * Adds throttling and performance optimizations
 */
export const useScrollPerformance = () => {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll handling happens here
          // GSAP ScrollTrigger handles its own optimizations
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttle scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimize resize events
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Trigger ScrollTrigger refresh on resize
        if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.refresh();
        }
      }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);
};

