import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json'

const resources = {
  en: {
    translation: enTranslation
  }
};

// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;