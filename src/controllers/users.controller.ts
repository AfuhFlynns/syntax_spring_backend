// import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/users.model.js";

const signUpUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    // Check if all fields are filled
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    // Check if user email already exist
    const foundUser = await User.findOne({ email, username });
    if (foundUser)
      return res.status(400).json({
        success: false,
        message: "User email or username already exists",
      });
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUserData = {
      username: username.trim(),
      password: hashedPwd,
      email: email,
    };

    const newUser = new User(newUserData);
    const savedUser = await newUser.save();

    // Convert the document to a plain object and omit the password
    const userObject = savedUser.toObject();

    return res
      .status(201)
      .json({ success: true, user: { ...userObject, password: "" } });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { signUpUser };
