import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { connectDatabase } from "./config/database";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Security & Utility Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

import mongoose from "mongoose";

// Support comma-separated origins in CLIENT_URL (e.g., https://my-frontend.vercel.app,http://localhost:3000)
const configuredOrigins = CLIENT_URL
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isExplicitlyAllowed = allowedOrigins.includes(origin);
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):[0-9]+$/.test(origin);
      const isVercelPreview = origin.endsWith(".vercel.app") && configuredOrigins.some((o) => o.includes("vercel.app"));

      if (isExplicitlyAllowed || isLocalhost || isVercelPreview || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: Access denied for origin ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Endpoints (Required for Render zero-downtime health checks & monitoring)
app.get(["/health", "/api/health"], (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const isDbReady = dbState === 1;

  res.status(isDbReady || process.env.NODE_ENV !== "production" ? 200 : 503).json({
    status: isDbReady ? "ok" : "degraded",
    uptime: Math.floor(process.uptime()),
    database: dbStatusMap[dbState] || "unknown",
    emailConfigured: Boolean(
      process.env.RESEND_API_KEY?.trim() ||
      process.env.BREVO_API_KEY?.trim() ||
      (process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASS?.trim())
    ),
    emailProvider: process.env.RESEND_API_KEY?.trim()
      ? "resend"
      : process.env.BREVO_API_KEY?.trim()
      ? "brevo"
      : "smtp",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "DJI Store API",
    status: "running",
    version: "1.0.0",
    docs: "/api",
    health: "/health",
  });
});

// API Root Routes (supports both /api/* and root /* endpoints)
app.use("/api", apiRoutes);
app.use(apiRoutes);

// Fallback & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect DB and Start Server
export const startServer = async () => {
  await connectDatabase();

  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Server] DJI Drone Store Backend listening on port ${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`[Server] Health Check: http://localhost:${PORT}/health`);
    console.log(`[Server] API Base URL: http://localhost:${PORT}/api`);
  });

  const gracefulShutdown = async () => {
    console.log("[Server] Received shutdown signal. Closing HTTP server and database...");
    server.close(async () => {
      try {
        await mongoose.disconnect();
        console.log("[Server] Shutdown complete.");
        process.exit(0);
      } catch {
        process.exit(1);
      }
    });
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  return server;
};

// Start server if run directly
if (require.main === module || process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
