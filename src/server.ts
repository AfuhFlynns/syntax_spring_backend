import express, { Request, Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

// File system set up
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./utils/DB/connectDB.js";

connectDB();

dotenv.config();
const PORT: any | number = Number(process.env.PORT) | 8000;

const app = express();

//Middle wares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Accept json parsing

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "Hello, from Syntax Spring api" });
});

//ALERT: Listen for unknown urls
app.get("*", (req: Request, res: Response) => {
  if (req.accepts("json")) {
    res.status(404).json({ success: false, message: "Page not found" }); // NOTE: Send json if client accepts it
  } else if (req.accepts("html")) {
    res.status(404).send(path.join(__dirname, "views", "404.html")); // NOTE: Send html if client accepts it
  } else {
    res.status(404).send("Page not found"); // NOTE: Send text if client accepts it
  }
});

// mongoose.connection.once("open", () => {
app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
// });
