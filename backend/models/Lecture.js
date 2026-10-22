import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subject: { type: String, required: true, trim: true, maxlength: 80 },
    topic: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 2000 },
    notes: { type: String, default: "", maxlength: 20000 },
    videoUrl: { type: String, default: "", maxlength: 1000 },
    thumbnail: { type: String, default: "", maxlength: 1000 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Lecture", lectureSchema);
