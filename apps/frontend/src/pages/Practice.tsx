import { useState }        from 'react';
import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import {
  Layers, Target, Zap, CloudLightning, Brain,
  Volume2, Search, PenTool, BookOpen, Swords,
  Link2, LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery }        from '@tanstack/react-query';
import { api }             from '../lib/api';
import { useAuthStore }    from '../store/authStore';
import { useCreateChallenge } from '../hooks/useChallenge';
import { Button }          from '../components/ui/Button';
import { LETTERS, StudyMode, WeaknessDto, Language } from '@arabic/shared';
import { useSectionsStore } from '../store/sectionsStore';

/* ─────────── Mode definitions ─────────── */

interface ModeItem {
  to: string;
  icon: LucideIcon;
  key: StudyMode;
  color: string;
}

const LEARN_MODES: ModeItem[] = [
  { to: '/learn/flashcards', icon: Layers,         key: 'flashcard',  color: 'from-[#2a1f08] to-[#1a1005]' },
  { to: '/learn/quiz',       icon: Target,         key: 'quiz',       color: 'from-[#0a1a2a] to-[#051015]' },
  { to: '/learn/speed',      icon: Zap,            key: 'speed',      color: 'from-[#1a0a0a] to-[#100505]' },
  { to: '/learn/lightning',  icon: CloudLightning, key: 'lightning',  color: 'from-[#150f1a] to-[#0a0810]' },
  { to: '/learn/memory',     icon: Brain,          key: 'memory',     color: 'from-[#0a1a0a] to-[#051005]' },
  { to: '/learn/listen',     icon: Volume2,        key: 'listen',     color: 'from-[#1a1a0a] to-[#101005]' },
  { to: '/learn/find',       icon: Search,         key: 'find',       color: 'from-[#0a0a1a] to-[#050510]' },
  { to: '/learn/write',      icon: PenTool,        key: 'write',      color: 'from-[#1a0a1a] to-[#100510]' },
];

/* ─────────── Main page ─────────── */

export function PracticePage() {
  const { t }  = useTranslation(['common', 'learn']);
  const user   = useAuthStore((s) => s.user);
  const lang   = (user?.language ?? 'uz') as Language;
  const isEnabled = useSectionsStore(s => s.isEnabled);
  const createChallenge = useCreateChallenge();
  const [challengeLink, setChallengeLink] = useState<string | null>(null);
  const [challengeMode, setChallengeMode] = useState<StudyMode>('quiz');

  const { data: weaknessData } = useQuery<WeaknessDto[]>({
    queryKey: ['weakness'],
    queryFn: async () => (await api.get('/weakness')).data.data,
    staleTime: 60_000,
    retry: false,
  });

  const topWeakLetters = weaknessData
    ?.filter((w) => w.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5) ?? [];

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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-cinzel text-lg text-[#f0e6cc] tracking-wide">
          {t('common:nav.practice')}
        </h1>
        <p className="text-[0.7rem] text-[#9a8a6a] mt-1">
          {t('common:practice.subtitle', { defaultValue: lang === 'ru' ? 'Отрабатывай то, что уже изучил' : lang === 'en' ? 'Practice what you have learned' : "O'rganganlaringni mashq qil" })}
        </p>
      </motion.div>

      {/* Letter Forms section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <h2 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase mb-3">
          {t('common:forms.forms_title')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/learn/connections"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl
              bg-gradient-to-br from-[#1a0f08] to-[#120a05] border border-[rgba(201,168,76,0.1)]
              hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1
              transition-all duration-200 group"
          >
            <Link2 size={28} className="text-[#9a8a6a] group-hover:text-[#e8c96d] group-hover:scale-110 transition-all" />
            <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase text-center">
              {t('common:forms.connections_title')}
            </span>
          </Link>
          <Link
            to="/learn/forms"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl
              bg-gradient-to-br from-[#0f0f1a] to-[#080810] border border-[rgba(201,168,76,0.1)]
              hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1
              transition-all duration-200 group"
          >
            <LayoutGrid size={28} className="text-[#9a8a6a] group-hover:text-[#e8c96d] group-hover:scale-110 transition-all" />
            <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase text-center">
              {t('common:forms.forms_title')}
            </span>
          </Link>
        </div>
      </motion.div>

      {/* Game Modes Grid */}
      {isEnabled('games') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase mb-4">
            {t('common:learn_modes')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LEARN_MODES.map(({ to, icon: Icon, key, color }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i + 0.15 }}
              >
                <Link
                  to={to}
                  className={`flex flex-col items-center gap-2 p-4 min-h-[80px] rounded-2xl
                    bg-gradient-to-br ${color} border border-[rgba(201,168,76,0.1)]
                    hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1
                    transition-all duration-200 group`}
                >
                  <Icon size={28} className="text-[#9a8a6a] group-hover:text-[#e8c96d] group-hover:scale-110 transition-all" />
                  <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase text-center">
                    {t(`learn:modes.${key}`)}
                  </span>
                </Link>
              </motion.div>
            ))}

            {/* Quran Mode card */}
            {isEnabled('quran') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 }}
              >
                <Link
                  to="/learn/quran"
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl
                    bg-gradient-to-br from-[#0f1a0a] to-[#081005] border border-[rgba(76,175,120,0.15)]
                    hover:border-[rgba(76,175,120,0.35)] hover:-translate-y-1
                    transition-all duration-200 group"
                >
                  <BookOpen size={28} className="text-[#9a8a6a] group-hover:text-[#4caf78] group-hover:scale-110 transition-all" />
                  <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase text-center">
                    {t('common:quran.mode_name')}
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Weak Letters */}
      {isEnabled('weakness') && topWeakLetters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1a0808] to-[#140505] border border-[rgba(201,80,80,0.15)]
                     rounded-3xl p-5 mb-6"
        >
          <p className="font-cinzel text-xs tracking-[3px] text-[rgba(201,80,80,0.8)] uppercase mb-3">
            {t('common:weakness.dashboard_title')}
          </p>
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
        </motion.div>
      )}

      {/* Guided Session */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-6"
      >
        <Link to="/learn/session" className="block">
          <div className="bg-gradient-to-r from-[#201808] to-[#2a1f08] border border-gold-dim
                          rounded-2xl p-4 flex items-center gap-4
                          hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all">
            <Target size={28} className="text-[#c9a84c] shrink-0" />
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

      {/* Challenge a friend */}
      {isEnabled('challenges') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#150f1a] to-[#0a0810]
                     border border-[rgba(180,120,255,0.2)] rounded-3xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Swords size={16} className="text-[rgba(180,120,255,0.8)]" />
            <p className="font-cinzel text-xs tracking-[3px] text-[rgba(180,120,255,0.8)] uppercase">
              {t('common:challenge_friend')}
            </p>
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {(['quiz','speed','lightning','memory'] as StudyMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => { setChallengeMode(mode); setChallengeLink(null); }}
                className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-3 py-2.5 min-h-[44px]
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
                {t('common:link_copied')}
              </p>
              <p className="font-raleway text-xs text-[#9a8a6a] break-all select-all
                             bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
                             rounded-xl px-3 py-2 leading-relaxed">
                {challengeLink}
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline"
                  onClick={() => navigator.clipboard.writeText(challengeLink)}>
                  {t('common:copy_link')}
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
                : t('common:create_challenge')}
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
