var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { User } from "../models/users.model.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import { sendAccountDeleteEmail, sendLogoutEmail, sendNotificationEmail, sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, } from "../utils/Emails/send.emails.js";
import { config } from "dotenv";
import generateTokens from "../utils/generateTokens.js";
import generateResetToken from "../utils/generateResetToken.js";
// Load env vars
config();
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if all fields are filled
        if (!username || !email || !password)
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        // Check if user email already exist
        const foundUser = yield User.findOne({
            $or: [{ email: email }, { username: username }],
        });
        if (foundUser)
            return res.status(409).json({
                success: false,
                message: "User email or username already exists",
            });
        // Hash user password
        const hashedPwd = yield bcrypt.hash(password, 10);
        //Generate verification code
        const code = generateVerificationCode();
        //Modify user data
        // codes: {
        //   type: "verification" | "coupon";
        //   code: string;
        //   expiresAt: Date;
        // }
        // [];
        const newUserData = {
            username: username.trim(),
            password: hashedPwd,
            email: email,
            codes: [
                {
                    type: "verification",
                    code: code,
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                },
            ],
        };
        const newUser = new User(newUserData); // Initialize new user object
        const savedUser = yield newUser.save(); // Save user data
        // Convert the document to a plain object and omit the password
        const userObject = savedUser.toObject();
        const userEmail = userObject.email;
        const newUserName = userObject.username;
        // Send Verification code
        yield sendVerificationEmail(code, userEmail, newUserName, {
            "X-Category": "email_verification",
        });
        return res
            .status(201)
            .json({ success: true, user: Object.assign(Object.assign({}, userObject), { password: "" }) });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const logInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { value, password } = req.body;
    try {
        // Check if all fields are filled
        if (!value || !password)
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        const foundUser = yield User.findOne({
            $or: [{ email: value }, { username: value }],
        }); // Check user email first
        if (!foundUser)
            return res.status(400).json({
                success: false,
                message: "User email or username does not exist",
            });
        const hashedPwd = String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.password);
        const userMatch = yield bcrypt.compare(password, hashedPwd);
        if (!userMatch)
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        //Generate access otkens and send cookie
        const { accessToken, expiresAt } = yield generateTokens(res, String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.email), String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.username), String(foundUser === null || foundUser === void 0 ? void 0 : foundUser._id), String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.role));
        // Rearrange user data tokens
        foundUser.tokens = [
            ...(foundUser.tokens || []),
            { type: "access", token: accessToken, expiresAt: expiresAt },
        ];
        yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.save());
        yield sendNotificationEmail(`Login into account, ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.email}`, foundUser === null || foundUser === void 0 ? void 0 : foundUser.email, foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, (_a = foundUser === null || foundUser === void 0 ? void 0 : foundUser.updatedAt) === null || _a === void 0 ? void 0 : _a.toLocaleDateString(), foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, {
            "X-Category": "email_notification",
        });
        const userObject = foundUser.toObject();
        return res.status(200).json({
            success: true,
            message: `User ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username} logged in successfully`,
            user: Object.assign(Object.assign({}, userObject), { password: "" }),
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    try {
        // Check if all fields are filled
        if (!code || code.length < 6)
            return res
                .status(400)
                .json({ success: false, message: "You must provide a code" });
        // Check if user email already exist
        const foundUser = yield User.findOne({
            codes: {
                $elemMatch: {
                    type: "verification",
                    code: code,
                    expiresAt: { $gt: new Date() }, // Check if code is not expired
                },
            },
        }); // Check user email first
        if (!foundUser)
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        // Activate account
        foundUser.isActive = true;
        //Delete verification code
        foundUser.codes = [];
        //Save data
        yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.save());
        yield sendWelcomeEmail(foundUser === null || foundUser === void 0 ? void 0 : foundUser.email, foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, {
            "X-Category": "email welcome",
        });
        return res.status(200).json({
            success: true,
            message: `User ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username} verified successfully`,
        });
        // Save new data
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const logOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.cookie; // Get the stored access token
    // console.log(accessToken);
    try {
        // Check if user has logged in
        if (!accessToken)
            return res
                .status(401)
                .json({ success: false, message: "Account not logged in" });
        const foundUser = yield User.findOne({
            tokens: {
                $elemMatch: {
                    type: "access",
                    token: accessToken.replace("accessToken=", "").trim(),
                    expiresAt: { $gt: new Date() },
                },
            },
        });
        // Delete access Token
        if (!foundUser)
            return res.status(400).json({
                success: false,
                message: "No user found. Try logging in again",
            });
        foundUser.tokens = [];
        yield foundUser.save();
        yield sendLogoutEmail(foundUser === null || foundUser === void 0 ? void 0 : foundUser.email, foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, {
            "X-Category": "email logout",
        });
        res.clearCookie("accesstoken"); // Clear stored cookie
        res.status(200).json({
            success: true,
            message: `User ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username} Logged out successfully`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const clientUrl = process.env.CLIENT_URL;
    try {
        // Check if user has logged in
        if (!email)
            return res
                .status(401)
                .json({ success: false, message: "Must provide an email" });
        const foundUser = yield User.findOne({ email: email });
        // Delete access Token
        if (!foundUser)
            return res.status(400).json({
                success: false,
                message: "No user found. Try logging in again",
            });
        const { resetToken, expiresAt } = yield generateResetToken();
        foundUser.tokens = [
            ...(foundUser.tokens || []),
            {
                type: "resetPassword",
                token: resetToken,
                expiresAt: new Date(expiresAt),
            },
        ];
        // Save new data
        yield foundUser.save();
        yield sendPasswordResetEmail(foundUser === null || foundUser === void 0 ? void 0 : foundUser.email, foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, `${clientUrl}/reset-password/${resetToken}`, {
            "X-Category": "email password reset",
        });
        res.status(200).json({
            success: true,
            message: `User ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username} password reset link sent`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password } = req.body;
    const { token } = req.params;
    try {
        // Check if user has logged in
        if (!password)
            return res
                .status(401)
                .json({ success: false, message: "Must provide a password" });
        const foundUser = yield User.findOne({
            tokens: {
                $elemMatch: {
                    type: "resetPassword",
                    token: token,
                    expiresAt: { $gt: new Date() },
                },
            },
        });
        if (!foundUser)
            return res.status(400).json({
                success: false,
                message: "Password reset token expired. Try again later",
            });
        //hash the new password
        const hashedPwd = yield bcrypt.hash(password, 10);
        //Update user data
        foundUser.password = hashedPwd;
        foundUser.tokens = [];
        // Save new data
        yield foundUser.save();
        yield sendNotificationEmail(`Password Reset for user: ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.email}`, foundUser === null || foundUser === void 0 ? void 0 : foundUser.email, foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, (_a = foundUser === null || foundUser === void 0 ? void 0 : foundUser.updatedAt) === null || _a === void 0 ? void 0 : _a.toLocaleDateString(), foundUser === null || foundUser === void 0 ? void 0 : foundUser.username, {
            "X-Category": "email notification",
        });
        return res.status(200).json({
            success: true,
            message: `User ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username} password reset successful`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, username } = req.body;
    const token = req.headers.cookie;
    try {
        const userData = {
            tokens: {
                $elemMatch: {
                    type: "access",
                    token: token === null || token === void 0 ? void 0 : token.replace("accessToken=", "").trim(),
                    expiresAt: { $gt: new Date() },
                },
            },
            username: username,
        };
        // Check if user has logged in
        if (!password || !username)
            return res
                .status(401)
                .json({ success: false, message: "Must provide a password" });
        const foundUser = yield User.findOne(userData);
        const matchUser = bcrypt.compare(password, String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.password));
        if (!foundUser && !matchUser)
            return res.status(400).json({
                success: false,
                message: "Can't delete account at the moment",
            });
        yield sendAccountDeleteEmail(String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.email), String(foundUser === null || foundUser === void 0 ? void 0 : foundUser.username), {
            "X-Category": "email deletion",
        });
        // Delete account
        yield User.deleteOne(userData);
        res.clearCookie("accessToken"); // Clear cookie
        return res.status(200).json({
            success: true,
            message: `User ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username} account deletion complete`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, email, id } = req;
    const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    try {
        // Check if user has logged in
        const foundUser = yield User.findOne({
            username: username,
            email: email,
            _id: id,
            tokens: {
                $elemMatch: {
                    type: "access",
                    token: accessToken,
                    expiresAt: { $gt: new Date() },
                },
            },
        });
        if (!foundUser)
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); // Clear cookie
        const userObject = foundUser.toObject();
        return res.status(200).json({
            success: true,
            message: `Hi, ${foundUser === null || foundUser === void 0 ? void 0 : foundUser.username}. Welcome to Syntax Spring!`,
            user: Object.assign(Object.assign({}, userObject), { password: "" }),
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
export { signUpUser, logInUser, verifyUser, logOutUser, forgotPassword, resetPassword, deleteUser, getUserData, };
//# sourceMappingURL=users.controller.js.map