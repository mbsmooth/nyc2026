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
  const [customOptions, setCustomOptions] = useState([]);

  const meal = MEALS.find(m => m.id === activeMeal) || MEALS[0];

  const loadVotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/votes/${meal.id}`);
      if (res.ok) setVoteData(await res.json());
    } catch {}
  }, [meal.id]);

  const loadCustomOptions = useCallback(async () => {
    try {
      const res = await fetch(`/api/meal-options/${meal.id}`);
      if (res.ok) setCustomOptions(await res.json());
    } catch {}
  }, [meal.id]);

  useEffect(() => {
    setVoteData({});
    setCustomOptions([]);
    loadVotes();
    loadCustomOptions();
  }, [loadVotes, loadCustomOptions]);

  const [localVotes, setLocalVotes] = useState({});
  const myVote = voteData.byTraveler?.[traveler] ?? localVotes[meal.id]?.[traveler] ?? null;
  const tally = voteData.tally || {};
  const totalVoters = Object.values(tally).reduce((a, b) => a + b, 0);
  const byTraveler = voteData.byTraveler || localVotes[meal.id] || {};

  async function handleVote(optionIndex) {
    const isUnvote = optionIndex === myVote;
    setSaving(true);

    // optimistic update
    setLocalVotes(prev => {
      const mealVotes = { ...(prev[meal.id] || {}) };
      if (isUnvote) delete mealVotes[traveler];
      else mealVotes[traveler] = optionIndex;
      return { ...prev, [meal.id]: mealVotes };
    });
    if (isUnvote) {
      setVoteData(prev => {
        const bt = { ...(prev.byTraveler || {}) };
        delete bt[traveler];
        return { ...prev, byTraveler: bt };
      });
    }

    try {
      if (isUnvote) {
        await fetch(`/api/votes/${meal.id}/${traveler}`, { method: 'DELETE' });
      } else {
        const res = await fetch('/api/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mealId: meal.id, optionIndex, traveler }),
        });
        if (res.ok) {
          const optionName = typeof optionIndex === 'number'
            ? meal.options[optionIndex]?.name
            : customOptions.find(o => o._id === optionIndex)?.name;
          fetch('/api/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              traveler,
              action: 'vote',
              detail: `Voted for ${optionName} — ${meal.dayLabel} ${meal.meal}`,
            }),
          }).catch(() => {});
        }
      }
      await loadVotes();
    } catch {
      // keep optimistic state
    } finally {
      setSaving(false);
    }
  }

  async function handleAddOption(place) {
    try {
      const res = await fetch('/api/meal-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealId: meal.id,
          name: place.name,
          address: place.address,
          rating: place.rating,
          mapsUrl: place.mapsUrl,
          addedBy: traveler,
          placeId: place.placeId,
        }),
      });
      if (res.status === 409) return 'duplicate';
      if (!res.ok) return false;
      const newOpt = await res.json();
      setCustomOptions(prev => [...prev, newOpt]);
      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traveler,
          action: 'suggest',
          detail: `Added "${place.name}" to ${meal.dayLabel} ${meal.meal} options`,
        }),
      }).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  async function removeCustomOption(id) {
    setCustomOptions(prev => prev.filter(o => o._id !== id));
    try { await fetch(`/api/meal-options/${id}`, { method: 'DELETE' }); } catch {}
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Meal tabs */}
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
                const optionName = typeof idx === 'number'
                  ? meal.options[idx]?.name
                  : customOptions.find(o => o._id === idx)?.name ?? `Custom`;
                return (
                  <div key={name} className="flex items-center gap-1 text-xs bg-slate-50 rounded-full px-2 py-1">
                    <span>{avatars[name]}</span>
                    <span className="font-medium text-slate-700">{name}:</span>
                    <span className="text-slate-600">{optionName ?? `#${idx + 1}`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Static options */}
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

        {/* Custom options added from search */}
        {customOptions.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1">Added by the group</div>
            {customOptions.map(opt => (
              <RestaurantCard
                key={opt._id}
                option={{
                  name: opt.name,
                  address: opt.address,
                  rating: opt.rating,
                  mapsUrl: opt.mapsUrl,
                  vibe: `Added by ${opt.addedBy}`,
                }}
                index={opt._id}
                votes={tally}
                myVote={myVote}
                onVote={handleVote}
                totalVoters={totalVoters}
                onRemove={opt.addedBy === traveler ? () => removeCustomOption(opt._id) : undefined}
              />
            ))}
          </div>
        )}

        {/* Find alternatives */}
        <PlacesSearch
          coordinates={meal.coordinates}
          area={meal.area}
          mealId={meal.id}
          traveler={traveler}
          onAdd={handleAddOption}
        />
      </div>
    </div>
  );
}
