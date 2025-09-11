
import type { SwingAnalysis, Course, GroundingChunk, InstructionalContent, ClubRecommendation } from '../types';

async function callApiProxy(action: string, payload: unknown): Promise<any> {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! Status: ${response.status}` }));
      throw new Error(errorData.error || 'An unknown error occurred while communicating with the AI service.');
    }

    return response.json();
  } catch (error) {
    console.error(`Error in proxy call for action "${action}":`, error);
    if (error instanceof Error) {
        throw new Error(`The AI service failed. ${error.message}`);
    }
    throw new Error("An unknown network error occurred.");
  }
}

export const analyzeSwing = async (base64Frames: string[]): Promise<SwingAnalysis> => {
  return callApiProxy('analyzeSwing', { base64Frames });
};

export const findCourses = async (location: string): Promise<{ courses: Course[], sources: GroundingChunk[] }> => {
  return callApiProxy('findCourses', { location });
};

export const findInstructionalContent = async (query: string): Promise<{ content: InstructionalContent[], sources: GroundingChunk[] }> => {
  return callApiProxy('findInstructionalContent', { query });
};

export const generatePersonalizedTips = async (areasForImprovement: { title: string; description: string }[]): Promise<string[]> => {
  return callApiProxy('generatePersonalizedTips', { areasForImprovement });
};

export const getClubRecommendation = async (conditions: { distance: number; lie: string; windSpeed: number; windDirection: string; elevationChange: number; }): Promise<ClubRecommendation> => {
    return callApiProxy('getClubRecommendation', { conditions });
};