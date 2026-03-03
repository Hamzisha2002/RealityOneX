import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Chrome, Wallet, MessageSquare, Apple, Twitter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useMetaverseStore } from '@/store/metaverseStore';

// TypeScript declaration for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { connectWallet } = useMetaverseStore();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [metamaskAddress, setMetamaskAddress] = useState<string | null>(null);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  // Page entrance animation
  useEffect(() => {
    if (!pageRef.current || !cardRef.current) return;

    gsap.set(pageRef.current, { opacity: 0 });
    gsap.set(cardRef.current, { opacity: 0, scale: 0.9, y: 30 });

    const tl = gsap.timeline();
    tl.to(pageRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
    tl.to(
      cardRef.current,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.2'
    );
  }, []);

  // More options expand/collapse animation
  useEffect(() => {
    if (!moreOptionsRef.current) return;

    if (showMoreOptions) {
      gsap.fromTo(
        moreOptionsRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      gsap.to(moreOptionsRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [showMoreOptions]);

  const handleGoogleLogin = async () => {
    // Mock Google authentication
    login({
      id: 'mock-user-google',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google',
      provider: 'google',
    });
    
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate('/dashboard');
  };

  const handleMetaMaskLogin = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setMetamaskAddress(address);
          
          // Mock authentication with MetaMask
          login({
            id: 'mock-user-metamask',
            name: 'MetaMask User',
            email: `${address.slice(0, 6)}...${address.slice(-4)}@metamask.io`,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MetaMask',
            provider: 'metamask',
            walletAddress: address,
          });
          
          connectWallet();
          
          // Simulate loading
          await new Promise((resolve) => setTimeout(resolve, 800));
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('MetaMask connection error:', error);
        alert('Please connect your MetaMask wallet');
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask extension.');
    }
  };

  const handleDiscordLogin = async () => {
    login({
      id: 'mock-user-discord',
      name: 'Discord User',
      email: 'user@discord.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Discord',
      provider: 'discord',
    });
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate('/dashboard');
  };

  const handleAppleLogin = async () => {
    login({
      id: 'mock-user-apple',
      name: 'Apple User',
      email: 'user@icloud.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Apple',
      provider: 'apple',
    });
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate('/dashboard');
  };

  const handleTwitterLogin = async () => {
    login({
      id: 'mock-user-twitter',
      name: 'Twitter User',
      email: 'user@twitter.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Twitter',
      provider: 'twitter',
    });
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigate('/dashboard');
  };

  return (
    <div
      ref={pageRef}
      className="fixed inset-0 min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite',
      }}
    >
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-xl"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Auth Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          ref={cardRef}
          className="w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl"
          style={{
            background: 'rgba(10, 10, 20, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Welcome to <span className="gradient-text-primary">RealityOneX</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Choose how you want to enter the metaverse
            </p>
          </div>

          {/* Primary Auth Buttons */}
          <div className="space-y-4 mb-6">
            <AuthButton
              icon={Chrome}
              label="Continue with Google"
              onClick={handleGoogleLogin}
              className="bg-white text-gray-900 hover:bg-gray-100"
            />
            <AuthButton
              icon={Wallet}
              label={metamaskAddress ? `Connected: ${metamaskAddress.slice(0, 6)}...${metamaskAddress.slice(-4)}` : 'Continue with MetaMask'}
              onClick={handleMetaMaskLogin}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            />
          </div>

          {/* More Options Toggle */}
          <button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <span className="text-sm">More options</span>
            {showMoreOptions ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* More Options Section */}
          <div
            ref={moreOptionsRef}
            className="overflow-hidden"
            style={{ height: 0 }}
          >
            <div className="grid grid-cols-3 gap-3">
              <IconAuthButton
                icon={MessageSquare}
                label="Discord"
                onClick={handleDiscordLogin}
                color="#5865F2"
              />
              <IconAuthButton
                icon={Apple}
                label="Apple"
                onClick={handleAppleLogin}
                color="#000000"
              />
              <IconAuthButton
                icon={Twitter}
                label="X"
                onClick={handleTwitterLogin}
                color="#1DA1F2"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Button Component with GSAP animations
interface AuthButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
}

const AuthButton = ({ icon: Icon, label, onClick, className = '' }: AuthButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.02,
        y: -2,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleMouseDown = () => {
      gsap.to(button, {
        scale: 0.98,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const handleMouseUp = () => {
      gsap.to(button, {
        scale: 1.02,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      size="lg"
      className={`w-full h-14 text-base font-semibold rounded-xl transition-all duration-200 ${className}`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </Button>
  );
};

// Icon Auth Button Component
interface IconAuthButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color: string;
}

const IconAuthButton = ({ icon: Icon, label, onClick, color }: IconAuthButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.1,
        rotation: 5,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        rotation: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
      style={{ backgroundColor: `${color}20`, borderColor: `${color}40` }}
    >
      <Icon className="w-6 h-6" style={{ color }} />
      <span className="text-xs text-white font-medium">{label}</span>
    </button>
  );
};

export default Auth;

