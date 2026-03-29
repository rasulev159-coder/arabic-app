import { useState }          from 'react';
import { Link, useParams }   from 'react-router-dom';
import { useTranslation }    from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }      from '../store/authStore';
import { MUALLIM_SONIY, QuizQuestion } from '../data/muallimSoniy';
import { Language }           from '@arabic/shared';

export function TextbookQuizPage() {
  const { t }        = useTranslation('common');
  const { chapterId } = useParams<{ chapterId: string }>();
  const user         = useAuthStore((s) => s.user);
  const lang         = (user?.language ?? 'uz') as Language;

  const chapter = MUALLIM_SONIY.find((ch) => ch.id === chapterId);

  const [current, setCurrent]     = useState(0);
  const [score, setScore]         = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished]   = useState(false);

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

  const questions = chapter.quiz;
  const question  = questions[current] as QuizQuestion;
  const total     = questions.length;
  const progress  = ((current) / total) * 100;

  const getQuestionText = (q: QuizQuestion) =>
    lang === 'ru' ? q.questionRu : lang === 'en' ? q.questionEn : q.questionUz;

  const handleSelect = (idx: number) => {
    if (showResult) return;
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
      }
    }, 1200);
  };

  const handleRetry = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  const title = lang === 'ru' ? chapter.titleRu : lang === 'en' ? chapter.titleEn : chapter.titleUz;

  // Finished screen
  if (finished) {
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

          <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase mb-8">
            {title}
          </p>

          {/* Progress bar showing final score */}
          <div className="w-full h-2 bg-[rgba(255,255,255,0.05)] rounded-full mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / total) * 100}%` }}
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
            <Link
              to={`/textbook/${chapter.id}`}
              className="font-cinzel text-xs tracking-widest uppercase px-8 py-3
                         rounded-full border border-[rgba(201,168,76,0.2)] text-[#9a8a6a]
                         hover:text-gold hover:border-gold-dim transition-all"
            >
              {t('textbook.back_to_chapter')}
            </Link>
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

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
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
