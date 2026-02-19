import mongoose, { modelNames } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
    cvUrl: {
      type: String,
      default: "",
    },
    cvPublicId: {
      type: String,
      default: "",
    },
    cvOriginalName: {
      type: String,
      default: "",
    },
    cvText: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
