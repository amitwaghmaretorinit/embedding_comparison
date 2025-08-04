import { Router } from "express";
import embeddingRoutes from "./embeddingRoutes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use("/api/embeddings", embeddingRoutes);

export default router;
