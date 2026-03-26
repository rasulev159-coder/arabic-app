import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru_common       from './locales/ru/common.json';
import ru_learn        from './locales/ru/learn.json';
import ru_achievements from './locales/ru/achievements.json';
import uz_common       from './locales/uz/common.json';
import uz_learn        from './locales/uz/learn.json';
import uz_achievements from './locales/uz/achievements.json';
import en_common       from './locales/en/common.json';
import en_learn        from './locales/en/learn.json';
import en_achievements from './locales/en/achievements.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { common: ru_common, learn: ru_learn, achievements: ru_achievements },
    uz: { common: uz_common, learn: uz_learn, achievements: uz_achievements },
    en: { common: en_common, learn: en_learn, achievements: en_achievements },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  ns: ['common', 'learn', 'achievements'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
