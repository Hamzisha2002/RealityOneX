import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleHeroText Component (Simplified Version)
 * 
 * Renders "REALITYONEX" as an interactive 3D particle system using Three.js.
 * 
 * TEMPORARY: Using PointsMaterial instead of custom shaders for stability testing.
 * Custom shaders disabled until basic particle system is confirmed working.
 */

export const ParticleHeroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, hover: 0 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Calculate canvas dimensions
    const canvasWidth = Math.min(window.innerWidth, 1200);
    const canvasHeight = 200;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50, // Reduced FOV for less distortion
      canvasWidth / canvasHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // CRITICAL FIX: Move camera back for better view
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    
    // CRITICAL FIX: Set clear color to transparent
    renderer.setClearColor(0x000000, 0);
    
    // Set appropriate size for hero section (not full window)
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sample text from canvas to get particle positions
    const sampleTextToParticles = (text: string, maxParticles: number) => {
      const textCanvas = document.createElement('canvas');
      const ctx = textCanvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context for text sampling');
        return { positions: [], count: 0 };
      }

      // Set canvas size - REDUCED for better particle density
      const fontSize = 80;
      textCanvas.width = 700;
      textCanvas.height = 120;

      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

      // Sample pixels
      const imageData = ctx.getImageData(0, 0, textCanvas.width, textCanvas.height);
      const pixels = imageData.data;
      const positions: number[] = [];

      // INCREASED sampling rate to reduce particles
      const sampling = 6; // Fewer particles = better performance

      for (let y = 0; y < textCanvas.height; y += sampling) {
        for (let x = 0; x < textCanvas.width; x += sampling) {
          const index = (y * textCanvas.width + x) * 4;
          const alpha = pixels[index + 3];

          // If pixel is not transparent, create a particle
          if (alpha > 128 && positions.length / 3 < maxParticles) {
            // Convert to Three.js coordinates - CORRECTED SCALING
            const posX = (x - textCanvas.width / 2) / 80;  // Adjusted scale
            const posY = -(y - textCanvas.height / 2) / 80; // Adjusted scale
            const posZ = 0;

            positions.push(posX, posY, posZ);
          }
        }
      }

      console.log(`Text sampling complete: ${positions.length / 3} particles generated`);
      return { positions, count: positions.length / 3 };
    };

    // Create circular particle texture
    const createCircleTexture = () => {
      const size = 32;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Create gradient circle
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      
      return texture;
    };

    // Create particle text
    const createParticleText = () => {
      const text = 'REALITYONEX';
      const maxParticles = 600;
      const { positions, count } = sampleTextToParticles(text, maxParticles);

      if (count === 0) {
        console.error('❌ No particles generated from text - check sampling function');
        return;
      }

      // Create buffer arrays
      const positionsArray = new Float32Array(positions);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      // Set colors and sizes
      for (let i = 0; i < count; i++) {
        // Cyan to blue gradient
        const colorMix = Math.random();
        colors[i * 3] = 0.17 + colorMix * 0.06; // R
        colors[i * 3 + 1] = 0.83 - colorMix * 0.32; // G
        colors[i * 3 + 2] = 0.75 + colorMix * 0.21; // B
        
        sizes[i] = 3 + Math.random() * 2;
      }

      // Create geometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Store original positions for animation
      geometry.userData.originalPositions = positionsArray.slice();

      // Create simple PointsMaterial (no shaders)
      const particleTexture = createCircleTexture();
      
      const material = new THREE.PointsMaterial({
        size: 3,
        sizeAttenuation: true,
        map: particleTexture,
        alphaMap: particleTexture,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
        depthTest: true,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;

      console.log(`✅ Particle text created with ${count} particles (PointsMaterial mode)`);
    };

    createParticleText();

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      mouseRef.current.x = event.clientX / window.innerWidth;
      mouseRef.current.y = 1 - (event.clientY / window.innerHeight);
      mouseRef.current.hover = 1; // Activate hover effect
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current.hover = 0;
    };

    // Window resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      // Maintain proper aspect ratio for hero section
      const width = Math.min(window.innerWidth, 1200);
      const height = 200;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Manual particle animation (since we're not using shaders)
      if (particlesRef.current) {
        const time = Date.now() * 0.001;
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const originalPositions = particlesRef.current.geometry.userData.originalPositions as Float32Array;
        
        // Mouse position in normalized coordinates
        const mouseX = (mouseRef.current.x * 2 - 1) * 1.5;
        const mouseY = (mouseRef.current.y * 2 - 1) * 1.0;
        
        // Update each particle position
        for (let i = 0; i < positions.length; i += 3) {
          const origX = originalPositions[i];
          const origY = originalPositions[i + 1];
          const origZ = originalPositions[i + 2];
          
          // Calculate distance from mouse
          const dx = origX - mouseX;
          const dy = origY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Mouse repulsion
          let offsetX = 0;
          let offsetY = 0;
          if (dist < 1.2 && mouseRef.current.hover > 0) {
            const force = (1 - dist / 1.2) * 0.15 * mouseRef.current.hover;
            offsetX = (dx / dist) * force;
            offsetY = (dy / dist) * force;
          }
          
          // Wave animation
          const wave = Math.sin(time * 2 + origX * 3 + i) * 0.015;
          const float = Math.sin(time + i * 0.1) * 0.01;
          
          // Apply transformations
          positions[i] = origX + offsetX;
          positions[i + 1] = origY + offsetY + float;
          positions[i + 2] = origZ + wave;
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        
        // Smooth hover transition
        mouseRef.current.hover += (mouseRef.current.hover > 0 ? 0.9 : 0) * 0.1;
        mouseRef.current.hover -= mouseRef.current.hover * 0.05;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.dispose();
        }
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '200px',
        maxWidth: '1200px',
        pointerEvents: 'none', // Don't block UI interactions
        zIndex: 10, // Above background, below navbar
        overflow: 'hidden', // CRITICAL: Prevent canvas overflow
      }}
    />
  );
};

