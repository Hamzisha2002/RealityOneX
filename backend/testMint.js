import { Keypair } from "@solana/web3.js";

const ownerWallet = Keypair.generate().publicKey.toBase58();

const res = await fetch("http://localhost:3001/api/properties", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Web3 Metaverse Villa",
    price: 50000,
    totalFractions: 100,
    availableFractions: 100,
    ownerWallet,
  }),
});

const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}

console.log("Status:", res.status);
console.log("Response:", body);
