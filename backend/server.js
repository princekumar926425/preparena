import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: [path.join(backendDirectory, ".env"), path.resolve(backendDirectory, "..", ".env")],
});
if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
  process.env.MONGODB_URI = process.env.MONGO_URI;
}

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:8080")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(200).json({ status: "ok", database: connected ? "connected" : "disconnected" });
});
app.use("/api", authRoutes);
app.use("/api", contentRoutes);
app.use("/api", compilerRoutes);
app.use(notFound);
app.use(errorHandler);

await connectDB();
app.listen(port, () => {
  console.info(`PrepArena API listening on http://localhost:${port}`);
});
