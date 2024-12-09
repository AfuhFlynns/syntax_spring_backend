import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/users.model.js";
import { v4 } from "uuid";
const uuid = v4;

const signUpUser = async (req: Request, res: Response) => {
  try {
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { signUpUser };
