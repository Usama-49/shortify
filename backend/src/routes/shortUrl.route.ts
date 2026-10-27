import express from "express";
import { createShortUrl, redirectToUrl } from "../controllers/shortUrl.controller.js";

const router = express.Router();

router.post("/create", createShortUrl);
router.get("/redirect/:id", redirectToUrl);

export default router;
