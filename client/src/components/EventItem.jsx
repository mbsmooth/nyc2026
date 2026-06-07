import { useNavigate } from 'react-router-dom';
import { useNow, isDisguised } from '../hooks/useNow.js';

const STATUS = {
  booked:  { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', label: 'Booked' },
  plan:    { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Girls pick!' },
  free:    { bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400', label: 'Free' },
  bonus:   { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500', label: 'Bonus' },
};

export default function EventItem({ event, winner }) {
  const navigate = useNavigate();
  const now = useNow();

  // Apply disguise if before the reveal time
  const display = (event.disguise && isDisguised(event.disguise.revealAt, now))
    ? { ...event, title: event.disguise.title, detail: event.disguise.detail, ref: undefined, warning: undefined }
    : event;

  const s = STATUS[display.status] || STATUS.free;

  return (
    <div
      className={`rounded-xl border ${s.border} ${s.bg} p-3 ${event.mealId ? 'cursor-pointer active:scale-98' : ''}`}
      onClick={() => event.mealId && navigate(`/restaurants?meal=${event.mealId}`)}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center shrink-0 pt-0.5">
          <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-500">{display.time}</span>
              <div className="font-semibold text-slate-900 leading-tight mt-0.5">{display.title}</div>
            </div>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
              display.status === 'booked' ? 'bg-green-100 text-green-700' :
              display.status === 'plan'   ? 'bg-amber-100 text-amber-700' :
              display.status === 'bonus'  ? 'bg-purple-100 text-purple-700' :
                                            'bg-slate-100 text-slate-500'
            }`}>
              {s.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 leading-snug">{display.detail}</p>
          {display.ref && (
            <div className="mt-1.5 text-xs text-slate-500 font-mono bg-white/70 inline-block px-2 py-0.5 rounded">
              Ref: {display.ref}
            </div>
          )}
          {display.warning && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-800 bg-amber-100 rounded-lg px-2 py-1.5">
              <span>⚠️</span>
              <span>{display.warning}</span>
            </div>
          )}
          {event.tip && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-800 bg-blue-50 rounded-lg px-2 py-1.5 font-medium">
              {event.tip}
            </div>
          )}
          {display.mealId && (
            <div className="mt-2 text-xs font-medium flex items-center gap-1">
              {winner
                ? <span className="text-green-700">🏆 {winner} — tap to change</span>
                : <span className="text-blue-600">Tap to vote on restaurants →</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
