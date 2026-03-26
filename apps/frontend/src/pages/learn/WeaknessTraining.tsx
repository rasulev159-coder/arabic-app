import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useSaveSession } from '../../hooks/useProgress';
import { Button } from '../../components/ui/Button';
import { SuccessAnimation } from '../../components/ui/SuccessAnimation';
import { ErrorAnimation } from '../../components/ui/ErrorAnimation';
import { Spinner } from '../../lib/utils';
import { api } from '../../lib/api';
import {
  LETTERS, ArabicLetter, getLetterName,
  WeaknessDto, Language,
} from '@arabic/shared';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: ArabicLetter, count = 4): ArabicLetter[] {
  const others = shuffle(LETTERS.filter((l) => l.code !== correct.code)).slice(0, count - 1);
  return shuffle([correct, ...others]);
}

export function WeaknessTrainingPage() {
  const { t } = useTranslation(['learn', 'common']);
  const lang = (useAuthStore((s) => s.user?.language) ?? 'uz') as Language;
  const user = useAuthStore((s) => s.user);
  const { mutate: saveSession } = useSaveSession();

  const [phase, setPhase] = useState<'loading' | 'start' | 'session' | 'result'>('loading');
  const [weakLetters, setWeakLetters] = useState<(ArabicLetter & { accuracy: number })[]>([]);
  const [queue, setQueue] = useState<ArabicLetter[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<ArabicLetter[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);
  const startRef = useRef(Date.now());

  const { data: weaknessData, isLoading } = useQuery<WeaknessDto[]>({
    queryKey: ['weakness'],
    queryFn: async () => (await api.get('/weakness')).data.data,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!weaknessData) return;
    const weak = weaknessData
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    const letters = weak
      .map((w) => {
        const letter = LETTERS.find((l) => l.code === w.letterCode);
        return letter ? { ...letter, accuracy: w.accuracy } : null;
      })
      .filter(Boolean) as (ArabicLetter & { accuracy: number })[];

    setWeakLetters(letters);
    setPhase(letters.length > 0 ? 'start' : 'start');
  }, [weaknessData]);

  const startSession = () => {
    if (weakLetters.length === 0) return;
    // Create a queue: repeat each weak letter 2-3 times
    const q = shuffle([...weakLetters, ...weakLetters.slice(0, Math.min(5, weakLetters.length))]);
    setQueue(q);
    setCurrentIdx(0);
    setScore(0);
    setResults([]);
    setSelected(null);
    setIsCorrect(null);
    setOptions(makeOptions(q[0]));
    startRef.current = Date.now();
    setPhase('session');
  };

  const current = queue[currentIdx];

  const handleAnswer = (letter: ArabicLetter) => {
    if (selected) return;
    const correct = letter.code === current.code;
    setSelected(letter.code);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setResults((r) => [...r, { letterCode: current.code, correct }]);

    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      if (nextIdx >= queue.length) {
        const dur = Math.round((Date.now() - startRef.current) / 1000);
        saveSession({
          mode: 'quiz',
          score: score + (correct ? 1 : 0),
          totalQ: queue.length,
          durationSec: dur,
          letterResults: [...results, { letterCode: current.code, correct }],
        });
        setPhase('result');
      } else {
        setCurrentIdx(nextIdx);
        setOptions(makeOptions(queue[nextIdx]));
        setSelected(null);
        setIsCorrect(null);
      }
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size={40} />
      </div>
    );
  }

  // START screen
  if (phase === 'start' || phase === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-cinzel text-[0.65rem] tracking-[4px] text-[#9a8a6a] uppercase mb-2">
            {t('common:weakness.title')}
          </p>
          <h1 className="font-cinzel text-xl text-[#f0e6cc] mb-6">
            {t('common:weakness.subtitle')}
          </h1>

          {weakLetters.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-scheherazade text-5xl text-gold mb-4">{'\u2728'}</p>
              <p className="font-cinzel text-sm text-[#f0e6cc] mb-2">
                {t('common:weakness.no_weakness')}
              </p>
              <p className="font-cinzel text-xs text-[#9a8a6a] mb-6">
                {t('common:weakness.no_weakness_hint')}
              </p>
              <Link to="/dashboard">
                <Button>{t('common:nav.dashboard')}</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Weak letters grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {weakLetters.map((letter, i) => (
                  <motion.div
                    key={letter.code}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl
                               bg-gradient-to-br from-[#201808] to-[#140f05]
                               border border-[rgba(201,80,80,0.2)]"
                  >
                    <span className="font-scheherazade text-2xl text-gold-light">{letter.code}</span>
                    <span className="font-cinzel text-[0.5rem] text-[#9a8a6a]">{getLetterName(letter, lang)}</span>
                    <span className={`font-cinzel text-[0.5rem] font-bold
                      ${letter.accuracy < 50 ? 'text-[#c95050]' : 'text-[#9a8a6a]'}`}>
                      {Math.round(letter.accuracy)}%
                    </span>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" onClick={startSession} className="w-full">
                {t('common:weakness.start_training')}
              </Button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // SESSION screen
  if (phase === 'session' && current) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">
            {currentIdx + 1} / {queue.length}
          </p>
          <p className="font-cinzel text-xs text-gold-light">
            {t('learn:result.score', { score, total: currentIdx })}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-dim to-gold-light rounded-full"
            animate={{ width: `${((currentIdx + 1) / queue.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="text-center mb-8"
          >
            <p className="font-scheherazade text-8xl text-gold-light mb-4 leading-none">
              {current.code}
            </p>
            <p className="font-cinzel text-xs text-[#9a8a6a] tracking-widest uppercase">
              {t('learn:quiz.what_letter')}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Feedback */}
        <div className="flex justify-center mb-6 h-20">
          {isCorrect === true && <SuccessAnimation visible />}
          {isCorrect === false && <ErrorAnimation visible />}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selected === opt.code;
            const isCorrectOption = opt.code === current.code;
            let borderColor = 'border-[rgba(201,168,76,0.15)]';
            let bgColor = 'bg-[rgba(201,168,76,0.05)]';

            if (selected) {
              if (isCorrectOption) {
                borderColor = 'border-[rgba(76,175,120,0.5)]';
                bgColor = 'bg-[rgba(76,175,120,0.1)]';
              } else if (isSelected) {
                borderColor = 'border-[rgba(201,80,80,0.5)]';
                bgColor = 'bg-[rgba(201,80,80,0.1)]';
              }
            }

            return (
              <motion.button
                key={opt.code}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                whileTap={!selected ? { scale: 0.95 } : undefined}
                className={`p-4 rounded-2xl border ${borderColor} ${bgColor}
                           transition-all disabled:cursor-default
                           ${!selected ? 'hover:border-gold-dim hover:bg-[rgba(201,168,76,0.1)]' : ''}`}
              >
                <p className="font-cinzel text-sm text-[#f0e6cc]">{getLetterName(opt, lang)}</p>
                <p className="font-cinzel text-[0.55rem] text-[#9a8a6a] mt-0.5">
                  {opt.transcription.split(' — ')[0]}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // RESULT screen
  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-32 h-32 rounded-full border-2 border-gold-dim flex flex-col items-center justify-center
                        bg-gradient-to-br from-[#201808] to-[#0d0a07]
                        shadow-[0_0_60px_rgba(201,168,76,0.2)]">
          <p className="font-cinzel text-3xl font-bold text-gold-light">
            {queue.length > 0 ? Math.round((score / queue.length) * 100) : 0}%
          </p>
          <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase">
            {t('learn:result.accuracy', { n: queue.length > 0 ? Math.round((score / queue.length) * 100) : 0 })}
          </p>
        </div>

        <p className="font-cinzel text-xl text-[#f0e6cc]">
          {score === queue.length
            ? t('learn:result.title_perfect')
            : score >= queue.length * 0.7
            ? t('learn:result.title_great')
            : t('learn:result.title_keep')}
        </p>

        <p className="font-cinzel text-sm text-[#9a8a6a]">
          {t('learn:result.score', { score, total: queue.length })}
        </p>

        <div className="flex gap-3">
          <Button onClick={startSession}>{t('common:restart')}</Button>
          <Link to="/dashboard">
            <Button variant="outline">{t('common:nav.dashboard')}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
