import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }    from '../../store/authStore';
import { useQuranWordsStore } from '../../store/quranWordsStore';
import { QURAN_WORDS_LESSONS, QuranWord } from '../../data/quranWords';
import { Language } from '@arabic/shared';

function getTranslation(word: QuranWord, lang: Language) {
  if (lang === 'ru') return word.meaningRu;
  if (lang === 'en') return word.meaningEn;
  return word.meaningUz;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDistractors(
  correctWord: QuranWord,
  lessonWords: QuranWord[],
  allLessons: typeof QURAN_WORDS_LESSONS,
  currentLessonId: number,
  count: number
): QuranWord[] {
  // Get words from same lesson (excluding correct)
  const sameLessonPool = lessonWords.filter((w) => w.id !== correctWord.id);

  // Get words from nearby lessons
  const nearbyIds = [currentLessonId - 1, currentLessonId + 1, currentLessonId - 2, currentLessonId + 2];
  const nearbyPool: QuranWord[] = [];
  for (const id of nearbyIds) {
    const l = allLessons.find((ls) => ls.id === id);
    if (l) nearbyPool.push(...l.words);
  }

  const pool = shuffle([...sameLessonPool, ...nearbyPool]);
  const seen = new Set<number>([correctWord.id]);
  const result: QuranWord[] = [];

  for (const w of pool) {
    if (!seen.has(w.id)) {
      seen.add(w.id);
      result.push(w);
      if (result.length >= count) break;
    }
  }

  return result;
}

interface Question {
  word: QuranWord;
  type: 'arabic_to_translation' | 'translation_to_arabic';
  options: { label: string; isCorrect: boolean; wordId: number }[];
}

export function QuranWordsQuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const lang = (useAuthStore((s) => s.user)?.language ?? 'uz') as Language;
  const { recordAnswer, saveLessonScore, getWordStatus } = useQuranWordsStore();

  const lesson = QURAN_WORDS_LESSONS.find((l) => l.id === Number(lessonId));

  const questions = useMemo<Question[]>(() => {
    if (!lesson) return [];
    const shuffledWords = shuffle(lesson.words);

    return shuffledWords.map((word, i) => {
      const type = i % 2 === 0 ? 'arabic_to_translation' : 'translation_to_arabic';
      const distractors = getDistractors(word, lesson.words, QURAN_WORDS_LESSONS, lesson.id, 3);

      let options: Question['options'];
      if (type === 'arabic_to_translation') {
        options = shuffle([
          { label: getTranslation(word, lang), isCorrect: true, wordId: word.id },
          ...distractors.map((d) => ({ label: getTranslation(d, lang), isCorrect: false, wordId: d.id })),
        ]);
      } else {
        options = shuffle([
          { label: word.arabic, isCorrect: true, wordId: word.id },
          ...distractors.map((d) => ({ label: d.arabic, isCorrect: false, wordId: d.id })),
        ]);
      }

      return { word, type, options };
    });
  }, [lesson, lang]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [masteredThisQuiz, setMasteredThisQuiz] = useState<number[]>([]);

  const question = questions[currentIdx];

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (selected !== null || !question) return;
      setSelected(optIdx);
      const isCorrect = question.options[optIdx].isCorrect;

      recordAnswer(question.word.id, isCorrect);

      if (isCorrect) {
        setScore((s) => s + 1);
        setFeedback('correct');
        // Check if this word just became mastered
        const newStatus = useQuranWordsStore.getState().getWordStatus(question.word.id);
        if (newStatus === 'mastered') {
          setMasteredThisQuiz((prev) => [...prev, question.word.id]);
        }
      } else {
        setFeedback('wrong');
      }

      // Auto-advance after delay
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx((i) => i + 1);
          setSelected(null);
          setFeedback(null);
        } else {
          // Quiz complete
          const finalScore = isCorrect ? score + 1 : score;
          if (lesson) {
            saveLessonScore(lesson.id, finalScore, questions.length);
          }
          setShowResult(true);
        }
      }, 1200);
    },
    [selected, question, currentIdx, questions.length, score, recordAnswer, saveLessonScore, lesson]
  );

  // Timer bar animation per question
  const [timerKey, setTimerKey] = useState(0);
  useEffect(() => {
    setTimerKey((k) => k + 1);
  }, [currentIdx]);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="font-cinzel text-[#9a8a6a]">Lesson not found</p>
        <Link to="/learn/quran-words" className="font-cinzel text-xs text-gold-light mt-4 inline-block">
          {'\u2190'} Back
        </Link>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const nextLessonId = lesson.id + 1;
    const hasNextLesson = QURAN_WORDS_LESSONS.some((l) => l.id === nextLessonId);

    return (
      <div className="max-w-md mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#1a1508] to-[#140f05] border border-[rgba(201,168,76,0.2)]
                     rounded-3xl p-8 text-center"
        >
          <p className="text-5xl mb-4">{pct >= 70 ? '\uD83C\uDF89' : '\uD83D\uDCAA'}</p>
          <h2 className="font-cinzel text-2xl text-[#f0e6cc] mb-2">
            {t('textbook.quiz_complete')}
          </h2>
          <p className="font-cinzel text-lg text-gold-light mb-6">
            {score} / {questions.length} ({pct}%)
          </p>

          {/* Mastered words */}
          {masteredThisQuiz.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-[rgba(76,175,120,0.08)] border border-[rgba(76,175,120,0.15)]">
              <p className="font-cinzel text-xs text-[#4caf78] tracking-widest uppercase mb-2">
                {t('quran_words.word_mastered')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {masteredThisQuiz.map((wId) => {
                  const w = lesson.words.find((x) => x.id === wId);
                  return w ? (
                    <span
                      key={wId}
                      className="px-3 py-1 rounded-full bg-[rgba(76,175,120,0.12)] text-[#4caf78]
                                 text-sm"
                      style={{ fontFamily: "'Scheherazade New', serif" }}
                    >
                      {w.arabic}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              to={`/learn/quran-words/${lesson.id}`}
              className="font-cinzel text-xs tracking-widest uppercase px-6 py-3 rounded-full
                         border border-gold-dim text-gold-light bg-[rgba(201,168,76,0.08)]
                         hover:bg-[rgba(201,168,76,0.15)] transition-all"
            >
              {'\u2190'} {t('quran_words.lesson', { n: lesson.id })}
            </Link>

            {hasNextLesson && (
              <Link
                to={`/learn/quran-words/${nextLessonId}`}
                className="font-cinzel text-xs tracking-widest uppercase px-6 py-3 rounded-full
                           border border-[rgba(76,175,120,0.3)] text-[#4caf78]
                           bg-[rgba(76,175,120,0.08)] hover:bg-[rgba(76,175,120,0.15)] transition-all"
              >
                {t('quran_words.next_lesson')} {'\u2192'}
              </Link>
            )}

            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelected(null);
                setScore(0);
                setShowResult(false);
                setFeedback(null);
                setMasteredThisQuiz([]);
              }}
              className="font-cinzel text-xs tracking-widest uppercase px-6 py-3 rounded-full
                         border border-[rgba(255,255,255,0.08)] text-[#9a8a6a]
                         hover:text-[#f0e6cc] transition-all"
            >
              {t('restart')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!question) return null;

  const progressPct = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/learn/quran-words/${lesson.id}`}
          className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase
                     hover:text-gold transition-colors inline-block mb-4"
        >
          {'\u2190'} {t('quran_words.lesson', { n: lesson.id })}
        </Link>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="font-cinzel text-[0.55rem] tracking-widest text-[#706040] text-right">
          {currentIdx + 1} / {questions.length}
        </p>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden mb-6">
        <motion.div
          key={timerKey}
          className="h-full rounded-full bg-[rgba(201,168,76,0.3)]"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 15, ease: 'linear' }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {/* Prompt */}
          <div className="text-center mb-8">
            <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase mb-4">
              {question.type === 'arabic_to_translation'
                ? t('quran_words.pick_translation')
                : t('quran_words.pick_arabic')}
            </p>
            <p
              className={`${
                question.type === 'arabic_to_translation'
                  ? 'text-4xl text-gold-light leading-relaxed'
                  : 'font-cinzel text-xl text-[#f0e6cc]'
              }`}
              style={
                question.type === 'arabic_to_translation'
                  ? { fontFamily: "'Scheherazade New', serif", direction: 'rtl' }
                  : undefined
              }
            >
              {question.type === 'arabic_to_translation'
                ? question.word.arabic
                : getTranslation(question.word, lang)}
            </p>
            {question.type === 'arabic_to_translation' && (
              <p className="font-cinzel text-xs text-[#706040] mt-2">
                {question.word.transliteration}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options.map((opt, i) => {
              let borderColor = 'border-[rgba(201,168,76,0.1)]';
              let bgColor = 'bg-gradient-to-br from-[#1a1508] to-[#140f05]';

              if (selected !== null) {
                if (opt.isCorrect) {
                  borderColor = 'border-[rgba(76,175,120,0.5)]';
                  bgColor = 'bg-gradient-to-br from-[#0f1a0a] to-[#081005]';
                } else if (i === selected && !opt.isCorrect) {
                  borderColor = 'border-[rgba(201,80,80,0.5)]';
                  bgColor = 'bg-gradient-to-br from-[#1a0808] to-[#140505]';
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  whileTap={selected === null ? { scale: 0.98 } : undefined}
                  className={`w-full text-left p-4 rounded-2xl border transition-all
                    ${borderColor} ${bgColor}
                    ${selected === null ? 'hover:border-[rgba(201,168,76,0.3)] active:scale-[0.98]' : ''}
                    disabled:cursor-default`}
                >
                  <p
                    className={`${
                      question.type === 'translation_to_arabic'
                        ? 'text-2xl text-gold-light'
                        : 'font-cinzel text-sm text-[#f0e6cc]'
                    }`}
                    style={
                      question.type === 'translation_to_arabic'
                        ? { fontFamily: "'Scheherazade New', serif", direction: 'rtl' }
                        : undefined
                    }
                  >
                    {opt.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full
              font-cinzel text-sm tracking-widest uppercase z-50
              ${feedback === 'correct'
                ? 'bg-[rgba(76,175,120,0.2)] border border-[rgba(76,175,120,0.4)] text-[#4caf78]'
                : 'bg-[rgba(201,80,80,0.2)] border border-[rgba(201,80,80,0.4)] text-[#c95050]'
              }`}
          >
            {feedback === 'correct' ? '\u2713 Correct!' : '\u2717 Wrong'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
