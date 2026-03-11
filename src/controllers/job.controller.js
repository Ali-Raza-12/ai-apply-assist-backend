import Job from "../models/JobApplication.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const jobApplications = async (req, res, next) => {
    try {
    const userId = req.userId;
    if(!userId) {
        return errorResponse(res, 400, "Unauthorized access");
    }

    const jobs = await Job.find({
        userId: userId
    })
    .sort({ appliedAt: -1 })
    .exec();

    return successResponse(res, 200, "Jobs fetched successfully", { data: jobs, count: jobs.length });
} catch(error) {
    next(error);
}};
