import { Router, Request, Response } from "express";
import { getUserData } from "../controllers/users.controller.js";
import verifyTokens from "../middlewares/verifyTokens.js";

const checkAuthRouter = Router();

checkAuthRouter.get(
  "/check-auth",
  verifyTokens,
  async (req: Request, res: Response) => {
    try {
      await getUserData(req, res);
    } catch (error) {
      console.error("Error in sign-up route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default checkAuthRouter;
