import { Router } from "express";
import { createContest, createLecture, listContests, listLectures } from "../controllers/contentController.js";
import { requireDatabase } from "../config/db.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/contests", requireDatabase, listContests);
router.post("/contests", requireDatabase, requireAuth, requireAdmin, createContest);
router.get("/lectures", requireDatabase, listLectures);
router.post("/lectures", requireDatabase, requireAuth, requireAdmin, createLecture);

export default router;
