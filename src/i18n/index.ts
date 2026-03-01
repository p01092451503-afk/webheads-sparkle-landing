import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLang = localStorage.getItem('i18nextLng');
const browserLang = navigator.language?.substring(0, 2) || 'ko';
const defaultLng = savedLang || (browserLang === 'ko' ? 'ko' : 'en');

const loadLocale = async (lng: string) => {
  if (lng === 'ko') {
    const ko = await import('./locales/ko.json');
    return ko.default;
  }
  const en = await import('./locales/en.json');
  return en.default;
};

const translation = await loadLocale(defaultLng);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      [defaultLng]: { translation },
    },
    lng: defaultLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

// Persist language choice
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export { loadLocale };
export default i18n;
