export interface NotificationTemplate {
  key: string;
  daysMissed: number;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  bodyUz: string;
  bodyRu: string;
  bodyEn: string;
}

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    key: 'same_day',
    daysMissed: 0,
    titleUz: "Bugun hali mashq qilmadingiz! 📖",
    titleRu: "Сегодня ещё не занимались! 📖",
    titleEn: "You haven't practiced today! 📖",
    bodyUz: "Kunlik seriyangiz buzilishi mumkin! Atigi 5 daqiqa — va bugungi dars tayyor. Sizning 🔥 seriyangiz kutmoqda!",
    bodyRu: "Ваша серия может прерваться! Всего 5 минут — и урок на сегодня готов. Ваша 🔥 серия ждёт!",
    bodyEn: "Your streak might break! Just 5 minutes — and today's lesson is done. Your 🔥 streak is waiting!"
  },
  {
    key: 'day_1',
    daysMissed: 1,
    titleUz: "Sizni sog'indik! 😢",
    titleRu: "Мы скучаем! 😢",
    titleEn: "We miss you! 😢",
    bodyUz: "Kecha mashq qilmadingiz. Seriyangiz buzildi, lekin hali ham davom ettirish mumkin! Bitta dars — va siz qaytasiz 💪",
    bodyRu: "Вчера вы не занимались. Серия прервалась, но ещё можно продолжить! Один урок — и вы вернётесь 💪",
    bodyEn: "You missed yesterday. Your streak broke, but you can still continue! One lesson — and you're back 💪"
  },
  {
    key: 'day_3',
    daysMissed: 3,
    titleUz: "3 kun o'tdi... ⏰",
    titleRu: "Прошло 3 дня... ⏰",
    titleEn: "3 days have passed... ⏰",
    bodyUz: "Arab harflarini unutib qo'yayapsizmi? Xotira tez so'nadi — lekin 5 daqiqalik mashq hammasini qaytaradi! Qaytib keling 🌟",
    bodyRu: "Забываете арабские буквы? Память угасает быстро — но 5 минут практики всё вернут! Возвращайтесь 🌟",
    bodyEn: "Forgetting Arabic letters? Memory fades fast — but 5 minutes of practice brings it all back! Come back 🌟"
  },
  {
    key: 'day_7',
    daysMissed: 7,
    titleUz: "Bir hafta bo'ldi! 😔",
    titleRu: "Прошла неделя! 😔",
    titleEn: "It's been a week! 😔",
    bodyUz: "Bir hafta oldin siz {{knownCount}} ta harf bilardingiz. Ularni yo'qotmang! Bilimlaringiz hali bor — faqat bir mashq yetarli ✨",
    bodyRu: "Неделю назад вы знали {{knownCount}} букв. Не потеряйте их! Знания ещё с вами — нужна лишь одна тренировка ✨",
    bodyEn: "A week ago you knew {{knownCount}} letters. Don't lose them! Your knowledge is still there — just one session needed ✨"
  },
  {
    key: 'day_14',
    daysMissed: 14,
    titleUz: "Ikki hafta! Qaytib keling! 🙏",
    titleRu: "Две недели! Вернитесь! 🙏",
    titleEn: "Two weeks! Come back! 🙏",
    bodyUz: "Siz {{knownCount}} ta harfni o'rgangan edingiz — bu ajoyib natija! Buni yo'qotmang. Biz sizni kutmoqdamiz ❤️",
    bodyRu: "Вы выучили {{knownCount}} букв — это отличный результат! Не теряйте его. Мы ждём вас ❤️",
    bodyEn: "You learned {{knownCount}} letters — that's amazing! Don't lose it. We're waiting for you ❤️"
  },
  {
    key: 'day_30',
    daysMissed: 30,
    titleUz: "Bir oy o'tdi... 💔",
    titleRu: "Прошёл месяц... 💔",
    titleEn: "A month has passed... 💔",
    bodyUz: "Sizning o'quv yo'lingiz hali ham saqlanmoqda. Barcha natijalaringiz kutmoqda. Qaytib keling — boshidan boshlash shart emas, davom eting! 🕌",
    bodyRu: "Ваш учебный путь всё ещё сохранён. Все результаты ждут. Вернитесь — не нужно начинать сначала, просто продолжите! 🕌",
    bodyEn: "Your learning path is still saved. All results are waiting. Come back — no need to restart, just continue! 🕌"
  }
];
