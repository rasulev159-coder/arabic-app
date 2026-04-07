import { LETTERS, ArabicLetter } from '@arabic/shared';

/** 6 letters that NEVER connect to the next (left-side) letter */
export const NON_CONNECTING_CODES = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

export function isConnecting(code: string): boolean {
  return !NON_CONNECTING_CODES.includes(code);
}

export function getConnectingLetters(): ArabicLetter[] {
  return LETTERS.filter(l => isConnecting(l.code));
}

export function getNonConnectingLetters(): ArabicLetter[] {
  return LETTERS.filter(l => !isConnecting(l.code));
}

/** Sample Arabic words for quiz phases — each word with its constituent letter codes */
export interface ArabicWord {
  word: string;
  letters: string[];
  meaningUz: string;
  meaningRu: string;
  meaningEn: string;
}

export const SAMPLE_WORDS: ArabicWord[] = [
  { word: 'كتب', letters: ['ك','ت','ب'], meaningUz: 'yozdi', meaningRu: 'написал', meaningEn: 'wrote' },
  { word: 'درس', letters: ['د','ر','س'], meaningUz: 'dars', meaningRu: 'урок', meaningEn: 'lesson' },
  { word: 'بيت', letters: ['ب','ي','ت'], meaningUz: 'uy', meaningRu: 'дом', meaningEn: 'house' },
  { word: 'ولد', letters: ['و','ل','د'], meaningUz: "bola", meaningRu: 'мальчик', meaningEn: 'boy' },
  { word: 'قرأ', letters: ['ق','ر','أ'], meaningUz: "o'qidi", meaningRu: 'читал', meaningEn: 'read' },
  { word: 'زرع', letters: ['ز','ر','ع'], meaningUz: 'ekdi', meaningRu: 'посадил', meaningEn: 'planted' },
  { word: 'ذهب', letters: ['ذ','ه','ب'], meaningUz: 'ketdi', meaningRu: 'ушёл', meaningEn: 'went' },
  { word: 'جلس', letters: ['ج','ل','س'], meaningUz: "o'tirdi", meaningRu: 'сел', meaningEn: 'sat' },
  { word: 'فتح', letters: ['ف','ت','ح'], meaningUz: 'ochdi', meaningRu: 'открыл', meaningEn: 'opened' },
  { word: 'سمع', letters: ['س','م','ع'], meaningUz: 'eshitdi', meaningRu: 'услышал', meaningEn: 'heard' },
  { word: 'خرج', letters: ['خ','ر','ج'], meaningUz: 'chiqdi', meaningRu: 'вышел', meaningEn: 'went out' },
  { word: 'نزل', letters: ['ن','ز','ل'], meaningUz: 'tushdi', meaningRu: 'спустился', meaningEn: 'descended' },
  { word: 'عمل', letters: ['ع','م','ل'], meaningUz: 'ishladi', meaningRu: 'работал', meaningEn: 'worked' },
  { word: 'شرب', letters: ['ش','ر','ب'], meaningUz: 'ichdi', meaningRu: 'пил', meaningEn: 'drank' },
  { word: 'وقف', letters: ['و','ق','ف'], meaningUz: "to'xtadi", meaningRu: 'остановился', meaningEn: 'stopped' },
  { word: 'ركب', letters: ['ر','ك','ب'], meaningUz: 'mindi', meaningRu: 'сел (на)', meaningEn: 'rode' },
  { word: 'غسل', letters: ['غ','س','ل'], meaningUz: 'yuvdi', meaningRu: 'мыл', meaningEn: 'washed' },
  { word: 'حفظ', letters: ['ح','ف','ظ'], meaningUz: 'yodladi', meaningRu: 'выучил', meaningEn: 'memorized' },
  { word: 'صبر', letters: ['ص','ب','ر'], meaningUz: 'sabr qildi', meaningRu: 'терпел', meaningEn: 'was patient' },
  { word: 'ضرب', letters: ['ض','ر','ب'], meaningUz: 'urdi', meaningRu: 'ударил', meaningEn: 'hit' },
  { word: 'طبخ', letters: ['ط','ب','خ'], meaningUz: 'pishirdi', meaningRu: 'готовил', meaningEn: 'cooked' },
  { word: 'مدرسة', letters: ['م','د','ر','س','ة'], meaningUz: 'maktab', meaningRu: 'школа', meaningEn: 'school' },
  { word: 'كتاب', letters: ['ك','ت','ا','ب'], meaningUz: 'kitob', meaningRu: 'книга', meaningEn: 'book' },
  { word: 'مسجد', letters: ['م','س','ج','د'], meaningUz: 'masjid', meaningRu: 'мечеть', meaningEn: 'mosque' },
  { word: 'دراسة', letters: ['د','ر','ا','س','ة'], meaningUz: "o'qish", meaningRu: 'учёба', meaningEn: 'study' },
];
