import { useState, useEffect } from 'react';
import { useTraveler } from '../App.jsx';

const TYPE_OPTS = [
  { value: 'restaurant', label: '🍔 Restaurant' },
  { value: 'activity', label: '🎡 Activity' },
  { value: 'other', label: '💬 Other' },
];

const DAY_OPTS = [
  { value: '', label: 'Any day' },
  { value: 'Jun 9', label: 'Jun 9 — Arrival' },
  { value: 'Jun 10', label: 'Jun 10 — History + Music' },
  { value: 'Jun 11', label: 'Jun 11 — Architecture + Heights' },
  { value: 'Jun 12', label: 'Jun 12 — Departure' },
];

const avatars = { Michael: '👨', Arly: '👧', Avaya: '👧', Kinsley: '👧' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Suggestions() {
  const { traveler } = useTraveler();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'restaurant', name: '', location: '', notes: '', day: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadSuggestions(); }, []);

  async function loadSuggestions() {
    try {
      const res = await fetch('/api/suggestions');
      if (res.ok) setItems(await res.json());
    } catch {
      // API unavailable
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, traveler }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems(prev => [newItem, ...prev]);
        setForm({ type: 'restaurant', name: '', location: '', notes: '', day: '' });
      } else {
        // store locally if API is down
        setItems(prev => [{
          _id: Date.now().toString(),
          ...form,
          traveler,
          createdAt: new Date().toISOString(),
        }, ...prev]);
        setForm({ type: 'restaurant', name: '', location: '', notes: '', day: '' });
      }
    } catch {
      setError('Could not save — check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id) {
    setItems(prev => prev.filter(i => i._id !== id));
    try { await fetch(`/api/suggestions/${id}`, { method: 'DELETE' }); } catch {}
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">💡 Suggestions</h1>
        <p className="text-slate-500 text-sm mt-1">Add restaurants or activities you'd like to try.</p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        {/* Type */}
        <div className="flex gap-2">
          {TYPE_OPTS.map(t => (
            <button
              type="button"
              key={t.value}
              onClick={() => setForm(f => ({ ...f, type: t.value }))}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                form.type === t.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Name (required)"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Location or address (optional)"
          value={form.location}
          onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
        />

        {/* Day picker */}
        <select
          value={form.day}
          onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
        >
          {DAY_OPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>

        <textarea
          placeholder="Notes (why do you want to try this?)"
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !form.name.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50 active:scale-95 transition-all"
        >
          {submitting ? 'Adding...' : 'Add Suggestion'}
        </button>
      </form>

      {/* Suggestions list */}
      {items.length === 0 ? (
        <div className="text-center text-slate-400 py-8">
          <div className="text-4xl mb-2">🤔</div>
          <div className="text-sm">No suggestions yet — be the first!</div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{avatars[item.traveler] || '👤'}</span>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {TYPE_OPTS.find(t => t.value === item.type)?.label || item.type}
                    </span>
                    {item.day && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {item.day}
                      </span>
                    )}
                  </div>
                  {item.location && <div className="text-xs text-slate-500 mt-1">📍 {item.location}</div>}
                  {item.notes && <p className="text-sm text-slate-600 mt-1.5 leading-snug">{item.notes}</p>}
                  <div className="text-xs text-slate-400 mt-2">
                    by {item.traveler} · {timeAgo(item.createdAt)}
                  </div>
                </div>
                {item.traveler === traveler && (
                  <button
                    onClick={() => remove(item._id)}
                    className="text-slate-300 hover:text-red-400 transition-colors text-lg shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
