var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import callAIEndPoint from "../config/geminiModelSetup.js";
const pingAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, initialCode, solution } = req.body;
    try {
        const aiReponse = yield callAIEndPoint(title, description, initialCode, solution);
        return res.status(200).json({ success: true, message: aiReponse });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default pingAI;
//# sourceMappingURL=gemini.controller.js.map