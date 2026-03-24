import '@testing-library/jest-dom';

// ── Mock Web Speech API ──────────────────────────────
const mockUtterance = {
  rate: 1, pitch: 1, text: '',
  onend: null as (() => void) | null,
  onerror: null as (() => void) | null,
};

const mockSpeechSynthesis = {
  speak: vi.fn((utt: SpeechSynthesisUtterance) => {
    // Simulate immediate end
    setTimeout(() => utt.onend?.(new Event('end') as SpeechSynthesisEvent), 0);
  }),
  cancel: vi.fn(),
  speaking: false,
  pending: false,
  paused: false,
  getVoices: vi.fn(() => []),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  onvoiceschanged: null,
  pause: vi.fn(),
  resume: vi.fn(),
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

window.SpeechSynthesisUtterance = vi.fn().mockImplementation(function(this: SpeechSynthesisUtterance, text: string) {
  Object.assign(this, { ...mockUtterance, text });
}) as unknown as typeof SpeechSynthesisUtterance;

// ── Mock Google Maps Loader ──────────────────────────
// Constructors must use `function` (not arrow functions) so `new X()` works.
vi.mock('@googlemaps/js-api-loader', () => ({
  setOptions: vi.fn(),
  importLibrary: vi.fn().mockResolvedValue({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map: vi.fn().mockImplementation(function(this: any) {
      this.panTo = vi.fn();
      this.setCenter = vi.fn();
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Marker: vi.fn().mockImplementation(function(this: any) {
      this.setIcon = vi.fn();
      this.setLabel = vi.fn();
      this.setZIndex = vi.fn();
      this.setMap = vi.fn();
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Polyline: vi.fn().mockImplementation(function(this: any) {
      this.setMap = vi.fn();
    }),
    SymbolPath: { CIRCLE: 0 },
  }),
}));

// ── Mock fetch (Gemini) ──────────────────────────────
window.fetch = vi.fn();

// ── Mock localStorage ─────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem:    (k: string) => store[k] ?? null,
    setItem:    (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear:      () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ── Suppress noisy console.error in tests ─────────────
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning:')) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });
afterEach(() => { window.localStorage.clear(); vi.clearAllMocks(); });
