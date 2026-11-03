import { urlModel } from "../models/shorturl.model.js";
import { getNanoId } from "./getNanoId.js";

export const generateShortUrl = async (url: string) => {
  // 1. Deduplication Check: Return existing short URL if long URL was already shortened
  const existing = await urlModel.findOne({ fullUrl: url }).lean();
  if (existing) {
    return existing;
  }

  // 2. Collision Handling Loop
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shortUrl = getNanoId(8);

    try {
      return await urlModel.create({
        fullUrl: url,
        shortUrl,
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
