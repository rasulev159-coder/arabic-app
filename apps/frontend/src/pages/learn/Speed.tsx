import { useState, useEffect, useCallback } from 'react';
import { Link }            from 'react-router-dom';
import { motion, AnimatePresence }  from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../../store/authStore';
import { useSaveSession }  from '../../hooks/useProgress';
import { useLeaveWarning } from '../../hooks/useLeaveWarning';
import { SessionResult }   from '../../components/learn/SessionResult';
import { Button }          from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName } from '@arabic/shared';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

function makeOptions(correct: ArabicLetter, all: ArabicLetter[]): ArabicLetter[] {
  const wrong = shuffle(all.filter(l => l.code !== correct.code)).slice(0, 3);
  return shuffle([correct, ...wrong]);
}

const TOTAL_TIME = 60;

export function SpeedPage() {
  const { t }  = useTranslation('learn');
  const lang   = (useAuthStore((s) => s.user?.language) ?? 'ru') as any;
  const user   = useAuthStore((s) => s.user);
  const { mutate: saveSession } = useSaveSession();

  const [phase, setPhase]   = useState<'start' | 'session' | 'result'>('start');
  useLeaveWarning(phase === 'session');
  const [queue, setQueue]   = useState<ArabicLetter[]>([]);
  const [current, setCurrent] = useState<ArabicLetter | null>(null);
  const [options, setOptions] = useState<ArabicLetter[]>([]);
  const [score, setScore]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answered, setAnswered] = useState<string | null>(null);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);

  const nextCard = useCallback((q: ArabicLetter[]) => {
    if (q.length === 0) {
      const fresh = shuffle(LETTERS);
      const card  = fresh[0];
      setQueue(fresh.slice(1));
      setCurrent(card);
      setOptions(makeOptions(card, LETTERS));
    } else {
      const card = q[0];
      setQueue(q.slice(1));
      setCurrent(card);
      setOptions(makeOptions(card, LETTERS));
    }
    setAnswered(null);
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== 'session') return;
    if (timeLeft <= 0) {
      saveSession({ mode: 'speed', score, totalQ: results.length, durationSec: TOTAL_TIME, letterResults: results });
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, score, results]);

  const startSession = () => {
    const q = shuffle(LETTERS);
    setScore(0); setResults([]); setTimeLeft(TOTAL_TIME);
    setPhase('session');
    setQueue(q.slice(1));
    setCurrent(q[0]);
    setOptions(makeOptions(q[0], LETTERS));
    setAnswered(null);
  };

  const pick = (letter: ArabicLetter) => {
    if (answered) return;
    const ok = letter.code === current!.code;
    setAnswered(letter.code);
    const newResults = [...results, { letterCode: current!.code, correct: ok }];
    setResults(newResults);
    if (ok) setScore((s) => s + 1);
    setTimeout(() => nextCard(queue), 400);
  };

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <p className="font-scheherazade text-6xl text-gold mb-3">⚡</p>
        <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('speed.title')}</h1>
        <p className="text-[#9a8a6a] mt-2 font-raleway max-w-xs">{t('speed.subtitle')}</p>
      </div>
      <Button size="lg" onClick={startSession}>{t('speed.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <SessionResult score={score} total={results.length} mode="speed"
        level={user?.level ?? 'beginner'} durationSec={TOTAL_TIME} onRestart={startSession} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-6">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('speed.title')}</h1>
      </div>
      {/* Timer */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between font-cinzel text-sm mb-2">
          <span className={`${timeLeft <= 10 ? 'text-[#c95050]' : 'text-gold-light'} font-bold`}>
            {t('speed.time_left', { n: timeLeft })}
          </span>
          <span className="text-[#9a8a6a]">{t('speed.score', { n: score })}</span>
        </div>
        <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000
                           ${timeLeft <= 10 ? 'bg-[#c95050]' : 'bg-gradient-to-r from-gold-dim to-gold-light'}`}
               style={{ width: `${timeLeft / TOTAL_TIME * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.code}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                       rounded-3xl w-full max-w-sm h-52 flex items-center justify-center
                       shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
          >
            <p className="font-scheherazade text-[8rem] leading-none text-gold-light
                           drop-shadow-[0_0_40px_rgba(201,168,76,0.5)] select-none">
              {current.code}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {options.map((opt) => {
          const isAnswered = answered === opt.code;
          const isCorrect  = opt.code === current?.code;
          let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)] text-[#f0e6cc]';
          if (answered) {
            if (isCorrect)        cls = 'border-[rgba(76,175,120,0.5)] bg-[rgba(76,175,120,0.15)] text-[#4caf78]';
            else if (isAnswered)  cls = 'border-[rgba(201,80,80,0.4)] bg-[rgba(201,80,80,0.15)] text-[#c95050]';
          }
          return (
            <button key={opt.code} onClick={() => pick(opt)} disabled={!!answered}
              className={`font-cinzel text-sm tracking-wide uppercase py-4 px-3 rounded-2xl border
                          transition-all duration-200 ${cls}
                          ${!answered ? 'hover:border-[rgba(201,168,76,0.35)] hover:-translate-y-px' : ''}
                          disabled:cursor-default`}>
              {getLetterName(opt, lang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
