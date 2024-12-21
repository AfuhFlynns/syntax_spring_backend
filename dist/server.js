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
import GeminiRouter from "./routers/gemini.router.js";
import verifyTokens from "./middlewares/verifyTokens.js";
import checkAuthRouter from "./routers/root.router.js";
connectDB();
dotenv.config();
const PORT = Number(process.env.PORT) | 8000;
const app = express();
// Third party middle wares
app.use(morgan("combined"));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(cookieParser());
//Middle wares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Accept json parsing
app.use("/auth/users", checkAuthRouter);
app.get("/", (req, res) => {
    res.status(200).send("<h1>Syntax Spring Server Live Now</h1>");
});
// Listen to request from the users route
app.use("/auth/users", userRouter);
// Listen to requests from the challenges route
app.use("/challenges/api/v1", challengesRouter);
// Listen to requests to ai
app.use("/assist/api/v1", verifyTokens, GeminiRouter);
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
    console.clear(); // Clear the console once the app starts running
});
//# sourceMappingURL=server.js.map
