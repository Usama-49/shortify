import { Types } from "mongoose";
import { urlModel } from "../models/shorturl.model.js";
import { getNanoId } from "./getNanoId.js";

export const generateShortUrl = async (url: string, userId: string | null) => {

  const existing = await urlModel.findOne({ fullUrl: url }).lean();
  if (existing) {
    return existing;
  }

  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shortUrl = getNanoId(8);

    try {
      return await urlModel.create({
        fullUrl: url,
        shortUrl,
        ...(userId ? { user: new Types.ObjectId(userId) } : {}),
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        // If the collision was on fullUrl due to a race condition, return that existing doc
        if (err?.keyPattern?.fullUrl) {
          const raceDoc = await urlModel.findOne({ fullUrl: url }).lean();
          if (raceDoc) return raceDoc;
        }
        continue;
      }
      throw err;
    }
  }

  throw { status: 500, message: "Failed to generate unique short URL. Please try again." };
};

const RESERVED_SLUGS = ['api', 'auth', 'login', 'logout', 'register', 'redirect', 'dashboard', 'health'];

export const createCustomUrl = async (url: string, slug: string, userId: string) => {
  if (!slug || slug.length < 3 || slug.length > 8) {
    throw { status: 400, message: "Custom short URL must be between 3 and 8 characters long." };
  }

  const cleanRegex = /^[a-zA-Z0-9_-]+$/;
  if (!cleanRegex.test(slug)) {
    throw { status: 400, message: "Custom short URL can only contain letters, numbers, hyphens, and underscores." };
  }

  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    throw { status: 400, message: "This custom short URL is reserved and cannot be used." };
  }

  const existing = await urlModel.findOne({ shortUrl: slug }).lean();
  if (existing) {
    throw { status: 409, message: "This custom short URL is already taken. Please choose another one." };
  }

  try {
    return await urlModel.create({
      fullUrl: url,
      shortUrl: slug,
      user: new Types.ObjectId(userId),
    });
  } catch (err: any) {
    if (err?.code === 11000) {
      throw { status: 409, message: "This custom short URL is already taken. Try a different one" };
    }
    throw err;
  }
};
