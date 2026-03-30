import { useState }        from 'react';
import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import { useAuthStore }    from '../store/authStore';
import { useProgress }     from '../hooks/useProgress';
import { useCreateChallenge } from '../hooks/useChallenge';
import { LevelBadge, StreakBadge, getStreakText } from '../components/ui/Badges';
import { XpBar }           from '../components/ui/XpBar';
import { DailyLesson }     from '../components/learn/DailyLesson';
import { Button }          from '../components/ui/Button';
import { LETTERS, StudyMode, WeaknessDto, Language } from '@arabic/shared';
import { useQuery }        from '@tanstack/react-query';
import { api }             from '../lib/api';

const LEARN_MODES: { to: string; icon: string; key: StudyMode; color: string }[] = [
  { to: '/learn/flashcards', icon: '\ud83d\udcc7', key: 'flashcard', color: 'from-[#2a1f08] to-[#1a1005]' },
  { to: '/learn/quiz',       icon: '\ud83c\udfaf', key: 'quiz',      color: 'from-[#0a1a2a] to-[#051015]' },
  { to: '/learn/speed',      icon: '\u26a1',       key: 'speed',     color: 'from-[#1a0a0a] to-[#100505]' },
  { to: '/learn/lightning',  icon: '\ud83c\udf29\ufe0f', key: 'lightning', color: 'from-[#150f1a] to-[#0a0810]' },
  { to: '/learn/memory',     icon: '\ud83e\udde0', key: 'memory',    color: 'from-[#0a1a0a] to-[#051005]' },
  { to: '/learn/listen',     icon: '\ud83d\udd0a', key: 'listen',    color: 'from-[#1a1a0a] to-[#101005]' },
  { to: '/learn/find',       icon: '\ud83d\udd0d', key: 'find',      color: 'from-[#0a0a1a] to-[#050510]' },
  { to: '/learn/write',      icon: '\u270d\ufe0f', key: 'write',     color: 'from-[#1a0a1a] to-[#100510]' },
];

export function DashboardPage() {
  const { t }  = useTranslation(['common', 'learn']);
  const user   = useAuthStore((s) => s.user);
  const lang   = (user?.language ?? 'uz') as Language;
  const { data: stats } = useProgress();
  const createChallenge = useCreateChallenge();
  const [challengeLink, setChallengeLink] = useState<string | null>(null);
  const [challengeMode, setChallengeMode] = useState<StudyMode>('quiz');

  const { data: speedBoard, isError: speedError } = useQuery({
    queryKey: ['leaderboard', 'speed-rank'],
    queryFn: async () => (await api.get('/leaderboard/speed?mode=speed')).data.data,
    staleTime: 60_000,
  });
  const { data: streakBoard, isError: streakError } = useQuery({
    queryKey: ['leaderboard', 'streak-rank'],
    queryFn: async () => (await api.get('/leaderboard/streak')).data.data,
    staleTime: 60_000,
  });

  const { data: weaknessData, isError: weaknessError } = useQuery<WeaknessDto[]>({
    queryKey: ['weakness'],
    queryFn: async () => (await api.get('/weakness')).data.data,
    staleTime: 60_000,
    retry: false,
  });

  const speedRank = (speedBoard as any[])?.find((e: any) => e.userId === user?.id)?.rank ?? null;
  const streakRank = (streakBoard as any[])?.find((e: any) => e.userId === user?.id)?.rank ?? null;

  const knownCount = stats?.knownCount ?? 0;

  // accuracy is 0-1 float from the API, threshold at 0.7
  const hasWeakLetters = weaknessData && weaknessData.length > 0 && weaknessData.some((w) => w.accuracy < 0.7);
  const topWeakLetters = weaknessData
    ?.filter((w) => w.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5) ?? [];

  const streakCount = user?.streak.current ?? 0;
  const streakLabel = getStreakText(streakCount, lang, t);

  const handleCreateChallenge = async () => {
    const result = await createChallenge.mutateAsync(challengeMode);
    const link = `${window.location.origin}/challenge/${result.shareToken}`;
    setChallengeLink(link);
    navigator.clipboard.writeText(link).catch(() => {});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">

      {/* 1. HEADER: Greeting + Level + XP Bar (single consolidated block) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="font-cinzel text-[0.65rem] tracking-[4px] text-[#9a8a6a] uppercase">
          {'\u0645\u0631\u062d\u0628\u0627\u064b'}
        </p>
        <h1 className="font-cinzel text-2xl text-[#f0e6cc] mt-1">{user?.name}</h1>
        <div className="flex gap-2 flex-wrap mt-2 mb-4">
          {user && <LevelBadge level={user.level} size="md" />}
          {user && <StreakBadge current={user.streak.current} />}
        </div>
        {user && (
          <div className="mt-3">
            <XpBar xp={user.xp} level={user.xpLevel} />
          </div>
        )}
      </motion.div>

      {/* 2. DAILY LESSON CARD (prominent) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <DailyLesson />
      </motion.div>

      {/* 3. QUICK STATS ROW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {/* Streak */}
        <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                        rounded-2xl p-4 text-center">
          <span className="text-2xl">{'\ud83d\udd25'}</span>
          <p className="font-cinzel text-lg text-[#ff8c42] font-bold mt-1">
            {streakCount}
          </p>
          <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
            {streakLabel}
          </p>
        </div>

        {/* Letters learned */}
        <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                        rounded-2xl p-4 text-center">
          <span className="text-2xl">{'\ud83d\udcda'}</span>
          <p className="font-cinzel text-lg text-gold-light font-bold mt-1">
            {knownCount} / {LETTERS.length}
          </p>
          <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
            {t('common:letters_known')}
          </p>
        </div>

        {/* Rank */}
        <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                        rounded-2xl p-4 text-center">
          <span className="text-2xl">{'\ud83c\udfc6'}</span>
          <p className="font-cinzel text-lg text-gold-light font-bold mt-1">
            {speedError && streakError
              ? <span className="text-[#9a8a6a] text-xs">{t('common:data_load_error')}</span>
              : speedRank ? `#${speedRank}` : streakRank ? `#${streakRank}` : '---'}
          </p>
          <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
            {t('common:rank.speed')}
          </p>
        </div>
      </motion.div>

      {/* 4. CONTINUE LEARNING: Weakness-based suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#1a0808] to-[#140505] border border-[rgba(201,80,80,0.15)]
                   rounded-3xl p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-cinzel text-xs tracking-[3px] text-[rgba(201,80,80,0.8)] uppercase">
            {t('common:weakness.dashboard_title')}
          </p>
        </div>

        {weaknessError ? (
          <p className="font-cinzel text-[0.6rem] text-[#9a8a6a] tracking-wide">
            {t('common:data_load_error')}
          </p>
        ) : !weaknessData || weaknessData.length === 0 ? (
          <p className="font-cinzel text-[0.6rem] text-[#9a8a6a] tracking-wide">
            {t('common:weakness_empty')}
          </p>
        ) : hasWeakLetters ? (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {topWeakLetters.map((w) => {
                const letter = LETTERS.find((l) => l.code === w.letterCode);
                if (!letter) return null;
                return (
                  <div
                    key={w.letterCode}
                    className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl
                               bg-[rgba(201,80,80,0.05)] border border-[rgba(201,80,80,0.15)]"
                  >
                    <span className="font-scheherazade text-xl text-gold-light">{letter.code}</span>
                    <span className="font-cinzel text-[0.45rem] text-[#c95050] font-bold">
                      {Math.round(w.accuracy * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>

            <Link to="/learn/weakness">
              <Button variant="outline" size="sm"
                className="border-[rgba(201,80,80,0.3)] text-[#c95050] hover:bg-[rgba(201,80,80,0.08)]">
                {t('common:weakness.start_training')}
              </Button>
            </Link>
          </>
        ) : (
          <p className="font-cinzel text-[0.6rem] text-[#4caf78] tracking-wide">
            {t('common:weakness.no_weakness')}
          </p>
        )}
      </motion.div>

      {/* 5. GAME MODES GRID (2x4) */}
      <h2 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase mb-4">
        {t('common:learn_modes')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {LEARN_MODES.map(({ to, icon, key, color }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i + 0.25 }}
          >
            <Link
              to={to}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl
                bg-gradient-to-br ${color} border border-[rgba(201,168,76,0.1)]
                hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1
                transition-all duration-200 group`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
              <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase text-center">
                {t(`learn:modes.${key}`)}
              </span>
            </Link>
          </motion.div>
        ))}

        {/* Quran Mode card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
        >
          <Link
            to="/learn/quran"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl
              bg-gradient-to-br from-[#0f1a0a] to-[#081005] border border-[rgba(76,175,120,0.15)]
              hover:border-[rgba(76,175,120,0.35)] hover:-translate-y-1
              transition-all duration-200 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{'\ud83d\udcd6'}</span>
            <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase text-center">
              {t('common:quran.mode_name')}
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Muallim Soniy Textbook CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-6"
      >
        <Link to="/textbook" className="block">
          <div className="bg-gradient-to-r from-[#0f1a08] to-[#1a2008] border border-[rgba(76,175,120,0.15)]
                          rounded-2xl p-4 flex items-center gap-4
                          hover:border-[rgba(76,175,120,0.35)] hover:shadow-[0_0_20px_rgba(76,175,120,0.1)] transition-all">
            <span className="text-3xl">{'\uD83D\uDCD6'}</span>
            <div className="flex-1">
              <p className="font-cinzel text-sm text-[#f0e6cc] tracking-wide">
                {t('common:textbook.title')}
              </p>
              <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
                {t('common:textbook.subtitle')}
              </p>
            </div>
            <span className="font-cinzel text-gold-light text-lg">{'\u2192'}</span>
          </div>
        </Link>
      </motion.div>

      {/* Session flow CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <Link to="/learn/session" className="block">
          <div className="bg-gradient-to-r from-[#201808] to-[#2a1f08] border border-gold-dim
                          rounded-2xl p-4 flex items-center gap-4
                          hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all">
            <span className="text-3xl">{'\ud83c\udfaf'}</span>
            <div className="flex-1">
              <p className="font-cinzel text-sm text-[#f0e6cc] tracking-wide">
                {t('common:session.cta_title')}
              </p>
              <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
                {t('common:session.cta_subtitle')}
              </p>
            </div>
            <span className="font-cinzel text-gold-light text-lg">{'\u2192'}</span>
          </div>
        </Link>
      </motion.div>

      {/* 6. CHALLENGE A FRIEND (compact) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-[#150f1a] to-[#0a0810]
                   border border-[rgba(180,120,255,0.2)] rounded-3xl p-5"
      >
        <p className="font-cinzel text-xs tracking-[3px] text-[rgba(180,120,255,0.8)] uppercase mb-3">
          {'\u2694\ufe0f'} {t('common:challenge_friend')}
        </p>

        {/* Mode selector */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {(['quiz','speed','lightning','memory'] as StudyMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => { setChallengeMode(mode); setChallengeLink(null); }}
              className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-3 py-1.5
                rounded-full border transition-all
                ${challengeMode === mode
                  ? 'border-[rgba(180,120,255,0.4)] text-[#c8a0ff] bg-[rgba(180,120,255,0.1)]'
                  : 'border-[rgba(255,255,255,0.08)] text-[#9a8a6a] hover:text-[#c8a0ff]'}`}
            >
              {t(`learn:modes.${mode}`)}
            </button>
          ))}
        </div>

        {challengeLink ? (
          <div className="flex flex-col gap-2">
            <p className="font-cinzel text-[0.6rem] text-[#4caf78] tracking-widest uppercase">
              {'\u2713'} {t('common:link_copied')}
            </p>
            <p className="font-raleway text-xs text-[#9a8a6a] break-all select-all
                           bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                           rounded-xl px-3 py-2 leading-relaxed">
              {challengeLink}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline"
                onClick={() => navigator.clipboard.writeText(challengeLink)}>
                {'\ud83d\udccb'} {t('common:copy_link')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setChallengeLink(null)}>
                {t('common:new_challenge')}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleCreateChallenge}
            disabled={createChallenge.isPending}
            className="border-[rgba(180,120,255,0.3)] text-[#c8a0ff]
                       hover:bg-[rgba(180,120,255,0.08)] disabled:opacity-40"
          >
            {createChallenge.isPending
              ? t('common:loading')
              : `\u2694\ufe0f ${t('common:create_challenge')}`}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
