import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

const publicBase58 = keypair.publicKey.toBase58();
const secretJsonArray = JSON.stringify(Array.from(keypair.secretKey));

console.log("Public address (fund this on Devnet):");
console.log(publicBase58);
console.log("");
console.log("SOLANA_DEVNET_PAYER_SECRET (paste into backend .env):");
console.log(secretJsonArray);
