import "dotenv/config";
import { getEnv } from "@/utils/get-env.util";

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", "3000")),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1h"),
  APP_URL: getEnv("APP_URL", "http://localhost:3000"),
  CROSS_ORIGIN: getEnv("CROSS_ORIGIN", "http://localhost:3000"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", ""),
  GOOGLE_CALLBACK_URL: getEnv(
    "GOOGLE_CALLBACK_URL",
    "http://localhost:3000/auth/google/callback",
  ),
};
