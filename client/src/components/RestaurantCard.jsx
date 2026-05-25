const PRICE = ['', '$', '$$', '$$$', '$$$$'];

export default function RestaurantCard({ option, index, votes, myVote, onVote, totalVoters }) {
  const count = votes?.[index] ?? 0;
  const pct = totalVoters > 0 ? Math.round((count / totalVoters) * 100) : 0;
  const isLeading = count > 0 && count === Math.max(...Object.values(votes || {}));

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all ${
      myVote === index ? 'border-blue-500 shadow-blue-100 shadow-md' : 'border-slate-100 shadow-sm'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base leading-tight">{option.name}</h3>
              {option.pick && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Michael's pick
                </span>
              )}
              {isLeading && count > 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  🔥 Leading
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-slate-500">{option.address}</span>
              {option.rating && (
                <span className="text-xs font-semibold text-amber-600">⭐ {option.rating}</span>
              )}
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {option.vibe}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1.5 leading-snug">{option.why}</p>
          </div>
        </div>

        {/* Vote bar */}
        {totalVoters > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{count} vote{count !== 1 ? 's' : ''}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${myVote === index ? 'bg-blue-500' : 'bg-slate-300'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onVote(index)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              myVote === index
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {myVote === index ? '✓ My Pick' : 'Vote'}
          </button>
          <a
            href={option.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            📍
          </a>
          {option.menuUrl && (
            <a
              href={option.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Menu
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
