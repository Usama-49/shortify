import express from "express";
import dotenv from "dotenv";
dotenv.config();
import urlRouter from "./routes/shortUrl.route.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", urlRouter);
