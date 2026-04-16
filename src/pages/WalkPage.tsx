import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { walk1 } from '../data/walk1';
import { walk3 } from '../data/walk3';
import { walk4 } from '../data/walk4';
import { walk10 } from '../data/walk10';
import { walk12 } from '../data/walk12';
import { walk15 } from '../data/walk15';
import { walk18 } from '../data/walk18';
import { walk as sfWalk1 } from '../data/santaFe/walk1';
import { destinationWalks } from '../data/destinations';
import { useProgress } from '../hooks/useProgress';
import AskAI from '../components/AskAI';
import type { Walk, Waypoint } from '../types';
import './WalkPage.css';

// Lazy-load heavy map component so the page renders immediately
const MiniMap = lazy(() => import('../components/MiniMap'));

// Registry of available walks per destination
const WALKS: Record<string, Record<number, Walk>> = {
  'seattle': { 1: walk1, 3: walk3, 4: walk4, 10: walk10, 12: walk12, 15: walk15, 18: walk18 },
  'santa-fe': { 1: sfWalk1 },
};

// ── Helpers ────────────────────────────────────────────

/**
 * Google Maps Directions API allows max 8 intermediate waypoints (10 total).
 * For longer walks we split into overlapping chunks, each ≤ 10 points.
 * Returns an array of URLs (usually 1; 2+ for walks with >10 stops).
 */
const MAX_GMAPS_INTERMEDIATE = 8;

function buildGoogleMapsUrls(waypoints: Waypoint[]): string[] {
  const coords = waypoints.map(wp => `${wp.coords.lat},${wp.coords.lng}`);
  const urls: string[] = [];
  const step = MAX_GMAPS_INTERMEDIATE + 1;

  for (let i = 0; i < coords.length - 1; i += step) {
    const chunk = coords.slice(i, i + step + 1);
    const origin      = chunk[0];
    const destination = chunk[chunk.length - 1];
    const middle      = chunk.slice(1, -1);
    const wayptsParam = middle.length
      ? `&waypoints=${middle.map(c => encodeURIComponent(c)).join('|')}`
      : '';
    urls.push(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${wayptsParam}&travelmode=walking`,
    );
  }
  return urls;
}

function buildNavUrl(waypoint: Waypoint): string {
  const { lat, lng } = waypoint.coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

// ── Audio hook ─────────────────────────────────────────
function useAudio() {
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  const play = useCallback((text: string) => {
    stop();
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text.replace(/\n+/g, ' '));
    utt.rate  = 0.95;
    utt.pitch = 1;
    utt.onend   = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
    setPlaying(true);
  }, [stop]);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { playing, play, stop };
}

// ── WaveBar animation ──────────────────────────────────
const WAVE_HEIGHTS = [14, 20, 28, 22, 32, 18, 26, 30, 16, 24, 34, 20, 28, 22, 18];

function AudioBar({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const [heights, setHeights] = useState(WAVE_HEIGHTS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setHeights(WAVE_HEIGHTS.map(h => Math.max(4, h + (Math.random() * 14 - 7))));
      }, 120);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setHeights(WAVE_HEIGHTS);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  return (
    <div className="audio-bar card">
      <div className="audio-bar-label">🎧 Audio Guide</div>
      <div className="audio-controls">
        <button
          className={`audio-play-btn${playing ? ' audio-play-btn--stop' : ''}`}
          onClick={onToggle}
          aria-label={playing ? 'Stop audio' : 'Play audio'}
        >
          {playing ? '■' : '▶'}
        </button>
        <div className="audio-waveform" aria-hidden="true">
          {heights.map((h, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                height: h,
                background: playing ? '#52b788' : 'var(--green-bg)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────
export default function WalkPage() {
  const { destination = 'seattle', id } = useParams<{ destination: string; id: string }>();
  const navigate = useNavigate();
  const walkId = Number(id);
  const walk = WALKS[destination]?.[walkId];
  const hasMultipleWalks = (destinationWalks[destination]?.length ?? 0) > 1;

  const { getProgress, markStopComplete, setCurrentStop } = useProgress();
  const progress = getProgress(destination, walkId);
  const hasIntro = !!(walk?.introduction || walk?.mapImage);
  const initialStop = progress?.currentStop ?? (hasIntro ? 0 : 1);
  const [activeId, setActiveId] = useState(initialStop);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const { playing, play, stop } = useAudio();

  // ── Guard: unknown walk ────────────────────────────────
  if (!walk) {
    const walksForDest = destinationWalks[destination] ?? [];
    const meta = walksForDest.find(w => w.id === walkId);
    return (
      <div className="app-shell walk-page">
        <header className="walk-header">
          <div className="walk-header-top">
            {hasMultipleWalks && (
              <button className="walk-back-btn" onClick={() => navigate(`/${destination}`)} aria-label="Back to walks">
                ‹ All Walks
              </button>
            )}
          </div>
          {meta && <h2 className="walk-title">{meta.title}</h2>}
          {meta && <p className="walk-meta">Walk {meta.id} · {meta.distance} · {meta.totalStops} stops</p>}
        </header>
        <div className="scroll-area walk-body">
          <div className="card intro-text-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚧</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Coming Soon</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              This walk hasn't been added yet. Check back for updates!
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isIntroPage = activeId === 0;
  const waypoint = isIntroPage ? null : walk.waypoints[activeId - 1];
  const completedStops = progress?.completedStops ?? [];
  const progressPct = Math.round((completedStops.length / walk.totalStops) * 100);
  const routeUrls = walk.mapUrls ?? buildGoogleMapsUrls(walk.waypoints);

  // ── Navigation ─────────────────────────────────────────
  const goTo = useCallback((newId: number) => {
    stop();
    setActiveId(newId);
    setCurrentStop(destination, walkId, newId);
  }, [stop, destination, walkId, setCurrentStop]);

  const handleNext = () => {
    if (isIntroPage) { goTo(1); return; }
    markStopComplete(destination, walkId, activeId, walk.totalStops);
    if (activeId < walk.totalStops) goTo(activeId + 1);
  };

  const handlePrev = () => {
    if (activeId === 1 && hasIntro) { goTo(0); return; }
    if (activeId > 1) goTo(activeId - 1);
  };

  // ── Audio ──────────────────────────────────────────────
  const toggleAudio = () => {
    if (!waypoint) return;
    if (playing) stop();
    else play(waypoint.content);
  };

  return (
    <div className="app-shell walk-page">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="walk-header">
        <div className="walk-header-top">
          {hasMultipleWalks && (
            <button className="walk-back-btn" onClick={() => { stop(); navigate(`/${destination}`); }} aria-label="Back to walks">
              ‹ All Walks
            </button>
          )}

          {routeUrls.length === 1 ? (
            <a
              className="walk-maps-btn btn btn-blue"
              href={routeUrls[0]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open full route in Google Maps"
            >
              🗺️ Full Route
            </a>
          ) : (
            <div className="walk-route-split">
              {routeUrls.map((url, i) => (
                <a
                  key={i}
                  className="walk-maps-btn btn btn-blue"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open full route part ${i + 1} in Google Maps`}
                >
                  🗺️ {i + 1}/{routeUrls.length}
                </a>
              ))}
            </div>
          )}
        </div>

        <h2 className="walk-title">{walk.title}</h2>
        {walk.reversed && (
          <div className="walk-reversed-badge">⭐ Reversed Route</div>
        )}
        <p className="walk-meta">Walk {walk.id} · {walk.distance} · {walk.totalStops} stops</p>
        <div className="progress-track" style={{ marginTop: 10 }}>
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPct}% complete`}
          />
        </div>
        <div className="walk-progress-label">
          <span>{completedStops.length} of {walk.totalStops} stops completed</span>
          <span>{progressPct}%</span>
        </div>
      </header>

      {/* ── Map or stop photo ────────────────────────────── */}
      {!isIntroPage && waypoint?.image ? (
        <div className="stop-hero-wrap">
          <img
            src={waypoint.image}
            alt={waypoint.title}
            className="stop-hero-img"
          />
        </div>
      ) : !walk.waypoints.every(wp => wp.image) ? (
        <Suspense fallback={
          <div className="mini-map-placeholder">
            <div className="loading-spinner" />
          </div>
        }>
          <MiniMap waypoints={walk.waypoints} activeId={activeId} />
        </Suspense>
      ) : null}

      {/* ── Fullscreen map overlay ───────────────────────── */}
      {mapFullscreen && walk.mapImage && (
        <div className="map-fullscreen-overlay" onClick={() => setMapFullscreen(false)}>
          <button className="map-fullscreen-close" aria-label="Close fullscreen map">✕</button>
          <img src={walk.mapImage} alt={`Route map for ${walk.title}`} className="map-fullscreen-img" />
        </div>
      )}

      {/* ── Scrollable Content ──────────────────────────── */}
      <div className="scroll-area walk-body" key={activeId}>

        {/* ── Intro page (page 0) ── */}
        {isIntroPage ? (
          <div className="intro-page fade-in">
            {walk.mapImage && (
              <div className="intro-map-wrap" onClick={() => setMapFullscreen(true)} role="button" aria-label="Tap to view full map">
                <img src={walk.mapImage} alt={`Route map for ${walk.title}`} className="intro-map-img" />
                <div className="intro-map-hint">Tap to expand</div>
              </div>
            )}
            {walk.introduction && (
              <div className="card intro-text-card">
                {walk.introduction.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="walk-stop-header fade-in">
              <div className="walk-stop-num">{activeId}</div>
              <div>
                <h3 className="walk-stop-title">{waypoint!.title}</h3>
                <p className="walk-stop-location">📍 {waypoint!.location}</p>
              </div>
            </div>

            {/* Navigate to this stop */}
            <a
              className="nav-chip"
              href={buildNavUrl(waypoint!)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Navigate to stop ${activeId} in Google Maps`}
            >
              <span>🧭</span>
              <span>Navigate to Stop {activeId} in Google Maps</span>
              <span className="nav-chip-arrow">↗</span>
            </a>

            {/* Narrative content */}
            <div className="card content-card fade-in">
              <div className="content-body">
                {waypoint!.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Audio */}
            <AudioBar playing={playing} onToggle={toggleAudio} />

            {/* Gemini Q&A */}
            <AskAI waypoint={waypoint!} walkTitle={walk.title} />

            <div style={{ height: 16 }} />
          </>
        )}
      </div>

      {/* ── Bottom Nav ────────────────────────────────── */}
      <nav className="walk-bottom-nav" aria-label="Stop navigation">
        {!isIntroPage && !(activeId === 1 && !hasIntro) && (
          <button
            className="btn btn-secondary walk-nav-btn"
            onClick={handlePrev}
            aria-label="Previous stop"
          >
            ← Prev
          </button>
        )}
        {(isIntroPage || (activeId === 1 && !hasIntro)) && (
          <div className="walk-nav-btn" />
        )}
        <a
          className="walk-route-btn"
          href={routeUrls[0]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full route in Google Maps"
          title={routeUrls.length > 1 ? `Full route (part 1 of ${routeUrls.length})` : 'Open full route in Google Maps'}
        >
          🗺️
        </a>
        <button
          className="btn btn-primary walk-nav-btn"
          onClick={handleNext}
          aria-label={isIntroPage ? 'Start walk' : activeId === walk.totalStops ? 'Finish walk' : 'Next stop'}
        >
          {isIntroPage ? 'Start Walk →' : activeId === walk.totalStops ? '🎉 Finish' : 'Next →'}
        </button>
      </nav>
    </div>
  );
}
