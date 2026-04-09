import { LETTERS, getLetterName, Language } from '@arabic/shared';

// Letter-specific answers
export function getLetterInfo(code: string, lang: Language): string | null {
  const letter = LETTERS.find(l => l.code === code);
  if (!letter) return null;
  const name = getLetterName(letter, lang);
  const forms = `${letter.iso} | ${letter.ini} | ${letter.med} | ${letter.fin}`;

  const info = {
    uz: `${name} harfi:\n\nTranskripsiya: ${letter.transcription}\nShakllar: ${forms}\n\nAlohida | Boshida | O'rtada | Oxirida`,
    ru: `Буква ${name}:\n\nТранскрипция: ${letter.transcription}\nФормы: ${forms}\n\nОтдельно | Начало | Середина | Конец`,
    en: `Letter ${name}:\n\nTranscription: ${letter.transcription}\nForms: ${forms}\n\nIsolated | Initial | Medial | Final`,
  };
  return info[lang];
}

// Non-connecting letters info
const NON_CONNECTING = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

// Similar letter groups
const SIMILAR_GROUPS = [
  { letters: 'ب ت ث', diff: { uz: "Farqi nuqtalarda: ب pastda 1, ت tepada 2, ث tepada 3", ru: "Разница в точках: ب снизу 1, ت сверху 2, ث сверху 3", en: "Difference is dots: ب 1 below, ت 2 above, ث 3 above" } },
  { letters: 'ج ح خ', diff: { uz: "ج ichida nuqta, ح nuqtasiz, خ tepasida nuqta", ru: "ج точка внутри, ح без точки, خ точка сверху", en: "ج dot inside, ح no dot, خ dot above" } },
  { letters: 'د ذ', diff: { uz: "ذ tepasida nuqta bor, د yo'q", ru: "ذ с точкой сверху, د без", en: "ذ has dot above, د doesn't" } },
  { letters: 'ر ز', diff: { uz: "ز tepasida nuqta bor, ر yo'q", ru: "ز с точкой, ر без", en: "ز has dot, ر doesn't" } },
  { letters: 'س ش', diff: { uz: "ش tepasida 3 nuqta bor, س yo'q", ru: "ش с тремя точками, س без", en: "ش has 3 dots above, س doesn't" } },
  { letters: 'ص ض', diff: { uz: "ض tepasida nuqta bor, ص yo'q", ru: "ض с точкой, ص без", en: "ض has dot above, ص doesn't" } },
  { letters: 'ط ظ', diff: { uz: "ظ tepasida nuqta bor, ط yo'q", ru: "ظ с точкой, ط без", en: "ظ has dot above, ط doesn't" } },
  { letters: 'ع غ', diff: { uz: "غ tepasida nuqta bor, ع yo'q", ru: "غ с точкой, ع без", en: "غ has dot above, ع doesn't" } },
  { letters: 'ف ق', diff: { uz: "ف tepasida 1 nuqta, ق tepasida 2 nuqta", ru: "ف 1 точка сверху, ق 2 точки сверху", en: "ف 1 dot above, ق 2 dots above" } },
];

// FAQ database - common questions and answers
export interface FAQ {
  keywords: string[];
  answerUz: string;
  answerRu: string;
  answerEn: string;
}

export const FAQS: FAQ[] = [
  // HARAKAT
  { keywords: ['fatha', 'фатха', 'harakat', 'огласовк', 'vowel mark'],
    answerUz: "Harakatlar — harflar ustiga yoki ostiga qo'yiladigan belgilar:\n\n◆ Fatha (َ) — 'a' tovushi. Harf ustida chiziqcha.\n◆ Kasra (ِ) — 'i' tovushi. Harf ostida chiziqcha.\n◆ Damma (ُ) — 'u' tovushi. Harf ustida aylancha.\n◆ Sukun (ْ) — tovushsiz. Harf ustida doiracha.",
    answerRu: "Огласовки — знаки над и под буквами:\n\n◆ Фатха (َ) — звук 'а'. Чёрточка сверху.\n◆ Касра (ِ) — звук 'и'. Чёрточка снизу.\n◆ Дамма (ُ) — звук 'у'. Кружок сверху.\n◆ Сукун (ْ) — без звука. Кружок сверху.",
    answerEn: "Vowel marks — signs above and below letters:\n\n◆ Fatha (َ) — 'a' sound. Dash above.\n◆ Kasra (ِ) — 'i' sound. Dash below.\n◆ Damma (ُ) — 'u' sound. Loop above.\n◆ Sukun (ْ) — no vowel. Circle above." },

  // SHADDA
  { keywords: ['shadda', 'шадда', 'ikkilash', 'удвоен', 'double'],
    answerUz: "Shadda (ّ) — harfni ikki marta o'qish belgisi.\n\nMasalan: رَبّ = rab-b (ikki 'b'), عَلَّمَ = al-la-ma (ikki 'l').\n\nQoida: shaddali harf avval sukunli, keyin harakatli o'qiladi.",
    answerRu: "Шадда (ّ) — знак удвоения буквы.\n\nНапример: رَبّ = раб-б (два 'б'), عَلَّمَ = ал-ла-ма (два 'л').\n\nПравило: буква с шаддой читается сначала с сукуном, потом с огласовкой.",
    answerEn: "Shadda (ّ) — letter doubling sign.\n\nExample: رَبّ = rab-b (two 'b'), عَلَّمَ = al-la-ma (two 'l').\n\nRule: letter with shadda is read first with sukun, then with vowel." },

  // TANWIN
  { keywords: ['tanwin', 'танвин', 'tanvin', 'nunation'],
    answerUz: "Tanvin — so'z oxiridagi ikkilangan harakat:\n\n◆ Fathatain (ً) — '-an' tovushi\n◆ Kasratain (ٍ) — '-in' tovushi\n◆ Dammatain (ٌ) — '-un' tovushi\n\nMasalan: كِتَابًا = kitaaban, كِتَابٍ = kitaabin, كِتَابٌ = kitaabun",
    answerRu: "Танвин — двойная огласовка в конце слова:\n\n◆ Фатхатайн (ً) — звук '-ан'\n◆ Касратайн (ٍ) — звук '-ин'\n◆ Дамматайн (ٌ) — звук '-ун'\n\nНапример: كِتَابًا = китаабан, كِتَابٍ = китаабин, كِتَابٌ = китаабун",
    answerEn: "Tanwin — double vowel mark at end of word:\n\n◆ Fathatain (ً) — '-an' sound\n◆ Kasratain (ٍ) — '-in' sound\n◆ Dammatain (ٌ) — '-un' sound\n\nExample: كِتَابًا = kitaaban, كِتَابٍ = kitaabin, كِتَابٌ = kitaabun" },

  // MADD
  { keywords: ['madd', 'мадд', 'cho\'zish', 'удлинен', 'elongat', 'long vowel'],
    answerUz: "Madd — tovushni cho'zish:\n\n◆ Fatha + Alif (ا) = 'aa' cho'ziladi. Masalan: بَاب = baab\n◆ Kasra + Ya (ي) = 'ii' cho'ziladi. Masalan: كَبِيْر = kabiir\n◆ Damma + Vov (و) = 'uu' cho'ziladi. Masalan: نُوْر = nuur",
    answerRu: "Мадд — удлинение звука:\n\n◆ Фатха + Алиф (ا) = 'аа'. Например: بَاب = бааб\n◆ Касра + Йа (ي) = 'ии'. Например: كَبِيْر = кабиир\n◆ Дамма + Вав (و) = 'уу'. Например: نُوْر = нуур",
    answerEn: "Madd — vowel elongation:\n\n◆ Fatha + Alif (ا) = 'aa'. Example: بَاب = baab\n◆ Kasra + Ya (ي) = 'ii'. Example: كَبِيْر = kabiir\n◆ Damma + Waw (و) = 'uu'. Example: نُوْر = nuur" },

  // SUN/MOON LETTERS
  { keywords: ['shamsiy', 'qamariy', 'солнеч', 'лунн', 'sun letter', 'moon letter', 'lam', 'лям', 'al-'],
    answerUz: "Quyosh va oy harflari — 'al' artikli qoidasi:\n\nQuyosh harflari: ت ث د ذ ر ز س ش ص ض ط ظ ل ن\n'al' dagi Lom o'qilMAYDI, keyingi harf ikkilanadi.\nMasalan: الشَّمْسُ = ash-shamsu\n\nOy harflari: ا ب ج ح خ ع غ ف ق ك م ه و ي\n'al' dagi Lom o'qilADI.\nMasalan: الْقَمَرُ = al-qamaru",
    answerRu: "Солнечные и лунные буквы — правило артикля 'аль':\n\nСолнечные: ت ث د ذ ر ز س ش ص ض ط ظ ل ن\nЛям НЕ читается, следующая удваивается.\nПример: الشَّمْسُ = аш-шамсу\n\nЛунные: ا ب ج ح خ ع غ ف ق ك م ه و ي\nЛям ЧИТАЕТСЯ.\nПример: الْقَمَرُ = аль-камару",
    answerEn: "Sun and moon letters — 'al' article rule:\n\nSun: ت ث د ذ ر ز س ش ص ض ط ظ ل ن\nLam is SILENT, next letter doubles.\nExample: الشَّمْسُ = ash-shamsu\n\nMoon: ا ب ج ح خ ع غ ف ق ك م ه و ي\nLam is PRONOUNCED.\nExample: الْقَمَرُ = al-qamaru" },

  // NON-CONNECTING
  { keywords: ['bog\'lanm', 'соедин', 'connect', 'bog\'lan', 'несоедин'],
    answerUz: "6 ta harf keyingi harfga BOG'LANMAYDI:\n\nا د ذ ر ز و\n\nBu harflardan keyin doim bo'shliq (uzilish) bo'ladi. Qolgan 22 harf ikki tomondan bog'lanadi.",
    answerRu: "6 букв НЕ СОЕДИНЯЮТСЯ с последующей:\n\nا د ذ ر ز و\n\nПосле этих букв всегда разрыв. Остальные 22 соединяются с обеих сторон.",
    answerEn: "6 letters DO NOT CONNECT to the next:\n\nا د ذ ر ز و\n\nThere's always a break after these. The other 22 connect from both sides." },

  // HOW TO START
  { keywords: ['boshlash', 'начать', 'start', 'qanday', 'как', 'how', 'boshla', 'нача'],
    answerUz: "Tavsiyam:\n\n1. Avval Alifbo sahifasida 28 harfni ko'rib chiqing\n2. Kartochkalar o'yinini o'ynang\n3. Muallim Soniy darsligining 1-bobini o'qing\n4. Testni yeching\n5. Har kuni kamida 10 daqiqa mashq qiling!",
    answerRu: "Рекомендую:\n\n1. Посмотрите все 28 букв на странице Алфавит\n2. Поиграйте в Карточки\n3. Прочитайте 1 главу Муаллим Сони\n4. Пройдите тест\n5. Занимайтесь минимум 10 минут каждый день!",
    answerEn: "I recommend:\n\n1. Browse all 28 letters on the Alphabet page\n2. Play Flashcards\n3. Read Chapter 1 of Muallim Soniy\n4. Take the quiz\n5. Practice at least 10 minutes every day!" },

  // DIFFERENCE BETWEEN SIMILAR LETTERS
  { keywords: ['farq', 'разниц', 'differ', 'o\'xshash', 'похож', 'similar', 'adashtir', 'путаю', 'confus'],
    answerUz: "O'xshash harflar va farqlari:\n\n" + SIMILAR_GROUPS.map(g => `${g.letters}: ${g.diff.uz}`).join('\n\n'),
    answerRu: "Похожие буквы и их отличия:\n\n" + SIMILAR_GROUPS.map(g => `${g.letters}: ${g.diff.ru}`).join('\n\n'),
    answerEn: "Similar letters and differences:\n\n" + SIMILAR_GROUPS.map(g => `${g.letters}: ${g.diff.en}`).join('\n\n') },
];

// Progress-based recommendations
export interface ProgressAdvice {
  conditionFn: (data: { knownCount: number; streakDays: number; weakLetters: string[]; totalSessions: number }) => boolean;
  adviceUz: string;
  adviceRu: string;
  adviceEn: string;
}

export const PROGRESS_ADVICE: ProgressAdvice[] = [
  {
    conditionFn: d => d.knownCount === 0,
    adviceUz: "Siz hali birorta harf o'rganmagansiz. Alifbo sahifasidan boshlang va kartochkalar o'yinini o'ynang!",
    adviceRu: "Вы ещё не выучили ни одной буквы. Начните с Алфавита и сыграйте в Карточки!",
    adviceEn: "You haven't learned any letters yet. Start with the Alphabet page and play Flashcards!",
  },
  {
    conditionFn: d => d.knownCount > 0 && d.knownCount < 10,
    adviceUz: "Siz {count} ta harf bildingiz — yaxshi boshlang'ich! Viktorina o'yinida o'zingizni sinab ko'ring. Maqsad: 10 ta harf!",
    adviceRu: "Вы знаете {count} букв — хорошее начало! Проверьте себя в Квизе. Цель: 10 букв!",
    adviceEn: "You know {count} letters — good start! Test yourself in Quiz. Goal: 10 letters!",
  },
  {
    conditionFn: d => d.knownCount >= 10 && d.knownCount < 20,
    adviceUz: "Zo'r natija! Endi Muallim Soniy darsligini o'qishni boshlang — u sizga harflarni so'zlarda ko'rishga yordam beradi.",
    adviceRu: "Отличный результат! Начните читать учебник Муаллим Сони — он поможет видеть буквы в словах.",
    adviceEn: "Great result! Start reading Muallim Soniy textbook — it'll help you see letters in words.",
  },
  {
    conditionFn: d => d.knownCount >= 20 && d.knownCount < 28,
    adviceUz: "Deyarli barchasini bildingiz! Zaif harflaringizni mashq qiling va Harf shakllari o'yinini o'ynang.",
    adviceRu: "Почти все знаете! Тренируйте слабые буквы и играйте в Формы букв.",
    adviceEn: "Almost there! Train your weak letters and play Letter Forms.",
  },
  {
    conditionFn: d => d.knownCount === 28,
    adviceUz: "Barcha 28 harfni bildingiz! Endi Muallim Soniy darsligini tugatishga harakat qiling va Qur'on rejimida mashq qiling.",
    adviceRu: "Вы знаете все 28 букв! Теперь пройдите учебник Муаллим Сони и практикуйте в режиме Коран.",
    adviceEn: "You know all 28 letters! Now complete the Muallim Soniy textbook and practice in Quran mode.",
  },
  {
    conditionFn: d => d.weakLetters.length > 0,
    adviceUz: "Zaif harflaringiz bor. \"Zaif harflarni mashq qilish\" sahifasiga o'ting!",
    adviceRu: "У вас есть слабые буквы. Перейдите на \"Тренировка слабых букв\"!",
    adviceEn: "You have weak letters. Go to \"Train Weak Letters\"!",
  },
  {
    conditionFn: d => d.streakDays === 0,
    adviceUz: "Bugun hali mashq qilmadingiz — seriyangizni yo'qotmang!",
    adviceRu: "Сегодня ещё не занимались — не потеряйте серию!",
    adviceEn: "You haven't practiced today — don't lose your streak!",
  },
];

// Match user message to FAQ or letter query
export function findAnswer(
  message: string,
  lang: Language,
  progressData?: { knownCount: number; streakDays: number; weakLetters: string[]; totalSessions: number },
): string {
  const msg = message.toLowerCase().trim();

  // Check if asking about specific letter
  for (const letter of LETTERS) {
    if (msg.includes(letter.code) ||
        msg.includes(letter.nameRu.toLowerCase()) ||
        msg.includes(letter.nameUz.toLowerCase()) ||
        msg.includes(letter.nameEn.toLowerCase())) {
      const info = getLetterInfo(letter.code, lang);
      // Check if asking about similar letters
      const group = SIMILAR_GROUPS.find(g => g.letters.includes(letter.code));
      if (group && (msg.includes('farq') || msg.includes('разниц') || msg.includes('differ') || msg.includes('o\'xshash') || msg.includes('похож'))) {
        return group.diff[lang];
      }
      if (info) return info;
    }
  }

  // Check FAQs
  for (const faq of FAQS) {
    if (faq.keywords.some(kw => msg.includes(kw.toLowerCase()))) {
      return lang === 'ru' ? faq.answerRu : lang === 'en' ? faq.answerEn : faq.answerUz;
    }
  }

  // Check if asking about progress
  if (msg.includes('progress') || msg.includes('прогресс') || msg.includes('natija') || msg.includes('maslahat') || msg.includes('совет') || msg.includes('advice') || msg.includes('nima qil') || msg.includes('что делать') || msg.includes('what should')) {
    if (progressData) {
      for (const advice of PROGRESS_ADVICE) {
        if (advice.conditionFn(progressData)) {
          let text = lang === 'ru' ? advice.adviceRu : lang === 'en' ? advice.adviceEn : advice.adviceUz;
          // Replace dynamic values
          text = text.replace('{count}', String(progressData.knownCount));
          return text;
        }
      }
    }
  }

  // Default response
  const defaults = {
    uz: "Men arab alifbosi bo'yicha savollarga javob bera olaman. Masalan:\n\n• Istalgan harf haqida so'rang (masalan: 'ب haqida')\n• 'Fatha nima?' kabi savollar\n• 'Maslahat ber' — men sizning natijangizga qarab tavsiya beraman\n• 'O'xshash harflar farqi' — qaysi harflar o'xshash",
    ru: "Я могу ответить на вопросы об арабском алфавите. Например:\n\n• Спросите о любой букве (например: 'расскажи про ب')\n• 'Что такое фатха?' и подобные вопросы\n• 'Дай совет' — я дам рекомендацию по вашему прогрессу\n• 'Разница похожих букв' — чем отличаются ب ت ث",
    en: "I can answer questions about the Arabic alphabet. For example:\n\n• Ask about any letter (e.g. 'tell me about ب')\n• 'What is fatha?' and similar questions\n• 'Give advice' — I'll recommend based on your progress\n• 'Similar letters difference' — how ب ت ث differ",
  };
  return defaults[lang];
}
