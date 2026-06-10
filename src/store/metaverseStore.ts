import { create } from 'zustand';
import { Property, UserWallet } from '@/types/property';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import {
  getProgram,
  getPropertyPda,
  getPropertyMintPda,
  getPropertyVaultPda,
  getInvestorReceiptPda,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@/lib/solanaClient';

export interface BlockchainTxState {
  type: 'list' | 'buy' | 'register' | null;
  step: number;
  maxSteps: number;
  status: 'pending' | 'success' | 'error' | null;
  logs: string[];
  txSignature?: string;
  slot?: number;
  derivedKeys?: {
    propertyPda?: string;
    mintPda?: string;
    vaultPda?: string;
    investorTokenAccount?: string;
    receiptPda?: string;
  };
  error?: string;
}

export interface SimulatedBlock {
  slot: number;
  hash: string;
  timestamp: string;
  txs: {
    signature: string;
    type: string;
    instructions: string[];
    logs: string[];
    fee: number;
  }[];
}

interface MetaverseStore {
  properties: Property[];
  selectedProperty: Property | null;
  isWalletConnected: boolean;
  wallet: UserWallet | null;
  showPropertyModal: boolean;
  showBlockchainMonitor: boolean;
  txState: BlockchainTxState;
  simulatedBlocks: SimulatedBlock[];
  isSandboxMode: boolean; // false = live solana transactions, true = visual simulato
  
  selectProperty: (property: Property | null) => void;
  connectWallet: (publicKeyStr?: string, balance?: number) => void;
  setWalletBalance: (balance: number) => void;
  disconnectWallet: () => void;
  setShowPropertyModal: (show: boolean) => void;
  setShowBlockchainMonitor: (show: boolean) => void;
  setSandboxMode: (isSandbox: boolean) => void;
  resetMonitorState: () => void;
  fetchProperties: () => Promise<void>;
  
  purchaseFractionalShares: (
    propertyId: string,
    shares: number,
    connection?: Connection,
    walletAdapter?: any
  ) => Promise<boolean>;
  
  listProperty: (
    propertyData: {
      title: string;
      description: string;
      price: number;
      pricePerShareLamports: number;
      totalFractions: number;
      buildingType: 'residential' | 'commercial' | 'plot' | 'landmark' | 'mixed';
    },
    connection?: Connection,
    walletAdapter?: any
  ) => Promise<boolean>;
}

const generateSolanaAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const deterministicCoordinate = (value: string, offset: number) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return ((Math.abs(hash >> offset) % 8000) / 100) - 40;
};

const initialTxState: BlockchainTxState = {
  type: null,
  step: 0,
  maxSteps: 0,
  status: null,
  logs: [],
};

export const useMetaverseStore = create<MetaverseStore>((set, get) => ({
  properties: [],
  selectedProperty: null,
  isWalletConnected: false,
  wallet: null,
  showPropertyModal: false,
  showBlockchainMonitor: false,
  txState: initialTxState,
  simulatedBlocks: [],
  isSandboxMode: false, // Default to live Web3 transactions

  selectProperty: (property) => set({ selectedProperty: property, showPropertyModal: !!property }),
  
  connectWallet: (publicKeyStr, balance) => {
    if (publicKeyStr) {
      set({
        isWalletConnected: true,
        isSandboxMode: false, // Tun off sandbox if real wallet is connected
        wallet: {
          address: publicKeyStr,
          balance: balance !== undefined ? balance : 10.0,
          ownedProperties: [],
          fractionalOwnership: [],
        }
      });
    }
  },

  setWalletBalance: (balance) => {
    set((state) => ({
      wallet: state.wallet ? { ...state.wallet, balance } : null,
    }));
  },
  
  disconnectWallet: () => {
    set({ 
      isWalletConnected: false, 
      wallet: null,
      isSandboxMode: false
    });
  },
  
  setShowPropertyModal: (show) => set({ showPropertyModal: show }),
  setShowBlockchainMonitor: (show) => set({ showBlockchainMonitor: show }),
  setSandboxMode: (isSandbox) => set({ isSandboxMode: isSandbox }),
  resetMonitorState: () => set({
    txState: initialTxState,
    simulatedBlocks: [],
  }),
  
  fetchProperties: async () => {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const dbProperties = await res.json();
        const mapped = dbProperties.map((p: any) => {
          const priceNum = Number(p.price);
          const total = p.totalFractions;
          const available = p.availableFractions;
          const sold = total - available;
          
          let status: Property['status'] = 'Available';
          if (available === 0) status = 'Sold';
          else if (sold > 0) status = 'Reserved';

          const priceInPKR = new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
          }).format(priceNum);

          return {
            id: p.id,
            name: p.title,
            description: p.description || '',
            price: priceNum,
            priceInPKR,
            priceInSol: 0,
            location: 'Karachi, Pakistan',
            areaName: 'RealityOneX',
            coordinates: { x: deterministicCoordinate(p.id, 0), y: 0, z: deterministicCoordinate(p.id, 8) },
            size: { width: 5, height: 16, depth: 5 },
            buildingType: p.buildingType || 'residential',
            color: '#2dd4bf',
            owner: p.ownerWallet,
            fractionalShares: sold,
            totalShares: total,
            isForSale: available > 0,
            status,
            features: ['Smart Home', 'Security'],
            mintAddress: p.mintAddress,
            model3dUrl: p.model3dUrl || null,
          };
        });

        set({ properties: mapped });
      }
    } catch (err) {
      console.error("Failed to fetch properties from Express API:", err);
    }
  },

  purchaseFractionalShares: async (propertyId, shares, connection, walletAdapter) => {
    const { properties, wallet, isSandboxMode, txState } = get();
    if (!wallet) return false;

    const property = properties.find((p) => p.id === propertyId);
    if (!property) return false;

    // 1. Enter Pending State
    set({
      showBlockchainMonitor: true,
      txState: {
        type: 'buy',
        step: 1,
        maxSteps: 6,
        status: 'pending',
        logs: ['[System] Initiating fractional share purchase...'],
      }
    });

    const addLog = (log: string) => {
      set((state) => ({
        txState: { ...state.txState, logs: [...state.txState.logs, log] }
      }));
    };

    const nextStep = () => {
      set((state) => ({
        txState: { ...state.txState, step: state.txState.step + 1 }
      }));
    };

    if (isSandboxMode || !connection || !walletAdapter || !walletAdapter.publicKey) {
      // --- SANDBOX SIMULATOR MODE ---
      try {
        await new Promise((r) => setTimeout(r, 1200));
        addLog('[Sandbox] Running in simulated educational ledger mode.');
        
        // Step 1: Address Derivation
        nextStep();
        const adminKey = new PublicKey(generateSolanaAddress());
        const propertyPda = getPropertyPda(adminKey, propertyId);
        const mintPda = getPropertyMintPda(propertyPda);
        const vaultPda = getPropertyVaultPda(propertyPda);
        const receiptPda = getInvestorReceiptPda(propertyPda, new PublicKey(wallet.address));
        const investorAta = getAssociatedTokenAddress(mintPda, new PublicKey(wallet.address));

        set((state) => ({
          txState: {
            ...state.txState,
            derivedKeys: {
              propertyPda: propertyPda.toBase58(),
              mintPda: mintPda.toBase58(),
              vaultPda: vaultPda.toBase58(),
              investorTokenAccount: investorAta.toBase58(),
              receiptPda: receiptPda.toBase58(),
            }
          }
        }));

        addLog(`[PDA Derivation] Derived account addresses successfully:`);
        addLog(`  Property PDA: ${propertyPda.toBase58()}`);
        addLog(`  Mint PDA: ${mintPda.toBase58()}`);
        addLog(`  Vault PDA: ${vaultPda.toBase58()}`);
        addLog(`  Receipt PDA: ${receiptPda.toBase58()}`);
        addLog(`  Associated Token Account (ATA): ${investorAta.toBase58()}`);

        // Step 2: Build Instruction
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        addLog(`[Instruction Builder] Constructed Anchor Instruction 'buy_shares':`);
        addLog(`  Signer: ${wallet.address} (Investor)`);
        addLog(`  Property admin: ${property.owner || 'GaKqx22...uBL2wG'}`);
        addLog(`  Arguments: shares_to_buy = ${shares}`);

        // Step 3: Signature
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        addLog('[Wallet Adapter] Prompting user signature...');
        addLog('[Wallet Adapter] Sandbox simulated signature received.');

        // Step 4: CPI Flow
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        const totalSol = (property.priceInSol / property.totalShares) * shares;
        addLog(`[CPI] Invoked SystemProgram::transfer(${totalSol.toFixed(2)} SOL from investor to admin)`);
        addLog(`[CPI] Invoked TokenProgram::transfer(${shares} SPL tokens from vault to investor ATA)`);

        // Step 5: Mined & Written
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        const txSig = generateSolanaAddress();
        const currentSlot = 12457812 + get().simulatedBlocks.length;
        addLog(`[Solana Engine] Transaction successful! Block mined at slot ${currentSlot}.`);
        addLog(`  Signature: ${txSig}`);

        // Step 6: Off-Chain Sync
        await new Promise((r) => setTimeout(r, 800));
        nextStep();
        addLog(`[Local State] Syncing fractional ownership and wallet balance...`);

        // Update local memory state
        const updatedProperties = properties.map((p) => {
          if (p.id === propertyId) {
            const newFractions = p.fractionalShares + shares;
            return {
              ...p,
              fractionalShares: newFractions,
              status: newFractions === p.totalShares ? 'Sold' as const : 'Reserved' as const
            };
          }
          return p;
        });

        const newBlock: SimulatedBlock = {
          slot: currentSlot,
          hash: generateSolanaAddress().slice(0, 10),
          timestamp: new Date().toISOString(),
          txs: [{
            signature: txSig,
            type: 'buy_shares',
            instructions: [`buyShares(${shares} shares)`],
            logs: get().txState.logs,
            fee: 0.000005
          }]
        };

        set((state) => ({
          properties: updatedProperties,
          wallet: {
            ...wallet,
            balance: wallet.balance - totalSol,
            fractionalOwnership: wallet.fractionalOwnership.some(fo => fo.propertyId === propertyId)
              ? wallet.fractionalOwnership.map(fo => fo.propertyId === propertyId ? { ...fo, shares: fo.shares + shares } : fo)
              : [...wallet.fractionalOwnership, { propertyId, shares }]
          },
          simulatedBlocks: [newBlock, ...state.simulatedBlocks],
          txState: {
            ...state.txState,
            status: 'success',
            txSignature: txSig,
            slot: currentSlot
          }
        }));

        return true;
      } catch (err: any) {
        addLog(`[Error] Simulation failed: ${err.message}`);
        set((state) => ({ txState: { ...state.txState, status: 'error', error: err.message } }));
        return false;
      }
    } else {
      // --- LIVE SOLANA TRANSACTION MODE ---
      try {
        addLog('[Web3] Running in live Solana Devnet/Localnet network mode.');
        const program = getProgram(connection, walletAdapter);
        const investorPubkey = walletAdapter.publicKey;
        
        // Admin address
        const adminPubkey = property.owner ? new PublicKey(property.owner) : PROGRAM_ID;

        // Derivations
        const propertyPda = getPropertyPda(adminPubkey, propertyId);
        const mintPda = getPropertyMintPda(propertyPda);
        const vaultPda = getPropertyVaultPda(propertyPda);
        const receiptPda = getInvestorReceiptPda(propertyPda, investorPubkey);
        const investorAta = getAssociatedTokenAddress(mintPda, investorPubkey);

        set((state) => ({
          txState: {
            ...state.txState,
            derivedKeys: {
              propertyPda: propertyPda.toBase58(),
              mintPda: mintPda.toBase58(),
              vaultPda: vaultPda.toBase58(),
              investorTokenAccount: investorAta.toBase58(),
              receiptPda: receiptPda.toBase58(),
            }
          }
        }));

        addLog(`[PDA Derivation] Derived live contract addresses:`);
        addLog(`  Property PDA: ${propertyPda.toBase58()}`);
        addLog(`  Mint PDA: ${mintPda.toBase58()}`);
        addLog(`  Vault PDA: ${vaultPda.toBase58()}`);
        addLog(`  Receipt PDA: ${receiptPda.toBase58()}`);
        addLog(`  Associated Token Account (ATA): ${investorAta.toBase58()}`);

        nextStep(); // step 2: Build Instruction
        addLog(`[Instruction Builder] Constructing Anchor live method: buyShares(${shares})`);

        nextStep(); // step 3: Signature
        addLog('[Wallet Adapter] Awaiting signature in Phantom wallet extension...');
        
        const txSig = await program.methods
          .buyShares(new anchor.BN(shares))
          .accountsPartial({
            investor: investorPubkey,
            admin: adminPubkey,
            property: propertyPda,
            propertyMint: mintPda,
            propertyVault: vaultPda,
            investorTokenAccount: investorAta,
            investorReceipt: receiptPda,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .rpc();
        
        addLog(`[RPC] Broadcasted signature: ${txSig}`);
        
        nextStep(); // step 4: CPI
        addLog('[RPC] Confirming transaction on-chain...');
        
        // Confirm transaction
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature: txSig,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        }, 'confirmed');
        
        nextStep(); // step 5: Confirm
        const status = await connection.getSignatureStatus(txSig);
        const slot = status.value?.slot || 0;
        addLog(`[RPC] Transaction confirmed on Solana network at slot: ${slot}`);

        nextStep(); // step 6: Off-Chain Sync
        const confirmedLamports = await connection.getBalance(investorPubkey, 'confirmed');
        get().setWalletBalance(confirmedLamports / anchor.web3.LAMPORTS_PER_SOL);
        addLog(`[Wallet] Refreshed confirmed SOL balance after purchase.`);
        addLog(`[Backend API] Syncing updated share balances with database...`);
        // Refresh properties list from database
        await get().fetchProperties();
        addLog(`[Backend API] Sync completed successfully.`);

        set((state) => ({
          txState: {
            ...state.txState,
            status: 'success',
            txSignature: txSig,
            slot: slot
          }
        }));

        return true;
      } catch (err: any) {
        addLog(`[Error] Live transaction failed: ${err.message}`);
        set((state) => ({ txState: { ...state.txState, status: 'error', error: err.message } }));
        return false;
      }
    }
  },

  listProperty: async (propertyData, connection, walletAdapter) => {
    const { isSandboxMode, wallet, properties } = get();
    if (!wallet) return false;

    const propertyId = 'prop-' + Math.floor(Math.random() * 1000000).toString();

    // 1. Enter Pending State
    set({
      showBlockchainMonitor: true,
      txState: {
        type: 'list',
        step: 1,
        maxSteps: 6,
        status: 'pending',
        logs: ['[System] Initiating real estate tokenization listing...'],
      }
    });

    const addLog = (log: string) => {
      set((state) => ({
        txState: { ...state.txState, logs: [...state.txState.logs, log] }
      }));
    };

    const nextStep = () => {
      set((state) => ({
        txState: { ...state.txState, step: state.txState.step + 1 }
      }));
    };

    if (isSandboxMode || !connection || !walletAdapter || !walletAdapter.publicKey) {
      // --- SANDBOX SIMULATOR MODE ---
      try {
        await new Promise((r) => setTimeout(r, 1200));
        addLog('[Sandbox] Running in simulated educational ledger mode.');
        
        // Step 1: Address Derivation
        nextStep();
        const adminKey = new PublicKey(wallet.address);
        const propertyPda = getPropertyPda(adminKey, propertyId);
        const mintPda = getPropertyMintPda(propertyPda);
        const vaultPda = getPropertyVaultPda(propertyPda);

        set((state) => ({
          txState: {
            ...state.txState,
            derivedKeys: {
              propertyPda: propertyPda.toBase58(),
              mintPda: mintPda.toBase58(),
              vaultPda: vaultPda.toBase58(),
            }
          }
        }));

        addLog(`[PDA Derivation] Derived account addresses successfully:`);
        addLog(`  Property PDA: ${propertyPda.toBase58()}`);
        addLog(`  Mint PDA: ${mintPda.toBase58()}`);
        addLog(`  Vault PDA: ${vaultPda.toBase58()}`);

        // Step 2: Build Instruction
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        addLog(`[Instruction Builder] Constructed Anchor Instruction 'list_property':`);
        addLog(`  Signer: ${wallet.address} (Admin)`);
        addLog(`  Arguments: property_id = ${propertyId}, total_shares = ${propertyData.totalFractions}, price_per_share = ${Math.round(propertyData.price / propertyData.totalFractions)}`);

        // Step 3: Signature
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        addLog('[Wallet Adapter] Prompting user signature...');
        addLog('[Wallet Adapter] Sandbox simulated signature received.');

        // Step 4: CPI Flow
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        addLog(`[CPI] Invoked TokenProgram::init_mint(property_mint decimals = 0, authority = property)`);
        addLog(`[CPI] Invoked TokenProgram::mint_to(${propertyData.totalFractions} tokens to property_vault)`);

        // Step 5: Mined & Written
        await new Promise((r) => setTimeout(r, 1200));
        nextStep();
        const txSig = generateSolanaAddress();
        const currentSlot = 12457812 + get().simulatedBlocks.length;
        addLog(`[Solana Engine] Transaction successful! Block mined at slot ${currentSlot}.`);
        addLog(`  Signature: ${txSig}`);

        // Step 6: Off-Chain Sync
        await new Promise((r) => setTimeout(r, 800));
        nextStep();
        addLog(`[Backend API] Syncing listing with database...`);
        // Post to backend database
        try {
          await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: propertyId,
              title: propertyData.title,
              description: propertyData.description,
              price: propertyData.price,
              buildingType: propertyData.buildingType,
              totalFractions: propertyData.totalFractions,
              availableFractions: propertyData.totalFractions,
              ownerWallet: wallet.address,
              mintAddress: mintPda.toBase58(),
            }),
          });
        } catch (dbErr) {
          addLog(`[Backend Sync Warning] Failed to save in DB, running frontend memory fallback.`);
        }

        // Add to local state
        const priceInPKR = new Intl.NumberFormat('en-PK', {
          style: 'currency',
          currency: 'PKR',
          maximumFractionDigits: 0,
        }).format(propertyData.price);

        const newProperty: Property = {
          id: propertyId,
          name: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          priceInPKR,
          priceInSol: 0,
          location: 'Karachi, Pakistan',
          areaName: 'RealityOneX',
          coordinates: { x: deterministicCoordinate(propertyId, 0), y: 0, z: deterministicCoordinate(propertyId, 8) },
          size: { width: 5, height: 16, depth: 5 },
          buildingType: propertyData.buildingType,
          color: '#3b82f6',
          owner: wallet.address,
          fractionalShares: 0,
          totalShares: propertyData.totalFractions,
          isForSale: true,
          status: 'Available',
          features: ['New Listing', 'On-Chain Verified'],
          mintAddress: mintPda.toBase58(),
        };

        const newBlock: SimulatedBlock = {
          slot: currentSlot,
          hash: generateSolanaAddress().slice(0, 10),
          timestamp: new Date().toISOString(),
          txs: [{
            signature: txSig,
            type: 'list_property',
            instructions: [`listProperty(${propertyId}, ${propertyData.totalFractions} shares)`],
            logs: get().txState.logs,
            fee: 0.000005
          }]
        };

        set((state) => ({
          properties: [newProperty, ...state.properties],
          simulatedBlocks: [newBlock, ...state.simulatedBlocks],
          txState: {
            ...state.txState,
            status: 'success',
            txSignature: txSig,
            slot: currentSlot
          }
        }));

        return true;
      } catch (err: any) {
        addLog(`[Error] Simulation failed: ${err.message}`);
        set((state) => ({ txState: { ...state.txState, status: 'error', error: err.message } }));
        return false;
      }
    } else {
      // --- LIVE SOLANA TRANSACTION MODE ---
      try {
        addLog('[Web3] Running in live Solana Devnet/Localnet network mode.');
        const program = getProgram(connection, walletAdapter);
        const adminPubkey = walletAdapter.publicKey;

        // Derivations
        const propertyPda = getPropertyPda(adminPubkey, propertyId);
        const mintPda = getPropertyMintPda(propertyPda);
        const vaultPda = getPropertyVaultPda(propertyPda);

        set((state) => ({
          txState: {
            ...state.txState,
            derivedKeys: {
              propertyPda: propertyPda.toBase58(),
              mintPda: mintPda.toBase58(),
              vaultPda: vaultPda.toBase58(),
            }
          }
        }));

        addLog(`[PDA Derivation] Derived account addresses successfully:`);
        addLog(`  Property PDA: ${propertyPda.toBase58()}`);
        addLog(`  Mint PDA: ${mintPda.toBase58()}`);
        addLog(`  Vault PDA: ${vaultPda.toBase58()}`);

        nextStep(); // step 2: Build Instruction
        const pricePerShare = propertyData.pricePerShareLamports;
        addLog(`[Instruction Builder] Constructing Anchor live method: listProperty(...)`);

        nextStep(); // step 3: Signature
        addLog('[Wallet Adapter] Awaiting signature in Phantom wallet extension...');
        
        const txSig = await program.methods
          .listProperty(propertyId, new anchor.BN(propertyData.totalFractions), new anchor.BN(pricePerShare))
          .accountsPartial({
            admin: adminPubkey,
            property: propertyPda,
            propertyMint: mintPda,
            propertyVault: vaultPda,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .rpc();
        
        addLog(`[RPC] Broadcasted signature: ${txSig}`);

        nextStep(); // step 4: CPI
        addLog('[RPC] Confirming transaction on-chain...');

        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature: txSig,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        }, 'confirmed');

        nextStep(); // step 5: Confirm
        const status = await connection.getSignatureStatus(txSig);
        const slot = status.value?.slot || 0;
        addLog(`[RPC] Transaction confirmed on Solana network at slot: ${slot}`);

        nextStep(); // step 6: Off-Chain Sync
        // Post to backend database
        addLog(`[Backend API] Syncing listing with database...`);
        try {
          await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: propertyId,
              title: propertyData.title,
              description: propertyData.description,
              price: propertyData.price,
              buildingType: propertyData.buildingType,
              totalFractions: propertyData.totalFractions,
              availableFractions: propertyData.totalFractions,
              ownerWallet: adminPubkey.toBase58(),
              mintAddress: mintPda.toBase58(),
            }),
          });
          addLog(`[Backend API] Sync completed successfully.`);
        } catch (dbErr) {
          addLog(`[Backend Sync Warning] Failed to register listing in centralized database.`);
        }

        // Refresh properties list from database
        await get().fetchProperties();

        set((state) => ({
          txState: {
            ...state.txState,
            status: 'success',
            txSignature: txSig,
            slot: slot
          }
        }));

        return true;
      } catch (err: any) {
        addLog(`[Error] Live transaction failed: ${err.message}`);
        set((state) => ({ txState: { ...state.txState, status: 'error', error: err.message } }));
        return false;
      }
    }
  }
}));
