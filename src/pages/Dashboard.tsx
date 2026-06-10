import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Building2, Coins, PieChart, TrendingUp, Wallet, Loader2, Plus, ShieldCheck, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import { DashboardBackgroundVideo } from '@/components/background/DashboardBackgroundVideo';
import { CreatePropertyModal } from '@/components/property/CreatePropertyModal';
import { useState } from 'react';
import { useWalletPropertyHoldings } from '@/hooks/useWalletPropertyHoldings';

const Dashboard = () => {
  const { isWalletConnected, wallet, setWalletBalance, properties, selectProperty } = useMetaverseStore();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const isLocalnet = connection.rpcEndpoint.includes('127.0.0.1')
    || connection.rpcEndpoint.includes('localhost');

  const requestLocalAirdrop = async () => {
    if (!publicKey || !isLocalnet || isAirdropping) return;

    setIsAirdropping(true);
    try {
      const signature = await connection.requestAirdrop(publicKey, 10 * LAMPORTS_PER_SOL);
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }, 'confirmed');

      const lamports = await connection.getBalance(publicKey, 'confirmed');
      setWalletBalance(lamports / LAMPORTS_PER_SOL);
      toast.success('10 localnet SOL added to your connected wallet.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Localnet airdrop failed.';
      toast.error(message);
    } finally {
      setIsAirdropping(false);
    }
  };

  const issuerListings = publicKey
    ? properties.filter((property) => property.owner === publicKey.toBase58())
    : [];
  const { holdings, loading: holdingsLoading, error: holdingsError } = useWalletPropertyHoldings(properties);
  const totalPortfolioLamports = holdings.reduce(
    (total, holding) => total + holding.shares * holding.pricePerShareLamports,
    0,
  );

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-background grid-pattern relative overflow-hidden">
        {/* Background Video */}
        <DashboardBackgroundVideo />
        
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 relative z-[2]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center cinematic-card p-12"
          >
            <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4 text-foreground">
              Connect Your Wallet
            </h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view your property portfolio, track investments,
              and manage your  real estate holdings.
            </p>
            <Button variant="glow" size="lg" onClick={() => setWalletModalVisible(true)}>
              Connect Wallet
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-pattern relative overflow-hidden">
      {/* Background Video */}
      <DashboardBackgroundVideo />
      
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">
                <span className="gradient-text-primary">Dashboard</span>
              </h1>
              <p className="text-muted-foreground font-mono text-xs">
                Welcome back, {wallet?.address}
              </p>
            </div>
            <Button
              variant="glow"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <Building2 className="w-4.5 h-4.5" />
              Tokenize Asset
            </Button>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="cinematic-card p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground">Balance</span>
            </div>
            <div className="font-display text-3xl gradient-text-gold">
              {wallet?.balance.toFixed(2)} <span className="text-lg text-muted-foreground">SOL</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono mt-2">
              Live from {isLocalnet ? 'local validator' : 'active Solana RPC'}
            </p>
            {isLocalnet && publicKey && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1.5"
                disabled={isAirdropping}
                onClick={requestLocalAirdrop}
              >
                {isAirdropping
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Plus className="w-3.5 h-3.5" />}
                Airdrop 10 SOL
              </Button>
            )}
          </div>

          <div className="cinematic-card p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-muted-foreground">Properties Owned</span>
            </div>
            <div className="font-display text-3xl text-foreground">
              {issuerListings.length}
            </div>
          </div>

          <div className="cinematic-card p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-muted-foreground">Fractional Holdings</span>
            </div>
            <div className="font-display text-3xl text-foreground">
              {holdingsLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : holdings.length}
            </div>
          </div>

          <div className="cinematic-card p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="font-display text-3xl gradient-text-gold">
              {(totalPortfolioLamports / LAMPORTS_PER_SOL).toFixed(6)} <span className="text-lg text-muted-foreground">SOL</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono mt-2">At current issuer contract prices</p>
          </div>
        </motion.div>

        {/* Issuer Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-foreground">Your Tokenized Assets</h2>
            <Link to="/properties">
              <Button variant="ghost" size="sm">
                Browse More
              </Button>
            </Link>
          </div>

          {issuerListings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {issuerListings.map((property) => (
                <div key={property.id} className="holo-panel rounded-2xl p-4 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-20 rounded-lg"
                      style={{ backgroundColor: property.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-foreground">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <div className="mt-2">
                        <span className="font-display gradient-text-gold">
                          PKR {property.priceInPKR}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => selectProperty(property)}>
                    View On-Chain Asset
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="cinematic-card p-8 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">This wallet has not issued any tokenized assets.</p>
              <Link to="/properties">
                <Button variant="glow" className="mt-4">
                  Browse Properties
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Fractional Holdings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-xl text-foreground mb-4">Fractional Holdings</h2>

          {holdingsError && (
            <div className="glass-card p-4 mb-4 border border-red-500/40 text-red-400 text-sm">
              Unable to verify holdings: {holdingsError}
            </div>
          )}

          {holdings.length > 0 ? (
            <div className="cinematic-card overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Property</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Shares</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Ownership</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Acquisition Cost</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Current Notional</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr key={holding.property.id} className="border-b border-border/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: holding.property.color }}
                          />
                          <div>
                            <p className="text-foreground font-medium">{holding.property.name}</p>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> On-chain verified
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">
                        {holding.shares.toLocaleString()} / {holding.totalShares.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(holding.shares / holding.totalShares) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {((holding.shares / holding.totalShares) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-4 text-foreground font-mono text-sm">
                        {(holding.totalSpentLamports / LAMPORTS_PER_SOL).toFixed(9)} SOL
                      </td>
                      <td className="p-4 text-right text-foreground font-mono text-sm">
                        {((holding.shares * holding.pricePerShareLamports) / LAMPORTS_PER_SOL).toFixed(9)} SOL
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" disabled title="The deployed contract has no resale instruction.">
                          <LockKeyhole className="w-3 h-3 mr-1" />
                          Resale unavailable
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div className="p-4 border-t border-border/50 text-xs text-muted-foreground">
                Shares and acquisition cost come from your SPL token account and investor receipt PDA. The deployed contract supports primary purchases only; no secondary sale or redemption instruction exists yet.
              </div>
            </div>
          ) : (
            <div className="cinematic-card p-8 text-center">
              <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {holdingsLoading ? 'Reading verified holdings from Solana...' : 'This wallet has no on-chain property shares.'}
              </p>
            </div>
          )}
        </motion.div>
        <CreatePropertyModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </main>
    </div>
  );
};

export default Dashboard;
