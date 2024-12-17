import { Request, Response } from "express";
import { challengesSchema } from "../models/challenges.model.js";

const getAllChallenges = async (req: Request, res: Response) => {
  const { type, difficulty } = req.query;

  // Explicitly define the filter types to ensure compatibility with req.query
  const filter: { type?: string; difficulty?: string } = {};

  if (typeof type === "string") filter.type = type;
  if (typeof difficulty === "string") filter.difficulty = difficulty;

  try {
    const foundChallenges = await challengesSchema.find(filter);

    if (!foundChallenges || foundChallenges.length === 0) {
      return res
        .status(202)
        .json({ success: false, message: "No challenges available yet!" });
    }

    res.status(200).json({ success: true, challenges: foundChallenges });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createChallenges = async (req: Request, res: Response) => {
  const { challenge } = req.body;

  try {
    if (!challenge)
      return res
        .status(401)
        .json({ success: false, message: "A challenge body must be provided" });

    // Check if challenge already exist
    // const foundChallenge = challengesSchema.findOne({title: challenge?.title});
    // if(foundChallenge) return res.status(400).json({success: false, message: "Challenge already exist"});
    const newChallenges = new challengesSchema(challenge);
    const savedChallenges = await newChallenges.save();

    // GEt the document
    const challengesObject = savedChallenges.toObject();

    res.status(200).json({ success: true, challenges: challengesObject });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllChallenges, createChallenges };
