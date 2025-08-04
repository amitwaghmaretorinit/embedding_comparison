import { EmbeddingController } from "../controllers/EmbeddingController";
import { Router } from "express";

const router = Router();
const embeddingController = new EmbeddingController();

// Create a new embedding
router.post("/create", (req, res) =>
  embeddingController.createEmbedding(req, res)
);

// Create chunked embeddings
router.post("/create-chunked", (req, res) =>
  embeddingController.createChunkedEmbedding(req, res)
);

// Compare two embeddings
router.post("/compare", (req, res) =>
  embeddingController.compareEmbeddings(req, res)
);

// Compare chunked embeddings
router.post("/compare-chunked", (req, res) =>
  embeddingController.compareChunkedEmbeddings(req, res)
);

// Get all stored embeddings (with optional filtering)
router.get("/stored", (req, res) =>
  embeddingController.getStoredEmbeddings(req, res)
);

// Get a specific stored embedding by ID
router.get("/stored/:id", (req, res) =>
  embeddingController.getStoredEmbedding(req, res)
);

// Delete a stored embedding by ID
router.delete("/stored/:id", (req, res) =>
  embeddingController.deleteStoredEmbedding(req, res)
);

export default router;
