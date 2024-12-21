import { Router, Request, Response } from "express";
import {
  createChallenges,
  getAllChallenges,
  getSpecificChallenges,
} from "../controllers/challenges.controller.js";
import verifyTokens from "../middlewares/verifyTokens.js";

const challengesRouter = Router();

challengesRouter.get("/all", async (req: Request, res: Response) => {
  try {
    await getAllChallenges(req, res);
  } catch (error) {
    console.error("Error in challenges route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
challengesRouter.post(
  "/new-challenge",
  verifyTokens,
  async (req: Request, res: Response) => {
    try {
      await createChallenges(req, res);
    } catch (error) {
      console.error("Error in challenges route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
challengesRouter.post(
  "/specific-challenge",
  verifyTokens,
  async (req: Request, res: Response) => {
    try {
      await getSpecificChallenges(req, res);
    } catch (error) {
      console.error("Error in sign-up route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default challengesRouter;
