import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link }            from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../../store/authStore';
import { useSaveSession }  from '../../hooks/useProgress';
import { useLeaveWarning } from '../../hooks/useLeaveWarning';
import { SessionResult }   from '../../components/learn/SessionResult';
import { TimerBar }        from '../../components/ui/TimerBar';
import { Button }          from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName, Language, LetterGroup } from '@arabic/shared';
import { isConnecting, NON_CONNECTING_CODES, SAMPLE_WORDS } from '../../data/letterForms';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type FormKey = 'iso' | 'ini' | 'med' | 'fin';
const FORM_KEYS: FormKey[] = ['iso', 'ini', 'med', 'fin'];

function formLabel(key: FormKey, t: (k: string) => string): string {
  const map: Record<FormKey, string> = {
    iso: t('forms.isolated'),
    ini: t('forms.initial'),
    med: t('forms.medial'),
    fin: t('forms.final'),
  };
  return map[key];
}

// ─── Phase 1: Interactive Forms Table ────────────────────────────────────────

type Filter = 'all' | 'similar' | 'non_connecting';

const SIMILAR_GROUPS: LetterGroup[] = ['btt', 'jch', 'dz', 'rz', 'ss', 'sd', 'tz', 'ag', 'fq'];

function FormsTable({ lang, onStartGame }: { lang: Language; onStartGame: (level: number) => void }) {
  const { t } = useTranslation('common');
  const [filter, setFilter] = useState<Filter>('all');
  const [zoomedForm, setZoomedForm] = useState<{ letter: ArabicLetter; form: FormKey } | null>(null);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'similar':
        return LETTERS.filter(l => l.group && SIMILAR_GROUPS.includes(l.group));
      case 'non_connecting':
        return LETTERS.filter(l => NON_CONNECTING_CODES.includes(l.code));
      default:
        return LETTERS;
    }
  }, [filter]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">
          {t('forms.forms_title')}
        </h1>
      </div>

      <p className="font-raleway text-sm text-[#9a8a6a] mb-4 leading-relaxed">
        {t('forms.forms_desc')}
      </p>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: 'all' as Filter, label: 'All' },
          { key: 'similar' as Filter, label: '\u0628 \u062a \u062b' },
          { key: 'non_connecting' as Filter, label: t('forms.non_connecting') },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-3 py-2 rounded-full border
              transition-all ${filter === key
                ? 'border-gold-dim text-gold-light bg-[rgba(201,168,76,0.1)]'
                : 'border-[rgba(255,255,255,0.08)] text-[#9a8a6a] hover:text-gold-light'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-1 mb-2">
        <div />
        {FORM_KEYS.map(k => (
          <div key={k} className="text-center font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
            {formLabel(k, t)}
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="space-y-1 overflow-x-auto">
        {filtered.map((letter, i) => (
          <motion.div
            key={letter.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-1"
          >
            {/* Letter name */}
            <div className="flex items-center justify-center">
              <span className="font-cinzel text-[0.55rem] tracking-wider text-[#9a8a6a]">
                {getLetterName(letter, lang)}
              </span>
            </div>
            {/* Form cells */}
            {FORM_KEYS.map(form => {
              const isDiff = form !== 'iso' && letter[form] !== letter.iso;
              return (
                <button
                  key={form}
                  onClick={() => setZoomedForm({ letter, form })}
                  className={`flex items-center justify-center py-3 px-2 rounded-xl border
                    transition-all duration-200 hover:scale-105 active:scale-95
                    ${isDiff
                      ? 'border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.05)] shadow-[0_0_12px_rgba(201,168,76,0.08)]'
                      : 'border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] opacity-70'
                    }`}
                >
                  <span
                    className="font-scheherazade text-2xl text-[#f0e6cc] select-none leading-none"
                    style={{ fontFamily: "'Scheherazade New', serif" }}
                  >
                    {letter[form]}
                  </span>
                </button>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomedForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedForm(null)}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-gold-dim
                         rounded-3xl p-8 max-w-xs w-full text-center
                         shadow-[0_0_80px_rgba(201,168,76,0.2)]"
            >
              <span
                className="font-scheherazade text-[8rem] leading-none text-gold-light
                           drop-shadow-[0_0_40px_rgba(201,168,76,0.5)] select-none"
                style={{ fontFamily: "'Scheherazade New', serif" }}
              >
                {zoomedForm.letter[zoomedForm.form]}
              </span>
              <p className="font-cinzel text-sm tracking-widest text-gold uppercase mt-4">
                {formLabel(zoomedForm.form, t)}
              </p>
              <p className="font-cinzel text-xs text-[#9a8a6a] mt-1">
                {getLetterName(zoomedForm.letter, lang)}
              </p>

              {/* All 4 forms mini row */}
              <div className="flex gap-3 justify-center mt-6">
                {FORM_KEYS.map(fk => (
                  <div
                    key={fk}
                    className={`px-3 py-2 rounded-xl ${fk === zoomedForm.form
                      ? 'bg-[rgba(201,168,76,0.15)] border border-gold-dim'
                      : 'bg-[rgba(255,255,255,0.03)]'}`}
                  >
                    <span className="font-scheherazade text-xl text-[#f0e6cc]">
                      {zoomedForm.letter[fk]}
                    </span>
                    <p className="font-cinzel text-[0.4rem] text-[#9a8a6a] tracking-wider uppercase mt-0.5">
                      {formLabel(fk, t)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game level buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 space-y-3"
      >
        <h3 className="font-cinzel text-xs tracking-[3px] text-[#9a8a6a] uppercase mb-3">
          {t('forms.recognize_game')}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(level => (
            <button
              key={level}
              onClick={() => onStartGame(level)}
              className="py-4 rounded-2xl border border-[rgba(201,168,76,0.12)]
                         bg-gradient-to-br from-[rgba(201,168,76,0.05)] to-transparent
                         hover:border-gold-dim hover:-translate-y-1 transition-all"
            >
              <p className="font-cinzel text-lg text-gold-light font-bold">{level}</p>
              <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
                {level === 1 ? t('forms.level_easy') : level === 2 ? t('forms.level_medium') : t('forms.level_hard')}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center mt-4">
          <Button variant="outline" size="md" onClick={() => onStartGame(4)}>
            {t('forms.match_game')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Level 1: "Which is the initial form?" ──────────────────────────────────

function RecognizeLevel1({ lang, onFinish }: { lang: Language; onFinish: () => void }) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);
  useLeaveWarning(true);

  const TOTAL_Q = 15;
  const TOTAL_TIME = 90;

  const [questions] = useState(() => {
    const shuffled = shuffle([...LETTERS]);
    return shuffled.slice(0, TOTAL_Q).map(letter => {
      const targetForm = (['ini', 'med', 'fin'] as FormKey[])[Math.floor(Math.random() * 3)];
      const wrongLetters = shuffle(LETTERS.filter(l => l.code !== letter.code)).slice(0, 3);
      const options = shuffle([
        { form: letter[targetForm], code: letter.code, correct: true },
        ...wrongLetters.map(wl => ({ form: wl[targetForm], code: wl.code, correct: false })),
      ]);
      return { letter, targetForm, options };
    });
  });

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answered, setAnswered] = useState<number | null>(null);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0 || index >= TOTAL_Q) {
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      saveSession({ mode: 'quiz', score, totalQ: results.length, durationSec: dur, letterResults: results });
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, index]);

  const q = questions[index];

  const handlePick = (optIdx: number) => {
    if (answered !== null || !q) return;
    setAnswered(optIdx);
    const ok = q.options[optIdx].correct;
    const newResults = [...results, { letterCode: q.letter.code, correct: ok }];
    setResults(newResults);
    if (ok) setScore(s => s + 1);

    setTimeout(() => {
      setAnswered(null);
      if (index + 1 >= TOTAL_Q) {
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        saveSession({ mode: 'quiz', score: ok ? score + 1 : score, totalQ: newResults.length, durationSec: dur, letterResults: newResults });
        setPhase('result');
      } else {
        setIndex(i => i + 1);
      }
    }, 600);
  };

  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <SessionResult
          score={score} total={TOTAL_Q} mode="quiz"
          level={user?.level ?? 'beginner'}
          durationSec={Math.round((Date.now() - startTime.current) / 1000)}
          onRestart={onFinish}
        />
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase flex-1">
          {t('forms.recognize_game')} — {t('forms.level_easy')}
        </h1>
        <span className="font-cinzel text-xs text-gold-light">{index + 1}/{TOTAL_Q}</span>
      </div>

      <div className="w-full max-w-md mb-6">
        <TimerBar totalSeconds={TOTAL_TIME} timeLeft={timeLeft} />
      </div>

      {/* Question */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="font-cinzel text-xs text-[#9a8a6a] tracking-wider uppercase mb-2">
          {t('forms.which_form')}: {formLabel(q.targetForm, t)}
        </p>
        <p className="font-cinzel text-lg text-gold-light">{getLetterName(q.letter, lang)}</p>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.options.map((opt, oi) => {
          let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)]';
          if (answered !== null) {
            if (opt.correct) cls = 'border-[#4caf78] bg-[rgba(76,175,120,0.15)]';
            else if (answered === oi) cls = 'border-[#c95050] bg-[rgba(201,80,80,0.15)]';
          }
          return (
            <motion.button
              key={oi}
              onClick={() => handlePick(oi)}
              disabled={answered !== null}
              animate={
                answered === oi && !opt.correct
                  ? { x: [-4, 4, -3, 3, 0] }
                  : answered !== null && opt.correct
                    ? { scale: [1, 1.05, 1] }
                    : {}
              }
              className={`h-24 rounded-2xl border flex items-center justify-center
                transition-all duration-200 ${cls}
                ${answered === null ? 'hover:border-[rgba(201,168,76,0.35)] hover:scale-105 active:scale-95' : ''}
                disabled:cursor-default`}
            >
              <span
                className="font-scheherazade text-4xl text-[#f0e6cc] select-none"
                style={{ fontFamily: "'Scheherazade New', serif" }}
              >
                {opt.form}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Level 2: "What letter is this?" ─────────────────────────────────────────

function RecognizeLevel2({ lang, onFinish }: { lang: Language; onFinish: () => void }) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);
  useLeaveWarning(true);

  const TOTAL_Q = 20;
  const TOTAL_TIME = 60;

  const [questions] = useState(() => {
    return Array.from({ length: TOTAL_Q }, () => {
      const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      const form = (['ini', 'med', 'fin'] as FormKey[])[Math.floor(Math.random() * 3)];
      const wrongLetters = shuffle(LETTERS.filter(l => l.code !== letter.code)).slice(0, 3);
      const options = shuffle([letter, ...wrongLetters]);
      return { letter, form, shownForm: letter[form], options };
    });
  });

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answered, setAnswered] = useState<string | null>(null);
  const [showAllForms, setShowAllForms] = useState(false);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0 || index >= TOTAL_Q) {
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      saveSession({ mode: 'quiz', score, totalQ: results.length, durationSec: dur, letterResults: results });
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, index]);

  const q = questions[index];

  const handlePick = (opt: ArabicLetter) => {
    if (answered || !q) return;
    setAnswered(opt.code);
    const ok = opt.code === q.letter.code;
    setResults(prev => [...prev, { letterCode: q.letter.code, correct: ok }]);
    if (ok) setScore(s => s + 1);

    // Show all 4 forms briefly
    setShowAllForms(true);
    setTimeout(() => {
      setShowAllForms(false);
      setAnswered(null);
      if (index + 1 >= TOTAL_Q) {
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        const newR = [...results, { letterCode: q.letter.code, correct: ok }];
        saveSession({ mode: 'quiz', score: ok ? score + 1 : score, totalQ: newR.length, durationSec: dur, letterResults: newR });
        setPhase('result');
      } else {
        setIndex(i => i + 1);
      }
    }, 1200);
  };

  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <SessionResult
          score={score} total={TOTAL_Q} mode="quiz"
          level={user?.level ?? 'beginner'}
          durationSec={Math.round((Date.now() - startTime.current) / 1000)}
          onRestart={onFinish}
        />
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase flex-1">
          {t('forms.recognize_game')} — {t('forms.level_medium')}
        </h1>
        <span className="font-cinzel text-xs text-gold-light">{index + 1}/{TOTAL_Q}</span>
      </div>

      <div className="w-full max-w-md mb-6">
        <TimerBar totalSeconds={TOTAL_TIME} timeLeft={timeLeft} />
      </div>

      {/* Shown form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="w-40 h-48 bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                     rounded-3xl flex flex-col items-center justify-center mb-2
                     shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
        >
          <span
            className="font-scheherazade text-[6rem] leading-none text-gold-light
                       drop-shadow-[0_0_30px_rgba(201,168,76,0.4)] select-none"
            style={{ fontFamily: "'Scheherazade New', serif" }}
          >
            {q.shownForm}
          </span>
          <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase mt-2">
            {formLabel(q.form, t)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Learning moment: show all forms after answering */}
      <AnimatePresence>
        {showAllForms && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2 mb-4"
          >
            {FORM_KEYS.map(fk => (
              <div key={fk} className="text-center px-3 py-2 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)]">
                <span className="font-scheherazade text-lg text-gold-light">{q.letter[fk]}</span>
                <p className="font-cinzel text-[0.4rem] text-[#9a8a6a] tracking-wider uppercase">
                  {formLabel(fk, t)}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
        {q.options.map((opt) => {
          const isCorrect = opt.code === q.letter.code;
          let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)] text-[#f0e6cc]';
          if (answered) {
            if (isCorrect) cls = 'border-[#4caf78] bg-[rgba(76,175,120,0.15)] text-[#4caf78]';
            else if (answered === opt.code) cls = 'border-[#c95050] bg-[rgba(201,80,80,0.15)] text-[#c95050]';
          }
          return (
            <motion.button
              key={opt.code}
              onClick={() => handlePick(opt)}
              disabled={!!answered}
              animate={
                answered === opt.code && !isCorrect
                  ? { x: [-4, 4, -3, 3, 0] }
                  : {}
              }
              className={`py-4 rounded-2xl border font-cinzel text-sm tracking-wide uppercase
                transition-all duration-200 ${cls}
                ${!answered ? 'hover:border-[rgba(201,168,76,0.35)] hover:-translate-y-px' : ''}
                disabled:cursor-default`}
            >
              {getLetterName(opt, lang)}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Level 3: "Find the letter in the word" ──────────────────────────────────

function RecognizeLevel3({ lang, onFinish }: { lang: Language; onFinish: () => void }) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);
  useLeaveWarning(true);

  const TOTAL_Q = 15;
  const TOTAL_TIME = 45;

  const [questions] = useState(() => {
    const words = shuffle([...SAMPLE_WORDS]).slice(0, TOTAL_Q);
    return words.map(word => {
      const target = word.letters[Math.floor(Math.random() * word.letters.length)];
      const letter = LETTERS.find(l => l.code === target)!;
      return { word, targetCode: target, letter };
    });
  });

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0 || index >= TOTAL_Q) {
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      saveSession({ mode: 'quiz', score, totalQ: results.length, durationSec: dur, letterResults: results });
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, index]);

  const q = questions[index];

  const handleTap = (letterIdx: number) => {
    if (selected !== null || !q) return;
    setSelected(letterIdx);
    const tappedCode = q.word.letters[letterIdx];
    const ok = tappedCode === q.targetCode;
    const newR = [...results, { letterCode: q.targetCode, correct: ok }];
    setResults(newR);
    if (ok) setScore(s => s + 1);

    setTimeout(() => {
      setSelected(null);
      if (index + 1 >= TOTAL_Q) {
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        saveSession({ mode: 'quiz', score: ok ? score + 1 : score, totalQ: newR.length, durationSec: dur, letterResults: newR });
        setPhase('result');
      } else {
        setIndex(i => i + 1);
      }
    }, 700);
  };

  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <SessionResult
          score={score} total={TOTAL_Q} mode="quiz"
          level={user?.level ?? 'beginner'}
          durationSec={Math.round((Date.now() - startTime.current) / 1000)}
          onRestart={onFinish}
        />
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase flex-1">
          {t('forms.find_letter_in_word')}
        </h1>
        <span className="font-cinzel text-xs text-gold-light">{index + 1}/{TOTAL_Q}</span>
      </div>

      <div className="w-full max-w-md mb-6">
        <TimerBar totalSeconds={TOTAL_TIME} timeLeft={timeLeft} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          {/* Target letter info */}
          <div className="text-center mb-2">
            <p className="font-cinzel text-xs text-[#9a8a6a] tracking-wider uppercase mb-1">
              {t('forms.find_letter_in_word')}:
            </p>
            <div className="flex items-center gap-3 justify-center">
              <span className="font-scheherazade text-3xl text-gold-light">{q.letter.iso}</span>
              <span className="font-cinzel text-sm text-[#f0e6cc]">{getLetterName(q.letter, lang)}</span>
            </div>
          </div>

          {/* Word with tappable letters */}
          <div className="flex gap-3 justify-center flex-wrap" dir="rtl">
            {q.word.letters.map((lc, li) => {
              const letter = LETTERS.find(l => l.code === lc);
              if (!letter) return null;
              const isTarget = lc === q.targetCode;
              const isSel = selected === li;
              const showResult = selected !== null;

              let borderColor = 'border-[rgba(201,168,76,0.15)]';
              let bgColor = 'bg-[rgba(255,255,255,0.04)]';

              if (showResult && isTarget) {
                borderColor = 'border-[#4caf78]';
                bgColor = 'bg-[rgba(76,175,120,0.15)]';
              }
              if (isSel && !isTarget) {
                borderColor = 'border-[#c95050]';
                bgColor = 'bg-[rgba(201,80,80,0.15)]';
              }

              return (
                <motion.button
                  key={li}
                  onClick={() => handleTap(li)}
                  disabled={selected !== null}
                  animate={
                    isSel && !isTarget
                      ? { x: [-4, 4, -3, 3, 0] }
                      : showResult && isTarget
                        ? { scale: [1, 1.15, 1] }
                        : {}
                  }
                  className={`w-16 h-20 rounded-2xl border flex items-center justify-center
                    transition-all duration-200 ${borderColor} ${bgColor}
                    ${!showResult ? 'hover:border-[rgba(201,168,76,0.4)] hover:scale-105 active:scale-95' : ''}
                    disabled:cursor-default`}
                >
                  <span className="font-scheherazade text-3xl text-[#f0e6cc] select-none">
                    {letter.iso}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Word meaning */}
          <p className="font-raleway text-sm text-[#9a8a6a] text-center mt-2">
            {lang === 'uz' ? q.word.meaningUz : lang === 'ru' ? q.word.meaningRu : q.word.meaningEn}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Phase 3: Memory/Matching Game ───────────────────────────────────────────

interface MemoryCard {
  id: number;
  letterCode: string;
  form: FormKey;
  display: string;
  matched: boolean;
  flipped: boolean;
}

function MatchFormsGame({ lang, onFinish }: { lang: Language; onFinish: () => void }) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);
  useLeaveWarning(true);

  const [mode, setMode] = useState<2 | 4 | 8 | null>(null);

  if (mode === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc] mb-2">{t('forms.match_game')}</h1>
          <p className="font-raleway text-sm text-[#9a8a6a]">{t('forms.forms_desc')}</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {([2, 4, 8] as const).map(m => (
            <Button key={m} variant="outline" size="lg" onClick={() => setMode(m)}
              className="w-full">
              {m} {m === 2 ? '(8)' : m === 4 ? '(16)' : '(32)'} cards
            </Button>
          ))}
        </div>
        <Button variant="ghost" onClick={onFinish}>&larr; {t('common:close')}</Button>
      </div>
    );
  }

  return <MatchFormsBoard key={mode} letterCount={mode} lang={lang} onFinish={onFinish} />;
}

function MatchFormsBoard({ letterCount, lang, onFinish }: { letterCount: 2 | 4 | 8; lang: Language; onFinish: () => void }) {
  const { t } = useTranslation('common');
  const { mutate: saveSession } = useSaveSession();
  const user = useAuthStore(s => s.user);

  const TOTAL_TIME = letterCount === 2 ? 60 : letterCount === 4 ? 120 : 180;

  const [cards, setCards] = useState<MemoryCard[]>(() => {
    const chosen = shuffle([...LETTERS]).slice(0, letterCount);
    const all: MemoryCard[] = [];
    let id = 0;
    for (const letter of chosen) {
      for (const form of FORM_KEYS) {
        all.push({
          id: id++,
          letterCode: letter.code,
          form,
          display: letter[form],
          matched: false,
          flipped: false,
        });
      }
    }
    return shuffle(all);
  });

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const totalPairs = letterCount; // Each letter has 4 forms — we match all forms of same letter
  const lockRef = useRef(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  // Check if all matched
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      saveSession({
        mode: 'memory',
        score: matchCount,
        totalQ: letterCount,
        durationSec: dur,
        letterResults: cards
          .filter(c => c.form === 'iso')
          .map(c => ({ letterCode: c.letterCode, correct: c.matched })),
      });
      setTimeout(() => setPhase('result'), 500);
    }
  }, [cards]);

  const handleFlip = (cardId: number) => {
    if (lockRef.current) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.matched || card.flipped) return;

    const newFlipped = [...flipped, cardId];
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(id => cards.find(c => c.id === id)!);
      const isMatch = a.letterCode === b.letterCode;

      setTimeout(() => {
        if (isMatch) {
          // Check if ALL forms of this letter are now flipped
          const allFormsFlipped = cards.filter(c => c.letterCode === a.letterCode).every(
            c => c.flipped || newFlipped.includes(c.id)
          );
          // For memory matching: match two at a time is simpler — just match pairs from same letter
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, matched: true } : c
          ));
          setMatchCount(m => m + 1);
        } else {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
        }
        setFlipped([]);
        lockRef.current = false;
      }, isMatch ? 400 : 800);
    }
  };

  if (phase === 'result') {
    const allMatched = cards.every(c => c.matched);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="w-36 h-36 rounded-full border-2 border-gold-dim flex flex-col items-center justify-center
                          bg-gradient-to-br from-[#201808] to-[#0d0a07]
                          shadow-[0_0_60px_rgba(201,168,76,0.2)]">
            <p className="font-cinzel text-3xl font-bold text-gold-light">
              {allMatched ? '100%' : `${Math.round((matchCount / (cards.length / 2)) * 100)}%`}
            </p>
            <p className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] uppercase">
              {moves} moves
            </p>
          </div>
          <Button size="lg" onClick={onFinish}>{t('common:restart')}</Button>
        </motion.div>
      </div>
    );
  }

  const cols = letterCount <= 2 ? 4 : letterCount <= 4 ? 4 : 4;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <button onClick={onFinish} className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</button>
        <h1 className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase flex-1">
          {t('forms.match_game')}
        </h1>
        <span className="font-cinzel text-xs text-[#9a8a6a]">{moves} moves</span>
      </div>

      <div className="w-full max-w-md mb-4">
        <TimerBar totalSeconds={TOTAL_TIME} timeLeft={timeLeft} />
      </div>

      <div
        className="grid gap-2 w-full max-w-md"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            disabled={card.matched || card.flipped}
            className="relative aspect-[3/4] rounded-xl overflow-hidden perspective-500"
            style={{ perspective: 500 }}
          >
            <motion.div
              animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="w-full h-full relative preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Back (face down) */}
              <div
                className="absolute inset-0 rounded-xl border border-gold-dim
                           bg-gradient-to-br from-[#201808] to-[#140f05]
                           flex items-center justify-center backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-6 h-6 rounded-full border border-[rgba(201,168,76,0.3)]
                                bg-[rgba(201,168,76,0.05)]" />
              </div>
              {/* Front (face up) */}
              <div
                className={`absolute inset-0 rounded-xl border flex flex-col items-center justify-center backface-hidden
                  ${card.matched
                    ? 'border-[#4caf78] bg-[rgba(76,175,120,0.1)] shadow-[0_0_20px_rgba(76,175,120,0.2)]'
                    : 'border-[rgba(201,168,76,0.2)] bg-gradient-to-br from-[#201808] to-[#140f05]'
                  }`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span
                  className={`font-scheherazade text-2xl select-none ${card.matched ? 'text-[#4caf78]' : 'text-gold-light'}`}
                  style={{ fontFamily: "'Scheherazade New', serif" }}
                >
                  {card.display}
                </span>
                <span className="font-cinzel text-[0.4rem] tracking-wider text-[#9a8a6a] uppercase mt-1">
                  {formLabel(card.form, t)}
                </span>
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function FormsPage() {
  const lang = (useAuthStore(s => s.user?.language) ?? 'uz') as Language;
  // view: 'table' | 'level1' | 'level2' | 'level3' | 'match'
  const [view, setView] = useState<'table' | 'level1' | 'level2' | 'level3' | 'match'>('table');

  const handleStartGame = (level: number) => {
    if (level === 1) setView('level1');
    else if (level === 2) setView('level2');
    else if (level === 3) setView('level3');
    else setView('match');
  };

  return (
    <>
      {view === 'table' && <FormsTable lang={lang} onStartGame={handleStartGame} />}
      {view === 'level1' && <RecognizeLevel1 lang={lang} onFinish={() => setView('table')} />}
      {view === 'level2' && <RecognizeLevel2 lang={lang} onFinish={() => setView('table')} />}
      {view === 'level3' && <RecognizeLevel3 lang={lang} onFinish={() => setView('table')} />}
      {view === 'match' && <MatchFormsGame lang={lang} onFinish={() => setView('table')} />}
    </>
  );
}
