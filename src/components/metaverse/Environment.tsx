import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Environment = () => {
  const starsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const stars = useMemo(() => {
    const positions = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
      positions[i] = (Math.random() - 0.5) * 500;
      positions[i + 1] = Math.random() * 200 + 50;
      positions[i + 2] = (Math.random() - 0.5) * 500;
    }
    return positions;
  }, []);

  const floatingParticles = useMemo(() => {
    const positions = new Float32Array(300);
    for (let i = 0; i < 300; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = Math.random() * 30 + 2;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.elapsedTime * 0.01;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ambient and directional lights */}
      <ambientLight intensity={0.3} color="#4a5568" />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.8}
        color="#fef3c7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 50, 0]} intensity={0.5} color="#00d4aa" distance={100} />
      <pointLight position={[30, 30, -30]} intensity={0.3} color="#a855f7" distance={80} />
      <pointLight position={[-30, 30, 30]} intensity={0.3} color="#06b6d4" distance={80} />

      {/* Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={stars.length / 3}
            array={stars}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.5} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={floatingParticles.length / 3}
            array={floatingParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.3} color="#00d4aa" transparent opacity={0.6} sizeAttenuation />
      </points>

      {/* Sky gradient sphere */}
      <mesh>
        <sphereGeometry args={[300, 32, 32]} />
        <meshBasicMaterial 
          color="#0a0a20" 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a15', 50, 200]} />
    </group>
  );
};
