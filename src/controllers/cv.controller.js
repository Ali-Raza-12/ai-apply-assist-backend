import User from "../models/User.js";
import supabase from "../utils/supabase.js";
import { extractSections } from "../aiServices/textExtractor.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { deleteCVFromSupabase } from "../utils/deleteCV.js";
import { serializeUser } from "../utils/serializeUser.js";

export const uploadCV = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return errorResponse(res, 401, "Unauthorized access.");

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, 404, "User not found");

    if (!req.file) return errorResponse(res, 400, "No file uploaded");

    const parsedCV = req.body.cvText;
    if (!parsedCV || typeof parsedCV !== "string")
      return errorResponse(res, 400, "Invalid cvText");

    if (user.cvUrl) {
      await deleteCVFromSupabase(user.cvUrl);
    }

    const fileName = `${userId}_${Date.now()}.pdf`;
    const filePath = `user_cvs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, req.file.buffer, {
        contentType: "application/pdf",
      });

    if (uploadError) return errorResponse(res, 400, uploadError.message);

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("cvs")
      .getPublicUrl(filePath);

    if (urlError) return errorResponse(res, 500, urlError.message);

    const rawSections = await extractSections(parsedCV);

    user.cvUrl = publicUrlData.publicUrl;
    user.parsedCV = rawSections;
    await user.save();

    return successResponse(res, 200, "CV uploaded successfully", {
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const removeCV = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return errorResponse(res, 401, "Unauthorized");

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, 404, "User not found");

    if (!user.cvUrl) {
      return errorResponse(res, 400, "No CV to delete");
    }

    await deleteCVFromSupabase(user.cvUrl);

    user.cvUrl = "";
    user.parsedCV = "";
    await user.save();

    return successResponse(res, 200, "CV deleted successfully", {
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
};
