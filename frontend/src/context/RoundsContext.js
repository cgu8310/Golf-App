import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateHandicapIndex, scoreDifferential } from '../hooks/useHandicap';

const RoundsContext = createContext(null);

const STORAGE_KEY = '@golf_rounds';

export function RoundsProvider({ children }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) setRounds(JSON.parse(json));
      })
      .finally(() => setLoading(false));
  }, []);

  async function addRound(round) {
    const differential = scoreDifferential(
      round.adjustedGrossScore,
      round.courseRating,
      round.slopeRating
    );
    const newRound = {
      ...round,
      id: Date.now().toString(),
      differential: Math.round(differential * 10) / 10,
      date: round.date || new Date().toISOString(),
    };
    const updated = [...rounds, newRound];
    setRounds(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function deleteRound(id) {
    const updated = rounds.filter((r) => r.id !== id);
    setRounds(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
