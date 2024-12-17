import { Router, Request, Response } from "express";
import {
  createChallenges,
  getAllChallenges,
} from "../controllers/challenges.controller.js";

const challengesRouter = Router();

challengesRouter.get("/api", async (req: Request, res: Response) => {
  try {
    await getAllChallenges(req, res);
  } catch (error) {
    console.error("Error in sign-up route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
challengesRouter.post(
  "/api/new-challenge",
  async (req: Request, res: Response) => {
    try {
      await createChallenges(req, res);
    } catch (error) {
      console.error("Error in sign-up route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default challengesRouter;
