import { Router } from "express";
import authController, { getMe } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddlewares";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, getMe);

export default router;
