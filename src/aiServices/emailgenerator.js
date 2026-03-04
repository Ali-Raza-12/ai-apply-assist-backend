import { GoogleGenAI } from "@google/genai";
import { buildEmailPrompt } from "../utils/promptBuilder.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateEmail = async (cvSections, jobDescription) => {
  try {
    const prompt = buildEmailPrompt(cvSections, jobDescription);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const rawText = response.text.trim();

    const subjectMatch = rawText.match(/^Subject:\s*(.*)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : "";

    const body = rawText
      .replace(/^Subject:.*\n?/i, "")
      .trim();

    return {
      subject,
      body,
    };

  } catch (error) {
    console.error("Error generating email:", error);
    throw error;
  }
};