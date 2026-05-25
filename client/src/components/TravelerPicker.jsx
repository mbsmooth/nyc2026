import { useState, useRef } from 'react';
import { TRAVELERS } from '../data/itinerary.js';

const PASSWORD = 'Bryant';

const avatars = { Michael: '👨', Arly: '👧', Avaya: '👧', Kinsley: '👧' };
const colors = {
  Michael: 'from-blue-600 to-blue-800',
  Arly: 'from-purple-500 to-pink-600',
  Avaya: 'from-rose-500 to-pink-600',
  Kinsley: 'from-amber-500 to-orange-600',
};

export default function TravelerPicker({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  function pickName(name) {
    setSelected(name);
    setPw('');
    setError(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submit(e) {
    e.preventDefault();
    if (pw === PASSWORD) {
      onSelect(selected);
    } else {
      setError(true);
      setPw('');
      inputRef.current?.focus();
    }
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-nyc-blue to-slate-900 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{avatars[selected]}</div>
          <h1 className="text-white text-2xl font-bold">Hey, {selected}!</h1>
          <p className="text-blue-300 mt-1 text-sm">Enter the password to continue</p>
        </div>

        <form onSubmit={submit} className="w-full max-w-xs space-y-3">
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl text-slate-900 text-center text-lg font-semibold focus:outline-none ${
              error ? 'border-2 border-red-400 bg-red-50' : 'bg-white'
            }`}
          />
          {error && (
            <p className="text-red-300 text-sm text-center">Incorrect password — try again</p>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white text-base transition-all active:scale-95 bg-gradient-to-br ${colors[selected]}`}
          >
            Let's go →
          </button>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="w-full py-2 text-blue-300 text-sm hover:text-white transition-colors"
          >
            ← Back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-nyc-blue to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🗽</div>
        <h1 className="text-white text-3xl font-bold tracking-tight">NYC 2026</h1>
        <p className="text-blue-200 mt-1 text-lg">June 9 – 12</p>
        <p className="text-blue-300 mt-4 text-sm">Who are you?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {TRAVELERS.map(name => (
          <button
            key={name}
            onClick={() => pickName(name)}
            className={`bg-gradient-to-br ${colors[name]} rounded-2xl p-6 text-white font-bold text-xl flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-transform`}
          >
            <span className="text-4xl">{avatars[name]}</span>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
