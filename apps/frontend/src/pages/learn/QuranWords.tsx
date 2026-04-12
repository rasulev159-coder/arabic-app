import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import { useAuthStore }    from '../../store/authStore';
import { useQuranWordsStore } from '../../store/quranWordsStore';
import { QURAN_WORDS_LESSONS } from '../../data/quranWords';
import { Language } from '@arabic/shared';

export function QuranWordsPage() {
  const { t } = useTranslation('common');
  const lang = (useAuthStore((s) => s.user)?.language ?? 'uz') as Language;
  const { getStats, getWordStatus, lessonScores } = useQuranWordsStore();
  const stats = getStats();

  const progressPct = Math.round((stats.mastered / stats.total) * 100);

  const getLessonTitle = (lesson: typeof QURAN_WORDS_LESSONS[0]) => {
    if (lang === 'ru') return lesson.titleRu;
    if (lang === 'en') return lesson.titleEn;
    return lesson.titleUz;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          to="/dashboard"
          className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase
                     hover:text-gold transition-colors inline-block mb-4"
        >
          {'\u2190'} {t('nav.dashboard')}
        </Link>
        <h1 className="font-cinzel text-2xl text-[#f0e6cc] tracking-wide">
          {t('quran_words.title')}
        </h1>
        <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase mt-1">
          {t('quran_words.subtitle')}
        </p>
      </motion.div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 bg-gradient-to-br from-[#1a1508] to-[#140f05] border border-[rgba(201,168,76,0.15)]
                   rounded-2xl p-5"
      >
        <p className="font-cinzel text-sm text-[#f0e6cc] mb-3">
          {t('quran_words.words_mastered', { n: stats.mastered, total: stats.total })}
        </p>
        <div className="w-full h-3 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Three stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold text-[#4caf78]">{stats.mastered}</p>
            <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
              {'\u2705'} {t('quran_words.mastered')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#e8c96d]">{stats.learning}</p>
            <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
              {'\uD83D\uDCD6'} {t('quran_words.learning')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#9a8a6a]">{stats.newWords}</p>
            <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
              {'\uD83C\uDD95'} {t('quran_words.new_word')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lesson cards */}
      <div className="flex flex-col gap-3">
        {QURAN_WORDS_LESSONS.map((lesson, i) => {
          const masteredInLesson = lesson.words.filter(
            (w) => getWordStatus(w.id) === 'mastered'
          ).length;
          const allMastered = masteredInLesson === lesson.words.length;
          const score = lessonScores[lesson.id];

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.15 }}
            >
              <Link
                to={`/learn/quran-words/${lesson.id}`}
                className={`block rounded-2xl p-4 border transition-all hover:-translate-y-0.5
                  ${allMastered
                    ? 'bg-gradient-to-br from-[#0f1a0a] to-[#081005] border-[rgba(76,175,120,0.25)] hover:border-[rgba(76,175,120,0.45)]'
                    : 'bg-gradient-to-br from-[#1a1508] to-[#140f05] border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)]'
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Lesson number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
                    ${allMastered
                      ? 'bg-[rgba(76,175,120,0.15)] text-[#4caf78]'
                      : 'bg-[rgba(201,168,76,0.1)] text-[#e8c96d]'
                    }`}
                  >
                    {allMastered ? '\u2713' : lesson.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel text-sm text-[#f0e6cc] truncate">
                      {t('quran_words.lesson', { n: lesson.id })}
                    </p>
                    <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] truncate">
                      {getLessonTitle(lesson)}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-cinzel text-xs text-[#9a8a6a]">
                      {masteredInLesson}/{lesson.words.length}
                    </p>
                    {score && (
                      <p className="font-cinzel text-[0.5rem] text-[#706040] mt-0.5">
                        {score.bestPct}%
                      </p>
                    )}
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-3 w-full h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      allMastered ? 'bg-[#4caf78]' : 'bg-[rgba(201,168,76,0.4)]'
                    }`}
                    style={{ width: `${(masteredInLesson / lesson.words.length) * 100}%` }}
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
