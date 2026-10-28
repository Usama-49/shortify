import mongoose, { Schema, model } from "mongoose";

export interface IUrl {
  fullUrl: string;
  shortUrl: string;
  clicks: number;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const urlSchema = new Schema<IUrl>(
  {
    fullUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      required: true,
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export const urlModel = model<IUrl>("shortUrl", urlSchema);
