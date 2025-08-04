export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type EmbeddingRequest = {
  text: string;
  model?: string;
};

export type EmbeddingResponse = {
  embedding: number[];
  model: string;
  text: string;
};

export type ComparisonRequest = {
  text1: string;
  text2: string;
  model?: string;
};

export type ComparisonResponse = {
  similarity: number;
  text1: string;
  text2: string;
  model: string;
};

export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};

export type ChunkedEmbeddingRequest = {
  text: string;
  model?: string;
  chunkingOptions?: {
    maxChunkSize?: number;
    overlapSize?: number;
    chunkBy?: "characters" | "words" | "sentences" | "paragraphs";
    preserveFormatting?: boolean;
  };
};

export type ChunkedEmbeddingResponse = {
  originalText: string;
  chunks: Array<{
    chunkId: string;
    text: string;
    embedding: number[];
    chunkIndex: number;
    metadata?: Record<string, any>;
  }>;
  model: string;
  totalChunks: number;
};

export type ChunkedComparisonRequest = {
  text1: string;
  text2: string;
  model?: string;
  chunkingOptions?: {
    maxChunkSize?: number;
    overlapSize?: number;
    chunkBy?: "characters" | "words" | "sentences" | "paragraphs";
    preserveFormatting?: boolean;
  };
};

export type ChunkedComparisonResponse = {
  text1: string;
  text2: string;
  model: string;
  chunkSimilarities: Array<{
    chunk1Id: string;
    chunk2Id: string;
    similarity: number;
    chunk1Text: string;
    chunk2Text: string;
  }>;
  averageSimilarity: number;
  maxSimilarity: number;
  minSimilarity: number;
};
