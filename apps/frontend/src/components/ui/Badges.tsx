import { useTranslation }  from 'react-i18next';
import { useAuthStore }     from '../../store/authStore';
import { Language, UserLevel } from '@arabic/shared';

// ── Pluralization helper ─────────────────────────────────────────────────────
function pluralizeRu(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (lastDigit > 1 && lastDigit < 5) return few;
  if (lastDigit === 1) return one;
  return many;
}

export function getStreakText(n: number, lang: Language, t: (key: string) => string): string {
  if (lang === 'ru') {
    return pluralizeRu(n, t('common:streak_one'), t('common:streak_few'), t('common:streak_many'));
  }
  if (lang === 'uz') {
    return t('common:streak_text');
  }
  // English
  return n === 1 ? t('common:streak_one') : t('common:streak_many');
}

// ── Level Badge ───────────────────────────────────────────────────────────────
const LEVEL_COLORS: Record<UserLevel, string> = {
  beginner: 'bg-[rgba(154,138,106,0.15)] text-[#9a8a6a] border-[rgba(154,138,106,0.3)]',
  student:  'bg-[rgba(100,160,255,0.1)]  text-[#8ab4ff] border-[rgba(100,160,255,0.3)]',
  expert:   'bg-[rgba(201,168,76,0.12)]  text-gold      border-gold-dim',
  master:   'bg-[rgba(180,120,255,0.1)]  text-[#c8a0ff] border-[rgba(180,120,255,0.3)]',
};
const LEVEL_ICONS: Record<UserLevel, string> = {
  beginner: '🌱', student: '📚', expert: '⭐', master: '👑',
};

export function LevelBadge({ level, size = 'sm' }: { level: UserLevel; size?: 'sm' | 'md' }) {
  const { t } = useTranslation('common');
  const base  = `inline-flex items-center gap-1 rounded-full border font-cinzel tracking-wide uppercase
                 ${size === 'sm' ? 'text-[0.6rem] px-3 py-1' : 'text-xs px-4 py-2'}`;
  return (
    <span className={`${base} ${LEVEL_COLORS[level]}`}>
      <span>{LEVEL_ICONS[level]}</span>
      <span>{t(`levels.${level}`)}</span>
    </span>
  );
}

// ── Streak Badge ──────────────────────────────────────────────────────────────
export function StreakBadge({ current }: { current: number }) {
  const { t } = useTranslation('common');
  const user = useAuthStore((s) => s.user);
  const lang = (user?.language ?? 'en') as Language;

  if (current === 0) return null;

  const streakLabel = getStreakText(current, lang, t);

  return (
    <span className="inline-flex items-center gap-1 bg-[rgba(255,100,0,0.1)] border border-[rgba(255,100,0,0.3)]
                     text-[#ff8c42] rounded-full font-cinzel text-[0.65rem] tracking-wide uppercase px-3 py-1">
      🔥 {current} {streakLabel}
    </span>
  );
}

// ── Language Switcher ─────────────────────────────────────────────────────────
const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'uz', label: 'UZ', flag: '🇺🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { user, setLanguage } = useAuthStore();
  const { i18n } = useTranslation();
  const current  = (user?.language ?? i18n.language) as Language;

  return (
    <div className="flex gap-1">
      {LANGS.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => (user ? setLanguage(code) : i18n.changeLanguage(code))}
          className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-2 py-1 rounded-lg border transition-all
            ${current === code
              ? 'border-gold-dim text-gold-light bg-[rgba(201,168,76,0.1)] font-bold shadow-[0_2px_0_0_rgba(201,168,76,0.5)]'
              : 'border-transparent text-[#9a8a6a] opacity-60 hover:text-gold-dim hover:opacity-100'}`}
        >
          {flag} {label}
        </button>
      ))}
    </div>
  );
}
