import express from "express";
import { createShortUrl, redirectToUrl } from "../controllers/shortUrl.controller.js";
import { optionalProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", optionalProtect, createShortUrl);
router.get("/redirect/:id", redirectToUrl);

export default router;
