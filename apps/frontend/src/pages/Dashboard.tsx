import { useState }        from 'react';
import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import { useAuthStore }    from '../store/authStore';
import { useProgress }     from '../hooks/useProgress';
import { useCreateChallenge } from '../hooks/useChallenge';
import { LevelBadge, StreakBadge } from '../components/ui/Badges';
import { ProgressChart }   from '../components/progress/ProgressChart';
import { Button }          from '../components/ui/Button';
import { LETTERS, StudyMode } from '@arabic/shared';
import { useQuery }        from '@tanstack/react-query';
import { api }             from '../lib/api';

const LEARN_MODES: { to: string; icon: string; key: StudyMode; color: string }[] = [
  { to: '/learn/flashcards', icon: '📇', key: 'flashcard', color: 'from-[#2a1f08] to-[#1a1005]' },
  { to: '/learn/quiz',       icon: '🎯', key: 'quiz',      color: 'from-[#0a1a2a] to-[#051015]' },
  { to: '/learn/speed',      icon: '⚡', key: 'speed',     color: 'from-[#1a0a0a] to-[#100505]' },
  { to: '/learn/lightning',  icon: '🌩️', key: 'lightning', color: 'from-[#150f1a] to-[#0a0810]' },
  { to: '/learn/memory',     icon: '🧠', key: 'memory',    color: 'from-[#0a1a0a] to-[#051005]' },
  { to: '/learn/listen',     icon: '🔊', key: 'listen',    color: 'from-[#1a1a0a] to-[#101005]' },
  { to: '/learn/find',       icon: '🔍', key: 'find',      color: 'from-[#0a0a1a] to-[#050510]' },
  { to: '/learn/write',      icon: '✍️',  key: 'write',     color: 'from-[#1a0a1a] to-[#100510]' },
];

export function DashboardPage() {
  const { t }  = useTranslation(['common', 'learn']);
  const user   = useAuthStore((s) => s.user);
  const { data: stats } = useProgress();
  const createChallenge = useCreateChallenge();
  const [challengeLink, setChallengeLink] = useState<string | null>(null);
  const [challengeMode, setChallengeMode] = useState<StudyMode>('quiz');

  const { data: speedBoard } = useQuery({
    queryKey: ['leaderboard', 'speed-rank'],
    queryFn: async () => (await api.get('/leaderboard/speed?mode=speed')).data.data,
    staleTime: 60_000,
  });
  const { data: streakBoard } = useQuery({
    queryKey: ['leaderboard', 'streak-rank'],
    queryFn: async () => (await api.get('/leaderboard/streak')).data.data,
    staleTime: 60_000,
  });

  const speedRank = (speedBoard as any[])?.find((e: any) => e.userId === user?.id)?.rank ?? null;
  const streakRank = (streakBoard as any[])?.find((e: any) => e.userId === user?.id)?.rank ?? null;

  const knownCount = stats?.knownCount ?? 0;
  const progress   = Math.round(knownCount / LETTERS.length * 100);

  const handleCreateChallenge = async () => {
    const result = await createChallenge.mutateAsync(challengeMode);
    const link = `${window.location.origin}/challenge/${result.shareToken}`;
    setChallengeLink(link);
    navigator.clipboard.writeText(link).catch(() => {});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="font-cinzel text-[0.65rem] tracking-[4px] text-[#9a8a6a] uppercase">مرحباً</p>
        <h1 className="font-cinzel text-2xl text-[#f0e6cc] mt-1">{user?.name}</h1>
        <div className="flex gap-2 flex-wrap mt-2">
          {user && <LevelBadge level={user.level} size="md" />}
          {user && <StreakBadge current={user.streak.current} />}
        </div>
      </motion.div>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                   rounded-3xl p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">
            {t('common:letters_known')}
          </p>
          <p className="font-cinzel text-xl text-gold-light font-bold">
            {knownCount} / {LETTERS.length}
          </p>
        </div>
        <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-gold-dim to-gold-light rounded-full
                       shadow-[0_0_10px_rgba(201,168,76,0.5)]"
          />
        </div>
        <ProgressChart days={14} />
      </motion.div>

      {/* Leaderboard rank */}
      {(speedRank || streakRank) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-3 mb-6"
        >
          {speedRank && (
            <div className="flex-1 bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                            rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-cinzel text-lg text-gold-light font-bold">#{speedRank}</p>
                <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
                  {t('common:rank.speed')}
                </p>
              </div>
            </div>
          )}
          {streakRank && (
            <div className="flex-1 bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                            rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-cinzel text-lg text-gold-light font-bold">#{streakRank}</p>
                <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
                  {t('common:rank.streak')}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Learn modes */}
      <h2 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase mb-4">
        Режимы обучения
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {LEARN_MODES.map(({ to, icon, key, color }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i + 0.2 }}
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
      </div>

      {/* Challenge a friend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-[#150f1a] to-[#0a0810]
                   border border-[rgba(180,120,255,0.2)] rounded-3xl p-6"
      >
        <p className="font-cinzel text-xs tracking-[3px] text-[rgba(180,120,255,0.8)] uppercase mb-4">
          ⚔️ {t('common:challenge_friend')}
        </p>

        {/* Mode selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
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
          <div className="flex flex-col gap-3">
            <p className="font-cinzel text-[0.6rem] text-[#4caf78] tracking-widest uppercase">
              ✓ Ссылка скопирована в буфер!
            </p>
            <p className="font-raleway text-xs text-[#9a8a6a] break-all select-all
                           bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                           rounded-xl px-3 py-2 leading-relaxed">
              {challengeLink}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline"
                onClick={() => navigator.clipboard.writeText(challengeLink)}>
                📋 Скопировать ещё раз
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setChallengeLink(null)}>
                Новый вызов
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
            {createChallenge.isPending ? 'Создаём...' : '⚔️ Создать вызов'}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
