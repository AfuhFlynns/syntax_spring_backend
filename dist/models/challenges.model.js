import mongoose, { Schema } from "mongoose";
const challengesSchema = new Schema({
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
// ?: This increases the possibility of multiple models with same type. Eleminating need for multi files
const htmlChallenge = mongoose.model("htmlChallenge", challengesSchema);
const cssChallenge = mongoose.model("cssChallenge", challengesSchema);
const jsChallenge = mongoose.model("jsChallenge", challengesSchema);
const reactChallenge = mongoose.model("reactChallenge", challengesSchema);
const tsChallenge = mongoose.model("tsChallenge", challengesSchema);
const tailwindcssChallenge = mongoose.model("taliwindcssChallenge", challengesSchema);
const pythonChallenge = mongoose.model("pythonChallenge", challengesSchema);
const c_cppChallenge = mongoose.model("c_cppChallenge", challengesSchema);
// NOTE: Exporting all models for easy usage
export { htmlChallenge, cssChallenge, jsChallenge, reactChallenge, tsChallenge, tailwindcssChallenge, pythonChallenge, c_cppChallenge, };
//# sourceMappingURL=challenges.model.js.map