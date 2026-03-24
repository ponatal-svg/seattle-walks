import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { importLibrary } from '@googlemaps/js-api-loader';
import MiniMap from '../components/MiniMap';
import { walk10 } from '../data/walk10';

const mockImportLibrary = importLibrary as ReturnType<typeof vi.fn>;

const WAYPOINTS = walk10.waypoints;

describe('MiniMap', () => {
  it('shows loading spinner on initial render', () => {
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    expect(screen.getByText(/Loading map/i)).toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('map container div is always in the DOM (even while loading)', () => {
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    // The container div should exist immediately so the Maps SDK can attach
    expect(screen.getByTestId('mini-map')).toBeInTheDocument();
  });

  it('hides loading overlay after successful load', async () => {
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading map/i)).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('mini-map')).toBeInTheDocument();
  });

  it('calls importLibrary for both maps and marker libraries', async () => {
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading map/i)).not.toBeInTheDocument();
    });
    expect(mockImportLibrary).toHaveBeenCalledWith('maps');
    expect(mockImportLibrary).toHaveBeenCalledWith('marker');
  });

  it('shows error state when importLibrary rejects', async () => {
    // Both maps and marker calls must fail to trigger error state
    mockImportLibrary
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'));
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    await waitFor(() => {
      expect(screen.getByText(/Map unavailable/i)).toBeInTheDocument();
    });
  });

  it('shows error icon in error state', async () => {
    mockImportLibrary
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'));
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    await waitFor(() => {
      expect(screen.getByText('🗺️')).toBeInTheDocument();
    });
  });

  it('shows retry button in error state when retries remain', async () => {
    mockImportLibrary
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'));
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    });
  });

  it('clicking Retry recovers the map when second attempt succeeds', async () => {
    // First attempt fails (both calls)
    mockImportLibrary
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'));
    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    const retryBtn = await screen.findByRole('button', { name: /Retry/i });

    // Default mock resolves for the retry
    fireEvent.click(retryBtn);
    await waitFor(() => {
      expect(screen.queryByText(/Map unavailable/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Loading map/i)).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('mini-map')).toBeInTheDocument();
  });

  it('hides retry button after max retries exceeded', async () => {
    // Each init() call makes 2 importLibrary calls (maps + marker).
    // We need 3 failed attempts (initial + 2 retries) = 6 rejections total.
    mockImportLibrary
      .mockRejectedValueOnce(new Error('err'))  // initial: maps
      .mockRejectedValueOnce(new Error('err'))  // initial: marker
      .mockRejectedValueOnce(new Error('err'))  // retry 1: maps
      .mockRejectedValueOnce(new Error('err'))  // retry 1: marker
      .mockRejectedValueOnce(new Error('err'))  // retry 2: maps
      .mockRejectedValueOnce(new Error('err')); // retry 2: marker

    render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);

    // First error — retry button visible
    await screen.findByRole('button', { name: /Retry/i });

    // Retry 1 also fails
    fireEvent.click(screen.getByRole('button', { name: /Retry/i }));
    await screen.findByRole('button', { name: /Retry/i });

    // Retry 2 also fails — max retries exhausted, no more retry button
    fireEvent.click(screen.getByRole('button', { name: /Retry/i }));
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Retry/i })).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Map unavailable/i)).toBeInTheDocument();
  });

  it('updates marker styles when activeId changes', async () => {
    const { rerender } = render(<MiniMap waypoints={WAYPOINTS} activeId={1} />);
    // Wait for init to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading map/i)).not.toBeInTheDocument();
    });

    // Change activeId — markers should be updated via the second useEffect
    rerender(<MiniMap waypoints={WAYPOINTS} activeId={2} />);
    // Should not throw and container should still be present
    expect(screen.getByTestId('mini-map')).toBeInTheDocument();
  });
});
