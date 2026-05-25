import { useState, useEffect } from 'react';

// Re-renders subscribers every 30 seconds so disguise reveals happen promptly
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function isDisguised(revealAt, now) {
  return now < new Date(revealAt);
}
