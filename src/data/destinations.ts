import type { Destination, WalkMeta } from '../types';
import { walksIndex, AVAILABLE_WALK_IDS } from './walksIndex';
import { santaFeWalksIndex, SANTA_FE_AVAILABLE_IDS } from './santaFe/walksIndex';

export const destinations: Destination[] = [
  {
    id: 'seattle',
    name: 'Seattle, WA',
    slug: 'seattle',
    country: 'US',
    description: 'History & nature through 18 city walks',
    published: true,
  },
  {
    id: 'santa-fe',
    name: 'Santa Fe, NM',
    slug: 'santa-fe',
    country: 'US',
    description: '400 years of the City Different',
    published: true,
  },
];

export const destinationWalks: Record<string, WalkMeta[]> = {
  'seattle': walksIndex,
  'santa-fe': santaFeWalksIndex,
};

export const destinationAvailableIds: Record<string, Set<number>> = {
  'seattle': AVAILABLE_WALK_IDS,
  'santa-fe': SANTA_FE_AVAILABLE_IDS,
};

// ── Admin publish state ────────────────────────────────

interface AdminState {
  destinations: Record<string, boolean>;
  walks: Record<string, boolean>;
}

const ADMIN_KEY = 'walker-admin-state';

export function loadAdminState(): AdminState {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { destinations: {}, walks: {} };
}

export function saveAdminState(state: AdminState): void {
  try {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/** Returns true if the destination (and optionally a specific walk) is published. */
export function isPublished(destinationSlug: string, walkId?: number): boolean {
  const state = loadAdminState();

  // Check walk-level override first
  if (walkId !== undefined) {
    const walkKey = `${destinationSlug}:${walkId}`;
    if (walkKey in state.walks) return state.walks[walkKey];
  }

  // Check destination-level override
  if (destinationSlug in state.destinations) return state.destinations[destinationSlug];

  // Fall back to code default
  const dest = destinations.find(d => d.slug === destinationSlug);
  return dest?.published ?? false;
}

/** Returns only destinations the user has published. */
export function publishedDestinations(): Destination[] {
  return destinations.filter(d => isPublished(d.slug));
}
