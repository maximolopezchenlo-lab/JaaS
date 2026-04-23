import { logger } from "../utils/logger";
import { BACKOFF_BASE_MS, BACKOFF_MAX_MS, MAX_OUTPUT_TOKENS } from "../config/constants";

/**
 * JaaS — Extractor Agent (Featherless AI)
 * Specialized sub-agent for deep entity extraction and legal document parsing.
 * RULE 9: Delegated low-level extraction to specialized models.
 * RULE 26: Resilient implementation with retries.
 */

export interface ExtractionInput {
  text: string;
}

export interface ExtractedEntity {
  name: string;
  type: "person" | "organization" | "law" | "court" | "date" | "concept";
  confidence: number;
}

export class ExtractorAgent {
  private apiKey: string;
  private baseUrl = "https://api.featherless.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Extract legal entities using a specialized model on Featherless
   */
  async extract(input: ExtractionInput): Promise<ExtractedEntity[]> {
    const model = "meta-llama/Llama-3.2-3B-Instruct-Turbo"; // Reliable non-gated model
    
    const systemPrompt = `You are a specialized Legal Entity Extractor.
    Your task is to identify and categorize all legal entities from the provided text.
    
    Categories:
    - person: Names of individuals (judges, lawyers, litigants).
    - organization: Law firms, government bodies, companies.
    - law: Specific laws, decrees, or articles (e.g., Law 25.506).
    - court: Specific courts or judicial bodies.
    - date: Relevant legal dates.
    - concept: Key legal principles (e.g., "digital signature", "due process").
    
    You MUST respond with a valid JSON array of objects.
    Example: [{"name": "Law 25.506", "type": "law", "confidence": 0.99}]`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Extract entities from: ${input.text}` },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Featherless Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Handle potential array wrapping or direct array response
        const parsed = JSON.parse(content);
        const entities = Array.isArray(parsed) ? parsed : (parsed.entities || []);

        logger.info("Featherless extraction successful", {
          service: "featherless-extractor",
          entityCount: entities.length,
        });

        return entities;
      } catch (error: any) {
        attempts++;
        logger.error("Featherless extraction attempt failed", {
          service: "featherless-extractor",
          attempt: attempts,
          error: error.message,
        });

        if (attempts >= maxAttempts) throw error;

        const delay = Math.min(BACKOFF_BASE_MS * Math.pow(2, attempts - 1), BACKOFF_MAX_MS);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return [];
  }
}
