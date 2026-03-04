export const buildEmailPrompt = (cvSections, jobDescription) => {
  const { profile, skills, experience, projects } = cvSections;

  return `
You are a professional career assistant tasked with writing a personalized job application email. 

Using the user's CV sections and the job description, generate a clear, concise, and professional email suitable for sending directly to a recruiter or hiring manager. 

User CV Details:
Profile: ${profile || ""}
Skills: ${JSON.stringify(skills) || ""}
Experience: ${JSON.stringify(experience) || ""}
Projects: ${JSON.stringify(projects) || ""}

Job Description: ${jobDescription}

Instructions for email generation:
- Write in a professional, polite, and confident tone.
- Present information in **paragraph form**, not bullet points.
- Highlight the most relevant skills, experiences, and projects that match the job description.
- Make it human-readable, simple, and easy to understand in basic English.
- Keep the email length around **150-200 words**.
- Include the user's background, experience, and key projects naturally in the flow.
- Output **plain text only**, suitable for direct email usage, no additional formatting or HTML.

Ensure the email sounds personal, enthusiastic, and aligned with the job requirements.
  `;
};
