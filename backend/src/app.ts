import express from "express";
import cors from "cors";
import urlRouter from "./routes/shortUrl.route.js";
import authRouter from "./routes/auth.route.js";

import { errorHandler } from "./middlewares/error.middleware.js";

export const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", urlRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);
