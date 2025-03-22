import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "your-mongodb-connection-string";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`⚡ Server running on http://localhost:${PORT}`));

