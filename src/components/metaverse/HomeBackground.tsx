import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// Floating building component
const FloatingBuilding = ({ position, color, height, delay }: { 
  position: [number, number, number]; 
  color: string; 
  height: number;
  delay: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + delay) * 0.3;
      // Slow rotation
      meshRef.current.rotation.y = clock.elapsedTime * 0.1 + delay;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3 + delay) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.4, height, 0.4]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Abstract shape for variety
const FloatingShape = ({ position, color, delay }: { 
  position: [number, number, number]; 
  color: string;
  delay: number;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.4 + delay) * 0.4;
      meshRef.current.rotation.y = clock.elapsedTime * 0.15 + delay;
      meshRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.2 + delay) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.15}
          wireframe
        />
      </mesh>
    </group>
  );
};

// Camera rotation component
const CameraRotation = () => {
  useFrame(({ camera, clock }) => {
    camera.position.x = Math.sin(clock.elapsedTime * 0.05) * 3;
    camera.position.z = Math.cos(clock.elapsedTime * 0.05) * 3 + 5;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

export const HomeBackground = () => {
  // Generate positions for buildings
  const buildings = [
    { pos: [-2, 0, -2] as [number, number, number], color: '#2dd4bf', height: 1.5, delay: 0 },
    { pos: [1.5, -0.5, -1] as [number, number, number], color: '#3b82f6', height: 2, delay: 1 },
    { pos: [-1, 0.5, 1] as [number, number, number], color: '#f59e0b', height: 1.2, delay: 2 },
    { pos: [2, -0.3, 0.5] as [number, number, number], color: '#8b5cf6', height: 1.8, delay: 3 },
    { pos: [0, 0, -3] as [number, number, number], color: '#22c55e', height: 1.4, delay: 1.5 },
    { pos: [-2.5, -0.2, 0] as [number, number, number], color: '#10b981', height: 1.6, delay: 2.5 },
  ];

  const shapes = [
    { pos: [0.5, 1, -1.5] as [number, number, number], color: '#2dd4bf', delay: 0.5 },
    { pos: [-1.5, -1, 0.5] as [number, number, number], color: '#f59e0b', delay: 1.5 },
    { pos: [2.5, 0.5, -0.5] as [number, number, number], color: '#3b82f6', delay: 2.5 },
  ];

  return (
    <div 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: 0.6,
        pointerEvents: 'none' // Disable interaction
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Minimal lighting for performance */}
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        
        {/* Camera animation */}
        <CameraRotation />
        
        {/* Render buildings */}
        {buildings.map((building, i) => (
          <FloatingBuilding
            key={`building-${i}`}
            position={building.pos}
            color={building.color}
            height={building.height}
            delay={building.delay}
          />
        ))}
        
        {/* Render abstract shapes */}
        {shapes.map((shape, i) => (
          <FloatingShape
            key={`shape-${i}`}
            position={shape.pos}
            color={shape.color}
            delay={shape.delay}
          />
        ))}
      </Canvas>
    </div>
  );
};

