import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { destinations, destinationWalks, destinationAvailableIds, isPublished } from '../data/destinations';
import { useProgress } from '../hooks/useProgress';
import { WalkCard } from '../components/WalkCard';
import './HomePage.css';

const WALK_COLORS = [
  '#2d6a4f','#1a6ea8','#6d4c41','#6a1f6a','#1565c0',
  '#2e7d32','#c62828','#4527a0','#00695c','#e65100',
  '#1c1f2e','#558b2f','#ad1457','#0277bd','#37474f',
  '#283593','#4e342e','#00838f',
];

export default function DestinationPage() {
  const { destination: slug } = useParams<{ destination: string }>();
  const navigate = useNavigate();
  const { getAllProgress } = useProgress();
  const allProgress = getAllProgress();

  const destination = destinations.find(d => d.slug === slug);
  if (!destination || !isPublished(slug!)) {
    return <Navigate to="/" replace />;
  }

  const walks = destinationWalks[slug!] ?? [];
  const availableIds = destinationAvailableIds[slug!] ?? new Set<number>();

  // If only one walk and it's available, redirect straight to it
  const availableWalks = walks.filter(w => availableIds.has(w.id) && isPublished(slug!, w.id));
  if (availableWalks.length === 1 && walks.length === 1) {
    return <Navigate to={`/${slug}/walk/${availableWalks[0].id}`} replace />;
  }

  const completedWalks = walks.filter(w => {
    const p = allProgress[`${slug}:${w.id}`];
    return p && p.completedStops.length >= w.totalStops;
  });
  const inProgressWalks = walks.filter(w => {
    const p = allProgress[`${slug}:${w.id}`];
    return p && p.completedStops.length > 0 && p.completedStops.length < w.totalStops;
  });
  const notStarted = walks.filter(w => {
    const p = allProgress[`${slug}:${w.id}`];
    return !p || p.completedStops.length === 0;
  });

  const totalMilesWalked = walks.reduce((acc, w) => {
    const p = allProgress[`${slug}:${w.id}`];
    if (!p) return acc;
    return acc + parseFloat(w.distance) * (p.completedStops.length / w.totalStops);
  }, 0);

  return (
    <div className="app-shell">
      <header className="home-header">
        <h1 className="home-header-title">{destination.name}</h1>
        {destination.description && (
          <p className="home-header-sub">{destination.description}</p>
        )}
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-num">{walks.length}</span>
            <span className="home-stat-lbl">Walks</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-num">{completedWalks.length}</span>
            <span className="home-stat-lbl">Done</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-num">{totalMilesWalked.toFixed(1)}</span>
            <span className="home-stat-lbl">Mi walked</span>
          </div>
        </div>
      </header>

      <div className="scroll-area">
        {inProgressWalks.length > 0 && (
          <section>
            <div className="section-label">📍 Continue where you left off</div>
            {inProgressWalks.map((w, i) => (
              <WalkCard
                key={w.id} walk={w} destination={slug!}
                availableIds={availableIds} color={WALK_COLORS[i % WALK_COLORS.length]}
                onClick={() => navigate(`/${slug}/walk/${w.id}`)}
              />
            ))}
          </section>
        )}

        {completedWalks.length > 0 && (
          <section>
            <div className="section-label">✅ Completed</div>
            {completedWalks.map((w, i) => (
              <WalkCard
                key={w.id} walk={w} destination={slug!}
                availableIds={availableIds} color={WALK_COLORS[i % WALK_COLORS.length]}
                onClick={() => navigate(`/${slug}/walk/${w.id}`)}
              />
            ))}
          </section>
        )}

        <section>
          <div className="section-label">🗺️ All walks</div>
          {notStarted.map(w => (
            <WalkCard
              key={w.id} walk={w} destination={slug!}
              availableIds={availableIds} color={WALK_COLORS[(w.id - 1) % WALK_COLORS.length]}
              onClick={() => navigate(`/${slug}/walk/${w.id}`)}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
