import { EmbeddingRequest, EmbeddingResponse } from "../types";

import OpenAI from "openai";
import { appConfig } from "../config/app";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: appConfig.openaiApiKey,
    });
  }

  async createEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    try {
      const model = request.model || "text-embedding-ada-002";

      const response = await this.openai.embeddings.create({
        model,
        input: request.text,
      });

      const embedding = response.data[0].embedding;

      return {
        embedding,
        model,
        text: request.text,
      };
    } catch (error) {
      throw new Error(
        `Failed to create embedding: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateText(
    prompt: string,
    model: string = "gpt-4o-mini"
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      throw new Error(
        `Failed to generate text: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  calculateCosineSimilarity(
    embedding1: number[],
    embedding2: number[]
  ): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error("Embeddings must have the same length");
    }

    const dotProduct = embedding1.reduce(
      (sum, val, i) => sum + val * embedding2[i],
      0
    );
    const magnitude1 = Math.sqrt(
      embedding1.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitude2 = Math.sqrt(
      embedding2.reduce((sum, val) => sum + val * val, 0)
    );

    return dotProduct / (magnitude1 * magnitude2);
  }
}
