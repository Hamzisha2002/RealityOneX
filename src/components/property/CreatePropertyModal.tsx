import { useState } from 'react';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePropertyModal = ({ isOpen, onClose }: CreatePropertyModalProps) => {
  const listProperty = useMetaverseStore((s) => s.listProperty);
  const { connection } = useConnection();
  const wallet = useWallet();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(30000000); // 3 Crore default
  const [pricePerShareLamports, setPricePerShareLamports] = useState(30000);
  const [totalFractions, setTotalFractions] = useState(1000);
  const [buildingType, setBuildingType] = useState<'residential' | 'commercial' | 'plot' | 'landmark' | 'mixed'>('residential');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || price <= 0 || totalFractions <= 0 || pricePerShareLamports <= 0 || !wallet.connected) return;

    setLoading(true);
    const success = await listProperty(
      {
        title,
        description,
        price,
        pricePerShareLamports,
        totalFractions,
        buildingType,
      },
      connection,
      wallet
    );
    setLoading(false);

    if (success) {
      // Reset form
      setTitle('');
      setDescription('');
      setPrice(30000000);
      setPricePerShareLamports(30000);
      setTotalFractions(1000);
      setBuildingType('residential');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden p-0 sm:max-w-[480px] bg-background/95 border border-border/80 backdrop-blur-xl font-sans text-foreground">
        <DialogHeader className="shrink-0 px-6 pb-2 pt-6">
          <DialogTitle className="font-display text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Tokenize Real Estate Asset
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-sans">
            Mints a new SPL Token on the Solana ledger representing fractionalized shares of the property.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col font-sans">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-2">
          <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex gap-3 text-xs text-green-400 font-mono items-center">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Live tokenization only. Your connected wallet must sign the Anchor transaction.</span>
          </div>

          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Property Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DHA Phase 6 - Penthouse Suite"
              required
              className="bg-muted/30 border-border/50 focus:border-primary text-sm font-sans"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key details about architecture, sea views, amenities..."
              required
              className="bg-muted/30 border-border/50 focus:border-primary text-sm h-20 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price" className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Value (PKR)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Math.max(1, parseInt(e.target.value) || 0))}
                required
                className="bg-muted/30 border-border/50 focus:border-primary text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fractions" className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Total Fractions</Label>
              <Input
                id="fractions"
                type="number"
                value={totalFractions}
                onChange={(e) => setTotalFractions(Math.max(1, parseInt(e.target.value) || 0))}
                required
                className="bg-muted/30 border-border/50 focus:border-primary text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="onChainPrice" className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
              On-Chain Price Per Share (Lamports)
            </Label>
            <Input
              id="onChainPrice"
              type="number"
              min="1"
              step="1"
              value={pricePerShareLamports}
              onChange={(e) => setPricePerShareLamports(Math.max(1, parseInt(e.target.value) || 0))}
              required
              className="bg-muted/30 border-border/50 focus:border-primary text-sm font-mono"
            />
            <p className="text-[10px] text-muted-foreground font-mono">
              Buyers will be charged {(pricePerShareLamports / 1_000_000_000).toFixed(9)} SOL per share by the smart contract.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label htmlFor="type" className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Building Type</Label>
              <Select
                value={buildingType}
                onValueChange={(value) => setBuildingType(value as typeof buildingType)}
              >
                <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary text-sm font-sans">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border-border">
                  <SelectItem value="residential">Residential Tower</SelectItem>
                  <SelectItem value="commercial">Commercial Office</SelectItem>
                  <SelectItem value="plot">Farmhouse / Plot</SelectItem>
                  <SelectItem value="landmark">Metaverse Landmark</SelectItem>
                  <SelectItem value="mixed">Mixed Use Building</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/20 p-3 rounded-lg border border-border/30 font-mono text-[10px] text-muted-foreground space-y-1 mt-2">
            <div className="flex justify-between gap-4">
              <span>Declared PKR Value / Share:</span>
              <span className="text-foreground font-semibold">
                PKR {Math.round(price / totalFractions).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Network Fee:</span>
              <span className="text-right text-foreground font-semibold">Calculated by wallet before signing</span>
            </div>
          </div>

          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 bg-background/95 px-6 py-4">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading} className="font-sans text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              disabled={loading || !wallet.connected}
              className="gap-2 text-xs font-sans font-semibold"
            >
              {loading ? (
                'Submitting On-Chain...'
              ) : (
                <>
                  Tokenize & List Asset
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
