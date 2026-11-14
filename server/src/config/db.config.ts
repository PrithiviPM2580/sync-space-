import mongoose from "mongoose";
import { Env } from "./env.config";
import { logger } from "@/utils/logger.util";

mongoose.set("sanitizeFilter", true);

export const connectDatabse = async (): Promise<void> => {
  await mongoose.connect(Env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  logger.info("Connected to MongoDB", { databse: mongoose.connection.name });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("Disconnected from MongoDB", {
    databse: mongoose.connection.name,
  });
};
