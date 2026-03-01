import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLang = localStorage.getItem('i18nextLng');
const browserLang = navigator.language?.substring(0, 2) || 'ko';
const defaultLng = savedLang || (browserLang === 'ko' ? 'ko' : 'en');

export const loadLocale = async (lng: string) => {
  if (lng === 'ko') {
    const ko = await import('./locales/ko.json');
    return ko.default;
  }
  const en = await import('./locales/en.json');
  return en.default;
};

// Initialize with empty resources, then load asynchronously
i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: defaultLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

// Load default locale immediately
loadLocale(defaultLng).then((translation) => {
  i18n.addResourceBundle(defaultLng, 'translation', translation, true, true);
  // Force re-render with loaded translations
  i18n.changeLanguage(defaultLng);
});

// Persist language choice
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
