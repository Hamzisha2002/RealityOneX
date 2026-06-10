import { useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const isLocalBrowser = typeof window !== "undefined"
  && ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
const publicOrigin = typeof window !== "undefined" ? window.location.origin : "";
const publicWsOrigin = publicOrigin.replace(/^http/, "ws");

const RPC_ENDPOINT = import.meta.env.VITE_SOLANA_RPC_URL
  || (isLocalBrowser ? "http://127.0.0.1:8899" : "https://startup-plywood-escalator.ngrok-free.dev");
const WS_ENDPOINT = import.meta.env.VITE_SOLANA_WS_URL
  || (isLocalBrowser ? "ws://127.0.0.1:8900" : `${publicWsOrigin}/solana-ws`);

type WalletContextProviderProps = {
  children: ReactNode;
};

/**
 * Wraps the app with Solana connection, wallet (Phantom first), and modal UI.
 */
export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT} config={WS_ENDPOINT ? { wsEndpoint: WS_ENDPOINT } : undefined}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
