import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from '../utils/constants';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(THEMES.light);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@app_theme');
      if (savedTheme) {
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
        setTheme(isDark ? THEMES.dark : THEMES.light);
      } else {
        // Use device theme as default
        const isDark = deviceTheme === 'dark';
        setIsDarkMode(isDark);
        setTheme(isDark ? THEMES.dark : THEMES.light);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? THEMES.dark : THEMES.light);
    await AsyncStorage.setItem('@app_theme', newMode ? 'dark' : 'light');
  };

  const setThemeMode = async (mode) => {
    const isDark = mode === 'dark';
    setIsDarkMode(isDark);
    setTheme(isDark ? THEMES.dark : THEMES.light);
    await AsyncStorage.setItem('@app_theme', mode);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDarkMode, 
        toggleTheme, 
        setThemeMode,
        loading 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};