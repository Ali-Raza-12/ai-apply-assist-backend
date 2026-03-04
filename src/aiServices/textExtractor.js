import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const extractSections = async (resumeText) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", 
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
            You are a resume parser.

            Extract the following sections from the resume text.
            Return ONLY valid JSON.
            If a section is missing, return empty string.

            Sections:
            - profile
            - skills
            - experience
            - projects
            - education
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ],
    response_format: { type: "json_object" },
  });

  // console.log(response.choices[0].message.content);
  return JSON.parse(response.choices[0].message.content);
};
