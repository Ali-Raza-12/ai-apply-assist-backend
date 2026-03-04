import { generateEmail } from "../aiServices/emailgenerator.js";
import User from "../models/User.js";

export const createEmail = async (req, res) => {
  try {
    const jobDescription = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job Description is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unautorized access." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cvSections = user.parsedCV;
    if (!cvSections) {
      return res.status(400).json({ message: "User CV is not uploaded or parsed" });
    }

    const email = await generateEmail(cvSections, jobDescription);

    res.status(200).json({
      success: true,
      email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
