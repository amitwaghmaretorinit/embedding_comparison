import {
  ApiResponse,
  ChunkedComparisonRequest,
  ChunkedEmbeddingRequest,
  ComparisonRequest,
  EmbeddingRequest,
} from "../types";
import { Request, Response } from "express";

import { EmbeddingService } from "../services/EmbeddingService";

export class EmbeddingController {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  async createEmbedding(req: Request, res: Response): Promise<void> {
    try {
      const request: EmbeddingRequest = req.body;

      if (!request.text) {
        res.status(400).json({
          success: false,
          error: "Text is required",
        } as ApiResponse);
        return;
      }

      const result = await this.embeddingService.createEmbedding(request);

      res.status(201).json({
        success: true,
        data: result,
        message: "Embedding created successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }

  async compareEmbeddings(req: Request, res: Response): Promise<void> {
    try {
      const request: ComparisonRequest = req.body;

      if (!request.text1 || !request.text2) {
        res.status(400).json({
          success: false,
          error: "Both text1 and text2 are required",
        } as ApiResponse);
        return;
      }

      const result = await this.embeddingService.compareEmbeddings(request);

      res.status(200).json({
        success: true,
        data: result,
        message: "Embeddings compared successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }

  async getStoredEmbeddings(req: Request, res: Response): Promise<void> {
    try {
      const { model, limit, offset } = req.query;

      const result = await this.embeddingService.getStoredEmbeddings(
        model as string,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: result,
        message: "Embeddings retrieved successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }

  async getStoredEmbedding(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.embeddingService.getStoredEmbedding(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: "Embedding not found",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
        message: "Embedding retrieved successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }

  async deleteStoredEmbedding(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await this.embeddingService.deleteStoredEmbedding(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "Embedding not found",
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Embedding deleted successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }

  /**
   * Create embeddings for chunked text
   */
  async createChunkedEmbedding(req: Request, res: Response): Promise<void> {
    try {
      const request: ChunkedEmbeddingRequest = req.body;

      if (!request.text) {
        res.status(400).json({
          success: false,
          error: "Text is required",
        } as ApiResponse);
        return;
      }

      const result = await this.embeddingService.createChunkedEmbedding(
        request
      );

      res.status(201).json({
        success: true,
        data: result,
        message: "Chunked embeddings created successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }

  /**
   * Compare chunked embeddings
   */
  async compareChunkedEmbeddings(req: Request, res: Response): Promise<void> {
    try {
      const request: ChunkedComparisonRequest = req.body;

      if (!request.text1 || !request.text2) {
        res.status(400).json({
          success: false,
          error: "Both text1 and text2 are required",
        } as ApiResponse);
        return;
      }

      const result = await this.embeddingService.compareChunkedEmbeddings(
        request
      );

      res.status(200).json({
        success: true,
        data: result,
        message: "Chunked embeddings compared successfully",
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as ApiResponse);
    }
  }
}
