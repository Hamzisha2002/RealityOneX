import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, Map, Building2, Database, Headphones } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { useMetaverseStore } from '@/store/metaverseStore';
import { R1XLogo } from '@/components/brand/R1XLogo';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/metaverse', label: 'Metaverse', icon: Map },
  { path: '/vr', label: 'VR', icon: Headphones },
  { path: '/properties', label: 'Properties', icon: Building2 },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export const Navbar = ({ transparent = false }: { transparent?: boolean }) => {
  const location = useLocation();

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          transparent ? 'bg-background/30' : 'glass-card'
        } border-b border-border/50 backdrop-blur-xl`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <R1XLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => useMetaverseStore.getState().setShowBlockchainMonitor(!useMetaverseStore.getState().showBlockchainMonitor)}
              className="border-primary/40 hover:border-primary text-primary font-mono text-[11px] gap-1.5 h-9"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chain Monitor</span>
              <span className="sm:hidden">Monitor</span>
            </Button>
            <div className="nav-wallet-adapter shrink-0 min-w-0 max-w-[min(100vw-7rem,12rem)] sm:max-w-[17rem]">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};
