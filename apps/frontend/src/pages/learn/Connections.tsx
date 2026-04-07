import { useState, useEffect, useCallback, useRef } from 'react';
import { Link }            from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../../store/authStore';
import { useSaveSession }  from '../../hooks/useProgress';
import { useLeaveWarning } from '../../hooks/useLeaveWarning';
import { SessionResult }   from '../../components/learn/SessionResult';
import { TimerBar }        from '../../components/ui/TimerBar';
import { Button }          from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName, Language } from '@arabic/shared';
import {
  NON_CONNECTING_CODES,
  isConnecting,
  getConnectingLetters,
  getNonConnectingLetters,
  SAMPLE_WORDS,
} from '../../data/letterForms';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Phase 1: Interactive Table ─────────────────────────────────────────────

function InteractiveTable({ lang, onStartGame }: { lang: Language; onStartGame: () => void }) {
  const { t } = useTranslation('common');
  const nonConnecting = getNonConnectingLetters();
  const connecting = getConnectingLetters();
  const [selected, setSelected] = useState<ArabicLetter | null>(null);

  // Find a sample word containing the selected letter
  const exampleWord = selected
    ? SAMPLE_WORDS.find(w => w.letters.includes(selected.code))
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">
          {t('forms.connections_title')}
        </h1>
      </div>

      <p className="font-raleway text-sm text-[#9a8a6a] mb-6 leading-relaxed">
        {t('forms.connections_desc')}
      </p>

      {/* Red zone — Non-connecting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-[#c95050]" />
          <h2 className="font-cinzel text-xs tracking-[3px] text-[#c95050] uppercase">
            {t('forms.non_connecting')}
          </h2>
          <span className="text-sm">&#x26d3;&#xfe0f;&#x200d;&#x1f4a5;</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {nonConnecting.map((letter, i) => (
            <motion.button
              key={letter.code}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              onClick={() => setSelected(selected?.code === letter.code ? null : letter)}
              className={`relative group flex flex-col items-center gap-1 p-4 rounded-2xl border
                transition-all duration-200
                ${selected?.code === letter.code
                  ? 'border-[#c95050] bg-[rgba(201,80,80,0.15)] shadow-[0_0_20px_rgba(201,80,80,0.2)]'
                  : 'border-[rgba(201,80,80,0.2)] bg-[rgba(201,80,80,0.05)] hover:border-[rgba(201,80,80,0.4)]'
                }`}
            >
              <span className="font-scheherazade text-3xl text-[#f0e6cc] leading-none">
                {letter.iso}
              </span>
              {/* Broken connector line */}
              <div className="flex items-center gap-0.5 mt-1">
                <div className="w-3 h-0.5 bg-[#c95050] rounded-full" />
                <div className="w-1 h-1 rounded-full bg-[#c95050] opacity-40" />
                <div className="w-3 h-0.5 bg-[#c95050] rounded-full opacity-40" />
              </div>
              <span className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
                {getLetterName(letter, lang)}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Green zone — Connecting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-[#4caf78]" />
          <h2 className="font-cinzel text-xs tracking-[3px] text-[#4caf78] uppercase">
            {t('forms.connecting')}
          </h2>
          <span className="text-sm">&#x1f517;</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {connecting.map((letter, i) => (
            <motion.button
              key={letter.code}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.03 }}
              onClick={() => setSelected(selected?.code === letter.code ? null : letter)}
              className={`relative group flex flex-col items-center gap-0.5 p-3 rounded-xl border
                transition-all duration-200
                ${selected?.code === letter.code
                  ? 'border-[#4caf78] bg-[rgba(76,175,120,0.15)] shadow-[0_0_20px_rgba(76,175,120,0.2)]'
                  : 'border-[rgba(76,175,120,0.15)] bg-[rgba(76,175,120,0.03)] hover:border-[rgba(76,175,120,0.4)]'
                }`}
            >
              <span className="font-scheherazade text-2xl text-[#f0e6cc] leading-none">
                {letter.iso}
              </span>
              {/* Solid connector line */}
              <div className="w-6 h-0.5 bg-[#4caf78] rounded-full mt-0.5 opacity-60" />
              <span className="font-cinzel text-[0.45rem] tracking-widest text-[#9a8a6a] uppercase">
                {getLetterName(letter, lang)}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Letter detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                            rounded-2xl p-5 shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-4 mb-3">
                <span className="font-scheherazade text-5xl text-gold-light">{selected.iso}</span>
                <div>
                  <p className="font-cinzel text-sm text-[#f0e6cc]">{getLetterName(selected, lang)}</p>
                  <p className={`font-cinzel text-xs ${isConnecting(selected.code) ? 'text-[#4caf78]' : 'text-[#c95050]'}`}>
                    {isConnecting(selected.code) ? t('forms.connecting') : t('forms.non_connecting')}
                  </p>
                </div>
              </div>
              {/* Show all 4 forms */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {(['iso', 'ini', 'med', 'fin'] as const).map(form => (
                  <div key={form} className="text-center p-2 rounded-xl bg-[rgba(255,255,255,0.03)]">
                    <span className="font-scheherazade text-2xl text-[#f0e6cc]">{selected[form]}</span>
                    <p className="font-cinzel text-[0.45rem] tracking-widest text-[#9a8a6a] uppercase mt-1">
                      {t(`forms.${form === 'iso' ? 'isolated' : form === 'ini' ? 'initial' : form === 'med' ? 'medial' : 'final'}`)}
                    </p>
                  </div>
                ))}
              </div>
              {exampleWord && (
                <div className="mt-3 p-3 rounded-xl bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)]">
                  <p className="font-scheherazade text-3xl text-gold-light text-center mb-1 leading-relaxed" dir="rtl">
                    {exampleWord.word}
                  </p>
                  <p className="font-raleway text-xs text-[#9a8a6a] text-center">
                    {lang === 'uz' ? exampleWord.meaningUz : lang === 'ru' ? exampleWord.meaningRu : exampleWord.meaningEn}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start game button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <Button size="lg" onClick={onStartGame}>
          {t('forms.sort_game')}
        </Button>
      </motion.div>
    </div>
  );
}

// ─── Phase 2: Swipe Sorting Game ─────────────────────────────────────────────

const GAME_TIME = 60;

function SwipeSortGame({
  lang,
  onFinish,
  onStartQuiz,
}: {
  lang: Language;
  onFinish: () => void;
  onStartQuiz: () => void;
}) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);
  useLeaveWarning(true);

  const [letters] = useState(() => shuffle([...LETTERS]));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [shakeScreen, setShakeScreen] = useState(false);
  const startTime = useRef(Date.now());

  const current = letters[index] || null;

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0 || index >= letters.length) {
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      saveSession({ mode: 'quiz', score, totalQ: results.length, durationSec: dur, letterResults: results });
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, index]);

  const answer = useCallback((connects: boolean) => {
    if (!current || phase !== 'playing') return;
    const correct = isConnecting(current.code) === connects;
    const newResults = [...results, { letterCode: current.code, correct }];
    setResults(newResults);

    if (correct) {
      const newCombo = combo + 1;
      setScore(s => s + Math.min(newCombo, 4));
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setFeedback('correct');
    } else {
      setCombo(0);
      setFeedback('wrong');
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= letters.length) {
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        saveSession({ mode: 'quiz', score: correct ? score + Math.min(combo + 1, 4) : score, totalQ: newResults.length, durationSec: dur, letterResults: newResults });
        setPhase('result');
      } else {
        setIndex(i => i + 1);
      }
    }, 600);
  }, [current, phase, combo, score, results, index, letters.length]);

  // Swipe handling
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const leftOpacity = useTransform(x, [-200, -50, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, 50, 200], [0, 0.5, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80) {
      answer(info.offset.x > 0); // right = connects
    }
  };

  if (phase === 'result') {
    const mistakes = results.filter(r => !r.correct);
    const correct = results.filter(r => r.correct).length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-6 max-w-sm"
        >
          <div className="w-36 h-36 rounded-full border-2 border-gold-dim flex flex-col items-center justify-center
                          bg-gradient-to-br from-[#201808] to-[#0d0a07]
                          shadow-[0_0_60px_rgba(201,168,76,0.2)]">
            <p className="font-cinzel text-3xl font-bold text-gold-light">{score}</p>
            <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
              {correct}/{results.length}
            </p>
          </div>

          {maxCombo > 1 && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-cinzel text-sm text-[#e8c96d]"
            >
              {t('forms.combo')} x{maxCombo}
            </motion.p>
          )}

          {mistakes.length > 0 && (
            <div className="w-full">
              <p className="font-cinzel text-xs text-[#c95050] tracking-widest uppercase mb-2">
                {t('common:error')} ({mistakes.length})
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {mistakes.map((m, i) => {
                  const letter = LETTERS.find(l => l.code === m.letterCode);
                  if (!letter) return null;
                  return (
                    <div key={i} className="flex flex-col items-center px-2 py-1 rounded-lg
                                            bg-[rgba(201,80,80,0.08)] border border-[rgba(201,80,80,0.2)]">
                      <span className="font-scheherazade text-xl text-[#f0e6cc]">{letter.iso}</span>
                      <span className="font-cinzel text-[0.4rem] text-[#9a8a6a]">
                        {isConnecting(letter.code) ? t('forms.connecting') : t('forms.non_connecting')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button size="md" onClick={onFinish}>{t('common:restart')}</Button>
            <Button size="md" variant="outline" onClick={onStartQuiz}>
              {t('forms.find_non_connector')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      animate={shakeScreen ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center px-4 py-6"
    >
      {/* Header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase flex-1">
          {t('forms.sort_game')}
        </h1>
        <span className="font-cinzel text-xs text-gold-light">{index + 1}/{letters.length}</span>
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-md mb-4">
        <TimerBar totalSeconds={GAME_TIME} timeLeft={timeLeft} />
      </div>

      {/* Score + Combo */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-cinzel text-sm text-[#9a8a6a]">{score} pts</span>
        {combo > 1 && (
          <motion.span
            key={combo}
            initial={{ scale: 1.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-cinzel text-sm font-bold text-[#e8c96d]"
          >
            {t('forms.combo')} x{Math.min(combo, 4)}
          </motion.span>
        )}
      </div>

      {/* Swipe zones */}
      <div className="relative w-full max-w-md flex-1 flex items-center justify-center">
        {/* Left zone indicator */}
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute left-0 inset-y-0 w-24 flex items-center justify-center
                     bg-gradient-to-r from-[rgba(201,80,80,0.2)] to-transparent rounded-l-2xl"
        >
          <div className="text-center">
            <p className="text-2xl">&#x26d3;&#xfe0f;&#x200d;&#x1f4a5;</p>
            <p className="font-cinzel text-[0.5rem] text-[#c95050] tracking-wider uppercase mt-1">
              {t('forms.non_connecting')}
            </p>
          </div>
        </motion.div>

        {/* Right zone indicator */}
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute right-0 inset-y-0 w-24 flex items-center justify-center
                     bg-gradient-to-l from-[rgba(76,175,120,0.2)] to-transparent rounded-r-2xl"
        >
          <div className="text-center">
            <p className="text-2xl">&#x1f517;</p>
            <p className="font-cinzel text-[0.5rem] text-[#4caf78] tracking-wider uppercase mt-1">
              {t('forms.connecting')}
            </p>
          </div>
        </motion.div>

        {/* Draggable letter card */}
        <AnimatePresence mode="wait">
          {current && !feedback && (
            <motion.div
              key={current.code}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              style={{ x, rotate }}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-48 h-56 bg-gradient-to-br from-[#201808] to-[#140f05]
                         border border-[#3a2d10] rounded-3xl flex flex-col items-center justify-center
                         shadow-[0_8px_60px_rgba(0,0,0,0.7)] cursor-grab active:cursor-grabbing z-10"
            >
              <span className="font-scheherazade text-[7rem] leading-none text-gold-light
                               drop-shadow-[0_0_40px_rgba(201,168,76,0.4)] select-none">
                {current.iso}
              </span>
              <span className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase mt-2">
                {getLetterName(current, lang)}
              </span>
            </motion.div>
          )}

          {feedback === 'correct' && current && (
            <motion.div
              key="correct"
              initial={{ scale: 1 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-48 h-56 bg-gradient-to-br from-[rgba(76,175,120,0.2)] to-[rgba(76,175,120,0.05)]
                         border-2 border-[#4caf78] rounded-3xl flex items-center justify-center z-10
                         shadow-[0_0_40px_rgba(76,175,120,0.3)]"
            >
              <span className="font-scheherazade text-[7rem] leading-none text-[#4caf78] select-none">
                {current.iso}
              </span>
            </motion.div>
          )}

          {feedback === 'wrong' && current && (
            <motion.div
              key="wrong"
              initial={{ scale: 1 }}
              animate={{ x: [0, -15, 15, -10, 10, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
              className="w-48 h-56 bg-gradient-to-br from-[rgba(201,80,80,0.2)] to-[rgba(201,80,80,0.05)]
                         border-2 border-[#c95050] rounded-3xl flex items-center justify-center z-10
                         shadow-[0_0_40px_rgba(201,80,80,0.3)]"
            >
              <span className="font-scheherazade text-[7rem] leading-none text-[#c95050] select-none">
                {current.iso}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tap buttons (alternative to swiping) */}
      <div className="flex gap-4 w-full max-w-md mt-6 mb-8">
        <button
          onClick={() => answer(false)}
          className="flex-1 py-4 rounded-2xl border border-[rgba(201,80,80,0.3)]
                     bg-gradient-to-br from-[rgba(201,80,80,0.1)] to-[rgba(201,80,80,0.02)]
                     hover:border-[rgba(201,80,80,0.5)] transition-all active:scale-95"
        >
          <p className="text-xl mb-1">&#x26d3;&#xfe0f;&#x200d;&#x1f4a5;</p>
          <p className="font-cinzel text-[0.55rem] tracking-widest text-[#c95050] uppercase">
            {t('forms.non_connecting')}
          </p>
        </button>
        <button
          onClick={() => answer(true)}
          className="flex-1 py-4 rounded-2xl border border-[rgba(76,175,120,0.3)]
                     bg-gradient-to-br from-[rgba(76,175,120,0.1)] to-[rgba(76,175,120,0.02)]
                     hover:border-[rgba(76,175,120,0.5)] transition-all active:scale-95"
        >
          <p className="text-xl mb-1">&#x1f517;</p>
          <p className="font-cinzel text-[0.55rem] tracking-widest text-[#4caf78] uppercase">
            {t('forms.connecting')}
          </p>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Phase 3: Find Non-Connector in Word ─────────────────────────────────────

function FindNonConnectorQuiz({ lang, onFinish }: { lang: Language; onFinish: () => void }) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);
  useLeaveWarning(true);

  // Pick words that have at least one non-connecting letter
  const [words] = useState(() => {
    const eligible = SAMPLE_WORDS.filter(w =>
      w.letters.some(l => NON_CONNECTING_CODES.includes(l))
    );
    return shuffle(eligible).slice(0, 10);
  });

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const startTime = useRef(Date.now());

  const current = words[index] || null;
  const nonConnectorsInWord = current ? current.letters.filter(l => NON_CONNECTING_CODES.includes(l)) : [];

  const handleTapLetter = (letterCode: string) => {
    if (selected || !current) return;
    setSelected(letterCode);
    const correct = NON_CONNECTING_CODES.includes(letterCode);
    setResults(prev => [...prev, { letterCode, correct }]);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      setSelected(null);
      if (index + 1 >= words.length) {
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        const newResults = [...results, { letterCode, correct }];
        saveSession({ mode: 'quiz', score: correct ? score + 1 : score, totalQ: newResults.length, durationSec: dur, letterResults: newResults });
        setPhase('result');
      } else {
        setIndex(i => i + 1);
      }
    }, 800);
  };

  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <SessionResult
          score={score}
          total={words.length}
          mode="quiz"
          level={user?.level ?? 'beginner'}
          durationSec={Math.round((Date.now() - startTime.current) / 1000)}
          onRestart={onFinish}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase flex-1">
          {t('forms.find_non_connector')}
        </h1>
        <span className="font-cinzel text-xs text-gold-light">{index + 1}/{words.length}</span>
      </div>

      <p className="font-cinzel text-xs text-[#9a8a6a] tracking-wider uppercase mb-6">
        {t('forms.find_non_connector')}
      </p>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            {/* Word meaning */}
            <p className="font-raleway text-sm text-[#9a8a6a] text-center mb-4">
              {lang === 'uz' ? current.meaningUz : lang === 'ru' ? current.meaningRu : current.meaningEn}
            </p>

            {/* Letter cards */}
            <div className="flex gap-3 justify-center flex-wrap" dir="rtl">
              {current.letters.map((letterCode, li) => {
                const letter = LETTERS.find(l => l.code === letterCode);
                if (!letter) return null;
                const isNonConn = NON_CONNECTING_CODES.includes(letterCode);
                const isSelected = selected === letterCode;
                const showResult = selected !== null;

                let borderColor = 'border-[rgba(201,168,76,0.15)]';
                let bgColor = 'bg-[rgba(255,255,255,0.04)]';

                if (showResult && isNonConn) {
                  borderColor = 'border-[#4caf78]';
                  bgColor = 'bg-[rgba(76,175,120,0.15)]';
                }
                if (isSelected && !isNonConn) {
                  borderColor = 'border-[#c95050]';
                  bgColor = 'bg-[rgba(201,80,80,0.15)]';
                }

                return (
                  <motion.button
                    key={li}
                    onClick={() => handleTapLetter(letterCode)}
                    disabled={!!selected}
                    animate={
                      isSelected && !isNonConn
                        ? { x: [-4, 4, -3, 3, -1, 1, 0] }
                        : showResult && isNonConn
                          ? { scale: [1, 1.1, 1] }
                          : {}
                    }
                    className={`w-16 h-20 rounded-2xl border flex items-center justify-center
                      transition-all duration-200 ${borderColor} ${bgColor}
                      ${!selected ? 'hover:border-[rgba(201,168,76,0.4)] hover:scale-105 active:scale-95' : ''}
                      disabled:cursor-default`}
                  >
                    <span className="font-scheherazade text-4xl text-[#f0e6cc] select-none">
                      {letter.iso}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score */}
      <div className="mt-auto pt-6">
        <p className="font-cinzel text-xs text-[#9a8a6a]">{score}/{index} correct</p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ConnectionsPage() {
  const lang = (useAuthStore(s => s.user?.language) ?? 'uz') as Language;
  const [view, setView] = useState<'table' | 'game' | 'quiz'>('table');

  return (
    <>
      {view === 'table' && (
        <InteractiveTable lang={lang} onStartGame={() => setView('game')} />
      )}
      {view === 'game' && (
        <SwipeSortGame
          lang={lang}
          onFinish={() => setView('table')}
          onStartQuiz={() => setView('quiz')}
        />
      )}
      {view === 'quiz' && (
        <FindNonConnectorQuiz lang={lang} onFinish={() => setView('table')} />
      )}
    </>
  );
}
