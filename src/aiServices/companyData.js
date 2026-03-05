import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const extractCompanyData = async (jobDescription) => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
            You are a strict information extraction engine.

            Extract the following fields from the Job Description:

            1. hrEmail
            2. companyName

            Rules:
            - Return ONLY valid JSON.
            - Use EXACT keys: "hrEmail" and "companyName"
            - If not found, return null.
            - Do NOT guess.
            - Do NOT fabricate data.
        `,
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
    response_format: { type: "json_object" },
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content);

    return {
      hrEmail: parsed.hrEmail || null,
      companyName: parsed.companyName || null,
    };
  } catch (error) {
    return {
      hrEmail: null,
      companyName: null,
    };
  }
};