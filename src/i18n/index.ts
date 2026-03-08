import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';

const savedLang = localStorage.getItem('i18nextLng');
const browserLang = navigator.language?.substring(0, 2) || 'ko';

// Map browser language to supported locale
function resolveLocale(lang: string): string {
  if (lang === 'ko') return 'ko';
  if (lang === 'ja') return 'ja';
  return 'en';
}

const defaultLng = savedLang || resolveLocale(browserLang);

export const SUPPORTED_LOCALES = [
  { code: 'ko', label: '한국어', short: 'KO' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ja', label: '日本語', short: 'JA' },
] as const;

export const loadLocale = async (lng: string) => {
  if (lng === 'ko') return ko;
  if (lng === 'ja') {
    const ja = await import('./locales/ja.json');
    return ja.default;
  }
  const en = await import('./locales/en.json');
  return en.default;
};

// Always bundle Korean so there's never an empty-resource state
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

// If default language is not Korean, load it immediately
if (defaultLng !== 'ko') {
  loadLocale(defaultLng).then((translation) => {
    i18n.addResourceBundle(defaultLng, 'translation', translation, true, true);
    i18n.changeLanguage(defaultLng);
  });
}

// Persist language choice
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
