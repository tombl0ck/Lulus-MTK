import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_QUIZ, SYSTEM_INSTRUCTION_CHAT } from '../constants';
import { QuizQuestion } from '../types';

// Helper to initialize client dynamically
const getAiClient = (apiKey: string) => new GoogleGenAI({ apiKey });

export const generateQuizQuestion = async (topicTitle: string, apiKey: string): Promise<QuizQuestion> => {
  try {
    const ai = getAiClient(apiKey);
    const prompt = `Buatlah 1 soal matematika pilihan ganda tentang "${topicTitle}". 
    Pastikan angkanya tidak terlalu rumit agar bisa dikerjakan dalam 2-3 menit.
    Berikan penjelasan langkah demi langkah yang sangat jelas di bagian 'explanation'.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_QUIZ,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "explanation"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    return JSON.parse(jsonText) as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback question if API fails
    return {
      question: "Maaf, terjadi kesalahan koneksi atau Key tidak valid. Berapa hasil dari 12 x 12?",
      options: ["122", "144", "124", "142"],
      correctIndex: 1,
      explanation: "Perkalian 12 x 12 adalah 144."
    };
  }
};

// We will use a simple chat instance for the tutor session
export const createTutorChat = (apiKey: string) => {
  const ai = getAiClient(apiKey);
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_CHAT,
    }
  });
};