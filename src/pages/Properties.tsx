import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMetaverseStore } from '@/store/metaverseStore';
import { MapPin, TrendingUp, Users, Coins, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Properties = () => {
  const { properties, selectProperty } = useMetaverseStore();
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Get property image URL based on property type and area
  const getPropertyImage = (property: typeof properties[0]) => {
    // Use Unsplash API with property-specific keywords for realistic images
    const imageMap: Record<string, string> = {
      'dha-001': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'dha-002': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'dha-003': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'clifton-001': 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
      'clifton-002': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'clifton-003': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
      'clifton-004': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'bahria-001': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'bahria-002': 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
      'bahria-003': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'bahria-004': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
      'gulshan-001': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'gulshan-002': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'gulshan-003': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'gulshan-004': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'pechs-001': 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
      'pechs-002': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
      'pechs-003': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      'scheme33-001': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'scheme33-002': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'scheme33-003': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'scheme33-004': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    };

    // Return mapped image or fallback based on property type
    if (imageMap[property.id]) {
      return imageMap[property.id];
    }

    // Fallback: Use property type to generate appropriate image
    const typeMap: Record<string, string> = {
      residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      commercial: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
      plot: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    };

    return typeMap[property.buildingType] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop';
  };

  // Mock data for tokenization
  const getTokenPrice = (property: typeof properties[0]) => {
    return (property.price / property.totalShares).toFixed(0);
  };

  const getTokenizationProgress = (property: typeof properties[0]) => {
    return (property.fractionalShares / property.totalShares) * 100;
  };

  const getInvestorsCount = (property: typeof properties[0]) => {
    // Mock: random investor count based on shares
    return Math.floor(property.fractionalShares / 10) + Math.floor(Math.random() * 50);
  };

  const getGrowthPercentage = () => {
    // Mock: random growth between 5-25%
    return (Math.random() * 20 + 5).toFixed(1);
  };

  useEffect(() => {
    if (!headerRef.current || !filtersRef.current || !gridRef.current) return;

    const cards = Array.from(gridRef.current.children);

    // Set initial states
    gsap.set(headerRef.current, { opacity: 0, y: 30 });
    gsap.set(filtersRef.current, { opacity: 0, y: 20 });
    gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });

    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
          refreshPriority: -1,
        },
      });

      // Animate header (optimized)
      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true,
      })
      // Animate filters (optimized)
      .to(filtersRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        force3D: true,
      }, '-=0.3')
      // Stagger cards (optimized)
      .to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
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
              gsap.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
              });
              gsap.to(filtersRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
              });
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(headerRef.current!);

      return () => {
        observer.disconnect();
      };
    }
  }, [properties]);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div ref={headerRef} className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="gradient-text-primary">Tokenized</span>{' '}
            <span className="text-foreground">Real Estate</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Invest in premium Karachi properties through blockchain tokens. Own fractional shares 
            and earn returns from real estate appreciation.
          </p>
        </div>

        {/* Filter tabs */}
        <div ref={filtersRef} className="flex flex-wrap gap-2 mb-8">
          {['All', 'Residential', 'Commercial', 'Plot', 'Available', 'Sold'].map((filter) => (
            <Button
              key={filter}
              variant={filter === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Property grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => {
            const tokenPrice = getTokenPrice(property);
            const progress = getTokenizationProgress(property);
            const investorsCount = getInvestorsCount(property);
            const growthPercent = getGrowthPercentage();

            return (
              <motion.div
                key={property.id}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => selectProperty(property)}
              >
                {/* Property Image */}
                <div 
                  className="h-56 relative overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40"
                >
                  {/* Property Image */}
                  <img
                    src={getPropertyImage(property)}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.style.background = `linear-gradient(135deg, ${property.color}30, ${property.color}60)`;
                    }}
                  />
                  
                  {/* Gradient overlay for better badge visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-border shadow-lg">
                      {property.buildingType}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4 z-10">
                    <Badge 
                      className={
                        property.status === 'Available' 
                          ? 'bg-green-500/90 text-green-50 border-green-500/50 shadow-lg'
                          : property.status === 'Sold'
                          ? 'bg-red-500/90 text-red-50 border-red-500/50 shadow-lg'
                          : 'bg-yellow-500/90 text-yellow-50 border-yellow-500/50 shadow-lg'
                      }
                    >
                      {property.status}
                    </Badge>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  {/* Property Name + Location */}
                  <h3 className="font-display text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>

                  {/* Property Value */}
                  <div className="mb-4 pb-4 border-b border-border/50">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">Property Value</span>
                    </div>
                    <span className="font-display text-2xl gradient-text-gold">
                      {property.priceInPKR}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {property.priceInSol.toLocaleString()} SOL
                    </p>
                  </div>

                  {/* Token Price */}
                  <div className="mb-4 pb-4 border-b border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Token Price</span>
                      </div>
                      <span className="font-display text-lg text-primary font-semibold">
                        PKR {parseInt(tokenPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tokenization Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Tokenization Progress</span>
                      <span className="text-xs font-medium text-foreground">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {property.fractionalShares} / {property.totalShares} tokens
                      </span>
                    </div>
                  </div>

                  {/* Investors + Growth */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{investorsCount}</p>
                        <p className="text-xs text-muted-foreground">Investors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-semibold">+{growthPercent}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Growth</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="glow"
                      className="flex-1 group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectProperty(property);
                      }}
                    >
                      Invest Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/metaverse/${property.id}`;
                      }}
                    >
                      <Globe className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      3D View
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;