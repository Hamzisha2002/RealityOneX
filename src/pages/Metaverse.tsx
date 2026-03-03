import { Navbar } from '@/components/layout/Navbar';
import { MetaverseScene } from '@/components/metaverse/MetaverseScene';
import { PropertyModal } from '@/components/property/PropertyModal';
import { motion } from 'framer-motion';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Info, Map } from 'lucide-react';

const Metaverse = () => {
  const properties = useMetaverseStore((state) => state.properties);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="fixed inset-0 pt-16">
        <MetaverseScene />
      </div>

      {/* Info overlay */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-20 left-4 z-40 glass-card p-4 max-w-xs"
      >
        <div className="flex items-center gap-2 mb-2">
          <Map className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg text-foreground">Virtual City</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Explore {properties.length} properties in our metaverse. Click on buildings to view details.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="w-4 h-4" />
          <span>Use mouse to orbit, scroll to zoom</span>
        </div>
      </motion.div>

      {/* Property list sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="fixed top-20 right-4 z-40 glass-card p-4 w-64 max-h-[calc(100vh-120px)] overflow-y-auto"
      >
        <h3 className="font-display text-sm text-muted-foreground mb-3">Properties</h3>
        <div className="space-y-2">
          {properties.map((property) => (
            <button
              key={property.id}
              onClick={() => useMetaverseStore.getState().selectProperty(property)}
              className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: property.color }}
                />
                <span className="text-sm font-medium text-foreground">{property.name}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{property.location}</span>
                <span className="text-xs text-accent font-medium">{property.priceInSol} SOL</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <PropertyModal />
    </div>
  );
};

export default Metaverse;
