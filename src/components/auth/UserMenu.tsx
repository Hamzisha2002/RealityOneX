import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const { disconnectWallet } = useMetaverseStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // GSAP dropdown animation
  useEffect(() => {
    if (!dropdownRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          scale: 0.95,
          y: -10,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'back.out(1.2)',
        }
      );

      gsap.fromTo(
        dropdownRef.current.children,
        {
          opacity: 0,
          x: -10,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.2,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.to(dropdownRef.current, {
        opacity: 0,
        scale: 0.95,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
      });
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    disconnectWallet();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 glass-card px-4 py-2 rounded-lg hover:border-primary/30 transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-foreground">{user.name}</span>
          <span className="text-xs text-muted-foreground capitalize">{user.loginMethod}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl border border-primary/20 shadow-2xl overflow-hidden z-50"
          style={{
            background: 'rgba(10, 10, 20, 0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="p-2 space-y-1">
            {/* User Info */}
            <div className="px-3 py-2 border-b border-primary/10 mb-1">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              )}
            </div>

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm text-foreground"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span>Dashboard</span>
            </Link>

            {/* Profile Link (placeholder) */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm text-foreground"
            >
              <User className="w-4 h-4 text-primary" />
              <span>Profile</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-primary/10 my-1" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-sm text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

