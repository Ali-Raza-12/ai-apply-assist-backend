import mongoose, { modelNames } from "mongoose";

const parsedCVSchema = new mongoose.Schema(
  {
    profile: { type: String, default: "" },
    skills: { type: mongoose.Schema.Types.Mixed, default: {} },
    experience: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    education: { type: String, default: "" },
    certificates: { type: Array, default: [] },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    cvUrl: { type: String, default: "" },
    cvPublicId: { type: String, default: "" },
    cvOriginalName: { type: String, default: "" },

    parsedCV: {
      type: parsedCVSchema,
      default: () => ({}),
    },

    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
