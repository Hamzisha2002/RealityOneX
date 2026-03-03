import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, Map, Building2, LogIn } from 'lucide-react';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { useAuthStore } from '@/store/authStore';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/metaverse', label: 'Metaverse', icon: Map },
  { path: '/properties', label: 'Properties', icon: Building2 },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export const Navbar = ({ transparent = false }: { transparent?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold gradient-text-primary">
                RealityOneX
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                 Next Gen Ownership.
              </span>
            </div>
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

          <div className="flex items-center gap-3">
            <WalletConnect />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                variant="neon"
                onClick={() => navigate('/auth')}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </motion.header>
    </>
  );
};