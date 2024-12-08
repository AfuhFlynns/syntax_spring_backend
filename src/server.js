import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import verifyTokens from "./middlewares/verifyTokens.js";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { GenerativeModel } from "@google/generative-ai";
// import { LangChain } from "langchain";
import * as dotenv from "dotenv";
//Import loggers
import logger from "./middlewares/loggers/requestLogger.js";
import errorLogger from "./middlewares/loggers/errorLogger.js";
//Cors Middle ware import
import corsOptions from "./config/corsOptions.js";
//Database
import connectDB from "./config/DB/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import { log } from "console";
import { checkAuth } from "./controllers/user.controller.js";
//Initialize main app
const app = express();
//Setting up the path module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//To load env variables
dotenv.config();
//Setting the server port
const PORT = process.env.PORT;

//First Connect to db
connectDB();

//Logger usage
app.use(logger);

//Middle wares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
//SEtting up FAI APIs
const openai = new OpenAI({
  organization: "org-G71ILmrXHa7nZxt3h9ipFYtk",
  apiKey: OPENAI_API_KEY,
});

//Custom middle ware
app.use(cors());
app.use(morgan());

//Handling cookies
app.use(cookieParser());

//Verify tokens
app.get("/check-auth", verifyTokens, checkAuth);

// const googleGemini = new GenerativeModel({ apiKey: GOOGLE_GEMINI_API_KEY });
//End point
app.use("/api/user", userRoutes);
//Server Activities
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, From Flint_GPT GCE assistant bot" });
});

app.post("/chat/bot", (req, res) => {
  console.log(req.body);
  res.redirect("http://192.168.100.100:5173/chat");
});

app.get("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, ".", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ message: `404: ${req.url} page not found` });
  } else {
    res.status(404).send("404: Page not found");
  }
});

app.use(errorLogger);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => log(`Server started on port: ${PORT}`));
});
