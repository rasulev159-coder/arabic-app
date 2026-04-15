import { useState, useRef, useEffect } from 'react';
import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import {
  BookOpen, Layers, Volume2, BookMarked,
  BookOpenCheck, GraduationCap, Lock, CheckCircle,
  ChevronDown, ChevronRight, Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuthStore }    from '../store/authStore';
import { useProgress }     from '../hooks/useProgress';
import { useTextbookStore } from '../store/textbookStore';
import { useQuranWordsStore } from '../store/quranWordsStore';
import { LevelBadge, StreakBadge } from '../components/ui/Badges';
import { XpBar }           from '../components/ui/XpBar';
import { DailyLesson }     from '../components/learn/DailyLesson';
import { LETTERS }         from '@arabic/shared';

/* ─────────── Stage definitions ─────────── */

interface Lesson {
  id: string;
  titleKey: string;
  route: string;
}

interface StageDefinition {
  id: number;
  key: string;
  icon: LucideIcon;
  lessons: Lesson[];
}

const STAGES: StageDefinition[] = [
  {
    id: 1,
    key: 'alphabet',
    icon: BookOpen,
    lessons: [
      { id: 'a1', titleKey: 'stages.alphabet.l1', route: '/learn/flashcards?group=1' },
      { id: 'a2', titleKey: 'stages.alphabet.l2', route: '/learn/flashcards?group=2' },
      { id: 'a3', titleKey: 'stages.alphabet.l3', route: '/learn/flashcards?group=3' },
      { id: 'a4', titleKey: 'stages.alphabet.l4', route: '/learn/flashcards?group=4' },
      { id: 'a5', titleKey: 'stages.alphabet.l5', route: '/learn/quiz' },
      { id: 'a6', titleKey: 'stages.alphabet.l6', route: '/learn/connections' },
    ],
  },
  {
    id: 2,
    key: 'forms',
    icon: Layers,
    lessons: [
      { id: 'f1', titleKey: 'stages.forms.l1', route: '/learn/forms?type=initial' },
      { id: 'f2', titleKey: 'stages.forms.l2', route: '/learn/forms?type=medial' },
      { id: 'f3', titleKey: 'stages.forms.l3', route: '/learn/forms?type=final' },
      { id: 'f4', titleKey: 'stages.forms.l4', route: '/learn/forms' },
    ],
  },
  {
    id: 3,
    key: 'harakat',
    icon: Volume2,
    lessons: [
      { id: 'h1', titleKey: 'stages.harakat.l1', route: '/textbook/ch1-harakat' },
      { id: 'h2', titleKey: 'stages.harakat.l2', route: '/textbook/ch3-tanwin' },
      { id: 'h3', titleKey: 'stages.harakat.l3', route: '/textbook/ch4-sukun-shadda' },
      { id: 'h4', titleKey: 'stages.harakat.l4', route: '/textbook/ch5-madd' },
    ],
  },
  {
    id: 4,
    key: 'words',
    icon: BookMarked,
    lessons: [
      { id: 'w1', titleKey: 'stages.words.l1', route: '/learn/quran-words' },
      { id: 'w2', titleKey: 'stages.words.l2', route: '/textbook/ch2-words' },
      { id: 'w3', titleKey: 'stages.words.l3', route: '/textbook/ch6-lam' },
      { id: 'w4', titleKey: 'stages.words.l4', route: '/textbook/ch7-reading' },
    ],
  },
  {
    id: 5,
    key: 'ayat',
    icon: BookOpenCheck,
    lessons: [
      { id: 's1', titleKey: 'stages.ayat.l1', route: '/textbook/ch8-kalima' },
      { id: 's2', titleKey: 'stages.ayat.l2', route: '/textbook/ch9-surahs' },
      { id: 's3', titleKey: 'stages.ayat.l3', route: '/learn/quran' },
    ],
  },
  {
    id: 6,
    key: 'fluency',
    icon: GraduationCap,
    lessons: [],
  },
];

/* ─────────── Progress hooks ─────────── */

type StageStatus = 'completed' | 'current' | 'locked';

interface StageProgress {
  stage: StageDefinition;
  status: StageStatus;
  percent: number;
}

function useStageProgress(): StageProgress[] {
  const { data: stats } = useProgress();
  const { getTotalProgress, progress: tbProgress } = useTextbookStore();
  const quranStats = useQuranWordsStore((s) => s.getStats());

  const knownCount = stats?.knownCount ?? 0;
  const totalLetters = LETTERS.length; // 28

  // Stage 1: alphabet — known letters / 28
  const s1 = Math.min(100, Math.round((knownCount / totalLetters) * 100));

  // Stage 2: forms — we approximate from accuracy once >50% letters known
  // Using known letters as proxy (forms are studied after alphabet)
  const s2 = s1 >= 80
    ? Math.min(100, Math.round(((knownCount - 22) / 6) * 100)) // 22..28 → 0..100
    : 0;

  // Stage 3: harakat — textbook chapters 1,3,4,5 completion
  const harakatChapters = ['ch1-harakat', 'ch3-tanwin', 'ch4-sukun-shadda', 'ch5-madd'];
  const harakatDone = harakatChapters.filter((id) => tbProgress[id]?.completedAt).length;
  const s3 = Math.round((harakatDone / harakatChapters.length) * 100);

  // Stage 4: words — quran words mastered / 300 + textbook chapters 2,6,7
  const wordChapters = ['ch2-words', 'ch6-lam', 'ch7-reading'];
  const wordChDone = wordChapters.filter((id) => tbProgress[id]?.completedAt).length;
  const s4 = Math.round(
    ((quranStats.mastered / 300) * 60 + (wordChDone / wordChapters.length) * 40)
  );

  // Stage 5: ayat — textbook chapters 8,9
  const ayatChapters = ['ch8-kalima', 'ch9-surahs'];
  const ayatDone = ayatChapters.filter((id) => tbProgress[id]?.completedAt).length;
  const s5 = Math.round((ayatDone / ayatChapters.length) * 100);

  // Stage 6: fluency — future
  const s6 = 0;

  const percents = [s1, s2, s3, s4, s5, s6];

  // Determine statuses
  const results: StageProgress[] = [];
  let foundCurrent = false;

  for (let i = 0; i < STAGES.length; i++) {
    const pct = percents[i];
    const isComplete = pct >= 100;

    if (isComplete) {
      results.push({ stage: STAGES[i], status: 'completed', percent: pct });
    } else if (!foundCurrent) {
      // Unlock conditions: stage 1 always open, others need prev >= 80%
      const prevPct = i === 0 ? 100 : percents[i - 1];
      if (prevPct >= 80 || i === 0) {
        results.push({ stage: STAGES[i], status: 'current', percent: pct });
        foundCurrent = true;
      } else {
        results.push({ stage: STAGES[i], status: 'locked', percent: 0 });
        foundCurrent = true;
      }
    } else {
      results.push({ stage: STAGES[i], status: 'locked', percent: 0 });
    }
  }

  return results;
}

/* ─────────── Stage card component ─────────── */

function StageCard({ sp, index }: { sp: StageProgress; index: number }) {
  const { t }  = useTranslation('common');
  const [open, setOpen] = useState(sp.status === 'current');
  const ref    = useRef<HTMLDivElement>(null);

  const { stage, status, percent } = sp;
  const Icon = stage.icon;
  const delay = 0.1 + index * 0.1;

  // Scroll current stage into view
  useEffect(() => {
    if (status === 'current') {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const isLocked = status === 'locked';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 25 }}
    >
      {/* Node + line */}
      <div className="flex gap-4">
        {/* Timeline column */}
        <div className="flex flex-col items-center">
          {/* Node circle */}
          <div
            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all
              ${status === 'completed'
                ? 'bg-gradient-to-br from-[#c9a84c] to-[#a88a3a] shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                : status === 'current'
                ? 'bg-[#1a1408] border-2 border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.25)]'
                : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]'
              }`}
          >
            {status === 'completed' ? (
              <CheckCircle size={20} className="text-[#0d0a07]" />
            ) : isLocked ? (
              <Lock size={16} className="text-[#555]" />
            ) : (
              <Icon size={20} className="text-[#e8c96d]" />
            )}

            {/* Pulse ring for current */}
            {status === 'current' && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#c9a84c]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>

          {/* Connecting line */}
          {index < STAGES.length - 1 && (
            <div
              className={`w-0.5 flex-1 min-h-[16px] ${
                status === 'completed'
                  ? 'bg-gradient-to-b from-[#c9a84c] to-[#c9a84c80]'
                  : 'bg-[rgba(255,255,255,0.06)]'
              }`}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-6">
          <button
            onClick={() => !isLocked && setOpen(!open)}
            disabled={isLocked}
            className={`w-full text-left rounded-2xl border p-4 transition-all
              ${status === 'completed'
                ? 'bg-[rgba(201,168,76,0.06)] border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)]'
                : status === 'current'
                ? 'bg-[rgba(201,168,76,0.08)] border-[rgba(201,168,76,0.25)] shadow-[0_0_20px_rgba(201,168,76,0.08)]'
                : 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.05)] opacity-50 cursor-not-allowed'
              }`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-cinzel text-[0.6rem] tracking-[3px] uppercase ${
                    isLocked ? 'text-[#555]' : 'text-[#9a8a6a]'
                  }`}>
                    {t('learn_path.stage', { defaultValue: `Stage ${stage.id}` }).replace('{{n}}', String(stage.id))}
                  </p>
                  {status === 'completed' && (
                    <span className="text-[0.55rem] text-[#4caf78] font-cinzel tracking-wider">
                      {t('learn_path.completed')}
                    </span>
                  )}
                </div>
                <h3 className={`font-cinzel text-sm tracking-wide mt-0.5 ${
                  isLocked ? 'text-[#555]' : status === 'current' ? 'text-[#f0e6cc]' : 'text-[#c8b88a]'
                }`}>
                  {t(`stages.${stage.key}.title`)}
                </h3>
                <p className={`text-[0.65rem] mt-1 leading-relaxed ${
                  isLocked ? 'text-[#444]' : 'text-[#9a8a6a]'
                }`}>
                  {t(`stages.${stage.key}.description`)}
                </p>
              </div>

              {/* Progress / status indicator */}
              <div className="flex flex-col items-center ml-3 shrink-0">
                {isLocked ? (
                  <Lock size={16} className="text-[#555]" />
                ) : (
                  <>
                    <span className={`font-cinzel text-lg font-bold ${
                      status === 'completed' ? 'text-[#4caf78]' : 'text-[#e8c96d]'
                    }`}>
                      {percent}%
                    </span>
                    {!isLocked && stage.lessons.length > 0 && (
                      open
                        ? <ChevronDown size={14} className="text-[#9a8a6a] mt-0.5" />
                        : <ChevronRight size={14} className="text-[#9a8a6a] mt-0.5" />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {!isLocked && (
              <div className="mt-3 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    status === 'completed'
                      ? 'bg-gradient-to-r from-[#4caf78] to-[#66bb6a]'
                      : 'bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            )}

            {isLocked && (
              <p className="text-[0.6rem] text-[#555] mt-2 font-cinzel">
                {t('learn_path.locked')}
              </p>
            )}
          </button>

          {/* Expanded lessons list */}
          {open && !isLocked && stage.lessons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-2 flex flex-col gap-1"
            >
              {stage.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={lesson.route}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]
                             hover:bg-[rgba(201,168,76,0.06)] hover:border-[rgba(201,168,76,0.15)]
                             transition-all group"
                >
                  <Target size={14} className="text-[#9a8a6a] group-hover:text-[#e8c96d] shrink-0" />
                  <span className="text-[0.7rem] text-[#c8b88a] group-hover:text-[#f0e6cc] font-cinzel tracking-wide">
                    {t(lesson.titleKey)}
                  </span>
                  <ChevronRight size={12} className="text-[#555] group-hover:text-[#9a8a6a] ml-auto shrink-0" />
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────── Main page ─────────── */

export function LearnPathPage() {
  const { t }  = useTranslation('common');
  const user   = useAuthStore((s) => s.user);
  const stages = useStageProgress();

  // Find the current stage for the "Continue" card
  const currentStage = stages.find((s) => s.status === 'current');
  const overallPercent = Math.round(
    stages.reduce((sum, s) => sum + s.percent, 0) / stages.length
  );

  return (
    <div
      className="min-h-screen bg-bg pb-24 md:pb-8"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)`,
      }}
    >
      {/* Header: welcome + streak + xp */}
      <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="font-cinzel text-lg text-[#f0e6cc] tracking-wide">
                {t('learn_path.welcome', { name: user.name, defaultValue: `Welcome, ${user.name}!` })}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <LevelBadge level={user.level} />
                <StreakBadge current={user.streak.current} />
              </div>
            </div>
            <div className="text-right">
              <XpBar xp={user.xp} level={user.xpLevel} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Continue learning card */}
      {currentStage && (
        <div className="px-4 max-w-2xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link
              to={currentStage.stage.lessons[0]?.route ?? '/learn/flashcards'}
              className="block rounded-2xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)]
                         p-5 hover:bg-[rgba(201,168,76,0.12)] transition-all
                         shadow-[0_0_30px_rgba(201,168,76,0.06)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-[#e8c96d]" />
                <span className="font-cinzel text-xs tracking-[3px] uppercase text-[#e8c96d]">
                  {t('learn_path.continue')}
                </span>
              </div>
              <p className="text-[#c8b88a] text-sm">
                {t('learn_path.stage', { defaultValue: `Stage ${currentStage.stage.id}` }).replace('{{n}}', String(currentStage.stage.id))}
                {': '}
                {t(`stages.${currentStage.stage.key}.title`)}
              </p>
              {/* Progress bar */}
              <div className="mt-3 h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStage.percent}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[0.65rem] text-[#9a8a6a]">{currentStage.percent}%</span>
                <span className="font-cinzel text-[0.65rem] tracking-widest uppercase text-[#e8c96d]">
                  {t('learn_path.continue_btn', { defaultValue: 'Continue' })} →
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      )}

      {/* Overall progress */}
      <div className="px-4 max-w-2xl mx-auto mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cinzel text-[0.65rem] tracking-[4px] uppercase text-[#9a8a6a]">
            {t('learn_path.roadmap_title', { defaultValue: 'Learning Path' })}
          </h2>
          <span className="text-[0.6rem] text-[#9a8a6a] font-cinzel">
            {t('learn_path.overall_progress', { percent: overallPercent })}
          </span>
        </div>
      </div>

      {/* Roadmap timeline */}
      <div className="px-4 max-w-2xl mx-auto">
        {stages.map((sp, i) => (
          <StageCard key={sp.stage.id} sp={sp} index={i} />
        ))}
      </div>

      {/* Daily lesson */}
      <div className="px-4 max-w-2xl mx-auto mt-6">
        <DailyLesson />
      </div>
    </div>
  );
}
