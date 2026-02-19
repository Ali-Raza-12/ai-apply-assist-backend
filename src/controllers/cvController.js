import User from "../models/User.js";
import supabase from "../utills/supabase.js";

export const uploadCV = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = req.file;
    const cvText = req.body.cvText;

    if (user.cvUrl) {
      const urlParts = user.cvUrl.split("/");
      const fileNameInBucket = urlParts.slice(-2).join("/");

      const { error: deleteError } = await supabase.storage
        .from("cvs")
        .remove([fileNameInBucket]);

      if (deleteError) {
        console.warn("Failed to delete previous cv:", deleteError);
      }
    }

    const fileName = `${userId}_${Date.now()}.pdf`;
    const filePath = `user_cvs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, file.buffer, { contentType: "application/pdf" });

    if (uploadError) return res.status(400).json({ error: uploadError });

    const { data } = supabase.storage.from("cvs").getPublicUrl(filePath);
    const cvUrl = data.publicUrl;

    user.cvUrl = cvUrl;
    user.cvText = cvText;
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

    res.status(200).json({
      message: "CV uploaded successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("CV Upload Error:", error);

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }

    if (error.message.includes("Invalid file type")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload CV. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
