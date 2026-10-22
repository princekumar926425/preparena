import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, value) {
        delete value.password;
        delete value.__v;
        return value;
      },
    },
  },
);

export default mongoose.model("User", userSchema);
