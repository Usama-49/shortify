import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is undefined! Check if your .env file is in the backend root directory.",
      );
    }
    await mongoose.connect(mongoUri);
    console.log("DB Connected Successfully ✅");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
};

export const disConnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("DB Disconnected Successfully ✔️");
  } catch (err) {
    console.error("🚫 DB Disconnection Error:", err);
    process.exit(1);
  }
};
