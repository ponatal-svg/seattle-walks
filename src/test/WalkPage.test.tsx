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
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Green Lake/i);
  });

  it('renders first stop by default', () => {
    renderWalkPage('10');
    expect(screen.getByText(/Green Lake Shore/i)).toBeInTheDocument();
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
      expect(screen.getByText(/Clock Tower/i)).toBeInTheDocument();
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
    await waitFor(() => screen.getByText(/Clock Tower/i));
    fireEvent.click(screen.getByLabelText(/Previous stop/i));
    await waitFor(() => {
      expect(screen.getByText(/Green Lake Shore/i)).toBeInTheDocument();
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

  it('shows Full Route button', () => {
    renderWalkPage('10');
    expect(screen.getAllByLabelText(/Open full route/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows book content from Walk 10', () => {
    renderWalkPage('10');
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
    // Two "Open full route" buttons exist: header + bottom nav. Click the first.
    fireEvent.click(screen.getAllByLabelText(/Open full route/i)[0]);
    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0] as [string];
    expect(url).toContain('google.com/maps');
    expect(url).toContain('travelmode=walking');
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
