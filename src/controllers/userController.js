import User from "../models/User.js";

export const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  console.log("Updating profile for user ID:", userId);
  const { name, email, phone, github, linkedin, portfolio, cvUrl, cvText } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (cvUrl !== undefined) user.cvUrl = cvUrl;
    if (cvText !== undefined) user.cvText = cvText;
    await user.save();
    res
      .status(200)
      .json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          github: user.github,
          linkedin: user.linkedin,
          portfolio: user.portfolio,
          cvUrl: user.cvUrl,
          cvText: user.cvText,
        },
      });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};