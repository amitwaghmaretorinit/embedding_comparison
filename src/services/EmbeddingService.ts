import {
  ChunkedComparisonRequest,
  ChunkedComparisonResponse,
  ChunkedEmbeddingRequest,
  ChunkedEmbeddingResponse,
  ComparisonRequest,
  ComparisonResponse,
  EmbeddingRequest,
  EmbeddingResponse,
} from "../types";

import { EmbeddingModel } from "../models/Embedding";
import { OpenAIService } from "./OpenAIService";
import { TextChunkingService } from "./TextChunkingService";

export class EmbeddingService {
  private openaiService: OpenAIService;
  private embeddingModel: EmbeddingModel;
  private chunkingService: TextChunkingService;

  constructor() {
    this.openaiService = new OpenAIService();
    this.embeddingModel = new EmbeddingModel();
    this.chunkingService = new TextChunkingService();
  }

  async createEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const embeddingResponse = await this.openaiService.createEmbedding(request);

    // Store the embedding in our model
    await this.embeddingModel.create({
      text: embeddingResponse.text,
      embedding: embeddingResponse.embedding,
      model: embeddingResponse.model,
    });

    return embeddingResponse;
  }

  async compareEmbeddings(
    request: ComparisonRequest
  ): Promise<ComparisonResponse> {
    const [embedding1, embedding2] = await Promise.all([
      this.openaiService.createEmbedding({
        text: request.text1,
        model: request.model,
      }),
      this.openaiService.createEmbedding({
        text: request.text2,
        model: request.model,
      }),
    ]);

    const similarity = this.openaiService.calculateCosineSimilarity(
      embedding1.embedding,
      embedding2.embedding
    );

    return {
      similarity,
      text1: request.text1,
      text2: request.text2,
      model: request.model || "text-embedding-ada-002",
    };
  }

  async getStoredEmbeddings(model?: string, limit?: number, offset?: number) {
    return await this.embeddingModel.findAll({ model, limit, offset });
  }

  async getStoredEmbedding(id: string) {
    return await this.embeddingModel.findById(id);
  }

  async deleteStoredEmbedding(id: string): Promise<boolean> {
    return await this.embeddingModel.delete(id);
  }

  /**
   * Create embeddings for text chunks
   */
  async createChunkedEmbedding(
    request: ChunkedEmbeddingRequest
  ): Promise<ChunkedEmbeddingResponse> {
    const { text, model, chunkingOptions } = request;

    // Create chunks from the text
    const chunks = this.chunkingService.createChunks(text, chunkingOptions);

    // Create embeddings for each chunk
    const chunkEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await this.openaiService.createEmbedding({
          text: chunk.text,
          model: model || "text-embedding-ada-002",
        });

        // Store each chunk embedding
        await this.embeddingModel.create({
          text: chunk.text,
          embedding: embedding.embedding,
          model: embedding.model,
        });

        return {
          chunkId: chunk.id,
          text: chunk.text,
          embedding: embedding.embedding,
          chunkIndex: chunk.chunkIndex,
          metadata: chunk.metadata,
        };
      })
    );

    return {
      originalText: text,
      chunks: chunkEmbeddings,
      model: model || "text-embedding-ada-002",
      totalChunks: chunks.length,
    };
  }

  /**
   * Compare embeddings between chunked texts
   */
  async compareChunkedEmbeddings(
    request: ChunkedComparisonRequest
  ): Promise<ChunkedComparisonResponse> {
    const { text1, text2, model, chunkingOptions } = request;

    // Create chunks for both texts
    const chunks1 = this.chunkingService.createChunks(text1, chunkingOptions);
    const chunks2 = this.chunkingService.createChunks(text2, chunkingOptions);

    // Create embeddings for all chunks
    const [embeddings1, embeddings2] = await Promise.all([
      Promise.all(
        chunks1.map(async (chunk) => {
          const embedding = await this.openaiService.createEmbedding({
            text: chunk.text,
            model: model || "text-embedding-ada-002",
          });
          return { chunk, embedding };
        })
      ),
      Promise.all(
        chunks2.map(async (chunk) => {
          const embedding = await this.openaiService.createEmbedding({
            text: chunk.text,
            model: model || "text-embedding-ada-002",
          });
          return { chunk, embedding };
        })
      ),
    ]);

    // Calculate similarities between all chunk pairs
    const chunkSimilarities: ChunkedComparisonResponse["chunkSimilarities"] =
      [];

    for (const { chunk: chunk1, embedding: emb1 } of embeddings1) {
      for (const { chunk: chunk2, embedding: emb2 } of embeddings2) {
        const similarity = this.openaiService.calculateCosineSimilarity(
          emb1.embedding,
          emb2.embedding
        );

        chunkSimilarities.push({
          chunk1Id: chunk1.id,
          chunk2Id: chunk2.id,
          similarity,
          chunk1Text: chunk1.text,
          chunk2Text: chunk2.text,
        });
      }
    }

    // Calculate aggregate statistics
    const similarities = chunkSimilarities.map((cs) => cs.similarity);
    const averageSimilarity =
      similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    const maxSimilarity = Math.max(...similarities);
    const minSimilarity = Math.min(...similarities);

    return {
      text1,
      text2,
      model: model || "text-embedding-ada-002",
      chunkSimilarities,
      averageSimilarity,
      maxSimilarity,
      minSimilarity,
    };
  }
}
