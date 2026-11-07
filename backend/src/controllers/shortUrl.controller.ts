import type { NextFunction, Request, Response } from "express";
import { urlModel } from "../models/shorturl.model.js";
import { getNanoId } from "../utils/getNanoId.js";
import { generateShortUrl } from "../utils/generateShortUrl.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createShortUrl = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;
    if (!url) {
      throw { status: 400, message: "url missing!" };
    }
    const newUrl = await generateShortUrl(url);

    //changed: Added fallback to default origin if process.env.APP_URL is not set
    const baseUrl = (process.env.APP_URL || "http://localhost:5000").replace(/\/$/, "");

    res.status(201).json({
      success: true,
      message: "Short url created!",
      //changed: Simplified response structure to use generated shortUrl field safely
      shortUrl: `${baseUrl}/redirect/${newUrl.shortUrl}`,
    });
  },
);

export const redirectToUrl = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const url = await urlModel.findOneAndUpdate({ shortUrl: id }, { $inc: { clicks: 1 } });
    if (!url) {
      throw { status: 404, message: "Short URL not found!" };
    }
    res.redirect(url.fullUrl);
  },
);
