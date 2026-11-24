import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { urlModel } from "../models/shorturl.model.js";
import { createCustomUrl, generateShortUrl } from "../utils/generateShortUrl.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const getBaseUrl = (): string =>
  (process.env.APP_URL || "http://localhost:5000").replace(/\/$/, "");

export const createShortUrl = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { url, slug } = req.body;

    if (!url) {
      const error: any = new Error("url missing!");
      error.status = 400;
      throw error;
    }

    const userId = req.user?.userId || null;
    let newUrl;

    const baseUrl = getBaseUrl();

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
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const url = await urlModel.findOneAndUpdate(
      { shortUrl: id },
      { $inc: { clicks: 1 } }
    );

    if (!url) {
      const error: any = new Error("Short URL not found!");
      error.status = 404;
      throw error;
    }

    res.redirect(url.fullUrl);
  }
);

export const getDashboardData = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      const error: any = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const [user, urls] = await Promise.all([
      User.findById(userId)
        .select("username email avatar isUserVerified createdAt")
        .lean(),
      urlModel.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const baseUrl = getBaseUrl();

    const formattedUrls = urls.map((doc) => ({
      id: doc._id.toString(),
      originalUrl: doc.fullUrl,
      slug: doc.shortUrl,
      shortUrl: `${baseUrl}/redirect/${doc.shortUrl}`,
      clicks: doc.clicks ?? 0,
      createdAt: doc.createdAt,
    }));

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isUserVerified: Boolean(user.isUserVerified),
      },
      urls: formattedUrls,
    });
  }
);

export const deleteShortUrl = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      const error: any = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error: any = new Error("Invalid link ID");
      error.status = 400;
      throw error;
    }

    const deleted = await urlModel.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      const error: any = new Error("Short link not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Short link deleted successfully",
    });
  }
);