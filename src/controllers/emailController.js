import { generateEmail } from "../aiServices/emailgenerator.js";
import Job from "../models/JobApplication.js";
import User from "../models/User.js";
import { extractCompanyName, extractEmail } from "../utils/emailExtractor.js";
import { sendEmail } from "../services/email.service.js";
import { applicationEmailTemplate } from "../templates/applicationEmail.template.js";

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
      return res
        .status(400)
        .json({ message: "User CV is not uploaded or parsed" });
    }

    const jdEmail = extractEmail(jobDescription?.content || "");
    console.log("HR email", jdEmail);
    if (!jdEmail) {
      return res
        .status(400)
        .json({ message: "No HR email found in job description." });
    }

    const existingApplication = await Job.findOne({
      user: user,
      hrEmail: jdEmail,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({
          email: jdEmail,
          messge: "You already sent job application to this email",
        });
    }

    const jdCompany = extractCompanyName(jobDescription.content);
    console.log("Company Name", jdCompany);
    if (!jdCompany) {
      return res
        .status(400)
        .json({ message: "Company name is not available in job description" });
    }

    const companyName = await Job.findOne({
      user: user,
      companyName: jdCompany,
    });
    if (companyName) {
      return res
        .status(400)
        .json({ message: "You already send email to this company." });
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

export const sendApplicationEmail = async (req, res) => {
  try {
    const { hrEmail, subject, emailBody, companyName } = req.body;

    const duplicatedEmail = await Job.findOne({
      hrEmail: hrEmail
    });

    if(duplicatedEmail){
      return res.status(400).json({ message: "You already send Email to this HR mail"})
    }

    const duplicatedCompany= await Job.findOne({
      companyName: companyName
    });

    if(duplicatedCompany){
      return res.status(400).json({ message: "You already send Email to this Company"})
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!hrEmail || !subject || !emailBody || !companyName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if(!user.cvUrl) {
      return res.status(400).json({ message: "No CV found. Please Upload your CV first."});
    }

    const html = applicationEmailTemplate(user, emailBody);

    const attachment = [];

    if(user.cvUrl) {
      attachment.push({
        filename: user.cvOriginalName || "resume.pdf",
        path: user.cvUrl,
      })
    }

    const emailResult = await sendEmail({
      to: "ahmadbroothers13@gmail.com",
      subject,
      html: html,
      attachments: attachment,
    });

    if (emailResult && emailResult.success) {
      await Job.create({
        userId: req.userId,
        hrEmail: hrEmail,
        companyName: companyName,
        status: "sent",
      });

      return res.status(200).json({ message: "Email sent successfully" });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: emailResult?.error || "Unknown error"
      });
    }
  } catch (error) {
    
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};