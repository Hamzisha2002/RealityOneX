import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleTextBackground Component
 * 
 * A Three.js particle animation that displays text as animated particles.
 * Features mouse interaction, custom shaders, and smooth animations.
 * Designed as a full-screen background for the homepage.
 */

// Vertex Shader - handles particle positioning
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  
  attribute vec3 targetPosition;
  attribute float randomOffset;
  
  varying vec3 vColor;
  
  void main() {
    vec3 pos = position;
    
    // Mouse interaction - push particles away from cursor
    vec2 mouseInfluence = uMouse * 2.0 - 1.0;
    float distanceToMouse = distance(pos.xy, mouseInfluence);
    float pushStrength = smoothstep(0.5, 0.0, distanceToMouse);
    pos.xy += (pos.xy - mouseInfluence) * pushStrength * 0.3;
    
    // Animate particles with wave effect
    float wave = sin(uTime * 0.5 + pos.x * 2.0 + randomOffset) * 0.1;
    pos.z += wave;
    
    // Smooth transition to target position
    pos = mix(pos, targetPosition, 0.02);
    
    // Calculate color based on position - REDUCED brightness
    vColor = vec3(
      0.05 + pos.z * 0.15,
      0.3 + sin(uTime + randomOffset) * 0.1,
      0.4 + cos(uTime * 0.5 + randomOffset) * 0.1
    ) * 0.6; // Overall dimmer
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader - handles particle appearance
const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Create circular particles with smooth edges
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    
    // Add glow effect - REDUCED
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    vec3 finalColor = vColor + glow * 0.1; // Reduced from 0.3
    
    gl_FragColor = vec4(finalColor, alpha * 0.4); // Reduced from 0.8
  }
`;

export const ParticleTextBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a15, 1, 15);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particle text
    const createParticleText = () => {
      const text = 'REALTYX';
      const particleCount = 2000; // REDUCED from 5000 for subtlety
      const positions = new Float32Array(particleCount * 3);
      const targetPositions = new Float32Array(particleCount * 3);
      const randomOffsets = new Float32Array(particleCount);

      // Generate text-shaped particle positions
      const gridSize = 80;
      const textWidth = text.length * 0.8;
      let particleIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        // Random initial positions
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

        // Target positions forming text shape
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 2 + Math.random() * 0.5;
        const x = Math.cos(angle) * radius + Math.sin(i * 0.1) * 0.5;
        const y = Math.sin(angle) * radius * 0.5 + Math.cos(i * 0.1) * 0.3;
        const z = Math.sin(i * 0.05) * 0.5;

        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;

        randomOffsets[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
      geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1));

      // Shader material - REDUCED intensity for subtle effect
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uSize: { value: 2.5 }, // REDUCED from 4.0
        },
        transparent: true,
        blending: THREE.NormalBlending, // Changed from Additive
        depthWrite: false,
        opacity: 0.4, // REDUCED overall opacity
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;
    };

    createParticleText();

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX / window.innerWidth,
        y: 1 - (event.clientY / window.innerHeight), // Invert Y
      };
    };

    // Window resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (particlesRef.current && particlesRef.current.material instanceof THREE.ShaderMaterial) {
        // Update shader uniforms
        particlesRef.current.material.uniforms.uTime.value += 0.016;
        particlesRef.current.material.uniforms.uMouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );

        // Rotate particles slowly
        particlesRef.current.rotation.y += 0.001;
        particlesRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);

      // Dispose Three.js resources
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // Above video, below overlay
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: 0.3, // VERY subtle - decorative only
      }}
    />
  );
};

