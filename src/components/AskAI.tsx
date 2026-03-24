import { useState, useRef, useCallback } from 'react';
import type { Waypoint } from '../types';
import './AskAI.css';

interface Props {
  waypoint: Waypoint;
  walkTitle: string;
}

interface Message {
  role: 'user' | 'assistant' | 'error';
  text: string;
}

const SUGGESTIONS = [
  'Tell me more about this spot',
  'What can I see from here?',
  'What was here 100 years ago?',
];

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1200;

async function callGemini(
  apiKey: string,
  systemContext: string,
  userQuestion: string,
  attempt = 0,
): Promise<string> {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `${systemContext}\n\nUser question: ${userQuestion}\n\nAnswer in 2-4 concise sentences. Focus on what's immediately relevant to the walker standing at this location.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 256,
    },
  };

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000), // 15 s timeout
  });

  if (!res.ok) {
    // 429 = rate limit, 503 = overloaded — both retryable
    if ((res.status === 429 || res.status === 503) && attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      return callGemini(apiKey, systemContext, userQuestion, attempt + 1);
    }
    const errBody = await res.text().catch(() => '');
    throw new Error(`Gemini API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text.trim();
}

export default function AskAI({ waypoint, walkTitle }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const systemContext = `You are a knowledgeable walking guide for the book "Seattle Walks" by David B. Williams.
The walker is currently at Stop ${waypoint.id}: "${waypoint.title}" (${waypoint.location}) on the walk "${walkTitle}".
Book content for this stop: ${waypoint.content}`;

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || loading) return;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
      if (!apiKey) {
        setMessages(prev => [
          ...prev,
          { role: 'user', text: q },
          { role: 'error', text: 'Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.' },
        ]);
        return;
      }

      setMessages(prev => [...prev, { role: 'user', text: q }]);
      setInput('');
      setLoading(true);

      try {
        const answer = await callGemini(apiKey, systemContext, q);
        setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setMessages(prev => [
          ...prev,
          { role: 'error', text: `Could not reach Gemini: ${msg}. Check your connection and try again.` },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [loading, systemContext],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="ask-ai card" data-testid="ask-ai">
      <div className="ask-ai-label">✦ Ask Gemini</div>

      {/* Suggestion chips — only when no messages yet */}
      {messages.length === 0 && (
        <div className="ask-ai-suggestions" aria-label="Suggested questions">
          {SUGGESTIONS.map(s => (
            <button key={s} className="ask-ai-chip" onClick={() => send(s)} disabled={loading}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Message thread */}
      {messages.length > 0 && (
        <div className="ask-ai-thread" aria-live="polite" aria-label="Conversation">
          {messages.map((m, i) => (
            <div key={i} className={`ask-ai-msg ask-ai-msg--${m.role}`}>
              {m.role === 'assistant' && <span className="ask-ai-msg-icon">✦</span>}
              {m.role === 'error'     && <span className="ask-ai-msg-icon">⚠️</span>}
              <span>{m.text}</span>
            </div>
          ))}
          {loading && (
            <div className="ask-ai-msg ask-ai-msg--assistant" aria-label="Loading response">
              <span className="ask-ai-msg-icon">✦</span>
              <span className="ask-ai-thinking">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form className="ask-ai-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="ask-ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about this stop…"
          disabled={loading}
          aria-label="Ask a question"
          maxLength={500}
        />
        <button
          type="submit"
          className="ask-ai-send"
          disabled={loading || !input.trim()}
          aria-label="Send question"
        >
          {loading ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '→'}
        </button>
      </form>
    </div>
  );
}
