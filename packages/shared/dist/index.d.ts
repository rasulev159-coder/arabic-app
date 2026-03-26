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
export declare function getLevel(knownCount: number): UserLevel;
export declare const LEVEL_LABELS: Record<Language, Record<UserLevel, string>>;
export interface StreakInfo {
    current: number;
    longest: number;
    lastActivity: string | null;
}
export interface ArabicLetter {
    code: string;
    index: number;
    nameRu: string;
    nameUz: string;
    nameEn: string;
    transcription: string;
    iso: string;
    ini: string;
    med: string;
    fin: string;
    group?: LetterGroup;
    associationRu?: string;
    associationUz?: string;
    associationEn?: string;
}
export type LetterGroup = 'btt' | 'jch' | 'dz' | 'rz' | 'ss' | 'sd' | 'tz' | 'ag' | 'fq';
export declare const LETTERS: ArabicLetter[];
export declare function getLetterName(letter: ArabicLetter, lang: Language): string;
export declare function getLetterAssociation(letter: ArabicLetter, lang: Language): string | undefined;
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
    letterResults: {
        letterCode: string;
        correct: boolean;
    }[];
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
export type StudyMode = 'flashcard' | 'quiz' | 'speed' | 'lightning' | 'memory' | 'listen' | 'find' | 'write';
export type AchievementKey = 'first_letter' | 'first_10' | 'all_letters' | 'speed_3min' | 'perfect_quiz' | 'streak_3' | 'streak_7' | 'streak_30' | 'lightning_master' | 'memory_5min' | 'night_owl' | 'early_bird' | 'first_challenge_win';
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
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    avatar: string | null;
    score: number;
    durationSec?: number;
    date: string;
}
export interface ChallengeDto {
    id: string;
    shareToken: string;
    mode: StudyMode;
    status: 'pending' | 'active' | 'completed';
    challenger: {
        id: string;
        name: string;
        avatar: string | null;
    };
    opponent: {
        id: string;
        name: string;
        avatar: string | null;
    } | null;
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
export interface XpInfo {
    xp: number;
    level: number;
    currentXp: number;
    nextLevelXp: number;
}
export interface DailyLessonDto {
    id: string;
    date: string;
    modes: string[];
    completed: boolean;
    score: number;
    xpEarned: number;
}
export interface WeaknessDto {
    letterCode: string;
    totalErrors: number;
    totalSeen: number;
    accuracy: number;
    nextReviewAt: string | null;
}
export type WsEvent = {
    type: 'challenge:joined';
    data: {
        opponentName: string;
    };
} | {
    type: 'challenge:result';
    data: {
        userId: string;
        score: number;
    };
} | {
    type: 'challenge:complete';
    data: {
        winnerId: string;
        challengerScore: number;
        opponentScore: number;
    };
} | {
    type: 'achievement:unlock';
    data: AchievementDto;
};
export declare const ACHIEVEMENTS_SEED: Array<{
    key: AchievementKey;
    nameRu: string;
    nameUz: string;
    nameEn: string;
    descRu: string;
    descUz: string;
    descEn: string;
    icon: string;
    condition: Record<string, unknown>;
}>;
//# sourceMappingURL=index.d.ts.map