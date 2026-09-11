'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Language = 'de' | 'en';
const LanguageContext = createContext({ lang: 'de' as Language, toggle: () => {}, t: (de: string, en: string) => de });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('de');
  useEffect(() => { try { const value = new URLSearchParams(location.search).get('lang') || localStorage.getItem('story-language'); if (value === 'en') setLang('en'); } catch {} }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const toggle = () => setLang(old => { const value = old === 'de' ? 'en' : 'de'; try { localStorage.setItem('story-language', value); } catch {} return value; });
  return <LanguageContext.Provider value={{lang, toggle, t: (de, en) => lang === 'de' ? de : en}}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
