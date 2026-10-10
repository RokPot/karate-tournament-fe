import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// eslint-disable-next-line import/no-self-import
import "@/config/i18n";

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    fallbackLng: "en",
    debug: AppConfig.i18nextDebug,
    resources: i18nResources,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
