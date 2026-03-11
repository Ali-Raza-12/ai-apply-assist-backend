import Job from "../models/JobApplication.js"

export const checkDuplicateApplication = async (userId, hrEmail, companyName) => {
  return await Job.findOne({
    userId,
    $or: [{ hrEmail }, { companyName }]
  });
};