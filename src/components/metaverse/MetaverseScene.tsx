import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Building } from './Building';
import { Ground } from './Ground';
import { Environment } from './Environment';
import { useMetaverseStore } from '@/store/metaverseStore';

interface MetaverseSceneProps {
  isBackground?: boolean;
}

export const MetaverseScene = ({ isBackground = false }: MetaverseSceneProps) => {
  const properties = useMetaverseStore((state) => state.properties);

  // Debug logging
  console.log('MetaverseScene rendering with properties:', properties.length);
  console.log('Properties data:', properties);

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a15' }}>
      <Canvas 
        camera={{ position: [80, 60, 80], fov: 60 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Environment with lighting and atmosphere */}
          <Environment />
          
          {/* Camera Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={30}
            maxDistance={200}
            target={[0, 0, 0]}
            autoRotate={false}
          />
          
          {/* Ground Grid */}
          <Ground />
          
          {/* Render Buildings */}
          {properties.map((property) => {
            console.log('Rendering building:', property.name, 'at position:', property.coordinates);
            return <Building key={property.id} property={property} />;
          })}
        </Suspense>
      </Canvas>
    </div>
  );
};