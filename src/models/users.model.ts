import mongoose, { Schema } from "mongoose";
import { usersSchemaTypes } from "../TYPES.js";

const usersChema = new Schema<usersSchemaTypes>(
  {
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
    tokens: [
      {
        type: {
          type: String,
          enum: ["access", "refresh", "resetPassword"],
        },
        token: String,
      },
    ],
  },
  { timestamps: true } // NOTE: Automatic time stamp tracking
);

// Create the users db and schema (model)
export const User = mongoose.model<usersSchemaTypes>("User", usersChema);
