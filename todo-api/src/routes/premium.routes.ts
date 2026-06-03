import { Router } from "express";
import authMiddleware from "../middlewares/authMiddlewares";
import { requirePremium } from "../middlewares/premiumMiddleware";

const router = Router();

router.get("/ai-suggest", authMiddleware, requirePremium, (req, res) => {
  res.json({ message: "AI Suggestion just for Premium users!" });
});

export default router;
