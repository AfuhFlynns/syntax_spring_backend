import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const callAIEndPoint = async (prompt: string): Promise<string> => {
  const result = await model.generateContent(
    `Go through this code: ${prompt}\nAnd then hlep me with a hint or linting on how to solve the problem without any actual solution`
  );
  return String(result.response.text());
};

export default callAIEndPoint;
