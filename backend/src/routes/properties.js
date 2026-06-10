import { Router } from "express";
import { Prisma } from "@prisma/client";
import { Connection, PublicKey } from "@solana/web3.js";
import { prisma } from "../lib/prisma.js";

const router = Router();
const PROGRAM_ID = new PublicKey("8VHtXD5JK9VtBXPRjR7ApPYAqbeP7JfH9KEiFYVdR36B");
const connection = new Connection(
  process.env.SOLANA_RPC_URL ?? "http://127.0.0.1:8899",
  "confirmed"
);

function derivePropertyAccounts(ownerWallet, propertyId) {
  const owner = new PublicKey(ownerWallet);
  const [propertyPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("property"), owner.toBuffer(), Buffer.from(propertyId)],
    PROGRAM_ID
  );
  const [mintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint"), propertyPda.toBuffer()],
    PROGRAM_ID
  );
  return { propertyPda, mintPda };
}

function decodePropertyState(accountInfo) {
  const data = accountInfo.data;
  let offset = 8;
  const admin = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;
  const propertyIdLength = data.readUInt32LE(offset);
  offset += 4;
  const propertyId = data.subarray(offset, offset + propertyIdLength).toString("utf8");
  offset += propertyIdLength;
  const totalShares = Number(data.readBigUInt64LE(offset));
  offset += 8;
  const availableShares = Number(data.readBigUInt64LE(offset));
  offset += 8;
  const pricePerShareLamports = Number(data.readBigUInt64LE(offset));
  return { admin, propertyId, totalShares, availableShares, pricePerShareLamports };
}

function serializeProperty(property) {
  return {
    ...property,
    price: property.price.toString(),
  };
}

async function removeListingsMissingFromLedger(properties) {
  const listingsWithMints = properties.filter(
    (property) => property.mintAddress && property.ownerWallet && property.id
  );
  if (listingsWithMints.length === 0) return properties;

  try {
    const derived = listingsWithMints.map((property) => {
      const accounts = derivePropertyAccounts(property.ownerWallet, property.id);
      return {
        ...accounts,
        storedMint: new PublicKey(property.mintAddress),
      };
    });
    const accounts = await connection.getMultipleAccountsInfo(
      derived.flatMap(({ propertyPda, storedMint }) => [propertyPda, storedMint])
    );
    const missingIds = listingsWithMints
      .filter((property, index) => {
        const item = derived[index];
        const propertyAccount = accounts[index * 2];
        if (!propertyAccount) return true;
        const state = decodePropertyState(propertyAccount);
        return !item.mintPda.equals(item.storedMint)
          || !state.admin.equals(new PublicKey(property.ownerWallet))
          || state.propertyId !== property.id
          || accounts[(index * 2) + 1] === null;
      })
      .map((property) => property.id);

    if (missingIds.length > 0) {
      await prisma.$transaction([
        prisma.transaction.deleteMany({
          where: { propertyId: { in: missingIds } },
        }),
        prisma.property.deleteMany({
          where: { id: { in: missingIds } },
        }),
      ]);
    }

    const missingIdSet = new Set(missingIds);
    const chainStateById = new Map(
      listingsWithMints.map((property, index) => [
        property.id,
        accounts[index * 2] ? decodePropertyState(accounts[index * 2]) : null,
      ])
    );
    return properties
      .filter((property) => !missingIdSet.has(property.id))
      .map((property) => {
        const state = chainStateById.get(property.id);
        return state
          ? {
              ...property,
              totalFractions: state.totalShares,
              availableFractions: state.availableShares,
              pricePerShareLamports: state.pricePerShareLamports,
            }
          : property;
      });
  } catch (err) {
    console.warn("Unable to reconcile properties with Solana ledger:", err.message);
    return properties;
  }
}

function parsePrice(value) {
  if (value === undefined || value === null) return null;
  try {
    return new Prisma.Decimal(String(value));
  } catch {
    return null;
  }
}

/** GET /api/properties — list all properties */
router.get("/", async (_req, res, next) => {
  try {
    const storedProperties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    const properties = await removeListingsMissingFromLedger(storedProperties);
    res.json(properties.map(serializeProperty));
  } catch (err) {
    next(err);
  }
});

/** POST /api/properties — create a property */
router.post("/", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const id = typeof body.id === "string" && body.id.trim() !== "" ? body.id.trim() : undefined;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description =
      body.description === undefined || body.description === null
        ? null
        : String(body.description);
    const buildingTypeRaw =
      typeof body.buildingType === "string" ? body.buildingType.trim() : "residential";
    const validBuildingTypes = new Set(["residential", "commercial", "plot", "landmark", "mixed"]);
    const buildingType = validBuildingTypes.has(buildingTypeRaw)
      ? buildingTypeRaw
      : "residential";
    const price = parsePrice(body.price);
    const totalFractions = Number(body.totalFractions ?? body.total_fractions);
    const availableFractions = Number(
      body.availableFractions ?? body.available_fractions
    );
    const model3dUrlRaw =
      body.model3dUrl ?? body.model_3d_url ?? body["3d_model_url"];
    const model3dUrl =
      model3dUrlRaw === undefined || model3dUrlRaw === null || model3dUrlRaw === ""
        ? null
        : String(model3dUrlRaw);

    const ownerWalletRaw =
      body.ownerWallet ?? body.owner_wallet;
    const ownerWallet =
      ownerWalletRaw === undefined || ownerWalletRaw === null
        ? ""
        : String(ownerWalletRaw).trim();

    const metadataUriRaw = body.metadataUri ?? body.metadata_uri;
    const metadataUri =
      metadataUriRaw === undefined || metadataUriRaw === null || metadataUriRaw === ""
        ? null
        : String(metadataUriRaw).trim();
    const mintAddressRaw = body.mintAddress ?? body.mint_address;
    const mintAddress =
      mintAddressRaw === undefined || mintAddressRaw === null
        ? ""
        : String(mintAddressRaw).trim();

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    if (price === null || price.lte(0)) {
      return res.status(400).json({ error: "price must be a positive number" });
    }
    if (
      !Number.isInteger(totalFractions) ||
      totalFractions <= 0
    ) {
      return res
        .status(400)
        .json({ error: "totalFractions must be a positive integer" });
    }
    if (
      !Number.isInteger(availableFractions) ||
      availableFractions < 0 ||
      availableFractions > totalFractions
    ) {
      return res.status(400).json({
        error:
          "availableFractions must be an integer between 0 and totalFractions",
      });
    }
    if (!ownerWallet) {
      return res.status(400).json({ error: "ownerWallet is required" });
    }
    let derivedAccounts;
    try {
      derivedAccounts = derivePropertyAccounts(ownerWallet, id);
    } catch {
      return res.status(400).json({ error: "ownerWallet, property id, and mintAddress must be valid Solana listing data" });
    }
    if (!derivedAccounts.mintPda.equals(new PublicKey(mintAddress))) {
      return res.status(400).json({ error: "mintAddress does not match the Anchor mint derived for this property and owner" });
    }
    const [propertyAccount, mintAccount] = await connection.getMultipleAccountsInfo([
      derivedAccounts.propertyPda,
      derivedAccounts.mintPda,
    ]);
    if (!propertyAccount || !mintAccount) {
      return res.status(400).json({ error: "property must be tokenized on the active Solana ledger before metadata is registered" });
    }

    const created = await prisma.property.create({
      data: {
        id,
        title,
        description,
        buildingType,
        price,
        totalFractions,
        availableFractions,
        model3dUrl,
        mintAddress,
        metadataUri,
        ownerWallet,
      },
    });

    res.status(201).json(serializeProperty(created));
  } catch (err) {
    next(err);
  }
});

export default router;
