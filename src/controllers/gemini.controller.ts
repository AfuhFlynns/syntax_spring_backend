import { Request, Response } from "express";
import callAIEndPoint from "../config/geminiModelSetup.js";

const pingAI = async (req: Request, res: Response) => {
  const { title, description, initialCode, solution } = req.body;
  try {
    const aiReponse = await callAIEndPoint(
      title,
      description,
      initialCode,
      solution
    );
    return res.status(200).json({ success: true, message: aiReponse });
  } catch (error: any | { message: string }) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default pingAI;
