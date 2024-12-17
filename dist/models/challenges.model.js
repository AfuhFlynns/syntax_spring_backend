import mongoose, { Schema } from "mongoose";
const challengeSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    type: {
        type: String,
        required: Boolean,
        enum: [
            "html",
            "css",
            "js",
            "tailwindcss",
            "ts",
            "python",
            "c/c++",
            "vb.net",
        ],
    },
    description: {
        type: String,
        require: true,
    },
    difficulty: String,
    initialCode: {
        type: String,
        require: true,
    },
    solution: {
        type: String,
        require: true,
    },
    hints: [
        {
            hint: String,
        },
    ],
    tags: [
        {
            tag: String,
        },
    ],
});
const challengesSchema = mongoose.model("Challenge", challengeSchema);
// NOTE: Exporting all models for easy usage
export { challengesSchema };
//# sourceMappingURL=challenges.model.js.map