import { useNavigate } from 'react-router-dom';
import { walksIndex } from '../data/walksIndex';
import { useProgress } from '../hooks/useProgress';
import type { WalkMeta } from '../types';
import './HomePage.css';

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

const WALK_COLORS = [
  '#2d6a4f','#1a6ea8','#6d4c41','#6a1f6a','#1565c0',
  '#2e7d32','#c62828','#4527a0','#00695c','#e65100',
  '#1c1f2e','#558b2f','#ad1457','#0277bd','#37474f',
  '#283593','#4e342e','#00838f',
];

function ProgressRing({ pct, current, total }: { pct: number; current: number; total: number }) {
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

function WalkCard({ walk, color, onClick }: { walk: WalkMeta; color: string; onClick: () => void }) {
  const { getProgress } = useProgress();
  const progress = getProgress(walk.id);
  const completedStops = progress?.completedStops.length ?? 0;
  const pct = Math.round((completedStops / walk.totalStops) * 100);
  const isDone = completedStops >= walk.totalStops;
  const isStarted = completedStops > 0;

  return (
    <button className="walk-card" onClick={onClick} aria-label={`Walk ${walk.id}: ${walk.title}`}>
      <div className="walk-card-badge" style={{ background: isDone ? '#52b788' : isStarted ? color : '#9ca3af' }}>
        {isDone ? '✓' : walk.id}
      </div>
      <div className="walk-card-body">
        <div className="walk-card-title truncate">{walk.title}</div>
        <div className="walk-card-sub truncate">{walk.subtitle}</div>
        <div className="walk-card-chips">
          <span className="chip chip-blue">{walk.distance}</span>
          <span className={difficultyChip[walk.difficulty]}>{difficultyLabel[walk.difficulty]}</span>
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

export default function HomePage() {
  const navigate = useNavigate();
  const { getAllProgress } = useProgress();
  const allProgress = getAllProgress();

  const completedWalks = walksIndex.filter(w => {
    const p = allProgress[w.id];
    return p && p.completedStops.length >= w.totalStops;
  });
  const inProgressWalks = walksIndex.filter(w => {
    const p = allProgress[w.id];
    return p && p.completedStops.length > 0 && p.completedStops.length < w.totalStops;
  });
  const notStarted = walksIndex.filter(w => {
    const p = allProgress[w.id];
    return !p || p.completedStops.length === 0;
  });

  const totalMilesWalked = walksIndex.reduce((acc, w) => {
    const p = allProgress[w.id];
    if (!p) return acc;
    const fraction = p.completedStops.length / w.totalStops;
    return acc + parseFloat(w.distance) * fraction;
  }, 0);

  return (
    <div className="app-shell">
      {/* Hero Header */}
      <header className="home-header">
        <div className="home-header-eyebrow">David B. Williams</div>
        <h1 className="home-header-title">Seattle Walks</h1>
        <p className="home-header-sub">18 walks · Discovering history & nature in the city</p>
        <div className="home-stats">
          <div className="home-stat"><span className="home-stat-num">18</span><span className="home-stat-lbl">Walks</span></div>
          <div className="home-stat"><span className="home-stat-num">{completedWalks.length}</span><span className="home-stat-lbl">Done</span></div>
          <div className="home-stat"><span className="home-stat-num">{totalMilesWalked.toFixed(1)}</span><span className="home-stat-lbl">Mi walked</span></div>
        </div>
      </header>

      {/* Walk List */}
      <div className="scroll-area">
        {inProgressWalks.length > 0 && (
          <section>
            <div className="section-label">📍 Continue where you left off</div>
            {inProgressWalks.map((w, i) => (
              <WalkCard key={w.id} walk={w} color={WALK_COLORS[i % WALK_COLORS.length]}
                onClick={() => navigate(`/walk/${w.id}`)} />
            ))}
          </section>
        )}

        {completedWalks.length > 0 && (
          <section>
            <div className="section-label">✅ Completed</div>
            {completedWalks.map((w, i) => (
              <WalkCard key={w.id} walk={w} color={WALK_COLORS[i % WALK_COLORS.length]}
                onClick={() => navigate(`/walk/${w.id}`)} />
            ))}
          </section>
        )}

        <section>
          <div className="section-label">🗺️ All walks</div>
          {notStarted.map((w) => (
            <WalkCard key={w.id} walk={w} color={WALK_COLORS[(w.id - 1) % WALK_COLORS.length]}
              onClick={() => navigate(`/walk/${w.id}`)} />
          ))}
        </section>
      </div>
    </div>
  );
}
