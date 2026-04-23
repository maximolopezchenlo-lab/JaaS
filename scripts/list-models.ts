import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function list() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
    // Wait, the SDK doesn't have listModels on the model object, it's a separate method usually.
    // In @google/generative-ai, there is no direct listModels.
    // We have to use the REST API or a different client.
  } catch (e) {}
}
