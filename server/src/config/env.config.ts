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
};
