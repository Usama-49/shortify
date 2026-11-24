import express from "express";
import { createShortUrl, deleteShortUrl, getDashboardData, redirectToUrl } from "../controllers/shortUrl.controller.js";
import { optionalProtect, protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", optionalProtect, createShortUrl);
router.get("/redirect/:id", redirectToUrl);
router.get("/dashboard", protectRoute, getDashboardData);
router.delete("/url/:id", protectRoute, deleteShortUrl);

export default router;
