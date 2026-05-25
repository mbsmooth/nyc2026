import { useState } from 'react';

export default function PlacesSearch({ coordinates, area }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const params = new URLSearchParams({
        lat: coordinates.lat,
        lng: coordinates.lng,
        keyword: keyword.trim(),
        radius: 800,
      });
      const res = await fetch(`/api/places/search?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <h3 className="font-bold text-slate-900 mb-1">Find Alternatives Near {area}</h3>
      <p className="text-xs text-slate-500 mb-3">Powered by Google Places · searches within ~800m</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. sushi, pizza, wings..."
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 active:scale-95 transition-all"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl p-3">
          {error === 'Google Places API key not configured'
            ? '🔑 Add your Google Places API key in server/.env to enable live search.'
            : error}
        </div>
      )}

      {results !== null && results.length === 0 && (
        <p className="mt-3 text-sm text-slate-500 text-center py-2">No results found nearby.</p>
      )}

      {results && results.length > 0 && (
        <div className="mt-3 space-y-2">
          {results.map(p => (
            <div key={p.placeId} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm truncate">{p.name}</div>
                <div className="text-xs text-slate-500 truncate mt-0.5">{p.address}</div>
                <div className="flex items-center gap-2 mt-1">
                  {p.rating && <span className="text-xs font-semibold text-amber-600">⭐ {p.rating}</span>}
                  {p.totalRatings && <span className="text-xs text-slate-400">({p.totalRatings.toLocaleString()})</span>}
                  {p.openNow !== undefined && (
                    <span className={`text-xs font-medium ${p.openNow ? 'text-green-600' : 'text-red-500'}`}>
                      {p.openNow ? '● Open' : '● Closed'}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={p.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-100"
              >
                Maps
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
