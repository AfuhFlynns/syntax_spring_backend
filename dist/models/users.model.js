import mongoose, { Schema } from "mongoose";
const usersChema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    names: {
        firstName: String,
        lastName: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ["admin", "user", "editor"],
        default: "user",
    },
    isActive: { type: Boolean, default: false },
    preferences: {
        theme: {
            type: String,
            enum: ["dark", "light"],
            default: "dark",
        },
        acceptNotifications: {
            type: Boolean,
            default: true,
        },
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
    },
    tokens: [
        {
            type: {
                type: String,
                enum: ["access", "refresh", "resetPassword"],
            },
            token: String,
            expiresAt: Date,
        },
    ],
    codes: [
        {
            type: {
                type: String,
                enum: ["verification", "coupon"],
            },
            code: String,
            expiresAt: Date,
        },
    ],
    achievements: [{ type: String }],
    progress: [
        {
            challengeId: {
                type: Schema.Types.ObjectId,
                ref: "Challenge",
                required: true,
            },
            status: {
                type: String,
                enum: ["not-started", "in-progress", "completed"],
                default: "not-started",
            },
            lastSubmission: {
                type: String,
            },
            score: {
                type: Number,
                default: 0,
            },
        },
    ],
}, { timestamps: true } // NOTE: Automatic time stamp tracking
);
// Create the users db and schema (model)
export const User = mongoose.model("User", usersChema);
//# sourceMappingURL=users.model.js.map