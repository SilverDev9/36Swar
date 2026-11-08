import asyncHandler from "express-async-handler";
import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";

export const listPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id }).populate("songs").sort({ updatedAt: -1 });
  res.json({ playlists });
});

export const createPlaylist = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) { res.status(400); throw new Error("Playlist name is required"); }
  const playlist = await Playlist.create({ name, description: req.body.description || "", owner: req.user._id });
  res.status(201).json({ playlist });
});

export const addSong = asyncHandler(async (req, res) => {
  const [playlist, song] = await Promise.all([
    Playlist.findOne({ _id: req.params.id, owner: req.user._id }),
    Song.findById(req.body.songId)
  ]);
  if (!playlist) { res.status(404); throw new Error("Playlist not found"); }
  if (!song) { res.status(404); throw new Error("Song not found"); }
  if (!playlist.songs.some(id => id.equals(song._id))) playlist.songs.push(song._id);
  await playlist.save();
  await playlist.populate("songs");
  res.json({ playlist });
});

export const removeSong = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
  if (!playlist) { res.status(404); throw new Error("Playlist not found"); }
  playlist.songs = playlist.songs.filter(id => id.toString() !== req.params.songId);
  await playlist.save();
  res.json({ message: "Song removed from playlist" });
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const result = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!result) { res.status(404); throw new Error("Playlist not found"); }
  res.json({ message: "Playlist deleted" });
});
