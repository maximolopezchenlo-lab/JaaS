import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API Key");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // List models
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (e: any) {
    console.error("Error:", e.message);
    if (e.status) console.error("Status:", e.status);
  }
}

test();
