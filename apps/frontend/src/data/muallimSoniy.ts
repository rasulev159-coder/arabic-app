export interface TextbookLesson {
  id: string;
  arabic: string;       // Arabic text/examples
  explanation: {
    uz: string;
    ru: string;
    en: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'match' | 'identify';
  questionUz: string;
  questionRu: string;
  questionEn: string;
  arabic?: string;      // Arabic text shown in question
  options?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
}

export interface TextbookChapter {
  id: string;
  order: number;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  icon: string;
  lessons: TextbookLesson[];
  quiz: QuizQuestion[];
}

export const MUALLIM_SONIY: TextbookChapter[] = [
  // CHAPTER 1: Letters with Harakat
  {
    id: 'ch1-harakat',
    order: 1,
    titleUz: "Harflar va harakatlar",
    titleRu: "Буквы и огласовки",
    titleEn: "Letters & Vowel Marks",
    descUz: "Arab harflarini fatha, kasra va damma bilan o'qishni o'rganing",
    descRu: "Научитесь читать арабские буквы с фатхой, касрой и даммой",
    descEn: "Learn to read Arabic letters with fatha, kasra and damma",
    icon: "📖",
    lessons: [
      {
        id: 'ch1-l1',
        arabic: 'اَ  اِ  اُ\nرَ  رِ  رُ\nزَ  زِ  زُ',
        explanation: {
          uz: "Fatha (َ) - 'a' tovushi, Kasra (ِ) - 'i' tovushi, Damma (ُ) - 'u' tovushi. Har bir harf bu uch harakat bilan o'qiladi.",
          ru: "Фатха (َ) - звук 'а', Касра (ِ) - звук 'и', Дамма (ُ) - звук 'у'. Каждая буква читается с тремя огласовками.",
          en: "Fatha (َ) - 'a' sound, Kasra (ِ) - 'i' sound, Damma (ُ) - 'u' sound. Each letter is read with these three vowel marks."
        }
      },
      {
        id: 'ch1-l2',
        arabic: 'اَزْ  اِزْ  اُزْ\nاَرْ  اِرْ  اُرْ',
        explanation: {
          uz: "Ikki harfli bo'g'inlar: birinchi harf harakatli, ikkinchi harf sukunli.",
          ru: "Двухбуквенные слоги: первая буква с огласовкой, вторая - с сукуном.",
          en: "Two-letter syllables: first letter has a vowel mark, second has sukun."
        }
      },
      {
        id: 'ch1-l3',
        arabic: 'مَ  مِ  مُ\nاَمْ  اِمْ  اُمْ  مُزْ  مُزْ  رُمْ\nاَمَرَ  اُمِرَ  اَمُرُ',
        explanation: {
          uz: "Mim harfi (م) harakatlar bilan. So'zlar tuzish: amara (buyurdi), umira (buyurildi), amuru (buyuraman).",
          ru: "Буква Мим (م) с огласовками. Составление слов: амара (приказал), умира (было приказано), амуру (приказываю).",
          en: "Letter Mim (م) with vowel marks. Building words: amara (commanded), umira (was commanded), amuru (I command)."
        }
      },
      {
        id: 'ch1-l4',
        arabic: 'تَ  تِ  تُ\nمُتْ  مِتْ  مُتْ  تَمُزْ  تَرَزَ\nذُرِتْ  اَمَرْتْ  مَرَزْتْ',
        explanation: {
          uz: "Ta harfi (ت) harakatlar bilan. So'z oxirida 't' sukuni bilan.",
          ru: "Буква Та (ت) с огласовками. В конце слов с сукуном 'т'.",
          en: "Letter Ta (ت) with vowel marks. At end of words with 't' sukun."
        }
      },
      {
        id: 'ch1-l5',
        arabic: 'نَ  نِ  نُ\nاَنْ  اِنْ  زَنْ  مَنْ  مِنْ  نُمْ\nاَنْتَ  نَشَتْ  اَنْتُمْ  نَمَشْتُمْ',
        explanation: {
          uz: "Nun harfi (ن) harakatlar bilan. 'Anta' (sen), 'antum' (sizlar) so'zlari.",
          ru: "Буква Нун (ن) с огласовками. Слова 'анта' (ты), 'антум' (вы).",
          en: "Letter Nun (ن) with vowel marks. Words 'anta' (you masc.), 'antum' (you plural)."
        }
      },
      {
        id: 'ch1-l6',
        arabic: 'يَ  يِ  يُ\nاَيْ  اَيُمْ  زَيْتْ  مَيْتْ  رَاَيْ  رَمْيْ\nيَمَنَ  مَرْيَمُ  مَيْزَرَ  مَيْمَنَ  اَيْمَنَ',
        explanation: {
          uz: "Ya harfi (ي) harakatlar bilan. Maryam, Yaman kabi so'zlar.",
          ru: "Буква Йа (ي) с огласовками. Слова Марьям, Йемен и другие.",
          en: "Letter Ya (ي) with vowel marks. Words like Maryam, Yemen."
        }
      },
      {
        id: 'ch1-l7',
        arabic: 'بَ  بِ  بُ\nاَبْ  اِبْنْ  بِنْتْ  بَيْنْ  رَتِبْ\nزَيْنَبْ  بَرْنَبْ  بَيْرَمْ  اَبْرَمْ  مِيْزَرْ',
        explanation: {
          uz: "Ba harfi (ب). Ibn (o'g'il), bint (qiz), bayn (orasida) so'zlari.",
          ru: "Буква Ба (ب). Слова ибн (сын), бинт (дочь), байн (между).",
          en: "Letter Ba (ب). Words ibn (son), bint (daughter), bayn (between)."
        }
      }
    ],
    quiz: [
      {
        id: 'ch1-q1',
        type: 'multiple_choice',
        questionUz: "Fatha qanday tovush beradi?",
        questionRu: "Какой звук даёт фатха?",
        questionEn: "What sound does fatha give?",
        options: [
          { text: "a", isCorrect: true },
          { text: "i", isCorrect: false },
          { text: "u", isCorrect: false },
          { text: "o", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q2',
        type: 'multiple_choice',
        questionUz: "Kasra qanday tovush beradi?",
        questionRu: "Какой звук даёт касра?",
        questionEn: "What sound does kasra give?",
        options: [
          { text: "a", isCorrect: false },
          { text: "i", isCorrect: true },
          { text: "u", isCorrect: false },
          { text: "e", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q3',
        type: 'multiple_choice',
        questionUz: "'بِنْتْ' so'zi nima ma'noni anglatadi?",
        questionRu: "Что означает слово 'بِنْتْ'?",
        questionEn: "What does 'بِنْتْ' mean?",
        options: [
          { text: "O'g'il / Сын / Son", isCorrect: false },
          { text: "Qiz / Дочь / Daughter", isCorrect: true },
          { text: "Ota / Отец / Father", isCorrect: false },
          { text: "Ona / Мать / Mother", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q4',
        type: 'multiple_choice',
        questionUz: "Damma qanday tovush beradi?",
        questionRu: "Какой звук даёт дамма?",
        questionEn: "What sound does damma give?",
        options: [
          { text: "a", isCorrect: false },
          { text: "i", isCorrect: false },
          { text: "u", isCorrect: true },
          { text: "o", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q5',
        type: 'identify',
        questionUz: "Quyidagi harfda qanday harakat bor?",
        questionRu: "Какая огласовка на этой букве?",
        questionEn: "What vowel mark is on this letter?",
        arabic: "بُ",
        options: [
          { text: "Fatha / Фатха", isCorrect: false },
          { text: "Kasra / Касра", isCorrect: false },
          { text: "Damma / Дамма", isCorrect: true },
          { text: "Sukun / Сукун", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 2: Word Building
  {
    id: 'ch2-words',
    order: 2,
    titleUz: "So'z tuzish",
    titleRu: "Составление слов",
    titleEn: "Word Building",
    descUz: "Harflarni birlashtirish va so'zlarni o'qishni o'rganing",
    descRu: "Научитесь соединять буквы и читать слова",
    descEn: "Learn to connect letters and read words",
    icon: "🔤",
    lessons: [
      {
        id: 'ch2-l1',
        arabic: 'كَمْ  كُمْ  كُنْ  كَيْ\nبَكُرْ  مَكُرْ  كَوْمْ  كَنْزْ  تَرُكُ\nكَتَبَ  يَكْتُبُ  تَرَكَ  يَتْرُكُ  كَتِيبُهُمْ',
        explanation: {
          uz: "Kof harfi (ك) bilan so'zlar. Kataba (yozdi), yaktub (yozadi), taraka (tark qildi).",
          ru: "Слова с буквой Каф (ك). Катаба (написал), яктуб (пишет), тарака (оставил).",
          en: "Words with Kaf (ك). Kataba (wrote), yaktub (writes), taraka (left)."
        }
      },
      {
        id: 'ch2-l2',
        arabic: 'لَ  لِ  لُ\nاَلْ  بَلْ  لَمْ  لَنْ  كُلْ\nتَوَلَ  كَرَمَ  كَمَلَ  اَنْزَلَ  اَلْزَمَ  اَكْمَلَ\nبُلْبُلْ  يَلْمَلِمْ  تَزَلْزَلَ  يَتَزَلْزَلُ  مُتَزَلْزِلْ',
        explanation: {
          uz: "Lom harfi (ل). 'Al' - ta'rif artikli. Bulbul, zalzala (zilzila) kabi so'zlar.",
          ru: "Буква Лям (ل). 'Аль' - определённый артикль. Слова бульбуль, залзала (землетрясение).",
          en: "Letter Lam (ل). 'Al' - definite article. Words bulbul, zalzala (earthquake)."
        }
      },
      {
        id: 'ch2-l3',
        arabic: 'هَبْ  هَمْ  هَلْ  هُوَ  هِيَ  هُمْ  زُهْرَةْ\nاَهَمَ  وَهَبَ  لَهَبْ  وَهَمْ  لَهُمْ  بِهِمْ\nمِنْهُ  مِنْهُمْ  اِلَيْهِ  اِلَيْهِمْ  اُمَهْلِهِمْ',
        explanation: {
          uz: "Ha harfi (ه). Huwa (u, erkak), hiya (u, ayol), hum (ular). Laham (ularga), bihi (unda).",
          ru: "Буква Ха (ه). Хува (он), хия (она), хум (они). Лахум (им), бихи (в нём).",
          en: "Letter Ha (ه). Huwa (he), hiya (she), hum (they). Lahum (to them), bihi (in it)."
        }
      },
      {
        id: 'ch2-l4',
        arabic: 'فَمْ  فَنْ  كَفْ  قَلَمْ  قُمْ  قِفْ  قَلَةْ\nرُزْقْ  قَنْ  قُلْ  قُمْ  قِفْ  قَلَةْ\nقَلْبُ  قَبْلُ  قَوْقُ  قَلَمْ  قَمَرْ  لَقَبْ  قُمْتُمُ\nقَلَبَ  قَبْلُ  قَوْقُ  قَلَمْ  قَمَرْ  لَقَبْ',
        explanation: {
          uz: "Fa (ف) va Qof (ق) harflari. Qalam (qalam), qamar (oy), qalb (yurak).",
          ru: "Буквы Фа (ف) и Каф (ق). Калам (перо), камар (луна), кальб (сердце).",
          en: "Letters Fa (ف) and Qaf (ق). Qalam (pen), qamar (moon), qalb (heart)."
        }
      },
      {
        id: 'ch2-l5',
        arabic: 'شَرِبَ  شَهْرُ  نَشْرُ  شُكْرُ  شَرَبْ\nبِشْرُ  شَرَبَ  شَهْرُ  نَشْرُ  شُكْرُ  شَرَبْ\nمَشْرَبْ  مَشْرِبْ  مَشْرَقْ  مُشْتَهِرْ  مُشْتَرَكْ',
        explanation: {
          uz: "Shin harfi (ش) va Sin harfi (س). Shariba (ichdi), shahr (oy), shukr (shukr).",
          ru: "Буквы Шин (ش) и Син (س). Шариба (пил), шахр (месяц), шукр (благодарность).",
          en: "Letters Shin (ش) and Sin (س). Shariba (drank), shahr (month), shukr (gratitude)."
        }
      }
    ],
    quiz: [
      {
        id: 'ch2-q1',
        type: 'multiple_choice',
        questionUz: "'كَتَبَ' so'zi nima ma'noni anglatadi?",
        questionRu: "Что означает слово 'كَتَبَ'?",
        questionEn: "What does 'كَتَبَ' mean?",
        options: [
          { text: "O'qidi / Читал / Read", isCorrect: false },
          { text: "Yozdi / Написал / Wrote", isCorrect: true },
          { text: "Bordi / Пошёл / Went", isCorrect: false },
          { text: "Keldi / Пришёл / Came", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q2',
        type: 'multiple_choice',
        questionUz: "'قَلَمْ' so'zi nima ma'noni anglatadi?",
        questionRu: "Что означает 'قَلَمْ'?",
        questionEn: "What does 'قَلَمْ' mean?",
        options: [
          { text: "Kitob / Книга / Book", isCorrect: false },
          { text: "Qalam / Перо / Pen", isCorrect: true },
          { text: "Oy / Луна / Moon", isCorrect: false },
          { text: "Yurak / Сердце / Heart", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q3',
        type: 'multiple_choice',
        questionUz: "'هُوَ' olmoshi kimga ishora qiladi?",
        questionRu: "На кого указывает местоимение 'هُوَ'?",
        questionEn: "Who does the pronoun 'هُوَ' refer to?",
        options: [
          { text: "U (erkak) / Он / He", isCorrect: true },
          { text: "U (ayol) / Она / She", isCorrect: false },
          { text: "Ular / Они / They", isCorrect: false },
          { text: "Sen / Ты / You", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q4',
        type: 'multiple_choice',
        questionUz: "'قَمَرْ' so'zi nimani anglatadi?",
        questionRu: "Что означает 'قَمَرْ'?",
        questionEn: "What does 'قَمَرْ' mean?",
        options: [
          { text: "Quyosh / Солнце / Sun", isCorrect: false },
          { text: "Yulduz / Звезда / Star", isCorrect: false },
          { text: "Oy / Луна / Moon", isCorrect: true },
          { text: "Osmon / Небо / Sky", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q5',
        type: 'multiple_choice',
        questionUz: "'اَلْ' nima?",
        questionRu: "Что такое 'اَلْ'?",
        questionEn: "What is 'اَلْ'?",
        options: [
          { text: "Fe'l / Глагол / Verb", isCorrect: false },
          { text: "Ta'rif artikli / Артикль / Definite article", isCorrect: true },
          { text: "Olmosh / Местоимение / Pronoun", isCorrect: false },
          { text: "Sifat / Прилагательное / Adjective", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 3: Tanwin
  {
    id: 'ch3-tanwin',
    order: 3,
    titleUz: "Tanvin",
    titleRu: "Танвин",
    titleEn: "Tanwin",
    descUz: "Ikkilangan harakatlar: fathatain, kasratain, dammatain",
    descRu: "Двойные огласовки: фатхатайн, касратайн, дамматайн",
    descEn: "Double vowel marks: fathatain, kasratain, dammatain",
    icon: "✨",
    lessons: [
      {
        id: 'ch3-l1',
        arabic: 'كِتَابًا  رَجُلًا  بَابًا\nكِتَابٍ  رَجُلٍ  بَابٍ\nكِتَابٌ  رَجُلٌ  بَابٌ',
        explanation: {
          uz: "Tanvin - so'z oxiridagi ikkilangan harakat. Fathatain (ً) - 'an', Kasratain (ٍ) - 'in', Dammatain (ٌ) - 'un'. Ism (ot) so'zlarning oxirida keladi.",
          ru: "Танвин - двойная огласовка в конце слова. Фатхатайн (ً) - 'ан', Касратайн (ٍ) - 'ин', Дамматайн (ٌ) - 'ун'. Стоит в конце существительных.",
          en: "Tanwin - double vowel mark at end of word. Fathatain (ً) - 'an', Kasratain (ٍ) - 'in', Dammatain (ٌ) - 'un'. Appears at end of nouns."
        }
      },
      {
        id: 'ch3-l2',
        arabic: 'رَبًّا = (رَبْبَنْ)\nرَبٍّ = (رَبْبِنْ)\nرَبٌّ = (رَبْبُنْ)\nحَبًّا  بِرًّا  جَرًّا  مَسًّا  كَفًّا  مِنًّا',
        explanation: {
          uz: "Tanvin shadda bilan birga kelganda: harfni ikkilab, tanvinni qo'shib o'qiladi.",
          ru: "Когда танвин встречается с шаддой: буква удваивается, добавляется танвин.",
          en: "When tanwin occurs with shadda: the letter is doubled, then tanwin is added."
        }
      }
    ],
    quiz: [
      {
        id: 'ch3-q1',
        type: 'multiple_choice',
        questionUz: "Fathatain (ً) qanday o'qiladi?",
        questionRu: "Как читается фатхатайн (ً)?",
        questionEn: "How is fathatain (ً) read?",
        options: [
          { text: "-an", isCorrect: true },
          { text: "-in", isCorrect: false },
          { text: "-un", isCorrect: false },
          { text: "-a", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q2',
        type: 'multiple_choice',
        questionUz: "Dammatain (ٌ) qanday o'qiladi?",
        questionRu: "Как читается дамматайн (ٌ)?",
        questionEn: "How is dammatain (ٌ) read?",
        options: [
          { text: "-an", isCorrect: false },
          { text: "-in", isCorrect: false },
          { text: "-un", isCorrect: true },
          { text: "-u", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q3',
        type: 'multiple_choice',
        questionUz: "'كِتَابًا' qanday o'qiladi?",
        questionRu: "Как читается 'كِتَابًا'?",
        questionEn: "How is 'كِتَابًا' read?",
        options: [
          { text: "Kitaaban", isCorrect: true },
          { text: "Kitaabun", isCorrect: false },
          { text: "Kitaabin", isCorrect: false },
          { text: "Kitaab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q4',
        type: 'multiple_choice',
        questionUz: "Tanvin nima?",
        questionRu: "Что такое танвин?",
        questionEn: "What is tanwin?",
        options: [
          { text: "Ikkilangan harakat / Двойная огласовка / Double vowel", isCorrect: true },
          { text: "Harfni cho'zish / Удлинение / Elongation", isCorrect: false },
          { text: "Harfni ikkilash / Удвоение буквы / Letter doubling", isCorrect: false },
          { text: "Pauza / Пауза / Pause", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 4: Sukun & Shadda
  {
    id: 'ch4-sukun-shadda',
    order: 4,
    titleUz: "Sukun va Shadda",
    titleRu: "Сукун и Шадда",
    titleEn: "Sukun & Shadda",
    descUz: "Sukun (to'xtash belgisi) va shadda (harfni ikkilash) qoidalari",
    descRu: "Правила сукуна (знак остановки) и шадды (удвоение буквы)",
    descEn: "Rules of sukun (stop sign) and shadda (letter doubling)",
    icon: "⚡",
    lessons: [
      {
        id: 'ch4-l1',
        arabic: 'اَبْ  اِبْنْ  بِنْتْ  كَتَبْتُ  ذَهَبْتُ\nجَلَسْتُ  عَلِمْتُ  فَهِمْتُ',
        explanation: {
          uz: "Sukun (ْ) - harf harakatsiz o'qiladi. Masalan: 'ab', 'ibn' (o'g'il), 'bint' (qiz).",
          ru: "Сукун (ْ) - буква читается без гласного. Например: 'аб', 'ибн' (сын), 'бинт' (дочь).",
          en: "Sukun (ْ) - letter is read without a vowel. For example: 'ab', 'ibn' (son), 'bint' (daughter)."
        }
      },
      {
        id: 'ch4-l2',
        arabic: 'رَبَّ  حَقَّ  كُلَّ  ثُمَّ  اِنَّ\nعَلَّمَ  يُعَلِّمُ  كَبَّرَ  يُكَبِّرُ\nمُعَلِّمٌ  مُكَبِّرٌ  مُصَلِّيٌ',
        explanation: {
          uz: "Shadda (ّ) - harf ikki marta o'qiladi. Rabb (Rab), haqq (haqiqat), kull (hamma). Mu'allim (o'qituvchi) - lom harfi ikkilangan.",
          ru: "Шадда (ّ) - буква читается дважды. Рабб (Господь), хакк (истина), кулль (весь). Муаллим (учитель) - буква лям удвоена.",
          en: "Shadda (ّ) - letter is read twice. Rabb (Lord), haqq (truth), kull (all). Mu'allim (teacher) - lam is doubled."
        }
      }
    ],
    quiz: [
      {
        id: 'ch4-q1',
        type: 'multiple_choice',
        questionUz: "Sukun (ْ) nima?",
        questionRu: "Что такое сукун (ْ)?",
        questionEn: "What is sukun (ْ)?",
        options: [
          { text: "Harf harakatsiz / Буква без гласного / No vowel", isCorrect: true },
          { text: "Harf ikkilanadi / Буква удваивается / Letter doubled", isCorrect: false },
          { text: "Tovush cho'ziladi / Звук удлиняется / Sound elongated", isCorrect: false },
          { text: "Tovush yo'qoladi / Звук пропадает / Sound disappears", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q2',
        type: 'multiple_choice',
        questionUz: "Shadda (ّ) nima qiladi?",
        questionRu: "Что делает шадда (ّ)?",
        questionEn: "What does shadda (ّ) do?",
        options: [
          { text: "Harfni cho'zadi / Удлиняет / Elongates", isCorrect: false },
          { text: "Harfni ikkilaydi / Удваивает букву / Doubles letter", isCorrect: true },
          { text: "Harfni o'chiradi / Убирает / Removes", isCorrect: false },
          { text: "Harfni yumshatadi / Смягчает / Softens", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q3',
        type: 'multiple_choice',
        questionUz: "'مُعَلِّمٌ' so'zi nimani anglatadi?",
        questionRu: "Что означает 'مُعَلِّمٌ'?",
        questionEn: "What does 'مُعَلِّمٌ' mean?",
        options: [
          { text: "Talaba / Студент / Student", isCorrect: false },
          { text: "O'qituvchi / Учитель / Teacher", isCorrect: true },
          { text: "Kitob / Книга / Book", isCorrect: false },
          { text: "Maktab / Школа / School", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 5: Madd (Elongation)
  {
    id: 'ch5-madd',
    order: 5,
    titleUz: "Madd (cho'zish)",
    titleRu: "Мадд (удлинение)",
    titleEn: "Madd (Elongation)",
    descUz: "Cho'ziq unli tovushlar: alif, vov, ya bilan cho'zish",
    descRu: "Долгие гласные: удлинение через алиф, вав, йа",
    descEn: "Long vowels: elongation through alif, waw, ya",
    icon: "🎵",
    lessons: [
      {
        id: 'ch5-l1',
        arabic: 'بَا  تَا  نَا  كَا  قَا\nكِتَابْ  بَابْ  نَارْ  قَالَ  نَامَ\nبِيْ  فِيْ  كِيْ\nنَبِيْ  كَبِيْرْ  صَغِيْرْ',
        explanation: {
          uz: "Madd - tovushni cho'zish. Fathadan keyin Alif (ا) kelsa 'aa' cho'ziladi. Kasradan keyin Ya (ي) kelsa 'ii' cho'ziladi.",
          ru: "Мадд - удлинение звука. После фатхи Алиф (ا) даёт 'аа'. После касры Йа (ي) даёт 'ии'.",
          en: "Madd - elongation. Fatha + Alif (ا) gives 'aa'. Kasra + Ya (ي) gives 'ii'."
        }
      },
      {
        id: 'ch5-l2',
        arabic: 'بُوْ  تُوْ  نُوْ  كُوْ\nنُوْرْ  سُوْرْ  يَقُوْلُ  يَكُوْنُ\nرَسُوْلْ  دُرُوْسْ  عُيُوْنْ',
        explanation: {
          uz: "Dammadan keyin Vov (و) kelsa 'uu' cho'ziladi. Nuur (nur), rasul (elchi), duroos (darslar).",
          ru: "После даммы Вав (و) даёт 'уу'. Нуур (свет), расуль (посланник), дуруус (уроки).",
          en: "Damma + Waw (و) gives 'uu'. Nuur (light), rasul (messenger), duroos (lessons)."
        }
      }
    ],
    quiz: [
      {
        id: 'ch5-q1',
        type: 'multiple_choice',
        questionUz: "Madd nima?",
        questionRu: "Что такое мадд?",
        questionEn: "What is madd?",
        options: [
          { text: "Tovushni cho'zish / Удлинение звука / Sound elongation", isCorrect: true },
          { text: "Harfni ikkilash / Удвоение буквы / Letter doubling", isCorrect: false },
          { text: "To'xtash / Остановка / Stop", isCorrect: false },
          { text: "Tanvin / Танвин / Tanwin", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q2',
        type: 'multiple_choice',
        questionUz: "Fatha + Alif qanday tovush beradi?",
        questionRu: "Какой звук даёт фатха + алиф?",
        questionEn: "What sound does fatha + alif give?",
        options: [
          { text: "aa", isCorrect: true },
          { text: "ii", isCorrect: false },
          { text: "uu", isCorrect: false },
          { text: "a", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q3',
        type: 'multiple_choice',
        questionUz: "'نُوْرْ' so'zi nimani anglatadi?",
        questionRu: "Что означает 'نُوْرْ'?",
        questionEn: "What does 'نُوْرْ' mean?",
        options: [
          { text: "Tun / Ночь / Night", isCorrect: false },
          { text: "Nur / Свет / Light", isCorrect: true },
          { text: "Oy / Луна / Moon", isCorrect: false },
          { text: "Suv / Вода / Water", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 6: Lam Rules (Sun & Moon letters)
  {
    id: 'ch6-lam',
    order: 6,
    titleUz: "Lom harfi qoidalari",
    titleRu: "Правила Лям",
    titleEn: "Lam Rules",
    descUz: "Quyosh va oy harflari, 'al' artikli",
    descRu: "Солнечные и лунные буквы, артикль 'аль'",
    descEn: "Sun and moon letters, 'al' article",
    icon: "☀️",
    lessons: [
      {
        id: 'ch6-l1',
        arabic: 'اَلْكِتَابُ  اَلْقَمَرُ  اَلْبَابُ  اَلْمَسْجِدُ\nاَلْعِلْمُ  اَلْحَمْدُ  اَلْجَنَّةُ',
        explanation: {
          uz: "Oy harflari (Qamariy): 'al' artiklidagi Lom harfi o'qiladi. Masalan: al-kitab, al-qamar, al-masjid.",
          ru: "Лунные буквы (Камария): буква Лям в артикле 'аль' читается. Например: аль-китаб, аль-камар, аль-масджид.",
          en: "Moon letters (Qamariy): Lam in 'al' article is pronounced. Example: al-kitab, al-qamar, al-masjid."
        }
      },
      {
        id: 'ch6-l2',
        arabic: 'اَلتَّمْرُ  اَلذَّهَبُ  اَلرَّصَدُ  اَلزَّبَدُ\nاَلسَّفَرُ  اَلشَّجَرُ  اَلصَّقْرُ  اَلضَّرَرُ\nاَلطَّلَبُ  اَلظَّفَرُ  اَللَّهَبُ  اَلنَّسَبُ',
        explanation: {
          uz: "Quyosh harflari (Shamsiy): 'al' artiklidagi Lom harfi o'qilMAYDI, keyingi harf ikkilanadi (shadda). Masalan: at-tamr (xurmo), ash-shajar (daraxt), an-nasab.",
          ru: "Солнечные буквы (Шамсия): Лям в артикле НЕ ЧИТАЕТСЯ, следующая буква удваивается (шадда). Например: ат-тамр (финики), аш-шаджар (дерево).",
          en: "Sun letters (Shamsiy): Lam in 'al' is NOT pronounced, next letter is doubled (shadda). Example: at-tamr (dates), ash-shajar (tree)."
        }
      }
    ],
    quiz: [
      {
        id: 'ch6-q1',
        type: 'multiple_choice',
        questionUz: "Quyosh harflarida 'al' artikli qanday o'qiladi?",
        questionRu: "Как читается артикль 'аль' перед солнечными буквами?",
        questionEn: "How is 'al' read before sun letters?",
        options: [
          { text: "Lom o'qilmaydi / Лям не читается / Lam silent", isCorrect: true },
          { text: "Lom o'qiladi / Лям читается / Lam pronounced", isCorrect: false },
          { text: "Artikl tushadi / Артикль убирается / Article removed", isCorrect: false },
          { text: "Hech qanday o'zgarish yo'q / Без изменений / No change", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q2',
        type: 'multiple_choice',
        questionUz: "'اَلشَّمْسُ' qanday o'qiladi?",
        questionRu: "Как читается 'اَلشَّمْسُ'?",
        questionEn: "How is 'اَلشَّمْسُ' read?",
        options: [
          { text: "Al-shamsu", isCorrect: false },
          { text: "Ash-shamsu", isCorrect: true },
          { text: "A-shamsu", isCorrect: false },
          { text: "El-shamsu", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q3',
        type: 'multiple_choice',
        questionUz: "'اَلْقَمَرُ' qanday o'qiladi?",
        questionRu: "Как читается 'اَلْقَمَرُ'?",
        questionEn: "How is 'اَلْقَمَرُ' read?",
        options: [
          { text: "Aq-qamaru", isCorrect: false },
          { text: "Al-qamaru", isCorrect: true },
          { text: "A-qamaru", isCorrect: false },
          { text: "Ar-qamaru", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 7: Reading Practice
  {
    id: 'ch7-reading',
    order: 7,
    titleUz: "O'qish mashqi",
    titleRu: "Практика чтения",
    titleEn: "Reading Practice",
    descUz: "Haqiqiy so'z va jumlalarni o'qish mashqlari",
    descRu: "Практика чтения настоящих слов и предложений",
    descEn: "Practice reading real words and sentences",
    icon: "📚",
    lessons: [
      {
        id: 'ch7-l1',
        arabic: 'يُقَالُ  يُطَافُ  يُثَابُ  يَقُوْلُ  تَقُوْمُ  يَطُوْفُ\nيَقُوْلُوْنَ  يَطُوْفُوْنَ  تَقُوْلُوْنَ\nيَتُوْبَانَ  يَقُوْلَانَ  تَقُوْمَانَ',
        explanation: {
          uz: "Fe'l (harakat so'z) shakllari: yuqol (aytiladi), yaqulu (aytadi), yaquluna (ular aytadilar).",
          ru: "Формы глаголов: юкаль (говорится), якулю (говорит), якулюна (они говорят).",
          en: "Verb forms: yuqal (it is said), yaqulu (he says), yaquluna (they say)."
        }
      },
      {
        id: 'ch7-l2',
        arabic: 'اَمْوَالٌ  اَخْوَالٌ  اَعْمَالٌ  اَغْلَامٌ  اَمْوَاتٌ  اَمْرَاضٌ\nقَوَاعِدُ  عَوَامِلُ  شَوَاهِدُ  جَوَاهِرُ  كَوَاكِبُ  مَكَاتِبُ\nعَالِمٌ  صَابِرٌ  مَاهِرٌ  طَالِبٌ  فَاتِحٌ  صَالِحٌ',
        explanation: {
          uz: "Ko'plik shakllari va sifatlar: a'mol (ishlar), 'aalim (olim), taalib (talaba), saalih (solih).",
          ru: "Множественное число и качества: а'маль (дела), 'алим (учёный), талиб (студент), салих (праведный).",
          en: "Plural forms and qualities: a'mal (deeds), 'alim (scholar), talib (student), salih (righteous)."
        }
      }
    ],
    quiz: [
      {
        id: 'ch7-q1',
        type: 'multiple_choice',
        questionUz: "'عَالِمٌ' so'zi nimani anglatadi?",
        questionRu: "Что означает 'عَالِمٌ'?",
        questionEn: "What does 'عَالِمٌ' mean?",
        options: [
          { text: "Olim / Учёный / Scholar", isCorrect: true },
          { text: "Talaba / Студент / Student", isCorrect: false },
          { text: "O'qituvchi / Учитель / Teacher", isCorrect: false },
          { text: "Shoir / Поэт / Poet", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q2',
        type: 'multiple_choice',
        questionUz: "'طَالِبٌ' nimani anglatadi?",
        questionRu: "Что означает 'طَالِبٌ'?",
        questionEn: "What does 'طَالِبٌ' mean?",
        options: [
          { text: "O'qituvchi / Учитель / Teacher", isCorrect: false },
          { text: "Talaba / Студент / Student", isCorrect: true },
          { text: "Shifokor / Врач / Doctor", isCorrect: false },
          { text: "Savdogar / Торговец / Merchant", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 8: Kalimas & Duas
  {
    id: 'ch8-kalima',
    order: 8,
    titleUz: "Kalimalar va duolar",
    titleRu: "Калимы и дуа",
    titleEn: "Kalimas & Duas",
    descUz: "Islom asoslari: kalimalar, shahodat va duolar",
    descRu: "Основы Ислама: калимы, шахада и дуа",
    descEn: "Islamic foundations: kalimas, shahada and duas",
    icon: "🕌",
    lessons: [
      {
        id: 'ch8-l1',
        arabic: 'كَلِمَةُ طَيِّبَة\nلَا اِلَهَ اِلَّا اللهُ مُحَمَّدٌ رَسُوْلُ اللهِ',
        explanation: {
          uz: "Kalima Tayyiba: La ilaha illalloh Muhammadur rasululloh. Ma'nosi: Allohdan boshqa iloh yo'q, Muhammad Uning elchisi.",
          ru: "Калима Тайиба: Ля иляха илляллах Мухаммадур расулюллах. Значение: Нет бога кроме Аллаха, Мухаммад - Его посланник.",
          en: "Kalima Tayyiba: La ilaha illallah Muhammadur rasulullah. Meaning: There is no god but Allah, Muhammad is His messenger."
        }
      },
      {
        id: 'ch8-l2',
        arabic: 'كَلِمَةُ الشَّهَادَة\nاَشْهَدُ اَنْ لَا اِلَهَ اِلَّا اللهُ\nوَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ',
        explanation: {
          uz: "Kalima Shahodat: Guvohlik beraman, Allohdan boshqa iloh yo'qligiga, va Muhammad Uning bandasi va elchisi ekanligiga.",
          ru: "Калима Шахада: Свидетельствую, что нет бога кроме Аллаха, и что Мухаммад - Его раб и посланник.",
          en: "Kalima Shahada: I bear witness that there is no god but Allah, and Muhammad is His servant and messenger."
        }
      },
      {
        id: 'ch8-l3',
        arabic: 'كَلِمَةُ التَّوْحِيد\nاَشْهَدُ اَنْ لَا اِلَهَ اِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ\nلَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ\nوَهُوَ حَيٌّ لَا يَمُوْتُ بِيَدِهِ الْخَيْرُ\nوَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
        explanation: {
          uz: "Kalima Tavhid: Allohning birligiga guvohlik. U yagonadir, sherigі yo'q, mulk Uniki, hamd Unga, U tiriltiradi va o'ldiradi.",
          ru: "Калима Таухид: Свидетельство единобожия. Он Един, нет Ему сотоварища, Ему принадлежит власть и хвала, Он оживляет и умерщвляет.",
          en: "Kalima Tawhid: Declaration of God's oneness. He is One, has no partner, His is the dominion and praise, He gives life and death."
        }
      }
    ],
    quiz: [
      {
        id: 'ch8-q1',
        type: 'multiple_choice',
        questionUz: "'لَا اِلَهَ اِلَّا اللهُ' nimani anglatadi?",
        questionRu: "Что означает 'لَا اِلَهَ اِلَّا اللهُ'?",
        questionEn: "What does 'لَا اِلَهَ اِلَّا اللهُ' mean?",
        options: [
          { text: "Allohdan boshqa iloh yo'q / Нет бога кроме Аллаха / No god but Allah", isCorrect: true },
          { text: "Alloh buyuk / Аллах велик / Allah is great", isCorrect: false },
          { text: "Hamd Allohga / Хвала Аллаху / Praise to Allah", isCorrect: false },
          { text: "Alloh rahmatli / Аллах милостив / Allah is merciful", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q2',
        type: 'multiple_choice',
        questionUz: "Kalima Shahodat nima?",
        questionRu: "Что такое Калима Шахада?",
        questionEn: "What is Kalima Shahada?",
        options: [
          { text: "Guvohlik kalimasi / Свидетельство / Declaration of faith", isCorrect: true },
          { text: "Duo / Молитва / Prayer", isCorrect: false },
          { text: "Sura / Сура / Surah", isCorrect: false },
          { text: "Oyat / Аят / Verse", isCorrect: false }
        ]
      }
    ]
  },

  // CHAPTER 9: Short Surahs
  {
    id: 'ch9-surahs',
    order: 9,
    titleUz: "Qisqa suralar",
    titleRu: "Короткие суры",
    titleEn: "Short Surahs",
    descUz: "Qur'onning qisqa suralarini o'qish: Fotiha, Ixlos, Falaq, Nos va boshqalar",
    descRu: "Чтение коротких сур Корана: Фатиха, Ихлас, Фаляк, Нас и другие",
    descEn: "Reading short Quran surahs: Fatiha, Ikhlas, Falaq, Nas and others",
    icon: "🌙",
    lessons: [
      {
        id: 'ch9-l1',
        arabic: 'سُوْرَةُ الْفَاتِحَة\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\nاَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ ۝ الرَّحْمٰنِ الرَّحِيْمِ ۝ مَالِكِ يَوْمِ الدِّيْنِ ۝\nاِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ ۝ اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۝\nصِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ۝ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّالِّيْنَ ۝',
        explanation: {
          uz: "Sura Fotiha - Qur'onning birinchi surasi, 7 oyat. Har bir namazda o'qiladi. 'Olamlar Rabbi Allohga hamd bo'lsin'.",
          ru: "Сура Фатиха - первая сура Корана, 7 аятов. Читается в каждом намазе. 'Хвала Аллаху, Господу миров'.",
          en: "Surah Fatiha - first surah of Quran, 7 verses. Read in every prayer. 'Praise be to Allah, Lord of the worlds'."
        }
      },
      {
        id: 'ch9-l2',
        arabic: 'سُوْرَةُ الْاِخْلَاص\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\nقُلْ هُوَ اللهُ اَحَدٌ ۝ اَللهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُوْلَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا اَحَدٌ ۝',
        explanation: {
          uz: "Sura Ixlos - Allohning birligini ta'kidlaydi. 'Ayting: U Alloh Yagonadir. Alloh Samad (muhtojsiz). U tug'magan va tug'ilmagan. Unga teng hech kim yo'q.'",
          ru: "Сура Ихлас - утверждает единство Аллаха. 'Скажи: Он - Аллах Единый. Аллах Самад. Не родил и не был рождён. И нет никого равного Ему.'",
          en: "Surah Ikhlas - affirms Allah's oneness. 'Say: He is Allah, the One. Allah, the Eternal. He begets not, nor was He begotten. And there is none comparable to Him.'"
        }
      },
      {
        id: 'ch9-l3',
        arabic: 'سُوْرَةُ الْفَلَق\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\nقُلْ اَعُوْذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَ ۝\nوَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ ۝',
        explanation: {
          uz: "Sura Falaq - yomonlikdan panoh so'rash surasi. 'Tong Robbisidan panoh so'rayman, U yaratgan narsalarning yomonligidan...'",
          ru: "Сура Фаляк - сура о прибежище от зла. 'Скажи: Прибегаю к Господу рассвета, от зла того, что Он сотворил...'",
          en: "Surah Falaq - seeking refuge from evil. 'Say: I seek refuge with the Lord of daybreak, from the evil of what He has created...'"
        }
      },
      {
        id: 'ch9-l4',
        arabic: 'سُوْرَةُ النَّاس\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\nقُلْ اَعُوْذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ اِلٰهِ النَّاسِ ۝\nمِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ اَلَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ ۝',
        explanation: {
          uz: "Sura Nos - odamlarning Robbisidan panoh so'rash. 'Odamlar Robbisidan, odamlar Podshohisidan, odamlar Ilohisidan panoh so'rayman'.",
          ru: "Сура Нас - прибежище у Господа людей. 'Скажи: Прибегаю к Господу людей, Царю людей, Богу людей'.",
          en: "Surah Nas - seeking refuge with the Lord of mankind. 'Say: I seek refuge with the Lord of mankind, the King of mankind, the God of mankind'."
        }
      }
    ],
    quiz: [
      {
        id: 'ch9-q1',
        type: 'multiple_choice',
        questionUz: "Qur'onning birinchi surasi qaysi?",
        questionRu: "Какая первая сура Корана?",
        questionEn: "What is the first surah of the Quran?",
        options: [
          { text: "Al-Fotiha / Аль-Фатиха / Al-Fatiha", isCorrect: true },
          { text: "Al-Baqara / Аль-Бакара / Al-Baqarah", isCorrect: false },
          { text: "Al-Ixlos / Аль-Ихлас / Al-Ikhlas", isCorrect: false },
          { text: "An-Nos / Ан-Нас / An-Nas", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q2',
        type: 'multiple_choice',
        questionUz: "Sura Ixlos nimani ta'kidlaydi?",
        questionRu: "Что утверждает сура Ихлас?",
        questionEn: "What does Surah Ikhlas affirm?",
        options: [
          { text: "Allohning birligi / Единство Аллаха / Allah's oneness", isCorrect: true },
          { text: "Namoz qoidalari / Правила молитвы / Prayer rules", isCorrect: false },
          { text: "Ro'za / Пост / Fasting", isCorrect: false },
          { text: "Haj / Хадж / Hajj", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q3',
        type: 'multiple_choice',
        questionUz: "Sura Fotihada nechta oyat bor?",
        questionRu: "Сколько аятов в суре Фатиха?",
        questionEn: "How many verses in Surah Fatiha?",
        options: [
          { text: "5", isCorrect: false },
          { text: "6", isCorrect: false },
          { text: "7", isCorrect: true },
          { text: "8", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q4',
        type: 'multiple_choice',
        questionUz: "'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ' nimani anglatadi?",
        questionRu: "Что означает 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ'?",
        questionEn: "What does 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ' mean?",
        options: [
          { text: "Rahmon va Rahiym Alloh nomi bilan / Во имя Аллаха Милостивого Милосердного / In the name of Allah, Most Gracious, Most Merciful", isCorrect: true },
          { text: "Hamd Allohga / Хвала Аллаху / Praise be to Allah", isCorrect: false },
          { text: "Alloh buyuk / Аллах велик / Allah is great", isCorrect: false },
          { text: "Allohga shukr / Благодарность Аллаху / Thanks to Allah", isCorrect: false }
        ]
      }
    ]
  }
];
