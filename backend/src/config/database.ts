import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dji-drone-store";

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error("[Database] MongoDB connection error:", error);
    // In development or when MongoDB isn't running locally, log a warning rather than crashing immediately
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.warn("[Database] Running without MongoDB active connection in development mode.");
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
