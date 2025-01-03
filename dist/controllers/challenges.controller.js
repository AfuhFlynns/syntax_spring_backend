var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { challengesSchema } from "../models/challenges.model.js";
const getAllChallenges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundChallenges = yield challengesSchema.find();
        if (!foundChallenges || foundChallenges.length === 0) {
            return res
                .status(202)
                .json({ success: false, message: "No challenges found!" });
        }
        console.clear();
        // console.table(foundChallenges.length);
        res.status(200).json({ success: true, challenges: foundChallenges });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const getSpecificChallenges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, difficulty } = req.query;
    // Explicitly define the filter types to ensure compatibility with req.query
    const filter = {};
    if (typeof type === "string")
        filter.type = type;
    if (typeof difficulty === "string")
        filter.difficulty = difficulty;
    try {
        const foundChallenges = yield challengesSchema.find(filter);
        if (!foundChallenges || foundChallenges.length === 0) {
            return res
                .status(202)
                .json({ success: false, message: "No challenges found!" });
        }
        console.clear();
        // console.table(foundChallenges.length);
        res.status(200).json({ success: true, challenges: foundChallenges });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const createChallenges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const savedChallenges = yield newChallenges.save();
                // GEt the document
                const challengesObject = savedChallenges.toObject();
                return res
                    .status(200)
                    .json({ success: true, challenges: challengesObject });
            }
            else {
                return res
                    .status(409)
                    .json({ success: false, message: "Challenge already exist" });
            }
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Sorry you are not an admin or editor",
            });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
export { getAllChallenges, createChallenges, getSpecificChallenges };
//# sourceMappingURL=challenges.controller.js.map