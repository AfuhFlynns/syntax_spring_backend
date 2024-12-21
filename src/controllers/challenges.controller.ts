import { Request, Response } from "express";
import { challengesSchema } from "../models/challenges.model.js";
import { CustomRequest } from "../TYPES.js";

const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const foundChallenges = await challengesSchema.find();

    if (!foundChallenges || foundChallenges.length === 0) {
      return res
        .status(202)
        .json({ success: false, message: "No challenges found!" });
    }

    console.clear();
    // console.table(foundChallenges.length);

    res.status(200).json({ success: true, challenges: foundChallenges });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getSpecificChallenges = async (req: Request, res: Response) => {
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
        .json({ success: false, message: "No challenges found!" });
    }

    console.clear();
    // console.table(foundChallenges.length);

    res.status(200).json({ success: true, challenges: foundChallenges });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createChallenges = async (req: CustomRequest, res: Response) => {
  const { challenge } = req.body;
  const role = req.role;

  try {
    if (!challenge)
      return res
        .status(401)
        .json({ success: false, message: "A challenge body must be provided" });

    //Authenticate users role
    if (role !== "user") {
      // Check if challenge already exist
      const foundChallenge = challengesSchema.findOne({
        title: challenge.title,
      });
      if (!foundChallenge) {
        const newChallenges = new challengesSchema(challenge);
        const savedChallenges = await newChallenges.save();
        // GEt the document
        const challengesObject = savedChallenges.toObject();

        return res
          .status(200)
          .json({ success: true, challenges: challengesObject });
      } else {
        return res
          .status(409)
          .json({ success: false, message: "Challenge already exist" });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Sorry you are not an admin or editor",
      });
    }
  } catch (error: any | { message: string }) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllChallenges, createChallenges, getSpecificChallenges };
