
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import type { SwingAnalysis, Course, GroundingChunk, InstructionalContent, ClubRecommendation } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Schemas for structured responses ---

const swingAnalysisSchema = {
    type: "OBJECT",
    properties: {
        overallSummary: { type: "STRING", description: "A brief, encouraging one-paragraph summary of the entire golf swing." },
        strengths: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, description: { type: "STRING" } } } },
        areasForImprovement: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, description: { type: "STRING" } } } },
        suggestedDrills: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, instructions: { type: "STRING" }, videoUrl: { type: "STRING" } } } }
    },
    required: ["overallSummary", "strengths", "areasForImprovement", "suggestedDrills"]
};

const tipsSchema = {
    type: "OBJECT",
    properties: { tips: { type: "ARRAY", items: { type: "STRING" } } },
    required: ["tips"]
};

const clubRecommendationSchema = {
    type: "OBJECT",
    properties: {
        club: { type: "STRING" },
        confidence: { type: "STRING" },
        reasoning: { type: "STRING" },
        alternativeClub: { type: "STRING" },
        alternativeReasoning: { type: "STRING" }
    },
    required: ["club", "confidence", "reasoning"]
};

// --- API Logic Functions ---

const analyzeSwing = async (base64Frames: string[]): Promise<SwingAnalysis> => {
    const prompt = `You are a world-class golf coach. Analyze the following 8 frames of a golf swing... Provide a detailed analysis... Ensure your response is in the specified JSON format.`;
    const imageParts = base64Frames.map(frame => ({ inlineData: { mimeType: 'image/jpeg', data: frame.split(',')[1] } }));
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }, ...imageParts] }],
        config: { responseMimeType: 'application/json', responseSchema: swingAnalysisSchema }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("The AI model did not return a valid analysis.");
    }
    return JSON.parse(text) as SwingAnalysis;
};

const findCourses = async (location: string): Promise<{ courses: Course[], sources: GroundingChunk[] }> => {
    const prompt = `You are a helpful assistant for golfers. Find golf courses near "${location}"... Return the result as a JSON object with a single key "courses"...`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("The AI model did not return any course data.");
    }
    
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
    const jsonText = text.match(/```json\n([\s\S]*?)\n```/)?.[1] || text;
    const result = JSON.parse(jsonText);
    return { courses: result.courses as Course[], sources };
};

const findInstructionalContent = async (query: string): Promise<{ content: InstructionalContent[], sources: GroundingChunk[] }> => {
    const prompt = `You are an expert golf coach. Find the best instructional golf content (videos and articles) on the web related to the query: "${query}"... Return the result as a JSON object with a single key "content"...`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: { tools: [{ googleSearch: {} }] }
    });

    const text = response.text;
    if (!text) {
        throw new Error("The AI model did not return any content.");
    }

    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
    const jsonText = text.match(/```json\n([\s\S]*?)\n```/)?.[1] || text;
    const result = JSON.parse(jsonText);
    return { content: result.content as InstructionalContent[], sources };
};

const generatePersonalizedTips = async (areasForImprovement: { title: string; description: string }[]): Promise<string[]> => {
    const improvementText = areasForImprovement.map(item => `- ${item.title}: ${item.description}`).join('\n');
    const prompt = `You are a world-class golf coach. A golfer has these areas for improvement:\n${improvementText}\nBased on these, generate 3-5 concise, actionable tips in the specified JSON format.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', responseSchema: tipsSchema }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("The AI model did not return any tips.");
    }
    const result = JSON.parse(text);
    return result.tips as string[];
};

const getClubRecommendation = async (conditions: { distance: number; lie: string; windSpeed: number; windDirection: string; elevationChange: number; }): Promise<ClubRecommendation> => {
    const { distance, lie, windSpeed, windDirection, elevationChange } = conditions;
    const prompt = `You are an expert PGA caddie. Analyze these conditions:\n- Distance: ${distance} yds\n- Lie: ${lie}\n- Wind: ${windSpeed} mph ${windDirection}\n- Elevation: ${elevationChange} yds\nProvide a club recommendation in the specified JSON format, including detailed reasoning and an alternative.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', responseSchema: clubRecommendationSchema }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("The AI model did not return a club recommendation.");
    }
    return JSON.parse(text) as ClubRecommendation;
};

// --- Main Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, payload } = req.body;

    try {
        let result: any;
        switch (action) {
            case 'analyzeSwing':
                result = await analyzeSwing(payload.base64Frames);
                break;
            case 'findCourses':
                result = await findCourses(payload.location);
                break;
            case 'findInstructionalContent':
                result = await findInstructionalContent(payload.query);
                break;
            case 'generatePersonalizedTips':
                result = await generatePersonalizedTips(payload.areasForImprovement);
                break;
            case 'getClubRecommendation':
                result = await getClubRecommendation(payload.conditions);
                break;
            default:
                return res.status(400).json({ error: 'Invalid action specified' });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error processing action "${action}":`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return res.status(500).json({ error: `AI service failed: ${errorMessage}` });
    }
}
