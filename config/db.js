import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("No MONGO_URI found. Continuing without MongoDB.");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("DB connection error, continuing with local fallback:", error.message);
  }
};

export default connectDB;