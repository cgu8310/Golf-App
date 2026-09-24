import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateHandicapIndex } from '../hooks/useHandicap';

const STORAGE_KEY = '@golf_rounds';

const RoundsContext = createContext(null);

export function RoundsProvider({ children }) {
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => { if (raw) setRounds(JSON.parse(raw)); })
      .catch(console.error);
  }, []);

  async function persist(updated) {
    setRounds(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function addRound(round) {
    const newRound = { ...round, id: Date.now().toString(), date: round.date || new Date().toISOString() };
    await persist([...rounds, newRound]);
    return newRound;
  }

  async function deleteRound(id) {
    await persist(rounds.filter((r) => r.id !== id));
  }

  const handicapIndex = calculateHandicapIndex(rounds);

  return (
    <RoundsContext.Provider value={{ rounds, addRound, deleteRound, loading: false, handicapIndex }}>
      {children}
    </RoundsContext.Provider>
  );
}

export function useRounds() {
  return useContext(RoundsContext);
}
