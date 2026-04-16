import { useNavigate } from 'react-router-dom';
import { publishedDestinations, destinationWalks, destinationAvailableIds } from '../data/destinations';
import { useProgress } from '../hooks/useProgress';
import type { Destination } from '../types';
import './HomePage.css';

const COUNTRY_FLAG: Record<string, string> = {
  US: '🇺🇸',
  IL: '🇮🇱',
};

function DestinationCard({ destination, onClick }: { destination: Destination; onClick: () => void }) {
  const { getAllProgress } = useProgress();
  const allProgress = getAllProgress();
  const walks = destinationWalks[destination.slug] ?? [];
  const availableIds = destinationAvailableIds[destination.slug] ?? new Set();

  const completedCount = walks.filter(w => {
    const p = allProgress[`${destination.slug}:${w.id}`];
    return p && p.completedStops.length >= w.totalStops;
  }).length;

  const totalMiles = walks.reduce((acc, w) => {
    const p = allProgress[`${destination.slug}:${w.id}`];
    if (!p) return acc;
    return acc + parseFloat(w.distance) * (p.completedStops.length / w.totalStops);
  }, 0);

  return (
    <button className="dest-card" onClick={onClick} aria-label={`Explore ${destination.name}`}>
      <div className="dest-card-flag">{COUNTRY_FLAG[destination.country] ?? '🌍'}</div>
      <div className="dest-card-body">
        <div className="dest-card-name">{destination.name}</div>
        {destination.description && (
          <div className="dest-card-desc">{destination.description}</div>
        )}
        <div className="dest-card-chips">
          <span className="chip chip-blue">{availableIds.size}/{walks.length} walks</span>
          {completedCount > 0 && (
            <span className="chip chip-green">{completedCount} done</span>
          )}
          {totalMiles > 0 && (
            <span className="chip chip-amber">{totalMiles.toFixed(1)} mi walked</span>
          )}
        </div>
      </div>
      <div className="dest-card-chevron">›</div>
    </button>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const destinations = publishedDestinations();

  return (
    <div className="app-shell">
      <header className="home-header">
        <div className="home-header-eyebrow">Walking Tours</div>
        <h1 className="home-header-title">Walker</h1>
        <p className="home-header-sub">Explore cities on foot, one story at a time</p>
      </header>

      <div className="scroll-area">
        <div className="section-label">🌍 Destinations</div>
        {destinations.map(dest => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onClick={() => navigate(`/${dest.slug}`)}
          />
        ))}
      </div>
    </div>
  );
}
