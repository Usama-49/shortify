import express from "express";
import { googleAuthCallback, googleAuthStart, logoutUser, verify } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/logout', logoutUser);
router.get('/verify', protectRoute, verify);
router.get("/google", googleAuthStart);
router.get("/google/callback", googleAuthCallback);
export default router;
