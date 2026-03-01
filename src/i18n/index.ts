import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';

const savedLang = localStorage.getItem('i18nextLng');
const browserLang = navigator.language?.substring(0, 2) || 'ko';
const defaultLng = savedLang || (browserLang === 'ko' ? 'ko' : 'en');

export const loadLocale = async (lng: string) => {
  if (lng === 'ko') return ko;
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

// If default language is English, load it immediately
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
