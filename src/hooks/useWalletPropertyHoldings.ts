import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js';
import { Property } from '@/types/property';
import {
  getAssociatedTokenAddress,
  getInvestorReceiptPda,
  getProgram,
  getPropertyPda,
} from '@/lib/solanaClient';

export interface WalletPropertyHolding {
  property: Property;
  shares: number;
  totalShares: number;
  pricePerShareLamports: number;
  totalSpentLamports: number;
  tokenAccount: string;
  receiptPda: string;
  latestTransaction: ConfirmedSignatureInfo | null;
}

interface WalletPropertyHoldingsState {
  holdings: WalletPropertyHolding[];
  loading: boolean;
  error: string | null;
}

export const useWalletPropertyHoldings = (properties: Property[]): WalletPropertyHoldingsState => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [state, setState] = useState<WalletPropertyHoldingsState>({
    holdings: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchHoldings = async () => {
      if (!publicKey) {
        setState({ holdings: [], loading: false, error: null });
        return;
      }

      const chainProperties = properties.filter((property) => property.owner && property.mintAddress);
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const readOnlyWallet = {
          publicKey,
          signTransaction: async () => {
            throw new Error('Read-only wallet cannot sign transactions.');
          },
          signAllTransactions: async () => {
            throw new Error('Read-only wallet cannot sign transactions.');
          },
        };
        const program = getProgram(connection, readOnlyWallet);

        const results = await Promise.all(chainProperties.map(async (property) => {
          const owner = new PublicKey(property.owner!);
          const mint = new PublicKey(property.mintAddress!);
          const propertyPda = getPropertyPda(owner, property.id);
          const tokenAccount = getAssociatedTokenAddress(mint, publicKey);
          const receiptPda = getInvestorReceiptPda(propertyPda, publicKey);

          const [tokenBalance, propertyAccount, receiptAccount, signatures] = await Promise.all([
            connection.getTokenAccountBalance(tokenAccount, 'confirmed').catch(() => null),
            program.account.propertyState.fetch(propertyPda),
            program.account.investorReceipt.fetchNullable(receiptPda),
            connection.getSignaturesForAddress(receiptPda, { limit: 1 }, 'confirmed'),
          ]);

          const shares = Number(tokenBalance?.value.amount ?? 0);
          if (shares <= 0) return null;

          return {
            property,
            shares,
            totalShares: Number(propertyAccount.totalShares),
            pricePerShareLamports: Number(propertyAccount.pricePerShare),
            totalSpentLamports: Number(receiptAccount?.totalSpent ?? 0),
            tokenAccount: tokenAccount.toBase58(),
            receiptPda: receiptPda.toBase58(),
            latestTransaction: signatures[0] ?? null,
          } satisfies WalletPropertyHolding;
        }));

        if (!cancelled) {
          setState({
            holdings: results.filter((holding): holding is WalletPropertyHolding => holding !== null),
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            holdings: [],
            loading: false,
            error: err instanceof Error ? err.message : 'Unable to read wallet holdings from Solana.',
          });
        }
      }
    };

    void fetchHoldings();
    const intervalId = window.setInterval(fetchHoldings, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [connection, publicKey, properties]);

  return state;
};
