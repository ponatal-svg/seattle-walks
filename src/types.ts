export interface Coords {
  lat: number;
  lng: number;
}

export interface Waypoint {
  id: number;
  title: string;
  location: string;
  coords: Coords;
  content: string;
}

export type Difficulty = 'easy' | 'moderate' | 'strenuous';

export interface WalkMeta {
  id: number;
  title: string;
  subtitle: string;
  distance: string;
  difficulty: Difficulty;
  startPoint: string;
  endPoint: string;
  totalStops: number;
}

export interface Walk extends WalkMeta {
  waypoints: Waypoint[];
}

export interface WalkProgress {
  walkId: number;
  completedStops: number[]; // waypoint ids completed
  currentStop: number;
}
