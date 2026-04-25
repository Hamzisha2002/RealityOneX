import { useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

/** Solana Devnet — public RPC */
const DEVNET_RPC_ENDPOINT = "https://api.devnet.solana.com";

type WalletContextProviderProps = {
  children: ReactNode;
};

/**
 * Wraps the app with Solana connection, wallet (Phantom first), and modal UI.
 */
export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={DEVNET_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
