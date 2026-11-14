import type { NextFunction, Request, Response } from "express";
import { urlModel } from "../models/shorturl.model.js";
import { createCustomUrl, generateShortUrl } from "../utils/generateShortUrl.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const createShortUrl = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { url, slug } = req.body;

    if (!url) {
      const error: any = new Error("url missing!");
      error.status = 400;
      throw error;
    }

    const userId = req.user?.userId || null;
    let newUrl;

    const baseUrl = (process.env.APP_URL || "http://localhost:5000").replace(/\/$/, "");

    if (slug) {
      if (!userId) {
        const error: any = new Error("Authentication required to create custom short URLs.");
        error.status = 401;
        throw error;
      }
      newUrl = await createCustomUrl(url, slug.trim(), userId);
    } else {
      // Standard random generation flow (guests or logged-in users)
      newUrl = await generateShortUrl(url, userId);
    }

    res.status(201).json({
      success: true,
      message: slug ? "Custom short url created!" : "Short url created!",
      shortUrl: `${baseUrl}/redirect/${newUrl.shortUrl}`,
      createdBy: userId ? "authenticated" : "guest",
    });
  }
);

export const redirectToUrl = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const url = await urlModel.findOneAndUpdate({ shortUrl: id }, { $inc: { clicks: 1 } });

    if (!url) {
      const error: any = new Error("Short URL not found!");
      error.status = 404;
      throw error;
    }

    res.redirect(url.fullUrl);
  }
);