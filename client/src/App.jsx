import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import TravelerPicker from './components/TravelerPicker.jsx';
import Home from './pages/Home.jsx';
import Itinerary from './pages/Itinerary.jsx';
import Restaurants from './pages/Restaurants.jsx';
import Suggestions from './pages/Suggestions.jsx';
import QuickRef from './pages/QuickRef.jsx';
import Activity from './pages/Activity.jsx';

export const TravelerCtx = createContext(null);
export const useTraveler = () => useContext(TravelerCtx);

export default function App() {
  const [traveler, setTraveler] = useState(() => localStorage.getItem('nyc2026_traveler') || '');

  useEffect(() => {
    if (traveler) localStorage.setItem('nyc2026_traveler', traveler);
  }, [traveler]);

  if (!traveler) {
    return <TravelerPicker onSelect={setTraveler} />;
  }

  return (
    <TravelerCtx.Provider value={{ traveler, setTraveler }}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 pb-nav">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/quickref" element={<QuickRef />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <NavBar />
      </BrowserRouter>
    </TravelerCtx.Provider>
  );
}
