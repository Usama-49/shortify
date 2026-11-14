import express from "express";
import { loginUser, logoutUser, registerUser, verify } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/verify', protectRoute, verify);
export default router;
