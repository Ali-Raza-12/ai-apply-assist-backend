export const deleteCVFromSupabase = async (cvUrl) => {
  try {
    if (!cvUrl) return;
    const url = new URL(cvUrl);
    const filePath = url.pathname.replace(/^\/+/, ""); // remove leading /
    const { error } = await supabase.storage.from("cvs").remove([filePath]);
    if (error) throw new Error(`Failed to delete CV: ${error.message}`);
  } catch (err) {
    return { success: false, message: err.message };
  }
};