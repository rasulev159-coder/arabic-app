import { useTranslation }  from 'react-i18next';
import { useAuthStore }     from '../../store/authStore';
import { Language, UserLevel } from '@arabic/shared';

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
  if (current === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-[rgba(255,100,0,0.1)] border border-[rgba(255,100,0,0.3)]
                     text-[#ff8c42] rounded-full font-cinzel text-[0.65rem] tracking-wide uppercase px-3 py-1">
      🔥 {current} {t('streak')}
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
              ? 'border-gold-dim text-gold-light bg-[rgba(201,168,76,0.1)]'
              : 'border-transparent text-[#9a8a6a] hover:text-gold-dim'}`}
        >
          {flag} {label}
        </button>
      ))}
    </div>
  );
}
