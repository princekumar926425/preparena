import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not set; database-backed API routes will return 503.");
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.info(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.code || error.name || "unknown error");
    return false;
  }
}

export function requireDatabase(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database is unavailable. Configure MONGODB_URI and start MongoDB." });
  }
  next();
}
