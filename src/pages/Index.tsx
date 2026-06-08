import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Coins, Shield, Users, Zap, Globe, Search, ShoppingCart, BadgeCheck, ScanSearch, Headphones, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundVideo } from '@/components/background/BackgroundVideo';
import { ParticleTextBackground } from '@/components/background/ParticleTextBackground';
import { WhyChooseBackgroundVideo } from '@/components/background/WhyChooseBackgroundVideo';
import { SharedBackgroundVideo } from '@/components/background/SharedBackgroundVideo';
import { ReadyInvestBackgroundVideo } from '@/components/background/ReadyInvestBackgroundVideo';
import { ParticleText3D } from '@/components/text/ParticleText3D';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollPerformance } from '@/hooks/useScrollPerformance';
import { useMetaverseStore } from '@/store/metaverseStore';
import { useWebXRSupport } from '@/hooks/useWebXRSupport';
import { R1XLogo } from '@/components/brand/R1XLogo';

// Register GSAP ScrollTrigger plugin with performance optimizations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Optimize ScrollTrigger performance
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true,
  });
  
  // Use requestAnimationFrame for smoother scrolling
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.fps(60);
}

const features = [
  {
    icon: Building2,
    title: ' Properties',
    description: 'Own prime digital land representing  real estate',
  },
  {
    icon: Coins,
    title: 'SPL Share Tokenization',
    description: 'Each listed property has a verified SPL share mint and vault',
  },
  {
    icon: Users,
    title: 'Fractional Ownership',
    description: 'Invest in premium properties with fractional shares',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Smart contract powered purchases with full transparency',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Lightning-fast transactions on blockchain network',
  },
  {
    icon: Globe,
    title: '3D Exploration',
    description: 'Walk through properties in our immersive 3D world',
  },
];

const howItWorksSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Properties',
    description: 'Explore our curated collection of tokenized real estate properties in the metaverse.',
  },
  {
    number: '02',
    icon: ShoppingCart,
    title: 'Purchase Tokens',
    description: 'Buy fractional ownership tokens using cryptocurrency with secure blockchain transactions.',
  },
  {
    number: '03',
    icon: BadgeCheck,
    title: 'Verify Ownership',
    description: 'View your actual SPL token holdings and investor receipt directly from Solana.',
  },
  {
    number: '04',
    icon: ScanSearch,
    title: 'Inspect the Ledger',
    description: 'Review the property PDA, mint, vault, supply, holders, and confirmed transactions.',
  },
];

const Index = () => {
  // Optimize scroll performance globally
  useScrollPerformance();
  const properties = useMetaverseStore((state) => state.properties);
  const { isChecking, isSupported } = useWebXRSupport();
  const totalShares = properties.reduce((total, property) => total + property.totalShares, 0);
  const heroRef = useRef<HTMLDivElement>(null);
  const stats = [
    { value: properties.length.toLocaleString(), label: 'Verified Listings' },
    { value: totalShares.toLocaleString(), label: 'Minted Property Shares' },
    { value: 'Atomic', label: 'SOL + Token Settlement' },
    { value: 'Primary', label: 'Current Market Type' },
  ];

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const layers = hero.querySelectorAll('[data-hero-layer]');
    const accents = hero.querySelectorAll('[data-hero-accent]');

    const enter = () => {
      gsap.to(hero, {
        scale: 1.015,
        boxShadow: '0 36px 120px rgba(45, 212, 191, 0.2)',
        duration: 0.55,
        ease: 'power3.out',
      });
      gsap.to(layers, {
        z: (index) => 28 + index * 14,
        y: (index) => -3 - index * 3,
        duration: 0.55,
        stagger: 0.035,
        ease: 'power3.out',
      });
      gsap.to(accents, {
        opacity: 1,
        scale: 1,
        rotate: (index) => (index % 2 === 0 ? 8 : -8),
        duration: 0.65,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      });
    };

    const move = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 14;
      const rotateX = (0.5 - y) * 10;

      gsap.to(hero, {
        rotateX,
        rotateY,
        '--hero-x': `${x * 100}%`,
        '--hero-y': `${y * 100}%`,
        duration: 0.42,
        ease: 'power3.out',
      });
      gsap.to(layers, {
        x: (index) => (x - 0.5) * (10 + index * 8),
        y: (index) => (y - 0.5) * (8 + index * 5),
        duration: 0.42,
        ease: 'power3.out',
      });
    };

    const leave = () => {
      gsap.to(hero, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        '--hero-x': '50%',
        '--hero-y': '50%',
        boxShadow: '0 24px 90px rgba(0, 0, 0, 0.32)',
        duration: 0.7,
        ease: 'elastic.out(1, 0.55)',
      });
      gsap.to(layers, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.65,
        stagger: 0.025,
        ease: 'power3.out',
      });
      gsap.to(accents, {
        opacity: 0.55,
        scale: 0.92,
        rotate: 0,
        duration: 0.5,
        stagger: 0.035,
        ease: 'power2.out',
      });
    };

    hero.addEventListener('mouseenter', enter);
    hero.addEventListener('mousemove', move);
    hero.addEventListener('mouseleave', leave);

    return () => {
      hero.removeEventListener('mouseenter', enter);
      hero.removeEventListener('mousemove', move);
      hero.removeEventListener('mouseleave', leave);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background relative" style={{ willChange: 'scroll-position' }}>
      <Navbar transparent />
      
      {/* Hero Section with Subtle Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video - Lowest Layer */}
        <BackgroundVideo />
        
        {/* Three.js Particle Animation Background - Decorative Only */}
        <ParticleTextBackground />
        
        {/* Subtle dark overlay for readability - reduced opacity to show video */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/55 to-background/65 z-[5]" />

        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-3d-shell text-center max-w-4xl mx-auto rounded-[2.5rem] px-4 py-7 md:px-8"
          >
            <span data-hero-accent className="hero-line hero-line-top" />
            <span data-hero-accent className="hero-line hero-line-bottom" />
            <span data-hero-accent className="hero-sweep" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              data-hero-layer="badge" className="inline-flex items-center gap-2 px-4 py-2 cinematic-card mb-6 hover:border-primary/50 transition-all duration-300 cursor-default hover:-translate-y-1"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground"> Decentralized Metaverse Real Estate Platform</span>
            </motion.div>

            <div data-hero-layer="logo" className="mb-6 flex justify-center">
              <R1XLogo />
            </div>

            {/* PRIMARY TITLE - Three.js Particle Text */}
            <div data-hero-layer="title" className="hero-title-stage relative h-32 md:h-40 mb-6">
              <ParticleText3D />
              {/* Hidden HTML for accessibility */}
              <h1 className="sr-only">RealityOneX</h1>
            </div>

            <p data-hero-layer="copy" className="hero-copy-card mx-auto mb-8 max-w-3xl text-balance text-xl text-slate-200 md:text-2xl">
              A cinematic metaverse real estate platform where users explore property digital twins, verify ownership on Solana, and complete secure wallet transactions.
            </p>

            <div data-hero-layer="actions" className="mx-auto mb-6 grid max-w-3xl gap-4 rounded-[2rem] border border-primary/20 bg-background/45 p-3 shadow-2xl shadow-primary/10 backdrop-blur-xl md:grid-cols-2 perspective-1000">
              <Link to="/vr" className="group rounded-[1.5rem] border border-primary/25 bg-primary/10 p-5 text-left transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:border-primary/70 hover:bg-primary/15 hover:shadow-2xl hover:shadow-primary/15">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-primary/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-primary">
                    {isChecking ? 'Checking' : isSupported ? 'VR Ready' : 'Preview'}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">Enter VR Experience</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Open the immersive RealityOneX lobby with floating property listings, 3D exploration, and walkthrough handoff.
                </p>
              </Link>

              <Link to="/properties" className="group rounded-[1.5rem] border border-white/10 bg-muted/20 p-5 text-left transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 hover:border-accent/60 hover:bg-muted/30 hover:shadow-2xl hover:shadow-accent/10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
                    <MonitorPlay className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-accent/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-accent">Secure Web</span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">Continue Normal Website</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse the marketplace, connect Phantom, tokenize assets, and complete Solana transactions safely.
                </p>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/metaverse">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                  <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-background/70 hover:border-primary/50 transition-all duration-300">
                    Explore 3D City
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="cinematic-card p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
              >
                <div className="font-display text-3xl font-bold gradient-text-gold">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Shared Video Background Wrapper - Spans both sections */}
      <div className="relative">
        {/* Single shared video instance - spans both sections */}
        <div className="absolute inset-0 w-full">
          <SharedBackgroundVideo />
        </div>
        
        {/* Strong dark overlay for both sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background/90 z-[1] pointer-events-none" />

        {/* How It Works Section */}
        <ScrollStoryHowItWorksSection />

        {/* CTA Section */}
        <CTASection />
      </div>

      <AnimatedFooter />
    </div>
  );
};

// Step Card Component with GSAP hover animation
interface StepCardProps {
  step: typeof howItWorksSteps[0];
}

const StepCard = ({ step }: StepCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = step.icon;

  // GSAP hover animation
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="glass-card p-6 relative overflow-hidden group cursor-pointer"
      style={{
        background: 'rgba(10, 10, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Step Number */}
        <div className="mb-4">
          <span className="text-5xl font-display font-bold text-cyan-400/40">
            {step.number}
          </span>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-7 h-7 text-primary" />
        </div>

                  {/* Title */}
                  <h3 
                    className="font-display text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300"
                    style={{
                      textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 16px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors duration-300"
                    style={{
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {step.description}
                  </p>
      </div>
    </div>
  );
};

// CTA Section Component with GSAP animations
const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none none',
          once: true,
          refreshPriority: -1,
        },
      });

      // Set initial state
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 40,
      });

      // Animate content (optimized)
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true,
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    } else {
      // Fallback: Use Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && contentRef.current) {
              gsap.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      if (contentRef.current) {
        gsap.set(contentRef.current, {
          opacity: 0,
          y: 40,
        });
      }

      observer.observe(sectionRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background looping video for the Ready to Invest CTA */}
      <ReadyInvestBackgroundVideo />
      
      {/* Subtle overlay to blend video with background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/50 pointer-events-none z-[1]" />

      <div className="container mx-auto px-4 relative z-[2]">
        <div ref={contentRef}>
          <motion.div
            whileHover={{ 
              y: -5,
              scale: 1.015,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="relative p-12 md:p-16 text-center max-w-4xl mx-auto rounded-[2.5rem] border border-cyan-500/20 bg-slate-950/55 backdrop-blur-xl hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] transition-all duration-500 overflow-hidden"
          >
            {/* Holographic decorative neon lines / corner accents */}
            <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-xl pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60 rounded-br-xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-[150%] hover:animate-shimmer pointer-events-none" />

            <h2 className="font-display text-4xl md:text-5xl font-black mb-4 leading-tight">
              <span className="text-white">Ready to Invest in </span>
              <span className="gradient-text-primary">Digital Future?</span>
            </h2>
            <p 
              className="text-slate-300 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-light font-sans"
            >
              Connect your wallet and start exploring premium virtual real estate opportunities today.
            </p>
            <Link to="/metaverse">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                <Button variant="glow" size="xl" className="gap-2.5 font-bold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30">
                  Start Exploring
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section Component with GSAP animations
const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current || !sectionRef.current || !headerRef.current) return;

    const cards = Array.from(cardsRef.current.children);

    // Set initial states
    gsap.set(headerRef.current, {
      opacity: 0,
      y: 30,
    });
    gsap.set(cards, {
      opacity: 0,
      y: 50,
    });

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
      // Create scroll trigger animation (optimized)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none none',
          once: true,
          refreshPriority: -1,
        },
      });

      // Animate header first
      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        force3D: true,
      })
      // Stagger animation for cards (optimized)
      .to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        force3D: true,
      }, '-=0.2');

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    } else {
      // Fallback: Use Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(sectionRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Content - Video is handled by parent wrapper */}
      <div className="container mx-auto px-4 relative z-[2]">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 
            className="font-display text-4xl font-bold mb-4"
            style={{
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span className="gradient-text-primary">How It</span>{' '}
            <span className="text-white">Works</span>
          </h2>
          <p 
            className="text-gray-200 max-w-2xl mx-auto"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 12px rgba(0, 0, 0, 0.5)',
            }}
          >
            Get started with tokenized real estate in four simple steps. 
            Purchase and verify property-share tokens transparently on Solana.
          </p>
        </div>

        {/* Steps Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};


const ScrollStoryHowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || typeof ScrollTrigger === 'undefined') return;

    const triggers = howItWorksSteps.map((_, index) => ScrollTrigger.create({
      trigger: `[data-story-step="${index}"]`,
      start: 'top 58%',
      end: 'bottom 42%',
      onEnter: () => setActiveStep(index),
      onEnterBack: () => setActiveStep(index),
    }));

    const progressTween = progressRef.current
      ? gsap.fromTo(progressRef.current, { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 62%',
            end: 'bottom 38%',
            scrub: 0.7,
          },
        })
      : null;

    const floatingItems = gsap.to('[data-story-orbit]', {
      y: (index) => (index % 2 === 0 ? -18 : 18),
      rotate: (index) => (index % 2 === 0 ? 8 : -8),
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.25,
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      progressTween?.scrollTrigger?.kill();
      progressTween?.kill();
      floatingItems.kill();
    };
  }, []);

  const ActiveIcon = howItWorksSteps[activeStep].icon;

  const handleTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -9;
    const rotateY = ((x / rect.width) - 0.5) * 9;
    card.style.setProperty('--tilt-x', `${rotateX}deg`);
    card.style.setProperty('--tilt-y', `${rotateY}deg`);
    card.style.setProperty('--spot-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--spot-y', `${(y / rect.height) * 100}%`);
  };

  const resetTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0 depth-grid opacity-80" />
      <div className="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div data-story-orbit className="absolute left-[8%] top-44 hidden h-28 w-28 rounded-[2rem] border border-primary/20 bg-primary/5 shadow-2xl shadow-primary/10 md:block" />
      <div data-story-orbit className="absolute right-[9%] top-[38%] hidden h-20 w-20 rounded-full border border-accent/25 bg-accent/5 shadow-2xl shadow-accent/10 md:block" />
      <div data-story-orbit className="absolute bottom-24 left-[18%] hidden h-16 w-16 rotate-45 border border-secondary/25 bg-secondary/5 md:block" />

      <div className="container relative z-[2] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-20 max-w-4xl"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.38em] text-primary">Scroll to discover our process</p>
          <h2 className="font-display text-4xl font-black leading-tight md:text-6xl">
            <span className="gradient-text-primary">How RealityOneX</span>{' '}
            <span className="text-white">turns virtual viewing into verified ownership</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A guided journey: immersive discovery first, secure blockchain execution second. Each scroll step reveals the next part of the real-estate tokenization flow.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="lg:sticky lg:top-36 lg:h-[calc(100vh-11rem)]">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 28, rotateX: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className="story-stage-card cinematic-card flex h-full min-h-[32rem] flex-col justify-between p-8 md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-[radial-gradient(circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(45,212,191,0.18),transparent_32%)]" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-primary/20" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-accent/20" />

              <div className="relative z-10">
                <div className="mb-10 flex items-center justify-between gap-6">
                  <motion.span
                    key={`num-${activeStep}`}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-display text-8xl font-black leading-none text-primary/25 md:text-9xl"
                  >
                    {howItWorksSteps[activeStep].number}
                  </motion.span>
                  <motion.div
                    key={`icon-${activeStep}`}
                    initial={{ rotate: -18, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative grid h-20 w-20 place-items-center rounded-[1.75rem] border border-primary/35 bg-primary/10 text-primary shadow-[0_0_45px_rgba(45,212,191,0.25)]"
                  >
                    <div className="absolute inset-[-10px] rounded-[2rem] border border-primary/15 animate-pulse" />
                    <ActiveIcon className="h-9 w-9" />
                  </motion.div>
                </div>

                <p className="mb-4 font-mono text-xs uppercase tracking-[0.32em] text-primary">Active milestone</p>
                <h3 className="font-display text-4xl font-black leading-tight text-white md:text-5xl">
                  {howItWorksSteps[activeStep].title}
                </h3>
                <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
                  {howItWorksSteps[activeStep].description}
                </p>
              </div>

              <div className="relative z-10 mt-10 rounded-3xl border border-white/10 bg-background/45 p-5 font-mono text-xs text-muted-foreground shadow-inner">
                <div className="mb-3 flex items-center justify-between text-primary">
                  <span>Live milestone</span>
                  <span>{activeStep + 1}/{howItWorksSteps.length}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent shadow-[0_0_18px_rgba(45,212,191,0.45)]"
                    animate={{ width: `${((activeStep + 1) / howItWorksSteps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative space-y-10 pb-8">
            <div className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-white/10 md:block">
              <div ref={progressRef} className="h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-accent shadow-[0_0_18px_rgba(45,212,191,0.55)]" />
            </div>

            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <motion.div
                  data-story-step={index}
                  key={step.number}
                  initial={{ opacity: 0, y: 50, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                  className={`story-step-card group relative ml-0 rounded-[2rem] p-7 transition-all duration-500 md:ml-16 ${isActive ? 'cinematic-card story-step-active scale-[1.015]' : 'holo-panel opacity-75 hover:opacity-100'}`}
                >
                  <div className={`absolute -left-[4.6rem] top-8 hidden h-12 w-12 place-items-center rounded-full border bg-background font-mono text-xs transition-all md:grid ${isActive ? 'border-primary text-primary shadow-[0_0_28px_rgba(45,212,191,0.35)]' : 'border-white/15 text-muted-foreground'}`}>
                    {step.number}
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(45,212,191,0.14),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start">
                    <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl transition-all duration-500 ${isActive ? 'bg-primary/15 text-primary shadow-[0_0_32px_rgba(45,212,191,0.22)]' : 'bg-muted/35 text-muted-foreground'}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="mb-2 font-mono text-xs uppercase tracking-[0.32em] text-primary">Step {step.number}</p>
                      <h3 className="font-display text-2xl font-black text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component with GSAP scroll animations
const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !cardsRef.current) return;

    const cards = Array.from(cardsRef.current.children);

    // Set initial states
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 40,
    });
    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.95,
    });

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none none',
          markers: false,
          refreshPriority: -1,
          once: true, // Only animate once for better performance
        },
      });

      // Animate title first (optimized)
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true, // GPU acceleration
      })
      // Then stagger cards (optimized)
      .to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        force3D: true, // GPU acceleration
      }, '-=0.3');

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    } else {
      // Fallback: Use Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
              });
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(sectionRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative grid-pattern overflow-hidden"
      style={{
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      {/* Background Video for Why Choose Section */}
      <WhyChooseBackgroundVideo />
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">
            <span className="gradient-text-primary">Why Choose</span>{' '}
            <span className="text-foreground">RealityOneX?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of real estate investment with blockchain security
            and immersive virtual experiences.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="cinematic-card p-6 group hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/10"
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200"
                >
                  <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors duration-200">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Animated Footer Component with GSAP scroll animation
const AnimatedFooter = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    // Set initial state
    gsap.set(footerRef.current, {
      opacity: 0,
      y: 40,
    });

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to(footerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
          refreshPriority: -1,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    } else {
      // Fallback: Use Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && footerRef.current) {
              gsap.to(footerRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(footerRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div ref={footerRef}>
      <Footer />
    </div>
  );
};

export default Index;
