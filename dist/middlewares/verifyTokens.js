var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import { User } from "../models/users.model.js";
const verifyTokens = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sentCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    try {
        const foundUser = yield User.findOne({
            accessToken: sentCookie,
        });
        if (!sentCookie || !foundUser)
            return res
                .status(401)
                .json({ success: false, message: "Please login into your account" });
        yield jwt.verify(sentCookie, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: ["HS256"],
        }, (error, decoded) => {
            if (error)
                return res
                    .status(401)
                    .json({ success: false, message: "Login into your account" });
            req.id = decoded.id;
            next();
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export default verifyTokens;
//# sourceMappingURL=verifyTokens.js.map