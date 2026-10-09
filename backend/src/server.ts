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
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1):[0-9]+$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Endpoints (Required for Render zero-downtime health checks & monitoring)
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
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

// API Root Routes
app.use("/api", apiRoutes);

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

  return server;
};

// Start server if run directly
if (require.main === module || process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
