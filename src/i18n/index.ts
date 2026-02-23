import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';

// Detect if user's browser language is Korean
const browserLang = navigator.language || (navigator as any).userLanguage || '';
const isKorean = browserLang.startsWith('ko');

// Check localStorage for manual override, otherwise use detection logic
const savedLang = localStorage.getItem('i18nextLng');
const defaultLng = savedLang || (isKorean ? 'ko' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja },
      zh: { translation: zh },
    },
    lng: defaultLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
