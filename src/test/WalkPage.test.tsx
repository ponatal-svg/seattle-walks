import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WalkPage from '../pages/WalkPage';

// Wrap in router with walkId param
function renderWalkPage(walkId = '10') {
  return render(
    <MemoryRouter initialEntries={[`/walk/${walkId}`]}>
      <Routes>
        <Route path="/walk/:id" element={<WalkPage />} />
        <Route path="/"         element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('WalkPage', () => {
  it('renders walk title', () => {
    renderWalkPage('10');
    // Walk 10 is reversed: title is "Union Bay → Green Lake"
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Union Bay/i);
  });

  it('shows reversed route badge', () => {
    renderWalkPage('10');
    expect(screen.getByText(/Reversed Route/i)).toBeInTheDocument();
  });

  it('renders first stop by default', () => {
    renderWalkPage('10');
    // Walk is reversed; stop 1 is now the UW bus stop
    expect(screen.getByText(/Walk Start/i)).toBeInTheDocument();
  });

  it('renders stop number badge', () => {
    renderWalkPage('10');
    // Stop number "1" should appear in the stop-num circle
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });

  it('Next button advances to stop 2', async () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Next stop/i));
    await waitFor(() => {
      expect(screen.getByText(/Loop Trail Viewpoint/i)).toBeInTheDocument();
    });
  });

  it('Prev button is disabled on first stop', () => {
    renderWalkPage('10');
    expect(screen.getByLabelText(/Previous stop/i)).toBeDisabled();
  });

  it('Prev button enabled after navigating forward', async () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Next stop/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/Previous stop/i)).not.toBeDisabled();
    });
  });

  it('navigating back with Prev returns to previous stop', async () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Next stop/i));
    await waitFor(() => screen.getByText(/Loop Trail Viewpoint/i));
    fireEvent.click(screen.getByLabelText(/Previous stop/i));
    await waitFor(() => {
      expect(screen.getByText(/Walk Start/i)).toBeInTheDocument();
    });
  });

  it('shows progress bar', () => {
    renderWalkPage('10');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows Navigate chip', () => {
    renderWalkPage('10');
    expect(screen.getByLabelText(/Navigate to stop 1/i)).toBeInTheDocument();
  });

  it('shows Full Route button(s)', () => {
    renderWalkPage('10');
    // Walk 10 has 15 stops → split into 2 route buttons in header + 1 in bottom nav
    expect(screen.getAllByLabelText(/Open full route/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows book content from Walk 10 stop 1', () => {
    renderWalkPage('10');
    // Stop 1 is now the UW/Metro start with reversed directions
    expect(screen.getByText(/Burke-Gilman Trail/i)).toBeInTheDocument();
  });

  it('General Land Office content is present at stop 15', async () => {
    renderWalkPage('10');
    // Navigate to stop 15 (Green Lake Shore — now the final stop)
    for (let i = 0; i < 14; i++) {
      fireEvent.click(screen.getByLabelText(/Next stop/i));
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {});
    }
    expect(screen.getByText(/General Land Office/i)).toBeInTheDocument();
  });

  it('audio play button is present', () => {
    renderWalkPage('10');
    expect(screen.getByLabelText(/Play audio/i)).toBeInTheDocument();
  });

  it('clicking play calls speechSynthesis.speak', () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Play audio/i));
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  it('play button shows Stop audio when playing', () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Play audio/i));
    expect(screen.getByLabelText(/Stop audio/i)).toBeInTheDocument();
  });

  it('stop audio calls speechSynthesis.cancel', () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Play audio/i));
    fireEvent.click(screen.getByLabelText(/Stop audio/i));
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it('shows error for unknown walk id', () => {
    renderWalkPage('999');
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('Back to walks button in error state navigates home', async () => {
    renderWalkPage('999');
    fireEvent.click(screen.getByText(/Back to walks/i));
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('Back to walks link navigates to home', async () => {
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Back to walks/i));
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('Full Route button opens Google Maps URL', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderWalkPage('10');
    // With 15 stops the route is split; grab any "Open full route" button
    fireEvent.click(screen.getAllByLabelText(/Open full route/i)[0]);
    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0] as [string];
    expect(url).toContain('google.com/maps');
    expect(url).toContain('travelmode=walking');
    openSpy.mockRestore();
  });

  it('split route has at most 10 waypoints per URL', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderWalkPage('10');
    const buttons = screen.getAllByLabelText(/Open full route part \d+ in Google Maps/i);
    buttons.forEach(btn => {
      fireEvent.click(btn);
    });
    openSpy.mock.calls.forEach(([url]) => {
      const u = url as string;
      // Count encoded waypoints: each waypoint is separated by %7C (|)
      const wayptsMatch = u.match(/waypoints=([^&]*)/);
      if (wayptsMatch) {
        const count = wayptsMatch[1].split('%7C').length;
        expect(count).toBeLessThanOrEqual(8); // Google Maps max intermediate waypoints
      }
    });
    openSpy.mockRestore();
  });

  it('Navigate chip opens single-stop navigation URL', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderWalkPage('10');
    fireEvent.click(screen.getByLabelText(/Navigate to stop 1/i));
    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0] as [string];
    expect(url).toContain('google.com/maps');
    expect(url).toContain('travelmode=walking');
    openSpy.mockRestore();
  });

  it('on last stop Next button says Finish', async () => {
    renderWalkPage('10');
    // Navigate to stop 15
    for (let i = 0; i < 14; i++) {
      fireEvent.click(screen.getByLabelText(/Next stop/i));
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {});
    }
    expect(screen.getByLabelText(/Finish walk/i)).toBeInTheDocument();
  });
});
