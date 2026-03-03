import { useEffect, useRef } from 'react';

interface CodePenBackgroundProps {
  penId?: string;
  user?: string;
  title?: string;
  height?: string;
}

/**
 * CodePenBackground Component
 * 
 * Embeds a CodePen animation as a full-screen background.
 * Loads the CodePen embed script safely and prevents duplicate loads.
 */
export const CodePenBackground = ({
  penId = 'XWNjBdb',
  user = 'sanprieto',
  title = 'Interactive particles text create with three.js',
  height = '100%'
}: CodePenBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="codepen"]');
    
    if (!existingScript && !scriptLoadedRef.current) {
      // Create and load the CodePen embed script
      const script = document.createElement('script');
      script.src = 'https://cpwebassets.codepen.io/assets/embed/ei.js';
      script.async = true;
      script.defer = true;
      
      // Add to document
      document.body.appendChild(script);
      scriptLoadedRef.current = true;

      // Cleanup function
      return () => {
        // Only remove if we added it
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        scriptLoadedRef.current = false;
      };
    } else if (existingScript) {
      // Script already exists, trigger CodePen's embed processor
      if (window.__CPEmbed) {
        window.__CPEmbed();
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none', // Prevent blocking user interactions
        zIndex: 0,
      }}
    >
      {/* CodePen Embed */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: 'scale(1.1)', // Slight zoom to avoid edges
        }}
      >
        <p
          className="codepen"
          data-height={height}
          data-theme-id="dark"
          data-default-tab="result"
          data-slug-hash={penId}
          data-pen-title={title}
          data-user={user}
          data-preview="true"
          style={{
            height: '100vh',
            width: '100%',
            margin: 0,
          }}
        >
          <span>Loading animation...</span>
        </p>
      </div>

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10, 10, 21, 0.85) 0%, rgba(10, 10, 21, 0.7) 40%, rgba(10, 10, 21, 0.85) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// Extend Window interface for CodePen's embed function
declare global {
  interface Window {
    __CPEmbed?: () => void;
  }
}

