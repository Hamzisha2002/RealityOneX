import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import idl from "./my_project.json";

export const PROGRAM_ID = new PublicKey("8VHtXD5JK9VtBXPRjR7ApPYAqbeP7JfH9KEiFYVdR36B");
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

/**
 * Returns the Anchor Program instance for MyProject.
 */
export function getProgram(connection: anchor.web3.Connection, wallet: any): Program {
  // Setup a custom provider using the connection and wallet adapter
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  
  return new Program(idl as any, provider);
}

/**
 * Derives the Property State account PDA.
 */
export function getPropertyPda(admin: PublicKey, propertyId: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("property"),
      admin.toBuffer(),
      Buffer.from(propertyId)
    ],
    PROGRAM_ID
  );
  return pda;
}

/**
 * Derives the SPL Token Mint account PDA.
 */
export function getPropertyMintPda(propertyPda: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("mint"),
      propertyPda.toBuffer()
    ],
    PROGRAM_ID
  );
  return pda;
}

/**
 * Derives the Vault Token Account PDA.
 */
export function getPropertyVaultPda(propertyPda: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      propertyPda.toBuffer()
    ],
    PROGRAM_ID
  );
  return pda;
}

/**
 * Derives the Investor Receipt account PDA.
 */
export function getInvestorReceiptPda(propertyPda: PublicKey, investor: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("receipt"),
      propertyPda.toBuffer(),
      investor.toBuffer()
    ],
    PROGRAM_ID
  );
  return pda;
}

/**
 * Derives the Associated Token Account address for the investor.
 */
export function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): PublicKey {
  const [address] = PublicKey.findProgramAddressSync(
    [
      owner.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer()
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return address;
}
