import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.MONGODB_URL));
    if (process.env.APP_STATUS !== "production")
      console.log("Connected to MongoDB");
  } catch (error: any | { message: string }) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
