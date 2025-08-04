export type ChunkingOptions = {
  maxChunkSize?: number;
  overlapSize?: number;
  chunkBy?: "characters" | "words" | "sentences" | "paragraphs";
  preserveFormatting?: boolean;
};

export type TextChunk = {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  chunkIndex: number;
  metadata?: Record<string, any>;
};

export class TextChunkingService {
  private defaultOptions: Required<ChunkingOptions> = {
    maxChunkSize: 1000,
    overlapSize: 100,
    chunkBy: "characters",
    preserveFormatting: true,
  };

  /**
   * Split text into chunks based on specified options
   */
  createChunks(text: string, options: ChunkingOptions = {}): TextChunk[] {
    const opts = { ...this.defaultOptions, ...options };

    if (text.length <= opts.maxChunkSize) {
      return [this.createSingleChunk(text, 0, text.length, 0)];
    }

    switch (opts.chunkBy) {
      case "words":
        return this.chunkByWords(text, opts);
      case "sentences":
        return this.chunkBySentences(text, opts);
      case "paragraphs":
        return this.chunkByParagraphs(text, opts);
      case "characters":
      default:
        return this.chunkByCharacters(text, opts);
    }
  }

  /**
   * Split text by characters with overlap
   */
  private chunkByCharacters(
    text: string,
    options: Required<ChunkingOptions>
  ): TextChunk[] {
    const chunks: TextChunk[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + options.maxChunkSize, text.length);
      const chunkText = text.slice(startIndex, endIndex);

      chunks.push(
        this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
      );

      startIndex = endIndex - options.overlapSize;
      chunkIndex++;

      // Prevent infinite loop if overlap is larger than chunk size
      if (startIndex >= endIndex) {
        break;
      }
    }

    return chunks;
  }

  /**
   * Split text by words with overlap
   */
  private chunkByWords(
    text: string,
    options: Required<ChunkingOptions>
  ): TextChunk[] {
    const words = text.split(/\s+/);
    const chunks: TextChunk[] = [];
    let currentChunk: string[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testChunk = [...currentChunk, word];

      if (
        testChunk.join(" ").length > options.maxChunkSize &&
        currentChunk.length > 0
      ) {
        // Save current chunk
        const chunkText = currentChunk.join(" ");
        const endIndex = startIndex + chunkText.length;
        chunks.push(
          this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
        );

        // Start new chunk with overlap
        const overlapWords = this.getOverlapWords(
          currentChunk,
          options.overlapSize
        );
        currentChunk = [...overlapWords, word];
        startIndex = endIndex - overlapWords.join(" ").length;
        chunkIndex++;
      } else {
        currentChunk.push(word);
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      const chunkText = currentChunk.join(" ");
      const endIndex = startIndex + chunkText.length;
      chunks.push(
        this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
      );
    }

    return chunks;
  }

  /**
   * Split text by sentences with overlap
   */
  private chunkBySentences(
    text: string,
    options: Required<ChunkingOptions>
  ): TextChunk[] {
    const sentences = this.splitIntoSentences(text);
    const chunks: TextChunk[] = [];
    let currentChunk: string[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const testChunk = [...currentChunk, sentence];

      if (
        testChunk.join(" ").length > options.maxChunkSize &&
        currentChunk.length > 0
      ) {
        // Save current chunk
        const chunkText = currentChunk.join(" ");
        const endIndex = startIndex + chunkText.length;
        chunks.push(
          this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
        );

        // Start new chunk with overlap
        const overlapSentences = this.getOverlapSentences(
          currentChunk,
          options.overlapSize
        );
        currentChunk = [...overlapSentences, sentence];
        startIndex = endIndex - overlapSentences.join(" ").length;
        chunkIndex++;
      } else {
        currentChunk.push(sentence);
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      const chunkText = currentChunk.join(" ");
      const endIndex = startIndex + chunkText.length;
      chunks.push(
        this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
      );
    }

    return chunks;
  }

  /**
   * Split text by paragraphs with overlap
   */
  private chunkByParagraphs(
    text: string,
    options: Required<ChunkingOptions>
  ): TextChunk[] {
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const chunks: TextChunk[] = [];
    let currentChunk: string[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const testChunk = [...currentChunk, paragraph];

      if (
        testChunk.join("\n\n").length > options.maxChunkSize &&
        currentChunk.length > 0
      ) {
        // Save current chunk
        const chunkText = currentChunk.join("\n\n");
        const endIndex = startIndex + chunkText.length;
        chunks.push(
          this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
        );

        // Start new chunk with overlap
        const overlapParagraphs = this.getOverlapParagraphs(
          currentChunk,
          options.overlapSize
        );
        currentChunk = [...overlapParagraphs, paragraph];
        startIndex = endIndex - overlapParagraphs.join("\n\n").length;
        chunkIndex++;
      } else {
        currentChunk.push(paragraph);
      }
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      const chunkText = currentChunk.join("\n\n");
      const endIndex = startIndex + chunkText.length;
      chunks.push(
        this.createSingleChunk(chunkText, startIndex, endIndex, chunkIndex)
      );
    }

    return chunks;
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    // Simple sentence splitting - can be improved with NLP libraries
    return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  }

  /**
   * Get overlap words for word-based chunking
   */
  private getOverlapWords(words: string[], overlapSize: number): string[] {
    const overlapText = words.slice(-Math.ceil(overlapSize / 10)).join(" ");
    if (overlapText.length <= overlapSize) {
      return words.slice(-Math.ceil(overlapSize / 10));
    }

    // Find the right number of words to fit overlap size
    for (let i = words.length - 1; i >= 0; i--) {
      const testOverlap = words.slice(i).join(" ");
      if (testOverlap.length <= overlapSize) {
        return words.slice(i);
      }
    }

    return [];
  }

  /**
   * Get overlap sentences for sentence-based chunking
   */
  private getOverlapSentences(
    sentences: string[],
    overlapSize: number
  ): string[] {
    const overlapText = sentences.slice(-1).join(" ");
    if (overlapText.length <= overlapSize) {
      return sentences.slice(-1);
    }
    return [];
  }

  /**
   * Get overlap paragraphs for paragraph-based chunking
   */
  private getOverlapParagraphs(
    paragraphs: string[],
    overlapSize: number
  ): string[] {
    const overlapText = paragraphs.slice(-1).join("\n\n");
    if (overlapText.length <= overlapSize) {
      return paragraphs.slice(-1);
    }
    return [];
  }

  /**
   * Create a single text chunk
   */
  private createSingleChunk(
    text: string,
    startIndex: number,
    endIndex: number,
    chunkIndex: number
  ): TextChunk {
    return {
      id: `chunk_${chunkIndex}_${startIndex}_${endIndex}`,
      text: text.trim(),
      startIndex,
      endIndex,
      chunkIndex,
      metadata: {
        chunkSize: text.length,
        wordCount: text.split(/\s+/).length,
      },
    };
  }

  /**
   * Reconstruct original text from chunks (for verification)
   */
  reconstructText(chunks: TextChunk[]): string {
    return chunks
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map((chunk) => chunk.text)
      .join(" ");
  }
}
