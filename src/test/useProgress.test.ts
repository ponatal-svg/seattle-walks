import { renderHook, act } from '@testing-library/react';
import { useProgress } from '../hooks/useProgress';

describe('useProgress', () => {
  it('returns undefined for an unstarted walk', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.getProgress(10)).toBeUndefined();
  });

  it('markStopComplete adds stopId to completedStops', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 1, 15); });
    expect(result.current.getProgress(10)?.completedStops).toContain(1);
  });

  it('markStopComplete does not duplicate a stop', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 1, 15); });
    act(() => { result.current.markStopComplete(10, 1, 15); });
    expect(result.current.getProgress(10)?.completedStops.filter(s => s === 1)).toHaveLength(1);
  });

  it('markStopComplete advances currentStop', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 3, 15); });
    expect(result.current.getProgress(10)?.currentStop).toBe(4);
  });

  it('markStopComplete clamps currentStop at totalStops', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 15, 15); });
    expect(result.current.getProgress(10)?.currentStop).toBe(15);
  });

  it('setCurrentStop updates currentStop without adding to completedStops', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.setCurrentStop(10, 7); });
    expect(result.current.getProgress(10)?.currentStop).toBe(7);
    expect(result.current.getProgress(10)?.completedStops).toHaveLength(0);
  });

  it('resetWalk removes all progress for that walk', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 1, 15); });
    act(() => { result.current.resetWalk(10); });
    expect(result.current.getProgress(10)).toBeUndefined();
  });

  it('getAllProgress returns object keyed by walkId', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 1, 15); });
    const all = result.current.getAllProgress();
    expect(all[10]).toBeDefined();
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markStopComplete(10, 2, 15); });
    const stored = JSON.parse(window.localStorage.getItem('seattle-walks-progress')!);
    expect(stored[10].completedStops).toContain(2);
  });

  it('loads existing progress from localStorage on mount', () => {
    window.localStorage.setItem(
      'seattle-walks-progress',
      JSON.stringify({ 10: { walkId: 10, completedStops: [1, 2, 3], currentStop: 4 } }),
    );
    const { result } = renderHook(() => useProgress());
    expect(result.current.getProgress(10)?.completedStops).toHaveLength(3);
  });

  it('handles corrupt localStorage gracefully', () => {
    window.localStorage.setItem('seattle-walks-progress', 'not-json');
    const { result } = renderHook(() => useProgress());
    expect(result.current.getAllProgress()).toEqual({});
  });
});
