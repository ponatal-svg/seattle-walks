import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock must be at top level — vi.mock is hoisted by Vitest
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders book title', () => {
    renderHome();
    expect(screen.getByText(/Seattle Walks/i)).toBeInTheDocument();
  });

  it('renders author name', () => {
    renderHome();
    expect(screen.getByText(/David B. Williams/i)).toBeInTheDocument();
  });

  it('renders 18 walk cards', () => {
    renderHome();
    // Each walk card has an aria-label "Walk N: ..."
    const cards = screen.getAllByRole('button', { name: /^Walk \d+:/i });
    expect(cards).toHaveLength(18);
  });

  it('shows Walk 10 in the list', () => {
    renderHome();
    expect(screen.getByText(/Green Lake/i)).toBeInTheDocument();
  });

  it('shows walk distances', () => {
    renderHome();
    expect(screen.getByText('4.7 mi')).toBeInTheDocument();
  });

  it('shows difficulty labels', () => {
    renderHome();
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Strenuous').length).toBeGreaterThan(0);
  });

  it('shows 0 miles walked for fresh state', () => {
    renderHome();
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('shows in-progress walk in continue section when progress exists', () => {
    window.localStorage.setItem(
      'seattle-walks-progress',
      JSON.stringify({ 10: { walkId: 10, completedStops: [1, 2, 3], currentStop: 4 } }),
    );
    renderHome();
    expect(screen.getByText(/Continue where you left off/i)).toBeInTheDocument();
  });

  it('clicking a walk card triggers navigation', async () => {
    renderHome();
    const walk10Card = screen.getByRole('button', { name: /Walk 10/i });
    fireEvent.click(walk10Card);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/walk/10');
    });
  });

  it('clicking in-progress walk card navigates to it', async () => {
    window.localStorage.setItem(
      'seattle-walks-progress',
      JSON.stringify({ 10: { walkId: 10, completedStops: [1, 2], currentStop: 3 } }),
    );
    renderHome();
    // The in-progress section renders a card — click it
    const continueSection = screen.getByText(/Continue where you left off/i).closest('section')!;
    const card = continueSection.querySelector('button')!;
    fireEvent.click(card);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/walk/10');
    });
  });

  it('shows completed section when a walk is fully done', () => {
    // Walk 10 has 15 stops; mark all 15 complete
    const completedStops = Array.from({ length: 15 }, (_, i) => i + 1);
    window.localStorage.setItem(
      'seattle-walks-progress',
      JSON.stringify({ 10: { walkId: 10, completedStops, currentStop: 15 } }),
    );
    renderHome();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });
});
