import { useState, useMemo }  from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation }    from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }      from '../store/authStore';
import { useTextbookStore }  from '../store/textbookStore';
import { MUALLIM_SONIY, QuizQuestion } from '../data/muallimSoniy';
import { Language }           from '@arabic/shared';

type Phase = 'select' | 'quiz' | 'result';

export function TextbookQuizPage() {
  const { t }        = useTranslation('common');
  const { chapterId } = useParams<{ chapterId: string }>();
  const [searchParams] = useSearchParams();
  const user         = useAuthStore((s) => s.user);
  const lang         = (user?.language ?? 'uz') as Language;
  const { saveQuizResult } = useTextbookStore();

  const chapter = MUALLIM_SONIY.find((ch) => ch.id === chapterId);

  // Parse ?lesson=X from URL (for direct links from chapter page)
  const lessonParam = searchParams.get('lesson');

  // Split questions into lesson chunks
  const lessonChunks = useMemo(() => {
    if (!chapter) return [];
    const lessonCount = chapter.lessons.length;
    const totalQ = chapter.quiz.length;
    const perLesson = Math.ceil(totalQ / lessonCount);
    const chunks: QuizQuestion[][] = [];
    for (let i = 0; i < lessonCount; i++) {
      chunks.push(chapter.quiz.slice(i * perLesson, (i + 1) * perLesson));
    }
    return chunks;
  }, [chapter]);

  // Determine initial phase based on URL params
  const initialLesson = lessonParam !== null ? parseInt(lessonParam, 10) : null;
  const [phase, setPhase]           = useState<Phase>(initialLesson !== null ? 'quiz' : 'select');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(initialLesson);
  const [current, setCurrent]       = useState(0);
  const [score, setScore]           = useState(0);
  const [selected, setSelected]     = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished]     = useState(false);

  if (!chapter || chapter.quiz.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="font-cinzel text-[#9a8a6a]">Quiz not found</p>
        <Link to="/textbook" className="font-cinzel text-gold text-sm mt-4 inline-block">
          &larr; {t('textbook.back_to_textbook')}
        </Link>
      </div>
    );
  }

  // Get the active question set
  const questions = selectedLesson !== null ? (lessonChunks[selectedLesson] ?? []) : chapter.quiz;
  const question  = questions[current] as QuizQuestion | undefined;
  const total     = questions.length;
  const progress  = total > 0 ? ((current) / total) * 100 : 0;

  const getQuestionText = (q: QuizQuestion) =>
    lang === 'ru' ? q.questionRu : lang === 'en' ? q.questionEn : q.questionUz;

  const title = lang === 'ru' ? chapter.titleRu : lang === 'en' ? chapter.titleEn : chapter.titleUz;

  const handleSelectLesson = (lessonIdx: number | null) => {
    setSelectedLesson(lessonIdx);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setPhase('quiz');
  };

  const handleSelect = (idx: number) => {
    if (showResult || !question) return;
    setSelected(idx);
    setShowResult(true);

    const isCorrect = question.options?.[idx]?.isCorrect ?? false;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (current + 1 < total) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        setFinished(true);
        setPhase('result');
        // Save progress
        const finalScore = score + (isCorrect ? 1 : 0);
        if (selectedLesson === null) {
          // Full chapter quiz
          saveQuizResult(chapter.id, total, finalScore);
        }
      }
    }, 1200);
  };

  const handleRetry = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setPhase('quiz');
  };

  const handleBackToSelect = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    setSelectedLesson(null);
    setPhase('select');
  };

  // PHASE: Lesson selector
  if (phase === 'select') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to={`/textbook/${chapter.id}`}
            className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                       hover:text-gold transition-colors"
          >
            &larr; {t('textbook.back_to_chapter')}
          </Link>
          <h1 className="font-cinzel text-lg text-[#f0e6cc] mt-2 tracking-wide">
            {t('textbook.chapter')} {chapter.order} &mdash; {t('textbook.take_quiz')}
          </h1>
          <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase mt-1">
            {title}
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {/* Per-lesson quiz buttons */}
          {chapter.lessons.map((lesson, i) => {
            const chunk = lessonChunks[i] ?? [];
            const previewArabic = lesson.arabic.split('\n')[0]?.slice(0, 30) ?? '';
            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                onClick={() => handleSelectLesson(i)}
                className="w-full text-left bg-gradient-to-br from-[#201808] to-[#140f05]
                           border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)]
                           rounded-2xl p-4 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel text-[0.5rem] tracking-[3px] text-[#9a8a6a] uppercase">
                      {t('textbook_progress.lesson_quiz', { n: i + 1 })}
                    </p>
                    <p
                      dir="rtl"
                      className="text-lg text-gold-light mt-1 truncate"
                      style={{ fontFamily: "'Scheherazade New', serif" }}
                    >
                      {previewArabic}
                    </p>
                    <p className="font-cinzel text-[0.5rem] tracking-widest text-[rgba(201,168,76,0.4)] uppercase mt-1">
                      {t('textbook_progress.questions_count', { n: chunk.length })}
                    </p>
                  </div>
                  <span className="font-cinzel text-gold-light text-lg opacity-40 group-hover:opacity-100
                                   group-hover:translate-x-1 transition-all ml-3 flex-shrink-0">
                    &rarr;
                  </span>
                </div>
              </motion.button>
            );
          })}

          {/* All questions button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * chapter.lessons.length + 0.05 }}
            onClick={() => handleSelectLesson(null)}
            className="w-full text-center font-cinzel text-sm tracking-widest uppercase
                       px-8 py-4 mt-2 rounded-full border border-gold-dim text-gold-light
                       bg-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.18)]
                       hover:shadow-[0_0_25px_rgba(201,168,76,0.15)]
                       transition-all duration-200"
          >
            {t('textbook_progress.all_questions')} ({chapter.quiz.length})
          </motion.button>
        </div>
      </div>
    );
  }

  // PHASE: Result screen
  if (phase === 'result' && finished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= 70;

    return (
      <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#201808] to-[#140f05]
                     border border-[rgba(201,168,76,0.2)] rounded-3xl p-8 text-center"
        >
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-4"
          >
            {score >= total * 0.8 ? '\u{1F3C6}' : score >= total * 0.5 ? '\u{1F44F}' : '\u{1F4AA}'}
          </motion.p>

          <h2 className="font-cinzel text-xl text-[#f0e6cc] tracking-wide mb-2">
            {t('textbook.quiz_complete')}
          </h2>

          <p className="font-cinzel text-sm text-gold-light mb-1">
            {t('textbook.score', { score, total })}
          </p>

          {selectedLesson !== null && (
            <p className="font-cinzel text-[0.6rem] tracking-widest text-[#c8b88a] mb-1">
              {t('textbook_progress.lesson_quiz', { n: selectedLesson + 1 })}
            </p>
          )}

          <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase mb-2">
            {title}
          </p>

          {/* Pass/fail status */}
          <div className={`inline-block rounded-full px-4 py-1.5 mb-6 ${
            passed
              ? 'bg-[rgba(76,175,120,0.1)] border border-[rgba(76,175,120,0.3)]'
              : 'bg-[rgba(201,140,50,0.1)] border border-[rgba(201,140,50,0.3)]'
          }`}>
            <span className={`font-cinzel text-[0.6rem] tracking-widest uppercase ${
              passed ? 'text-[#4caf78]' : 'text-[#c98a32]'
            }`}>
              {passed ? t('textbook_progress.passed') : t('textbook_progress.not_passed')}
              {' '}&mdash;{' '}{pct}%
            </span>
          </div>

          {!passed && (
            <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] mb-6">
              {t('textbook_progress.pass_threshold')}
            </p>
          )}

          {/* Progress bar showing final score */}
          <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`h-full rounded-full ${
                score >= total * 0.8
                  ? 'bg-[#4caf78]'
                  : score >= total * 0.5
                  ? 'bg-gold'
                  : 'bg-[#c95050]'
              }`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBackToSelect}
              className="font-cinzel text-xs tracking-widest uppercase px-8 py-3
                         rounded-full border border-[rgba(201,168,76,0.2)] text-[#9a8a6a]
                         hover:text-gold hover:border-gold-dim transition-all"
            >
              {t('textbook.back_to_chapter')}
            </button>
            <button
              onClick={handleRetry}
              className="font-cinzel text-xs tracking-widest uppercase px-8 py-3
                         rounded-full border border-gold-dim text-gold-light
                         bg-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.18)]
                         transition-all"
            >
              {t('textbook.retry')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // PHASE: Quiz (active)
  if (!question) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={handleBackToSelect}
          className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                     hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
        >
          &larr; {t('textbook.back_to_chapter')}
        </button>
        <h1 className="font-cinzel text-lg text-[#f0e6cc] mt-2 tracking-wide">
          {t('textbook.chapter')} {chapter.order}
          {selectedLesson !== null && (
            <span className="text-[#9a8a6a] text-sm">
              {' '}&mdash; {t('textbook_progress.lesson_quiz', { n: selectedLesson + 1 })}
            </span>
          )}
        </h1>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question counter */}
      <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase text-center mb-6">
        {current + 1} / {total}
      </p>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-gradient-to-br from-[#201808] to-[#140f05]
                     border border-[rgba(201,168,76,0.1)] rounded-2xl p-6"
        >
          {/* Arabic text if present */}
          {question.arabic && (
            <div
              dir="rtl"
              className="text-center py-3 mb-4"
              style={{ fontFamily: "'Scheherazade New', serif" }}
            >
              <p className="text-4xl md:text-5xl leading-[1.8] text-gold-light">
                {question.arabic}
              </p>
            </div>
          )}

          {/* Question text */}
          <p className="font-cinzel text-sm text-[#f0e6cc] text-center mb-6 leading-relaxed">
            {getQuestionText(question)}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options?.map((option, idx) => {
              let borderColor = 'border-[rgba(201,168,76,0.1)]';
              let bgColor     = 'bg-[rgba(201,168,76,0.03)]';
              let textColor   = 'text-[#c8b88a]';

              if (showResult && selected === idx) {
                if (option.isCorrect) {
                  borderColor = 'border-[rgba(76,175,120,0.5)]';
                  bgColor     = 'bg-[rgba(76,175,120,0.1)]';
                  textColor   = 'text-[#4caf78]';
                } else {
                  borderColor = 'border-[rgba(201,80,80,0.5)]';
                  bgColor     = 'bg-[rgba(201,80,80,0.1)]';
                  textColor   = 'text-[#c95050]';
                }
              } else if (showResult && option.isCorrect) {
                borderColor = 'border-[rgba(76,175,120,0.3)]';
                bgColor     = 'bg-[rgba(76,175,120,0.05)]';
                textColor   = 'text-[#4caf78]';
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  whileTap={!showResult ? { scale: 0.98 } : undefined}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border
                              ${borderColor} ${bgColor} ${textColor}
                              font-cinzel text-sm tracking-wide
                              hover:border-[rgba(201,168,76,0.3)] transition-all
                              disabled:cursor-default`}
                >
                  <span className="mr-3 text-[#9a8a6a] text-xs">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option.text}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
