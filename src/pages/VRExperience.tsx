import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Stars, Text } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, Eye, Gamepad2, Globe2, Headphones, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaverseStore } from '@/store/metaverseStore';
import { useWebXRSupport } from '@/hooks/useWebXRSupport';
import { R1XLogo } from '@/components/brand/R1XLogo';
import type { Property } from '@/types/property';

const xrStore = createXRStore({
  offerSession: false,
  emulate: false,
  frameRate: 'high',
});

const formatShareStatus = (property: Property) => {
  const available = Math.max(property.totalShares - property.fractionalShares, 0);
  return `${available.toLocaleString()} / ${property.totalShares.toLocaleString()} shares available`;
};

const frontendPanels = [
  {
    label: 'Home',
    title: 'RealityOneX Overview',
    copy: 'Brand intro, project purpose, VR path, and secure web path.',
    position: [-3.9, 1.15, -3.25] as [number, number, number],
    accent: '#2dd4bf',
  },
  {
    label: 'Properties',
    title: 'Property Discovery',
    copy: 'Browse tokenized property cards, values, locations, and share availability.',
    position: [3.9, 1.15, -3.25] as [number, number, number],
    accent: '#38bdf8',
  },
  {
    label: 'Verify',
    title: 'Ownership Proof',
    copy: 'Portfolio, SPL holdings, and on-chain receipt checks stay visible as information.',
    position: [-3.35, 0.65, 1.15] as [number, number, number],
    accent: '#a7f3d0',
  },
  {
    label: 'Handoff',
    title: 'Marketplace Handoff',
    copy: 'Buy, sell, tokenize, and wallet signing open in the normal Phantom web UI.',
    position: [3.35, 0.65, 1.15] as [number, number, number],
    accent: '#fbbf24',
  },
];

const VRFrontendPanel = ({ panel, index }: { panel: typeof frontendPanels[number]; index: number }) => (
  <Float speed={0.9 + index * 0.08} rotationIntensity={0.035} floatIntensity={0.12}>
    <group position={panel.position} rotation={[0, panel.position[0] > 0 ? -0.48 : 0.48, 0]}>
      <mesh>
        <boxGeometry args={[2.7, 1.25, 0.06]} />
        <meshStandardMaterial color="#06111f" emissive="#0f172a" emissiveIntensity={0.18} metalness={0.22} roughness={0.32} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[2.78, 1.33, 0.018]} />
        <meshStandardMaterial color={panel.accent} emissive={panel.accent} emissiveIntensity={0.42} transparent opacity={0.24} />
      </mesh>
      <Text position={[-1.12, 0.43, 0.1]} fontSize={0.085} anchorX="left" color={panel.accent} letterSpacing={0.08}>
        {panel.label.toUpperCase()}
      </Text>
      <Text position={[-1.12, 0.18, 0.1]} fontSize={0.14} anchorX="left" color="#f8fafc" maxWidth={2.1}>
        {panel.title}
      </Text>
      <Text position={[-1.12, -0.22, 0.1]} fontSize={0.075} anchorX="left" color="#cbd5e1" maxWidth={2.15} lineHeight={1.35}>
        {panel.copy}
      </Text>
    </group>
  </Float>
);

interface VRPropertyCardProps {
  property: Property;
  index: number;
  active: boolean;
  onSelect: (property: Property) => void;
}

const VRPropertyCard = ({ property, index, active, onSelect }: VRPropertyCardProps) => {
  const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
  const radius = 4.2;
  const position: [number, number, number] = [Math.cos(angle) * radius, 1.45, Math.sin(angle) * radius - 1.5];

  return (
    <Float speed={1.2 + index * 0.1} rotationIntensity={0.06} floatIntensity={0.16}>
      <group position={position} rotation={[0, -angle + Math.PI / 2, 0]} onClick={() => onSelect(property)}>
        <mesh>
          <boxGeometry args={[2.45, 1.55, 0.08]} />
          <meshStandardMaterial
            color={active ? '#123c44' : '#08141f'}
            emissive={active ? '#14b8a6' : '#0f172a'}
            emissiveIntensity={active ? 0.45 : 0.12}
            metalness={0.25}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <boxGeometry args={[2.55, 1.65, 0.025]} />
          <meshStandardMaterial color={active ? '#2dd4bf' : '#334155'} emissive={active ? '#2dd4bf' : '#0f172a'} emissiveIntensity={0.45} />
        </mesh>
        <Text position={[-1.05, 0.48, 0.1]} fontSize={0.16} anchorX="left" anchorY="middle" color="#f8fafc" maxWidth={2.05}>
          {property.name}
        </Text>
        <Text position={[-1.05, 0.17, 0.1]} fontSize={0.095} anchorX="left" anchorY="middle" color="#93c5fd" maxWidth={2.05}>
          {property.location}
        </Text>
        <Text position={[-1.05, -0.1, 0.1]} fontSize={0.09} anchorX="left" anchorY="middle" color="#fbbf24" maxWidth={2.05}>
          {property.priceInPKR}
        </Text>
        <Text position={[-1.05, -0.38, 0.1]} fontSize={0.075} anchorX="left" anchorY="middle" color="#a7f3d0" maxWidth={2.05}>
          {formatShareStatus(property)}
        </Text>
      </group>
    </Float>
  );
};

const VRLobbyScene = ({ properties, selectedProperty, onSelect }: {
  properties: Property[];
  selectedProperty: Property | null;
  onSelect: (property: Property) => void;
}) => {
  const visibleProperties = properties.slice(0, 6);

  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 4, 2]} intensity={28} color="#67e8f9" />
      <spotLight position={[0, 7, 5]} angle={0.45} penumbra={0.7} intensity={70} color="#2dd4bf" />
      <Stars radius={80} depth={45} count={1800} factor={4} saturation={0} fade speed={0.7} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -1.4]}>
        <circleGeometry args={[7.4, 96]} />
        <meshStandardMaterial color="#03111f" metalness={0.15} roughness={0.42} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.4]}>
        <ringGeometry args={[2.3, 7.5, 96]} />
        <meshStandardMaterial color="#0f766e" emissive="#14b8a6" emissiveIntensity={0.22} transparent opacity={0.58} />
      </mesh>

      <Float speed={1.1} floatIntensity={0.18} rotationIntensity={0.04}>
        <Text position={[0, 2.95, -3.3]} fontSize={0.62} anchorX="center" color="#e0f2fe">
          R1X
        </Text>
        <Text position={[0, 2.36, -3.3]} fontSize={0.18} anchorX="center" color="#2dd4bf" letterSpacing={0.08}>
          REALITYONEX VR FRONTEND
        </Text>
        <Text position={[0, 2.05, -3.3]} fontSize={0.095} anchorX="center" color="#cbd5e1" maxWidth={4.2} textAlign="center">
          Browse the RealityOneX frontend in immersive mode: intro, properties, verification, and walkthrough handoff. Marketplace transactions remain in the secure Phantom web UI.
        </Text>
      </Float>

      {frontendPanels.map((panel, index) => (
        <VRFrontendPanel key={panel.label} panel={panel} index={index} />
      ))}

      {visibleProperties.length === 0 ? (
        <Text position={[0, 1.2, -3.1]} fontSize={0.16} anchorX="center" color="#cbd5e1" maxWidth={3.2} textAlign="center">
          No tokenized properties are listed yet. Create an asset from the Dashboard to populate this VR lobby.
        </Text>
      ) : (
        visibleProperties.map((property, index) => (
          <VRPropertyCard
            key={property.id}
            property={property}
            index={index}
            active={selectedProperty?.id === property.id}
            onSelect={onSelect}
          />
        ))
      )}

      <OrbitControls enablePan={false} minDistance={3.2} maxDistance={8} target={[0, 1.25, -1.4]} />
    </>
  );
};

const VRExperience = () => {
  const navigate = useNavigate();
  const { isChecking, isSupported } = useWebXRSupport();
  const [isInVR, setIsInVR] = useState(Boolean(xrStore.getState().session));
  const [vrError, setVrError] = useState<string | null>(null);
  const properties = useMetaverseStore((state) => state.properties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] ?? null);

  const selectedStats = useMemo(() => {
    if (!selectedProperty) return null;
    const available = Math.max(selectedProperty.totalShares - selectedProperty.fractionalShares, 0);
    const sold = selectedProperty.fractionalShares;
    return { available, sold };
  }, [selectedProperty]);

  const enterVR = async () => {
    setVrError(null);
    try {
      const session = await xrStore.enterVR();
      setIsInVR(Boolean(session ?? xrStore.getState().session));
    } catch {
      setVrError('VR connection was not started. Use a WebXR browser in the headset and allow the immersive session prompt.');
    }
  };

  const openMarketplace = () => {
    if (selectedProperty) {
      useMetaverseStore.getState().selectProperty(selectedProperty);
    }
    navigate('/properties');
  };

  useEffect(() => {
    const unsubscribe = xrStore.subscribe((state) => {
      setIsInVR(Boolean(state.session));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const removeDefaultXRButton = () => {
      Array.from(document.querySelectorAll('button')).forEach((button) => {
        if (button.textContent?.trim().toLowerCase() === 'enter xr') {
          button.setAttribute('aria-hidden', 'true');
          button.setAttribute('tabindex', '-1');
          button.style.display = 'none';
          button.remove();
        }
      });
    };

    removeDefaultXRButton();
    const observer = new MutationObserver(removeDefaultXRButton);
    observer.observe(document.body, { childList: true, subtree: true });
    const interval = window.setInterval(removeDefaultXRButton, 500);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_30%)]" />

      <div className="absolute left-0 right-0 top-0 z-30 border-b border-white/10 bg-background/45 backdrop-blur-xl">
        <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="shrink-0">
            <R1XLogo />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/properties')} className="gap-2 border-primary/30 bg-background/40">
              <ShoppingCart className="h-4 w-4" />
              Marketplace
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pt-16">
        <Canvas camera={{ position: [0, 2.2, 5.5], fov: 58 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <XR store={xrStore}>
              <VRLobbyScene properties={properties} selectedProperty={selectedProperty} onSelect={setSelectedProperty} />
            </XR>
          </Suspense>
        </Canvas>
      </div>

      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-5 right-5 z-20 w-[min(26rem,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-background/70 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Immersive Mode</p>
            <h1 className="font-display text-xl font-bold">VR Property Experience</h1>
          </div>
        </div>

        <div className="mb-4 space-y-2 rounded-2xl border border-primary/20 bg-primary/10 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            {isInVR ? <ShieldCheck className="h-4 w-4 text-primary" /> : <Globe2 className="h-4 w-4 text-primary" />}
            <span>{isInVR ? 'VR session connected' : isChecking ? 'Checking headset support...' : isSupported ? 'WebXR headset detected' : 'Desktop preview mode'}</span>
          </div>
          <p>
            {isInVR
              ? 'The frontend is now running in immersive VR. Use controller, hand ray, or headset pointer to explore the lobby.'
              : isSupported
                ? 'Press Enter VR inside the headset browser, then accept the browser permission prompt.'
                : 'No WebXR VR headset is detected in this browser. Open this same /vr link from the headset browser to connect.'}
          </p>
          {vrError && <p className="text-xs text-destructive">{vrError}</p>}
        </div>

        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Button variant="glow" className="gap-2" onClick={enterVR} disabled={!isSupported || isInVR}>
            <Gamepad2 className="h-4 w-4" />
            {isInVR ? 'VR Connected' : 'Enter VR'}
          </Button>
          <Button variant="outline" className="gap-2 border-primary/30" disabled={!selectedProperty?.model3dUrl}>
            <Eye className="h-4 w-4" />
            Walkthrough
          </Button>
        </div>

        {selectedProperty ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-muted/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">{selectedProperty.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
                </div>
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-background/50 p-3">
                  <p className="text-muted-foreground">Property Value</p>
                  <p className="mt-1 font-mono text-accent">{selectedProperty.priceInPKR}</p>
                </div>
                <div className="rounded-xl bg-background/50 p-3">
                  <p className="text-muted-foreground">Shares Sold</p>
                  <p className="mt-1 font-mono text-primary">{selectedStats?.sold.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-background/50 p-3 col-span-2">
                  <p className="text-muted-foreground">Available Shares</p>
                  <p className="mt-1 font-mono text-foreground">{selectedStats?.available.toLocaleString()} / {selectedProperty.totalShares.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full gap-2" onClick={openMarketplace}>
              <ShoppingCart className="h-4 w-4" />
              Open Marketplace to complete wallet transaction
            </Button>

            {!selectedProperty.model3dUrl && (
              <p className="text-xs text-muted-foreground">
                Walkthrough will activate after a verified GLB property model is attached to this listing.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-muted-foreground">
            Explore the frontend panels in VR, then select a floating property card for details, walkthrough status, and marketplace handoff.
          </div>
        )}
      </motion.aside>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-5 left-5 z-20 hidden max-w-sm rounded-3xl border border-white/10 bg-background/55 p-4 backdrop-blur-xl lg:block"
      >
        <div className="mb-2 flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.22em]">Proposal Aligned</span>
        </div>
        <p className="text-sm text-muted-foreground">
          VR shows the frontend experience only. Marketplace buying, selling, tokenization, and Phantom signing stay in the normal secure web interface.
        </p>
      </motion.div>
    </div>
  );
};

export default VRExperience;
