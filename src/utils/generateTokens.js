import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const generateTokens = async (res, email, username, id) => {
  const accessToken = await jwt.sign(
    { email: email, username: username, id: id },
    process.env.ACCESS_TOKEN_SECRET,
    { algorithm: "HS256", expiresIn: "30d" }
  );

  const expiresAt = Date.now() + 720 * 60 * 60 * 1000;

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.APP_STATUS === "production" && true,
    sameSite: "strict",
    maxAge: expiresAt,
  });
  return { accessToken, expiresAt };
};

export default generateTokens;
