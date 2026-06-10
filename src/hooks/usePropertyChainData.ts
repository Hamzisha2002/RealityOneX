import { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js';
import { Property } from '@/types/property';
import {
  getPropertyMintPda,
  getPropertyPda,
  getPropertyVaultPda,
  getProgram,
  TOKEN_PROGRAM_ID,
} from '@/lib/solanaClient';

export interface PropertyChainData {
  propertyPda: string;
  mintAddress: string;
  vaultAddress: string;
  totalSupply: number;
  vaultBalance: number;
  holderCount: number;
  availableShares: number;
  pricePerShareLamports: number;
  transactions: ConfirmedSignatureInfo[];
}

interface PropertyChainDataState {
  data: PropertyChainData | null;
  loading: boolean;
  error: string | null;
}

export const usePropertyChainData = (property: Property | null): PropertyChainDataState => {
  const { connection } = useConnection();
  const [state, setState] = useState<PropertyChainDataState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchChainData = async () => {
      if (!property?.owner || !property.mintAddress) {
        setState({
          data: null,
          loading: false,
          error: 'This listing does not have enough on-chain address data.',
        });
        return;
      }

      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const owner = new PublicKey(property.owner);
        const storedMint = new PublicKey(property.mintAddress);
        const propertyPda = getPropertyPda(owner, property.id);
        const derivedMint = getPropertyMintPda(propertyPda);
        const vault = getPropertyVaultPda(propertyPda);

        if (!derivedMint.equals(storedMint)) {
          throw new Error('Stored mint does not match the mint derived by the Anchor program.');
        }

        const readOnlyWallet = {
          publicKey: owner,
          signTransaction: async () => {
            throw new Error('Read-only wallet cannot sign transactions.');
          },
          signAllTransactions: async () => {
            throw new Error('Read-only wallet cannot sign transactions.');
          },
        };
        const program = getProgram(connection, readOnlyWallet);

        const [propertyAccount, mintSupply, vaultBalance, tokenAccounts, transactions] = await Promise.all([
          program.account.propertyState.fetch(propertyPda),
          connection.getTokenSupply(storedMint, 'confirmed'),
          connection.getTokenAccountBalance(vault, 'confirmed'),
          connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
            commitment: 'confirmed',
            filters: [
              { dataSize: 165 },
              { memcmp: { offset: 0, bytes: storedMint.toBase58() } },
            ],
          }),
          connection.getSignaturesForAddress(propertyPda, { limit: 20 }, 'confirmed'),
        ]);

        const holderCount = tokenAccounts.filter(({ pubkey, account }) => {
          if (pubkey.equals(vault)) return false;
          const parsed = account.data;
          if (!('parsed' in parsed)) return false;
          return Number(parsed.parsed.info.tokenAmount.amount) > 0;
        }).length;

        if (!cancelled) {
          setState({
            data: {
              propertyPda: propertyPda.toBase58(),
              mintAddress: storedMint.toBase58(),
              vaultAddress: vault.toBase58(),
              totalSupply: Number(mintSupply.value.amount),
              vaultBalance: Number(vaultBalance.value.amount),
              holderCount,
              availableShares: Number(propertyAccount.availableShares),
              pricePerShareLamports: Number(propertyAccount.pricePerShare),
              transactions,
            },
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Unable to verify this listing on-chain.',
          });
        }
      }
    };

    void fetchChainData();

    return () => {
      cancelled = true;
    };
  }, [connection, property?.id, property?.mintAddress, property?.owner]);

  return state;
};
