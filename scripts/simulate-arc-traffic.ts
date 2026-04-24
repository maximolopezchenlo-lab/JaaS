import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { env } from "../server/src/config/env";
import { logger } from "../server/src/utils/logger";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

/**
 * JaaS — High-Frequency Arc Traffic Simulator
 * Simulates 50+ on-chain transactions to demonstrate Agentic Economy viability.
 * Includes exponential backoff and rate limit handling (Rules 18 & 19).
 */

const TARGET_TRANSACTIONS = 50;
const AMOUNT_PER_TX = "0.001"; // Micro-transaction amount
const SLEEP_BASE_MS = 2000; // Base delay between txs to avoid rate limits

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const client = initiateDeveloperControlledWalletsClient({
    apiKey: env.CIRCLE_API_KEY,
    entitySecret: env.CIRCLE_ENTITY_SECRET,
  });

  logger.info("Initializing Arc Traffic Simulator...", { target: TARGET_TRANSACTIONS });

  try {
    // 1. Load Treasury Wallet Config
    const configPath = path.resolve(__dirname, "../server/src/config/treasury.json");
    if (!fs.existsSync(configPath)) {
      throw new Error("Treasury wallet config not found. Run 'npm run setup' first.");
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const treasuryWalletId = config.walletId;
    const treasuryAddress = config.treasuryAddress;

    if (!treasuryWalletId || !treasuryAddress) {
      throw new Error("Invalid treasury.json config.");
    }

    // 2. Fetch Wallet Balances
    logger.info("Checking wallet balances...", { walletId: treasuryWalletId });
    const balancesResponse = await client.getWalletTokenBalance({
      id: treasuryWalletId,
    });

    const tokenBalances = balancesResponse.data?.tokenBalances || [];
    
    // Find a token with a balance > 0 (preferably USDC or native gas)
    const availableToken = tokenBalances.find((t: any) => parseFloat(t.amount) > 0);

    if (!availableToken) {
      logger.error("INSUFFICIENT FUNDS: The treasury wallet is completely empty.");
      logger.error(`Please fund ${treasuryAddress} on ARC-TESTNET via the Circle Faucet.`);
      logger.error("https://faucet.circle.com/");
      process.exit(1);
    }

    logger.info("Funds verified.", {
      tokenId: availableToken.token.id,
      symbol: availableToken.token.symbol,
      balance: availableToken.amount,
    });

    const tokenId = availableToken.token.id;
    let successfulTxs = 0;
    let failedTxs = 0;
    const txHashes: string[] = [];

    // 3. Execution Loop with Exponential Backoff
    logger.info(`Starting execution of ${TARGET_TRANSACTIONS} transactions...`);
    
    // We send from the treasury wallet TO the treasury wallet to keep funds safe while generating traffic
    for (let i = 1; i <= TARGET_TRANSACTIONS; i++) {
      const idempotencyKey = crypto.randomUUID();
      let retries = 0;
      let success = false;

      while (!success && retries < 3) {
        try {
          const response = await client.createTransaction({
            walletId: treasuryWalletId,
            tokenId: tokenId,
            destinationAddress: treasuryAddress, // Self-transfer to generate volume safely
            amount: [AMOUNT_PER_TX],
            fee: { type: "level", config: { feeLevel: "MEDIUM" } },
            idempotencyKey,
          });

          const txId = response.data?.id;
          if (txId) {
            txHashes.push(txId);
            successfulTxs++;
            logger.info(`[${i}/${TARGET_TRANSACTIONS}] Transaction initiated`, { txId });
            success = true;
          }
        } catch (error: any) {
          retries++;
          const errorMsg = error.response?.data?.message || error.message;
          logger.warn(`[${i}/${TARGET_TRANSACTIONS}] Attempt ${retries} failed`, { error: errorMsg });
          
          if (retries >= 3) {
            logger.error(`[${i}/${TARGET_TRANSACTIONS}] Max retries reached. Skipping.`);
            failedTxs++;
            break;
          }
          
          // Exponential backoff
          const backoff = SLEEP_BASE_MS * Math.pow(2, retries);
          logger.info(`Waiting ${backoff}ms before retry...`);
          await sleep(backoff);
        }
      }

      // Respect rate limits between transactions
      await sleep(SLEEP_BASE_MS);
    }

    // 4. Reporting (Rule 19)
    const estimatedGasPerTx = 0.000021; // Approx Arc Gas Cost
    const totalGasBudget = estimatedGasPerTx * successfulTxs;

    logger.info("=== TRAFFIC SIMULATION COMPLETE ===");
    logger.info(`Successful: ${successfulTxs}`);
    logger.info(`Failed: ${failedTxs}`);
    logger.info(`Estimated Gas Budget Spent: ~${totalGasBudget.toFixed(6)} ARC`);
    logger.info(`Transaction IDs for Block Explorer:`);
    console.log(JSON.stringify(txHashes, null, 2));

  } catch (error: any) {
    logger.error("Simulation failed", {
      error: error.message,
      details: error.response?.data || error.data,
    });
    process.exit(1);
  }
}

main();
