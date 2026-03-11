import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { serializeUser } from "../utils/serializeUser.js";

export const updateUserProfile = async (req, res, next) => {
  const userId = req.userId;

  const { name, email, phone, github, linkedin, portfolio, cvText } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) {
      const duplicateEmail = await User.findOne({ email, _id: { $ne: userId } });
      if(duplicateEmail) {
        return errorResponse(res, 400, "Email already exist");
      }
      user.email = email;
    };
    if (phone !== undefined) user.phone = phone;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (cvText !== undefined) user.cvText = cvText;
    await user.save();
    return successResponse(res, 200, "Profile updated successfully", {
      user: serializeUser(user)
  });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
  }
};
