import { Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Sky } from '@react-three/drei';
import { Property3DScene } from '@/components/metaverse/Property3DScene';
import { FirstPersonControls } from '@/components/metaverse/FirstPersonControls';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Button } from '@/components/ui/button';
import { X, Loader2, Info } from 'lucide-react';
import { gsap } from 'gsap';

const Property3DViewer = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { properties } = useMetaverseStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const property = properties.find((p) => p.id === propertyId);

  useEffect(() => {
    if (property) {
      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [property]);

  useEffect(() => {
    // Animate UI elements
    gsap.fromTo('.exit-button', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.5 });
    gsap.fromTo('.info-panel', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.7 });
  }, []);

  const handleExit = () => {
    gsap.to('.exit-button, .info-panel', {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        navigate('/properties');
      },
    });
  };

  if (!property) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-[60]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Loading Property Experience</h2>
            <p className="text-muted-foreground">{property.name}</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
        onCreated={(state) => {
          state.gl.setClearColor('#0a0a0f');
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          
          {/* Skybox */}
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />

          {/* 3D Property Scene */}
          <Property3DScene property={property} />

          {/* First Person Controls */}
          <FirstPersonControls
            onLockChange={setIsPointerLocked}
            enabled={!isLoading}
          />

          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 1.6, 0]} fov={75} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Exit Button */}
        <div className="exit-button fixed top-4 right-4 pointer-events-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={handleExit}
            className="glass-card gap-2 bg-background/80 backdrop-blur-xl border-border/50 hover:bg-background/90"
          >
            <X className="w-5 h-5" />
            Exit Metaverse
          </Button>
        </div>

        {/* Info Panel */}
        <div className="info-panel fixed top-4 left-4 pointer-events-auto">
          <div className="glass-card p-6 bg-background/80 backdrop-blur-xl border-border/50 max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-bold">{property.name}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Location: </span>
                <span className="text-foreground font-medium">{property.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Price: </span>
                <span className="text-primary font-bold">{property.priceInPKR}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Token Supply: </span>
                <span className="text-foreground font-medium">{property.totalShares.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status: </span>
                <span className="text-accent font-medium">{property.status}</span>
              </div>
            </div>
            {!isPointerLocked && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-primary">
                  Click to lock pointer and use WASD + Mouse to explore
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls Hint */}
        {isPointerLocked && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <div className="glass-card px-4 py-2 bg-background/80 backdrop-blur-xl border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                WASD: Move | Mouse: Look | ESC: Exit
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Property3DViewer;

