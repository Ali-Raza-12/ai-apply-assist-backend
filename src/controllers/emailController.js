import { generateEmail } from "../aiServices/emailgenerator.js";
import Job from "../models/JobApplication.js";
import User from "../models/User.js";
import { extractCompanyName, extractEmail } from "../utils/emailExtractor.js";

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

    const jdEmail = extractEmail(jobDescription?.content || "");
    console.log("HR email", jdEmail);
    if(!jdEmail){
      return res.status(400).json({ message: "No HR email found in job description."})
    }

    const existingApplication = await Job.findOne({ 
      user: user,
      hrEmail: jdEmail,
    })
    if(existingApplication) {
      return res.status(400).json({ email: jdEmail, messge: "You already sent job application to this email"})
    }

    const jdCompany = extractCompanyName(jobDescription.content)
    console.log("Company Name", jdCompany);
    if(!jdCompany) {
      return res.status(400).json({ message: "Company name is not available in job description"})
    }

    const companyName = await Job.findOne({
      user: user,
      companyName: jdCompany
    })
    if(companyName) {
      return res.status(400).json({ message: "You already send email to this company."})
    }

    const email = await generateEmail(cvSections, jobDescription);

    res.status(200).json({
      success: true,
      jdEmail,
      jdCompany,
      email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
