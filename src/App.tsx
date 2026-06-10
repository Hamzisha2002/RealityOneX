import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Metaverse from "./pages/Metaverse";
import Properties from "./pages/Properties";
import Dashboard from "./pages/Dashboard";
import Property3DViewer from "./pages/Property3DViewer";
import VRExperience from "./pages/VRExperience";
import NotFound from "./pages/NotFound";
import { PropertyModal } from "./components/property/PropertyModal";
import { BlockchainMonitor } from "./components/blockchain/BlockchainMonitor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMetaverseStore } from "@/store/metaverseStore";
import { useEffect } from "react";

const queryClient = new QueryClient();
const GENESIS_HASH_KEY = "realityonex-ledger-genesis";

const WalletSync = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const connectWallet = useMetaverseStore((s) => s.connectWallet);
  const setWalletBalance = useMetaverseStore((s) => s.setWalletBalance);
  const disconnectWallet = useMetaverseStore((s) => s.disconnectWallet);
  const storeWallet = useMetaverseStore((s) => s.wallet);
  const isSandboxMode = useMetaverseStore((s) => s.isSandboxMode);

  useEffect(() => {
    if (!publicKey) {
      if (storeWallet && !isSandboxMode) {
        disconnectWallet();
      }
      return;
    }

    connectWallet(publicKey.toBase58(), storeWallet?.balance ?? 0);

    const refreshBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey, "confirmed");
        setWalletBalance(lamports / 1e9);
      } catch (err) {
        console.error("Failed to refresh wallet balance:", err);
      }
    };

    void refreshBalance();
    const intervalId = window.setInterval(refreshBalance, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [publicKey, connection, connectWallet, disconnectWallet, setWalletBalance]);

  return null;
};

const LedgerResetSync = () => {
  const { connection } = useConnection();
  const resetMonitorState = useMetaverseStore((s) => s.resetMonitorState);
  const fetchProperties = useMetaverseStore((s) => s.fetchProperties);

  useEffect(() => {
    let cancelled = false;

    const syncLedger = async () => {
      try {
        const genesisHash = await connection.getGenesisHash();
        if (cancelled) return;

        const previousHash = sessionStorage.getItem(GENESIS_HASH_KEY);
        if (previousHash && previousHash !== genesisHash) {
          resetMonitorState();
        }
        sessionStorage.setItem(GENESIS_HASH_KEY, genesisHash);
        await fetchProperties();
      } catch (err) {
        console.error("Failed to synchronize with the active Solana ledger:", err);
      }
    };

    void syncLedger();
    const intervalId = window.setInterval(syncLedger, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [connection, fetchProperties, resetMonitorState]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WalletSync />
        <LedgerResetSync />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/metaverse" element={<Metaverse />} />
          <Route path="/metaverse/:propertyId" element={<Property3DViewer />} />
          <Route path="/vr" element={<VRExperience />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PropertyModal />
        <BlockchainMonitor />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
