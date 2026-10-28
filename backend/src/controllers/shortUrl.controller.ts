import type { NextFunction, Request, Response } from "express";
import { urlModel } from "../models/shorturl.model.js";
import { getNanoId } from "../utils/getNanoId.js";

export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      return next({ status: 400, message: "url missing!" });
    }
    const shortUrl = getNanoId(8);
    const newUrl = new urlModel({
      fullUrl: url,
      shortUrl,
    });
    await newUrl.save();
    const appUrl = process.env.APP_URL;
    res.status(201).json({
      message: "Short url created!",
      url: appUrl + "redirect/" + newUrl.shortUrl,
    });
  } catch (err) {
    next(err);
  }
};

export const redirectToUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const url = await urlModel.findOneAndUpdate({ shortUrl: id }, { $inc: { clicks: 1 } });
    if (!url) {
      return next({ status: 400, message: "Invalid short url!" });
    }
    res.redirect(url.fullUrl);
  } catch (err) {
    next(err);
  }
};
