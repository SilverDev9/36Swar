import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listPlaylists, createPlaylist, addSong, removeSong, deletePlaylist } from "../controllers/playlistController.js";

const router = Router();
router.use(protect);
router.get("/", listPlaylists);
router.post("/", createPlaylist);
router.post("/:id/songs", addSong);
router.delete("/:id/songs/:songId", removeSong);
router.delete("/:id", deletePlaylist);
export default router;
