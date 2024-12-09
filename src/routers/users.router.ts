import { Router } from "express";
import { signUpUser } from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.post("/sign-up", signUpUser);

export default userRouter;
