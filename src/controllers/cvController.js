import User from "../models/User.js";
import supabase from "../utils/supabase.js";
import { extractSections } from "../aiServices/textExtractor.js";

export const uploadCV = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized access." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const cvText = req.body.cvText;
    if (!cvText || typeof cvText !== "string")
      return res.status(400).json({ error: "Invalid cvText" });

    if (user.cvUrl) {
      try {
        const url = new URL(user.cvUrl);
        const oldFilePath = url.pathname.split("/cvs/")[1];

        if (oldFilePath) {
          const { error: deleteError } = await supabase.storage
            .from("cvs")
            .remove([oldFilePath]);

          if (deleteError)
            console.warn("Failed to delete old CV:", deleteError.message);
          else console.log("Old CV deleted successfully:", oldFilePath);
        }
      } catch (err) {
        console.warn("Error parsing old CV URL:", err.message);
      }
    }

    const fileName = `${userId}_${Date.now()}.pdf`;
    const filePath = `user_cvs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, req.file.buffer, {
        contentType: "application/pdf",
      });

    if (uploadError)
      return res.status(400).json({ error: uploadError.message });

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("cvs")
      .getPublicUrl(filePath);

    if (urlError) return res.status(500).json({ error: urlError.message });

    console.log("CV URL", publicUrlData.publicUrl);

    const rawSections = await extractSections(cvText);

    const cvUrl = publicUrlData.publicUrl;

    user.cvUrl = cvUrl;
    user.parsedCV = rawSections;

    await user.save();

    res.status(200).json({
      message: "CV uploaded successfully",
      user: user,
    });
  } catch (error) {
    console.error("CV Upload Error:", error);
    res.status(500).json({
      message: "Failed to upload CV.",
    });
  }
};

export const removeCV = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.cvUrl)
      return res.status(400).json({ message: "No CV to delete" });

    if (user.cvUrl) {
      const urlParts = user.cvUrl.split("/");
      const fileNameInBucket = urlParts.slice(-2).join("/");

      const { error: deleteError } = await supabase.storage
        .from("cvs")
        .remove([fileNameInBucket]);

      if (deleteError) {
        console.warn("Failed to delete previous cv:", deleteError);
      }

      user.cvUrl = "";
      user.cvText = "";

      await user.save();

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        cvUrl: user.cvUrl,
        cvText: user.cvText,
      };

      return res
        .status(200)
        .json({ message: "CV deleted successfully", user: userResponse });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to remove CV", error: error.message });
  }
};
