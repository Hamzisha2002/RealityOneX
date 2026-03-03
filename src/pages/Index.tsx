import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Coins, Shield, Users, Zap, Globe, Search, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackgroundVideo } from '@/components/background/BackgroundVideo';
import { ParticleTextBackground } from '@/components/background/ParticleTextBackground';
import { WhyChooseBackgroundVideo } from '@/components/background/WhyChooseBackgroundVideo';
import { SharedBackgroundVideo } from '@/components/background/SharedBackgroundVideo';
import { ParticleText3D } from '@/components/text/ParticleText3D';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollPerformance } from '@/hooks/useScrollPerformance';

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
    title: 'NFT Tokenization',
    description: 'Every property is a unique NFT on the blockchain',
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

const stats = [
  { value: 'PKR 50Cr+', label: 'Total Volume' },
  { value: '2,847', label: 'Properties Listed' },
  { value: '15,200+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
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
    icon: TrendingUp,
    title: 'Earn Returns',
    description: 'Receive passive income and capital appreciation as property values increase over time.',
  },
  {
    number: '04',
    icon: RefreshCw,
    title: 'Trade Anytime',
    description: 'Liquidate your tokens instantly on our marketplace whenever you want to exit.',
  },
];

const Index = () => {
  // Optimize scroll performance globally
  useScrollPerformance();
  
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6 hover:border-primary/30 transition-colors duration-300 cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground"> Decentralized Metaverse Real Estate Platform</span>
            </motion.div>

            {/* PRIMARY TITLE - Three.js Particle Text */}
            <div className="relative h-32 md:h-40 mb-6">
              <ParticleText3D />
              {/* Hidden HTML for accessibility */}
              <h1 className="sr-only">RealityOneX</h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Own, explore, and invest in tokenized real estate  inside the metaverse
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/metaverse">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="glow" size="xl" className="gap-2 w-full sm:w-auto">
                    Enter Metaverse
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/properties">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-background/70 hover:border-primary/50 transition-all duration-300">
                    Explore  Properties
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
                className="glass-card p-6 text-center cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
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
        <HowItWorksSection />

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
      <div className="container mx-auto px-4 relative z-[2]">
        <div ref={contentRef}>
          <motion.div
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            className="glass-card-glow p-12 text-center max-w-4xl mx-auto cursor-pointer hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-500"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h2 
              className="font-display text-4xl font-bold mb-4 text-foreground"
              style={{
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              Ready to Invest in  Digital Future?
            </h2>
            <p 
              className="text-muted-foreground mb-8 max-w-xl mx-auto"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
              }}
            >
              Connect your wallet and start exploring premium virtual real estate opportunities today.
            </p>
            <Link to="/metaverse">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="glow" size="xl" className="gap-2">
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
            Own, earn, and trade property tokens seamlessly.
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
                className="glass-card p-6 group hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-primary/10"
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