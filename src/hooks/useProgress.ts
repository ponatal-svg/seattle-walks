import { useState, useCallback } from 'react';
import type { WalkProgress } from '../types';

const STORAGE_KEY = 'walker-progress';
const LEGACY_KEY = 'seattle-walks-progress';

/** Composite key for per-destination progress storage */
const key = (destination: string, walkId: number) => `${destination}:${walkId}`;

function migrate(): Record<string, WalkProgress> {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return {};
    const old: Record<number, WalkProgress> = JSON.parse(raw);
    const migrated: Record<string, WalkProgress> = {};
    for (const [id, progress] of Object.entries(old)) {
      migrated[key('seattle', Number(id))] = progress;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_KEY);
    return migrated;
  } catch {
    return {};
  }
}

function loadProgress(): Record<string, WalkProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return migrate();
  } catch {
    return {};
  }
}

function saveProgress(data: Record<string, WalkProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage not available (e.g., private browsing quota exceeded)
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, WalkProgress>>(loadProgress);

  const getProgress = useCallback(
    (destination: string, walkId: number): WalkProgress | undefined =>
      progress[key(destination, walkId)],
    [progress],
  );

  const getAllProgress = useCallback(() => progress, [progress]);

  const markStopComplete = useCallback(
    (destination: string, walkId: number, stopId: number, totalStops: number) => {
      setProgress(prev => {
        const k = key(destination, walkId);
        const existing = prev[k] ?? { walkId, completedStops: [], currentStop: 1 };
        const completedStops = existing.completedStops.includes(stopId)
          ? existing.completedStops
          : [...existing.completedStops, stopId];
        const nextStop = Math.min(stopId + 1, totalStops);
        const updated: Record<string, WalkProgress> = {
          ...prev,
          [k]: { walkId, completedStops, currentStop: nextStop },
        };
        saveProgress(updated);
        return updated;
      });
    },
    [],
  );

  const setCurrentStop = useCallback(
    (destination: string, walkId: number, stopId: number) => {
      setProgress(prev => {
        const k = key(destination, walkId);
        const existing = prev[k] ?? { walkId, completedStops: [], currentStop: 1 };
        const updated: Record<string, WalkProgress> = {
          ...prev,
          [k]: { ...existing, currentStop: stopId },
        };
        saveProgress(updated);
        return updated;
      });
    },
    [],
  );

  const resetWalk = useCallback((destination: string, walkId: number) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[key(destination, walkId)];
      saveProgress(updated);
      return updated;
    });
  }, []);

  return { getProgress, getAllProgress, markStopComplete, setCurrentStop, resetWalk };
}
