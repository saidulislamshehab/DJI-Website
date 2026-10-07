import mongoose from "mongoose";
import { DbStore } from "../services/dbStore";

export const connectDatabase = async (): Promise<void> => {
  // Always initialize local persistent store
  DbStore.getInstance();

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dji-drone-store";
  const dbName = process.env.MONGODB_DB_NAME || "dji-drone-store";

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: dbName,
    });
    console.log(`[Database] MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error: any) {
    if (process.env.NODE_ENV === "production" && process.env.STRICT_DB === "true") {
      console.error("[Database] Production MongoDB error:", error);
      process.exit(1);
    } else {
      console.warn(`[Database] MongoDB connection attempt failed (${error?.message || error}).`);
      console.log("[Database] Active embedded persistent store is operating with full persistence.");
    }
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[Database] MongoDB disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[Database] MongoDB connection error:", err);
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("[Database] MongoDB disconnected cleanly.");
  } catch (error) {
    console.error("[Database] Error disconnecting MongoDB:", error);
  }
};
