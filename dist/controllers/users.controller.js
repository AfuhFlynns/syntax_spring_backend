var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../models/users.model.js";
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if all fields are filled
        if (!username || !email || password)
            return res
                .status(409)
                .json({ success: false, message: "All fields are required" });
        // Check if user email already exist
        const foundUser = yield User.findOne({ email });
        if (foundUser)
            return res
                .status(409)
                .json({ success: false, message: "User email already exists" });
        const hashedPwd = yield bcrypt.hash(password, 10);
        const newUserData = {
            username: username,
            password: hashedPwd,
            email: email,
        };
        const newUser = new User(newUserData);
        const savedUser = yield newUser.save();
        return res
            .status(200)
            .json({ success: true, user: Object.assign(Object.assign({}, savedUser), { password: "" }) });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export { signUpUser };
//# sourceMappingURL=users.controller.js.map