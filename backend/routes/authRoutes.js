import { Router } from "express";
import { login, signup } from "../controllers/authController.js";
import { requireDatabase } from "../config/db.js";

const router = Router();
router.post("/signup", requireDatabase, signup);
router.post("/login", requireDatabase, login);

export default router;
