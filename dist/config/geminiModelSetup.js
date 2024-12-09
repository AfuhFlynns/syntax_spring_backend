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
import * as dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(String(process.env.GOOGLE_GEMINI_API_KEY));
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const callAIEndPoint = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model.generateContent(`Go through this code: ${prompt}\nAnd then hlep me with a hint or linting on how to solve the problem without any actual solution`);
    return String(result.response.text());
});
export default callAIEndPoint;
//# sourceMappingURL=geminiModelSetup.js.map