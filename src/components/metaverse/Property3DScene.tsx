import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Property } from '@/types/property';
import { Html } from '@react-three/drei';
import { Info } from 'lucide-react';

interface Property3DSceneProps {
  property: Property;
}

export const Property3DScene = ({ property }: Property3DSceneProps) => {
  const [hoveredWindow, setHoveredWindow] = useState<number | null>(null);
  const [hoveredDoor, setHoveredDoor] = useState<number | null>(null);
  const [showHotspot, setShowHotspot] = useState(false);

  // Room dimensions
  const roomWidth = 8;
  const roomDepth = 8;
  const roomHeight = 3;
  const wallThickness = 0.2;

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color="#2a2a35"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, roomHeight, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color="#1a1a25"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Back Wall */}
      <Wall
        position={[0, roomHeight / 2, -roomDepth / 2]}
        width={roomWidth}
        height={roomHeight}
        thickness={wallThickness}
        rotation={[0, 0, 0]}
      />

      {/* Left Wall */}
      <Wall
        position={[-roomWidth / 2, roomHeight / 2, 0]}
        width={roomDepth}
        height={roomHeight}
        thickness={wallThickness}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Right Wall */}
      <Wall
        position={[roomWidth / 2, roomHeight / 2, 0]}
        width={roomDepth}
        height={roomHeight}
        thickness={wallThickness}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Front Wall (with opening for entry) */}
      <group position={[0, roomHeight / 2, roomDepth / 2]}>
        {/* Left part of front wall */}
        <mesh
          position={[-roomWidth / 4, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roomWidth / 2 - 0.5, roomHeight, wallThickness]} />
          <meshStandardMaterial color="#3a3a45" roughness={0.7} />
        </mesh>
        {/* Right part of front wall */}
        <mesh
          position={[roomWidth / 4, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roomWidth / 2 - 0.5, roomHeight, wallThickness]} />
          <meshStandardMaterial color="#3a3a45" roughness={0.7} />
        </mesh>
        {/* Top part of front wall */}
        <mesh
          position={[0, roomHeight / 2 - 1.5, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[roomWidth, 1, wallThickness]} />
          <meshStandardMaterial color="#3a3a45" roughness={0.7} />
        </mesh>
      </group>

      {/* Windows */}
      <Window
        position={[-roomWidth / 2 - wallThickness / 2, 1.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
        width={2}
        height={1.5}
        hovered={hoveredWindow === 0}
        onHover={(hovered) => setHoveredWindow(hovered ? 0 : null)}
      />
      <Window
        position={[-roomWidth / 2 - wallThickness / 2, 1.5, 2]}
        rotation={[0, Math.PI / 2, 0]}
        width={2}
        height={1.5}
        hovered={hoveredWindow === 1}
        onHover={(hovered) => setHoveredWindow(hovered ? 1 : null)}
      />
      <Window
        position={[0, 1.5, -roomDepth / 2 - wallThickness / 2]}
        rotation={[0, 0, 0]}
        width={3}
        height={1.5}
        hovered={hoveredWindow === 2}
        onHover={(hovered) => setHoveredWindow(hovered ? 2 : null)}
      />

      {/* Door */}
      <Door
        position={[0, 0.9, roomDepth / 2 + wallThickness / 2]}
        rotation={[0, 0, 0]}
        width={1.2}
        height={2}
        hovered={hoveredDoor === 0}
        onHover={(hovered) => setHoveredDoor(hovered ? 0 : null)}
      />

      {/* Furniture - Simple representation */}
      <Furniture position={[-2, 0.4, -2]} type="sofa" />
      <Furniture position={[2, 0.4, -2]} type="table" />
      <Furniture position={[0, 0.3, 2]} type="bed" />

      {/* Info Hotspot */}
      <InfoHotspot
        position={[3, 1.5, -3]}
        property={property}
        showHotspot={showHotspot}
        onToggle={() => setShowHotspot(!showHotspot)}
      />

      {/* Ambient lighting from windows */}
      <pointLight position={[-roomWidth / 2, 1.5, -2]} intensity={0.3} color="#87ceeb" />
      <pointLight position={[-roomWidth / 2, 1.5, 2]} intensity={0.3} color="#87ceeb" />
      <pointLight position={[0, 1.5, -roomDepth / 2]} intensity={0.4} color="#87ceeb" />
    </group>
  );
};

// Wall Component
interface WallProps {
  position: [number, number, number];
  width: number;
  height: number;
  thickness: number;
  rotation: [number, number, number];
}

const Wall = ({ position, width, height, thickness, rotation }: WallProps) => {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[width, height, thickness]} />
      <meshStandardMaterial color="#3a3a45" roughness={0.7} metalness={0.1} />
    </mesh>
  );
};

// Window Component
interface WindowProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
}

const Window = ({ position, rotation, width, height, hovered, onHover }: WindowProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.emissive.setHex(hovered ? 0x00ffff : 0x000000);
      meshRef.current.material.emissiveIntensity = hovered ? 0.3 : 0;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Window frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
        <meshStandardMaterial color="#2a2a35" roughness={0.5} />
      </mesh>
      {/* Window glass */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#87ceeb"
          transparent
          opacity={0.3}
          emissive="#00ffff"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
};

// Door Component
interface DoorProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
}

const Door = ({ position, rotation, width, height, hovered, onHover }: DoorProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.emissive.setHex(hovered ? 0xffaa00 : 0x000000);
      meshRef.current.material.emissiveIntensity = hovered ? 0.2 : 0;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial
          color="#4a3a2a"
          roughness={0.8}
          emissive="#ffaa00"
          emissiveIntensity={0}
        />
      </mesh>
      {/* Door handle */}
      <mesh position={[width / 2 - 0.1, 0, 0.06]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Furniture Component
interface FurnitureProps {
  position: [number, number, number];
  type: 'sofa' | 'table' | 'bed';
}

const Furniture = ({ position, type }: FurnitureProps) => {
  const [x, y, z] = position;

  if (type === 'sofa') {
    return (
      <group position={position} castShadow>
        <mesh>
          <boxGeometry args={[2, 0.4, 0.8]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.6, 0.1]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (type === 'table') {
    return (
      <group position={position} castShadow>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial color="#2a1a0a" roughness={0.5} />
        </mesh>
      </group>
    );
  }

  if (type === 'bed') {
    return (
      <group position={position} castShadow>
        <mesh>
          <boxGeometry args={[2, 0.3, 1.5]} />
          <meshStandardMaterial color="#4a3a5a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color="#6a5a7a" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return null;
};

// Info Hotspot Component
interface InfoHotspotProps {
  position: [number, number, number];
  property: Property;
  showHotspot: boolean;
  onToggle: () => void;
}

const InfoHotspot = ({ position, property, showHotspot, onToggle }: InfoHotspotProps) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.material.emissiveIntensity = hovered || showHotspot ? 0.5 : 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onToggle}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.2}
        />
      </mesh>
      {showHotspot && (
        <Html distanceFactor={10} center>
          <div className="glass-card p-4 min-w-[250px] bg-background/90 backdrop-blur-xl border border-primary/50">
            <h3 className="font-display text-lg font-bold text-primary mb-2">{property.name}</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Location: </span>
                <span className="text-foreground">{property.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Price: </span>
                <span className="text-primary font-bold">{property.priceInPKR}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tokens: </span>
                <span className="text-foreground">{property.totalShares.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status: </span>
                <span className="text-accent">{property.status}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click hotspot to close</p>
          </div>
        </Html>
      )}
    </group>
  );
};

