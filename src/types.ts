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
  /** Optional photo shown at the top of the stop card (path relative to /public) */
  image?: string;
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
  /** True when the walk runs opposite to the book's original order */
  reversed?: boolean;
}

export interface Walk extends WalkMeta {
  introduction?: string;
  mapImage?: string;
  /** Pre-built Google Maps URLs (used instead of auto-generating from waypoints) */
  mapUrls?: string[];
  waypoints: Waypoint[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description?: string;
  published: boolean;
}

export interface WalkProgress {
  walkId: number;
  completedStops: number[]; // waypoint ids completed
  currentStop: number;
}
