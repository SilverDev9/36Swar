import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import songRoutes from "./src/routes/songRoutes.js";
import playlistRoutes from "./src/routes/playlistRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "SoundWave API" }));
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/likes", likeRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`SoundWave API running on port ${PORT}`));
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
