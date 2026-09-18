import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../config';

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then((r) => r.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  async function addCourse(course) {
    const res = await fetch(`${API_URL}/api/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    const newCourse = await res.json();
    setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  }

  async function deleteCourse(id) {
    await fetch(`${API_URL}/api/courses/${id}`, { method: 'DELETE' });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <CoursesContext.Provider value={{ courses, addCourse, deleteCourse }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
