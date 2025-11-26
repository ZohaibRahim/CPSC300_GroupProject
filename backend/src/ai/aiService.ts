// backend/src/ai/aiService.ts
export interface AIConfig {
  apiKey?: string;
  model?: string;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIService {
  private apiKey: string;
  private model: string;

  constructor(config: AIConfig = {}) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || "";
    this.model = config.model || process.env.GEMINI_MODEL || "gemini-1.5-flash";

    if (!this.apiKey) {
      console.warn(
        "[AIService] GEMINI_API_KEY is not set. callAI() will fail until you configure it."
      );
    }
  }

  /**
   * Call Gemini with a prompt and optional system message.
   * Returns plain text from the first candidate.
   */
  async callAI(prompt: string, systemMessage?: string): Promise<AIResponse> {
    if (!this.apiKey) {
      return { success: false, error: "GEMINI_API_KEY is not configured" };
    }

    const fullPrompt = systemMessage
      ? `${systemMessage}\n\n${prompt}`
      : prompt;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gemini error: ${response.status} - ${text}`);
      }

      const data: any = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

      return { success: true, data: text };
    } catch (err: any) {
      console.error("[AIService] Gemini call failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown Gemini error",
      };
    }
  }
}
