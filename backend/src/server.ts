import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Routes
app.use("/api", apiRoutes);

// Fallback & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect DB and Start Server
export const startServer = async () => {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`[Server] DJI Drone Store Backend listening on http://localhost:${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`[Server] API Base URL: http://localhost:${PORT}/api`);
  });

  return server;
};

// Start server if run directly
if (require.main === module || process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
