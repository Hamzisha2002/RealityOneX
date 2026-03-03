import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, MapPin, Users, TrendingUp, ExternalLink, ShoppingCart, Coins, Building2, Globe, Copy, Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';

export const PropertyModal = () => {
  const { selectedProperty, showPropertyModal, setShowPropertyModal, isWalletConnected, purchaseProperty } = useMetaverseStore();
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const blockchainBackdropRef = useRef<HTMLDivElement>(null);
  const blockchainModalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showBlockchainExplorer, setShowBlockchainExplorer] = useState(false);

  // Scroll lock when modal is open
  useEffect(() => {
    if (showPropertyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPropertyModal]);

  // GSAP animations
  useEffect(() => {
    if (!showPropertyModal || !backdropRef.current || !modalRef.current) return;

    const backdrop = backdropRef.current;
    const modal = modalRef.current;

    // Set initial state
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(modal, { opacity: 0, scale: 0.95 });

    // Animate in
    const tl = gsap.timeline();
    tl.to(backdrop, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
    tl.to(
      modal,
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, [showPropertyModal]);

  // Handle ESC key
  useEffect(() => {
    if (!showPropertyModal) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showPropertyModal, setShowPropertyModal]);

  const handleClose = () => {
    if (!backdropRef.current || !modalRef.current) {
      setShowPropertyModal(false);
      return;
    }

    const backdrop = backdropRef.current;
    const modal = modalRef.current;

    const tl = gsap.timeline({
      onComplete: () => setShowPropertyModal(false),
    });

    tl.to(modal, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in',
    });
    tl.to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.1'
    );
  };

  const handlePurchase = () => {
    if (isWalletConnected) {
      purchaseProperty(selectedProperty.id);
      handleClose();
    }
  };

  // Blockchain Explorer Modal handlers
  const handleOpenBlockchainExplorer = () => {
    setShowBlockchainExplorer(true);
  };

  const handleCloseBlockchainExplorer = () => {
    if (!blockchainBackdropRef.current || !blockchainModalRef.current) {
      setShowBlockchainExplorer(false);
      return;
    }

    const backdrop = blockchainBackdropRef.current;
    const modal = blockchainModalRef.current;

    const tl = gsap.timeline({
      onComplete: () => setShowBlockchainExplorer(false),
    });

    tl.to(modal, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in',
    });
    tl.to(
      backdrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.1'
    );
  };

  // Generate mock Solana blockchain data
  const generateBlockchainData = () => {
    // Solana addresses are base58 encoded, typically 32-44 characters
    const generateSolanaAddress = () => {
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };
    
    const mintAddress = generateSolanaAddress();
    const tokenAccount = generateSolanaAddress();
    const txSignature = generateSolanaAddress();
    
    return {
      mintAddress,
      tokenAccount,
      txSignature,
      slot: Math.floor(Math.random() * 200000000) + 100000000,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  };

  const blockchainData = selectedProperty ? generateBlockchainData() : null;

  if (!selectedProperty || !showPropertyModal) return null;

  // Get property image (same function as in Properties page)
  const getPropertyImage = (property: typeof selectedProperty) => {
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
    return imageMap[property.id] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop';
  };

  const tokenPrice = (selectedProperty.price / selectedProperty.totalShares).toFixed(0);
  const tokenizationProgress = (selectedProperty.fractionalShares / selectedProperty.totalShares) * 100;

  const buildingTypeColors: Record<string, string> = {
    residential: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    commercial: 'bg-primary/20 text-primary border-primary/30',
    mixed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    landmark: 'bg-accent/20 text-accent border-accent/30',
    plot: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const statusColors: Record<string, string> = {
    Available: 'bg-green-500/20 text-green-400 border-green-500/30',
    Sold: 'bg-red-500/20 text-red-400 border-red-500/30',
    Reserved: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        pointerEvents: showPropertyModal ? 'auto' : 'none',
        zIndex: 50,
      }}
    >
      {/* Backdrop Overlay */}
      <div
        ref={backdropRef}
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 40,
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-[calc(100%-2rem)] sm:w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-modal-title"
        style={{
          pointerEvents: 'auto',
          zIndex: 50,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
        }}
      >
        <div className="glass-card-glow overflow-hidden">
          {/* Property Image */}
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={getPropertyImage(selectedProperty)}
              alt={selectedProperty.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = `linear-gradient(135deg, ${selectedProperty.color}40, ${selectedProperty.color}60)`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm hover:bg-background z-10"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Badges on Image */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Badge className={buildingTypeColors[selectedProperty.buildingType]}>
                {selectedProperty.buildingType}
              </Badge>
              <Badge className={statusColors[selectedProperty.status]}>
                {selectedProperty.status}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title and Location */}
            <div className="mb-4">
              <h2 id="property-modal-title" className="font-display text-3xl font-bold text-foreground mb-2">
                {selectedProperty.name}
              </h2>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{selectedProperty.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {selectedProperty.description}
            </p>

            {/* Financial Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Property Value */}
              <div className="glass-card p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Property Value</span>
                </div>
                <div className="font-display text-2xl gradient-text-gold mb-1">
                  {selectedProperty.priceInPKR}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedProperty.priceInSol.toLocaleString()} SOL
                </p>
              </div>

              {/* Token Price */}
              <div className="glass-card p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Token Price</span>
                </div>
                <div className="font-display text-2xl text-primary font-semibold mb-1">
                  PKR {parseInt(tokenPrice).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per share
                </p>
              </div>
            </div>

            {/* Tokenization Progress */}
            <div className="glass-card p-4 mb-6 border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Tokenization Progress</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {tokenizationProgress.toFixed(1)}%
                </span>
              </div>
              <Progress value={tokenizationProgress} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">{selectedProperty.fractionalShares}</span> of <span className="font-semibold text-foreground">{selectedProperty.totalShares}</span> tokens sold
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProperty.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="outline"
                    className="px-3 py-1 bg-muted/50 text-foreground border-border/50"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Owner Info */}
            {selectedProperty.owner && (
              <div className="glass-card p-4 mb-6 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Owner</span>
                  <span className="font-mono text-sm text-primary font-medium">{selectedProperty.owner}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {selectedProperty.status === 'Available' && selectedProperty.isForSale && (
                <Button
                  variant="glow"
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={!isWalletConnected}
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isWalletConnected ? 'Purchase Property' : 'Connect Wallet to Buy'}
                </Button>
              )}
              {selectedProperty.status === 'Available' && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    // Handle buy shares action
                    setShowPropertyModal(false);
                  }}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy Fractional Shares
                </Button>
              )}
              {selectedProperty.status === 'Sold' && (
                <div className="w-full text-center py-3">
                  <Badge className={statusColors.Sold} variant="outline">
                    Property Sold
                  </Badge>
                </div>
              )}
              {selectedProperty.status === 'Reserved' && (
                <div className="w-full text-center py-3">
                  <Badge className={statusColors.Reserved} variant="outline">
                    Property Reserved
                  </Badge>
                </div>
              )}
              
              <Button 
                variant="default" 
                className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600" 
                size="lg"
                onClick={() => {
                  setShowPropertyModal(false);
                  navigate(`/metaverse/${selectedProperty.id}`);
                }}
              >
                <Globe className="w-4 h-4" />
                Explore in 3D Metaverse
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full gap-2 hover:bg-muted/50" 
                size="lg"
                onClick={handleOpenBlockchainExplorer}
              >
                <ExternalLink className="w-4 h-4" />
                View on Blockchain Explorer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Explorer Modal */}
      {showBlockchainExplorer && blockchainData && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ 
            pointerEvents: 'auto',
            zIndex: 60,
          }}
        >
          {/* Backdrop */}
          <div
            ref={blockchainBackdropRef}
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 59,
            }}
            onClick={handleCloseBlockchainExplorer}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            ref={blockchainModalRef}
            className="relative w-[calc(100%-2rem)] sm:w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card-glow"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              pointerEvents: 'auto',
              zIndex: 60,
            }}
          >
            <BlockchainExplorerContent 
              property={selectedProperty} 
              blockchainData={blockchainData}
              onClose={handleCloseBlockchainExplorer}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Blockchain Explorer Content Component
interface BlockchainExplorerContentProps {
  property: Property;
  blockchainData: {
    mintAddress: string;
    tokenAccount: string;
    txSignature: string;
    slot: number;
    timestamp: string;
  };
  onClose: () => void;
}

const BlockchainExplorerContent = ({ property, blockchainData, onClose }: BlockchainExplorerContentProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;
    
    gsap.fromTo(modalRef.current, 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div ref={modalRef} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Solana Blockchain Explorer
          </h2>
          <p className="text-sm text-muted-foreground">{property.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs text-purple-400 font-medium">Solana Network</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Solana Token Information */}
      <div className="space-y-4 mb-6">
        <div className="glass-card p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Token Mint Address</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border border-border/50 break-all">
              {blockchainData.mintAddress}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(blockchainData.mintAddress, 'mint')}
            >
              {copied === 'mint' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            SPL Token Mint Address
          </div>
        </div>

        <div className="glass-card p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-5 h-5 text-secondary" />
            <h3 className="font-semibold text-foreground">Token Account Address</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border border-border/50 break-all">
              {blockchainData.tokenAccount}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(blockchainData.tokenAccount, 'account')}
            >
              {copied === 'account' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 border border-border/50">
            <div className="text-xs text-muted-foreground mb-2">Slot Number</div>
            <div className="font-mono text-lg font-semibold text-foreground">
              {blockchainData.slot.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Solana Slot</div>
          </div>

          <div className="glass-card p-4 border border-border/50">
            <div className="text-xs text-muted-foreground mb-2">Minted Date</div>
            <div className="text-sm font-semibold text-foreground">
              {new Date(blockchainData.timestamp).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(blockchainData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Transaction Signature</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border border-border/50 break-all">
              {blockchainData.txSignature}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(blockchainData.txSignature, 'tx')}
            >
              {copied === 'tx' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Initial mint transaction
          </div>
        </div>
      </div>

      {/* Token Information */}
      <div className="glass-card p-4 border border-border/50 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Token Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total Supply</div>
            <div className="text-lg font-semibold text-foreground">
              {property.totalShares.toLocaleString()} tokens
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Token Standard</div>
            <div className="text-lg font-semibold text-primary">SPL Token</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-lg font-semibold text-foreground">Solana Mainnet</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Token Price</div>
            <div className="text-lg font-semibold text-primary">
              {((property.price / property.totalShares) / 100).toFixed(4)} SOL
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              PKR {parseInt((property.price / property.totalShares).toFixed(0)).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Coins className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Purchase with:</span>
            <span className="font-semibold text-accent">SOL (Solana)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="default"
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          onClick={() => {
            window.open(`https://solscan.io/token/${blockchainData.mintAddress}`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Solscan
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            window.open(`https://explorer.solana.com/address/${blockchainData.mintAddress}`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Solana Explorer
        </Button>
      </div>
      <div className="mt-3">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            window.open(`https://solscan.io/tx/${blockchainData.txSignature}`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Transaction Details
        </Button>
      </div>
    </div>
  );
};