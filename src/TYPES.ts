import { Schema, Document } from "mongoose";

export interface usersSchemaTypes extends Document {
  username: string;
  names: {
    firstName: string;
    lastName: string;
  };
  email: string;
  phoneNumber?: string;
  password: string;
  role: "admin" | "user" | "editor";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  preferences?: {
    theme: "light" | "dark";
    acceptNotifications: boolean;
  };
  avatar: string;
  tokens: {
    type: "access" | "refresh" | "resetPassword";
    token: string;
    expiresAt: Date;
  }[];
  codes: {
    type: "verification" | "coupon";
    code: string;
    expiresAt: Date;
  }[];
  progress: {
    challengeId: Schema.Types.ObjectId;
    status: "note-started" | "in-progress" | "completed";
    lastSubmission?: string;
    score?: number;
  }[];
  achievements: string[];
}

export interface challengesTypes {
  title: string;
  type:
    | "html"
    | "css"
    | "js"
    | "tailwindcss"
    | "ts"
    | "python"
    | "c/c++"
    | "vb.net";
  description: string;
  difficulty: string;
  initialCode: string;
  solution: string;
  hints: {
    hint: string;
  }[];
  tags: {
    tag: string;
  }[];
}
