import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Text } from 'troika-three-text';

/**
 * ParticleText3D Component (Now using TroikaText for stability)
 * 
 * Renders "REALITYONEX" as clean, readable 3D text using TroikaText.
 * 
 * WHY TROIKA OVER PARTICLE SYSTEM:
 * - TroikaText uses proper font rendering (no manual pixel sampling)
 * - Built-in SDF (Signed Distance Field) for sharp text at any size
 * - GPU-accelerated text rendering
 * - No vertical collapsing or horizontal striping issues
 * - Reliable across different fonts and sizes
 * 
 * FEATURES:
 * - Neon cyan/teal material with emissive glow
 * - Subtle hover wave animation
 * - Mouse parallax effect
 * - Scroll-based depth shift
 * - Always readable and stable
 */

export const ParticleText3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, isHovering: false });
  const scrollRef = useRef(0);
  const [textReady, setTextReady] = useState(false);
  
  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const textMeshRef = useRef<Text | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - EXPLICIT SAFE POSITIONING
    const containerWidth = window.innerWidth;
    const containerHeight = 350;
    
    const camera = new THREE.PerspectiveCamera(
      50, // FOV
      containerWidth / containerHeight,
      0.1, // Near plane
      1000 // Far plane
    );
    
    // CRITICAL: Explicit camera position
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50; // Safe distance to see text
    
    // CRITICAL: Camera looks at origin where text will be
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    cameraRef.current = camera;
    
    console.log('📷 Camera configured at:', camera.position);

    // Renderer setup - FULLY TRANSPARENT
    const renderer = new THREE.WebGLRenderer({
      alpha: true, // Enable transparency
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: false, // Prevent alpha blending issues
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Fully transparent clear color
    
    // Set canvas background to transparent
    renderer.domElement.style.background = 'transparent';
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting for text visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // BRIGHTER ambient
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 0, 50); // Front lighting
    scene.add(frontLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1.5, 100);
    pointLight.position.set(0, 10, 30);
    scene.add(pointLight);

    // Create 3D Text using TroikaText - FORCE VISIBILITY
    const createText = () => {
      const textMesh = new Text();
      
      // CRITICAL: Explicitly set visibility
      textMesh.visible = true;
      
      // Text content and font
      textMesh.text = 'REALITYONEX';
      textMesh.fontSize = 15;
      textMesh.font = 'Arial, sans-serif';
      textMesh.fontWeight = 'bold';
      textMesh.letterSpacing = 0.1;
      
      // Material properties - MAXIMUM VISIBILITY
      textMesh.color = 0x00ffff; // Bright cyan
      textMesh.fillOpacity = 1.0; // Full opacity (no transparency)
      
      // Outline for better definition
      textMesh.outlineWidth = 0.3;
      textMesh.outlineColor = 0x00cccc;
      textMesh.outlineOpacity = 1.0;
      
      // Alignment - center anchor
      textMesh.anchorX = 'center';
      textMesh.anchorY = 'middle';
      
      // Position at origin
      textMesh.position.set(0, 0, 0);
      
      // CRITICAL: Explicit scale (must not be zero)
      textMesh.scale.set(1, 1, 1);
      
      // Render order
      textMesh.renderOrder = 999;
      
      // Add to scene BEFORE sync
      scene.add(textMesh);
      textMeshRef.current = textMesh;
      
      // Sync geometry (async)
      textMesh.sync(() => {
        console.log('✅ TroikaText fully synced');
        // Force camera to look at text
        camera.lookAt(textMesh.position);
        // Force one render after sync
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        // Mark text as ready for fade-in
        setTextReady(true);
      });
      
      console.log('✅ TroikaText created and added to scene');
    };

    createText();
    
    // Ensure camera looks at origin where text is
    camera.lookAt(0, 0, 0);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.x = 0.5;
      mouseRef.current.y = 0.5;
    };

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const containerWidth = window.innerWidth;
      const containerHeight = 350;
      cameraRef.current.aspect = containerWidth / containerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerWidth, containerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop - SAFE MINIMAL ANIMATIONS
    let frameCount = 0;
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };
    let textReady = false;
    
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Check if text is ready
      if (textMeshRef.current && !textReady) {
        textReady = true;
        console.log('✅ Text is ready for animation');
      }

      frameCount++;
      if (frameCount === 120) {
        console.log('🎬 Animation running. Text visible:', !!textMeshRef.current);
      }

      // ONLY animate if text exists and is ready
      if (textMeshRef.current && textReady) {
        const time = Date.now() * 0.001;

        // 1. IDLE FLOAT - very gentle Y-axis
        const floatAmount = 0.3;
        const floatSpeed = 0.5;
        const baseY = Math.sin(time * floatSpeed) * floatAmount;
        textMeshRef.current.position.y = baseY;

        // 2. BREATHING SCALE - subtle pulse
        const breathMin = 1.0;
        const breathMax = 1.015; // Very subtle 1.5%
        const breathSpeed = 0.7;
        const breathScale = breathMin + (Math.sin(time * breathSpeed) * 0.5 + 0.5) * (breathMax - breathMin);
        textMeshRef.current.scale.setScalar(breathScale);

        // 3. MOUSE PARALLAX - minimal rotation
        const mouseXOffset = (mouseRef.current.x - 0.5) * 2;
        const mouseYOffset = (mouseRef.current.y - 0.5) * 2;
        
        // Target rotation (tightly clamped)
        targetRotation.y = THREE.MathUtils.clamp(mouseXOffset * 0.06, -0.12, 0.12);
        targetRotation.x = THREE.MathUtils.clamp(-mouseYOffset * 0.04, -0.08, 0.08);
        
        // Smooth lerp
        const lerpFactor = 0.08;
        currentRotation.x += (targetRotation.x - currentRotation.x) * lerpFactor;
        currentRotation.y += (targetRotation.y - currentRotation.y) * lerpFactor;
        
        textMeshRef.current.rotation.x = currentRotation.x;
        textMeshRef.current.rotation.y = currentRotation.y;

        // 4. HOVER GLOW - subtle shimmer
        if (mouseRef.current.isHovering) {
          const shimmer = 0.92 + Math.sin(time * 1.5) * 0.08;
          textMeshRef.current.fillOpacity = shimmer;
        } else {
          textMeshRef.current.fillOpacity = 1.0;
        }

        // 5. SCROLL DEPTH - extremely subtle
        const scrollEffect = Math.min(scrollRef.current / 1500, 0.3);
        textMeshRef.current.position.z = scrollEffect * -1;
      }

      // ALWAYS render (even before text is ready)
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Start animation loop immediately
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (textMeshRef.current) {
        textMeshRef.current.dispose();
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        backgroundColor: 'transparent', // Match hero section - no white background
      }}
    >
      {/* Three.js canvas - FADE IN ON LOAD */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '350px',
          pointerEvents: 'none',
          zIndex: 50,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent', // Match hero section background
          opacity: textReady ? 1 : 0, // Fade in when ready
          transition: 'opacity 0.4s ease-out', // Smooth fade-in
        }}
      />

      {/* Fallback HTML text - FADES OUT when 3D text is ready */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#00ffff',
          textShadow: '0 0 20px #00ffff, 0 0 40px #00aaaa, 0 0 60px #008888',
          letterSpacing: '0.15em',
          zIndex: 49,
          opacity: textReady ? 0 : 1, // Fade out when 3D text is ready
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.4s ease-out', // Smooth fade-out
        }}
        className="hero-text-fallback"
      >
        REALITYONEX
      </div>

      {/* Hidden text for SEO and accessibility */}
      <h1 className="sr-only">RealityOneX</h1>
    </div>
  );
};
