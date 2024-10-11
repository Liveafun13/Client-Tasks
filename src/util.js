export const API_BASE_URL = 'http://localhost:3000/api/v1'; 
import { useState, useEffect } from 'react';


export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const currentValue = localStorage.getItem(key);
    return currentValue ? JSON.parse(currentValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue]; 
};
