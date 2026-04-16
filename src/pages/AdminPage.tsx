import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinations, destinationWalks, destinationAvailableIds, loadAdminState, saveAdminState } from '../data/destinations';
import './AdminPage.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const [adminState, setAdminState] = useState(loadAdminState);

  const toggleDestination = (slug: string, currentValue: boolean) => {
    const next = { ...adminState, destinations: { ...adminState.destinations, [slug]: !currentValue } };
    setAdminState(next);
    saveAdminState(next);
  };

  const toggleWalk = (destinationSlug: string, walkId: number, currentValue: boolean) => {
    const walkKey = `${destinationSlug}:${walkId}`;
    const next = { ...adminState, walks: { ...adminState.walks, [walkKey]: !currentValue } };
    setAdminState(next);
    saveAdminState(next);
  };

  const isDestPublished = (slug: string): boolean => {
    if (slug in adminState.destinations) return adminState.destinations[slug];
    return destinations.find(d => d.slug === slug)?.published ?? false;
  };

  const isWalkPublished = (destinationSlug: string, walkId: number): boolean => {
    const walkKey = `${destinationSlug}:${walkId}`;
    if (walkKey in adminState.walks) return adminState.walks[walkKey];
    return true; // walks default to published if destination is published
  };

  return (
    <div className="app-shell admin-page">
      <header className="admin-header">
        <button className="admin-back-btn" onClick={() => navigate('/')} aria-label="Back">
          ‹ Home
        </button>
        <h1 className="admin-title">Admin</h1>
        <p className="admin-sub">Manage destinations & walks</p>
      </header>

      <div className="scroll-area admin-body">
        {destinations.map(dest => {
          const walks = destinationWalks[dest.slug] ?? [];
          const availableIds = destinationAvailableIds[dest.slug] ?? new Set();
          const destPublished = isDestPublished(dest.slug);

          return (
            <section key={dest.id} className="admin-section">
              <div className="admin-dest-row">
                <div className="admin-dest-info">
                  <span className="admin-dest-name">{dest.name}</span>
                  <span className="admin-dest-count">{walks.length} walks · {availableIds.size} available</span>
                </div>
                <label className="admin-toggle" aria-label={`${destPublished ? 'Unpublish' : 'Publish'} ${dest.name}`}>
                  <input
                    type="checkbox"
                    checked={destPublished}
                    onChange={() => toggleDestination(dest.slug, destPublished)}
                  />
                  <span className="admin-toggle-slider" />
                </label>
              </div>

              <div className="admin-walks-list">
                {walks.map(walk => {
                  const available = availableIds.has(walk.id);
                  const walkPublished = isWalkPublished(dest.slug, walk.id);
                  return (
                    <div key={walk.id} className="admin-walk-row">
                      <div className="admin-walk-info">
                        <span className="admin-walk-title">{walk.title}</span>
                        <div className="admin-walk-meta">
                          <span className="chip chip-blue">{walk.distance}</span>
                          {available
                            ? <span className="chip chip-green">Available</span>
                            : <span className="chip" style={{ background: '#f3f4f6', color: '#9ca3af' }}>Coming soon</span>
                          }
                        </div>
                      </div>
                      <label className="admin-toggle admin-toggle--sm" aria-label={`${walkPublished ? 'Hide' : 'Show'} ${walk.title}`}>
                        <input
                          type="checkbox"
                          checked={walkPublished}
                          onChange={() => toggleWalk(dest.slug, walk.id, walkPublished)}
                        />
                        <span className="admin-toggle-slider" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
