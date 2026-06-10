import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, MapPin, Users, ExternalLink, Coins, Building2, Globe, Copy, Check, Link2, ShieldCheck, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PropertyChainData, usePropertyChainData } from '@/hooks/usePropertyChainData';

export const PropertyModal = () => {
  const { selectedProperty, showPropertyModal, setShowPropertyModal } = useMetaverseStore();
  const purchaseFractionalShares = useMetaverseStore((s) => s.purchaseFractionalShares);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const blockchainBackdropRef = useRef<HTMLDivElement>(null);
  const blockchainModalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showBlockchainExplorer, setShowBlockchainExplorer] = useState(false);
  const [sharesToBuy, setSharesToBuy] = useState(10);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const { data: blockchainData, loading: blockchainLoading, error: blockchainError } = usePropertyChainData(selectedProperty);

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
  const verifiedTotalShares = blockchainData?.totalSupply ?? selectedProperty.totalShares;
  const verifiedAvailableShares = blockchainData?.availableShares
    ?? (selectedProperty.totalShares - selectedProperty.fractionalShares);
  const verifiedSoldShares = verifiedTotalShares - verifiedAvailableShares;
  const tokenizationProgress = verifiedTotalShares > 0
    ? (verifiedSoldShares / verifiedTotalShares) * 100
    : 0;
  const contractPricePerShareSol = blockchainData
    ? blockchainData.pricePerShareLamports / 1_000_000_000
    : null;
  const contractPurchaseCostSol = contractPricePerShareSol === null
    ? null
    : contractPricePerShareSol * sharesToBuy;

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
                  Declared listing value
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
                  <span className="font-semibold text-foreground">{verifiedSoldShares}</span> of <span className="font-semibold text-foreground">{verifiedTotalShares}</span> tokens sold
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
                  <span className="text-sm text-muted-foreground">Issuer Wallet</span>
                  <span className="font-mono text-sm text-primary font-medium">{selectedProperty.owner}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {verifiedAvailableShares > 0 && (
                <div className="glass-card p-4 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Fractions to Buy</span>
                    <span className="text-xs font-semibold text-primary">
                      {verifiedAvailableShares} shares available
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-muted/40 p-3">
                      <div className="text-muted-foreground mb-1">You receive</div>
                      <div className="font-mono text-foreground">{sharesToBuy} SPL property tokens</div>
                    </div>
                    <div className="rounded-md bg-muted/40 p-3">
                      <div className="text-muted-foreground mb-1">Payment destination</div>
                      <div className="font-mono text-foreground break-all">{selectedProperty.owner}</div>
                    </div>
                    <div className="rounded-md bg-muted/40 p-3">
                      <div className="text-muted-foreground mb-1">Contract charge</div>
                      <div className="font-mono text-foreground">
                        {contractPurchaseCostSol === null ? 'Loading from contract...' : `${contractPurchaseCostSol.toFixed(9)} SOL`}
                      </div>
                    </div>
                    <div className="rounded-md bg-muted/40 p-3">
                      <div className="text-muted-foreground mb-1">Settlement</div>
                      <div className="text-foreground flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-green-400" /> Atomic SOL + token transfer
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200 flex gap-2">
                    <LockKeyhole className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>This deployed contract supports primary purchases only. These shares cannot currently be resold or redeemed through this app.</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="1"
                      max={verifiedAvailableShares}
                      value={sharesToBuy}
                      onChange={(e) => setSharesToBuy(Math.max(1, Math.min(verifiedAvailableShares, parseInt(e.target.value) || 1)))}
                      className="bg-muted/50 border border-border/50 text-foreground px-3 py-2 rounded-lg font-mono text-sm w-24 focus:outline-none focus:border-primary"
                    />
                    <Button
                      variant="glow"
                      className="flex-1"
                      onClick={async () => {
                        setIsPurchasing(true);
                        const ok = await purchaseFractionalShares(selectedProperty.id, sharesToBuy, connection, wallet);
                        setIsPurchasing(false);
                        if (ok) {
                          handleClose();
                        }
                      }}
                      disabled={isPurchasing || verifiedAvailableShares <= 0 || !wallet.connected || contractPurchaseCostSol === null}
                    >
                      {isPurchasing ? 'Processing...' : wallet.connected ? `Buy ${sharesToBuy} Shares` : 'Connect Wallet to Buy'}
                    </Button>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono flex justify-between">
                    <span>Estimated Cost:</span>
                    <span>
                      {((selectedProperty.price / selectedProperty.totalShares) * sharesToBuy).toLocaleString(undefined, {maximumFractionDigits:0})} PKR
                      {contractPurchaseCostSol !== null && (
                        <> · {contractPurchaseCostSol.toFixed(9)} SOL charged on-chain</>
                      )}
                    </span>
                  </div>
                </div>
              )}
              {verifiedAvailableShares === 0 && (
                <div className="w-full text-center py-3">
                  <Badge className={statusColors.Sold} variant="outline">
                    Property Sold
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
      {showBlockchainExplorer && (
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
              loading={blockchainLoading}
              error={blockchainError}
              rpcEndpoint={connection.rpcEndpoint}
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
  blockchainData: PropertyChainData | null;
  loading: boolean;
  error: string | null;
  rpcEndpoint: string;
  onClose: () => void;
}

const BlockchainExplorerContent = ({ property, blockchainData, loading, error, rpcEndpoint, onClose }: BlockchainExplorerContentProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const latestTransaction = blockchainData?.transactions[0];
  const isLocalnet = rpcEndpoint.includes('127.0.0.1') || rpcEndpoint.includes('localhost');
  const networkName = isLocalnet ? 'Solana Localnet' : 'Solana Devnet';

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
            <span className="text-xs text-purple-400 font-medium">{networkName} · RPC verified</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {loading && (
        <div className="glass-card p-8 border border-border/50 text-center text-muted-foreground mb-6">
          Loading verified on-chain data from {rpcEndpoint}...
        </div>
      )}

      {error && !loading && (
        <div className="glass-card p-4 border border-yellow-500/40 text-yellow-400 mb-6 font-mono text-xs">
          Unable to verify this listing on-chain: {error}
        </div>
      )}

      {blockchainData && !loading && (
      <>
      {/* Solana Token Information */}
      <div className="space-y-4 mb-6">
        <div className="glass-card p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Property State PDA</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border border-border/50 break-all">
              {blockchainData.propertyPda}
            </code>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(blockchainData.propertyPda, 'property')}>
              {copied === 'property' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

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
            <h3 className="font-semibold text-foreground">Property Vault Address</h3>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm bg-muted/50 px-3 py-2 rounded border border-border/50 break-all">
              {blockchainData.vaultAddress}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(blockchainData.vaultAddress, 'account')}
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
              {latestTransaction?.slot.toLocaleString() ?? 'No transaction indexed'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Solana Slot</div>
          </div>

          <div className="glass-card p-4 border border-border/50">
            <div className="text-xs text-muted-foreground mb-2">Minted Date</div>
            <div className="text-sm font-semibold text-foreground">
              {latestTransaction?.blockTime
                ? new Date(latestTransaction.blockTime * 1000).toLocaleDateString()
                : 'Unavailable'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {latestTransaction?.blockTime
                ? new Date(latestTransaction.blockTime * 1000).toLocaleTimeString()
                : 'RPC did not provide block time'}
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
              {latestTransaction?.signature ?? 'No transaction signature indexed for this property PDA'}
            </code>
            <Button
              variant="ghost"
              size="icon"
              disabled={!latestTransaction}
              onClick={() => latestTransaction && copyToClipboard(latestTransaction.signature, 'tx')}
            >
              {copied === 'tx' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Latest confirmed transaction involving the property PDA
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
              {blockchainData.totalSupply.toLocaleString()} tokens
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Token Standard</div>
            <div className="text-lg font-semibold text-primary">SPL Token</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-lg font-semibold text-foreground">{networkName}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Token Price</div>
            <div className="text-lg font-semibold text-primary">
              {(blockchainData.pricePerShareLamports / 1_000_000_000).toFixed(9)} SOL
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {blockchainData.pricePerShareLamports.toLocaleString()} lamports stored by the contract
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Vault balance:</span>
              <span className="font-semibold text-accent ml-2">{blockchainData.vaultBalance.toLocaleString()} tokens</span>
            </div>
            <div>
              <span className="text-muted-foreground">On-chain holders:</span>
              <span className="font-semibold text-accent ml-2">{blockchainData.holderCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isLocalnet && (
      <div className="flex gap-3">
        <Button
          variant="default"
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          onClick={() => {
            window.open(`https://solscan.io/token/${blockchainData.mintAddress}?cluster=devnet`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Solscan
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            window.open(`https://explorer.solana.com/address/${blockchainData.mintAddress}?cluster=devnet`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Solana Explorer
        </Button>
      </div>
      )}
      <div className="mt-3">
        <Button
          variant="ghost"
          className="w-full"
          disabled={!latestTransaction || isLocalnet}
          onClick={() => {
            if (latestTransaction) {
              window.open(`https://solscan.io/tx/${latestTransaction.signature}?cluster=devnet`, '_blank');
            }
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {!latestTransaction
            ? 'No indexed transaction available'
            : isLocalnet
            ? 'Localnet transaction verified through RPC'
            : 'View Transaction Details'}
        </Button>
      </div>
      </>
      )}
    </div>
  );
};
