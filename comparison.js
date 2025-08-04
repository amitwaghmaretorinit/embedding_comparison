const createJDEmbedding = async () => {
  const embeddingFORJd = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Hello, world!",
  });
  const embeddingFORResume = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Hello, world!",
  });
  
  const fitPercentate=compareEmbeddings(embeddingFORJd,embeddingFORResume)
};

const compareEmbeddings = async (em1,em2) => {
   // cosing simlarity algo
};