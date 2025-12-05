import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useLocalStorage } from "./useLocalStorage";

export const defaultLanguage = "en";

export const useLanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const { value, set, isInitialLoading } = useLocalStorage({
    key: "language",
    schema: z.string(),
  });

  useEffect(() => {
    if (isInitialLoading) {
      return;
    }

    if (value) {
      i18n.changeLanguage(value);
    } else {
      i18n.changeLanguage(defaultLanguage);
    }
  }, [value, i18n, isInitialLoading]);

  const languages = [
    { label: t("shared.languages.slovenian"), value: "sl" },
    { label: t("shared.languages.english"), value: "en" },
  ];

  const changeLanguage = (language: string) => {
    set(language);
  };

  return {
    languages,
    changeLanguage,
  };
};
