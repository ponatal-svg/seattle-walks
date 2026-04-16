import { useProgress } from '../hooks/useProgress';
import type { WalkMeta } from '../types';

const difficultyLabel: Record<string, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
};

const difficultyChip: Record<string, string> = {
  easy: 'chip chip-green',
  moderate: 'chip chip-amber',
  strenuous: 'chip chip-red',
};

export function ProgressRing({ pct, current, total }: { pct: number; current: number; total: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="progress-ring" aria-label={`${current} of ${total} stops completed`}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={r}
          fill="none"
          stroke="#2d6a4f"
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="progress-ring-label">{current}/{total}</span>
    </div>
  );
}

export function WalkCard({
  walk,
  destination,
  availableIds,
  color,
  onClick,
}: {
  walk: WalkMeta;
  destination: string;
  availableIds: Set<number>;
  color: string;
  onClick: () => void;
}) {
  const { getProgress } = useProgress();
  const progress = getProgress(destination, walk.id);
  const completedStops = progress?.completedStops.length ?? 0;
  const pct = Math.round((completedStops / walk.totalStops) * 100);
  const isDone = completedStops >= walk.totalStops;
  const isStarted = completedStops > 0;
  const isAvailable = availableIds.has(walk.id);

  return (
    <button className="walk-card" onClick={onClick} aria-label={`Walk ${walk.id}: ${walk.title}`}>
      <div className="walk-card-badge" style={{ background: isDone ? '#52b788' : isStarted ? color : '#9ca3af' }}>
        {isDone ? '✓' : walk.id}
      </div>
      <div className="walk-card-body">
        <div className="walk-card-title truncate">
          {isAvailable && <span style={{ marginRight: '0.3em' }}>🚶</span>}
          {walk.title}
        </div>
        <div className="walk-card-sub truncate">{walk.subtitle}</div>
        <div className="walk-card-chips">
          <span className="chip chip-blue">{walk.distance}</span>
          <span className={difficultyChip[walk.difficulty]}>{difficultyLabel[walk.difficulty]}</span>
          {walk.reversed && <span className="chip chip-amber">⭐ Reversed</span>}
        </div>
      </div>
      <div className="walk-card-right">
        {isDone ? (
          <span className="chip chip-green">Done ✓</span>
        ) : isStarted ? (
          <ProgressRing pct={pct} current={completedStops} total={walk.totalStops} />
        ) : (
          <span className="walk-card-chevron">›</span>
        )}
      </div>
    </button>
  );
}
