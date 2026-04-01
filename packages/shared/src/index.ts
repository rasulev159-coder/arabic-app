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
  | 'first_letter'
  | 'first_10'
  | 'all_letters'
  | 'speed_3min'
  | 'perfect_quiz'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'lightning_master'
  | 'memory_5min'
  | 'night_owl'
  | 'early_bird'
  | 'first_challenge_win';

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
}> = [
  {
    key: 'first_letter',
    nameRu: 'Первый шаг', nameUz: 'Birinchi qadam', nameEn: 'First Step',
    descRu: 'Выучи первую букву', descUz: "Birinchi harfni o'rganing", descEn: 'Learn your first letter',
    icon: '🌱',
    condition: { type: 'letters_known', value: 1 },
  },
  {
    key: 'first_10',
    nameRu: 'Первые 10', nameUz: 'Birinchi 10', nameEn: 'First 10',
    descRu: 'Выучи 10 букв', descUz: "10 ta harfni o'rganing", descEn: 'Learn 10 letters',
    icon: '🔟',
    condition: { type: 'letters_known', value: 10 },
  },
  {
    key: 'all_letters',
    nameRu: 'Мастер алфавита', nameUz: 'Alifbo ustasi', nameEn: 'Alphabet Master',
    descRu: 'Выучи все 28 букв', descUz: "Barcha 28 harfni o'rganing", descEn: 'Learn all 28 letters',
    icon: '🏆',
    condition: { type: 'letters_known', value: 28 },
  },
  {
    key: 'speed_3min',
    nameRu: 'Скоростной', nameUz: 'Tezkor', nameEn: 'Speedster',
    descRu: 'Пройди все карточки за 3 минуты', descUz: "3 daqiqa ichida barcha kartalarni o'ting", descEn: 'Complete all flashcards in 3 minutes',
    icon: '⚡',
    condition: { type: 'session_speed', mode: 'flashcard', maxSec: 180, minScore: 28 },
  },
  {
    key: 'perfect_quiz',
    nameRu: 'Идеальный квиз', nameUz: 'Mukammal viktorina', nameEn: 'Perfect Quiz',
    descRu: 'Пройди квиз без ошибок', descUz: "Xatosiz viktorinani o'ting", descEn: 'Complete a quiz with no mistakes',
    icon: '💯',
    condition: { type: 'perfect_session', mode: 'quiz' },
  },
  {
    key: 'streak_3',
    nameRu: '3 дня подряд', nameUz: '3 kun ketma-ket', nameEn: '3 Days Streak',
    descRu: 'Занимайся 3 дня подряд', descUz: "3 kun ketma-ket mashq qiling", descEn: 'Study 3 days in a row',
    icon: '🔥',
    condition: { type: 'streak', value: 3 },
  },
  {
    key: 'streak_7',
    nameRu: 'Неделя', nameUz: 'Bir hafta', nameEn: 'One Week',
    descRu: '7 дней подряд', descUz: "7 kun ketma-ket", descEn: '7 days in a row',
    icon: '🗓️',
    condition: { type: 'streak', value: 7 },
  },
  {
    key: 'streak_30',
    nameRu: 'Месяц', nameUz: 'Bir oy', nameEn: 'One Month',
    descRu: '30 дней подряд', descUz: "30 kun ketma-ket", descEn: '30 days in a row',
    icon: '📅',
    condition: { type: 'streak', value: 30 },
  },
  {
    key: 'lightning_master',
    nameRu: 'Молния', nameUz: 'Chaqmoq', nameEn: 'Lightning',
    descRu: 'Ответь на 50 вопросов в молниеносном режиме', descUz: "Chaqmoq rejimida 50 ta savolga javob bering", descEn: 'Answer 50 questions in lightning mode',
    icon: '⚡',
    condition: { type: 'total_correct_mode', mode: 'lightning', value: 50 },
  },
  {
    key: 'memory_5min',
    nameRu: 'Память', nameUz: 'Xotira', nameEn: 'Memory',
    descRu: 'Пройди Memory за 5 минут', descUz: "5 daqiqa ichida Memory o'yinini o'ting", descEn: 'Complete Memory game in 5 minutes',
    icon: '🧠',
    condition: { type: 'session_speed', mode: 'memory', maxSec: 300, minScore: 28 },
  },
  {
    key: 'night_owl',
    nameRu: 'Ночная сова', nameUz: 'Tungi boyqush', nameEn: 'Night Owl',
    descRu: 'Занимайся после 23:00', descUz: "23:00 dan keyin mashq qiling", descEn: 'Study after 23:00',
    icon: '🦉',
    condition: { type: 'time_of_day', after: 23 },
  },
  {
    key: 'early_bird',
    nameRu: 'Ранняя пташка', nameUz: 'Erta qush', nameEn: 'Early Bird',
    descRu: 'Занимайся до 7:00', descUz: "7:00 dan oldin mashq qiling", descEn: 'Study before 7:00',
    icon: '🐦',
    condition: { type: 'time_of_day', before: 7 },
  },
  {
    key: 'first_challenge_win',
    nameRu: 'Победитель', nameUz: 'G\'olib', nameEn: 'Winner',
    descRu: 'Выиграй первое соревнование', descUz: "Birinchi musobaqada g'olib bo'ling", descEn: 'Win your first challenge',
    icon: '🥇',
    condition: { type: 'challenge_win', value: 1 },
  },
];
