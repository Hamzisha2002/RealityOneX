import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { createPropertyTokenMint } from "../solanaUtils.js";

const router = Router();

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
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    const serialized = properties.map((p) => ({
      ...p,
      price: p.price.toString(),
    }));
    res.json(serialized);
  } catch (err) {
    next(err);
  }
});

/** POST /api/properties — create a property */
router.post("/", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description =
      body.description === undefined || body.description === null
        ? null
        : String(body.description);
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

    let mintAddress;
    try {
      mintAddress = await createPropertyTokenMint();
    } catch (solErr) {
      console.error("createPropertyTokenMint failed:", solErr);
      return res.status(502).json({
        error: "Failed to create SPL mint on Solana Devnet",
        message: String(solErr?.message ?? solErr),
      });
    }

    const created = await prisma.property.create({
      data: {
        title,
        description,
        price,
        totalFractions,
        availableFractions,
        model3dUrl,
        mintAddress,
        metadataUri,
        ownerWallet,
      },
    });

    res.status(201).json({
      ...created,
      price: created.price.toString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
