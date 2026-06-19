import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

export const analyzeResumeWithGemini = async (resumeText) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
    Review the following parsed resume text and provide an ATS score out of 100 based on standard tech industry criteria (readability, keyword optimization, impact, formatting structure).
    Also, identify any missing skills that are standard for modern tech roles but absent from the resume, and provide 2-3 actionable suggestions for improvement.
    
    Return the result EXACTLY as a JSON object with this structure (no markdown, no extra text):
    {
      "score": 85,
      "missingSkills": ["Docker", "AWS", "CI/CD"],
      "suggestions": [
        "Quantify your achievements with metrics.",
        "Add a summary section highlighting your core expertise."
      ]
    }
    
    Resume Text:
    ---
    ${resumeText.substring(0, 5000)} // Limiting to prevent token overflow just in case
    ---
  `;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      // Return a mock response if no key is provided
      return {
        score: Math.floor(Math.random() * 40) + 50,
        missingSkills: ["Cloudinary API", "Gemini AI", "GraphQL"],
        suggestions: ["Add an API Key to get real analysis.", "Include more project links."],
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let textResult = response.text;
    // Clean up if it returned markdown
    if (textResult.startsWith('\`\`\`json')) {
      textResult = textResult.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }

    return JSON.parse(textResult);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to analyze resume with AI');
  }
};

export const calculateMatchScore = async (resumeText, jobDescription) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System).
    Compare the following Resume Text against the Job Description.
    Calculate a match percentage (0 to 100) indicating how well the candidate fits the job.
    
    Return EXACTLY a JSON object:
    { "matchPercentage": 85 }
    
    Job Description:
    ${jobDescription}
    
    Resume Text:
    ${resumeText.substring(0, 3000)}
  `;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return { matchPercentage: Math.floor(Math.random() * 50) + 50 };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let textResult = response.text;
    if (textResult.startsWith('\`\`\`json')) {
      textResult = textResult.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }

    return JSON.parse(textResult);
  } catch (error) {
    console.error("Match Score API Error:", error);
    return { matchPercentage: 50 }; // Safe fallback
  }
};
