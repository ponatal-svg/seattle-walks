import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { walk10 } from '../data/walk10';
import { useProgress } from '../hooks/useProgress';
import AskAI from '../components/AskAI';
import type { Walk, Waypoint } from '../types';
import './WalkPage.css';

// Lazy-load heavy map component so the page renders immediately
const MiniMap = lazy(() => import('../components/MiniMap'));

// Registry of available walks — extend as you add more
const WALKS: Record<number, Walk> = { 10: walk10 };

// ── Helpers ────────────────────────────────────────────
function buildGoogleMapsUrl(waypoints: Waypoint[]): string {
  // Google Maps multi-waypoint walking URL
  const coords = waypoints.map(wp => `${wp.coords.lat},${wp.coords.lng}`);
  const origin      = coords[0];
  const destination = coords[coords.length - 1];
  const middle      = coords.slice(1, -1);
  const wayptsParam = middle.length
    ? `&waypoints=${middle.map(c => encodeURIComponent(c)).join('|')}`
    : '';
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${wayptsParam}&travelmode=walking`;
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
    if (!window.speechSynthesis) return; // API not available
    const utt = new SpeechSynthesisUtterance(text.replace(/\n+/g, ' '));
    utt.rate  = 0.95;
    utt.pitch = 1;
    utt.onend   = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
    setPlaying(true);
  }, [stop]);

  // Stop speech on unmount
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const walkId = Number(id);
  const walk = WALKS[walkId];

  const { getProgress, markStopComplete, setCurrentStop } = useProgress();
  const progress = getProgress(walkId);
  const initialStop = progress?.currentStop ?? 1;
  const [activeId, setActiveId] = useState(initialStop);
  const { playing, play, stop } = useAudio();

  // ── Guard: unknown walk ────────────────────────────────
  if (!walk) {
    return (
      <div className="app-shell walk-page">
        <div className="error-banner">
          ⚠️ Walk #{walkId} not found. Only Walk 10 is available in this release.
          <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
            ← Back to walks
          </button>
        </div>
      </div>
    );
  }

  const waypoint = walk.waypoints[activeId - 1];
  const completedStops = progress?.completedStops ?? [];
  const progressPct = Math.round((completedStops.length / walk.totalStops) * 100);

  // ── Navigation ─────────────────────────────────────────
  const goTo = useCallback((newId: number) => {
    stop();
    setActiveId(newId);
    setCurrentStop(walkId, newId);
  }, [stop, walkId, setCurrentStop]);

  const handleNext = () => {
    markStopComplete(walkId, activeId, walk.totalStops);
    if (activeId < walk.totalStops) goTo(activeId + 1);
  };

  const handlePrev = () => {
    if (activeId > 1) goTo(activeId - 1);
  };

  // ── Audio ──────────────────────────────────────────────
  const toggleAudio = () => {
    if (playing) stop();
    else play(waypoint.content);
  };

  // ── Maps URLs ──────────────────────────────────────────
  const openFullRoute = () => window.open(buildGoogleMapsUrl(walk.waypoints), '_blank');
  const openNavToStop = () => window.open(buildNavUrl(waypoint), '_blank');

  return (
    <div className="app-shell walk-page">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="walk-header">
        <div className="walk-header-top">
          <button className="walk-back-btn" onClick={() => { stop(); navigate('/'); }} aria-label="Back to walks">
            ‹ All Walks
          </button>
          <button className="walk-maps-btn btn btn-blue" onClick={openFullRoute} aria-label="Open full route in Google Maps">
            🗺️ Full Route
          </button>
        </div>
        <h2 className="walk-title">{walk.title}</h2>
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

      {/* ── Mini Map ─────────────────────────────────────── */}
      <Suspense fallback={
        <div className="mini-map-placeholder">
          <div className="loading-spinner" />
        </div>
      }>
        <MiniMap waypoints={walk.waypoints} activeId={activeId} />
      </Suspense>

      {/* ── Scrollable Content ──────────────────────────── */}
      <div className="scroll-area walk-body" key={activeId}>
        <div className="walk-stop-header fade-in">
          <div className="walk-stop-num">{activeId}</div>
          <div>
            <h3 className="walk-stop-title">{waypoint.title}</h3>
            <p className="walk-stop-location">📍 {waypoint.location}</p>
          </div>
        </div>

        {/* Navigate to this stop */}
        <button className="nav-chip" onClick={openNavToStop} aria-label={`Navigate to stop ${activeId} in Google Maps`}>
          <span>🧭</span>
          <span>Navigate to Stop {activeId} in Google Maps</span>
          <span className="nav-chip-arrow">↗</span>
        </button>

        {/* Book content */}
        <div className="card content-card fade-in">
          <div className="content-card-label">📖 From the Book</div>
          <div className="content-body">
            {waypoint.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Audio */}
        <AudioBar playing={playing} onToggle={toggleAudio} />

        {/* Gemini Q&A */}
        <AskAI waypoint={waypoint} walkTitle={walk.title} />

        <div style={{ height: 16 }} />
      </div>

      {/* ── Bottom Nav ────────────────────────────────── */}
      <nav className="walk-bottom-nav" aria-label="Stop navigation">
        <button
          className="btn btn-secondary walk-nav-btn"
          onClick={handlePrev}
          disabled={activeId === 1}
          aria-label="Previous stop"
        >
          ← Prev
        </button>
        <button
          className="walk-route-btn"
          onClick={openFullRoute}
          aria-label="Open full route in Google Maps"
          title="Open full route in Google Maps"
        >
          🗺️
        </button>
        <button
          className={`btn walk-nav-btn ${activeId === walk.totalStops ? 'btn-primary' : 'btn-primary'}`}
          onClick={handleNext}
          aria-label={activeId === walk.totalStops ? 'Finish walk' : 'Next stop'}
        >
          {activeId === walk.totalStops ? '🎉 Finish' : 'Next →'}
        </button>
      </nav>
    </div>
  );
}
