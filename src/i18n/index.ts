import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ko from './locales/ko.json';

// Detect if user's browser language is Korean
const browserLang = navigator.language || (navigator as any).userLanguage || '';
const isKorean = browserLang.startsWith('ko');

// Check localStorage for manual override, otherwise use detection logic
const savedLang = localStorage.getItem('i18nextLng');
const defaultLng = savedLang || (isKorean ? 'ko' : 'en');

// Lazy loaders for non-default locales
const localeLoaders: Record<string, () => Promise<{ default: Record<string, any> }>> = {
  en: () => import('./locales/en.json'),
  ja: () => import('./locales/ja.json'),
  zh: () => import('./locales/zh.json'),
};

// Load a locale dynamically and add it to i18n
async function loadLocale(lng: string) {
  if (lng === 'ko' || i18n.hasResourceBundle(lng, 'translation')) return;
  const loader = localeLoaders[lng];
  if (!loader) return;
  const mod = await loader();
  i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
    },
    lng: defaultLng,
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
  });

// Preload locale before language switch so translations are ready
const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (lng?: string, callback?: any) => {
  if (lng) await loadLocale(lng);
  return originalChangeLanguage(lng, callback);
};

// If the default language is not Korean, load it immediately
if (defaultLng !== 'ko') {
  loadLocale(defaultLng);
}

// Persist language choice
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
