import { useEffect }        from 'react';
import { Link, useParams }  from 'react-router-dom';
import { useTranslation }   from 'react-i18next';
import { motion }           from 'framer-motion';
import { useAuthStore }     from '../store/authStore';
import { useTextbookStore } from '../store/textbookStore';
import { MUALLIM_SONIY }    from '../data/muallimSoniy';
import { Language }          from '@arabic/shared';

export function TextbookChapterPage() {
  const { t }        = useTranslation('common');
  const { chapterId } = useParams<{ chapterId: string }>();
  const user         = useAuthStore((s) => s.user);
  const lang         = (user?.language ?? 'uz') as Language;
  const { progress, getLessonProgress } = useTextbookStore();

  // Scroll to top on chapter entry
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  const chapter = MUALLIM_SONIY.find((ch) => ch.id === chapterId);

  if (!chapter) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="font-cinzel text-[#9a8a6a]">Chapter not found</p>
        <Link to="/textbook" className="font-cinzel text-gold text-sm mt-4 inline-block">
          &larr; {t('textbook.back_to_textbook')}
        </Link>
      </div>
    );
  }

  const title = lang === 'ru' ? chapter.titleRu : lang === 'en' ? chapter.titleEn : chapter.titleUz;

  const getExplanation = (exp: { uz: string; ru: string; en: string }) =>
    lang === 'ru' ? exp.ru : lang === 'en' ? exp.en : exp.uz;

  // Calculate questions per lesson for display
  const lessonCount = chapter.lessons.length;
  const totalQ = chapter.quiz.length;
  const perLesson = Math.ceil(totalQ / lessonCount);

  // Chapter progress
  const chProgress = progress[chapter.id];
  const isPassed = !!chProgress?.completedAt;
  const bestScore = chProgress?.bestScore ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/textbook"
          className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                     hover:text-gold transition-colors"
        >
          &larr; {t('textbook.back_to_textbook')}
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl">{chapter.icon}</span>
          <div className="flex-1">
            <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase">
              {t('textbook.chapter')} {chapter.order}
            </p>
            <h1 className="font-cinzel text-xl text-[#f0e6cc] tracking-wide">
              {title}
            </h1>
          </div>
          {/* Chapter score badge */}
          {chProgress && (
            <div className={`flex-shrink-0 rounded-full px-3 py-1.5 border ${
              isPassed
                ? 'bg-[rgba(76,175,120,0.1)] border-[rgba(76,175,120,0.3)]'
                : 'bg-[rgba(201,140,50,0.1)] border-[rgba(201,140,50,0.3)]'
            }`}>
              <span className={`font-cinzel text-[0.6rem] tracking-widest ${
                isPassed ? 'text-[#4caf78]' : 'text-[#c98a32]'
              }`}>
                {t('textbook_progress.best_score', { score: bestScore })}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Chapter Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 bg-gradient-to-br from-[#201808] to-[#140f05] border border-[rgba(201,168,76,0.1)] rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-cinzel text-[0.6rem] tracking-[3px] text-[#9a8a6a] uppercase">
            {t('textbook_progress.overall')}
          </p>
          <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a]">
            {bestScore > 0 ? `${bestScore}%` : '—'}
          </p>
        </div>
        <div className="h-2.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden border border-[rgba(201,168,76,0.08)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bestScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full"
            style={{
              background: isPassed
                ? 'linear-gradient(90deg, #2d6b45 0%, #4caf78 50%, #6dd5a0 100%)'
                : bestScore > 0
                  ? 'linear-gradient(90deg, #8a5a1e 0%, #c98a32 50%, #e8b040 100%)'
                  : 'transparent',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-cinzel text-[0.5rem] tracking-widest text-[rgba(201,168,76,0.4)]">
            {isPassed
              ? `✓ ${t('textbook_progress.passed')}`
              : bestScore > 0
                ? t('textbook_progress.not_passed')
                : t('textbook_progress.new')}
          </p>
          <p className="font-cinzel text-[0.5rem] tracking-widest text-[rgba(201,168,76,0.3)]">
            {t('textbook_progress.pass_threshold')}
          </p>
        </div>
      </motion.div>

      {/* Lessons */}
      <div className="flex flex-col gap-6">
        {chapter.lessons.map((lesson, i) => {
          const lessonQCount = Math.min(perLesson, totalQ - i * perLesson);
          const lp = getLessonProgress(chapter.id, i);
          const lessonPassed = !!lp?.completedAt;
          const lessonScore = lp?.bestScore ?? 0;

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.1 }}
              className={`bg-gradient-to-br from-[#201808] to-[#140f05] rounded-2xl p-6
                         border ${lessonPassed ? 'border-[rgba(76,175,120,0.25)]' : 'border-[rgba(201,168,76,0.1)]'}`}
            >
              {/* Lesson header with number and status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border
                    ${lessonPassed
                      ? 'bg-[rgba(76,175,120,0.15)] border-[rgba(76,175,120,0.3)]'
                      : 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.15)]'}`}>
                    {lessonPassed
                      ? <span className="text-[#4caf78] text-xs">✓</span>
                      : <span className="font-cinzel text-[0.5rem] text-gold-dim font-bold">{i + 1}</span>}
                  </div>
                  <p className="font-cinzel text-[0.5rem] tracking-[3px] text-[rgba(201,168,76,0.5)] uppercase">
                    {t('textbook.lesson')} {i + 1}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {lessonScore > 0 && (
                    <span className={`font-cinzel text-[0.5rem] tracking-widest font-bold
                      ${lessonPassed ? 'text-[#4caf78]' : 'text-[#c98a32]'}`}>
                      {lessonScore}%
                    </span>
                  )}
                  {lessonQCount > 0 && !lp && (
                    <span className="font-cinzel text-[0.45rem] tracking-widest text-[rgba(201,168,76,0.3)] uppercase">
                      {lessonQCount} {lessonQCount === 1 ? 'Q' : 'Qs'}
                    </span>
                  )}
                </div>
              </div>

              {/* Arabic text */}
              <div
                dir="rtl"
                className="text-center py-4 px-2"
                style={{ fontFamily: "'Scheherazade New', serif" }}
              >
                <p className="text-4xl md:text-5xl leading-[1.8] text-gold-light">
                  {lesson.arabic}
                </p>
              </div>

              {/* Explanation */}
              <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.08)]">
                <p className="text-sm text-[#c8b88a] leading-relaxed whitespace-pre-line">
                  {getExplanation(lesson.explanation)}
                </p>
              </div>

              {/* Per-lesson quiz button */}
              {lessonQCount > 0 && (
                <div className="mt-4 pt-3 border-t border-[rgba(201,168,76,0.06)] flex items-center justify-between">
                  <span className="font-cinzel text-[0.5rem] tracking-widest text-[rgba(201,168,76,0.4)] uppercase">
                    {lessonPassed
                      ? `✓ ${t('textbook_progress.passed')} — ${lessonScore}%`
                      : t('textbook_progress.questions_count', { n: lessonQCount })}
                  </span>
                  <Link
                    to={`/textbook/${chapter.id}/quiz?lesson=${i}`}
                    className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-5 py-2
                               rounded-full border transition-all
                               ${lessonPassed
                                 ? 'border-[rgba(76,175,120,0.2)] text-[#4caf78] hover:border-[rgba(76,175,120,0.4)] hover:bg-[rgba(76,175,120,0.05)]'
                                 : 'border-[rgba(201,168,76,0.15)] text-[#9a8a6a] hover:text-gold-light hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(201,168,76,0.05)]'}`}
                  >
                    {lessonPassed ? t('textbook.retry') : t('textbook_progress.test_yourself')}
                  </Link>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Take Quiz button (full chapter) */}
      {chapter.quiz.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * chapter.lessons.length + 0.2 }}
          className="mt-8 text-center"
        >
          <Link
            to={`/textbook/${chapter.id}/quiz`}
            className="inline-block font-cinzel text-sm tracking-widest uppercase px-10 py-4
                       rounded-full border border-gold-dim text-gold-light
                       bg-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.18)]
                       hover:shadow-[0_0_25px_rgba(201,168,76,0.15)]
                       transition-all duration-200"
          >
            {t('textbook.take_quiz')}
          </Link>
        </motion.div>
      )}

      {/* Previous / Next chapter navigation */}
      {(() => {
        const currentIdx = MUALLIM_SONIY.findIndex(ch => ch.id === chapter.id);
        const prevChapter = currentIdx > 0 ? MUALLIM_SONIY[currentIdx - 1] : null;
        const nextChapter = currentIdx < MUALLIM_SONIY.length - 1 ? MUALLIM_SONIY[currentIdx + 1] : null;
        const getTitle = (ch: typeof MUALLIM_SONIY[0]) =>
          lang === 'ru' ? ch.titleRu : lang === 'en' ? ch.titleEn : ch.titleUz;

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 pt-6 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-between gap-4"
          >
            {prevChapter ? (
              <Link
                to={`/textbook/${prevChapter.id}`}
                className="flex-1 flex flex-col items-start gap-1 p-4 rounded-2xl border border-[rgba(201,168,76,0.1)]
                           bg-[rgba(255,255,255,0.02)] hover:border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.03)] transition-all"
              >
                <span className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
                  {t('textbook_nav.prev_chapter')}
                </span>
                <span className="font-cinzel text-xs text-[#f0e6cc] truncate max-w-full">
                  {prevChapter.icon} {getTitle(prevChapter)}
                </span>
              </Link>
            ) : <div className="flex-1" />}

            {nextChapter ? (
              <Link
                to={`/textbook/${nextChapter.id}`}
                className="flex-1 flex flex-col items-end gap-1 p-4 rounded-2xl border border-[rgba(201,168,76,0.1)]
                           bg-[rgba(255,255,255,0.02)] hover:border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.03)] transition-all"
              >
                <span className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
                  {t('textbook_nav.next_chapter')}
                </span>
                <span className="font-cinzel text-xs text-[#f0e6cc] truncate max-w-full">
                  {getTitle(nextChapter)} {nextChapter.icon}
                </span>
              </Link>
            ) : <div className="flex-1" />}
          </motion.div>
        );
      })()}
    </div>
  );
}
