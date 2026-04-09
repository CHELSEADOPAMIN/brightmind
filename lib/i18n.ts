import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import zh from '@/locales/zh.json';

const deviceLanguage = Localization.getLocales()[0]?.languageCode;
const fallbackLanguage = deviceLanguage && ['en', 'zh', 'fr', 'es'].includes(deviceLanguage) ? deviceLanguage : 'en';

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: fallbackLanguage,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    fr: { translation: fr },
    es: { translation: es },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
