import { useState, useEffect } from 'react';

const avatars = { Michael: '👨', Arly: '👧', Avaya: '👧', Kinsley: '👧' };
const travelerColor = {
  Michael: 'bg-blue-100 text-blue-800',
  Arly:    'bg-purple-100 text-purple-800',
  Avaya:   'bg-rose-100 text-rose-800',
  Kinsley: 'bg-amber-100 text-amber-800',
};
const actionIcon = { login: '🔓', vote: '🗳️', suggest: '💡' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch('/api/activity');
      if (res.ok) setLogs(await res.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">📊 Activity</h1>
        <p className="text-slate-500 text-sm mt-1">Who's been up to what</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12 text-sm">Loading…</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <div className="text-4xl mb-2">🤷</div>
          <div className="text-sm">No activity yet</div>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
              <div className="text-2xl shrink-0 leading-none">{avatars[log.traveler] || '👤'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${travelerColor[log.traveler] || 'bg-slate-100 text-slate-700'}`}>
                    {log.traveler}
                  </span>
                  <span className="text-sm text-slate-700 truncate">{log.detail}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {actionIcon[log.action] || '•'} {timeAgo(log.ts)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
