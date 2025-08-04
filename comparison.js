const createJDEmbedding = async () => {
  const embeddingFORJd = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Hello, world!",
  });
  const embeddingFORResume = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Hello, world!",
  });

  const fitPercentate = compareEmbeddings(embeddingFORJd, embeddingFORResume);
};

function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be of the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0; // avoid division by zero
  }

  return dotProduct / (normA * normB);
}
