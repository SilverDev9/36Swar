import asyncHandler from "express-async-handler";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import Song from "../models/Song.js";
import Playlist from "../models/Playlist.js";
import User from "../models/User.js";

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
}

export const listSongs = asyncHandler(async (req, res) => {
  const { search, genre } = req.query;
  const filter = {};
  if (genre) filter.genre = genre;
  if (search?.trim()) {
    filter.$or = ["title", "artist", "album", "genre"].map((key) => ({
      [key]: { $regex: search.trim(), $options: "i" }
    }));
  }
  const songs = await Song.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ songs });
});

export const getSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) { res.status(404); throw new Error("Song not found"); }
  res.json({ song });
});

export const uploadSong = asyncHandler(async (req, res) => {
  const { title, artist, genre, album } = req.body;
  if (!title?.trim() || !artist?.trim() || !req.files?.audio?.[0]) {
    res.status(400); throw new Error("Title, artist and audio file are required");
  }

  const audioFile = req.files.audio[0];
  if (!audioFile.mimetype.startsWith("audio/") && audioFile.mimetype !== "video/mp4") {
    res.status(400); throw new Error("Please upload a supported audio file");
  }
  if (req.files.cover?.[0] && !req.files.cover[0].mimetype.startsWith("image/")) {
    res.status(400); throw new Error("Cover art must be an image");
  }
  const audio = await uploadBuffer(audioFile.buffer, {
    resource_type: "video",
    folder: "soundwave/audio",
    use_filename: true,
    unique_filename: true
  });

  let cover = null;
  if (req.files.cover?.[0]) {
    cover = await uploadBuffer(req.files.cover[0].buffer, {
      resource_type: "image",
      folder: "soundwave/covers"
    });
  }

  const song = await Song.create({
    title: title.trim(),
    artist: artist.trim(),
    genre: genre || "Other",
    album: album || "Single",
    audioUrl: audio.secure_url,
    audioPublicId: audio.public_id,
    coverUrl: cover?.secure_url || "",
    coverPublicId: cover?.public_id || "",
    uploadedBy: req.user._id
  });

  res.status(201).json({ song });
});

export const adminStats = asyncHandler(async (_req, res) => {
  const [totalSongs, totalPlays, latestSongs] = await Promise.all([
    Song.countDocuments(),
    Song.aggregate([{ $group: { _id: null, total: { $sum: "$plays" } } }]),
    Song.find().sort({ createdAt: -1 }).limit(5)
  ]);
  res.json({ stats: { totalSongs, totalPlays: totalPlays[0]?.total || 0 }, latestSongs });
});

export const deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) { res.status(404); throw new Error("Song not found"); }
  await Song.findByIdAndDelete(song._id);
  res.json({ message: "Song removed from catalogue" });
});

export const recordPlay = asyncHandler(async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } }, { new: true });
  if (!song) { res.status(404); throw new Error("Song not found"); }
  res.json({ plays: song.plays });
});
