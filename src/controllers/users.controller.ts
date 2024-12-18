import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/users.model.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import {
  sendAccountDeleteEmail,
  sendLogoutEmail,
  sendNotificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/Emails/send.emails.js";

import { config } from "dotenv";
import generateTokens from "../utils/generateTokens.js";
import generateResetToken from "../utils/generateResetToken.js";
import { CustomRequest } from "../TYPES.js";

// Load env vars
config();

const signUpUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    // Check if all fields are filled
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    // Check if user email already exist
    const foundUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (foundUser)
      return res.status(409).json({
        success: false,
        message: "User email or username already exists",
      });
    // Hash user password
    const hashedPwd = await bcrypt.hash(password, 10);
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
    const savedUser = await newUser.save(); // Save user data

    // Convert the document to a plain object and omit the password
    const userObject = savedUser.toObject();

    const userEmail = userObject.email;
    const newUserName = userObject.username;
    // Send Verification code
    await sendVerificationEmail(code, userEmail, newUserName, {
      "X-Category": "email_verification",
    });

    return res
      .status(201)
      .json({ success: true, user: { ...userObject, password: "" } });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const logInUser = async (req: Request, res: Response) => {
  const { value, password } = req.body;
  try {
    // Check if all fields are filled
    if (!value || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const foundUser = await User.findOne({
      $or: [{ email: value }, { username: value }],
    }); // Check user email first
    if (!foundUser)
      return res.status(400).json({
        success: false,
        message: "User email or username does not exist",
      });

    const hashedPwd = foundUser.password;
    const userMatch = await bcrypt.compare(password, hashedPwd);

    if (!userMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    //Generate access otkens and send cookie
    const { accessToken, expiresAt } = await generateTokens(
      res,
      String(foundUser?.email),
      String(foundUser?.username),
      String(foundUser?._id),
      String(foundUser?.role)
    );
    // Rearrange user data tokens
    foundUser.tokens = [
      ...(foundUser.tokens || []),
      { type: "access", token: accessToken, expiresAt: expiresAt },
    ];
    foundUser.isActive = true; // Deactivate account

    await foundUser.save();

    await sendNotificationEmail(
      `Login into account, ${foundUser.email}`,
      foundUser.email,
      foundUser.username,
      foundUser.updatedAt.toLocaleDateString(),
      foundUser.username,
      {
        "X-Category": "email_notification",
      }
    );

    return res.status(200).json({
      success: true,
      message: `User ${foundUser.username} logged in successfully`,
    });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const verifyUser = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    // Check if all fields are filled
    if (!code || code.length < 6)
      return res
        .status(400)
        .json({ success: false, message: "You must provide a code" });
    // Check if user email already exist
    const foundUser = await User.findOne({
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
    await foundUser.save();

    await sendWelcomeEmail(foundUser.email, foundUser.username, {
      "X-Category": "email_welcome",
    });

    return res.status(200).json({
      success: true,
      message: `User ${foundUser.username} verified successfully`,
    });

    // Save new data
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const logOutUser = async (req: Request, res: Response) => {
  const accessToken = req.cookies?.accessToken; // Get the stored access token
  // console.log(accessToken);
  try {
    // Check if user has logged in
    if (!accessToken)
      return res
        .status(401)
        .json({ success: false, message: "Account not logged in" });
    const foundUser = await User.findOne({
      tokens: {
        $elemMatch: {
          type: "access",
          token: accessToken,
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
    foundUser.isActive = false; // Deactivate account
    await foundUser.save();
    await sendLogoutEmail(foundUser.email, foundUser.username, {
      "X-Category": "email_logout",
    });
    res.clearCookie("accesstoken"); // Clear stored cookie
    res.status(200).json({
      success: true,
      message: `User ${foundUser.username} Logged out successfully`,
    });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const clientUrl = process.env.CLIENT_URL;
  try {
    // Check if user has logged in
    if (!email)
      return res
        .status(401)
        .json({ success: false, message: "Must provide an email" });
    const foundUser = await User.findOne({ email: email });
    // Delete access Token
    if (!foundUser)
      return res.status(400).json({
        success: false,
        message: "No user found. Try logging in again",
      });
    const { resetToken, expiresAt } = await generateResetToken();
    foundUser.tokens = [
      ...(foundUser.tokens || []),
      {
        type: "resetPassword",
        token: resetToken,
        expiresAt: new Date(expiresAt),
      },
    ];
    // Save new data
    await foundUser.save();
    await sendPasswordResetEmail(
      foundUser?.email,
      foundUser?.username,
      `${clientUrl}/reset-password/${resetToken}`,
      {
        "X-Category": "email_password_reset",
      }
    );
    res.status(200).json({
      success: true,
      message: `User ${foundUser?.username} password reset link sent`,
    });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    // Check if user has logged in
    if (!password)
      return res
        .status(401)
        .json({ success: false, message: "Must provide a password" });
    const foundUser = await User.findOne({
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
    const hashedPwd = await bcrypt.hash(password, 10);
    //Update user data
    foundUser.password = hashedPwd;
    foundUser.tokens = [];
    foundUser.isActive = false; // Deactivate account
    // Save new data
    await foundUser.save();

    await sendNotificationEmail(
      `Password Reset for user: ${foundUser.email}`,
      foundUser?.email,
      foundUser?.username,
      foundUser?.updatedAt?.toLocaleDateString(),
      foundUser?.username,
      {
        "X-Category": "email_notification",
      }
    );

    return res.status(200).json({
      success: true,
      message: `User ${foundUser?.username} password reset successful`,
    });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  const { password, username } = req.body;
  const accessToken = req.cookies?.accessToken; // Read accessToken from cookie
  try {
    const userData = {
      tokens: {
        $elemMatch: {
          type: "access",
          token: accessToken,
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
    //Search for user
    const foundUser = await User.findOne(userData);
    // Check username and tokens
    if (!foundUser)
      return res.status(400).json({
        success: false,
        message: "Can't delete account at the moment",
      });

    const matchUser = bcrypt.compare(password, foundUser.password);
    // Check password
    if (!matchUser)
      return res.status(401).json({
        success: false,
        message: "Can't delete account at the moment",
      });
    await sendAccountDeleteEmail(foundUser.email, foundUser.username, {
      "X-Category": "email_account_deletion",
    });
    // Delete account
    await User.deleteOne(userData);

    res.clearCookie("accessToken"); // Clear cookie

    return res.status(200).json({
      success: true,
      message: `User ${foundUser.username} account deletion complete`,
    });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUserData = async (req: CustomRequest, res: Response) => {
  const { username, email, id } = req;
  const accessToken = req.cookies?.accessToken;
  try {
    // Check if user has logged in
    const foundUser = await User.findOne({
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
    }).select("-password");
    if (!foundUser)
      return res.status(401).json({
        success: false,
        message: "User not found",
      }); // Clear cookie

    const userObject = foundUser.toObject();
    return res.status(200).json({
      success: true,
      message: `Hi, ${foundUser.username}. Welcome to Syntax Spring!`,
      user: userObject,
    });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  signUpUser,
  logInUser,
  verifyUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  deleteUser,
  getUserData,
};
