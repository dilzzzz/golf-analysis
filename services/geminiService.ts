
import { GoogleGenAI } from '@google/genai';
import type { SwingAnalysis, Course, GroundingChunk, InstructionalContent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const swingAnalysisSchema = {
    type: "OBJECT",
    properties: {
        overallSummary: {
            type: "STRING",
            description: "A brief, encouraging one-paragraph summary of the entire golf swing."
        },
        strengths: {
            type: "ARRAY",
            description: "Positive aspects of the golf swing.",
            items: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING", description: "A short title for the strength (e.g., 'Good Posture', 'Balanced Finish')." },
                    description: { type: "STRING", description: "A one-sentence explanation of why this is a strength." }
                },
                required: ["title", "description"]
            }
        },
        areasForImprovement: {
            type: "ARRAY",
            description: "Areas where the golfer can improve their swing.",
            items: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING", description: "A short title for the area of improvement (e.g., 'Early Extension', 'Casting the Club')." },
                    description: { type: "STRING", description: "A one-sentence explanation of the issue and why it's problematic." }
                },
                required: ["title", "description"]
            }
        },
        suggestedDrills: {
            type: "ARRAY",
            description: "Specific drills to help with the areas for improvement.",
            items: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING", description: "The name of the drill (e.g., 'Towel Drill', 'Headcover Drill')." },
                    instructions: { type: "STRING", description: "Detailed, step-by-step instructions on how to perform the drill." },
                    videoUrl: { type: "STRING", description: "A URL to a YouTube video demonstrating the drill, if a relevant one can be found. Otherwise, omit this field."}
                },
                required: ["name", "instructions"]
            }
        }
    },
    required: ["overallSummary", "strengths", "areasForImprovement", "suggestedDrills"]
};

export const analyzeSwing = async (base64Frames: string[]): Promise<SwingAnalysis> => {
    const prompt = `
    You are a world-class golf coach. Analyze the following 8 frames of a golf swing.
    The frames are provided in sequence: Address, Takeaway, Mid-Backswing, Top of Backswing, Transition, Impact, Follow-through, and Finish.
    Provide a detailed analysis covering the entire motion.
    - Start with a concise overall summary.
    - Identify 2-3 key strengths of the swing.
    - Identify the 2-3 most important areas for improvement.
    - For each area for improvement, suggest a specific, actionable drill. Provide very detailed, step-by-step instructions for each drill. Also, find a relevant YouTube video URL demonstrating the drill if possible.
    - Maintain an encouraging and positive tone.
    - Ensure your response is in the specified JSON format.
  `;

    const imageParts = base64Frames.map(frame => {
        const base64Data = frame.split(',')[1];
        return {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
            }
        };
    });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                parts: [
                    { text: prompt },
                    ...imageParts
                ]
            }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: swingAnalysisSchema,
            }
        });

        const jsonText = response.text;
        
        if (!jsonText) {
          throw new Error("The AI response was empty.");
        }
        
        const analysisResult = JSON.parse(jsonText);

        // Basic validation to ensure the parsed object has the expected structure
        if (
            !analysisResult.overallSummary ||
            !Array.isArray(analysisResult.strengths) ||
            !Array.isArray(analysisResult.areasForImprovement) ||
            !Array.isArray(analysisResult.suggestedDrills)
        ) {
            throw new Error('AI response is missing required fields.');
        }

        return analysisResult as SwingAnalysis;

    } catch (error) {
        console.error("Error analyzing swing with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`The AI analysis failed. ${error.message}`);
        }
        throw new Error("An unknown error occurred during the AI analysis.");
    }
};

export const findCourses = async (location: string): Promise<{ courses: Course[], sources: GroundingChunk[] }> => {
    const prompt = `
        You are a helpful assistant for golfers. Find golf courses near "${location}".
        For each course, provide its name, full address, official website URL, phone number, course type (e.g., "Public", "Private", "Semi-Private"), a brief one-sentence summary, and a user rating out of 5 (if available, otherwise use null).
        Return the result as a JSON object with a single key "courses", which is an array of objects.
        Each object in the array must have the following keys: "name", "address", "website", "phone", "type", "summary", "rating".
        If a value isn't found for a specific field (like website, phone, or rating), use an empty string "" for string fields and null for the rating number.
        Do not include any other text or explanation outside of the JSON object itself.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
        const jsonText = response.text;
        
        if (!jsonText) {
            throw new Error("The AI response was empty.");
        }
        
        const match = jsonText.match(/```json\n([\s\S]*?)\n```/);
        const cleanedJson = match ? match[1] : jsonText;

        const result = JSON.parse(cleanedJson);

        if (!result.courses || !Array.isArray(result.courses)) {
            throw new Error("Invalid JSON structure from AI response.");
        }

        return { courses: result.courses as Course[], sources };

    } catch (error) {
        console.error("Error finding courses with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`The AI course finder failed. ${error.message}`);
        }
        throw new Error("An unknown error occurred during the AI course search.");
    }
};

export const findInstructionalContent = async (query: string): Promise<{ content: InstructionalContent[], sources: GroundingChunk[] }> => {
    const prompt = `
        You are an expert golf coach and content curator. Find the best instructional golf content (videos and articles) on the web related to the query: "${query}".
        For each piece of content, provide a concise title, a helpful one-sentence description, the type ('Video' or 'Article'), and the direct URL.
        Return the result as a JSON object with a single key "content", which is an array of objects.
        Each object in the array must have the following keys: "title", "description", "url", "type".
        Find between 5 and 10 high-quality, relevant results. Prioritize content from well-known coaches, academies, and publications.
        Do not include any other text or explanation outside of the JSON object itself.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
        const jsonText = response.text;
        
        if (!jsonText) {
            throw new Error("The AI response was empty.");
        }
        
        // The response might be wrapped in markdown, so we extract the JSON part.
        const match = jsonText.match(/```json\n([\s\S]*?)\n```/);
        const cleanedJson = match ? match[1] : jsonText;

        const result = JSON.parse(cleanedJson);

        if (!result.content || !Array.isArray(result.content)) {
            throw new Error("Invalid JSON structure from AI response.");
        }

        return { content: result.content as InstructionalContent[], sources };

    } catch (error) {
        console.error("Error finding instructional content with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`The AI content finder failed. ${error.message}`);
        }
        throw new Error("An unknown error occurred during the AI content search.");
    }
};

const tipsSchema = {
    type: "OBJECT",
    properties: {
        tips: {
            type: "ARRAY",
            description: "An array of 3 to 5 concise and actionable golf tips.",
            items: {
                type: "STRING",
                description: "A single, actionable golf tip."
            }
        }
    },
    required: ["tips"]
};

export const generatePersonalizedTips = async (areasForImprovement: { title: string; description: string }[]): Promise<string[]> => {
    const improvementText = areasForImprovement.map(item => `- ${item.title}: ${item.description}`).join('\n');
    
    const prompt = `
        You are a world-class golf coach. A golfer has the following areas for improvement in their swing:
        ${improvementText}

        Based on these specific issues, generate a list of 3 to 5 very concise, actionable, and easy-to-understand tips.
        Each tip should be a single sentence, maybe two at most. Focus on practical advice the golfer can implement immediately during practice or on the course.
        Present the tips in the specified JSON format.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: tipsSchema,
            }
        });

        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("The AI response for tips was empty.");
        }
        
        const result = JSON.parse(jsonText);

        if (!result.tips || !Array.isArray(result.tips)) {
            throw new Error('AI response for tips is missing the "tips" array.');
        }

        return result.tips as string[];

    } catch (error) {
        console.error("Error generating personalized tips with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`The AI tips generation failed. ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI tips generation.");
    }
};