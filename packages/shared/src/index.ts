// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  language?: Language;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserPublic;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type Language = 'ru' | 'uz' | 'en';

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  language: Language;
  createdAt: string;
  level: UserLevel;
  role?: string;
  xp: number;
  xpLevel: number;
  streak: StreakInfo;
  knownLettersCount: number;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
}

export type UserLevel = 'beginner' | 'student' | 'expert' | 'master';

export function getLevel(knownCount: number): UserLevel {
  if (knownCount <= 6)  return 'beginner';
  if (knownCount <= 13) return 'student';
  if (knownCount <= 21) return 'expert';
  return 'master';
}

export const LEVEL_LABELS: Record<Language, Record<UserLevel, string>> = {
  ru: { beginner: 'Новичок', student: 'Ученик', expert: 'Знаток', master: 'Мастер' },
  uz: { beginner: 'Yangi boshlovchi', student: 'O\'quvchi', expert: 'Bilimdon', master: 'Usta' },
  en: { beginner: 'Beginner', student: 'Student', expert: 'Expert', master: 'Master' },
};

// ─── Streak ───────────────────────────────────────────────────────────────────

export interface StreakInfo {
  current: number;
  longest: number;
  lastActivity: string | null;
}

// ─── Letters ──────────────────────────────────────────────────────────────────

export interface ArabicLetter {
  code: string;        // the Arabic character 'ب'
  index: number;       // 1-28
  nameRu: string;
  nameUz: string;
  nameEn: string;
  transcription: string;
  iso: string;
  ini: string;
  med: string;
  fin: string;
  group?: LetterGroup; // confusable group
  associationRu?: string;
  associationUz?: string;
  associationEn?: string;
}

export type LetterGroup =
  | 'btt' | 'jch' | 'dz' | 'rz' | 'ss'
  | 'sd' | 'tz' | 'ag' | 'fq';

export const LETTERS: ArabicLetter[] = [
  { code:'ا', index:1,  nameRu:'Алиф',       nameUz:'Alif',   nameEn:'Alif',       transcription:'[alif] — долгий «а»',    iso:'ا', ini:'ا',  med:'ـا', fin:'ـا' },
  { code:'ب', index:2,  nameRu:'Ба',          nameUz:'Bo',     nameEn:'Ba',         transcription:'[bā] — «б»',             iso:'ب', ini:'بـ', med:'ـبـ',fin:'ـب', group:'btt' },
  { code:'ت', index:3,  nameRu:'Та',          nameUz:'To',     nameEn:'Ta',         transcription:'[tā] — «т»',             iso:'ت', ini:'تـ', med:'ـتـ',fin:'ـت', group:'btt' },
  { code:'ث', index:4,  nameRu:'Са',          nameUz:'Sa',     nameEn:'Tha',        transcription:'[ṯā] — межзуб. «с»',     iso:'ث', ini:'ثـ', med:'ـثـ',fin:'ـث', group:'btt' },
  { code:'ج', index:5,  nameRu:'Джим',        nameUz:'Jim',    nameEn:'Jim',        transcription:'[ǧīm] — «дж»',           iso:'ج', ini:'جـ', med:'ـجـ',fin:'ـج', group:'jch' },
  { code:'ح', index:6,  nameRu:'Ха',          nameUz:'Ho',     nameEn:'Ha',         transcription:'[ḥā] — гортанный «х»',   iso:'ح', ini:'حـ', med:'ـحـ',fin:'ـح', group:'jch' },
  { code:'خ', index:7,  nameRu:'Хя',          nameUz:'Xa',     nameEn:'Kha',        transcription:'[ḫā] — «х» (хаша)',      iso:'خ', ini:'خـ', med:'ـخـ',fin:'ـخ', group:'jch' },
  { code:'د', index:8,  nameRu:'Даль',        nameUz:'Dol',    nameEn:'Dal',        transcription:'[dāl] — «д»',            iso:'د', ini:'د',  med:'ـد', fin:'ـد', group:'dz'  },
  { code:'ذ', index:9,  nameRu:'Заль',        nameUz:'Zol',    nameEn:'Dhal',       transcription:'[ḏāl] — межзуб. «з»',    iso:'ذ', ini:'ذ',  med:'ـذ', fin:'ـذ', group:'dz'  },
  { code:'ر', index:10, nameRu:'Ра',          nameUz:'Ra',     nameEn:'Ra',         transcription:'[rā] — «р»',             iso:'ر', ini:'ر',  med:'ـر', fin:'ـر', group:'rz'  },
  { code:'ز', index:11, nameRu:'Зай',         nameUz:'Zay',    nameEn:'Zay',        transcription:'[zāy] — «з»',            iso:'ز', ini:'ز',  med:'ـز', fin:'ـز', group:'rz'  },
  { code:'س', index:12, nameRu:'Син',         nameUz:'Sin',    nameEn:'Sin',        transcription:'[sīn] — «с»',            iso:'س', ini:'سـ', med:'ـسـ',fin:'ـس', group:'ss'  },
  { code:'ش', index:13, nameRu:'Шин',         nameUz:'Shin',   nameEn:'Shin',       transcription:'[šīn] — «ш»',            iso:'ش', ini:'شـ', med:'ـشـ',fin:'ـش', group:'ss'  },
  { code:'ص', index:14, nameRu:'Сад',         nameUz:'Sod',    nameEn:'Sad',        transcription:'[ṣād] — эмф. «с»',       iso:'ص', ini:'صـ', med:'ـصـ',fin:'ـص', group:'sd'  },
  { code:'ض', index:15, nameRu:'Дад',         nameUz:'Zod',    nameEn:'Dad',        transcription:'[ḍād] — эмф. «д»',       iso:'ض', ini:'ضـ', med:'ـضـ',fin:'ـض', group:'sd'  },
  { code:'ط', index:16, nameRu:'Та (эмф.)',   nameUz:"To'",    nameEn:'Ta (emph.)', transcription:'[ṭā] — эмф. «т»',        iso:'ط', ini:'طـ', med:'ـطـ',fin:'ـط', group:'tz'  },
  { code:'ظ', index:17, nameRu:'Зха',         nameUz:"Zo'",    nameEn:'Zha',        transcription:'[ẓā] — эмф. «з»',        iso:'ظ', ini:'ظـ', med:'ـظـ',fin:'ـظ', group:'tz'  },
  { code:'ع', index:18, nameRu:'Айн',         nameUz:"Ayn",    nameEn:'Ayn',        transcription:"[ʿayn] — гортанный",     iso:'ع', ini:'عـ', med:'ـعـ',fin:'ـع', group:'ag'  },
  { code:'غ', index:19, nameRu:'Гайн',        nameUz:'Gayn',   nameEn:'Ghain',      transcription:'[ġayn] — гортанный «г»', iso:'غ', ini:'غـ', med:'ـغـ',fin:'ـغ', group:'ag'  },
  { code:'ف', index:20, nameRu:'Фа',          nameUz:'Fa',     nameEn:'Fa',         transcription:'[fā] — «ф»',             iso:'ف', ini:'فـ', med:'ـفـ',fin:'ـف', group:'fq'  },
  { code:'ق', index:21, nameRu:'Каф',         nameUz:'Qof',    nameEn:'Qaf',        transcription:'[qāf] — глуб. «к»',      iso:'ق', ini:'قـ', med:'ـقـ',fin:'ـق', group:'fq'  },
  { code:'ك', index:22, nameRu:'Кяф',         nameUz:'Kof',    nameEn:'Kaf',        transcription:'[kāf] — «к»',            iso:'ك', ini:'كـ', med:'ـكـ',fin:'ـك' },
  { code:'ل', index:23, nameRu:'Лям',         nameUz:'Lom',    nameEn:'Lam',        transcription:'[lām] — «л»',            iso:'ل', ini:'لـ', med:'ـلـ',fin:'ـل' },
  { code:'م', index:24, nameRu:'Мим',         nameUz:'Mim',    nameEn:'Mim',        transcription:'[mīm] — «м»',            iso:'م', ini:'مـ', med:'ـمـ',fin:'ـم' },
  { code:'ن', index:25, nameRu:'Нун',         nameUz:'Nun',    nameEn:'Nun',        transcription:'[nūn] — «н»',            iso:'ن', ini:'نـ', med:'ـنـ',fin:'ـن' },
  { code:'ه', index:26, nameRu:'Ха (мягк.)',  nameUz:'Ha',     nameEn:'Ha (soft)',  transcription:'[hā] — мягкий «х»',      iso:'ه', ini:'هـ', med:'ـهـ',fin:'ـه' },
  { code:'و', index:27, nameRu:'Вав',         nameUz:'Vov',    nameEn:'Waw',        transcription:'[wāw] — «в»/«у»',        iso:'و', ini:'و',  med:'ـو', fin:'ـو' },
  { code:'ي', index:28, nameRu:'Йа',          nameUz:'Ya',     nameEn:'Ya',         transcription:'[yā] — «й»/«и»',         iso:'ي', ini:'يـ', med:'ـيـ',fin:'ـي' },
];

export function getLetterName(letter: ArabicLetter, lang: Language): string {
  if (lang === 'ru') return letter.nameRu;
  if (lang === 'uz') return letter.nameUz;
  return letter.nameEn;
}

export function getLetterAssociation(letter: ArabicLetter, lang: Language): string | undefined {
  if (lang === 'ru') return letter.associationRu;
  if (lang === 'uz') return letter.associationUz;
  return letter.associationEn;
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface LetterProgressDto {
  letterCode: string;
  known: boolean;
  attempts: number;
  correctCount: number;
  lastSeen: string | null;
  masteredAt: string | null;
}

export interface SessionResultDto {
  mode: StudyMode;
  score: number;
  totalQ: number;
  durationSec: number;
  letterResults: { letterCode: string; correct: boolean }[];
}

export interface ProgressStats {
  knownCount: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  totalSessions: number;
  totalTimeSec: number;
  level: UserLevel;
  letters: LetterProgressDto[];
}

export interface ChartDataPoint {
  date: string;
  correct: number;
  attempts: number;
}

// ─── Modes ────────────────────────────────────────────────────────────────────

export type StudyMode =
  | 'flashcard'
  | 'quiz'
  | 'speed'
  | 'lightning'
  | 'memory'
  | 'listen'
  | 'find'
  | 'write';

// ─── Achievements ─────────────────────────────────────────────────────────────

export type AchievementKey =
  | 'first_letter' | 'first_10' | 'half_letters' | 'almost_master' | 'all_letters'
  | 'streak_3' | 'streak_7' | 'streak_14' | 'streak_30' | 'streak_100'
  | 'speed_5min' | 'speed_4min' | 'speed_3min' | 'speed_2min'
  | 'perfect_quiz' | 'perfect_quiz_5' | 'perfect_quiz_10'
  | 'lightning_50' | 'lightning_75' | 'lightning_100' | 'lightning_200'
  | 'memory_5min' | 'memory_4min' | 'memory_3min'
  | 'first_challenge_win' | 'challenge_5' | 'challenge_10' | 'challenge_25'
  | 'night_owl' | 'early_bird'
  | 'textbook_1' | 'textbook_5' | 'textbook_all'
  | 'sessions_50' | 'sessions_200';

export interface AchievementDto {
  id: string;
  key: AchievementKey;
  nameRu: string;
  nameUz: string;
  nameEn: string;
  descRu: string;
  descUz: string;
  descEn: string;
  icon: string;
  unlockedAt: string | null;
}

export interface AchievementProgressDto {
  key: string;
  current: number | null;
  target: number;
  percentage: number;
  unlocked: boolean;
  unlockedAt: string | null;
  category: string;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  score: number;
  durationSec?: number;
  date: string;
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export interface ChallengeDto {
  id: string;
  shareToken: string;
  mode: StudyMode;
  status: 'pending' | 'active' | 'completed';
  challenger: { id: string; name: string; avatar: string | null };
  opponent: { id: string; name: string; avatar: string | null } | null;
  challengerScore: number | null;
  opponentScore: number | null;
  expiresAt: string;
  seed: number;
}

export interface CreateChallengeDto {
  mode: StudyMode;
}

export interface ChallengeResultDto {
  score: number;
  durationSec: number;
}

// ─── XP System ───────────────────────────────────────────────────────────────

export interface XpInfo {
  xp: number;
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

// ─── Daily Lesson ────────────────────────────────────────────────────────────

export interface DailyLessonDto {
  id: string;
  date: string;
  modes: string[];
  completed: boolean;
  score: number;
  xpEarned: number;
}

// ─── Weakness ────────────────────────────────────────────────────────────────

export interface WeaknessDto {
  letterCode: string;
  totalErrors: number;
  totalSeen: number;
  accuracy: number;
  nextReviewAt: string | null;
}

// ─── WebSocket Events ─────────────────────────────────────────────────────────

export type WsEvent =
  | { type: 'challenge:joined';   data: { opponentName: string } }
  | { type: 'challenge:result';   data: { userId: string; score: number } }
  | { type: 'challenge:complete'; data: { winnerId: string; challengerScore: number; opponentScore: number } }
  | { type: 'achievement:unlock'; data: AchievementDto };

// ─── Donate ──────────────────────────────────────────────────────────────────

export interface DonateLink {
  name: string;
  url: string;
}

export interface DonateConfigDto {
  enabled: boolean;
  title: string;
  description: string;
  cardNumber: string | null;
  cardHolder: string | null;
  links: DonateLink[];
}

// ─── Seeder data ──────────────────────────────────────────────────────────────

export const ACHIEVEMENTS_SEED: Array<{
  key: AchievementKey;
  nameRu: string; nameUz: string; nameEn: string;
  descRu: string; descUz: string; descEn: string;
  icon: string;
  condition: Record<string, unknown>;
  category: string;
}> = [
  // LETTERS (5)
  { key:'first_letter', nameRu:'Первый шаг', nameUz:'Birinchi qadam', nameEn:'First Step', descRu:'Выучи первую букву', descUz:"Birinchi harfni o'rganing", descEn:'Learn your first letter', icon:'🌱', condition:{type:'letters_known',value:1}, category:'letters' },
  { key:'first_10', nameRu:'Первые 10', nameUz:'Birinchi 10', nameEn:'First 10', descRu:'Выучи 10 букв', descUz:"10 ta harfni o'rganing", descEn:'Learn 10 letters', icon:'🔟', condition:{type:'letters_known',value:10}, category:'letters' },
  { key:'half_letters', nameRu:'Половина пути', nameUz:"Yarim yo'l", nameEn:'Halfway There', descRu:'Выучи 14 букв', descUz:"14 ta harfni o'rganing", descEn:'Learn 14 letters', icon:'⚡', condition:{type:'letters_known',value:14}, category:'letters' },
  { key:'almost_master', nameRu:'Почти мастер', nameUz:'Deyarli usta', nameEn:'Almost Master', descRu:'Выучи 21 букву', descUz:"21 ta harfni o'rganing", descEn:'Learn 21 letters', icon:'🎯', condition:{type:'letters_known',value:21}, category:'letters' },
  { key:'all_letters', nameRu:'Мастер алфавита', nameUz:'Alifbo ustasi', nameEn:'Alphabet Master', descRu:'Выучи все 28 букв', descUz:"Barcha 28 harfni o'rganing", descEn:'Learn all 28 letters', icon:'🏆', condition:{type:'letters_known',value:28}, category:'letters' },

  // STREAKS (5)
  { key:'streak_3', nameRu:'3 дня подряд', nameUz:'3 kun ketma-ket', nameEn:'3 Day Streak', descRu:'Занимайся 3 дня подряд', descUz:'3 kun ketma-ket mashq qiling', descEn:'Study 3 days in a row', icon:'🔥', condition:{type:'streak',value:3}, category:'streaks' },
  { key:'streak_7', nameRu:'Неделя', nameUz:'Bir hafta', nameEn:'One Week', descRu:'7 дней подряд', descUz:'7 kun ketma-ket', descEn:'7 days in a row', icon:'🗓️', condition:{type:'streak',value:7}, category:'streaks' },
  { key:'streak_14', nameRu:'Две недели', nameUz:'Ikki hafta', nameEn:'Two Weeks', descRu:'14 дней подряд', descUz:'14 kun ketma-ket', descEn:'14 days in a row', icon:'💪', condition:{type:'streak',value:14}, category:'streaks' },
  { key:'streak_30', nameRu:'Месяц', nameUz:'Bir oy', nameEn:'One Month', descRu:'30 дней подряд', descUz:'30 kun ketma-ket', descEn:'30 days in a row', icon:'📅', condition:{type:'streak',value:30}, category:'streaks' },
  { key:'streak_100', nameRu:'100 дней', nameUz:'100 kun', nameEn:'100 Days', descRu:'100 дней подряд', descUz:'100 kun ketma-ket', descEn:'100 days in a row', icon:'💎', condition:{type:'streak',value:100}, category:'streaks' },

  // SPEED - Flashcards (4)
  { key:'speed_5min', nameRu:'Скоростной', nameUz:'Tezkor', nameEn:'Speedster', descRu:'Все карточки за 5 минут', descUz:'5 daqiqada barcha kartochkalar', descEn:'All flashcards in 5 minutes', icon:'⏱️', condition:{type:'session_speed',mode:'flashcard',maxSec:300,minScore:28}, category:'speed' },
  { key:'speed_4min', nameRu:'Быстрый', nameUz:'Tez', nameEn:'Fast', descRu:'Все карточки за 4 минуты', descUz:'4 daqiqada barcha kartochkalar', descEn:'All flashcards in 4 minutes', icon:'⚡', condition:{type:'session_speed',mode:'flashcard',maxSec:240,minScore:28}, category:'speed' },
  { key:'speed_3min', nameRu:'Молниеносный', nameUz:'Chaqmoqdek', nameEn:'Lightning Fast', descRu:'Все карточки за 3 минуты', descUz:'3 daqiqada barcha kartochkalar', descEn:'All flashcards in 3 minutes', icon:'🚀', condition:{type:'session_speed',mode:'flashcard',maxSec:180,minScore:28}, category:'speed' },
  { key:'speed_2min', nameRu:'Легенда скорости', nameUz:'Tezlik afsonasi', nameEn:'Speed Legend', descRu:'Все карточки за 2 минуты', descUz:'2 daqiqada barcha kartochkalar', descEn:'All flashcards in 2 minutes', icon:'👑', condition:{type:'session_speed',mode:'flashcard',maxSec:120,minScore:28}, category:'speed' },

  // QUIZ (3)
  { key:'perfect_quiz', nameRu:'Идеальный квиз', nameUz:'Mukammal viktorina', nameEn:'Perfect Quiz', descRu:'Квиз без ошибок', descUz:'Xatosiz viktorina', descEn:'Quiz with no mistakes', icon:'💯', condition:{type:'perfect_session',mode:'quiz'}, category:'quiz' },
  { key:'perfect_quiz_5', nameRu:'5 идеальных', nameUz:'5 ta mukammal', nameEn:'5 Perfect', descRu:'5 квизов со 100%', descUz:'5 ta xatosiz viktorina', descEn:'5 quizzes at 100%', icon:'🌟', condition:{type:'perfect_count',mode:'quiz',value:5}, category:'quiz' },
  { key:'perfect_quiz_10', nameRu:'10 идеальных', nameUz:'10 ta mukammal', nameEn:'10 Perfect', descRu:'10 квизов со 100%', descUz:'10 ta xatosiz viktorina', descEn:'10 quizzes at 100%', icon:'✨', condition:{type:'perfect_count',mode:'quiz',value:10}, category:'quiz' },

  // LIGHTNING (4)
  { key:'lightning_50', nameRu:'Молния', nameUz:'Chaqmoq', nameEn:'Lightning', descRu:'50 правильных в молнии', descUz:"Chaqmoqda 50 ta to'g'ri javob", descEn:'50 correct in lightning', icon:'⚡', condition:{type:'total_correct_mode',mode:'lightning',value:50}, category:'lightning' },
  { key:'lightning_75', nameRu:'Гром', nameUz:'Momaqaldiroq', nameEn:'Thunder', descRu:'75 правильных в молнии', descUz:"Chaqmoqda 75 ta to'g'ri javob", descEn:'75 correct in lightning', icon:'🌩️', condition:{type:'total_correct_mode',mode:'lightning',value:75}, category:'lightning' },
  { key:'lightning_100', nameRu:'Шторм', nameUz:"Bo'ron", nameEn:'Storm', descRu:'100 правильных в молнии', descUz:"Chaqmoqda 100 ta to'g'ri javob", descEn:'100 correct in lightning', icon:'🌪️', condition:{type:'total_correct_mode',mode:'lightning',value:100}, category:'lightning' },
  { key:'lightning_200', nameRu:'Ураган', nameUz:"To'fon", nameEn:'Hurricane', descRu:'200 правильных в молнии', descUz:"Chaqmoqda 200 ta to'g'ri javob", descEn:'200 correct in lightning', icon:'🌊', condition:{type:'total_correct_mode',mode:'lightning',value:200}, category:'lightning' },

  // MEMORY (3)
  { key:'memory_5min', nameRu:'Хорошая память', nameUz:'Yaxshi xotira', nameEn:'Good Memory', descRu:'Memory за 5 минут', descUz:"5 daqiqada Memory o'yini", descEn:'Memory in 5 minutes', icon:'🧠', condition:{type:'session_speed',mode:'memory',maxSec:300,minScore:28}, category:'memory' },
  { key:'memory_4min', nameRu:'Отличная память', nameUz:"A'lo xotira", nameEn:'Great Memory', descRu:'Memory за 4 минуты', descUz:"4 daqiqada Memory o'yini", descEn:'Memory in 4 minutes', icon:'🎓', condition:{type:'session_speed',mode:'memory',maxSec:240,minScore:28}, category:'memory' },
  { key:'memory_3min', nameRu:'Фотографическая', nameUz:'Fotografik xotira', nameEn:'Photographic', descRu:'Memory за 3 минуты', descUz:"3 daqiqada Memory o'yini", descEn:'Memory in 3 minutes', icon:'📸', condition:{type:'session_speed',mode:'memory',maxSec:180,minScore:28}, category:'memory' },

  // CHALLENGES (4)
  { key:'first_challenge_win', nameRu:'Победитель', nameUz:"G'olib", nameEn:'Winner', descRu:'Выиграй первый челлендж', descUz:"Birinchi musobaqada g'olib bo'ling", descEn:'Win your first challenge', icon:'🥇', condition:{type:'challenge_win',value:1}, category:'challenges' },
  { key:'challenge_5', nameRu:'Боец', nameUz:'Jangchi', nameEn:'Fighter', descRu:'5 побед в челленджах', descUz:"5 ta g'alaba", descEn:'5 challenge wins', icon:'🥊', condition:{type:'challenge_win',value:5}, category:'challenges' },
  { key:'challenge_10', nameRu:'Чемпион', nameUz:'Chempion', nameEn:'Champion', descRu:'10 побед в челленджах', descUz:"10 ta g'alaba", descEn:'10 challenge wins', icon:'🏅', condition:{type:'challenge_win',value:10}, category:'challenges' },
  { key:'challenge_25', nameRu:'Легенда', nameUz:'Afsona', nameEn:'Legend', descRu:'25 побед в челленджах', descUz:"25 ta g'alaba", descEn:'25 challenge wins', icon:'👑', condition:{type:'challenge_win',value:25}, category:'challenges' },

  // TIME OF DAY (2)
  { key:'night_owl', nameRu:'Ночная сова', nameUz:'Tungi boyqush', nameEn:'Night Owl', descRu:'Занятие после 23:00', descUz:"23:00 dan keyin mashq qiling", descEn:'Study after 23:00', icon:'🦉', condition:{type:'time_of_day',after:23}, category:'time' },
  { key:'early_bird', nameRu:'Ранняя пташка', nameUz:'Erta qush', nameEn:'Early Bird', descRu:'Занятие до 7:00', descUz:"7:00 dan oldin mashq qiling", descEn:'Study before 7:00', icon:'🐦', condition:{type:'time_of_day',before:7}, category:'time' },

  // TEXTBOOK (3)
  { key:'textbook_1', nameRu:'Первая глава', nameUz:'Birinchi bob', nameEn:'First Chapter', descRu:'Пройди 1 главу учебника', descUz:'Darslikning 1 bobini yakunlang', descEn:'Complete 1 textbook chapter', icon:'📖', condition:{type:'textbook_chapters',value:1}, category:'textbook' },
  { key:'textbook_5', nameRu:'Половина книги', nameUz:'Kitobning yarmi', nameEn:'Half the Book', descRu:'Пройди 5 глав', descUz:'5 ta bobni yakunlang', descEn:'Complete 5 chapters', icon:'📚', condition:{type:'textbook_chapters',value:5}, category:'textbook' },
  { key:'textbook_all', nameRu:'Муаллим Сони', nameUz:'Muallim Soniy', nameEn:'Muallim Soniy', descRu:'Пройди все 9 глав', descUz:'Barcha 9 bobni yakunlang', descEn:'Complete all 9 chapters', icon:'🎓', condition:{type:'textbook_chapters',value:9}, category:'textbook' },

  // SESSIONS (2)
  { key:'sessions_50', nameRu:'Трудяга', nameUz:'Mehnatkash', nameEn:'Hard Worker', descRu:'50 завершённых сессий', descUz:"50 ta yakunlangan mashg'ulot", descEn:'50 completed sessions', icon:'💼', condition:{type:'total_sessions',value:50}, category:'sessions' },
  { key:'sessions_200', nameRu:'Мастер практики', nameUz:'Mashq ustasi', nameEn:'Practice Master', descRu:'200 завершённых сессий', descUz:"200 ta yakunlangan mashg'ulot", descEn:'200 completed sessions', icon:'🏋️', condition:{type:'total_sessions',value:200}, category:'sessions' },
];
