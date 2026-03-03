import { useEffect, useRef, useState } from 'react';

interface Interactive3DTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Interactive3DText Component
 * 
 * Adds 3D-style interactive animations to text using CSS transforms and JavaScript.
 * Features: hover tilt, mouse parallax, scroll effects, and click pulse.
 * 
 * GPU-accelerated transforms for smooth 60fps performance.
 */
export const Interactive3DText = ({ children, className = '' }: Interactive3DTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [scrollDepth, setScrollDepth] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;

    // MOUSE MOVE - Parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;

      const rect = textRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to text center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Check if mouse is near the text (within 400px radius)
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = 400;

      if (distance < maxDistance) {
        // Normalize to 0-1 range, inverted (closer = stronger)
        const influence = 1 - distance / maxDistance;
        
        // Calculate normalized position (-0.5 to 0.5)
        const normalizedX = (distanceX / maxDistance) * influence;
        const normalizedY = (distanceY / maxDistance) * influence;

        setMousePosition({
          x: 0.5 + normalizedX,
          y: 0.5 + normalizedY,
        });
      } else {
        // Reset to center when mouse is far
        setMousePosition({ x: 0.5, y: 0.5 });
      }
    };

    // SCROLL - Depth effect
    const handleScroll = () => {
      // Calculate scroll depth (0 to 1 for first 500px)
      const scrollY = window.scrollY;
      const depth = Math.min(scrollY / 500, 1);
      setScrollDepth(depth);
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // CLICK - Pulse effect
  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);
  };

  // Calculate transforms based on interactions
  const calculateTransform = () => {
    // Mouse parallax - subtle tilt
    const tiltX = (mousePosition.y - 0.5) * 15; // -7.5 to 7.5 degrees
    const tiltY = (mousePosition.x - 0.5) * -15; // -7.5 to 7.5 degrees
    
    // Parallax movement
    const moveX = (mousePosition.x - 0.5) * 10; // -5 to 5 pixels
    const moveY = (mousePosition.y - 0.5) * 10; // -5 to 5 pixels

    // Scroll depth - slight scale
    const scaleEffect = 1 + scrollDepth * 0.05; // 1.0 to 1.05

    // Hover effect - additional tilt and scale
    const hoverScale = isHovered ? 1.02 : 1;
    const hoverTiltBoost = isHovered ? 1.3 : 1;

    // Pulse effect
    const pulseScale = isPulsing ? 1.05 : 1;

    return {
      transform: `
        perspective(1000px)
        translate3d(${moveX}px, ${moveY}px, 0)
        rotateX(${tiltX * hoverTiltBoost}deg)
        rotateY(${tiltY * hoverTiltBoost}deg)
        scale(${scaleEffect * hoverScale * pulseScale})
      `,
    };
  };

  // Calculate text shadows for 3D depth
  const calculateTextShadow = () => {
    const baseIntensity = isHovered ? 1.3 : 1;
    const pulseIntensity = isPulsing ? 1.5 : 1;
    const intensity = baseIntensity * pulseIntensity;

    // Layered shadows for depth
    return `
      0 0 20px rgba(45, 212, 191, ${0.3 * intensity}),
      0 0 40px rgba(45, 212, 191, ${0.2 * intensity}),
      0 0 60px rgba(45, 212, 191, ${0.1 * intensity}),
      2px 2px 4px rgba(0, 0, 0, 0.3),
      4px 4px 8px rgba(0, 0, 0, 0.2),
      8px 8px 16px rgba(0, 0, 0, 0.1)
    `;
  };

  return (
    <div
      ref={textRef}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        ...calculateTransform(),
        textShadow: calculateTextShadow(),
        transition: isPulsing 
          ? 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.2s ease-out'
          : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.3s ease-out',
        cursor: 'pointer',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

