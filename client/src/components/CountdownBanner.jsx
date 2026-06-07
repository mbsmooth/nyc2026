import { useState, useEffect } from 'react';

const DEPARTURE = new Date('2026-06-09T08:30:00-05:00');

function getTimeUntil() {
  const now = new Date();
  const diff = DEPARTURE - now;
  if (diff <= 0) return null;
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

function isTripActive() {
  const now = new Date();
  const start = new Date('2026-06-09T00:00:00');
  const end = new Date('2026-06-12T23:59:59');
  return now >= start && now <= end;
}

function todayLabel() {
  const today = new Date().toISOString().split('T')[0];
  const map = {
    '2026-06-09': 'Day 1 — Arrival Day',
    '2026-06-10': 'Day 2 — History + Art + Music',
    '2026-06-11': 'Day 3 — Architecture + Water + Heights',
    '2026-06-12': 'Day 4 — Departure Day',
  };
  return map[today] || null;
}

export default function CountdownBanner() {
  const [time, setTime] = useState(() => getTimeUntil());

  useEffect(() => {
    const interval = time?.days === 0 ? 1000 : 60000;
    const t = setInterval(() => setTime(getTimeUntil()), interval);
    return () => clearInterval(t);
  }, [time?.days]);

  if (isTripActive()) {
    const label = todayLabel();
    return (
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-4 text-center shadow-md">
        <div className="text-2xl mb-1">🗽</div>
        <div className="font-bold text-lg">You're in NYC!</div>
        {label && <div className="text-green-100 text-sm mt-1">{label}</div>}
      </div>
    );
  }

  if (time === null) {
    return (
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl p-4 text-center shadow-md">
        <div className="font-bold text-lg">Trip complete — great memories! 🗽</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-nyc-blue to-blue-800 text-white rounded-2xl p-5 text-center shadow-md">
      <div className="text-slate-300 text-sm font-medium uppercase tracking-wider mb-1">NYC Trip in</div>
      <div className="flex items-end justify-center gap-3">
        {time.days > 0 && (
          <div className="text-center">
            <div className="text-5xl font-extrabold tabular-nums">{time.days}</div>
            <div className="text-blue-200 text-base font-medium">{time.days === 1 ? 'day' : 'days'}</div>
          </div>
        )}
        {(time.days > 0 ? time.hours > 0 : true) && (
          <>
            {time.days > 0 && <div className="text-blue-300 text-3xl font-light mb-1">&</div>}
            <div className="text-center">
              <div className="text-5xl font-extrabold tabular-nums">{time.hours}</div>
              <div className="text-blue-200 text-base font-medium">{time.hours === 1 ? 'hr' : 'hrs'}</div>
            </div>
          </>
        )}
        {time.days === 0 && (
          <>
            <div className="text-blue-300 text-3xl font-light mb-1">&</div>
            <div className="text-center">
              <div className="text-5xl font-extrabold tabular-nums">{time.minutes}</div>
              <div className="text-blue-200 text-base font-medium">{time.minutes === 1 ? 'min' : 'mins'}</div>
            </div>
          </>
        )}
      </div>
      <div className="text-blue-300 text-sm mt-2">June 9 – 12, 2026</div>
    </div>
  );
}
