// ════ Alphabet.tsx ════════════════════════════════════════════════════════════
import React, { useState }   from 'react';
import { motion }            from 'framer-motion';
import { useTranslation }   from 'react-i18next';
import { useAuthStore }      from '../store/authStore';
import { useProgress }       from '../hooks/useProgress';
import { useAchievements }   from '../hooks/useAchievements';
import { Button }            from '../components/ui/Button';
import { Spinner }           from '../lib/utils';
import { useQuery }          from '@tanstack/react-query';
import { api }               from '../lib/api';
import { ProgressChart }     from '../components/progress/ProgressChart';
import { LETTERS, getLetterName, Language, AchievementDto, ArabicLetter } from '@arabic/shared';
import { useChallengeSocket, useAcceptChallenge,
         useSubmitChallengeResult, useChallenge } from '../hooks/useChallenge';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LetterDetail }      from '../components/learn/LetterDetail';

export function AlphabetPage() {
  const { t } = useTranslation('common');
  const lang      = (useAuthStore(s=>s.user?.language) ?? 'ru') as Language;
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  const [autoSec, setAutoSec] = useState(5);
  const [allFlipped, setAllFlipped] = useState(false);
  const [detailLetter, setDetailLetter] = useState<ArabicLetter | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailOrigin, setDetailOrigin] = useState<{ x: number; y: number } | null>(null);

  const flipAll = () => {
    setAllFlipped(f => !f);
    if (!allFlipped) {
      setOpenIdx(null);
      setTimeout(() => setAllFlipped(false), autoSec * 1000);
    }
  };

  const openLetterDetail = (letter: ArabicLetter, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDetailOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setDetailLetter(letter);
    setDetailVisible(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase mb-6 text-center">
        {t('alphabet_page.title')}
      </h1>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center items-center mb-6">
        <Button size="sm" onClick={flipAll}>
          {allFlipped ? t('alphabet_page.hide_all') : t('alphabet_page.flip_all')}
        </Button>
        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.1)] rounded-full px-4 py-2">
          <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase">{t('alphabet_page.auto_hide')}</span>
          <input type="number" value={autoSec} min={2} max={30}
            onChange={e => setAutoSec(Number(e.target.value))}
            className="w-10 text-center bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)]
                       rounded-lg text-gold-light font-cinzel text-xs py-0.5 outline-none" />
          <span className="font-cinzel text-[0.6rem] text-[#9a8a6a]">{t('alphabet_page.seconds')}</span>
        </div>
      </div>
      {/* RTL grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2" dir="rtl">
        {LETTERS.map((letter, i) => {
          const isOpen = allFlipped || openIdx === i;
          return (
            <div key={letter.code} className="aspect-square" dir="ltr"
              style={{ perspective: 800 }}>
              <motion.div
                animate={{ rotateY: isOpen ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d', position:'relative', width:'100%', height:'100%' }}
                onClick={(e) => {
                  if (allFlipped) return;
                  if (openIdx === i) {
                    // Already open - open detail modal
                    openLetterDetail(letter, e);
                    return;
                  }
                  const next = openIdx === i ? null : i;
                  setOpenIdx(next);
                  if (next !== null) setTimeout(() => setOpenIdx(p => p===i ? null : p), autoSec * 1000);
                }}
                className="cursor-pointer"
              >
                {/* Front */}
                <div className="absolute inset-0 rounded-2xl border border-[rgba(201,168,76,0.14)]
                                bg-gradient-to-br from-[#1e1508] to-[#130e05]
                                flex flex-col items-center justify-center"
                     style={{ backfaceVisibility:'hidden' }}>
                  <p className="font-cinzel text-[0.5rem] text-[#9a8a6a] opacity-50 mb-0.5">{letter.index}</p>
                  <p className="font-scheherazade text-3xl text-gold-light leading-none">{letter.code}</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 rounded-2xl border border-[rgba(201,168,76,0.3)]
                                bg-gradient-to-br from-[#2a1f08] to-[#1a1005]
                                flex flex-col items-center justify-center gap-0.5 p-1"
                     style={{ backfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
                  <p className="font-cinzel text-[0.55rem] text-[#f0e6cc] text-center leading-tight">
                    {getLetterName(letter, lang)}
                  </p>
                  <p className="font-cinzel text-[0.45rem] text-[#9a8a6a] text-center leading-tight">
                    {letter.transcription.split('—')[0].trim()}
                  </p>
                  <div className="flex gap-1 mt-0.5">
                    {(['iso','ini','med','fin'] as const).map(p => (
                      <span key={p} className="font-scheherazade text-xs text-[#f0e6cc]">{letter[p]}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Letter detail modal */}
      <LetterDetail
        letter={detailLetter}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        originRect={detailOrigin}
      />
    </div>
  );
}

// ════ Progress.tsx ════════════════════════════════════════════════════════════
export function ProgressPage() {
  const { t } = useTranslation('common');
  const lang = (useAuthStore(s=>s.user?.language) ?? 'ru') as Language;
  const { data: stats, isLoading } = useProgress();
  const [days, setDays] = useState(30);
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  // Empty state for new users
  const isEmpty = !stats || (stats.totalSessions === 0 && stats.knownCount === 0);

  if (isEmpty) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col items-center gap-6">
        <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center">
          {t('progress_page.title')}
        </h1>
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="font-scheherazade text-6xl text-gold opacity-40">ا</p>
          <p className="font-cinzel text-sm text-[#9a8a6a] text-center max-w-xs tracking-wide">
            {t('progress_page.empty')}
          </p>
          <Link to="/learn/flashcards">
            <Button>{t('start')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col gap-6">
      <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center">
        {t('progress_page.title')}
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('progress_page.letters_learned'), value:`${stats?.knownCount ?? 0} / 28` },
          { label: t('progress_page.total_sessions'),  value: stats?.totalSessions ?? 0 },
          { label: t('progress_page.accuracy'),        value:`${stats?.accuracy ?? 0}%` },
          { label: t('progress_page.time_min'),        value: Math.round((stats?.totalTimeSec ?? 0) / 60) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-2xl p-4 text-center">
            <p className="font-cinzel text-xl font-bold text-gold-light">{value}</p>
            <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="font-cinzel text-xs text-[#9a8a6a] uppercase tracking-widest">{t('progress_page.activity')}</p>
          <div className="flex gap-1">
            {[7,14,30].map(d => (
              <button key={d} onClick={() => setDays(d)}
                className={`font-cinzel text-[0.6rem] tracking-wide px-2.5 py-1 rounded-full border transition-all
                  ${days===d?'border-gold-dim text-gold bg-[rgba(201,168,76,0.1)]':'border-transparent text-[#9a8a6a] hover:text-gold'}`}>
                {d}d
              </button>
            ))}
          </div>
        </div>
        <ProgressChart days={days} />
      </div>

      {/* Letters grid with per-letter stats */}
      <div>
        <p className="font-cinzel text-xs text-[#9a8a6a] uppercase tracking-widest mb-3">{t('progress_page.letter_status')}</p>
        <div className="grid grid-cols-7 gap-1.5" dir="rtl">
          {LETTERS.map(letter => {
            const lp = stats?.letters.find(l => l.letterCode === letter.code);
            const isExpanded = expandedLetter === letter.code;
            const accuracy = lp && lp.attempts > 0 ? Math.round((lp.correctCount / lp.attempts) * 100) : 0;
            return (
              <div key={letter.code} dir="ltr" className="relative">
                <div
                  onClick={() => setExpandedLetter(isExpanded ? null : letter.code)}
                  className={`aspect-square rounded-xl border flex items-center justify-center cursor-pointer transition-all
                    ${lp?.known
                      ? 'border-[rgba(76,175,120,0.4)] bg-[rgba(76,175,120,0.1)]'
                      : lp && lp.attempts > 0
                        ? 'border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.05)]'
                        : 'border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)]'}`}>
                  <span className="font-scheherazade text-xl text-gold-light">{letter.code}</span>
                </div>
                {/* Per-letter stats tooltip */}
                {isExpanded && lp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-50 top-full mt-1 left-1/2 -translate-x-1/2 w-36
                               bg-[#1c160e] border border-[#3a2d10] rounded-xl p-3 shadow-xl"
                  >
                    <p className="font-scheherazade text-lg text-gold-light text-center mb-1">{letter.code}</p>
                    <p className="font-cinzel text-[0.5rem] text-[#9a8a6a]">
                      {t('progress_page.attempts')}: <span className="text-[#f0e6cc]">{lp.attempts}</span>
                    </p>
                    <p className="font-cinzel text-[0.5rem] text-[#9a8a6a]">
                      {t('progress_page.accuracy_pct')}: <span className="text-[#f0e6cc]">{accuracy}%</span>
                    </p>
                    <p className="font-cinzel text-[0.5rem] text-[#9a8a6a]">
                      {t('progress_page.last_practiced')}: <span className="text-[#f0e6cc]">
                        {lp.lastSeen ? new Date(lp.lastSeen).toLocaleDateString() : t('progress_page.never')}
                      </span>
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════ Achievements.tsx ════════════════════════════════════════════════════════
function achName(a: AchievementDto, lang: Language) {
  if (lang==='ru') return a.nameRu; if (lang==='uz') return a.nameUz; return a.nameEn;
}
function achDesc(a: AchievementDto, lang: Language) {
  if (lang==='ru') return a.descRu; if (lang==='uz') return a.descUz; return a.descEn;
}

export function AchievementsPage() {
  const { t } = useTranslation('common');
  const { data, isLoading } = useAchievements();
  const lang = (useAuthStore(s=>s.user?.language) ?? 'ru') as Language;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const unlocked = data?.filter(a => a.unlockedAt) ?? [];
  const locked   = data?.filter(a => !a.unlockedAt) ?? [];

  // Deduplicate by key (safety check)
  const seen = new Set<string>();
  const deduped = (items: AchievementDto[]) => items.filter(a => {
    if (seen.has(a.key)) return false;
    seen.add(a.key);
    return true;
  });
  const dedupedUnlocked = deduped(unlocked);
  seen.clear();
  const dedupedLocked = deduped(locked);
  const totalCount = dedupedUnlocked.length + dedupedLocked.length;

  // Empty state for new users
  if (totalCount === 0 || (!data?.length)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col items-center gap-6">
        <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-6">
          {t('achievements_page.title')}
        </h1>
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-6xl opacity-40">🏆</p>
          <p className="font-cinzel text-sm text-[#9a8a6a] text-center max-w-xs tracking-wide">
            {t('achievements_page.empty')}
          </p>
          <Link to="/learn/flashcards">
            <Button>{t('start')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-6">
        {t('achievements_page.title')}
      </h1>
      <p className="font-cinzel text-xs text-gold-dim text-center mb-4">
        {dedupedUnlocked.length} / {totalCount} {t('achievements_page.received')}
      </p>

      {/* Onboarding message for users with no unlocks */}
      {dedupedUnlocked.length === 0 && (
        <div className="mb-6 p-4 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.03)] text-center">
          <p className="font-cinzel text-sm text-[#9a8a6a] tracking-wide">
            {t('achievements_page.empty')}
          </p>
        </div>
      )}

      {[
        { label: t('achievements_page.unlocked'), items: dedupedUnlocked },
        { label: t('achievements_page.locked'), items: dedupedLocked },
      ].map(({ label, items }) => (
        items.length > 0 && (
          <div key={label} className="mb-6">
            <p className="font-cinzel text-[0.6rem] tracking-[3px] text-[#9a8a6a] uppercase mb-3">{label}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(a => (
                <div key={a.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all
                    ${a.unlockedAt
                      ? 'border-[rgba(201,168,76,0.25)] bg-gradient-to-br from-[#201808] to-[#140f05]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] opacity-60'}`}>
                  <span className="text-3xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel text-sm text-[#f0e6cc] truncate">{achName(a, lang)}</p>
                    <p className="font-raleway text-xs text-[#9a8a6a] mt-0.5 leading-tight">{achDesc(a, lang)}</p>
                    {a.unlockedAt && (
                      <p className="font-cinzel text-[0.5rem] text-gold-dim tracking-wide mt-1">
                        {new Date(a.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

// ════ Leaderboard.tsx ═════════════════════════════════════════════════════════
export function LeaderboardPage() {
  const { t } = useTranslation('common');
  const user = useAuthStore(s => s.user);
  const [tab, setTab] = useState<'speed'|'lightning'|'memory'|'streak'>('speed');
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', tab],
    queryFn:  async () => tab === 'streak'
      ? (await api.get('/leaderboard/streak')).data.data
      : (await api.get(`/leaderboard/speed?mode=${tab}`)).data.data,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const TABS = [
    { key: 'speed',     label: t('leaderboard_page.speed'),     icon: '⚡' },
    { key: 'lightning', label: t('leaderboard_page.lightning'),  icon: '🌩️' },
    { key: 'memory',    label: t('leaderboard_page.memory'),     icon: '🧠' },
    { key: 'streak',    label: t('leaderboard_page.streak'),     icon: '🔥' },
  ] as const;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-6">
        {t('leaderboard_page.title')}
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.1)] rounded-full p-1 mb-5">
        {TABS.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 font-cinzel text-[0.6rem] tracking-widest uppercase py-2 min-h-[44px] rounded-full transition-all
              ${tab === key
                ? 'bg-[rgba(201,168,76,0.12)] text-gold border border-[rgba(201,168,76,0.2)]'
                : 'text-[#9a8a6a] hover:text-gold'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <div className="flex flex-col gap-2">
          {((data as any[]) ?? []).map((entry: any) => {
            const isCurrentUser = user?.id === entry.userId;
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: entry.rank * 0.03 }}
                className={`flex items-center gap-4 p-3 rounded-2xl border transition-all
                  ${isCurrentUser
                    ? 'border-[rgba(201,168,76,0.5)] bg-gradient-to-br from-[#2a1f08] to-[#1a1205] ring-1 ring-[rgba(201,168,76,0.25)]'
                    : entry.rank <= 3
                      ? 'border-[rgba(201,168,76,0.3)] bg-gradient-to-br from-[#201808] to-[#140f05]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]'}`}
              >
                {/* Rank */}
                <span className="font-cinzel text-lg w-8 text-center font-bold text-gold-dim">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </span>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {entry.avatar
                    ? <img src={entry.avatar} alt="" className="w-9 h-9 object-cover" />
                    : <span className="font-cinzel text-sm text-gold font-bold">{entry.name[0]?.toUpperCase()}</span>
                  }
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`font-cinzel text-sm truncate ${isCurrentUser ? 'text-gold-light font-bold' : 'text-[#f0e6cc]'}`}>
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-2 font-cinzel text-[0.5rem] tracking-widest text-gold-dim uppercase">
                        ({t('leaderboard_page.you')})
                      </span>
                    )}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-cinzel text-base text-gold-light font-bold leading-none">{entry.score}</p>
                  {entry.durationSec && (
                    <p className="font-cinzel text-[0.5rem] text-[#9a8a6a] mt-0.5">
                      {Math.floor(entry.durationSec / 60)}:{String(entry.durationSec % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}

          {!data?.length && (
            <p className="font-cinzel text-xs text-[#9a8a6a] text-center tracking-widest py-10">
              {t('leaderboard_page.no_results')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ════ Settings.tsx ════════════════════════════════════════════════════════════
export function SettingsPage() {
  const { t } = useTranslation('common');
  const { user, setLanguage, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const lang = (user?.language ?? 'uz') as Language;

  const [name, setName] = useState(user?.name ?? '');
  const [nameMsg, setNameMsg] = useState('');
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  const saveName = async () => {
    try {
      const { data } = await api.patch('/user/me', { name });
      if (user) setUser({ ...user, name });
      setNameMsg(t('settings.name_updated'));
      setTimeout(() => setNameMsg(''), 3000);
    } catch (e: any) {
      setNameMsg(e?.response?.data?.error ?? 'Error');
    }
  };

  const changePassword = async () => {
    setPassErr('');
    setPassMsg('');
    if (newPass !== confirmPass) { setPassErr('Passwords do not match'); return; }
    if (newPass.length < 8) { setPassErr('Min 8 characters'); return; }
    try {
      await api.patch('/user/password', { currentPassword: curPass, newPassword: newPass });
      setCurPass(''); setNewPass(''); setConfirmPass('');
      setPassMsg(t('settings.password_changed'));
      setTimeout(() => setPassMsg(''), 3000);
    } catch (e: any) {
      setPassErr(e?.response?.data?.error ?? 'Error');
    }
  };

  const handleLogout = async () => {
    await logout();
    // Clear any persisted auth state from localStorage
    localStorage.removeItem('auth');
    navigate('/login', { replace: true });
  };

  const inputCls = `w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.2)]
                    rounded-xl px-4 py-2.5 text-[#f0e6cc] font-raleway text-sm
                    outline-none focus:border-gold-dim transition-colors`;

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col gap-5">
      <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-2">
        {t('nav.settings')}
      </h1>

      {/* Profile section */}
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-2xl p-5 flex flex-col gap-4">
        <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">{t('settings.profile')}</p>
        <p className="font-raleway text-xs text-[#9a8a6a]">{user?.email}</p>
        <div className="flex gap-2">
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder={t('auth.name')}
            className={inputCls + ' flex-1'}
          />
          <Button size="sm" onClick={saveName}>{t('settings.change_name')}</Button>
        </div>
        {nameMsg && <p className="font-cinzel text-xs text-[#4caf78] tracking-widest">{nameMsg}</p>}
      </div>

      {/* Password section */}
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-2xl p-5 flex flex-col gap-3">
        <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">{t('settings.change_password')}</p>
        <input type="password" value={curPass} onChange={e => setCurPass(e.target.value)}
          placeholder={t('settings.current_password')} className={inputCls} />
        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
          placeholder={t('settings.new_password')} className={inputCls} />
        <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
          placeholder={t('settings.confirm_password')} className={inputCls} />
        {passErr && <p className="font-cinzel text-xs text-[#c95050] tracking-widest">{passErr}</p>}
        {passMsg && <p className="font-cinzel text-xs text-[#4caf78] tracking-widest">{passMsg}</p>}
        <Button size="sm" onClick={changePassword}>{t('settings.change_password')}</Button>
      </div>

      {/* Language section */}
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-2xl p-5 flex flex-col gap-4">
        <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">{t('settings.language')}</p>
        <div className="flex gap-2">
          {([['ru','🇷🇺 Русский'],['uz','🇺🇿 O\'zbek'],['en','🇬🇧 English']] as const).map(([code, label]) => (
            <button key={code} onClick={() => setLanguage(code as Language)}
              className={`flex-1 font-cinzel text-[0.65rem] tracking-wide uppercase py-2.5 min-h-[44px] rounded-xl border transition-all
                ${lang===code?'border-gold-dim text-gold-light bg-[rgba(201,168,76,0.1)]':'border-[rgba(201,168,76,0.1)] text-[#9a8a6a] hover:text-gold'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Account section */}
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-2xl p-5 flex flex-col gap-3">
        <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">{t('settings.account')}</p>
        <Button variant="danger" onClick={handleLogout}>
          {t('auth.logout')}
        </Button>
      </div>
    </div>
  );
}

// ════ Challenge.tsx ═══════════════════════════════════════════════════════════
export function ChallengePage() {
  const { t }    = useTranslation('common');
  const { token }  = useParams<{ token: string }>();
  const { data: challenge, isLoading, refetch } = useChallenge(token ?? '');
  const accept  = useAcceptChallenge();
  const submit  = useSubmitChallengeResult();
  const { events } = useChallengeSocket(challenge?.id);
  const user    = useAuthStore(s => s.user);
  const [done, setDone]         = useState(false);
  const [scoreInput, setScoreInput] = useState('');
  const [showInput, setShowInput]   = useState(false);

  const completeEvent = events.find(e => e.type === 'challenge:complete');
  const joinedEvent   = events.find(e => e.type === 'challenge:joined');

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={40} />
    </div>
  );

  if (!challenge) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-scheherazade text-6xl text-gold">⏰</p>
      <p className="font-cinzel text-xl text-[#f0e6cc]">Вызов не найден</p>
      <p className="font-cinzel text-xs text-[#9a8a6a] max-w-xs">
        Вызов не существует или истёк (активен 24 часа)
      </p>
      <Link to="/"><Button>На главную</Button></Link>
    </div>
  );

  const isChallenger = user?.id === challenge.challenger.id;
  const isParticipant = isChallenger || user?.id === challenge.opponent?.id;

  const handleSubmitResult = async () => {
    const score = parseInt(scoreInput);
    if (isNaN(score) || score < 0) return;
    await submit.mutateAsync({ token: token!, result: { score, durationSec: 60 } });
    setDone(true);
    refetch();
  };

  // Result screen
  if (completeEvent && completeEvent.type === 'challenge:complete') {
    const won = completeEvent.data.winnerId === user?.id;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <p className="font-scheherazade text-8xl mb-4">{won ? '🏆' : '😤'}</p>
          <p className="font-cinzel text-2xl text-[#f0e6cc] mb-2">
            {won ? 'Вы победили!' : 'Вы проиграли'}
          </p>
          <div className="flex gap-6 justify-center font-cinzel text-2xl font-bold mt-4">
            <span className={isChallenger ? 'text-gold-light' : 'text-[#9a8a6a]'}>
              {completeEvent.data.challengerScore}
            </span>
            <span className="text-[#9a8a6a]">:</span>
            <span className={!isChallenger ? 'text-gold-light' : 'text-[#9a8a6a]'}>
              {completeEvent.data.opponentScore}
            </span>
          </div>
          <p className="font-cinzel text-xs text-[#9a8a6a] mt-2">
            {challenge.challenger.name} vs {challenge.opponent?.name ?? '???'}
          </p>
        </motion.div>
        <Link to="/dashboard"><Button size="lg">На главную</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center">
        <p className="font-cinzel text-[0.6rem] tracking-[4px] text-[#9a8a6a] uppercase mb-3">
          Соревнование
        </p>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center mb-1">
              <span className="font-cinzel text-lg text-gold">
                {challenge.challenger.name[0].toUpperCase()}
              </span>
            </div>
            <p className="font-cinzel text-xs text-[#f0e6cc]">{challenge.challenger.name}</p>
            {challenge.challengerScore !== null && (
              <p className="font-cinzel text-sm text-gold-light font-bold">{challenge.challengerScore}</p>
            )}
          </div>
          <span className="font-cinzel text-gold-dim text-xl">vs</span>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.08)] flex items-center justify-center mb-1 border border-dashed border-[rgba(201,168,76,0.2)]">
              {challenge.opponent ? (
                <span className="font-cinzel text-lg text-gold">
                  {challenge.opponent.name[0].toUpperCase()}
                </span>
              ) : (
                <span className="text-[#9a8a6a] text-lg">?</span>
              )}
            </div>
            <p className="font-cinzel text-xs text-[#9a8a6a]">
              {challenge.opponent?.name ?? 'Ожидание...'}
            </p>
            {challenge.opponentScore !== null && (
              <p className="font-cinzel text-sm text-gold-light font-bold">{challenge.opponentScore}</p>
            )}
          </div>
        </div>
        <span className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase
                         px-3 py-1 rounded-full border border-[rgba(201,168,76,0.15)]">
          Режим: {challenge.mode}
        </span>
      </div>

      {/* State: waiting for opponent */}
      {challenge.status === 'pending' && isChallenger && (
        <div className="w-full flex flex-col gap-3 text-center">
          <p className="font-cinzel text-xs text-[#9a8a6a]">
            Отправь ссылку другу, чтобы начать
          </p>
          <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)]
                          rounded-2xl p-4 flex flex-col gap-3">
            <p className="font-cinzel text-[0.6rem] text-[#9a8a6a] tracking-widest uppercase">
              Ссылка на вызов
            </p>
            <p className="font-raleway text-xs text-[#f0e6cc] break-all select-all leading-relaxed">
              {window.location.href}
            </p>
            <Button size="sm" onClick={copyLink}>Скопировать ссылку</Button>
          </div>
          {joinedEvent && joinedEvent.type === 'challenge:joined' && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-cinzel text-xs text-[#4caf78]"
            >
              {joinedEvent.data.opponentName} принял вызов!
            </motion.p>
          )}
        </div>
      )}

      {/* State: not a participant — accept */}
      {challenge.status === 'pending' && !isParticipant && (
        <div className="flex flex-col gap-3 text-center">
          <p className="font-cinzel text-xs text-[#9a8a6a]">
            {challenge.challenger.name} вызывает тебя!
          </p>
          <Button size="lg" onClick={() => accept.mutate(token!)} disabled={accept.isPending}>
            {accept.isPending ? 'Принимаем...' : 'Принять вызов'}
          </Button>
        </div>
      )}

      {/* State: active — play and submit */}
      {challenge.status === 'active' && !done && isParticipant && (
        <div className="w-full flex flex-col gap-4">
          <p className="font-cinzel text-xs text-[#9a8a6a] text-center">
            Пройди режим и запиши свой счёт
          </p>
          <Link to={`/learn/${challenge.mode}`} className="w-full">
            <Button size="lg" className="w-full">
              {t('start', { ns: 'common' })}
            </Button>
          </Link>

          {!showInput ? (
            <Button variant="outline" onClick={() => setShowInput(true)}>
              {t('save', { ns: 'common' })}
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="font-cinzel text-xs text-center text-[#9a8a6a]">Сколько правильных ответов?</p>
              <input
                type="number" min="0" value={scoreInput}
                onChange={e => setScoreInput(e.target.value)}
                placeholder="Введи счёт..."
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.2)]
                           rounded-xl px-4 py-3 text-center text-[#f0e6cc] font-cinzel text-xl
                           outline-none focus:border-gold-dim"
              />
              <Button onClick={handleSubmitResult} disabled={submit.isPending}>
                {submit.isPending ? 'Сохраняем...' : 'Подтвердить счёт'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* State: submitted, waiting for other player */}
      {done && (
        <p className="font-cinzel text-xs text-[#9a8a6a] text-center">
          {t('loading')}
        </p>
      )}

      {/* Not logged in */}
      {!user && challenge.status === 'pending' && (
        <div className="text-center">
          <p className="font-cinzel text-xs text-[#9a8a6a] mb-3">
            Войди, чтобы принять вызов
          </p>
          <Link to={`/login?next=/challenge/${token}`}>
            <Button size="lg">Войти</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
