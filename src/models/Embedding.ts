export type Embedding = {
  id: string;
  text: string;
  embedding: number[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmbeddingData = {
  text: string;
  embedding: number[];
  model: string;
};

export type EmbeddingFilters = {
  model?: string;
  limit?: number;
  offset?: number;
};

export class EmbeddingModel {
  private embeddings: Embedding[] = [];

  async create(data: CreateEmbeddingData): Promise<Embedding> {
    const embedding: Embedding = {
      id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.embeddings.push(embedding);
    return embedding;
  }

  async findById(id: string): Promise<Embedding | null> {
    return this.embeddings.find((emb) => emb.id === id) || null;
  }

  async findAll(filters?: EmbeddingFilters): Promise<Embedding[]> {
    let filtered = [...this.embeddings];

    if (filters?.model) {
      filtered = filtered.filter((emb) => emb.model === filters.model);
    }

    if (filters?.offset) {
      filtered = filtered.slice(filters.offset);
    }

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.embeddings.findIndex((emb) => emb.id === id);
    if (index === -1) return false;

    this.embeddings.splice(index, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
