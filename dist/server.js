import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
// File system set up
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import connectDB from "./utils/DB/connectDB.js";
import allowedOrigins from "./utils/cors/corsOptions.js";
import userRouter from "./routers/users.router.js";
import challengesRouter from "./routers/challenges.router.js";
connectDB();
dotenv.config();
const PORT = Number(process.env.PORT) | 8000;
const app = express();
// Third party middle wares
app.use(morgan("dev"));
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(String(origin)) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Error. Not allowed by cors"));
        }
    },
    optionsSuccessStatus: 200,
}));
app.use(cookieParser());
//Middle wares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Accept json parsing
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ success: true, message: "Hello, from Syntax Spring api" });
});
// Listen to request from the users route
app.use("/users", userRouter);
// Listen to requests from the challenges route
app.use("/challenges", challengesRouter);
//ALERT: Listen for unknown urls
app.get("*", (req, res) => {
    if (req.accepts("json")) {
        res.status(404).json({ success: false, message: "Page not found" }); // NOTE: Send json if client accepts it
    }
    else if (req.accepts("html")) {
        res.status(404).send(path.join(__dirname, "views", "404.html")); // NOTE: Send html if client accepts it
    }
    else {
        res.status(404).send("Page not found"); // NOTE: Send text if client accepts it
    }
});
mongoose.connection.once("open", () => {
    app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
});
//# sourceMappingURL=server.js.map