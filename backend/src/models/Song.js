import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  album: { type: String, default: "Single" },
  genre: { type: String, default: "Other" },
  audioUrl: { type: String, required: true },
  audioPublicId: { type: String, required: true },
  coverUrl: { type: String, default: "" },
  coverPublicId: { type: String, default: "" },
  duration: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plays: { type: Number, default: 0 }
}, { timestamps: true });

songSchema.index({ title: "text", artist: "text", album: "text", genre: "text" });
export default mongoose.model("Song", songSchema);
