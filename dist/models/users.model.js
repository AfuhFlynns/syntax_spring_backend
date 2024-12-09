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
        },
    ],
}, { timestamps: true } // NOTE: Automatic time stamp tracking
);
// Create the users db and schema (model)
export const User = mongoose.model("User", usersChema);
//# sourceMappingURL=users.model.js.map