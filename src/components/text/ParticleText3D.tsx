import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const ParticleText3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const reticlesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  const text = "REALITYONEX";

  useEffect(() => {
    setMounted(true);
    if (!containerRef.current || !textRef.current) return;

    const chars = charsRef.current.filter((char): char is HTMLSpanElement => char !== null);

    // 1. Initial configuration for entrance reveal
    gsap.set(chars, {
      opacity: 0,
      y: 50,
      scale: 0.6,
      rotationX: -45,
      z: -150,
      transformPerspective: 1000,
    });

    // 2. Cinematic Entrance Staggered Animation (letters assemble into place)
    const entranceTimeline = gsap.timeline();
    entranceTimeline.to(chars, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      z: 0,
      duration: 1.5,
      stagger: {
        each: 0.08,
        from: "start",
      },
      ease: "elastic.out(1.1, 0.6)",
    });

    // 3. Coordinated Floating Animation (floating the ENTIRE text container together to maintain alignment)
    const floatTween = gsap.to(textRef.current, {
      y: "-=8",
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 4. Subtle continuous 3D rotational drift
    const driftTween = gsap.to(textRef.current, {
      rotationY: "+=3",
      rotationX: "+=2",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 5. Mouse Parallax effect (tilts the entire title in 3D perspective based on cursor position)
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth) - 0.5;
      const yPercent = (clientY / innerHeight) - 0.5;

      gsap.to(textRef.current, {
        rotateY: xPercent * 20, // Gentle, controlled tilt
        rotateX: -yPercent * 15,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      if (!textRef.current) return;
      gsap.to(textRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      // Clean up all GSAP animations
      floatTween.kill();
      driftTween.kill();
      gsap.killTweensOf(chars);
      if (textRef.current) {
        gsap.killTweensOf(textRef.current);
      }
      reticlesRef.current.forEach(r => {
        if (r) gsap.killTweensOf(r);
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible w-full"
      style={{ perspective: 1200 }}
    >
      <div
        ref={textRef}
        className="flex flex-row flex-nowrap items-center justify-center select-none pointer-events-auto cursor-pointer py-4 overflow-visible"
        style={{
          transformStyle: "preserve-3d",
          whiteSpace: "nowrap",
        }}
      >
        {text.split("").map((char, index) => {
          const isLast = index === text.length - 1;
          return (
            <span
              key={index}
              ref={(el) => (charsRef.current[index] = el)}
              className="inline-block font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 relative transition-all duration-300 overflow-visible"
              style={{
                fontSize: "clamp(2.8rem, 9vw, 6.3rem)",
                fontWeight: 900,
                fontFamily: "'Orbitron', sans-serif",
                marginRight: isLast ? 0 : "0.22em", // Matches the background outline text spacing perfectly
                lineHeight: 1.1,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              onMouseEnter={(e) => {
                const reticle = reticlesRef.current[index];
                if (reticle) {
                  // Spin and scale up reticle
                  gsap.to(reticle, {
                    scale: 1,
                    opacity: 1,
                    rotation: 90,
                    duration: 0.4,
                    ease: "back.out(1.6)",
                  });
                }

                // Smoothly scale up the hovered letter
                gsap.to(e.currentTarget, {
                  scale: 1.1,
                  color: "#22d3ee",
                  z: 20, // Move forward in 3D space
                  duration: 0.25,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                const reticle = reticlesRef.current[index];
                if (reticle) {
                  // Spin back and shrink reticle
                  gsap.to(reticle, {
                    scale: 0,
                    opacity: 0,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.in",
                  });
                }

                // Return letter to default state
                gsap.to(e.currentTarget, {
                  scale: 1,
                  color: "transparent",
                  z: 0,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }}
            >
              {char}
              
              {/* Holographic Radar Target Reticle on Hover (Perfect circle using absolute dimensions) */}
              <span
                ref={(el) => (reticlesRef.current[index] = el)}
                className="absolute left-1/2 top-1/2 rounded-full border border-cyan-400/50 bg-cyan-500/5 pointer-events-none z-[-1] overflow-visible"
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  transform: "translate(-50%, -50%) scale(0)",
                  opacity: 0,
                  transformOrigin: "center center",
                  boxShadow: "0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 10px rgba(34, 211, 238, 0.1)",
                  willChange: "transform, opacity",
                }}
              >
                {/* Outer radar ticks */}
                <span className="absolute inset-0 rounded-full border border-dashed border-cyan-300/30 scale-90" />
                
                {/* Central targeting dot */}
                <span 
                  className="absolute left-1/2 top-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
                  style={{
                    width: "8px",
                    height: "8px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
