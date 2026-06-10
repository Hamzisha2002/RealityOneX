import { useState, useEffect, useRef } from 'react';
import { useMetaverseStore } from '@/store/metaverseStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Database, Terminal, Cpu, Clock, Layers, Globe, Shield, RefreshCw, AlertTriangle, CheckCircle, 
  ArrowRight, Key, Info, HelpCircle, HardDrive, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PROGRAM_ID, getProgram } from '@/lib/solanaClient';

export const BlockchainMonitor = () => {
  const { 
    showBlockchainMonitor, 
    setShowBlockchainMonitor, 
    txState, 
    simulatedBlocks, 
    isSandboxMode, 
    wallet: storeWallet,
    connectWallet,
    disconnectWallet
  } = useMetaverseStore();
  
  const walletAdapter = useWallet();
  const { publicKey } = walletAdapter;
  const { connection } = useConnection();

  const [activeTab, setActiveTab] = useState<'visualizer' | 'registry' | 'explorer'>('visualizer');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Live On-chain Data State
  const [onChainProperties, setOnChainProperties] = useState<any[]>([]);
  const [onChainReceipts, setOnChainReceipts] = useState<any[]>([]);
  const [loadingOnChain, setLoadingOnChain] = useState(false);
  const [liveTxs, setLiveTxs] = useState<any[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(false);

  // Fetch live accounts from local/devnet ledge
  useEffect(() => {
    if (activeTab === 'registry' && !isSandboxMode && connection && publicKey) {
      setLoadingOnChain(true);
      const fetchOnChain = async () => {
        try {
          const program = getProgram(connection, walletAdapter);
          const props = await program.account.propertyState.all();
          setOnChainProperties(props);
          
          const receipts = await program.account.investorReceipt.all();
          setOnChainReceipts(receipts);
        } catch (err) {
          console.error("Failed to fetch on-chain state:", err);
        } finally {
          setLoadingOnChain(false);
        }
      };
      fetchOnChain();
    } else {
      setOnChainProperties([]);
      setOnChainReceipts([]);
    }
  }, [activeTab, isSandboxMode, connection, publicKey, txState.status]);

  // Fetch live ledger block/transaction history
  useEffect(() => {
    if (activeTab === 'explorer' && !isSandboxMode && connection) {
      setLoadingTxs(true);
      const fetchTxs = async () => {
        try {
          const sigs = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 10 }, 'confirmed');
          setLiveTxs(sigs);
        } catch (err) {
          console.error("Failed to fetch live transactions:", err);
        } finally {
          setLoadingTxs(false);
        }
      };
      fetchTxs();
    }
  }, [activeTab, isSandboxMode, connection, txState.status]);

  // Sync React Wallet Adapter with Zustand Store
  useEffect(() => {
    if (publicKey) {
      connectWallet(publicKey.toBase58());
    } else if (storeWallet && !isSandboxMode) {
      disconnectWallet();
    }
  }, [publicKey]);

  // Use the live transactions returned directly from the ledger RPC
  const combinedTxs = liveTxs;

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [txState.logs, showBlockchainMonitor]);

  if (!showBlockchainMonitor) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStepStatus = (stepIndex: number) => {
    if (txState.status === 'success') return 'success';
    if (txState.status === 'error' && txState.step === stepIndex) return 'error';
    if (txState.step > stepIndex) return 'success';
    if (txState.step === stepIndex) return 'active';
    return 'upcoming';
  };

  return (
    <motion.div
      initial={{ y: 90, opacity: 0, scale: 0.985 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 90, opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed bottom-3 right-3 left-3 h-[500px] md:h-[440px] overflow-hidden rounded-[1.75rem] border border-primary/25 bg-background/88 backdrop-blur-2xl z-50 shadow-2xl shadow-primary/15 flex flex-col font-sans text-foreground"
    >
      <div className="pointer-events-none absolute inset-0 depth-grid opacity-25" />
      <div className="pointer-events-none absolute -top-32 right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-primary/20 bg-muted/25">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <h2 className="font-display font-bold text-base tracking-wide flex items-center gap-2">
              Solana Blockchain Monitor 
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px] uppercase font-mono px-1.5 py-0.5">
                {isSandboxMode ? 'Sandbox Simulator' : 'Live Web3 Node'}
              </Badge>
            </h2>
            <p className="text-[11px] text-muted-foreground font-mono">
              {isSandboxMode 
                ? 'Local sandbox isolated client for developer evaluation' 
                : `RPC: ${connection?.rpcEndpoint || 'localhost'}`
              }
            </p>
          </div>
        </div>

        {/* Mode Toggle & Control buttons */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-muted"
            onClick={() => setShowBlockchainMonitor(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Side Tab Navigation */}
        <div className="w-52 bg-background/35 border-r border-primary/15 flex flex-col p-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium font-mono flex items-center gap-2.5 transition-all ${
              activeTab === 'visualizer' ? 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_22px_rgba(45,212,191,0.12)]' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Visualize
            {txState.status === 'pending' && (
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse ml-auto" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium font-mono flex items-center gap-2.5 transition-all ${
              activeTab === 'registry' ? 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_22px_rgba(45,212,191,0.12)]' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            Account Registry
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium font-mono flex items-center gap-2.5 transition-all ${
              activeTab === 'explorer' ? 'bg-primary/15 text-primary border border-primary/40 shadow-[0_0_22px_rgba(45,212,191,0.12)]' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent'
            }`}
          >
            <Clock className="w-4 h-4" />
            Block History
          </button>

          <div className="mt-auto border-t border-border pt-3 p-1 text-[10px] text-muted-foreground font-mono space-y-1.5">
            <div className="flex justify-between">
              <span>Program ID:</span>
              <span className="text-foreground font-semibold">8VHtXD...R36B</span>
            </div>
            <div className="flex justify-between">
              <span>Solana Cluster:</span>
              <span className="text-primary">{isSandboxMode ? 'Sandbox' : 'Localnet'}</span>
            </div>
          </div>
        </div>

        {/* Tab contents */}
        <div className="flex-1 flex overflow-hidden bg-background/45">
          {/* TAB 1: Visualizer */}
          {activeTab === 'visualizer' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Checklist panel */}
              <div className="w-80 border-r border-primary/15 p-4 overflow-y-auto shrink-0 flex flex-col gap-4 font-mono text-xs bg-background/30">
                <h3 className="font-semibold text-foreground uppercase tracking-wide border-b border-border pb-1.5 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Transaction Pipeline
                </h3>

                {txState.type ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Instruction: {txState.type === 'list' ? 'list_property' : 'buy_shares'}</span>
                      <span>Step {txState.step} of {txState.maxSteps}</span>
                    </div>
                    <Progress value={(txState.step / txState.maxSteps) * 100} className="h-1.5" />

                    <div className="space-y-3 mt-4">
                      {/* Step Item 1 */}
                      <PipelineStep 
                        label="PDA Derivation Sync" 
                        status={getStepStatus(1)} 
                        details="Derived PropertyState, Mint, and Vault accounts from seeds."
                      />
                      {/* Step Item 2 */}
                      <PipelineStep 
                        label="Instruction Builder" 
                        status={getStepStatus(2)} 
                        details="Anchor client packed instructions, accounts structure and args."
                      />
                      {/* Step Item 3 */}
                      <PipelineStep 
                        label="Wallet Approval Signature" 
                        status={getStepStatus(3)} 
                        details="Investory sign via wallet extension; verify signature on-chain."
                      />
                      {/* Step Item 4 */}
                      <PipelineStep 
                        label="CPI Execution" 
                        status={getStepStatus(4)} 
                        details="Contract executed Cross-Program Invocation to SPL Token / System Program."
                      />
                      {/* Step Item 5 */}
                      <PipelineStep 
                        label="Ledger Confirmation" 
                        status={getStepStatus(5)} 
                        details="Transaction successfully packaged in slot block."
                      />
                      {/* Step Item 6 */}
                      <PipelineStep 
                        label="Off-Chain Sync" 
                        status={getStepStatus(6)} 
                        details="Backend centralized relational state sync."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                    <Terminal className="w-8 h-8 text-muted-foreground/40 mb-3" />
                    <p className="text-[11px] leading-relaxed">
                      No active transaction. List a property or purchase fractional shares on the website to trigger the visualizer pipeline.
                    </p>
                  </div>
                )}
              </div>

              {/* Logs terminal */}
              <div className="flex-1 flex flex-col bg-black/25">
                <div className="bg-black/35 px-4 py-2 border-b border-primary/15 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                  <span>SYSTEM_LOG_CONSOLE</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>ONLINE</span>
                  </div>
                </div>
                <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1.5 scrollbar-thin select-text leading-relaxed">
                  {txState.logs.length > 0 ? (
                    txState.logs.map((log, index) => {
                      let color = 'text-foreground';
                      if (log.includes('[Error]')) color = 'text-red-400 font-semibold';
                      else if (log.includes('[CPI]')) color = 'text-purple-400';
                      else if (log.includes('[PDA Derivation]')) color = 'text-cyan-400 font-semibold';
                      else if (log.includes('[System]')) color = 'text-yellow-400';
                      else if (log.includes('[Solana Engine]')) color = 'text-green-400 font-semibold';
                      
                      return (
                        <div key={index} className={`${color} leading-relaxed`}>
                          {log}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground/60 italic">Waiting for smart contract calls...</div>
                  )}

                  {/* Account state info block if transaction finished successfully */}
                  {txState.status === 'success' && txState.derivedKeys && (
                    <div className="mt-4 pt-4 border-t border-border/40 text-[10px] text-muted-foreground space-y-1">
                      <div className="text-cyan-400 font-semibold mb-1">Mined Account Addresses:</div>
                      <div className="flex justify-between">
                        <span>Property Account PDA:</span>
                        <code className="text-foreground">{txState.derivedKeys.propertyPda}</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Token Mint Address PDA:</span>
                        <code className="text-foreground">{txState.derivedKeys.mintPda}</code>
                      </div>
                      {txState.derivedKeys.investorTokenAccount && (
                        <div className="flex justify-between">
                          <span>Investor Associated Token A/C:</span>
                          <code className="text-foreground">{txState.derivedKeys.investorTokenAccount}</code>
                        </div>
                      )}
                      <div className="flex justify-between mt-2 font-semibold">
                        <span>Tx Signature:</span>
                        <span className="text-green-400 font-mono text-[9px] break-all">{txState.txSignature}</span>
                      </div>
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Registry */}
          {activeTab === 'registry' && (
            <div className="flex-1 p-6 overflow-y-auto select-text font-mono text-xs">
              <h3 className="font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Solana State Registry
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-primary font-bold text-[11px] mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Solana Anchor Program Details
                  </h4>
                  <div className="holo-panel rounded-2xl p-3 border border-primary/20 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Program ID</div>
                      <div className="font-semibold break-all flex items-center gap-2">
                        {PROGRAM_ID.toBase58()}
                        <CopyButton text={PROGRAM_ID.toBase58()} label="program" copied={copiedKey} onCopy={copyToClipboard} />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Token Program (SPL)</div>
                      <div className="font-semibold break-all">TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-secondary font-bold text-[11px] mb-2 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    Derived PDA Seed Schemas
                  </h4>
                  <div className="holo-panel rounded-2xl p-3 border border-primary/20 space-y-3">
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <div>
                        <span className="text-foreground font-semibold">PropertyState Account:</span>
                        <p className="text-[10px] text-muted-foreground">Holds listed property state on-chain.</p>
                      </div>
                      <code className="text-accent bg-accent/10 px-2 py-0.5 rounded text-[10px]">
                        seeds = [b"property", admin_pubkey, property_id_bytes]
                      </code>
                    </div>
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <div>
                        <span className="text-foreground font-semibold">Property Mint Address:</span>
                        <p className="text-[10px] text-muted-foreground">Mint authority is the property PDA.</p>
                      </div>
                      <code className="text-accent bg-accent/10 px-2 py-0.5 rounded text-[10px]">
                        seeds = [b"mint", property_pda]
                      </code>
                    </div>
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <div>
                        <span className="text-foreground font-semibold">Property Vault Account:</span>
                        <p className="text-[10px] text-muted-foreground">Holds minted fractional token shares.</p>
                      </div>
                      <code className="text-accent bg-accent/10 px-2 py-0.5 rounded text-[10px]">
                        seeds = [b"vault", property_pda]
                      </code>
                    </div>
                    <div className="flex justify-between pb-1">
                      <div>
                        <span className="text-foreground font-semibold">InvestorReceipt Account:</span>
                        <p className="text-[10px] text-muted-foreground">Logs owned shares and SOL spent per investor.</p>
                      </div>
                      <code className="text-accent bg-accent/10 px-2 py-0.5 rounded text-[10px]">
                        seeds = [b"receipt", property_pda, investor_pubkey]
                      </code>
                    </div>
                  </div>
                </div>

                {/* Live On-Chain Property State */}
                {!isSandboxMode && (
                  <>
                    <div className="border-t border-border/30 pt-4">
                      <h4 className="text-accent font-bold text-[11px] mb-2 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        On-Chain Property Accounts ({onChainProperties.length})
                      </h4>
                      {loadingOnChain ? (
                        <div className="holo-panel rounded-2xl p-3 border border-primary/20 text-center text-muted-foreground flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-primary" /> Loading live on-chain properties...
                        </div>
                      ) : onChainProperties.length > 0 ? (
                        <div className="space-y-3">
                          {onChainProperties.map((p, idx) => (
                            <div key={idx} className="holo-panel rounded-2xl p-3 border border-primary/20 space-y-2 bg-muted/10">
                              <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                                <span className="font-bold text-foreground">{p.account.propertyId}</span>
                                <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono break-all max-w-[200px] flex items-center gap-1">
                                  {p.publicKey.toBase58()}
                                  <CopyButton text={p.publicKey.toBase58()} label={`prop-addr-${idx}`} copied={copiedKey} onCopy={copyToClipboard} />
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                                <div>Admin: <span className="text-foreground break-all">{p.account.admin.toBase58().slice(0, 8)}...</span></div>
                                <div>Price per fraction: <span className="text-foreground">{(Number(p.account.pricePerShare)).toLocaleString()} SOL</span></div>
                                <div>Available: <span className="text-foreground">{p.account.availableShares.toString()} / {p.account.totalShares.toString()} shares</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="holo-panel rounded-2xl p-3 border border-primary/20 text-center text-muted-foreground">
                          No property accounts found on-chain. List a property in Live Mode to register one.
                        </div>
                      )}
                    </div>

                    {/* Live On-Chain Investor Receipts */}
                    <div className="border-t border-border/30 pt-4">
                      <h4 className="text-purple-400 font-bold text-[11px] mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        On-Chain Investor Receipts ({onChainReceipts.length})
                      </h4>
                      {loadingOnChain ? (
                        <div className="holo-panel rounded-2xl p-3 border border-primary/20 text-center text-muted-foreground flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-primary" /> Loading live on-chain receipts...
                        </div>
                      ) : onChainReceipts.length > 0 ? (
                        <div className="space-y-3">
                          {onChainReceipts.map((r, idx) => (
                            <div key={idx} className="holo-panel rounded-2xl p-3 border border-primary/20 space-y-2 bg-muted/10">
                              <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                                <span className="font-bold text-foreground">Receipt #{idx + 1}</span>
                                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono break-all max-w-[200px] flex items-center gap-1">
                                  {r.publicKey.toBase58()}
                                  <CopyButton text={r.publicKey.toBase58()} label={`receipt-addr-${idx}`} copied={copiedKey} onCopy={copyToClipboard} />
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                                <div>Shares Owned: <span className="text-foreground font-semibold">{r.account.sharesOwned.toString()}</span></div>
                                <div>Total Spent: <span className="text-foreground font-semibold">{(Number(r.account.totalSpent) / 1e9).toFixed(4)} SOL</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="holo-panel rounded-2xl p-3 border border-primary/20 text-center text-muted-foreground">
                          No investor receipt accounts found on-chain. Purchase shares in Live Mode to register one.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Explorer */}
          {activeTab === 'explorer' && (
            <div className="flex-1 p-6 overflow-y-auto select-text font-mono text-xs">
              <h3 className="font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {isSandboxMode ? 'Ledger Blocks Explorer' : 'On-Chain Transaction History'}
              </h3>

              {!isSandboxMode ? (
                /* LIVE TRANSACTION HISTORY */
                loadingTxs ? (
                  <div className="holo-panel rounded-2xl p-4 border border-primary/20 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" /> Loading live on-chain ledger history...
                  </div>
                ) : combinedTxs.length > 0 ? (
                  <div className="space-y-4">
                    {combinedTxs.map((tx, idx) => (
                      <div key={idx} className="holo-panel rounded-2xl p-4 border border-primary/20 space-y-3 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between border-b border-border/20 pb-2">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            <span className="font-bold text-foreground">Slot #{tx.slot.toLocaleString()}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleTimeString() : 'Confirming...'}
                          </span>
                        </div>

                        <div className="space-y-2 bg-muted/10 p-3 rounded border border-border/30">
                          <div>
                            <span className="text-[10px] text-muted-foreground">Transaction Signature:</span>
                            <div className="font-mono text-[9px] text-green-400 break-all select-all flex items-center gap-2 mt-0.5">
                              {tx.signature}
                              <CopyButton text={tx.signature} label={`tx-${idx}`} copied={copiedKey} onCopy={copyToClipboard} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground mt-2 border-t border-border/25 pt-2">
                            <div>
                              <span>Status:</span>
                              <div className="text-foreground font-semibold flex items-center gap-1 mt-0.5">
                                {tx.err ? (
                                  <span className="text-red-400 flex items-center gap-1">❌ Failed</span>
                                ) : (
                                  <span className="text-green-400 flex items-center gap-1">✅ Confirmed</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <span>Memo/Details:</span>
                              <div className="text-foreground font-semibold mt-0.5">{tx.memo || 'On-chain method invocation'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="holo-panel rounded-2xl p-4 border border-primary/20 text-center text-muted-foreground">
                    No transactions found for this program ID on the ledger yet. Send a transaction to see it here!
                  </div>
                )
              ) : (
                /* SIMULATED BLOCKS HISTORY */
                <div className="space-y-4">
                  {simulatedBlocks.map((block) => (
                    <div key={block.slot} className="holo-panel rounded-2xl p-4 border border-primary/20 space-y-3 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between border-b border-border/20 pb-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-primary" />
                          <span className="font-bold text-foreground">Slot #{block.slot.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(block.timestamp).toLocaleTimeString()}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground">
                        <div>
                          <span>Block Hash:</span>
                          <div className="text-foreground font-semibold font-mono">{block.hash}...</div>
                        </div>
                        <div>
                          <span>Mined Transactions:</span>
                          <div className="text-foreground font-semibold">{block.txs.length}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Transactions</div>
                        {block.txs.map((tx, idx) => (
                          <div key={idx} className="bg-muted/30 p-2.5 rounded border border-border/30">
                            <div className="flex justify-between items-center text-[10px] mb-1">
                              <span className="text-primary font-bold">{tx.type}</span>
                              <span className="text-muted-foreground">Fee: {tx.fee} SOL</span>
                            </div>
                            <div className="font-mono text-[9px] text-green-400 break-all select-all">{tx.signature}</div>
                            <div className="mt-2 text-[9px] text-muted-foreground space-y-0.5">
                              <div>Instructions:</div>
                              {tx.instructions.map((ix, ixIdx) => (
                                <div key={ixIdx} className="text-foreground pl-2 font-mono">▸ {ix}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper components
interface PipelineStepProps {
  label: string;
  status: 'error' | 'success' | 'active' | 'upcoming';
  details: string;
}

const PipelineStep = ({ label, status, details }: PipelineStepProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative flex items-start gap-3 cursor-pointer group rounded-xl p-2 transition-all hover:bg-muted/25"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="pt-0.5">
        {status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
        {status === 'active' && <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />}
        {status === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
        {status === 'upcoming' && <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 ml-0.5 mt-0.5" />}
      </div>
      <div>
        <span className={`text-[11px] font-mono ${
          status === 'success' ? 'text-green-400 font-medium' :
          status === 'active' ? 'text-yellow-400 font-bold' :
          status === 'error' ? 'text-red-400 font-semibold' : 'text-muted-foreground'
        }`}>
          {label}
        </span>
      </div>

      {showTooltip && (
        <div className="absolute left-full ml-2 w-56 bg-background/95 border border-primary/25 p-3 rounded-2xl shadow-xl shadow-primary/10 text-[10px] text-foreground leading-relaxed z-50 backdrop-blur-xl">
          {details}
        </div>
      )}
    </div>
  );
};

interface CopyButtonProps {
  text: string;
  label: string;
  copied: string | null;
  onCopy: (text: string, label: string) => void;
}

const CopyButton = ({ text, label, copied, onCopy }: CopyButtonProps) => {
  return (
    <button 
      onClick={() => onCopy(text, label)}
      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {copied === label ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};
