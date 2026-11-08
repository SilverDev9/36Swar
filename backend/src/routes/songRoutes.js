import { Router } from "express";
import multer from "multer";
import { listSongs, getSong, uploadSong, deleteSong, recordPlay, adminStats } from "../controllers/songController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 2, fields: 8 },
  fileFilter: (_req, file, cb) => {
    const allowed = file.fieldname === "audio"
      ? file.mimetype.startsWith("audio/") || file.mimetype === "video/mp4"
      : file.mimetype.startsWith("image/");
    if (!allowed) {
      const error = new Error("Unsupported file type");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  }
});

router.get("/", listSongs);
router.get("/admin/stats", protect, adminOnly, adminStats);
router.get("/:id", getSong);
router.post("/upload", protect, adminOnly, upload.fields([{ name: "audio", maxCount: 1 }, { name: "cover", maxCount: 1 }]), uploadSong);
router.post("/:id/play", recordPlay);
router.delete("/:id", protect, adminOnly, deleteSong);
export default router;
