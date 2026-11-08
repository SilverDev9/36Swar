import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listLikedSongs, likeSong, unlikeSong } from "../controllers/likeController.js";
const router = Router();
router.use(protect);
router.get("/", listLikedSongs);
router.post("/:id", likeSong);
router.delete("/:id", unlikeSong);
export default router;
