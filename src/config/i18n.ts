import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AppConfig } from "./app.config";
import translationEN from "./locales/en/translation.json";
import translationSL from "./locales/sl/translation.json";

export const i18nResources = {
  en: {
    translation: translationEN,
  },
  sl: {
    translation: translationSL,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  fallbackLng: "en",
  debug: AppConfig.i18nextDebug,
  resources: i18nResources,
  lng: "en",
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
