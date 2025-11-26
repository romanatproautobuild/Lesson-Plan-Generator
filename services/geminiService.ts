import { GoogleGenAI, Type } from "@google/genai";
import { LessonRequest, LessonPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonPlan = async (request: LessonRequest): Promise<LessonPlanResponse> => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    You are an expert ESL (English as a Second Language) Curriculum Developer specializing in the Vietnamese education context.
    Your goal is to create highly engaging, culturally relevant, and structured lesson plans for teachers in Vietnam.
    
    Considerations:
    - Vietnamese students often struggle with pronunciation (ending sounds, intonation).
    - Large classes in Vietnam require specific classroom management strategies tailored to the activities.
    - Cultural Context: Use Vietnamese names (e.g., Nam, Lan, Mai) or contexts (e.g., Tet holiday, Pho, traffic in HCMC/Hanoi) in examples where appropriate.
    - Supportive Documents: Create actual text content that can be copied onto a worksheet (fill in the blanks, matching, etc.).
    - If a file is attached (PDF or Image), analyze its content to inform the lesson plan (e.g., use the vocabulary from the image, or adapt the activities from the PDF).
  `;

  const promptText = `
    Create a lesson plan with the following details:
    - Topic: ${request.topic}
    - Class Size: ${request.classSize}
    - Age Group: ${request.age}
    - Proficiency Level: ${request.level}
    - Focus Skills: ${request.focus.join(", ")}
    - Duration: ${request.duration}
    - Additional Teacher Context: ${request.context}

    If there is an attached file, use it as source material for the lesson content.

    The output must be a valid JSON object matching the schema provided.
  `;

  const parts: any[] = [{ text: promptText }];

  if (request.fileData) {
    parts.push({
      inlineData: {
        mimeType: request.fileData.mimeType,
        data: request.fileData.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A creative title for the lesson" },
            objectives: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 bullet points on what students will achieve"
            },
            warmUp: { type: Type.STRING, description: "A quick 5-min energizer or warm-up activity" },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "Duration e.g., '10 mins'" },
                  activityName: { type: Type.STRING },
                  procedure: { type: Type.STRING, description: "Step-by-step instructions for the teacher" },
                  interaction: { type: Type.STRING, description: "e.g., T-S (Teacher-Student), S-S, Group" }
                }
              }
            },
            games: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  materialsNeeded: { type: Type.STRING },
                  instructions: { type: Type.STRING }
                }
              },
              description: "1-2 fun games to reinforce learning"
            },
            homework: { type: Type.STRING, description: "Homework assignment description" },
            worksheetContent: { type: Type.STRING, description: "Raw text content for a worksheet (e.g., Quiz questions, gap fills) that the teacher can copy/print." },
            teacherNotes: { type: Type.STRING, description: "Specific advice for Vietnamese students (e.g., common errors to watch for) based on the topic." }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LessonPlanResponse;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};