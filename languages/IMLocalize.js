import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import en from "./en";
import ar from "./ar";

const LANGUAGES = {
  en,
  ar,
};

i18n
  // detect language
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    lng: "ar",
    fallbackLng: "ar",
    debug: false,
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
