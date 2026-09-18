import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../config';
import { calculateHandicapIndex } from '../hooks/useHandicap';

const RoundsContext = createContext(null);

export function RoundsProvider({ children }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/rounds`)
      .then((r) => r.json())
      .then(setRounds)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function addRound(round) {
    const res = await fetch(`${API_URL}/api/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(round),
    });
    const newRound = await res.json();
    setRounds((prev) => [...prev, newRound]);
  }

  async function deleteRound(id) {
    await fetch(`${API_URL}/api/rounds/${id}`, { method: 'DELETE' });
    setRounds((prev) => prev.filter((r) => r.id !== id));
  }

  const handicapIndex = calculateHandicapIndex(rounds);

  return (
    <RoundsContext.Provider value={{ rounds, addRound, deleteRound, handicapIndex, loading }}>
      {children}
    </RoundsContext.Provider>
  );
}

export function useRounds() {
  return useContext(RoundsContext);
}
