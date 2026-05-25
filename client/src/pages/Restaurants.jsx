import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTraveler } from '../App.jsx';
import { MEALS } from '../data/restaurants.js';
import { TRAVELERS } from '../data/itinerary.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import PlacesSearch from '../components/PlacesSearch.jsx';

const avatars = { Michael: '👨', Arly: '👧', Avaya: '👧', Kinsley: '👧' };

export default function Restaurants() {
  const { traveler } = useTraveler();
  const [searchParams] = useSearchParams();
  const [activeMeal, setActiveMeal] = useState(() => searchParams.get('meal') || MEALS[0].id);
  const [voteData, setVoteData] = useState({});
  const [saving, setSaving] = useState(false);

  const meal = MEALS.find(m => m.id === activeMeal) || MEALS[0];

  const loadVotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/votes/${meal.id}`);
      if (res.ok) setVoteData(await res.json());
    } catch {
      // API unavailable — votes still work locally via state
    }
  }, [meal.id]);

  useEffect(() => { loadVotes(); }, [loadVotes]);

  // Local vote state as fallback when API is down
  const [localVotes, setLocalVotes] = useState({});
  const myVote = voteData.byTraveler?.[traveler] ?? localVotes[meal.id]?.[traveler] ?? null;
  const tally = voteData.tally || {};

  async function handleVote(optionIndex) {
    setSaving(true);
    // optimistic local update
    setLocalVotes(prev => ({
      ...prev,
      [meal.id]: { ...(prev[meal.id] || {}), [traveler]: optionIndex },
    }));
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId: meal.id, optionIndex, traveler }),
      });
      if (res.ok) await loadVotes();
    } catch {
      // keep local state
    } finally {
      setSaving(false);
    }
  }

  // compute total voters from tally
  const totalVoters = Object.values(tally).reduce((a, b) => a + b, 0);

  // Voter summary — who picked what
  const byTraveler = voteData.byTraveler || localVotes[meal.id] || {};

  return (
    <div className="max-w-lg mx-auto">
      {/* Meal tabs — horizontal scroll */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar px-2 py-2 gap-2">
          {MEALS.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMeal(m.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                m.id === activeMeal
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {m.dayLabel.split(',')[0]} {m.meal}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Meal header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-slate-900 text-lg">{meal.dayLabel} {meal.meal}</div>
              <div className="text-slate-500 text-sm">{meal.time} · {meal.area}</div>
            </div>
          </div>
          {meal.note && (
            <div className="mt-3 text-sm text-amber-800 bg-amber-50 rounded-xl p-3 leading-snug">
              📋 {meal.note}
            </div>
          )}

          {/* Voter summary */}
          {Object.keys(byTraveler).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {TRAVELERS.map(name => {
                const idx = byTraveler[name];
                if (idx === undefined) return null;
                return (
                  <div key={name} className="flex items-center gap-1 text-xs bg-slate-50 rounded-full px-2 py-1">
                    <span>{avatars[name]}</span>
                    <span className="font-medium text-slate-700">{name}:</span>
                    <span className="text-slate-600">{meal.options[idx]?.name ?? `#${idx + 1}`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Restaurant options */}
        <div className="space-y-3">
          {meal.options.map((option, i) => (
            <RestaurantCard
              key={i}
              option={option}
              index={i}
              votes={tally}
              myVote={myVote}
              onVote={handleVote}
              totalVoters={totalVoters}
            />
          ))}
        </div>

        {/* Find alternatives */}
        <PlacesSearch coordinates={meal.coordinates} area={meal.area} />
      </div>
    </div>
  );
}
