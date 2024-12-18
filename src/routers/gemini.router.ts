import pingAI from "../controllers/gemini.controller.js";
import { Router, Request, Response } from "express";

const GeminiRouter = Router();
GeminiRouter.post("/ai", async (req: Request, res: Response) => {
  try {
    pingAI(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default GeminiRouter;
