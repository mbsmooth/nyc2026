import { Link } from 'react-router-dom';
import { useTraveler } from '../App.jsx';
import CountdownBanner from '../components/CountdownBanner.jsx';
import { TRIP, FLIGHTS, TRAVELERS } from '../data/itinerary.js';

const avatars = { Michael: '👨', Arly: '👧', Avaya: '👧', Kinsley: '👧' };
const avatarColors = {
  Michael: 'bg-blue-100 text-blue-700',
  Arly: 'bg-purple-100 text-purple-700',
  Avaya: 'bg-rose-100 text-rose-700',
  Kinsley: 'bg-amber-100 text-amber-700',
};

export default function Home() {
  const { traveler, setTraveler } = useTraveler();

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            🗽 NYC 2026
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">June 9 – 12</p>
        </div>
        <button
          onClick={() => setTraveler('')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${avatarColors[traveler]}`}
        >
          <span>{avatars[traveler]}</span>
          {traveler}
        </button>
      </div>

      {/* Countdown */}
      <CountdownBanner />

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/itinerary" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 active:scale-95 transition-transform">
          <span className="text-3xl">📅</span>
          <div className="font-bold text-slate-900">Schedule</div>
          <div className="text-xs text-slate-500">Day-by-day itinerary</div>
        </Link>
        <Link to="/restaurants" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 active:scale-95 transition-transform">
          <span className="text-3xl">🍽️</span>
          <div className="font-bold text-slate-900">Restaurants</div>
          <div className="text-xs text-slate-500">Vote + find alternatives</div>
        </Link>
        <Link to="/suggestions" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 active:scale-95 transition-transform">
          <span className="text-3xl">💡</span>
          <div className="font-bold text-slate-900">Suggestions</div>
          <div className="text-xs text-slate-500">Add your ideas</div>
        </Link>
        <Link to="/quickref" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 active:scale-95 transition-transform">
          <span className="text-3xl">📋</span>
          <div className="font-bold text-slate-900">Info & Refs</div>
          <div className="text-xs text-slate-500">Confirmation numbers</div>
        </Link>
      </div>

      {/* Travelers */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <h2 className="font-bold text-slate-900 mb-3">Travelers</h2>
        <div className="flex gap-2 flex-wrap">
          {TRAVELERS.map(name => (
            <div key={name} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${avatarColors[name]}`}>
              {avatars[name]} {name}
            </div>
          ))}
        </div>
      </div>

      {/* Flight Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <h2 className="font-bold text-slate-900">Flights</h2>
        <div className="space-y-2">
          <div className="flex items-start justify-between text-sm">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">✈️ {FLIGHTS.outbound.flight} — Jun 9</div>
              <div className="text-slate-500 text-xs">Leave home {FLIGHTS.outbound.leaveHome} · Board {FLIGHTS.outbound.boarding}</div>
              <div className="text-slate-500 text-xs">Departs {FLIGHTS.outbound.departs} → Arrives {FLIGHTS.outbound.arrives}</div>
            </div>
            <div className="font-mono text-xs font-bold text-blue-700 shrink-0">{FLIGHTS.outbound.confirmation}</div>
          </div>
          <div className="border-t border-slate-50" />
          <div className="flex items-start justify-between text-sm">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">✈️ {FLIGHTS.return.flight} — Jun 12</div>
              <div className="text-slate-500 text-xs">Board {FLIGHTS.return.boarding} · Departs 3:09 PM EST</div>
              <div className="text-slate-500 text-xs">{FLIGHTS.return.leg1}</div>
              <div className="text-slate-400 text-xs">Layover GSP ~1h 29m · {FLIGHTS.return.leg2}</div>
              <div className="text-xs font-semibold text-green-700 mt-1">🏠 Home by {FLIGHTS.return.arrivesDFW}</div>
            </div>
            <div className="font-mono text-xs font-bold text-blue-700 shrink-0">{FLIGHTS.return.confirmation}</div>
          </div>
        </div>
      </div>

      {/* Hotel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <h2 className="font-bold text-slate-900 mb-2">Hotel</h2>
        <div className="text-sm font-semibold text-slate-800">{TRIP.hotel.name}</div>
        <div className="text-sm text-slate-500">{TRIP.hotel.address}</div>
        <div className="mt-2 space-y-1">
          {TRIP.hotel.bookings.map(b => (
            <div key={b.id} className="text-xs text-slate-600">
              #{b.id} · {b.checkIn} – {b.checkOut}
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-green-700 bg-green-50 rounded-lg p-2">
          ✅ {TRIP.hotel.note}
        </div>
      </div>

      <div className="h-2" />
    </div>
  );
}
