import React, { useEffect, useMemo, useState } from 'react';
import { generateAnswer, improveQuestion, suggestTags } from '../../api/ai';
import copy from 'copy-to-clipboard';
import './AIAssistant.css';

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

const AIAssistant = ({
  title,
  body,
  tags,
  onApplyImprove,
  onApplyTags,
  onApplyAnswerToBody,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [autoTagRefresh, setAutoTagRefresh] = useState(false);

  const debouncedTitle = useDebouncedValue(title, 800);
  const debouncedBody = useDebouncedValue(body, 800);

  const canRun = useMemo(() => {
    return (typeof title === 'string' && title.trim().length > 0) || (typeof body === 'string' && body.trim().length > 0);
  }, [title, body]);

  const run = async (nextMode) => {
    if (!canRun) {
      setError('Add a title or body first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (nextMode === 'improve') {
        const data = await improveQuestion({ title, body });
        setResult({ type: 'improve', ...data });
      }
      if (nextMode === 'answer') {
        const data = await generateAnswer({ title, body });
        setResult({ type: 'answer', ...data });
      }
      if (nextMode === 'tags') {
        const data = await suggestTags({ title, body });
        setResult({ type: 'tags', ...data });
        setAutoTagRefresh(true);
      }
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || 'AI request failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Bonus: after the user clicks Suggest Tags once, auto-refresh suggestions on debounced input changes.
  useEffect(() => {
    if (!autoTagRefresh) return;
    if (!canRun) return;

    const refresh = async () => {
      try {
        const data = await suggestTags({ title: debouncedTitle, body: debouncedBody });
        setResult((prev) => ({
          type: 'tags',
          tags: data.tags,
          prevTags: prev?.type === 'tags' ? prev.tags : undefined,
        }));
      } catch {
        // silent refresh
      }
    };

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTagRefresh, debouncedTitle, debouncedBody]);

  const handleCopy = () => {
    if (!result) return;

    if (result.type === 'answer') {
      copy(result.answer || '');
      return;
    }

    if (result.type === 'tags') {
      copy((result.tags || []).join(' '));
      return;
    }

    if (result.type === 'improve') {
      copy(`TITLE\n${result.improvedTitle || ''}\n\nBODY\n${result.improvedBody || ''}`);
    }
  };

  const handleApply = () => {
    if (!result) return;

    if (result.type === 'improve' && onApplyImprove) {
      onApplyImprove({ title: result.improvedTitle || title, body: result.improvedBody || body });
    }

    if (result.type === 'tags' && onApplyTags) {
      onApplyTags(result.tags || []);
    }

    if (result.type === 'answer' && onApplyAnswerToBody) {
      onApplyAnswerToBody(result.answer || '');
    }
  };

  const applyLabel =
    result?.type === 'improve'
      ? 'Apply to Title + Body'
      : result?.type === 'tags'
        ? 'Apply Tags'
        : result?.type === 'answer'
          ? 'Add Answer to Body'
          : 'Apply';

  return (
    <div className="ai-assistant">
      <h4 className="ai-title">AI Assistant</h4>

      <div className="ai-actions">
        <button type="button" className="ai-btn" onClick={() => run('improve')} disabled={loading}>
          ✨ Improve Question
        </button>
        <button type="button" className="ai-btn" onClick={() => run('answer')} disabled={loading}>
          🤖 Generate Answer
        </button>
        <button type="button" className="ai-btn" onClick={() => run('tags')} disabled={loading}>
          🏷️ Suggest Tags
        </button>
      </div>

      {loading && (
        <div className="ai-loading" role="status" aria-live="polite">
          <span className="ai-spinner" />
          <span>Thinking…</span>
        </div>
      )}

      {error && <div className="ai-error">{error}</div>}

      {result && !loading && (
        <div className="ai-result">
          <div className="ai-result-header">
            <div className="ai-result-title">
              {result.type === 'improve' && 'Improved Question'}
              {result.type === 'answer' && 'Suggested Answer'}
              {result.type === 'tags' && 'Suggested Tags'}
            </div>
            <div className="ai-result-actions">
              <button type="button" className="ai-link" onClick={handleCopy}>
                Copy
              </button>
              <button type="button" className="ai-link" onClick={handleApply}>
                {applyLabel}
              </button>
            </div>
          </div>

          {result.type === 'improve' && (
            <div className="ai-result-body">
              <div className="ai-block">
                <div className="ai-label">Title</div>
                <div className="ai-pre">{result.improvedTitle}</div>
              </div>
              <div className="ai-block">
                <div className="ai-label">Body</div>
                <div className="ai-pre">{result.improvedBody}</div>
              </div>
              {result.notes && (
                <div className="ai-notes">{result.notes}</div>
              )}
            </div>
          )}

          {result.type === 'answer' && (
            <div className="ai-result-body">
              <div className="ai-pre">{result.answer}</div>
            </div>
          )}

          {result.type === 'tags' && (
            <div className="ai-result-body">
              <div className="ai-tags">
                {(result.tags || []).map((t) => (
                  <span key={t} className="ai-tag">{t}</span>
                ))}
              </div>
              <div className="ai-hint">Applies as space-separated tags (max 5 recommended).</div>
            </div>
          )}

          {Array.isArray(tags) && tags.length > 0 && (
            <div className="ai-current">
              Current tags: <span className="ai-current-tags">{tags.join(' ')}</span>
            </div>
          )}
        </div>
      )}

      <div className="ai-footnote">
        AI suggestions can be wrong—review before posting.
      </div>
    </div>
  );
};

export default AIAssistant;
