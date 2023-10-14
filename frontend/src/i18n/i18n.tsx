import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from '@/locales/zh/translation.json';

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
    },
    resources: {
      'zh-CN': {
        translation: zh,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
    },
  });

export default i18n;
