'use client';
import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
export type Language = 'de' | 'en';
const LanguageContext = createContext({ lang: 'de' as Language, toggle: () => {}, t: (de: string, en: string): string => de || en });
function subscribe(callback: () => void) {
 window.addEventListener('storage', callback);
 window.addEventListener('story-language-change', callback);
 return () => { window.removeEventListener('storage', callback); window.removeEventListener('story-language-change', callback); };
}
function snapshot(): Language {
 try { return (new URLSearchParams(location.search).get('lang') || localStorage.getItem('story-language')) === 'en' ? 'en' : 'de'; } catch { return 'de'; }
}
export function LanguageProvider({ children }: { children: ReactNode }) {
 const lang = useSyncExternalStore(subscribe, snapshot, () => 'de' as Language);
 useEffect(() => { document.documentElement.lang = lang; }, [lang]);
 const toggle = () => {
  const value = lang === 'de' ? 'en' : 'de';
  const url = new URL(location.href);
  url.searchParams.set('lang', value);
  history.replaceState(null, '', url);
  try { localStorage.setItem('story-language', value); } catch {}
  window.dispatchEvent(new Event('story-language-change'));
 };
 return <LanguageContext.Provider value={{lang, toggle, t: (de, en) => lang === 'de' ? de : en}}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
