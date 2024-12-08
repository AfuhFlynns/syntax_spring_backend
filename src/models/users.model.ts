import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
    },
    subjectsOffered: {
      type: Array,
      default: [],
    },
    levelOfStudy: {
      type: String,
      require: true,
    },
    seriesOfStudy: {
      type: String,
      require: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    accecptEmails: {
      type: Boolean,
      default: true,
    },
    prefersScheme: {
      type: String,
      default: "light",
    },
    roles: {
      User: {
        type: Number,
        default: 1000,
      },
      Teacher: Number,
    },
    telephoneNumber: {
      type: Number,
    },
    fullname: String,
    schoolname: String,
    gender: String,
    birthdate: Date,
    country: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    accessToken: String,
    accessTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
