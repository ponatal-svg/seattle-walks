import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import type { Waypoint } from '../types';
import './MiniMap.css';

interface Props {
  waypoints: Waypoint[];
  activeId: number;
}

// Configure loader once at module level
setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  v: 'weekly',
});

const MAP_STYLES = [
  { elementType: 'geometry',          stylers: [{ color: '#f0f4f0' }] },
  { elementType: 'labels.text.fill',  stylers: [{ color: '#6b7280' }] },
  { featureType: 'road',              elementType: 'geometry',        stylers: [{ color: '#ffffff' }] },
  { featureType: 'road',              elementType: 'geometry.stroke', stylers: [{ color: '#e5e7eb' }] },
  { featureType: 'road.arterial',     elementType: 'labels.text',     stylers: [{ visibility: 'off' }] },
  { featureType: 'road.local',        elementType: 'labels',          stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',           stylers: [{ visibility: 'off' }] },
  { featureType: 'poi',               stylers: [{ visibility: 'off' }] },
  { featureType: 'park',              elementType: 'geometry',        stylers: [{ color: '#d4edda' }] },
  { featureType: 'water',             elementType: 'geometry',        stylers: [{ color: '#b3d9f0' }] },
  { featureType: 'landscape.natural', elementType: 'geometry',        stylers: [{ color: '#e8f5e9' }] },
];

type MapStatus = 'loading' | 'ready' | 'error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMaps = any;

export default function MiniMap({ waypoints, activeId }: Props) {
  // containerRef is always rendered in the DOM so the Maps SDK can attach to it
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<GMaps>(null);
  const markersRef   = useRef<GMaps[]>([]);
  const polylineRef  = useRef<GMaps>(null);
  const mapsApiRef   = useRef<GMaps>(null);
  const [status, setStatus] = useState<MapStatus>('loading');
  const [retryKey, setRetryKey] = useState(0);
  const MAX_RETRIES = 2;
  const retryCount  = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [mapsLib, markerLib] = await Promise.all([
          importLibrary('maps'),
          importLibrary('marker'),
        ]);
        if (cancelled || !containerRef.current) return;

        mapsApiRef.current = mapsLib;
        const { Map, Polyline } = mapsLib;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { Marker } = markerLib as any;

        const isOverview = activeId === 0;
        const active = waypoints[Math.max(activeId - 1, 0)];
        const map = new Map(containerRef.current, {
          center: active.coords,
          zoom: 14,
          disableDefaultUI: true,
          gestureHandling: 'none',
          clickableIcons: false,
          styles: MAP_STYLES,
        });
        mapRef.current = map;

        // On overview (intro page), fit the map to show all waypoints
        if (isOverview) {
          const { LatLngBounds } = await importLibrary('core') as GMaps;
          const bounds = new LatLngBounds();
          waypoints.forEach(wp => bounds.extend(wp.coords));
          map.fitBounds(bounds, 24);
        }

        polylineRef.current = new Polyline({
          path: waypoints.map(wp => wp.coords),
          geodesic: true,
          strokeColor: '#e53935',
          strokeOpacity: 0.85,
          strokeWeight: 3.5,
          map,
        });

        const lastId = waypoints[waypoints.length - 1].id;
        markersRef.current = waypoints.map(wp => {
          const isDone   = wp.id < activeId;
          const isActive = wp.id === activeId;

          if (isOverview) {
            const isStart = wp.id === 1;
            const isEnd   = wp.id === lastId;
            return new Marker({
              position: wp.coords,
              map,
              title: wp.title,
              label: isStart
                ? { text: 'S', color: 'white', fontWeight: 'bold', fontSize: '10px' }
                : isEnd
                  ? { text: 'E', color: 'white', fontWeight: 'bold', fontSize: '10px' }
                  : undefined,
              icon: {
                path: 0,
                scale: isStart || isEnd ? 9 : 4,
                fillColor:   isStart ? '#52b788' : isEnd ? '#e53935' : '#6b7280',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: isStart || isEnd ? 2 : 1.5,
              },
              zIndex: isStart || isEnd ? 10 : 1,
            });
          }

          return new Marker({
            position: wp.coords,
            map,
            title: wp.title,
            label: { text: String(wp.id), color: 'white', fontWeight: 'bold', fontSize: isActive ? '11px' : '9px' },
            icon: {
              path: 0,
              scale: isActive ? 13 : 8,
              fillColor:    isActive ? '#e53935' : isDone ? '#52b788' : '#9ca3af',
              fillOpacity: 1, strokeColor: 'white', strokeWeight: 2,
            },
            zIndex: isActive ? 10 : 1,
          });
        });

        setStatus('ready');
      } catch (err) {
        console.error('[MiniMap] init error:', err);
        if (!cancelled) setStatus('error');
      }
    }

    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  // Update markers when activeId changes
  useEffect(() => {
    if (!mapRef.current || markersRef.current.length === 0) return;
    markersRef.current.forEach((marker, i) => {
      const wp       = waypoints[i];
      const isDone   = wp.id < activeId;
      const isActive = wp.id === activeId;
      marker.setIcon({
        path: 0,
        scale: isActive ? 13 : 8,
        fillColor:    isActive ? '#e53935' : isDone ? '#52b788' : '#9ca3af',
        fillOpacity: 1, strokeColor: 'white', strokeWeight: 2,
      });
      marker.setLabel({ text: String(wp.id), color: 'white', fontWeight: 'bold', fontSize: isActive ? '11px' : '9px' });
      marker.setZIndex(isActive ? 10 : 1);
    });
    if (activeId > 0) mapRef.current.panTo(waypoints[activeId - 1].coords);
  }, [activeId, waypoints]);

  function handleRetry() {
    if (retryCount.current >= MAX_RETRIES) return;
    retryCount.current += 1;
    mapRef.current     = null;
    markersRef.current = [];
    setStatus('loading');
    setRetryKey(k => k + 1);
  }

  // Always render the map container so containerRef.current is set before
  // the async init() completes. Loading and error overlays sit on top.
  return (
    <div className="mini-map" style={{ position: 'relative' }}>
      {/* Map container — always in the DOM */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} data-testid="mini-map" />

      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="mini-map--overlay mini-map--placeholder">
          <div className="loading-spinner" />
          <span>Loading map…</span>
        </div>
      )}

      {/* Error overlay */}
      {status === 'error' && (
        <div className="mini-map--overlay mini-map--placeholder">
          <span className="mini-map-error-icon">🗺️</span>
          <span className="mini-map-error-text">Map unavailable</span>
          {retryCount.current < MAX_RETRIES && (
            <button className="btn btn-secondary mini-map-retry" onClick={handleRetry}>
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
