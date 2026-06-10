import { QUICK_REF, TICKETS, CITYPASS } from '../data/itinerary.js';
import { useState } from 'react';
import { useNow, isDisguised } from '../hooks/useNow.js';

const CATEGORY_LABELS = {
  flights: '✈️ Flights',
  transport: '🚗 Transport',
  hotel: '🏨 Hotel',
  activities: '🎟️ Activities',
};

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={copy}
      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors shrink-0"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

export default function QuickRef() {
  const now = useNow();
  const visibleRefs = QUICK_REF.map(item =>
    (item.disguise && isDisguised(item.disguise.revealAt, now))
      ? { ...item, ...item.disguise }
      : item
  );
  const grouped = groupBy(visibleRefs, 'category');

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">📋 Quick Reference</h1>
        <p className="text-slate-500 text-sm mt-1">All confirmation numbers and contacts.</p>
      </div>

      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
        const items = grouped[cat];
        if (!items) return null;
        return (
          <div key={cat} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <h2 className="font-bold text-slate-700 text-sm">{label}</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {items.map((item, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">{item.label}</div>
                  <div className="flex items-center justify-between gap-2">
                    {item.link ? (
                      <a href={item.link} className="font-mono text-sm font-bold text-blue-700">
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-mono text-sm font-bold text-slate-900">{item.value}</span>
                    )}
                    <CopyButton value={item.value} />
                  </div>
                  {item.secondary && (
                    <div className="text-xs text-slate-500 mt-0.5">{item.secondary}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Airline Tickets */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-700 text-sm">🎫 Airline Tickets</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {TICKETS.map(t => (
            <div key={t.ticket} className="px-4 py-3">
              <div className="text-xs font-medium text-slate-500 mb-0.5">{t.name}</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-slate-900">{t.ticket}</span>
                <CopyButton value={t.ticket} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CityPASS QR codes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-700 text-sm">🏛️ CityPASS QR Codes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Order #7156243 · Valid 9 days from first use</p>
        </div>
        <div className="divide-y divide-slate-50">
          {CITYPASS.map(p => (
            <div key={p.qr} className="px-4 py-3">
              <div className="text-xs font-medium text-slate-500 mb-0.5">{p.name} ({p.type})</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 break-all">{p.qr}</span>
                <CopyButton value={p.qr} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency contacts / important notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
        <h2 className="font-bold text-amber-900 text-sm">⚠️ Important Reminders</h2>
        <ul className="text-sm text-amber-800 space-y-1.5">
          <li>• <strong>Intrepid Museum:</strong> Arrive at 2:00 PM SHARP — 30-min window only (Jun 11)</li>
          <li>• <strong>Empire State Building:</strong> Arrive at 7:30 PM exactly — no rainchecks after scan (Jun 10)</li>
          <li>• <strong>MSG:</strong> Cashless venue. Download tickets to phone before arriving (Jun 11)</li>
          <li>• <strong>Hotel room merge:</strong> On Jun 11, re-check in at front desk — no need to move luggage</li>
          <li>• <strong>ESB bonus:</strong> Free same-night return 8:30 PM–midnight on Jun 10 — no reservation needed</li>
        </ul>
      </div>

      <div className="h-2" />
    </div>
  );
}
