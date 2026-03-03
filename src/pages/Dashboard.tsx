import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { useMetaverseStore } from '@/store/metaverseStore';
import { Building2, Coins, PieChart, TrendingUp, Wallet, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { properties } from '@/data/properties';
import { DashboardBackgroundVideo } from '@/components/background/DashboardBackgroundVideo';

const Dashboard = () => {
  const { isWalletConnected, wallet } = useMetaverseStore();

  const ownedProperties = wallet
    ? properties.filter((p) => wallet.ownedProperties.includes(p.id))
    : [];

  const fractionalHoldings = wallet
    ? wallet.fractionalOwnership.map((fo) => ({
        ...properties.find((p) => p.id === fo.propertyId)!,
        shares: fo.shares,
      }))
    : [];

  const totalPortfolioValue = [
    ...ownedProperties.map((p) => p.price),
    ...fractionalHoldings.map((fh) => (fh.price / fh.totalShares) * fh.shares),
  ].reduce((a, b) => a + b, 0);

  const formatPKR = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)} Cr`;
    }
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)} Lac`;
    }
    return value.toLocaleString();
  };

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
            className="max-w-lg mx-auto text-center glass-card p-12"
          >
            <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4 text-foreground">
              Connect Your Wallet
            </h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view your property portfolio, track investments,
              and manage your  real estate holdings.
            </p>
            <Button variant="glow" size="lg" onClick={() => useMetaverseStore.getState().connectWallet()}>
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
          <h1 className="font-display text-4xl font-bold mb-2">
            <span className="gradient-text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {wallet?.address}
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground">Balance</span>
            </div>
            <div className="font-display text-3xl gradient-text-gold">
              {wallet?.balance.toFixed(2)} <span className="text-lg text-muted-foreground">SOL</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-muted-foreground">Properties Owned</span>
            </div>
            <div className="font-display text-3xl text-foreground">
              {ownedProperties.length}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-muted-foreground">Fractional Holdings</span>
            </div>
            <div className="font-display text-3xl text-foreground">
              {fractionalHoldings.length}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-muted-foreground">Portfolio Value</span>
            </div>
            <div className="font-display text-3xl gradient-text-gold">
              PKR {formatPKR(totalPortfolioValue)}
            </div>
          </div>
        </motion.div>

        {/* Owned Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-foreground">Owned Properties</h2>
            <Link to="/properties">
              <Button variant="ghost" size="sm">
                Browse More
              </Button>
            </Link>
          </div>

          {ownedProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedProperties.map((property) => (
                <div key={property.id} className="glass-card p-4">
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
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View NFT
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      List for Sale
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You don't own any properties yet.</p>
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

          {fractionalHoldings.length > 0 ? (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Property</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Shares</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Ownership</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {fractionalHoldings.map((holding) => (
                    <tr key={holding.id} className="border-b border-border/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: holding.color }}
                          />
                          <div>
                            <p className="text-foreground font-medium">{holding.name}</p>
                            <p className="text-xs text-muted-foreground">{holding.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">
                        {holding.shares} / {holding.totalShares}
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
                      <td className="p-4 text-right">
                        <span className="gradient-text-gold font-display">
                          PKR {formatPKR((holding.price / holding.totalShares) * holding.shares)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No fractional holdings yet.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;