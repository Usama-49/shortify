import type { Request, Response } from "express";
import { urlModel } from "../models/shorturl.model.js";
import { getNanoId } from "../utils/getNanoId.js";

export const createShortUrl = async (req: Request, res: Response) => {
  const { url } = req.body;
  const shortUrl = getNanoId(8);
  const newUrl = new urlModel({
    fullUrl: url,
    shortUrl,
  });
  await newUrl.save();
  res.status(201).json({
    message: "Short url created!",
    url: newUrl.shortUrl,
  });
};

export const redirectToUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const url = await urlModel.findOne({ shortUrl: id });
  if (!url) {
    return res.status(404).json({
      message: "Invalid short url!",
    });
  }
  return res.redirect(url.fullUrl);
};
