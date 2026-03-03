import { useRef, useState, Suspense } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Property } from '@/types/property';
import { useMetaverseStore } from '@/store/metaverseStore';

interface BuildingProps {
  property: Property;
}

export const Building = ({ property }: BuildingProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectProperty = useMetaverseStore((state) => state.selectProperty);

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = 
        property.size.height / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (groupRef.current) {
      groupRef.current.position.y = property.size.height / 2;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectProperty(property);
  };

  const getStatusColor = () => {
    switch (property.status) {
      case 'Available': return '#22c55e';
      case 'Sold': return '#ef4444';
      case 'Reserved': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  const getBuildingGeometry = () => {
    const areaName = property.areaName;

    // DHA Phase 6 - Sleek modern towers with stepped design
    if (areaName === 'DHA Phase 6') {
      return (
        <group>
          {/* Main tower */}
          <mesh>
            <boxGeometry args={[property.size.width, property.size.height, property.size.depth]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.8} 
              roughness={0.15}
              emissive={property.color}
              emissiveIntensity={hovered ? 0.2 : 0.06}
            />
          </mesh>
          {/* Top crown */}
          <mesh position={[0, property.size.height * 0.45, 0]}>
            <boxGeometry args={[property.size.width * 0.9, property.size.height * 0.1, property.size.depth * 0.9]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.9} 
              roughness={0.1}
              emissive={property.color}
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Base */}
          <mesh position={[0, -property.size.height * 0.4, 0]}>
            <boxGeometry args={[property.size.width * 1.1, property.size.height * 0.2, property.size.depth * 1.1]} />
            <meshStandardMaterial color={property.color} metalness={0.6} roughness={0.25} />
          </mesh>
        </group>
      );
    }

    // Clifton - Tall elegant towers with tapered tops
    if (areaName === 'Clifton') {
      return (
        <group>
          {/* Main tower */}
          <mesh>
            <boxGeometry args={[property.size.width, property.size.height * 0.85, property.size.depth]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.7} 
              roughness={0.2}
              emissive={property.color}
              emissiveIntensity={hovered ? 0.18 : 0.05}
            />
          </mesh>
          {/* Tapered top */}
          <mesh position={[0, property.size.height * 0.35, 0]}>
            <cylinderGeometry args={[property.size.width * 0.4, property.size.width * 0.6, property.size.height * 0.3, 4]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.85} 
              roughness={0.1}
              emissive={property.color}
              emissiveIntensity={0.12}
            />
          </mesh>
        </group>
      );
    }

    // Bahria Town - Low villas with flat roofs
    if (areaName === 'Bahria Town') {
      return (
        <group>
          {/* Main villa body */}
          <mesh>
            <boxGeometry args={[property.size.width, property.size.height * 0.7, property.size.depth]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.3} 
              roughness={0.5}
              emissive={property.color}
              emissiveIntensity={hovered ? 0.12 : 0.03}
            />
          </mesh>
          {/* Roof/upper floor */}
          <mesh position={[0, property.size.height * 0.3, 0]}>
            <boxGeometry args={[property.size.width * 0.85, property.size.height * 0.3, property.size.depth * 0.85]} />
            <meshStandardMaterial color={property.color} metalness={0.25} roughness={0.55} />
          </mesh>
          {/* Front entrance area */}
          <mesh position={[0, -property.size.height * 0.25, property.size.depth * 0.55]}>
            <boxGeometry args={[property.size.width * 0.3, property.size.height * 0.45, property.size.depth * 0.1]} />
            <meshStandardMaterial color={property.color} metalness={0.2} roughness={0.6} />
          </mesh>
        </group>
      );
    }

    // Gulshan - Uniform mid-rise blocks
    if (areaName === 'Gulshan') {
      return (
        <group>
          {/* Main block */}
          <mesh>
            <boxGeometry args={[property.size.width, property.size.height, property.size.depth]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.35} 
              roughness={0.4}
              emissive={property.color}
              emissiveIntensity={hovered ? 0.13 : 0.04}
            />
          </mesh>
          {/* Balconies on front */}
          {[...Array(3)].map((_, i) => (
            <mesh 
              key={i}
              position={[0, -property.size.height * 0.3 + (i * property.size.height * 0.3), property.size.depth * 0.52]}
            >
              <boxGeometry args={[property.size.width * 0.9, property.size.height * 0.05, property.size.depth * 0.08]} />
              <meshStandardMaterial color={property.color} metalness={0.3} roughness={0.5} />
            </mesh>
          ))}
        </group>
      );
    }

    // PECHS - Modern commercial with glass-like appearance
    if (areaName === 'PECHS') {
      return (
        <group>
          {/* Main commercial structure */}
          <mesh>
            <boxGeometry args={[property.size.width, property.size.height, property.size.depth]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.85} 
              roughness={0.08}
              emissive={property.color}
              emissiveIntensity={hovered ? 0.25 : 0.1}
              transparent
              opacity={0.95}
            />
          </mesh>
          {/* Horizontal bands (floors) */}
          {[...Array(4)].map((_, i) => (
            <mesh 
              key={i}
              position={[0, -property.size.height * 0.4 + (i * property.size.height * 0.27), 0]}
            >
              <boxGeometry args={[property.size.width * 1.02, property.size.height * 0.03, property.size.depth * 1.02]} />
              <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.05} />
            </mesh>
          ))}
        </group>
      );
    }

    // Scheme 33 - Flat farmhouse plots with boundary walls
    if (areaName === 'Scheme 33') {
      return (
        <group>
          {/* Plot ground */}
          <mesh>
            <boxGeometry args={[property.size.width, property.size.height * 0.3, property.size.depth]} />
            <meshStandardMaterial 
              color={property.color} 
              metalness={0.15} 
              roughness={0.7}
              emissive={property.color}
              emissiveIntensity={hovered ? 0.1 : 0.02}
            />
          </mesh>
          {/* Boundary walls */}
          <mesh position={[property.size.width * 0.45, property.size.height * 0.3, 0]}>
            <boxGeometry args={[property.size.width * 0.05, property.size.height * 0.7, property.size.depth * 0.95]} />
            <meshStandardMaterial color="#78716c" metalness={0.1} roughness={0.8} />
          </mesh>
          <mesh position={[-property.size.width * 0.45, property.size.height * 0.3, 0]}>
            <boxGeometry args={[property.size.width * 0.05, property.size.height * 0.7, property.size.depth * 0.95]} />
            <meshStandardMaterial color="#78716c" metalness={0.1} roughness={0.8} />
          </mesh>
          <mesh position={[0, property.size.height * 0.3, property.size.depth * 0.45]}>
            <boxGeometry args={[property.size.width * 0.9, property.size.height * 0.7, property.size.depth * 0.05]} />
            <meshStandardMaterial color="#78716c" metalness={0.1} roughness={0.8} />
          </mesh>
          <mesh position={[0, property.size.height * 0.3, -property.size.depth * 0.45]}>
            <boxGeometry args={[property.size.width * 0.9, property.size.height * 0.7, property.size.depth * 0.05]} />
            <meshStandardMaterial color="#78716c" metalness={0.1} roughness={0.8} />
          </mesh>
        </group>
      );
    }

    // Default fallback
    return (
      <mesh>
        <boxGeometry args={[property.size.width, property.size.height, property.size.depth]} />
        <meshStandardMaterial 
          color={property.color} 
          metalness={0.4} 
          roughness={0.3}
          emissive={property.color}
          emissiveIntensity={hovered ? 0.15 : 0.04}
        />
      </mesh>
    );
  };

  return (
    <group 
      position={[property.coordinates.x, property.size.height / 2, property.coordinates.z]}
      ref={groupRef}
    >
      <group
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getBuildingGeometry()}
        
        {/* Building windows effect */}
        {property.buildingType !== 'plot' && (
          <mesh position={[0, 0, property.size.depth / 2 + 0.01]}>
            <planeGeometry args={[property.size.width * 0.8, property.size.height * 0.8]} />
            <meshStandardMaterial 
              color="#1a1a2e" 
              metalness={0.9} 
              roughness={0.1}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}

        {/* Glowing edges when hovered */}
        {hovered && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(property.size.width + 0.2, property.size.height + 0.2, property.size.depth + 0.2)]} />
            <lineBasicMaterial color="#2dd4bf" linewidth={2} />
          </lineSegments>
        )}
      </group>

      {/* Floating label with area name, price, and status */}
      <Suspense fallback={null}>
        <group position={[0, property.size.height / 2 + 2, 0]}>
          {/* Area Name */}
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.7}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
          >
            {property.areaName}
          </Text>
          
          {/* Price in PKR */}
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.55}
            color="#d4af37"
            anchorX="center"
            anchorY="bottom"
          >
            PKR {property.priceInPKR}
          </Text>
          
          {/* Status */}
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.45}
            color={getStatusColor()}
            anchorX="center"
            anchorY="bottom"
          >
            {property.status}
          </Text>
        </group>
      </Suspense>

      {/* Property info card on hover */}
      {hovered && (
        <Html
          position={[0, property.size.height / 2 + 5, 0]}
          center
          distanceFactor={15}
          style={{ pointerEvents: 'none' }}
        >
          <div className="glass-card p-4 min-w-[220px] text-center animate-fade-in">
            <h3 className="font-display text-primary text-lg">{property.name}</h3>
            <p className="text-muted-foreground text-sm">{property.location}</p>
            <div className="mt-2">
              <span className="text-accent font-bold text-lg">PKR {property.priceInPKR}</span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: `${getStatusColor()}20`,
                  color: getStatusColor()
                }}
              >
                {property.status}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {property.buildingType}
              </span>
            </div>
            <p className="text-xs text-primary mt-2">Click to view details</p>
          </div>
        </Html>
      )}
    </group>
  );
};