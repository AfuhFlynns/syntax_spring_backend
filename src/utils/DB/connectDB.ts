import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectString: string | undefined = String(process.env.MONGODB_URL);

const connectDB = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Connected to db");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
