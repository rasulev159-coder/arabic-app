import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { XpPopup } from '../../components/ui/XpPopup';
import { Spinner } from '../../lib/utils';
import { api } from '../../lib/api';
import { DailyLessonDto, WeaknessDto, StudyMode } from '@arabic/shared';

const MODE_ICONS: Record<string, string> = {
  flashcard: '\ud83d\udcc7', quiz: '\ud83c\udfaf', speed: '\u26a1',
  lightning: '\ud83c\udf29\ufe0f', memory: '\ud83e\udde0', listen: '\ud83d\udd0a',
  find: '\ud83d\udd0d', write: '\u270d\ufe0f',
};

const MODE_ROUTES: Record<string, string> = {
  flashcard: '/learn/flashcards', quiz: '/learn/quiz', speed: '/learn/speed',
  lightning: '/learn/lightning', memory: '/learn/memory', listen: '/learn/listen',
  find: '/learn/find', write: '/learn/write',
};

interface SessionStep {
  mode: string;
  label: string;
  route: string;
  icon: string;
  completed: boolean;
}

export function SessionFlowPage() {
  const { t } = useTranslation(['learn', 'common']);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [steps, setSteps] = useState<SessionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'overview' | 'step' | 'summary'>('loading');

  const { data: daily } = useQuery<DailyLessonDto>({
    queryKey: ['daily-lesson'],
    queryFn: async () => (await api.get('/daily')).data.data,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const { data: weakness } = useQuery<WeaknessDto[]>({
    queryKey: ['weakness'],
    queryFn: async () => (await api.get('/weakness')).data.data,
    staleTime: 30_000,
    retry: 1,
  });

  useEffect(() => {
    const sessionSteps: SessionStep[] = [];

    // Add daily modes
    if (daily?.modes) {
      daily.modes.forEach((mode) => {
        sessionSteps.push({
          mode,
          label: t(`learn:modes.${mode as StudyMode}`),
          route: MODE_ROUTES[mode] || '/learn/quiz',
          icon: MODE_ICONS[mode] || '\ud83d\udcda',
          completed: false,
        });
      });
    }

    // Add weakness training if there are weak letters
    if (weakness && weakness.length > 0) {
      const hasWeakness = weakness.some((w) => w.accuracy < 70);
      if (hasWeakness && sessionSteps.length < 3) {
        sessionSteps.push({
          mode: 'weakness',
          label: t('common:weakness.title'),
          route: '/learn/weakness',
          icon: '\ud83c\udfaf',
          completed: false,
        });
      }
    }

    // Fallback if no steps
    if (sessionSteps.length === 0) {
      sessionSteps.push(
        { mode: 'flashcard', label: t('learn:modes.flashcard'), route: '/learn/flashcards', icon: '\ud83d\udcc7', completed: false },
        { mode: 'quiz', label: t('learn:modes.quiz'), route: '/learn/quiz', icon: '\ud83c\udfaf', completed: false },
        { mode: 'speed', label: t('learn:modes.speed'), route: '/learn/speed', icon: '\u26a1', completed: false },
      );
    }

    setSteps(sessionSteps);
    setPhase('overview');
  }, [daily, weakness, t]);

  const markStepComplete = () => {
    const xpGain = 10 + Math.floor(Math.random() * 10);
    setTotalXp((x) => x + xpGain);
    setShowXp(true);
    setTimeout(() => setShowXp(false), 1500);

    setSteps((prev) =>
      prev.map((s, i) => (i === currentStep ? { ...s, completed: true } : s)),
    );

    if (currentStep + 1 >= steps.length) {
      setPhase('summary');
    } else {
      setCurrentStep((c) => c + 1);
      setPhase('overview');
    }
  };

  if (phase === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  // OVERVIEW screen
  if (phase === 'overview') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8">
        <XpPopup xp={totalXp} visible={showXp} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-cinzel text-[0.65rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-2">
            {t('common:session.title')}
          </p>
          <h1 className="font-cinzel text-xl text-[#f0e6cc] text-center mb-8">
            {t('common:session.subtitle')}
          </h1>

          {/* Steps */}
          <div className="flex flex-col gap-3 mb-8">
            {steps.map((step, i) => {
              const isCurrent = i === currentStep;
              const isPast = step.completed;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all
                    ${isCurrent
                      ? 'border-gold-dim bg-gradient-to-br from-[#201808] to-[#140f05] shadow-[0_0_20px_rgba(201,168,76,0.1)]'
                      : isPast
                      ? 'border-[rgba(76,175,120,0.2)] bg-[rgba(76,175,120,0.05)]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] opacity-50'}`}
                >
                  {/* Step number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${isPast
                      ? 'bg-[rgba(76,175,120,0.15)] border border-[rgba(76,175,120,0.3)]'
                      : isCurrent
                      ? 'bg-[rgba(201,168,76,0.12)] border border-gold-dim'
                      : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]'}`}>
                    {isPast ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                           stroke="#4caf78" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className={`font-cinzel text-sm font-bold
                        ${isCurrent ? 'text-gold-light' : 'text-[#9a8a6a]'}`}>
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{step.icon}</span>
                      <p className={`font-cinzel text-sm tracking-wide
                        ${isCurrent ? 'text-[#f0e6cc]' : isPast ? 'text-[#4caf78]' : 'text-[#9a8a6a]'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  {isCurrent && (
                    <Link to={step.route}>
                      <Button size="sm">
                        {t('common:start')}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="text-center">
            <p className="font-cinzel text-xs text-[#9a8a6a] tracking-widest uppercase">
              {t('common:session.step', { current: currentStep + 1, total: steps.length })}
            </p>
          </div>

          {/* Skip / complete current step manually */}
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={markStepComplete}>
              {t('common:session.mark_done')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPhase('summary')}>
              {t('common:session.end_session')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // SUMMARY screen
  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8 text-center">
      <XpPopup xp={totalXp} visible={showXp} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.p
          className="font-scheherazade text-6xl text-gold"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {'\u2728'}
        </motion.p>

        <h1 className="font-cinzel text-2xl text-[#f0e6cc]">
          {t('common:session.complete')}
        </h1>

        <div className="flex gap-6">
          <div className="text-center">
            <p className="font-cinzel text-3xl font-bold text-gold-light">{totalXp}</p>
            <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">XP</p>
          </div>
          <div className="text-center">
            <p className="font-cinzel text-3xl font-bold text-gold-light">
              {steps.filter((s) => s.completed).length}
            </p>
            <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
              {t('common:session.modes_done')}
            </p>
          </div>
        </div>

        {/* Completed steps */}
        <div className="flex flex-wrap gap-2 justify-center">
          {steps.map((step, i) => (
            <span
              key={i}
              className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-3 py-1.5 rounded-full border
                ${step.completed
                  ? 'border-[rgba(76,175,120,0.3)] text-[#4caf78] bg-[rgba(76,175,120,0.05)]'
                  : 'border-[rgba(255,255,255,0.08)] text-[#9a8a6a]'}`}
            >
              {step.icon} {step.label}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Link to="/learn">
            <Button size="lg">{t('common:nav.dashboard')}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
