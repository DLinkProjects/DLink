import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from '@/locales/zh/translation.json';
import en from '@/locales/en/translation.json';

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: zh,
      },
      en: {
        translation: en,
      },
    },
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
    },
  });

export default i18n;
