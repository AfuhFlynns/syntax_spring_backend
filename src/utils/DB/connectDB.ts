import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.MONGODB_URL));
    console.log("Connected to db");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
