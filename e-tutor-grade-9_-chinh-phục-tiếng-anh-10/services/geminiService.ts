
import { GoogleGenAI, Type } from "@google/genai";
import { GrammarError, Question } from "../types";

export const getAIInstance = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

// Prompt để phân tích lỗi ngữ pháp
export const checkGrammarPrompt = `
Bạn là một chuyên gia gia sư tiếng Anh cho học sinh lớp 9 tại Việt Nam, am hiểu chương trình Global Success.
Hãy phân tích văn bản hoặc hình ảnh bài tập tiếng Anh được cung cấp.
1. Tìm các lỗi ngữ pháp (thì, câu bị động, câu điều kiện, mệnh đề quan hệ, v.v.).
2. Giải thích lỗi sai dựa trên chương trình lớp 9.
3. Đề xuất cách sửa.
Trả về định dạng JSON:
{
  "errors": [
    {
      "error": "câu gốc sai",
      "correction": "câu đúng",
      "explanation": "giải thích bằng tiếng Việt",
      "unit": "số Unit tương ứng trong SGK lớp 9 (1-12)"
    }
  ]
}
`;

// Prompt để tạo bài tập cá nhân hóa
export const generateExercisesPrompt = (topics: string[]) => `
Dựa trên các chủ điểm kiến thức: ${topics.join(', ')}, hãy tạo 5 câu hỏi trắc nghiệm tiếng Anh lớp 9 (Trình độ ôn thi vào 10).
Trả về định dạng JSON:
{
  "questions": [
    {
      "question": "Nội dung câu hỏi",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": 0, // index của đáp án đúng (0-3)
      "explanation": "Giải thích chi tiết tại sao chọn đáp án đó"
    }
  ]
}
`;

export const analyzeGrammar = async (text: string, imageData?: string): Promise<GrammarError[]> => {
  const ai = getAIInstance();
  try {
    const contents: any[] = [{ text: checkGrammarPrompt }];
    if (text) contents.push({ text: `Văn bản cần kiểm tra: ${text}` });
    if (imageData) {
      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.split(',')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            errors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  error: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  unit: { type: Type.INTEGER }
                },
                required: ["error", "correction", "explanation", "unit"]
              }
            }
          },
          required: ["errors"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"errors": []}');
    return data.errors;
  } catch (error) {
    console.error("AI Grammar Error:", error);
    throw error;
  }
};

export const generateQuestions = async (topics: string[]): Promise<Question[]> => {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: generateExercisesPrompt(topics),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "answer", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });
    const data = JSON.parse(response.text || '{"questions": []}');
    return data.questions;
  } catch (error) {
    console.error("AI Question Gen Error:", error);
    throw error;
  }
};
