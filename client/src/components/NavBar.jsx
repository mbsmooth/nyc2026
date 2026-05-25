import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/itinerary', icon: '📅', label: 'Schedule' },
  { to: '/restaurants', icon: '🍽️', label: 'Eat' },
  { to: '/suggestions', icon: '💡', label: 'Ideas' },
  { to: '/quickref', icon: '📋', label: 'Info' },
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-bottom z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-blue-700' : 'text-slate-500'
              }`
            }
          >
            <span className="text-xl mb-0.5">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
