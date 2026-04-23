import { logger } from "../utils/logger";
import { BACKOFF_BASE_MS, BACKOFF_MAX_MS, MAX_OUTPUT_TOKENS } from "../config/constants";
import { ExtractorAgent } from "./extractor";

/**
 * JaaS — Orchestrator Agent (AI/ML API Proxy + Sub-Agent Delegation)
 * RULE 9: Separates business logic from AI orchestration.
 * RULE 26: Implements resilient retries and token tracking.
 */

export interface AnalysisInput {
  query: string;
  jurisdiction: string;
}

export class OrchestratorAgent {
  private apiKey: string;
  private extractor?: ExtractorAgent;
  private baseUrl = "https://api.aimlapi.com/v1";

  constructor(apiKey: string, extractor?: ExtractorAgent) {
    this.apiKey = apiKey;
    this.extractor = extractor;
  }

  /**
   * Execute legal analysis with AI/ML API (OpenAI Compatible)
   */
  async analyze(input: AnalysisInput): Promise<any> {
    const model = "google/gemini-2.0-flash";
    
    const systemPrompt = `You are the JaaS Orchestrator, an elite legal AI specializing in Argentinian and International jurisprudence.
    Your goal is to provide high-fidelity legal reasoning and cite relevant laws.
    
    RULES:
    1. Always respond in English.
    2. Maintain a professional tone.
    3. Identify specific articles of the Civil and Commercial Code or relevant treaties.
    4. You MUST respond with a valid JSON object.
    
    SCHEMA:
    {
      "reasoning": "string",
      "citations": [{"source": "string", "title": "string", "relevance": number, "excerpt": "string"}]
    }`;

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
              { role: "user", content: `Analyze: ${input.query}\nJurisdiction: ${input.jurisdiction}` },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
            max_tokens: MAX_OUTPUT_TOKENS,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const usage = data.usage;
        const baseAnalysis = JSON.parse(content);

        // Delegate entity extraction to sub-agent if available (RULE 9)
        let entities = [];
        if (this.extractor) {
          logger.info("Delegating entity extraction to Featherless sub-agent");
          entities = await this.extractor.extract({ text: baseAnalysis.reasoning });
        }

        logger.info("AI/ML API analysis successful", {
          service: "aiml-orchestrator",
          model,
          tokens: usage?.total_tokens,
        });

        return {
          ...baseAnalysis,
          entities, // Merged from sub-agent
          tokenUsage: {
            inputTokens: usage?.prompt_tokens || 0,
            outputTokens: usage?.completion_tokens || 0,
            costUsd: (usage?.total_tokens || 0) * 0.000001,
          }
        };
      } catch (error: any) {
        attempts++;
        logger.error("AI/ML API attempt failed", {
          service: "aiml-orchestrator",
          attempt: attempts,
          error: error.message,
        });

        if (attempts >= maxAttempts) throw error;

        const delay = Math.min(BACKOFF_BASE_MS * Math.pow(2, attempts - 1), BACKOFF_MAX_MS);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
