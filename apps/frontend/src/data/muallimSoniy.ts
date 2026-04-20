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

export interface ChapterVideo {
  videoId: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
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
  videos?: ChapterVideo[];
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
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَزْ",
        options: [
          { text: "az", isCorrect: true },
          { text: "iz", isCorrect: false },
          { text: "uz", isCorrect: false },
          { text: "za", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِزْ",
        options: [
          { text: "az", isCorrect: false },
          { text: "iz", isCorrect: true },
          { text: "uz", isCorrect: false },
          { text: "zi", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اُزْ",
        options: [
          { text: "az", isCorrect: false },
          { text: "uz", isCorrect: true },
          { text: "iz", isCorrect: false },
          { text: "zu", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَرْ",
        options: [
          { text: "ir", isCorrect: false },
          { text: "ur", isCorrect: false },
          { text: "ar", isCorrect: true },
          { text: "ra", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِرْ",
        options: [
          { text: "ir", isCorrect: true },
          { text: "ar", isCorrect: false },
          { text: "ur", isCorrect: false },
          { text: "ri", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اُرْ",
        options: [
          { text: "ar", isCorrect: false },
          { text: "ur", isCorrect: true },
          { text: "ir", isCorrect: false },
          { text: "ru", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَمْ",
        options: [
          { text: "am", isCorrect: true },
          { text: "im", isCorrect: false },
          { text: "um", isCorrect: false },
          { text: "ma", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِمْ",
        options: [
          { text: "am", isCorrect: false },
          { text: "im", isCorrect: true },
          { text: "um", isCorrect: false },
          { text: "mi", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اُمْ",
        options: [
          { text: "um", isCorrect: true },
          { text: "am", isCorrect: false },
          { text: "im", isCorrect: false },
          { text: "mu", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُزْ",
        options: [
          { text: "maz", isCorrect: false },
          { text: "muz", isCorrect: true },
          { text: "miz", isCorrect: false },
          { text: "zum", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q11',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رُمْ",
        options: [
          { text: "ram", isCorrect: false },
          { text: "rim", isCorrect: false },
          { text: "rum", isCorrect: true },
          { text: "mur", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q12',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَمَرَ",
        options: [
          { text: "amara", isCorrect: true },
          { text: "umira", isCorrect: false },
          { text: "amuru", isCorrect: false },
          { text: "imara", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q13',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اُمِرَ",
        options: [
          { text: "amara", isCorrect: false },
          { text: "umira", isCorrect: true },
          { text: "amuru", isCorrect: false },
          { text: "umara", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q14',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَمُرُ",
        options: [
          { text: "amara", isCorrect: false },
          { text: "amuru", isCorrect: true },
          { text: "umira", isCorrect: false },
          { text: "amiru", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q15',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُتْ",
        options: [
          { text: "mat", isCorrect: false },
          { text: "mit", isCorrect: false },
          { text: "mut", isCorrect: true },
          { text: "tum", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q16',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مِتْ",
        options: [
          { text: "mit", isCorrect: true },
          { text: "mat", isCorrect: false },
          { text: "mut", isCorrect: false },
          { text: "tim", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q17',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "تَمُزْ",
        options: [
          { text: "tamiz", isCorrect: false },
          { text: "tamuz", isCorrect: true },
          { text: "tumaz", isCorrect: false },
          { text: "timuz", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q18',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "تَرَزَ",
        options: [
          { text: "taraza", isCorrect: true },
          { text: "turiza", isCorrect: false },
          { text: "tariza", isCorrect: false },
          { text: "turaza", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q19',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "ذُرِتْ",
        options: [
          { text: "dharit", isCorrect: false },
          { text: "dhurit", isCorrect: true },
          { text: "dhurat", isCorrect: false },
          { text: "dharut", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q20',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَمَرْتْ",
        options: [
          { text: "amart", isCorrect: true },
          { text: "amirt", isCorrect: false },
          { text: "umurt", isCorrect: false },
          { text: "amarat", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q21',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَرَزْتْ",
        options: [
          { text: "marizt", isCorrect: false },
          { text: "marazt", isCorrect: true },
          { text: "muruzt", isCorrect: false },
          { text: "mirаzt", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q22',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَنْ",
        options: [
          { text: "an", isCorrect: true },
          { text: "in", isCorrect: false },
          { text: "un", isCorrect: false },
          { text: "na", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q23',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِنْ",
        options: [
          { text: "an", isCorrect: false },
          { text: "in", isCorrect: true },
          { text: "un", isCorrect: false },
          { text: "ni", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q24',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "زَنْ",
        options: [
          { text: "zan", isCorrect: true },
          { text: "zin", isCorrect: false },
          { text: "zun", isCorrect: false },
          { text: "naz", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q25',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَنْ",
        options: [
          { text: "man", isCorrect: true },
          { text: "min", isCorrect: false },
          { text: "mun", isCorrect: false },
          { text: "nam", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q26',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مِنْ",
        options: [
          { text: "man", isCorrect: false },
          { text: "min", isCorrect: true },
          { text: "mun", isCorrect: false },
          { text: "nim", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q27',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نُمْ",
        options: [
          { text: "nam", isCorrect: false },
          { text: "nim", isCorrect: false },
          { text: "num", isCorrect: true },
          { text: "mun", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q28',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَنْتَ",
        options: [
          { text: "anta", isCorrect: true },
          { text: "anti", isCorrect: false },
          { text: "antu", isCorrect: false },
          { text: "unta", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q29',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَنْتُمْ",
        options: [
          { text: "antim", isCorrect: false },
          { text: "antum", isCorrect: true },
          { text: "antam", isCorrect: false },
          { text: "untum", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q30',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "زَيْتْ",
        options: [
          { text: "zayt", isCorrect: true },
          { text: "ziyt", isCorrect: false },
          { text: "zuyt", isCorrect: false },
          { text: "tayz", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q31',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَيْتْ",
        options: [
          { text: "miyt", isCorrect: false },
          { text: "mayt", isCorrect: true },
          { text: "muyt", isCorrect: false },
          { text: "taym", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q32',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَمْيْ",
        options: [
          { text: "ramy", isCorrect: true },
          { text: "rami", isCorrect: false },
          { text: "rumu", isCorrect: false },
          { text: "rimy", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q33',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يَمَنَ",
        options: [
          { text: "yumina", isCorrect: false },
          { text: "yamana", isCorrect: true },
          { text: "yamina", isCorrect: false },
          { text: "yumana", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q34',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَرْيَمُ",
        options: [
          { text: "maryamu", isCorrect: true },
          { text: "maryimu", isCorrect: false },
          { text: "muryamu", isCorrect: false },
          { text: "marimu", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q35',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَيْمَنَ",
        options: [
          { text: "maymina", isCorrect: false },
          { text: "maymana", isCorrect: true },
          { text: "muymana", isCorrect: false },
          { text: "maymuna", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q36',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَيْمَنَ",
        options: [
          { text: "aymana", isCorrect: true },
          { text: "aymina", isCorrect: false },
          { text: "uymana", isCorrect: false },
          { text: "aymuna", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q37',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِبْنْ",
        options: [
          { text: "ibn", isCorrect: true },
          { text: "iban", isCorrect: false },
          { text: "ibin", isCorrect: false },
          { text: "abn", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q38',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بِنْتْ",
        options: [
          { text: "bant", isCorrect: false },
          { text: "bint", isCorrect: true },
          { text: "bunt", isCorrect: false },
          { text: "nibt", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q39',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَيْنْ",
        options: [
          { text: "bayn", isCorrect: true },
          { text: "biyn", isCorrect: false },
          { text: "buyn", isCorrect: false },
          { text: "nayb", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q40',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "زَيْنَبْ",
        options: [
          { text: "zaynib", isCorrect: false },
          { text: "zuynab", isCorrect: false },
          { text: "zaynab", isCorrect: true },
          { text: "ziynab", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q41',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَيْرَمْ",
        options: [
          { text: "bayram", isCorrect: true },
          { text: "bayrim", isCorrect: false },
          { text: "buyram", isCorrect: false },
          { text: "biyram", isCorrect: false }
        ]
      },
      {
        id: 'ch1-q42',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَبْرَمْ",
        options: [
          { text: "ibram", isCorrect: false },
          { text: "abram", isCorrect: true },
          { text: "ubram", isCorrect: false },
          { text: "abrim", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: 'bBWaxNasua4', titleUz: '1-dars: Alifbo', titleRu: 'Урок 1: Алфавит', titleEn: 'Lesson 1: Alphabet' },
      { videoId: 'UWUtA7P0xCE', titleUz: '2-dars: Mahrajlar', titleRu: 'Урок 2: Махрадж', titleEn: 'Lesson 2: Articulation Points' },
      { videoId: 'DhbimE6IrSE', titleUz: '3-dars: Harakatlar', titleRu: 'Урок 3: Огласовки', titleEn: 'Lesson 3: Vowel Marks' },
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
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَمْ",
        options: [
          { text: "kam", isCorrect: true },
          { text: "kim", isCorrect: false },
          { text: "kum", isCorrect: false },
          { text: "mak", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كُمْ",
        options: [
          { text: "kam", isCorrect: false },
          { text: "kum", isCorrect: true },
          { text: "kim", isCorrect: false },
          { text: "muk", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كُنْ",
        options: [
          { text: "kun", isCorrect: true },
          { text: "kan", isCorrect: false },
          { text: "kin", isCorrect: false },
          { text: "nuk", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَيْ",
        options: [
          { text: "kiy", isCorrect: false },
          { text: "kay", isCorrect: true },
          { text: "kuy", isCorrect: false },
          { text: "yak", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَكُرْ",
        options: [
          { text: "bakur", isCorrect: true },
          { text: "bukur", isCorrect: false },
          { text: "bikur", isCorrect: false },
          { text: "bakir", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَكُرْ",
        options: [
          { text: "mukur", isCorrect: false },
          { text: "makur", isCorrect: true },
          { text: "mikur", isCorrect: false },
          { text: "makir", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَوْمْ",
        options: [
          { text: "kawm", isCorrect: true },
          { text: "kuwm", isCorrect: false },
          { text: "kaym", isCorrect: false },
          { text: "kiwm", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَنْزْ",
        options: [
          { text: "kinz", isCorrect: false },
          { text: "kanz", isCorrect: true },
          { text: "kunz", isCorrect: false },
          { text: "nazk", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَتَبَ",
        options: [
          { text: "kataba", isCorrect: true },
          { text: "kutiba", isCorrect: false },
          { text: "kitaba", isCorrect: false },
          { text: "katba", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يَكْتُبُ",
        options: [
          { text: "yaktabu", isCorrect: false },
          { text: "yaktubu", isCorrect: true },
          { text: "yuktibu", isCorrect: false },
          { text: "yaktibu", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q11',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "تَرَكَ",
        options: [
          { text: "taraka", isCorrect: true },
          { text: "turika", isCorrect: false },
          { text: "taruka", isCorrect: false },
          { text: "tiraka", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q12',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "لَمْ",
        options: [
          { text: "lim", isCorrect: false },
          { text: "lam", isCorrect: true },
          { text: "lum", isCorrect: false },
          { text: "mal", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q13',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "لَنْ",
        options: [
          { text: "lan", isCorrect: true },
          { text: "lin", isCorrect: false },
          { text: "lun", isCorrect: false },
          { text: "nal", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q14',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كُلْ",
        options: [
          { text: "kal", isCorrect: false },
          { text: "kul", isCorrect: true },
          { text: "kil", isCorrect: false },
          { text: "luk", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q15',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَلْ",
        options: [
          { text: "bal", isCorrect: true },
          { text: "bil", isCorrect: false },
          { text: "bul", isCorrect: false },
          { text: "lab", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q16',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَمَلَ",
        options: [
          { text: "kumila", isCorrect: false },
          { text: "kamala", isCorrect: true },
          { text: "kimala", isCorrect: false },
          { text: "kamula", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q17',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَنْزَلَ",
        options: [
          { text: "anzala", isCorrect: true },
          { text: "inzala", isCorrect: false },
          { text: "unzula", isCorrect: false },
          { text: "anzila", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q18',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَكْمَلَ",
        options: [
          { text: "ikmala", isCorrect: false },
          { text: "akmala", isCorrect: true },
          { text: "ukmula", isCorrect: false },
          { text: "akmila", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q19',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بُلْبُلْ",
        options: [
          { text: "bulbul", isCorrect: true },
          { text: "bilbil", isCorrect: false },
          { text: "balbul", isCorrect: false },
          { text: "bulbal", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q20',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "تَزَلْزَلَ",
        options: [
          { text: "tuzulzula", isCorrect: false },
          { text: "tazalzala", isCorrect: true },
          { text: "tizilzila", isCorrect: false },
          { text: "tazulzala", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q21',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "هَلْ",
        options: [
          { text: "hal", isCorrect: true },
          { text: "hil", isCorrect: false },
          { text: "hul", isCorrect: false },
          { text: "lah", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q22',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "هُوَ",
        options: [
          { text: "hiwa", isCorrect: false },
          { text: "huwa", isCorrect: true },
          { text: "hawa", isCorrect: false },
          { text: "huya", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q23',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "هِيَ",
        options: [
          { text: "hiya", isCorrect: true },
          { text: "huya", isCorrect: false },
          { text: "hawa", isCorrect: false },
          { text: "hiyya", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q24',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "هُمْ",
        options: [
          { text: "ham", isCorrect: false },
          { text: "hum", isCorrect: true },
          { text: "him", isCorrect: false },
          { text: "muh", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q25',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "وَهَبَ",
        options: [
          { text: "wahaba", isCorrect: true },
          { text: "wahiba", isCorrect: false },
          { text: "wuhuba", isCorrect: false },
          { text: "wahuba", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q26',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "لَهَبْ",
        options: [
          { text: "luhub", isCorrect: false },
          { text: "lahab", isCorrect: true },
          { text: "lahib", isCorrect: false },
          { text: "lihab", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q27',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "لَهُمْ",
        options: [
          { text: "lahum", isCorrect: true },
          { text: "lahim", isCorrect: false },
          { text: "luhum", isCorrect: false },
          { text: "laham", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q28',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "فَمْ",
        options: [
          { text: "fim", isCorrect: false },
          { text: "fam", isCorrect: true },
          { text: "fum", isCorrect: false },
          { text: "maf", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q29',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "فَنْ",
        options: [
          { text: "fan", isCorrect: true },
          { text: "fin", isCorrect: false },
          { text: "fun", isCorrect: false },
          { text: "naf", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q30',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "قَلَمْ",
        options: [
          { text: "qulam", isCorrect: false },
          { text: "qalam", isCorrect: true },
          { text: "qilam", isCorrect: false },
          { text: "qalim", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q31',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "قُمْ",
        options: [
          { text: "qum", isCorrect: true },
          { text: "qam", isCorrect: false },
          { text: "qim", isCorrect: false },
          { text: "muq", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q32',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "قَلْبُ",
        options: [
          { text: "qulbu", isCorrect: false },
          { text: "qalbu", isCorrect: true },
          { text: "qilbu", isCorrect: false },
          { text: "qalbi", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q33',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "قَمَرْ",
        options: [
          { text: "qamar", isCorrect: true },
          { text: "qumar", isCorrect: false },
          { text: "qimar", isCorrect: false },
          { text: "qamir", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q34',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "لَقَبْ",
        options: [
          { text: "luqub", isCorrect: false },
          { text: "laqab", isCorrect: true },
          { text: "liqab", isCorrect: false },
          { text: "laqib", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q35',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "شَرِبَ",
        options: [
          { text: "shariba", isCorrect: true },
          { text: "sharaba", isCorrect: false },
          { text: "shuriba", isCorrect: false },
          { text: "shirba", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q36',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "شَهْرُ",
        options: [
          { text: "shahri", isCorrect: false },
          { text: "shahru", isCorrect: true },
          { text: "shuhru", isCorrect: false },
          { text: "shahru", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q37',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "شُكْرُ",
        options: [
          { text: "shukru", isCorrect: true },
          { text: "shukri", isCorrect: false },
          { text: "shakru", isCorrect: false },
          { text: "shikru", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q38',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَشْرَبْ",
        options: [
          { text: "mushrib", isCorrect: false },
          { text: "mashrab", isCorrect: true },
          { text: "mashrib", isCorrect: false },
          { text: "mushrab", isCorrect: false }
        ]
      },
      {
        id: 'ch2-q39',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُشْتَرَكْ",
        options: [
          { text: "mushtarak", isCorrect: true },
          { text: "mushtirak", isCorrect: false },
          { text: "mushtarik", isCorrect: false },
          { text: "mishtarak", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: 'FZzftaWQTyI', titleUz: '4-dars: ز harfi', titleRu: 'Урок 4: Буква Зай', titleEn: 'Lesson 4: Letter Zay' },
      { videoId: '2QmOIb2ccsQ', titleUz: '5-dars: م harfi', titleRu: 'Урок 5: Буква Мим', titleEn: 'Lesson 5: Letter Mim' },
      { videoId: 'KyO6eXGA6R8', titleUz: '6-dars: ت harfi', titleRu: 'Урок 6: Буква Та', titleEn: 'Lesson 6: Letter Ta' },
      { videoId: 'XLjL7clkdHQ', titleUz: '7-dars: ن harfi', titleRu: 'Урок 7: Буква Нун', titleEn: 'Lesson 7: Letter Nun' },
      { videoId: '8W6RCdU2Gic', titleUz: '8-dars: ي harfi', titleRu: 'Урок 8: Буква Йа', titleEn: 'Lesson 8: Letter Ya' },
      { videoId: 'Zt3sm6OVVKA', titleUz: '9-dars: ب harfi', titleRu: 'Урок 9: Буква Ба', titleEn: 'Lesson 9: Letter Ba' },
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
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كِتَابًا",
        options: [
          { text: "kitaaban", isCorrect: true },
          { text: "kitaabun", isCorrect: false },
          { text: "kitaabin", isCorrect: false },
          { text: "kitaab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَجُلًا",
        options: [
          { text: "rajulun", isCorrect: false },
          { text: "rajulan", isCorrect: true },
          { text: "rajulin", isCorrect: false },
          { text: "rajul", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَابًا",
        options: [
          { text: "baaban", isCorrect: true },
          { text: "baabun", isCorrect: false },
          { text: "baabin", isCorrect: false },
          { text: "baab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كِتَابٍ",
        options: [
          { text: "kitaabun", isCorrect: false },
          { text: "kitaabin", isCorrect: true },
          { text: "kitaaban", isCorrect: false },
          { text: "kitaab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَجُلٍ",
        options: [
          { text: "rajulin", isCorrect: true },
          { text: "rajulun", isCorrect: false },
          { text: "rajulan", isCorrect: false },
          { text: "rajul", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَابٍ",
        options: [
          { text: "baabun", isCorrect: false },
          { text: "baabin", isCorrect: true },
          { text: "baaban", isCorrect: false },
          { text: "baab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كِتَابٌ",
        options: [
          { text: "kitaabun", isCorrect: true },
          { text: "kitaabin", isCorrect: false },
          { text: "kitaaban", isCorrect: false },
          { text: "kitaab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَجُلٌ",
        options: [
          { text: "rajulin", isCorrect: false },
          { text: "rajulun", isCorrect: true },
          { text: "rajulan", isCorrect: false },
          { text: "rajul", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَابٌ",
        options: [
          { text: "baabun", isCorrect: true },
          { text: "baabin", isCorrect: false },
          { text: "baaban", isCorrect: false },
          { text: "baab", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَبًّا",
        options: [
          { text: "rabbun", isCorrect: false },
          { text: "rabbin", isCorrect: false },
          { text: "rabban", isCorrect: true },
          { text: "rabb", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q11',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "حَبًّا",
        options: [
          { text: "habban", isCorrect: true },
          { text: "habbun", isCorrect: false },
          { text: "habbin", isCorrect: false },
          { text: "habb", isCorrect: false }
        ]
      },
      {
        id: 'ch3-q12',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَسًّا",
        options: [
          { text: "massun", isCorrect: false },
          { text: "massan", isCorrect: true },
          { text: "massin", isCorrect: false },
          { text: "mass", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: 'PXcdBw2Ycx4', titleUz: '31-dars: Tashdidli harfi', titleRu: 'Урок 31: Буквы с ташдидом', titleEn: 'Lesson 31: Letters with Tashdid' },
      { videoId: '3Xqv9Lo0h88', titleUz: '32-dars: Tanvinli tashdid', titleRu: 'Урок 32: Танвин с ташдидом', titleEn: 'Lesson 32: Tanwin with Tashdid' },
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
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِبْنْ",
        options: [
          { text: "ibn", isCorrect: true },
          { text: "iban", isCorrect: false },
          { text: "ibin", isCorrect: false },
          { text: "abn", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بِنْتْ",
        options: [
          { text: "bant", isCorrect: false },
          { text: "bint", isCorrect: true },
          { text: "bunt", isCorrect: false },
          { text: "bnat", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَبَّ",
        options: [
          { text: "rabba", isCorrect: true },
          { text: "raba", isCorrect: false },
          { text: "rabbi", isCorrect: false },
          { text: "rubba", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "حَقَّ",
        options: [
          { text: "haqa", isCorrect: false },
          { text: "haqqa", isCorrect: true },
          { text: "haqqi", isCorrect: false },
          { text: "huqqa", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كُلَّ",
        options: [
          { text: "kulla", isCorrect: true },
          { text: "kula", isCorrect: false },
          { text: "kulli", isCorrect: false },
          { text: "kalla", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "ثُمَّ",
        options: [
          { text: "thuma", isCorrect: false },
          { text: "thumma", isCorrect: true },
          { text: "thummi", isCorrect: false },
          { text: "thamma", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِنَّ",
        options: [
          { text: "inna", isCorrect: true },
          { text: "ina", isCorrect: false },
          { text: "inni", isCorrect: false },
          { text: "anna", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "عَلَّمَ",
        options: [
          { text: "alama", isCorrect: false },
          { text: "allama", isCorrect: true },
          { text: "allima", isCorrect: false },
          { text: "ullima", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يُعَلِّمُ",
        options: [
          { text: "yu'allimu", isCorrect: true },
          { text: "yu'alimu", isCorrect: false },
          { text: "ya'llimu", isCorrect: false },
          { text: "yu'allamu", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُعَلِّمٌ",
        options: [
          { text: "mu'alimun", isCorrect: false },
          { text: "mu'allimun", isCorrect: true },
          { text: "ma'llimun", isCorrect: false },
          { text: "mu'allamun", isCorrect: false }
        ]
      },
      {
        id: 'ch4-q11',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُكَبِّرٌ",
        options: [
          { text: "mukabbirun", isCorrect: true },
          { text: "mukabirun", isCorrect: false },
          { text: "mukabbarun", isCorrect: false },
          { text: "mikabbirun", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: 'PXcdBw2Ycx4', titleUz: '31-dars: Tashdidli harfi', titleRu: 'Урок 31: Ташдид', titleEn: 'Lesson 31: Tashdid' },
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
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كِتَابْ",
        options: [
          { text: "kitaab", isCorrect: true },
          { text: "kitab", isCorrect: false },
          { text: "kutub", isCorrect: false },
          { text: "kataab", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بَابْ",
        options: [
          { text: "bab", isCorrect: false },
          { text: "baab", isCorrect: true },
          { text: "buub", isCorrect: false },
          { text: "biib", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نَارْ",
        options: [
          { text: "naar", isCorrect: true },
          { text: "nar", isCorrect: false },
          { text: "niir", isCorrect: false },
          { text: "nuur", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "قَالَ",
        options: [
          { text: "qala", isCorrect: false },
          { text: "qaala", isCorrect: true },
          { text: "quula", isCorrect: false },
          { text: "qiila", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نَامَ",
        options: [
          { text: "naama", isCorrect: true },
          { text: "nama", isCorrect: false },
          { text: "nuuma", isCorrect: false },
          { text: "niima", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نَبِيْ",
        options: [
          { text: "nabi", isCorrect: false },
          { text: "nabii", isCorrect: true },
          { text: "nabuu", isCorrect: false },
          { text: "nabaa", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "كَبِيْرْ",
        options: [
          { text: "kabiir", isCorrect: true },
          { text: "kabir", isCorrect: false },
          { text: "kubiir", isCorrect: false },
          { text: "kabaar", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "صَغِيْرْ",
        options: [
          { text: "saghir", isCorrect: false },
          { text: "saghiir", isCorrect: true },
          { text: "sughuir", isCorrect: false },
          { text: "saghaar", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نُوْرْ",
        options: [
          { text: "nuur", isCorrect: true },
          { text: "nur", isCorrect: false },
          { text: "naar", isCorrect: false },
          { text: "niir", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَسُوْلْ",
        options: [
          { text: "rasul", isCorrect: false },
          { text: "rasuul", isCorrect: true },
          { text: "risuul", isCorrect: false },
          { text: "rasuul", isCorrect: false }
        ]
      },
      {
        id: 'ch5-q11',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "دُرُوْسْ",
        options: [
          { text: "duruus", isCorrect: true },
          { text: "durus", isCorrect: false },
          { text: "daruus", isCorrect: false },
          { text: "diruus", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: '1i1LRB6ixr4', titleUz: '30-dars: Mad tabiiy', titleRu: 'Урок 30: Естественный мадд', titleEn: 'Lesson 30: Natural Madd' },
      { videoId: '2XYApww_2Rc', titleUz: '35-dars: Muqaddar alif', titleRu: 'Урок 35: Мукаддар алиф', titleEn: 'Lesson 35: Hidden Alif' },
      { videoId: '9PaZg6TDoxY', titleUz: '36-dars: Muqaddar ي va و', titleRu: 'Урок 36: Мукаддар Йа и Вав', titleEn: 'Lesson 36: Hidden Ya and Waw' },
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
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلْكِتَابُ",
        options: [
          { text: "al-kitaabu", isCorrect: true },
          { text: "al-katabu", isCorrect: false },
          { text: "al-kutubu", isCorrect: false },
          { text: "ak-kitaabu", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلْقَمَرُ",
        options: [
          { text: "al-qumaru", isCorrect: false },
          { text: "al-qamaru", isCorrect: true },
          { text: "aq-qamaru", isCorrect: false },
          { text: "al-qimaru", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلْمَسْجِدُ",
        options: [
          { text: "al-masjidu", isCorrect: true },
          { text: "al-musjidu", isCorrect: false },
          { text: "am-masjidu", isCorrect: false },
          { text: "al-masjadu", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلتَّمْرُ",
        options: [
          { text: "al-tamru", isCorrect: false },
          { text: "at-tamru", isCorrect: true },
          { text: "at-timru", isCorrect: false },
          { text: "at-tumru", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلذَّهَبُ",
        options: [
          { text: "adh-dhahabu", isCorrect: true },
          { text: "al-dhahabu", isCorrect: false },
          { text: "adh-dhahbu", isCorrect: false },
          { text: "adh-dhihabu", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلشَّجَرُ",
        options: [
          { text: "al-shajaru", isCorrect: false },
          { text: "ash-shajaru", isCorrect: true },
          { text: "ash-shijaru", isCorrect: false },
          { text: "ash-shujaru", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلصَّقْرُ",
        options: [
          { text: "as-saqru", isCorrect: true },
          { text: "al-saqru", isCorrect: false },
          { text: "as-suqru", isCorrect: false },
          { text: "as-siqru", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلنَّسَبُ",
        options: [
          { text: "al-nasabu", isCorrect: false },
          { text: "an-nasabu", isCorrect: true },
          { text: "an-nusabu", isCorrect: false },
          { text: "an-nisabu", isCorrect: false }
        ]
      },
      {
        id: 'ch6-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلشَّمْسُ",
        options: [
          { text: "ash-shamsu", isCorrect: true },
          { text: "al-shamsu", isCorrect: false },
          { text: "ash-shimsu", isCorrect: false },
          { text: "ash-shumsu", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: '53UiqNRUuHs', titleUz: '39-dars: Qamariyya harflari', titleRu: 'Урок 39: Камария', titleEn: 'Lesson 39: Moon Letters' },
      { videoId: '15M6Z7zcEXI', titleUz: '40-dars: Shamsiya harflari', titleRu: 'Урок 40: Шамсия', titleEn: 'Lesson 40: Sun Letters' },
      { videoId: 'Vlms7i490M0', titleUz: '41-dars: Qamariya va shamsiya', titleRu: 'Урок 41: Камария и Шамсия', titleEn: 'Lesson 41: Moon & Sun Letters' },
      { videoId: 'iATPBMSWfe4', titleUz: "38-dars: O'qilmaydigan harflar", titleRu: 'Урок 38: Непроизносимые буквы', titleEn: 'Lesson 38: Silent Letters' },
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
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يُقَالُ",
        options: [
          { text: "yuqaalu", isCorrect: true },
          { text: "yaqaalu", isCorrect: false },
          { text: "yuqalu", isCorrect: false },
          { text: "yuqiilu", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يَقُوْلُ",
        options: [
          { text: "yaqulu", isCorrect: false },
          { text: "yaquulu", isCorrect: true },
          { text: "yuquulu", isCorrect: false },
          { text: "yaqaalu", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يَطُوْفُ",
        options: [
          { text: "yatuufu", isCorrect: true },
          { text: "yatufu", isCorrect: false },
          { text: "yituufu", isCorrect: false },
          { text: "yatuufi", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يَقُوْلُوْنَ",
        options: [
          { text: "yaquluna", isCorrect: false },
          { text: "yaquuluuna", isCorrect: true },
          { text: "yaquuluna", isCorrect: false },
          { text: "yaqaluuna", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "تَقُوْمُوْنَ",
        options: [
          { text: "taquumuuna", isCorrect: true },
          { text: "taqumuna", isCorrect: false },
          { text: "taquumuna", isCorrect: false },
          { text: "taqaamuuna", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُسْلِمٌ",
        options: [
          { text: "muslim", isCorrect: false },
          { text: "muslimun", isCorrect: true },
          { text: "musilmun", isCorrect: false },
          { text: "maslimun", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "عَالِمٌ",
        options: [
          { text: "aalimun", isCorrect: true },
          { text: "alimun", isCorrect: false },
          { text: "uulimun", isCorrect: false },
          { text: "aalamun", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "طَالِبٌ",
        options: [
          { text: "talibun", isCorrect: false },
          { text: "taalibun", isCorrect: true },
          { text: "tuulibun", isCorrect: false },
          { text: "taalabun", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "صَالِحٌ",
        options: [
          { text: "saalihun", isCorrect: true },
          { text: "salihun", isCorrect: false },
          { text: "suulihun", isCorrect: false },
          { text: "saalahun", isCorrect: false }
        ]
      },
      {
        id: 'ch7-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "صَابِرٌ",
        options: [
          { text: "sabirun", isCorrect: false },
          { text: "saabirun", isCorrect: true },
          { text: "suubirun", isCorrect: false },
          { text: "saabarun", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: 'YQrroHDxPKc', titleUz: "43-dars: So'z so'ngida madlik", titleRu: 'Урок 43: Мадд в конце слова', titleEn: 'Lesson 43: Madd at End of Word' },
      { videoId: 'ZGvFRcB5g1M', titleUz: "44-dars: Idg'om qoidasi", titleRu: 'Урок 44: Правило идгам', titleEn: 'Lesson 44: Idgham Rule' },
      { videoId: 'xLK-lvetVlg', titleUz: '45-dars: Iqlob qoidasi', titleRu: 'Урок 45: Правило иклаб', titleEn: 'Lesson 45: Iqlab Rule' },
      { videoId: 'HDtdqQkJNn8', titleUz: '46-dars: Alloh lafzi', titleRu: 'Урок 46: Слово Аллах', titleEn: 'Lesson 46: Word Allah' },
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
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "بِسْمِ",
        options: [
          { text: "bismi", isCorrect: true },
          { text: "basmi", isCorrect: false },
          { text: "busmi", isCorrect: false },
          { text: "bisma", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اللهِ",
        options: [
          { text: "allahi", isCorrect: false },
          { text: "allaahi", isCorrect: true },
          { text: "illaahi", isCorrect: false },
          { text: "alluhi", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "الرَّحْمٰنِ",
        options: [
          { text: "ar-rahmaani", isCorrect: true },
          { text: "al-rahmaani", isCorrect: false },
          { text: "ar-rahmuuni", isCorrect: false },
          { text: "ar-rihmani", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "الرَّحِيْمِ",
        options: [
          { text: "al-rahiimi", isCorrect: false },
          { text: "ar-rahiimi", isCorrect: true },
          { text: "ar-ruhiimi", isCorrect: false },
          { text: "ar-rahiima", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مُحَمَّدٌ",
        options: [
          { text: "muhammadun", isCorrect: true },
          { text: "muhamadun", isCorrect: false },
          { text: "mahmudun", isCorrect: false },
          { text: "muhammidun", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَسُوْلُ",
        options: [
          { text: "rasulu", isCorrect: false },
          { text: "rasuulu", isCorrect: true },
          { text: "rusuulu", isCorrect: false },
          { text: "risuulu", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَشْهَدُ",
        options: [
          { text: "ash-hadu", isCorrect: true },
          { text: "ash-hudu", isCorrect: false },
          { text: "ush-hadu", isCorrect: false },
          { text: "ash-hidu", isCorrect: false }
        ]
      },
      {
        id: 'ch8-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "عَبْدُهُ",
        options: [
          { text: "abdihu", isCorrect: false },
          { text: "abduhu", isCorrect: true },
          { text: "ubduhu", isCorrect: false },
          { text: "abdahu", isCorrect: false }
        ]
      }
    ],
    videos: [
      { videoId: 'gP4bbsDG1C8', titleUz: '33-dars: Hamza', titleRu: 'Урок 33: Хамза', titleEn: 'Lesson 33: Hamza' },
      { videoId: '39lT-YwueM4', titleUz: '34-dars: Ta marbuta (ة)', titleRu: 'Урок 34: Та марбута', titleEn: 'Lesson 34: Ta Marbuta' },
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
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَلْحَمْدُ",
        options: [
          { text: "al-hamdu", isCorrect: true },
          { text: "al-himdu", isCorrect: false },
          { text: "al-humdu", isCorrect: false },
          { text: "a-hamdu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q2',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "لِلّٰهِ",
        options: [
          { text: "lillahi", isCorrect: false },
          { text: "lillaahi", isCorrect: true },
          { text: "lullaahi", isCorrect: false },
          { text: "lillaahu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q3',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "رَبِّ",
        options: [
          { text: "rabbi", isCorrect: true },
          { text: "rabi", isCorrect: false },
          { text: "rubbi", isCorrect: false },
          { text: "rabba", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q4',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "الْعَالَمِيْنَ",
        options: [
          { text: "al-alimiina", isCorrect: false },
          { text: "al-aalamiina", isCorrect: true },
          { text: "al-aalumiina", isCorrect: false },
          { text: "al-aalamina", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q5',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "مَالِكِ",
        options: [
          { text: "maaliki", isCorrect: true },
          { text: "maliki", isCorrect: false },
          { text: "muuliki", isCorrect: false },
          { text: "maalaki", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q6',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "يَوْمِ",
        options: [
          { text: "yuwmi", isCorrect: false },
          { text: "yawmi", isCorrect: true },
          { text: "yawma", isCorrect: false },
          { text: "yiymi", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q7',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "الدِّيْنِ",
        options: [
          { text: "ad-diini", isCorrect: true },
          { text: "al-diini", isCorrect: false },
          { text: "ad-duuni", isCorrect: false },
          { text: "ad-dini", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q8',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اِيَّاكَ",
        options: [
          { text: "iyaaka", isCorrect: false },
          { text: "iyyaaka", isCorrect: true },
          { text: "iyyuuka", isCorrect: false },
          { text: "iyyaaki", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q9',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نَعْبُدُ",
        options: [
          { text: "na'budu", isCorrect: true },
          { text: "na'badu", isCorrect: false },
          { text: "nu'budu", isCorrect: false },
          { text: "na'bidu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q10',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "نَسْتَعِيْنُ",
        options: [
          { text: "nasta'inu", isCorrect: false },
          { text: "nasta'iinu", isCorrect: true },
          { text: "nista'iinu", isCorrect: false },
          { text: "nasta'uunu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q11',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "قُلْ",
        options: [
          { text: "qul", isCorrect: true },
          { text: "qal", isCorrect: false },
          { text: "qil", isCorrect: false },
          { text: "luq", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q12',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "هُوَ",
        options: [
          { text: "hawa", isCorrect: false },
          { text: "huwa", isCorrect: true },
          { text: "hiwa", isCorrect: false },
          { text: "huya", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q13',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَحَدٌ",
        options: [
          { text: "ahadun", isCorrect: true },
          { text: "ahidun", isCorrect: false },
          { text: "uhudun", isCorrect: false },
          { text: "ahadan", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q14',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "الصَّمَدُ",
        options: [
          { text: "al-samadu", isCorrect: false },
          { text: "as-samadu", isCorrect: true },
          { text: "as-simadu", isCorrect: false },
          { text: "as-sumadu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q15',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "اَعُوْذُ",
        options: [
          { text: "a'uudhu", isCorrect: true },
          { text: "a'udhu", isCorrect: false },
          { text: "a'uudha", isCorrect: false },
          { text: "i'uudhu", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q16',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "الْفَلَقِ",
        options: [
          { text: "al-fulaqi", isCorrect: false },
          { text: "al-falaqi", isCorrect: true },
          { text: "al-faliqi", isCorrect: false },
          { text: "al-faluqi", isCorrect: false }
        ]
      },
      {
        id: 'ch9-q17',
        type: 'identify',
        questionUz: "Bu qanday o'qiladi?",
        questionRu: "Как это читается?",
        questionEn: "How is this read?",
        arabic: "النَّاسِ",
        options: [
          { text: "an-naasi", isCorrect: true },
          { text: "al-naasi", isCorrect: false },
          { text: "an-nuusi", isCorrect: false },
          { text: "an-niisi", isCorrect: false }
        ]
      }
    ]
  }
];
