import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Song from "../models/Song.js";

export const listLikedSongs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: "likedSongs", options: { sort: { createdAt: -1 } } });
  res.json({ songs: user.likedSongs });
});

export const likeSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) { res.status(404); throw new Error("Song not found"); }
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedSongs: song._id } });
  res.json({ liked: true });
});

export const unlikeSong = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { likedSongs: req.params.id } });
  res.json({ liked: false });
});
