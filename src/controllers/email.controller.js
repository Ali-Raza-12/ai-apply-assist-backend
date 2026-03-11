import { generateEmail } from "../aiServices/emailgenerator.js";
import Job from "../models/JobApplication.js";
import User from "../models/User.js";
import { extractCompanyName, extractEmail } from "../utils/emailExtractor.js";
import { sendEmail } from "../services/email.service.js";
import { applicationEmailTemplate } from "../templates/applicationEmail.template.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { checkDuplicateApplication } from "../utils/duplicateApplication.js";

export const createEmail = async (req, res, next) => {
  try {
    const jobDescription = req.body;
    if (!jobDescription) {
      return errorResponse(res, 400, "Job Description is required");
    }

    const userId = req.userId;
    if (!userId) {
      return errorResponse(res, 401, "Unautorized access.");
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const cvSections = user.parsedCV;
    if (!cvSections) {
      return errorResponse(res, 400, "User CV is not uploaded or parsed");
    }

    const jdEmail = extractEmail(jobDescription?.content || "");
    const jdCompany = extractCompanyName(jobDescription?.content || "");

    if (!jdEmail || !jdCompany) {
      return errorResponse(
        res,
        400,
        "No HR email or Company name found in job description.",
      );
    }

    const existingApplication = await checkDuplicateApplication(
      userId,
      jdEmail,
      jdCompany,
    );

    if (existingApplication) {
      return errorResponse(
        res,
        400,
        "You already sent job application to this HR email or company",
      );
    }

    const email = await generateEmail(cvSections, jobDescription);

    return successResponse(res, 200, "Email generated successfully", {
      jdEmail,
      jdCompany,
      email,
    });
  } catch (error) {
    next(error);
  }
};

export const sendApplicationEmail = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { hrEmail, subject, emailBody, companyName } = req.body;

    if (!hrEmail || !subject || !emailBody || !companyName) {
      return errorResponse(res, 400, "Missing required fields");
    }

    const duplicateApplication = await checkDuplicateApplication(
      userId,
      hrEmail,
      companyName,
    );
    if (duplicateApplication) {
      return errorResponse(
        res,
        400,
        "You already sent email to this Email or company",
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (!user.cvUrl) {
      return errorResponse(
        res,
        400,
        "No CV found. Please Upload your CV first.",
      );
    }

    const html = applicationEmailTemplate(user, emailBody);

    const attachment = [];

    if (user.cvUrl) {
      attachment.push({
        filename: user.cvOriginalName || "resume.pdf",
        path: user.cvUrl,
      });
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

      return successResponse(res, 200, "Email sent successfully");
    } else {
      return errorResponse(
        res,
        500,
        emailResult?.error || "Failed to send email",
      );
    }
  } catch (error) {
    next(error);
  }
};
