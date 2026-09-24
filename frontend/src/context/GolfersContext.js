import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@golf_golfers';

const GolfersContext = createContext(null);

export function GolfersProvider({ children }) {
  const [golfers, setGolfers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setGolfers(JSON.parse(raw));
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  async function persist(updated) {
    setGolfers(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function addGolfer(name, currentGolfers = golfers) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const duplicate = currentGolfers.some(
      (g) => g.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) return;
    const newGolfer = { id: Date.now().toString(), name: trimmed };
    const updated = [...currentGolfers, newGolfer];
    persist(updated);
  }

  function deleteGolfer(id) {
    const updated = golfers.filter((g) => g.id !== id);
    persist(updated);
  }

  return (
    <GolfersContext.Provider value={{ golfers, loaded, addGolfer, deleteGolfer }}>
      {children}
    </GolfersContext.Provider>
  );
}

export function useGolfers() {
  return useContext(GolfersContext);
}
