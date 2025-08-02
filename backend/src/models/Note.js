import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
