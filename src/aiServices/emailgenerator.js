// import { GoogleGenAI } from "@google/genai";
// import { buildEmailPrompt } from "../utils/promptBuilder.js";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export const generateEmail = async (cvSections, jobDescription) => {
//   try {
//     const prompt = buildEmailPrompt(cvSections, jobDescription);

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview", 
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: prompt,
//             },
//           ],
//         },
//       ],
//     });

//     const rawText = response.text.trim();

//     const subjectMatch = rawText.match(/^Subject:\s*(.*)/i);
//     const subject = subjectMatch ? subjectMatch[1].trim() : "";

//     const body = rawText
//       .replace(/^Subject:.*\n?/i, "")
//       .trim();

//     return {
//       subject,
//       body,
//     };

//   } catch (error) {
//     console.error("Error generating email:", error);
//     throw error;
//   }
// };



import Groq from "groq-sdk";
import { buildEmailPrompt } from "../utils/promptBuilder.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateEmail = async (cvSections, jobDescription) => {
  try {
    const prompt = buildEmailPrompt(cvSections, jobDescription);

    const response = await groq.chat.completions.create({
      // model: "openai/gpt-oss-20b", 
      model: "llama-3.3-70b-versatile", 
      temperature: 0.7, // keep some creativity for email
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // ensures structured JSON
    });

    // Groq JSON content is returned in message.content
    const parsed = JSON.parse(response.choices[0].message.content);

    return {
      subject: parsed.subject || "",
      body: parsed.emailBody || "",
    };
  } catch (error) {
    console.error("Error generating email with Groq:", error);
    throw error;
  }
};