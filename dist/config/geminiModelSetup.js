var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
// Load env vars
config();
const genAI = new GoogleGenerativeAI(String(process.env.GOOGLE_GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const callAIEndPoint = (title, description, initialCode, solution) => __awaiter(void 0, void 0, void 0, function* () {
    let result = "";
    try {
        const aiResponse = yield model.generateContent(`Based on this question title: ${title} and description: ${description}, Go through this code: ${initialCode}, compare with this solution: ${solution}\nAnd then help me with a hint or linting on how to solve the problem such that my code ${initialCode} is the same as the solution. \nDon't give any direct answer. Just hint me so that I can learn. Make the response short and consise (max 5 lines but good enought to help)`);
        result = String(aiResponse.response.text());
    }
    catch (error) {
        console.error(error.message);
    }
    return result;
});
export default callAIEndPoint;
//# sourceMappingURL=geminiModelSetup.js.map