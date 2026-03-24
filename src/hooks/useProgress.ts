import { useState, useCallback } from 'react';
import type { WalkProgress } from '../types';

const STORAGE_KEY = 'seattle-walks-progress';

function loadProgress(): Record<number, WalkProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: Record<number, WalkProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage not available (e.g., private browsing quota exceeded)
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<number, WalkProgress>>(loadProgress);

  const getProgress = useCallback(
    (walkId: number): WalkProgress | undefined => progress[walkId],
    [progress],
  );

  const getAllProgress = useCallback(() => progress, [progress]);

  const markStopComplete = useCallback((walkId: number, stopId: number, totalStops: number) => {
    setProgress(prev => {
      const existing = prev[walkId] ?? { walkId, completedStops: [], currentStop: 1 };
      const completedStops = existing.completedStops.includes(stopId)
        ? existing.completedStops
        : [...existing.completedStops, stopId];
      const nextStop = Math.min(stopId + 1, totalStops);
      const updated: Record<number, WalkProgress> = {
        ...prev,
        [walkId]: { walkId, completedStops, currentStop: nextStop },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const setCurrentStop = useCallback((walkId: number, stopId: number) => {
    setProgress(prev => {
      const existing = prev[walkId] ?? { walkId, completedStops: [], currentStop: 1 };
      const updated: Record<number, WalkProgress> = {
        ...prev,
        [walkId]: { ...existing, currentStop: stopId },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetWalk = useCallback((walkId: number) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[walkId];
      saveProgress(updated);
      return updated;
    });
  }, []);

  return { getProgress, getAllProgress, markStopComplete, setCurrentStop, resetWalk };
}
