import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Mail, Wallet, User, Chrome, Github, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useMetaverseStore } from '@/store/metaverseStore';

// Login Button Component with GSAP hover animation
interface LoginButtonProps {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const LoginButton = ({ id, label, icon: Icon, color, onClick }: LoginButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // GSAP hover animation
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.02,
        y: -2,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        y: 0,
        duration: 0.3,
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
      className="group w-full relative overflow-hidden rounded-xl border border-primary/20 bg-background/50 hover:bg-background/80 transition-all duration-300 p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
      style={{
        transform: 'translateZ(0)',
      }}
    >
      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Icon */}
      <div className="relative z-10 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      {/* Label */}
      <span className="relative z-10 flex-1 text-left font-medium text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>

      {/* Arrow indicator */}
      <div className="relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginOptions = [
  {
    id: 'google' as const,
    label: 'Continue with Google',
    icon: Chrome,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'email' as const,
    label: 'Continue with Email',
    icon: Mail,
    color: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'github' as const,
    label: 'Continue with GitHub',
    icon: Github,
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: 'metamask' as const,
    label: 'Continue with MetaMask',
    icon: Wallet,
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'avatar' as const,
    label: 'Enter as Metaverse Avatar',
    icon: User,
    color: 'from-purple-500 to-pink-600',
  },
];

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { login } = useAuthStore();
  const { connectWallet } = useMetaverseStore();

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // GSAP Animations
  useEffect(() => {
    if (!isOpen) return;

    setIsAnimating(true);
    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const content = contentRef.current;
    const buttons = buttonsRef.current;

    if (!modal || !backdrop || !content || !buttons) return;

    // Set initial states
    gsap.set(backdrop, { opacity: 0, backdropFilter: 'blur(0px)' });
    gsap.set(modal, { scale: 0.8, opacity: 0, y: 50 });
    gsap.set(content.children, { opacity: 0, y: 20 });
    gsap.set(buttons.children, { opacity: 0, scale: 0.9, y: 20 });

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Backdrop animation
    tl.to(backdrop, {
      opacity: 1,
      backdropFilter: 'blur(20px)',
      duration: 0.6,
      ease: 'power2.out',
    });

    // Modal entrance
    tl.to(
      modal,
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
      },
      '-=0.4'
    );

    // Content fade in
    tl.to(
      content.children,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    // Button stagger animation
    tl.to(
      buttons.children,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.1)',
      },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  // Exit animation
  const handleClose = () => {
    if (isAnimating) return;

    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const buttons = buttonsRef.current;

    if (!modal || !backdrop || !buttons) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    // Reverse animations
    tl.to(buttons.children, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      stagger: 0.03,
      ease: 'power2.in',
    });

    tl.to(
      modal,
      {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power2.in',
      },
      '-=0.2'
    );

    tl.to(
      backdrop,
      {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.4,
        ease: 'power2.in',
      },
      '-=0.3'
    );
  };

  // Handle login
  const handleLogin = async (method: typeof loginOptions[number]['id']) => {
    if (method === 'metamask') {
      // Connect wallet if MetaMask
      connectWallet();
    }

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    login(method);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-md">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Glass Card */}
          <div
            ref={contentRef}
            className="glass-card p-8 rounded-2xl border border-primary/20 shadow-2xl relative overflow-hidden"
            style={{
              background: 'rgba(10, 10, 20, 0.7)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              {/* Title */}
              <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to RealityOneX
              </h2>

              {/* Subtitle */}
              <p className="text-muted-foreground mb-8 text-sm">
                Choose how you want to enter the metaverse
              </p>

              {/* Login Buttons */}
              <div ref={buttonsRef} className="space-y-3">
                {loginOptions.map((option) => (
                  <LoginButton
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    icon={option.icon}
                    color={option.color}
                    onClick={() => handleLogin(option.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

