import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AskAI from '../components/AskAI';
import { walk10 } from '../data/walk10';

const waypoint = walk10.waypoints[6]; // Stop 7 — Beck's Sulfur Spring
const defaultProps = { waypoint, walkTitle: walk10.title };

const mockFetch = window.fetch as ReturnType<typeof vi.fn>;

function mockGeminiSuccess(answer: string) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text: answer }] } }],
    }),
  } as Response);
}

function mockGeminiError(status: number) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: async () => 'rate limited',
  } as Response);
}

describe('AskAI', () => {
  beforeEach(() => {
    import.meta.env.VITE_GEMINI_API_KEY = 'test-key';
  });

  it('renders suggestion chips', () => {
    render(<AskAI {...defaultProps} />);
    expect(screen.getByText(/Tell me more/i)).toBeInTheDocument();
    expect(screen.getByText(/What can I see/i)).toBeInTheDocument();
  });

  it('renders input field and send button', () => {
    render(<AskAI {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Ask anything/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send question/i)).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<AskAI {...defaultProps} />);
    expect(screen.getByLabelText(/Send question/i)).toBeDisabled();
  });

  it('send button enables when input has text', async () => {
    const user = userEvent.setup();
    render(<AskAI {...defaultProps} />);
    await user.type(screen.getByPlaceholderText(/Ask anything/i), 'hello');
    expect(screen.getByLabelText(/Send question/i)).not.toBeDisabled();
  });

  it('shows user message in thread after submission', async () => {
    const user = userEvent.setup();
    mockGeminiSuccess('Test answer');
    render(<AskAI {...defaultProps} />);
    await user.type(screen.getByPlaceholderText(/Ask anything/i), 'What is this?');
    await user.click(screen.getByLabelText(/Send question/i));
    expect(screen.getByText('What is this?')).toBeInTheDocument();
  });

  it('shows Gemini response after successful call', async () => {
    const user = userEvent.setup();
    mockGeminiSuccess('This is Beck\'s sulfur spring.');
    render(<AskAI {...defaultProps} />);
    await user.type(screen.getByPlaceholderText(/Ask anything/i), 'What is this?');
    await user.click(screen.getByLabelText(/Send question/i));
    await waitFor(() => {
      expect(screen.getByText(/Beck's sulfur spring/i)).toBeInTheDocument();
    });
  });

  it('clears input after submission', async () => {
    const user = userEvent.setup();
    mockGeminiSuccess('Answer');
    render(<AskAI {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Ask anything/i);
    await user.type(input, 'My question');
    await user.click(screen.getByLabelText(/Send question/i));
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('shows error banner on API failure', async () => {
    const user = userEvent.setup();
    mockGeminiError(500);
    // All retries fail
    mockGeminiError(500);
    mockGeminiError(500);
    render(<AskAI {...defaultProps} />);
    await user.type(screen.getByPlaceholderText(/Ask anything/i), 'test');
    await user.click(screen.getByLabelText(/Send question/i));
    await waitFor(() => {
      expect(screen.getByText(/Could not reach Gemini/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('clicking a suggestion chip sends that question', async () => {
    mockGeminiSuccess('Great answer');
    render(<AskAI {...defaultProps} />);
    fireEvent.click(screen.getByText(/Tell me more/i));
    await waitFor(() => {
      expect(screen.getByText(/Tell me more/i)).toBeInTheDocument();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('hides suggestion chips after first message', async () => {
    const user = userEvent.setup();
    mockGeminiSuccess('Answer');
    render(<AskAI {...defaultProps} />);
    await user.type(screen.getByPlaceholderText(/Ask anything/i), 'Hi');
    await user.click(screen.getByLabelText(/Send question/i));
    await waitFor(() => {
      expect(screen.queryByText(/What can I see/i)).not.toBeInTheDocument();
    });
  });

  it('shows error when API key is missing', async () => {
    const user = userEvent.setup();
    import.meta.env.VITE_GEMINI_API_KEY = '';
    render(<AskAI {...defaultProps} />);
    await user.type(screen.getByPlaceholderText(/Ask anything/i), 'test');
    await user.click(screen.getByLabelText(/Send question/i));
    await waitFor(() => {
      expect(screen.getByText(/API key not configured/i)).toBeInTheDocument();
    });
  });
});
