import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
const verifyTokens = async (req, res, next) => {
  const sentCookie = req.cookies?.token;
  try {
    const foundUser = await User.findOne({
      accessToken: sentCookie,
    });
    if (!sentCookie || !foundUser)
      return res
        .status(401)
        .json({ success: false, message: "Please login into your account" });
    await jwt.verify(
      sentCookie,
      process.env.ACCESS_TOKEN_SECRET,
      {
        algorithms: ["HS256"],
      },
      (error, decoded) => {
        if (error)
          return res
            .status(401)
            .json({ success: false, message: "Login into your account" });
        req.id = decoded.id;
        next();
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default verifyTokens;
