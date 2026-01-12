import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";
import routes from "./src/routes/index.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Health check is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server with HTTP server so Socket.io can attach
import http from "http";
import { initSocket } from "./src/lib/socket.js";

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌍 Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
