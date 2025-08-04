import dotenv from "dotenv";

dotenv.config();

export type AppConfig = {
  port: number;
  nodeEnv: string;
  openaiApiKey: string;
  corsOrigin: string;
};

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

export const isDevelopment = (): boolean => {
  return appConfig.nodeEnv === "development";
};

export const isProduction = (): boolean => {
  return appConfig.nodeEnv === "production";
};
