'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

import mn from '../i18n/locales/mn.json';
import en from '../i18n/locales/en.json';
import ru from '../i18n/locales/ru.json';
import zh from '../i18n/locales/zh.json';

const dictionaries: Record<string, any> = { mn, en, ru, zh };

export type Language = 'mn' | 'en' | 'ru' | 'zh';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tDynamic: (namespace: string, key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('mn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language from cookies or localStorage
    const savedLang = Cookies.get('prisonercode-lang') as Language;
    if (savedLang && dictionaries[savedLang]) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set('prisonercode-lang', lang, { expires: 365 });
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = dictionaries[language];
    for (const key of keys) {
      if (current[key] === undefined) {
        return path; // Fallback to path if not found
      }
      current = current[key];
    }
    return current as string;
  };

  const tDynamic = (namespace: string, key: string, fallback: string): string => {
    const ns = dictionaries[language]?.[namespace];
    if (ns && ns[key] !== undefined) {
      return ns[key];
    }
    return fallback;
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language, setLanguage, t, tDynamic }}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
