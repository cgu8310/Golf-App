import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../config';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({ name: '', homeClub: '', targetHandicap: null });

  useEffect(() => {
    fetch(`${API_URL}/api/profile`)
      .then((r) => r.json())
      .then((data) => setProfile((prev) => ({ ...prev, ...data })))
      .catch(console.error);
  }, []);

  async function updateProfile(fields) {
    const res = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const updated = await res.json();
    setProfile(updated);
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
