import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { env } from "../server/src/config/env";
import { logger } from "../server/src/utils/logger";
import * as fs from "fs";
import * as path from "path";

/**
 * JaaS — Treasury Wallet Creator
 * Creates a developer-controlled wallet on the Arc testnet
 * to receive x402 micropayments.
 */

async function main() {
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: env.CIRCLE_API_KEY,
    entitySecret: env.CIRCLE_ENTITY_SECRET,
  });

  try {
    logger.info("Creating Treasury Wallet on Arc Testnet...");

    // Create a wallet set first
    const walletSetResponse = await client.createWalletSet({
      name: "JaaS Treasury Set",
    });

    const walletSet = walletSetResponse.data?.walletSet;
    if (!walletSet) throw new Error("Failed to create wallet set");

    logger.info("Wallet Set created", { id: walletSet.id });

    // Create the wallet in the set for Arc testnet
    const walletResponse = await client.createWallets({
      accountType: "SCA",
      blockchains: ["ARC-TESTNET"],
      count: 1,
      walletSetId: walletSet.id,
    });

    const wallet = walletResponse.data?.wallets?.[0];
    if (!wallet) throw new Error("Failed to create wallet");

    logger.info("Treasury Wallet created successfully!", {
      address: wallet.address,
      id: wallet.id,
      blockchain: wallet.blockchain,
    });

    // Save the treasury address to a local file for the middleware to use
    const configPath = path.resolve(__dirname, "../server/src/config/treasury.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          treasuryAddress: wallet.address,
          walletId: wallet.id,
          walletSetId: walletSet.id,
          createdAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    logger.info(`Treasury config saved to ${configPath}`);
    console.log(`\nTREASURY_ADDRESS=${wallet.address}\n`);
    
  } catch (error: any) {
    logger.error("Failed to create treasury wallet", {
      error: error.message,
      details: error.response?.data || error.data,
    });
    process.exit(1);
  }
}

main();
