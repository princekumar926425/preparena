import { Router } from "express";

const router = Router();

router.post("/run", (_req, res) => {
  res.status(503).json({
    message: "Code execution is disabled until a properly isolated compiler service is configured.",
  });
});

export default router;
