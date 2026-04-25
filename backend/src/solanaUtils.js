import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import { createMint, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";

const DEVNET_RPC = process.env.SOLANA_RPC_URL ?? clusterApiUrl("devnet");

/**
 * Loads the fee-payer keypair from SOLANA_DEVNET_PAYER_SECRET.
 * Use a JSON array of 64 bytes (output of `node generateKeypair.js`).
 */
function loadPayerKeypair() {
  let raw = process.env.SOLANA_DEVNET_PAYER_SECRET;
  if (!raw || !String(raw).trim()) {
    throw new Error(
      "Set SOLANA_DEVNET_PAYER_SECRET to a funded Devnet keypair (JSON byte array)."
    );
  }
  raw = String(raw).trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  let arr;
  try {
    arr = JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `SOLANA_DEVNET_PAYER_SECRET must be valid JSON (one line array). ${e.message}`
    );
  }
  if (!Array.isArray(arr)) {
    throw new Error("SOLANA_DEVNET_PAYER_SECRET must be a JSON array of numbers.");
  }
  if (arr.length !== 32 && arr.length !== 64) {
    throw new Error(
      `Secret key must be 32 or 64 bytes (got ${arr.length}). Regenerate with: node generateKeypair.js`
    );
  }
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

/**
 * Creates a new SPL Token mint on Solana Devnet (one mint per property).
 * The mint authority is the payer (backend Devnet wallet).
 *
 * @returns {Promise<string>} Base58 mint public key
 */
export async function createPropertyTokenMint() {
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const payer = loadPayerKeypair();
  const mintKeypair = Keypair.generate();

  const rentLamports = await getMinimumBalanceForRentExemptMint(connection);
  const balance = await connection.getBalance(payer.publicKey);
  const needed = rentLamports + 15_000;
  if (balance < needed) {
    throw new Error(
      `Devnet payer underfunded: ${balance} lamports; need at least ~${needed} for mint rent + fees. ` +
        `Send Devnet SOL to: ${payer.publicKey.toBase58()} (must be Devnet, not Mainnet).`
    );
  }

  const mintPubkey = await createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    6,
    mintKeypair
  );

  return mintPubkey.toBase58();
}
