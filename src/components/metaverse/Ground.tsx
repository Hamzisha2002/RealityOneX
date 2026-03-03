import * as THREE from 'three';

export const Ground = () => {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.3} 
          roughness={0.7}
        />
      </mesh>

      {/* Grid helper */}
      <gridHelper 
        args={[400, 80, '#00d4aa', '#2a2a4e']} 
        position={[0, 0.1, 0]}
      />
      
      {/* District circles - DHA Phase 6 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-43, 0.2, -43]}>
        <circleGeometry args={[14, 32]} />
        <meshStandardMaterial 
          color="#2dd4bf" 
          transparent 
          opacity={0.15}
          emissive="#2dd4bf"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Clifton */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-48, 0.2, 43]}>
        <circleGeometry args={[16, 32]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.15}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Bahria Town */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[46, 0.2, -43]}>
        <circleGeometry args={[17, 32]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          transparent 
          opacity={0.15}
          emissive="#f59e0b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Gulshan */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial 
          color="#22c55e" 
          transparent 
          opacity={0.15}
          emissive="#22c55e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* PECHS */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[45, 0.2, 42]}>
        <circleGeometry args={[13, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.15}
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Scheme 33 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[47, 0.2, 72]}>
        <circleGeometry args={[18, 32]} />
        <meshStandardMaterial 
          color="#10b981" 
          transparent 
          opacity={0.15}
          emissive="#10b981"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};
