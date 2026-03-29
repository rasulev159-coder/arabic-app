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
        type: 'identify',
        questionUz: "Bu harf qanday o'qiladi?",
        questionRu: "Как читается эта буква?",
        questionEn: "How is this letter read?",
        arabic: "بَ",
        options: [
          { text: "ba", isCorrect: true },
          { text: "bi", isCorrect: false },
          { text: "bu", isCorrect: false },
          { text: "ab", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q2',
        type: 'identify',
        questionUz: "Bu harf qanday o'qiladi?",
        questionRu: "Как читается эта буква?",
        questionEn: "How is this letter read?",
        arabic: "مُ",
        options: [
          { text: "ma", isCorrect: false },
          { text: "mi", isCorrect: false },
          { text: "mu", isCorrect: true },
          { text: "um", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q3',
        type: 'identify',
        questionUz: "Bu harfda qanday harakat bor?",
        questionRu: "Какая огласовка на этой букве?",
        questionEn: "What vowel mark is on this letter?",
        arabic: "تِ",
        options: [
          { text: "Fatha (َ)", isCorrect: false },
          { text: "Kasra (ِ)", isCorrect: true },
          { text: "Damma (ُ)", isCorrect: false },
          { text: "Sukun (ْ)", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q4',
        type: 'identify',
        questionUz: "Bu bo'g'in qanday o'qiladi?",
        questionRu: "Как читается этот слог?",
        questionEn: "How is this syllable read?",
        arabic: "اَرْ",
        options: [
          { text: "ar", isCorrect: true },
          { text: "ra", isCorrect: false },
          { text: "ir", isCorrect: false },
          { text: "ur", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q5',
        type: 'identify',
        questionUz: "Bu harf qanday o'qiladi?",
        questionRu: "Как читается эта буква?",
        questionEn: "How is this letter read?",
        arabic: "نِ",
        options: [
          { text: "na", isCorrect: false },
          { text: "nu", isCorrect: false },
          { text: "ni", isCorrect: true },
          { text: "in", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q6',
        type: 'multiple_choice',
        questionUz: "Kasra (ِ) qanday tovush beradi?",
        questionRu: "Какой звук даёт касра (ِ)?",
        questionEn: "What sound does kasra (ِ) give?",
        options: [
          { text: "a", isCorrect: false },
          { text: "i", isCorrect: true },
          { text: "u", isCorrect: false },
          { text: "o", isCorrect: false }
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
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "كَتَبَ",
        options: [
          { text: "kataba", isCorrect: true },
          { text: "kutiba", isCorrect: false },
          { text: "katba", isCorrect: false },
          { text: "kitaba", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q2',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "قَلَمْ",
        options: [
          { text: "qulam", isCorrect: false },
          { text: "qalam", isCorrect: true },
          { text: "kilam", isCorrect: false },
          { text: "qalmu", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q3',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "شَرِبَ",
        options: [
          { text: "sharaba", isCorrect: false },
          { text: "shurba", isCorrect: false },
          { text: "shariba", isCorrect: true },
          { text: "shirba", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q4',
        type: 'identify',
        questionUz: "Bu harfda qanday harakat bor?",
        questionRu: "Какая огласовка на выделенной букве?",
        questionEn: "What vowel mark is on this letter?",
        arabic: "هُوَ",
        options: [
          { text: "hu-wa", isCorrect: true },
          { text: "ha-wa", isCorrect: false },
          { text: "hi-ya", isCorrect: false },
          { text: "ho-wa", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q5',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "بُلْبُلْ",
        options: [
          { text: "bulbul", isCorrect: true },
          { text: "bilbil", isCorrect: false },
          { text: "balbul", isCorrect: false },
          { text: "bolbol", isCorrect: false }
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
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "كِتَابًا",
        options: [
          { text: "kitaaban", isCorrect: true },
          { text: "kitaabun", isCorrect: false },
          { text: "kitaabin", isCorrect: false },
          { text: "kitaab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q4',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "رَجُلٌ",
        options: [
          { text: "rajulan", isCorrect: false },
          { text: "rajulun", isCorrect: true },
          { text: "rajulin", isCorrect: false },
          { text: "rajul", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q5',
        type: 'identify',
        questionUz: "Bu so'zning oxiri qanday o'qiladi?",
        questionRu: "Как читается окончание этого слова?",
        questionEn: "How is the ending of this word read?",
        arabic: "بَابٍ",
        options: [
          { text: "-ban", isCorrect: false },
          { text: "-bun", isCorrect: false },
          { text: "-bin", isCorrect: true },
          { text: "-ba", isCorrect: false }
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
        questionUz: "Sukun (ْ) nimani anglatadi?",
        questionRu: "Что означает сукун (ْ)?",
        questionEn: "What does sukun (ْ) mean?",
        options: [
          { text: "Harf harakatsiz o'qiladi / Буква без гласного / No vowel on letter", isCorrect: true },
          { text: "Harf ikkilanadi / Буква удваивается / Letter doubled", isCorrect: false },
          { text: "Tovush cho'ziladi / Звук удлиняется / Sound elongated", isCorrect: false },
          { text: "Harf o'qilmaydi / Буква не читается / Letter silent", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q2',
        type: 'multiple_choice',
        questionUz: "Shadda (ّ) qo'yilganda harf necha marta o'qiladi?",
        questionRu: "Сколько раз читается буква с шаддой (ّ)?",
        questionEn: "How many times is a letter with shadda (ّ) read?",
        options: [
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: true },
          { text: "3", isCorrect: false },
          { text: "0", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q3',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "رَبَّ",
        options: [
          { text: "rab-ba", isCorrect: true },
          { text: "ra-ba", isCorrect: false },
          { text: "rab", isCorrect: false },
          { text: "ra-bi", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q4',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اِبْنْ",
        options: [
          { text: "ibn", isCorrect: true },
          { text: "iban", isCorrect: false },
          { text: "ibin", isCorrect: false },
          { text: "abun", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q5',
        type: 'identify',
        questionUz: "Bu so'zda qaysi harf ikkilangan (shadda)?",
        questionRu: "Какая буква удвоена (шадда) в этом слове?",
        questionEn: "Which letter has shadda in this word?",
        arabic: "عَلَّمَ",
        options: [
          { text: "ل (lam)", isCorrect: true },
          { text: "ع (ayn)", isCorrect: false },
          { text: "م (mim)", isCorrect: false },
          { text: "ا (alif)", isCorrect: false }
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
        questionUz: "Fatha + Alif birga kelganda qanday tovush hosil bo'ladi?",
        questionRu: "Какой звук образуется при фатха + алиф?",
        questionEn: "What sound is formed by fatha + alif?",
        options: [
          { text: "aa (cho'ziq / долгий / long)", isCorrect: true },
          { text: "a (qisqa / короткий / short)", isCorrect: false },
          { text: "ii (cho'ziq / долгий / long)", isCorrect: false },
          { text: "uu (cho'ziq / долгий / long)", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q2',
        type: 'multiple_choice',
        questionUz: "Damma + Vov birga kelganda qanday tovush hosil bo'ladi?",
        questionRu: "Какой звук образуется при дамма + вав?",
        questionEn: "What sound is formed by damma + waw?",
        options: [
          { text: "aa", isCorrect: false },
          { text: "ii", isCorrect: false },
          { text: "uu (cho'ziq / долгий / long)", isCorrect: true },
          { text: "u (qisqa / короткий / short)", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q3',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "كِتَابْ",
        options: [
          { text: "kitaab", isCorrect: true },
          { text: "kitab", isCorrect: false },
          { text: "kutub", isCorrect: false },
          { text: "katab", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q4',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "نُوْرْ",
        options: [
          { text: "nur", isCorrect: false },
          { text: "nuur", isCorrect: true },
          { text: "naur", isCorrect: false },
          { text: "nir", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q5',
        type: 'identify',
        questionUz: "Bu so'zda qaysi madd harfi bor?",
        questionRu: "Какая буква удлинения в этом слове?",
        questionEn: "Which elongation letter is in this word?",
        arabic: "نَبِيْ",
        options: [
          { text: "ي (ya)", isCorrect: true },
          { text: "ا (alif)", isCorrect: false },
          { text: "و (waw)", isCorrect: false },
          { text: "ن (nun)", isCorrect: false }
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
        questionUz: "Quyosh harflarida 'al' artiklidagi Lom qanday o'qiladi?",
        questionRu: "Как читается Лям в артикле 'аль' перед солнечными буквами?",
        questionEn: "How is Lam read in 'al' before sun letters?",
        options: [
          { text: "O'qilmaydi, keyingi harf ikkilanadi / Не читается, следующая удваивается / Silent, next letter doubled", isCorrect: true },
          { text: "Oddiy o'qiladi / Читается обычно / Read normally", isCorrect: false },
          { text: "Cho'zib o'qiladi / Читается долго / Read long", isCorrect: false },
          { text: "Yumshoq o'qiladi / Читается мягко / Read soft", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q2',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اَلشَّمْسُ",
        options: [
          { text: "ash-shamsu", isCorrect: true },
          { text: "al-shamsu", isCorrect: false },
          { text: "a-shamsu", isCorrect: false },
          { text: "alsh-shamsu", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q3',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اَلْقَمَرُ",
        options: [
          { text: "aq-qamaru", isCorrect: false },
          { text: "al-qamaru", isCorrect: true },
          { text: "a-qamaru", isCorrect: false },
          { text: "ar-qamaru", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q4',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اَلنَّاسِ",
        options: [
          { text: "al-naasi", isCorrect: false },
          { text: "an-naasi", isCorrect: true },
          { text: "a-naasi", isCorrect: false },
          { text: "aln-naasi", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q5',
        type: 'multiple_choice',
        questionUz: "Quyidagilardan qaysi biri quyosh harfi?",
        questionRu: "Какая из следующих — солнечная буква?",
        questionEn: "Which of these is a sun letter?",
        options: [
          { text: "ب (ba)", isCorrect: false },
          { text: "ت (ta)", isCorrect: true },
          { text: "ك (kaf)", isCorrect: false },
          { text: "م (mim)", isCorrect: false }
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
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "يَقُوْلُ",
        options: [
          { text: "yaquulu", isCorrect: true },
          { text: "yaqulu", isCorrect: false },
          { text: "yaqul", isCorrect: false },
          { text: "yuqaalu", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q2',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "يَقُوْلُوْنَ",
        options: [
          { text: "yaquuluuna", isCorrect: true },
          { text: "yaquluna", isCorrect: false },
          { text: "yaquulun", isCorrect: false },
          { text: "yaqaluna", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q3',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "مُسْلِمٌ",
        options: [
          { text: "muslimun", isCorrect: true },
          { text: "muslim", isCorrect: false },
          { text: "musilmun", isCorrect: false },
          { text: "maslimun", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q4',
        type: 'identify',
        questionUz: "'صَابِرٌ' so'zida 'ا' harfi nima uchun qo'yilgan?",
        questionRu: "Зачем стоит 'ا' в слове 'صَابِرٌ'?",
        questionEn: "Why is 'ا' in the word 'صَابِرٌ'?",
        arabic: "صَابِرٌ",
        options: [
          { text: "Cho'zish (madd) uchun / Для удлинения (мадд) / For elongation (madd)", isCorrect: true },
          { text: "Harakat berish uchun / Для огласовки / For vowel mark", isCorrect: false },
          { text: "Tanvin uchun / Для танвина / For tanwin", isCorrect: false },
          { text: "Sukun uchun / Для сукуна / For sukun", isCorrect: false }
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
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اللهُ",
        options: [
          { text: "Allaahu", isCorrect: true },
          { text: "Allahu", isCorrect: false },
          { text: "Ilahu", isCorrect: false },
          { text: "Allihu", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q2',
        type: 'identify',
        questionUz: "Bu ibora qanday o'qiladi?",
        questionRu: "Как читается эта фраза?",
        questionEn: "How is this phrase read?",
        arabic: "بِسْمِ اللهِ",
        options: [
          { text: "Bismillaahi", isCorrect: true },
          { text: "Basmilahi", isCorrect: false },
          { text: "Bismalahi", isCorrect: false },
          { text: "Bismillhi", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q3',
        type: 'identify',
        questionUz: "'لَا اِلَهَ اِلَّا' iborasida shadda qaysi harfda?",
        questionRu: "На какой букве шадда в 'لَا اِلَهَ اِلَّا'?",
        questionEn: "Which letter has shadda in 'لَا اِلَهَ اِلَّا'?",
        arabic: "لَا اِلَهَ اِلَّا",
        options: [
          { text: "ل (lam) — illaa", isCorrect: true },
          { text: "ا (alif)", isCorrect: false },
          { text: "ه (ha)", isCorrect: false },
          { text: "Shadda yo'q / Нет шадды / No shadda", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q4',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "مُحَمَّدٌ",
        options: [
          { text: "Muhammadun", isCorrect: true },
          { text: "Muhamadun", isCorrect: false },
          { text: "Mahmudun", isCorrect: false },
          { text: "Muhamidun", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q5',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "رَسُوْلُ",
        options: [
          { text: "rasuulu", isCorrect: true },
          { text: "rasulu", isCorrect: false },
          { text: "risaalu", isCorrect: false },
          { text: "rusuulu", isCorrect: false }
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
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اَلْحَمْدُ",
        options: [
          { text: "al-hamdu", isCorrect: true },
          { text: "a-hamdu", isCorrect: false },
          { text: "alha-mdu", isCorrect: false },
          { text: "el-hamdu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q2',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "الرَّحْمٰنِ",
        options: [
          { text: "ar-rahmaani", isCorrect: true },
          { text: "al-rahmaani", isCorrect: false },
          { text: "a-rahmaani", isCorrect: false },
          { text: "ar-rahmani", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q3',
        type: 'identify',
        questionUz: "Bu so'zda qanday qoida qo'llanilgan?",
        questionRu: "Какое правило применено?",
        questionEn: "What rule is applied?",
        arabic: "الرَّحِيْمِ",
        options: [
          { text: "Quyosh harfi (shamsiy) / Солнечная буква / Sun letter", isCorrect: true },
          { text: "Oy harfi (qamariy) / Лунная буква / Moon letter", isCorrect: false },
          { text: "Tanvin / Танвин / Tanwin", isCorrect: false },
          { text: "Sukun / Сукун / Sukun", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q4',
        type: 'identify',
        questionUz: "Bu so'z qanday o'qiladi?",
        questionRu: "Как читается это слово?",
        questionEn: "How is this word read?",
        arabic: "اَلصَّمَدُ",
        options: [
          { text: "as-samadu", isCorrect: true },
          { text: "al-samadu", isCorrect: false },
          { text: "a-samadu", isCorrect: false },
          { text: "als-samadu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q5',
        type: 'identify',
        questionUz: "'اَلْعَالَمِيْنَ' so'zida 'al' artikli qanday o'qiladi?",
        questionRu: "Как читается артикль 'аль' в 'اَلْعَالَمِيْنَ'?",
        questionEn: "How is 'al' article read in 'اَلْعَالَمِيْنَ'?",
        arabic: "اَلْعَالَمِيْنَ",
        options: [
          { text: "al- (Lom o'qiladi / Лям читается / Lam pronounced)", isCorrect: true },
          { text: "a'- (Lom o'qilmaydi / Лям не читается / Lam silent)", isCorrect: false },
          { text: "aw- (Lom vovga aylanadi / Лям в вав / Lam becomes waw)", isCorrect: false },
          { text: "an- (Lom nunga aylanadi / Лям в нун / Lam becomes nun)", isCorrect: false }
        ]
      }
    ]
  }
];
