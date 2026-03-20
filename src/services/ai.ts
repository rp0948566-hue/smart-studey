import { GoogleGenAI, Type } from "@google/genai";
import { LearningPreferences } from "../store";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function getPreferencePrompt(prefs?: LearningPreferences) {
  if (!prefs) return "";
  
  const parts = [];

  if (prefs.mode === "fun") {
    parts.push("Make the content engaging, dynamic, and gamified, like a top-tier SaaS product.");
    if (prefs.favoriteSport) parts.push(`Use high-impact analogies related to ${prefs.favoriteSport}.`);
    if (prefs.favoriteColor) parts.push(`Incorporate the color ${prefs.favoriteColor} in descriptions or examples where possible.`);
    if (prefs.hobby) parts.push(`Relate concepts to ${prefs.hobby} for better retention.`);
    if (prefs.passion) parts.push(`Connect the material to their passion for ${prefs.passion}.`);
  }

  if (prefs.learningStyle === "visual") {
    parts.push("Use clear, structured visual descriptions, charts, and diagrams in explanations.");
  } else if (prefs.learningStyle === "auditory") {
    parts.push("Incorporate spoken analogies and explanations, as if listening to a high-level executive briefing.");
  } else if (prefs.learningStyle === "kinesthetic") {
    parts.push("Suggest actionable, hands-on activities or practical real-world examples.");
  }

  if (prefs.difficultyLevel === "beginner") {
    parts.push("Explain concepts simply, avoiding jargon. Focus on foundational, actionable knowledge.");
  } else if (prefs.difficultyLevel === "intermediate") {
    parts.push("Assume foundational understanding. Introduce complex ideas and strategic connections.");
  } else if (prefs.difficultyLevel === "advanced") {
    parts.push("Dive deep into nuances, advanced theories, and strategic implications.");
  }
  
  if (parts.length === 0) return "";
  
  return "\n\nPERSONALIZATION INSTRUCTIONS:\n" + parts.join(" ");
}

export async function generateSummary(text: string, prefs?: LearningPreferences) {
  const prefPrompt = getPreferencePrompt(prefs);
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are a modern, concise AI study assistant for a high-growth SaaS startup. Read these notes and create structured, highly-actionable study notes with clear headings, bullet points for key facts, and highlight the most important terms. Keep the tone professional, encouraging, and focused on rapid learning. Format in clean markdown.${prefPrompt}\n\nNotes:\n${text}`,
  });
  return response.text || "";
}

export async function generateQuiz(text: string, prefs?: LearningPreferences) {
  const prefPrompt = getPreferencePrompt(prefs);
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are a modern, concise AI study assistant for a high-growth SaaS startup. Generate exactly 10 multiple choice questions from these notes to test the user's knowledge efficiently. Each question must have 4 options (A, B, C, D) with exactly one correct answer. Also write a 1-sentence, actionable explanation for the correct answer. Return as JSON array.${prefPrompt}\n\nNotes:\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "0 for A, 1 for B, 2 for C, 3 for D",
            },
            explanation: { type: Type.STRING },
          },
          required: [
            "question",
            "options",
            "correctAnswerIndex",
            "explanation",
          ],
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
}

export async function generateConceptMap(text: string, prefs?: LearningPreferences) {
  const prefPrompt = getPreferencePrompt(prefs);
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are a modern, concise AI study assistant for a high-growth SaaS startup. Extract the main topic and 5 sub-topics from these notes to create a high-level mental model. For each sub-topic, give 2 concise detail points. Keep explanations brief and impactful. Return as JSON with structure: {mainTopic: {name, explanation}, subTopics: [{name, explanation, details: [{name, explanation}]}]}.${prefPrompt}\n\nNotes:\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mainTopic: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["name", "explanation"],
          },
          subTopics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                explanation: { type: Type.STRING },
                details: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ["name", "explanation"],
                  },
                },
              },
              required: ["name", "explanation", "details"],
            },
          },
        },
        required: ["mainTopic", "subTopics"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function chatWithTutor(
  message: string,
  notes: string,
  history: { role: string; text: string }[],
  prefs?: LearningPreferences
) {
  const contents = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));
  contents.push({ role: "user", parts: [{ text: message }] });

  const prefPrompt = getPreferencePrompt(prefs);

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents,
    config: {
      systemInstruction: `You are a modern, concise AI study assistant for a high-growth SaaS startup. The student has uploaded the following notes: \n\n${notes}\n\nOnly answer questions based on these notes. Be highly-actionable, encouraging, and clear. Keep explanations brief and impactful.${prefPrompt}`,
    },
  });

  return response.text || "";
}
