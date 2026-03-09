import Job from "../models/JobApplication.js";

export const jobApplications = async (req, res) => {
    try {
    const userId = req.userId;
    if(!userId) {
        return res.status(400).json({ message: "Unauthorized access"})
    }

    const jobs = await Job.find({
        userId: userId
    })
    .sort({ createAt: -1 })
    .exec();

    return res.status(200).json({ success: true, message: "Jobs fetched successfully", data: jobs, count: jobs.length })
} catch(error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
}};