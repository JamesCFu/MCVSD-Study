
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Question } from "./types";

// Always use the required initialization pattern
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (category: Category, count: number = 5): Promise<Question[]> => {
  const isMock = category === Category.MOCK;
  
  // Real MCVSD tests are divided into Language Arts and Math.
  // We simulate a condensed version (20 questions) to ensure high quality and stability.
  const systemInstruction = `
    You are an expert tutor specializing in the New Jersey Monmouth County Vocational School District (MCVSD) high school admissions test (e.g., for High Technology HS, BioTechnology HS, Marine Academy).
    
    ${isMock ? `
    STRUCTURE: This is a FULL MOCK SIMULATION. Generate exactly 20 questions.
    - Questions 1-10: Language Arts (5 Reading Comprehension with a 300-word academic passage, 3 Grammar/Usage, 2 Vocabulary in Context).
    - Questions 11-20: Mathematics (Advanced).
    
    MATH DIFFICULTY: The math must be DIFFICULT. Focus on:
    - Advanced Algebra (Systems of equations, quadratic word problems, complex inequalities).
    - Honors Geometry (Circle theorems, Pythagorean applications in 3D, coordinate geometry).
    - Logic and Number Theory (Patterns, probability, base systems, non-routine problem solving).
    - Avoid "basic" arithmetic. Use multi-step problems that require critical thinking.
    ` : `
    CATEGORY-SPECIFIC GUIDELINES for ${category}:
    - For READING COMPREHENSION: Academic level passages with inference-heavy questions.
    - For VOCABULARY: SSAT/ISEE Upper Level style words in context.
    - For GRAMMAR: Punctuation (colons/semicolons), active/passive voice, misplaced modifiers.
    - For MATH: Advanced Honors Grade 8/9 level. Multi-step word problems, factoring, and geometric proofs.
    `}

    FORMATTING RULES:
    - Every question MUST have a clear 'explanation' that teaches the underlying concept.
    - For Reading, ensure the 'passage' field is populated for all questions in that set.
    - Ensure question categories are accurately tagged as "Reading Comprehension", "Mathematics", etc.
  `;

  const prompt = isMock 
    ? "Generate a 20-question comprehensive MCVSD Mock Test. 10 Language Arts, 10 Advanced Math. Harder difficulty."
    : `Generate ${count} difficult practice questions for the ${category} section of the MCVSD exam.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Use Pro for the larger, more complex mock test generation
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              description: "Must be 'Reading Comprehension', 'Vocabulary', 'Grammar & Writing', or 'Mathematics'"
            },
            passage: { type: Type.STRING },
            questionText: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "category", "questionText", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    const text = response.text;
    if (!text) return [];
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
};

export const getAITutorFeedback = async (question: Question, userAnswer: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Question: ${question.questionText}
      Category: ${question.category}
      User Answer: ${userAnswer}
      Correct Answer: ${question.options[question.correctAnswer]}
      Explain why the answer is correct and provide a 'Pro-Tip' for this specific question type.
    `,
    config: {
      systemInstruction: "You are 'Ace', an elite admissions coach. Be concise, brilliant, and encouraging."
    }
  });
  return response.text || "Keep pushing, you're doing great!";
};
