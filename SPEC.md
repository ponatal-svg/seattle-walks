# Seattle Walks — Complete Project Specification

> **Purpose of this file:** give a Claude (or other) agent enough context to rebuild this project from scratch, including every architectural decision, known pitfall, and lesson learned.

---

## 1. What the App Is

A **mobile-first Progressive Web App (PWA)** companion to the book *Seattle Walks* by David B. Williams (Mountaineers Books). The book contains 18 guided urban walks around Seattle, each with historical and natural-history commentary at numbered stops.

The app provides, for each stop:
- A **Google Map** showing all waypoints with a route polyline and highlighted current stop
- **Text-to-speech audio** reading the book content aloud (free, no API key needed)
- **Gemini AI Q&A** letting the walker ask questions about the stop
- **Progress tracking** persisted in localStorage (resume where you left off)
- A **"Navigate to this stop"** button opening Google Maps turn-by-turn navigation
- A **"Full Route"** button opening the entire walk in Google Maps

The app is installable on iPhone/Android via "Add to Home Screen" and works offline (no service worker yet, but PWA manifest is present).

**Live URL:** https://seattle-walks.vercel.app
**GitHub:** https://github.com/ponatal-svg/seattle-walks

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 19 + TypeScript | Component model, strong typing |
| Build | Vite 8 | Fast HMR, native ESM, easy PWA |
| Routing | React Router v7 (`BrowserRouter`) | Two routes: `/` and `/walk/:id` |
| Maps | `@googlemaps/js-api-loader` v2.x | Official Google Maps JS SDK loader |
| TTS | Web Speech API (`SpeechSynthesisUtterance`) | Free, no API key, works on phone |
| AI Q&A | Gemini REST API (`gemini-2.5-flash`) | Free tier, good quality, no SDK needed |
| Testing | Vitest + @testing-library/react + jsdom | Fast, first-class Vite integration |
| Deploy | Vercel (auto-deploy on git push) | Zero-config for Vite, free tier |
| CSS | Plain CSS files per component | No Tailwind, no CSS-in-JS complexity |

---

## 3. Repository Structure

```
Walker/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.tsx               # Entry point, mounts <App />
│   ├── App.tsx                # Router setup (two routes)
│   ├── types.ts               # Shared TypeScript interfaces
│   ├── index.css              # Global styles, CSS variables, typography
│   ├── App.css                # App-level shell styles
│   ├── data/
│   │   ├── walk10.ts          # Walk 10 data (only implemented walk)
│   │   └── walksIndex.ts      # Stub metadata for all 18 walks
│   ├── hooks/
│   │   └── useProgress.ts     # localStorage progress hook
│   ├── components/
│   │   ├── AskAI.tsx + .css   # Gemini Q&A chat widget
│   │   └── MiniMap.tsx + .css # Google Maps thumbnail
│   ├── pages/
│   │   ├── HomePage.tsx + .css
│   │   └── WalkPage.tsx + .css
│   └── test/
│       ├── setup.ts            # Global mock setup (jsdom)
│       ├── walk10.test.ts      # Data integrity tests
│       ├── useProgress.test.ts # Hook tests
│       ├── MiniMap.test.tsx    # 11 tests covering load/error/retry/update
│       ├── AskAI.test.tsx      # 12 tests incl. request-body validation
│       ├── WalkPage.test.tsx   # Page rendering + maps URLs + navigation
│       └── HomePage.test.tsx   # Card rendering, progress display, navigation
├── vite.config.ts             # Vite + Vitest config with coverage thresholds
├── index.html
├── package.json
└── .env.local                 # NOT committed — see Section 6
```

---

## 4. TypeScript Interfaces (`src/types.ts`)

```typescript
interface Coords { lat: number; lng: number; }

interface Waypoint {
  id: number;           // 1-based, matches stop number in the book
  title: string;        // e.g. "WPA Bridge · 1936"
  location: string;     // human-readable location hint
  coords: Coords;
  content: string;      // verbatim book text (multi-paragraph, use \n\n)
}

type Difficulty = 'easy' | 'moderate' | 'strenuous';

interface WalkMeta {
  id: number;
  title: string;        // e.g. "Union Bay → Green Lake"
  subtitle: string;     // e.g. "Tracing a Historic Creek"
  distance: string;     // e.g. "4.7 mi"
  difficulty: Difficulty;
  startPoint: string;
  endPoint: string;
  totalStops: number;
  reversed?: boolean;   // true if walk runs opposite to book's original order
}

interface Walk extends WalkMeta { waypoints: Waypoint[]; }

interface WalkProgress {
  walkId: number;
  completedStops: number[];  // waypoint ids that have been completed
  currentStop: number;
}
```

---

## 5. Data Layer

### `src/data/walk10.ts`
- Contains **15 waypoints** for Walk 10 (*Union Bay → Green Lake*, reversed from book's original Green Lake → Union Bay order)
- `reversed: true` on the walk object; badge shown in UI
- All `content` fields are **verbatim text from pages 151–164** of the book, entered as TypeScript template literals to cleanly handle embedded quotes
- `startPoint`: `'E Stevens Way NE, UW Campus (Metro Route 45)'`
- `endPoint`: `'East side of Green Lake, near community center/Evans Pool'`
- Waypoints are in **reverse book order** (Stop 1 = UW bus stop, Stop 15 = Green Lake)

### `src/data/walksIndex.ts`
Exports an array of `WalkMeta` for all 18 walks (stub data for walks 1–9, 11–18; only Walk 10 has a full `Walk` data file). Used by `HomePage` to show the complete list.

### Adding a new walk
1. Create `src/data/walkN.ts` following the same structure as `walk10.ts`
2. Add the import and entry to `WALKS` in `WalkPage.tsx`: `const WALKS: Record<number, Walk> = { 10: walk10, N: walkN };`
3. Update `walksIndex.ts` with correct metadata
4. Add data integrity tests in `src/test/walkN.test.ts`

---

## 6. Environment Variables

```
VITE_GOOGLE_MAPS_API_KEY=...   # Google Maps JavaScript API key
VITE_GEMINI_API_KEY=...        # Google AI Studio key (gemini-2.5-flash)
```

**Local:** `.env.local` (gitignored)
**Production:** set in Vercel dashboard → Project Settings → Environment Variables

> ⚠️ Because Vite bakes `VITE_*` vars into the JS bundle, they are visible to anyone who downloads the page. Restrict the Maps key to your Vercel domain in the Google Cloud Console to prevent abuse.

---

## 7. Component Details

### `HomePage`
- Lists all 18 walks in three sections: **In Progress** / **Completed** / **All Walks**
- Each `WalkCard` shows: walk number badge (coloured by state), title, subtitle, distance chip, difficulty chip, `⭐ Reversed` chip (when `reversed: true`), progress ring (SVG) or Done checkmark
- Header stat row: total walks (18), completed count, total miles walked (pro-rated by progress)

### `WalkPage`
- Loaded via `/walk/:id`; looks up walk in `WALKS` registry; shows error state if not found
- **Header:** back button, Full Route button(s), title, `⭐ Reversed Route` badge, distance/stops meta, progress bar
- **MiniMap** (lazy-loaded via `React.lazy` + `Suspense`)
- **Stop content area:** stop number badge, title, location, Navigate chip, book text card, AudioBar, AskAI
- **Bottom nav:** Prev / map icon / Next (becomes "🎉 Finish" on last stop)
- Progress is persisted on every Next tap; current stop is restored on re-open

#### Google Maps URL builder
```typescript
const MAX_GMAPS_INTERMEDIATE = 8;  // Google Maps API limit

function buildGoogleMapsUrls(waypoints: Waypoint[]): string[] {
  // Split walks with >10 stops into overlapping chunks of ≤10 points each
  // Returns array of 1 URL (≤10 stops) or 2+ URLs (>10 stops)
  // Each URL uses: /maps/dir/?api=1&origin=...&destination=...&waypoints=...&travelmode=walking
}
```
**Critical:** Google Maps silently truncates >8 intermediate waypoints with no error. The split produces e.g. 2 buttons "🗺️ 1/2" and "🗺️ 2/2" in the header.

#### `useAudio` hook (internal to WalkPage)
- Wraps `window.speechSynthesis` + `SpeechSynthesisUtterance`
- `rate: 0.95`, `pitch: 1`
- Strips `\n+` from content before speaking
- Cancels on unmount and on stop navigation

#### `AudioBar` component (internal to WalkPage)
- Animated waveform using 15 bars with random height updates every 120ms while playing
- Shows ▶ / ■ toggle button

### `MiniMap`
**Architecture (important):** The map container `<div ref={containerRef}>` must **always be in the DOM**, even during loading/error states. The Google Maps SDK attaches to the DOM node synchronously when `new Map(el, ...)` is called; if the element doesn't exist yet (because you conditionally render it), `containerRef.current` is null and the map never initialises.

Solution: render the container div unconditionally, then place loading/error overlays **on top** using `position: absolute; inset: 0`.

```
status='loading' → container in DOM + loading overlay on top
status='ready'   → container in DOM, map attached, no overlay
status='error'   → container in DOM + error overlay on top
```

- Retry logic: max 2 retries, triggered by `retryKey` state increment
- Active marker: larger (scale 13), red; completed markers: green (scale 8); upcoming: grey (scale 8)
- Map `panTo` on activeId change; polyline drawn once on init
- `gestureHandling: 'none'` — thumbnail is not interactive

### `AskAI`
- Suggestion chips (hidden after first message): "Tell me more about this spot", "What can I see from here?", "What was here 100 years ago?"
- System context includes: stop id, stop title, location, walk title, full book content for the stop
- `maxOutputTokens: 1024` — **never reduce below 512** or responses truncate mid-sentence with no API error
- Retries: 429 and 503 retried up to 2 times with 1.2s × attempt delay
- 15-second `AbortSignal.timeout` on fetch
- API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

### `useProgress`
- All state in `localStorage` under key `'seattle-walks-progress'`
- Schema: `Record<walkId, WalkProgress>` serialised as JSON
- Handles localStorage unavailability (private browsing, quota) silently

---

## 8. Testing

### Coverage thresholds (enforced by Vitest)
| Metric | Threshold | Actual |
|--------|-----------|--------|
| Statements | 85% | 95% |
| Functions | 85% | 92% |
| Branches | 80% | 91% |
| Lines | 85% | 98% |

### Key mocking patterns (`src/test/setup.ts`)

**Google Maps** — the `@googlemaps/js-api-loader` v2.x API does NOT have a `Loader` class; it exports `setOptions` and `importLibrary` as named functions:
```typescript
vi.mock('@googlemaps/js-api-loader', () => ({
  setOptions: vi.fn(),
  importLibrary: vi.fn().mockResolvedValue({
    Map: vi.fn().mockImplementation(function(this: any) {
      this.panTo = vi.fn(); this.setCenter = vi.fn();
    }),
    Marker: vi.fn().mockImplementation(function(this: any) {
      this.setIcon = vi.fn(); this.setLabel = vi.fn();
      this.setZIndex = vi.fn(); this.setMap = vi.fn();
    }),
    Polyline: vi.fn().mockImplementation(function(this: any) {
      this.setMap = vi.fn();
    }),
    SymbolPath: { CIRCLE: 0 },
  }),
}));
```

**Critical:** Constructor mocks (`Map`, `Marker`, `Polyline`) MUST use `function(this: any) { Object.assign(this, ...) }` syntax — arrow functions cannot be called with `new`.

**SpeechSynthesisUtterance** — same rule: must be a regular function, not an arrow:
```typescript
window.SpeechSynthesisUtterance = vi.fn().mockImplementation(
  function(this: SpeechSynthesisUtterance, text: string) {
    Object.assign(this, { ...mockUtterance, text });
  }
) as unknown as typeof SpeechSynthesisUtterance;
```

When calling `utt.onend?.()` in tests, pass a real event: `utt.onend?.(new Event('end') as SpeechSynthesisEvent)`.

**vi.mock hoisting** — `vi.mock(...)` is hoisted to the top of the file by Vitest's transformer. You cannot call `vi.mock` inside `it()` or `beforeEach()` and reference variables declared in the outer scope — those variables aren't in scope at hoist time. Always declare mocks at the module top level.

**MiniMap error test queue math** — each `init()` call makes **2** `importLibrary` calls (maps + marker) via `Promise.all`. For 3 failed attempts (MAX_RETRIES=2), you need **6** `mockRejectedValueOnce` calls, not 3.

### Test for request body config (AskAI)
Always validate outgoing API request bodies, not just UI side effects:
```typescript
it('request body contains sufficient maxOutputTokens', async () => {
  const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
  const body = JSON.parse(options.body as string);
  expect(body.generationConfig.maxOutputTokens).toBeGreaterThanOrEqual(512);
});
```

---

## 9. Known API Pitfalls

### Google Maps JS API v2.x (`@googlemaps/js-api-loader`)
- **No `Loader` class** — the v2 API exports `setOptions(config)` and `importLibrary(name)` as named exports
- `setOptions` takes `{ key, v }` — NOT `{ apiKey, version }` (those are v1 options)
- `Marker` lives in `importLibrary('marker')` (returns `MarkerLibrary`), NOT in `importLibrary('maps')`
- Load both together: `const [mapsLib, markerLib] = await Promise.all([importLibrary('maps'), importLibrary('marker')])`
- **Waypoints hard limit:** max 8 intermediate waypoints (10 total including origin/destination) per Maps Directions URL — silently truncated beyond that

### Gemini REST API
- Model `gemini-1.5-flash` is **fully deprecated and removed** as of early 2026 — use `gemini-2.0-flash` or `gemini-2.5-flash`
- Check available models: `GET https://generativelanguage.googleapis.com/v1beta/models?key=KEY`
- `maxOutputTokens: 256` causes mid-sentence truncation with **no error signal** — minimum 512, recommend 1024
- 429 (rate limit) and 503 (overloaded) are retryable; all other 4xx are not

---

## 10. PWA Setup

```json
// public/manifest.json
{
  "name": "Seattle Walks",
  "short_name": "SeaWalks",
  "description": "Guided audio walking tours of Seattle with history & nature",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf7f2",
  "theme_color": "#1c1f2e",
  "orientation": "portrait",
  "icons": [
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }
  ]
}
```

Linked in `index.html` via `<link rel="manifest" href="/manifest.json">`. No service worker yet (offline support not implemented). Install prompt works natively on iOS Safari ("Add to Home Screen") and Android Chrome.

---

## 11. Deployment (Vercel)

```bash
npm install -g vercel
vercel login            # OAuth via browser
vercel --yes            # First deploy — auto-detects Vite, creates project
# Add env vars:
echo "$MAPS_KEY" | vercel env add VITE_GOOGLE_MAPS_API_KEY production
echo "$GEMINI_KEY" | vercel env add VITE_GEMINI_API_KEY production
vercel --prod           # Redeploy with env vars baked in
```

Subsequent deploys: `git push` to `main` triggers auto-deploy (GitHub integration set during first `vercel --yes`).

---

## 12. Walk 10 Content Notes

Walk 10 covers **Green Lake → Union Bay** (original book direction) or **Union Bay → Green Lake** (reversed, current implementation). The route follows Ravenna Creek from its historic source at Green Lake through Ravenna and Cowen Parks, along the Burke-Gilman Trail past the former town of Yesler, and into Union Bay Natural Area (Montlake Fill).

**Source material:** pages 151–164 of *Seattle Walks*, David B. Williams, Mountaineers Books.

**Content was verified line-by-line** against the book. Common LLM errors to watch for:
- Fabricated sentences added at the end of stops (especially Stops 2, 5, 15)
- Geological content from page 157 misplaced into Stop 4 instead of Stop 6
- Truncated quotes (Stop 3 Klein quote, Stop 7 tree descriptions)
- Missing paragraphs (Stops 8, 9, 11, 13 were all significantly incomplete)

All `content` fields should be compared against the printed book pages before publishing.

---

## 13. Design System (CSS Variables)

```css
/* src/index.css */
--bg:         #faf7f2   /* warm off-white page background */
--card-bg:    #ffffff
--text:       #1c1f2e   /* near-black */
--text-muted: #6b7280
--green:      #2d6a4f   /* primary action colour */
--green-bg:   #d4edda   /* light green tint */
--red:        #e53935   /* active map marker, destructive */
--blue:       #1a6ea8   /* Maps buttons */
--amber:      #d97706   /* Moderate difficulty, Reversed badge */
--radius-sm:  8px
--radius-md:  12px
--radius-lg:  16px
--shadow-sm:  0 1px 3px rgba(0,0,0,.08)
--shadow-md:  0 4px 12px rgba(0,0,0,.10)
```

Font: system-ui stack (no web fonts — keeps it fast and offline-friendly).

---

## 14. Scripts

```bash
npm run dev           # Vite dev server on :5173
npm run build         # tsc + vite build → dist/
npm run preview       # serve dist/ locally
npm run test          # vitest run
npm run test:coverage # vitest run --coverage (enforces thresholds)
npm run lint          # eslint
```

---

## 15. Future Work / Not Yet Implemented

- Walks 1–9 and 11–18 (stub cards exist; data files not created)
- Service worker / offline caching
- Custom PWA icon (currently uses SVG favicon as icon — works but not ideal)
- Share walk progress
- Dark mode
- Search/filter walk list
- Estimated walking time per stop
- Photo integration per stop
- Accessibility: skip-to-content link, better ARIA on map
