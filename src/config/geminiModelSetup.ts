import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

// Load env vars
config();

const genAI = new GoogleGenerativeAI(String(process.env.GOOGLE_GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const callAIEndPoint = async (
  title: string,
  description: string,
  initialCode: string,
  solution: string
): Promise<string> => {
  let result = "";
  try {
    const aiResponse = await model.generateContent(
      `Based on this question title: ${title} and description: ${description}, Go through this code: ${initialCode}, compare with this solution: ${solution}\nAnd then help me with a hint or linting on how to solve the problem such that my code ${initialCode} is the same as the solution. \nDon't give any direct answer. Just hint me so that I can learn. Make the response short and consise (max 5 lines but good enought to help)`
    );
    result = String(aiResponse.response.text());
  } catch (error: any | { message: string }) {
    console.error(error.message);
  }
  return result;
};

export default callAIEndPoint;
