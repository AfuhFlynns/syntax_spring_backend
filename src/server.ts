import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
const PORT: any | number = Number(process.env.PORT) | 8000;

const app = express();

// app.use(express.)
app.use(express.json()); // Accept json parsing

app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>Hello, from Syntax Spring api</h1>");
});

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
