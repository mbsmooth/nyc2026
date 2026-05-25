import { useState, useEffect } from 'react';

function getDaysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr + 'T00:00:00');
  const diff = target - now;
  if (diff <= 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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
  const [days, setDays] = useState(() => getDaysUntil('2026-06-09'));

  useEffect(() => {
    const t = setInterval(() => setDays(getDaysUntil('2026-06-09')), 60000);
    return () => clearInterval(t);
  }, []);

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

  if (days === null) {
    return (
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl p-4 text-center shadow-md">
        <div className="font-bold text-lg">Trip complete — great memories! 🗽</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-nyc-blue to-blue-800 text-white rounded-2xl p-5 text-center shadow-md">
      <div className="text-slate-300 text-sm font-medium uppercase tracking-wider mb-1">NYC Trip in</div>
      <div className="text-5xl font-extrabold tabular-nums">{days}</div>
      <div className="text-blue-200 mt-1 text-base font-medium">{days === 1 ? 'day' : 'days'}</div>
      <div className="text-blue-300 text-sm mt-2">June 9 – 12, 2026</div>
    </div>
  );
}
