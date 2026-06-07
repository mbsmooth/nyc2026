import { useState, useEffect } from 'react';
import { DAYS } from '../data/itinerary.js';
import { MEALS } from '../data/restaurants.js';
import EventItem from '../components/EventItem.jsx';

const MEAL_IDS = [...new Set(DAYS.flatMap(d => d.events.filter(e => e.mealId).map(e => e.mealId)))];

const DAY_COLORS = {
  blue:   { tab: 'bg-blue-600 text-white',   header: 'from-blue-600 to-blue-800' },
  purple: { tab: 'bg-purple-600 text-white',  header: 'from-purple-600 to-purple-800' },
  amber:  { tab: 'bg-amber-500 text-white',   header: 'from-amber-500 to-orange-600' },
  green:  { tab: 'bg-green-600 text-white',   header: 'from-green-600 to-emerald-700' },
};

function todayDayId() {
  const today = new Date().toISOString().split('T')[0];
  return DAYS.find(d => d.date === today)?.id ?? null;
}

export default function Itinerary() {
  const [active, setActive] = useState(() => todayDayId() ?? DAYS[0].id);
  const [mealWinners, setMealWinners] = useState({});

  useEffect(() => {
    async function fetchWinners() {
      const results = {};
      await Promise.all(MEAL_IDS.map(async mealId => {
        try {
          const [votesRes, optsRes] = await Promise.all([
            fetch(`/api/votes/${mealId}`),
            fetch(`/api/meal-options/${mealId}`),
          ]);
          const { tally } = await votesRes.json();
          const customOptions = optsRes.ok ? await optsRes.json() : [];
          if (!tally || !Object.keys(tally).length) return;
          const [winnerKey] = Object.entries(tally).sort(([, a], [, b]) => b - a)[0];
          const asNum = Number(winnerKey);
          const meal = MEALS.find(m => m.id === mealId);
          const name = Number.isInteger(asNum) && !isNaN(asNum)
            ? meal?.options[asNum]?.name
            : customOptions.find(o => o._id === winnerKey)?.name;
          if (name) results[mealId] = name;
        } catch {}
      }));
      setMealWinners(results);
    }
    fetchWinners();
  }, []);

  const day = DAYS.find(d => d.id === active);
  const colors = DAY_COLORS[day.color];

  return (
    <div className="max-w-lg mx-auto">
      {/* Day tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar">
          {DAYS.map(d => {
            const isActive = d.id === active;
            const dc = DAY_COLORS[d.color];
            return (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`flex-1 min-w-[4.5rem] py-3 px-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? `${dc.tab}` : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="text-lg">{d.emoji}</div>
                <div>{d.id === 'jun9' ? 'Jun 9' : d.id === 'jun10' ? 'Jun 10' : d.id === 'jun11' ? 'Jun 11' : 'Jun 12'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day header */}
      <div className={`bg-gradient-to-r ${colors.header} text-white px-4 py-4`}>
        <div className="text-xs font-medium text-white/70 uppercase tracking-wider">{day.label}</div>
        <div className="text-xl font-bold mt-0.5">{day.emoji} {day.theme}</div>
      </div>

      {/* Events */}
      <div className="px-4 py-4 space-y-3">
        {day.events.map((event, i) => (
          <EventItem key={i} event={event} winner={event.mealId ? mealWinners[event.mealId] : undefined} />
        ))}
      </div>
    </div>
  );
}
