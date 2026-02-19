import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES } from '../utils/constants';
import i18n from '../utils/i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('@app_language');
      if (savedLang) {
        setCurrentLanguage(savedLang);
        i18n.changeLanguage(savedLang);
      } else {
        // Default to English
        setCurrentLanguage('en');
        i18n.changeLanguage('en');
      }
    } catch (error) {
      console.log('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (langCode) => {
    try {
      setCurrentLanguage(langCode);
      i18n.changeLanguage(langCode);
      await AsyncStorage.setItem('@app_language', langCode);
    } catch (error) {
      console.log('Error changing language:', error);
    }
  };

  const translate = (key) => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage,
        changeLanguage,
        translate,
        loading,
        languages: LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};