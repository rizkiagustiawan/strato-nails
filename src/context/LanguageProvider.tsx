import { useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '../i18n/translations';
import { LanguageContext } from './LanguageContext';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('language');
      if (saved === 'en' || saved === 'id') return saved;
    } catch {
      // localStorage not available
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch {
      // localStorage not available
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    let text: string = translations[language][key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
