
export interface SwingAnalysis {
  overallSummary: string;
  strengths: { title: string; description: string }[];
  areasForImprovement: { title: string; description: string }[];
  suggestedDrills: {
    name: string;
    instructions: string;
    videoUrl?: string;
  }[];
}

export interface Course {
  name: string;
  address: string;
  website: string;
  phone: string;
  type: string;
  summary: string;
  rating: number | null;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export type ShotOutcome = 'Fairway' | 'Green' | 'Rough' | 'Bunker' | 'Water Hazard' | 'Out of Bounds' | 'In the Hole';

export interface Shot {
  hole: number;
  par: number;
  club: string;
  distance: number;
  outcome: ShotOutcome;
}

export type GolfRound = Shot[];

export interface InstructionalContent {
  title: string;
  description: string;
  url: string;
  type: 'Video' | 'Article';
}

export interface Reply {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  reported?: boolean;
}

export interface Post {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  replies: Reply[];
  reported?: boolean;
  likes: number;
  unlikes: number;
}