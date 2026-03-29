import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { DailyLessonDto, StudyMode } from '@arabic/shared';
import { Spinner } from '../../lib/utils';

const MODE_ICONS: Record<string, string> = {
  flashcard: '\ud83d\udcc7',
  quiz: '\ud83c\udfaf',
  speed: '\u26a1',
  lightning: '\ud83c\udf29\ufe0f',
  memory: '\ud83e\udde0',
  listen: '\ud83d\udd0a',
  find: '\ud83d\udd0d',
  write: '\u270d\ufe0f',
};

const MODE_ROUTES: Record<string, string> = {
  flashcard: '/learn/flashcards',
  quiz: '/learn/quiz',
  speed: '/learn/speed',
  lightning: '/learn/lightning',
  memory: '/learn/memory',
  listen: '/learn/listen',
  find: '/learn/find',
  write: '/learn/write',
};

export function DailyLesson() {
  const { t } = useTranslation(['common', 'learn']);

  const { data: daily, isLoading, isError } = useQuery<DailyLessonDto>({
    queryKey: ['daily-lesson'],
    queryFn: async () => (await api.get('/daily')).data.data,
    staleTime: 5 * 60_000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                      rounded-3xl p-8 flex items-center justify-center min-h-[160px]">
        <Spinner />
      </div>
    );
  }

  if (isError || !daily) return null;

  const isCompleted = daily.completed;
  const firstModeRoute = daily.modes[0] ? MODE_ROUTES[daily.modes[0]] : '/learn/quiz';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#201808] to-[#140f05]
                 border border-[#3a2d10] rounded-3xl p-6"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10
                      bg-gradient-radial from-gold to-transparent pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)' }} />

      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-cinzel text-xs tracking-[3px] text-[#9a8a6a] uppercase">
          {t('common:daily.title')}
        </p>
        {isCompleted && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[#4caf78] font-cinzel text-xs tracking-widest uppercase flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('common:daily.completed')}
          </motion.span>
        )}
      </div>

      {/* Mode icons */}
      <div className="flex gap-3 mb-5">
        {daily.modes.map((mode, i) => (
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border
              ${isCompleted
                ? 'border-[rgba(76,175,120,0.2)] bg-[rgba(76,175,120,0.05)]'
                : 'border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)]'}`}
          >
            <span className="text-2xl">{MODE_ICONS[mode] || '\ud83d\udcda'}</span>
            <span className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
              {t(`learn:modes.${mode as StudyMode}`)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA or Completed state */}
      {isCompleted ? (
        <div className="flex items-center gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-cinzel text-sm text-gold-light tracking-wide"
          >
            {t('common:daily.xp_earned', { xp: daily.xpEarned })}
          </motion.p>
        </div>
      ) : (
        <Link to={firstModeRoute}>
          <Button size="lg" className="w-full">
            {daily.score > 0
              ? t('common:daily.continue')
              : t('common:daily.start')
            }
          </Button>
        </Link>
      )}
    </motion.div>
  );
}
