import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaverseStore } from '@/store/metaverseStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WalletConnect = () => {
  const { isWalletConnected, wallet, connectWallet, disconnectWallet } = useMetaverseStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    connectWallet();
    setIsConnecting(false);
  };

  if (isWalletConnected && wallet) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <div className="glass-card px-4 py-2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Connected</span>
            <span className="text-sm font-mono text-foreground">{wallet.address}</span>
          </div>
          <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-accent/20 rounded">
            <span className="text-accent font-bold">{wallet.balance.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">SOL</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={disconnectWallet}>
          <LogOut className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      variant="neon"
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};
