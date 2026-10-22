import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 2000 },
    status: { type: String, enum: ["live", "upcoming", "ended"], default: "upcoming" },
    participants: { type: Number, min: 0, default: 0 },
    duration: { type: String, required: true, maxlength: 40 },
    problems: { type: Number, min: 1, default: 1 },
    startTime: { type: String, required: true, maxlength: 100 },
  },
  { timestamps: true },
);

export default mongoose.model("Contest", contestSchema);
