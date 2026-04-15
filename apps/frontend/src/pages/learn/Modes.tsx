// ════════════════════════════════════════════════════════════════════════════
// Lightning.tsx — no reveal button, instant pick, measures avg response time
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef }   from 'react';
import { Link }                          from 'react-router-dom';
import { motion, AnimatePresence }        from 'framer-motion';
import { useTranslation }                 from 'react-i18next';
import { useAuthStore }                   from '../../store/authStore';
import { useSaveSession }                 from '../../hooks/useProgress';
import { useLeaveWarning }               from '../../hooks/useLeaveWarning';
import { SessionResult }                  from '../../components/learn/SessionResult';
import { Button }                         from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName } from '@arabic/shared';

function shuffle<T>(a: T[]): T[] { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }
function makeOpts(c: ArabicLetter): ArabicLetter[] { return shuffle([c,...shuffle(LETTERS.filter(l=>l.code!==c.code)).slice(0,3)]); }

const QUIZ_LEN = 20;

export function LightningPage() {
  const { t }    = useTranslation('learn');
  const lang     = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user     = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  const [phase, setPhase]   = useState<'start'|'session'|'result'>('start');
  useLeaveWarning(phase === 'session');
  const [queue, setQueue]   = useState<ArabicLetter[]>([]);
  const [current, setCurrent] = useState<ArabicLetter|null>(null);
  const [options, setOptions] = useState<ArabicLetter[]>([]);
  const [score, setScore]   = useState(0);
  const [answered, setAnswered] = useState<string|null>(null);
  const [results, setResults] = useState<{letterCode:string;correct:boolean}[]>([]);
  const [times, setTimes]   = useState<number[]>([]);
  const startRef = useRef(0);
  const startTime = useRef(0);

  const next = (q: ArabicLetter[]) => {
    if (q.length === 0) { return; }
    const card = q[0];
    setQueue(q.slice(1));
    setCurrent(card);
    setOptions(makeOpts(card));
    setAnswered(null);
    startRef.current = Date.now();
  };

  const startSession = () => {
    const q = shuffle([...LETTERS, ...shuffle(LETTERS)]).slice(0, QUIZ_LEN);
    setScore(0); setResults([]); setTimes([]);
    startTime.current = Date.now();
    setPhase('session');
    setQueue(q.slice(1)); setCurrent(q[0]); setOptions(makeOpts(q[0])); setAnswered(null);
    startRef.current = Date.now();
  };

  const pick = (opt: ArabicLetter) => {
    if (answered || !current) return;
    const ok  = opt.code === current.code;
    const ms  = Date.now() - startRef.current;
    setAnswered(opt.code);
    setTimes(t => [...t, ms]);
    const newR = [...results, { letterCode: current.code, correct: ok }];
    setResults(newR);
    if (ok) setScore(s => s + 1);
    const remaining = queue;
    setTimeout(() => {
      if (newR.length >= QUIZ_LEN || remaining.length === 0) {
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        save({ mode:'lightning', score: ok ? score+1 : score, totalQ: QUIZ_LEN, durationSec: dur, letterResults: newR });
        setPhase('result');
      } else {
        next(remaining);
      }
    }, 350);
  };

  const avgTime = times.length ? Math.round(times.reduce((a,b)=>a+b,0) / times.length / 100) / 10 : 0;

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center">
      <p className="font-scheherazade text-6xl text-gold">🌩️</p>
      <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('lightning.title')}</h1>
      <p className="text-[#9a8a6a] font-raleway max-w-xs">{t('lightning.subtitle')}</p>
      <Button size="lg" onClick={startSession}>{t('lightning.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
      <SessionResult score={score} total={QUIZ_LEN} mode="lightning"
        level={user?.level ?? 'beginner'} durationSec={Math.round(times.reduce((a,b)=>a+b,0)/1000)}
        onRestart={startSession} />
      <p className="font-cinzel text-xs text-[#9a8a6a]">{t('lightning.avg_time', { n: avgTime })}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 gap-6">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4">
        <Link to="/learn" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('lightning.title')}</h1>
      </div>
      <div className="w-full max-w-sm flex justify-between font-cinzel text-xs text-[#9a8a6a]">
        <span>Вопрос {results.length + 1} / {QUIZ_LEN}</span>
        <span>✓ {score}</span>
      </div>
      <div className="w-full max-w-sm h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-dim to-gold-light transition-all"
             style={{ width: `${results.length / QUIZ_LEN * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div key={current.code} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                       rounded-3xl w-full max-w-sm h-52 flex items-center justify-center">
            <p className="font-scheherazade text-[8rem] leading-none text-gold-light select-none">{current.code}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {options.map(opt => {
          const isA = answered === opt.code;
          const isC = opt.code === current?.code;
          let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)] text-[#f0e6cc]';
          if (answered) { if(isC) cls='border-[rgba(76,175,120,0.5)] bg-[rgba(76,175,120,0.15)] text-[#4caf78]'; else if(isA) cls='border-[rgba(201,80,80,0.4)] bg-[rgba(201,80,80,0.15)] text-[#c95050]'; }
          return (
            <button key={opt.code} onClick={() => pick(opt)} disabled={!!answered}
              className={`font-cinzel text-sm tracking-wide uppercase py-4 rounded-2xl border transition-all ${cls}
                          ${!answered ? 'hover:border-[rgba(201,168,76,0.35)] hover:-translate-y-px' : ''} disabled:cursor-default`}>
              {getLetterName(opt, lang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Memory.tsx — flip pairs, find matches
// ════════════════════════════════════════════════════════════════════════════
const MEMORY_LEVELS = [
  { level: 1, pairs: 6,  cols: 4, label: '6' },
  { level: 2, pairs: 10, cols: 5, label: '10' },
  { level: 3, pairs: 14, cols: 7, label: '14' },
  { level: 4, pairs: 28, cols: 7, label: '28' },
] as const;

export function MemoryPage() {
  const { t }    = useTranslation('learn');
  const lang     = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user     = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  type Card = { id: string; letterCode: string; kind: 'letter'|'name'; matched: boolean; flipped: boolean };

  const [phase, setPhase] = useState<'start'|'level-select'|'session'|'result'>('start');
  useLeaveWarning(phase === 'session');
  const [memoryLevel, setMemoryLevel] = useState(0);
  const [levelLetters, setLevelLetters] = useState<ArabicLetter[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [found, setFound] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (phase !== 'session') return;
    const id = setInterval(() => setElapsed(Math.round((Date.now()-startTime)/1000)), 1000);
    return () => clearInterval(id);
  }, [phase, startTime]);

  const startWithLevel = (lvlIdx: number) => {
    const lvl = MEMORY_LEVELS[lvlIdx];
    const letters = LETTERS.slice(0, lvl.pairs);
    const deck: Card[] = shuffle([
      ...letters.map(l => ({ id:`l-${l.code}`, letterCode:l.code, kind:'letter' as const, matched:false, flipped:false })),
      ...letters.map(l => ({ id:`n-${l.code}`, letterCode:l.code, kind:'name'   as const, matched:false, flipped:false })),
    ]);
    setMemoryLevel(lvlIdx);
    setLevelLetters(letters);
    setCards(deck); setSelected([]); setFound(0); setLocked(false);
    setStartTime(Date.now()); setElapsed(0); setPhase('session');
  };

  const flip = (id: string) => {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.matched || card.flipped || selected.includes(id)) return;

    const newSel = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? {...c, flipped:true} : c));

    if (newSel.length < 2) { setSelected(newSel); return; }

    setLocked(true);
    const [a, b] = newSel.map(sid => cards.find(c => c.id === sid)!);
    if (a.letterCode === b.letterCode && a.kind !== b.kind) {
      const totalPairs = levelLetters.length;
      const newFound = found + 1;
      setCards(prev => prev.map(c => newSel.includes(c.id) ? {...c, matched:true} : c));
      setFound(newFound);
      setSelected([]);
      setLocked(false);
      if (newFound === totalPairs) {
        const dur = Math.round((Date.now()-startTime)/1000);
        save({ mode:'memory', score:totalPairs, totalQ:totalPairs, durationSec:dur, letterResults: levelLetters.map(l=>({letterCode:l.code,correct:true})) });
        setPhase('result');
      }
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(c => newSel.includes(c.id) && !c.matched ? {...c, flipped:false} : c));
        setSelected([]); setLocked(false);
      }, 900);
    }
  };

  const timeStr = `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-scheherazade text-6xl text-gold">🧠</p>
      <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('memory.title')}</h1>
      <p className="text-[#9a8a6a] font-raleway max-w-xs">{t('memory.subtitle')}</p>
      <Button size="lg" onClick={() => setPhase('level-select')}>{t('memory.title')}</Button>
    </div>
  );

  if (phase === 'level-select') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center">
      <p className="font-scheherazade text-5xl text-gold">🧠</p>
      <h2 className="font-cinzel text-lg tracking-widest text-[#f0e6cc]">
        {t('memory.subtitle')}
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {MEMORY_LEVELS.map((lvl, idx) => (
          <button key={lvl.level} onClick={() => startWithLevel(idx)}
            className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                       rounded-2xl p-5 flex flex-col items-center gap-2
                       hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-px transition-all">
            <span className="font-cinzel text-2xl text-gold-light">{lvl.level}</span>
            <span className="font-cinzel text-xs tracking-widest text-[#f0e6cc]">
              {lvl.pairs} {t('memory.pairs', { found: lvl.pairs, total: lvl.pairs }).split(':')[0]}
            </span>
            <span className="font-cinzel text-[0.55rem] text-[#9a8a6a]">
              {lvl.level === 1 ? '⭐' : lvl.level === 2 ? '⭐⭐' : lvl.level === 3 ? '⭐⭐⭐' : '🏆'}
            </span>
          </button>
        ))}
      </div>
      <button onClick={() => setPhase('start')}
        className="font-cinzel text-xs tracking-widest text-[#9a8a6a] hover:text-[#f0e6cc] transition-colors">
        {t('back', { ns: 'common', defaultValue: '←' })}
      </button>
    </div>
  );

  if (phase === 'result') {
    const totalPairs = levelLetters.length;
    const hasNextLevel = memoryLevel < MEMORY_LEVELS.length - 1;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <SessionResult score={totalPairs} total={totalPairs} mode="memory"
          level={user?.level ?? 'beginner'} durationSec={elapsed} onRestart={() => startWithLevel(memoryLevel)} />
        {hasNextLevel && (
          <Button size="lg" onClick={() => startWithLevel(memoryLevel + 1)}>
            {t('next', { ns: 'common' })} →
          </Button>
        )}
        <button onClick={() => setPhase('level-select')}
          className="font-cinzel text-xs tracking-widest text-[#9a8a6a] hover:text-[#f0e6cc] transition-colors mt-2">
          {t('restart', { ns: 'common' })}
        </button>
      </div>
    );
  }

  const lvl = MEMORY_LEVELS[memoryLevel];
  const totalPairs = levelLetters.length;

  return (
    <div className="max-w-2xl mx-auto px-2 py-4">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4 px-2">
        <Link to="/learn" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('memory.title')}</h1>
      </div>
      <div className="flex justify-between font-cinzel text-xs text-[#9a8a6a] mb-4 px-2">
        <span>{t('memory.pairs', { found, total: totalPairs })}</span>
        <span>{t('memory.time', { t: timeStr })}</span>
      </div>
      <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${lvl.cols}, minmax(0, 1fr))` }}>
        {cards.map(card => (
          <button key={card.id} onClick={() => flip(card.id)}
            className={`aspect-square rounded-xl border transition-all duration-300 text-center flex items-center justify-center p-1
              ${card.matched  ? 'border-[rgba(76,175,120,0.4)] bg-[rgba(76,175,120,0.12)]' :
                card.flipped  ? 'border-gold-dim bg-[rgba(201,168,76,0.1)]' :
                                'border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(201,168,76,0.3)]'}`}>
            {(card.flipped || card.matched) ? (
              card.kind === 'letter'
                ? <span className="font-scheherazade text-xl text-gold-light">{card.letterCode}</span>
                : <span className="font-cinzel text-[0.45rem] tracking-wide text-[#f0e6cc] leading-tight">
                    {getLetterName(LETTERS.find(l=>l.code===card.letterCode)!, lang)}
                  </span>
            ) : (
              <span className="text-[#3a2d10] text-lg">✦</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Listen.tsx — Web Speech API reads letter name, pick the glyph
// ════════════════════════════════════════════════════════════════════════════
export function ListenPage() {
  const { t }    = useTranslation('learn');
  const lang     = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user     = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  const [phase, setPhase] = useState<'start'|'session'|'result'>('start');
  useLeaveWarning(phase === 'session');
  const [queue, setQueue] = useState<ArabicLetter[]>([]);
  const [current, setCurrent] = useState<ArabicLetter|null>(null);
  const [options, setOptions] = useState<ArabicLetter[]>([]);
  const [score, setScore]  = useState(0);
  const [answered, setAnswered] = useState<string|null>(null);
  const [results, setResults]   = useState<{letterCode:string;correct:boolean}[]>([]);
  const startTime = useRef(0);
  const TOTAL = 15;

  const [ttsAvailable] = useState(() => typeof window !== 'undefined' && !!window.speechSynthesis);

  const speak = (letter: ArabicLetter) => {
    if (!ttsAvailable) return;
    window.speechSynthesis.cancel();
    // Use Arabic pronunciation for the letter character
    const u = new SpeechSynthesisUtterance(letter.code);
    u.lang = 'ar-SA';
    u.rate = 0.7;
    window.speechSynthesis.speak(u);
  };

  const next = (q: ArabicLetter[], r: typeof results) => {
    if (r.length >= TOTAL || q.length === 0) {
      save({ mode:'listen', score, totalQ:TOTAL, durationSec:Math.round((Date.now()-startTime.current)/1000), letterResults:r });
      setPhase('result'); return;
    }
    const card = q[0]; setQueue(q.slice(1)); setCurrent(card);
    setOptions(makeOpts(card)); setAnswered(null);
    setTimeout(() => speak(card), 300);
  };

  const startSession = () => {
    const q = shuffle([...LETTERS, ...shuffle(LETTERS)]).slice(0, TOTAL);
    setScore(0); setResults([]); startTime.current = Date.now(); setPhase('session');
    setQueue(q.slice(1)); setCurrent(q[0]); setOptions(makeOpts(q[0])); setAnswered(null);
    setTimeout(() => speak(q[0]), 400);
  };

  const pick = (opt: ArabicLetter) => {
    if (answered || !current) return;
    const ok = opt.code === current.code;
    setAnswered(opt.code);
    const newR = [...results, { letterCode:current.code, correct:ok }];
    setResults(newR);
    if (ok) setScore(s=>s+1);
    setTimeout(() => next(queue, newR), 500);
  };

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl">🔊</p>
      <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('listen.title')}</h1>
      <p className="text-[#9a8a6a] font-raleway max-w-xs">{t('listen.subtitle')}</p>
      <Button size="lg" onClick={startSession}>{t('listen.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <SessionResult score={score} total={TOTAL} mode="listen"
        level={user?.level ?? 'beginner'} durationSec={Math.round((Date.now()-startTime.current)/1000)}
        onRestart={startSession} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 gap-6">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4">
        <Link to="/learn" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('listen.title')}</h1>
      </div>
      <div className="w-full max-w-sm h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-dim to-gold-light transition-all"
             style={{ width: `${results.length / TOTAL * 100}%` }} />
      </div>
      <div className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                      rounded-3xl w-full max-w-sm h-44 flex flex-col items-center justify-center gap-4">
        {ttsAvailable ? (
          <>
            <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">🔊 {t('listen.subtitle')}</p>
            <button onClick={() => current && speak(current)}
              className="font-cinzel text-sm tracking-widest text-gold border border-gold-dim
                         rounded-full px-5 py-2 hover:bg-[rgba(201,168,76,0.1)] transition-all">
              {t('listen.play')}
            </button>
          </>
        ) : (
          <>
            <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase">
              {t('listen.play')}
            </p>
            {current && (
              <p className="font-cinzel text-2xl text-gold-light">{getLetterName(current, lang)}</p>
            )}
          </>
        )}
        {answered && current && (
          <p className="font-cinzel text-sm text-[#f0e6cc] mt-1">
            {getLetterName(current, lang)}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {options.map(opt => {
          const isA = answered===opt.code; const isC = opt.code===current?.code;
          let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)] text-gold-light';
          if (answered) { if(isC) cls='border-[rgba(76,175,120,0.5)] bg-[rgba(76,175,120,0.15)] text-[#4caf78]'; else if(isA) cls='border-[rgba(201,80,80,0.4)] bg-[rgba(201,80,80,0.15)] text-[#c95050]'; }
          return (
            <button key={opt.code} onClick={()=>pick(opt)} disabled={!!answered}
              className={`font-scheherazade text-5xl py-6 rounded-2xl border transition-all ${cls}
                          ${!answered?'hover:border-[rgba(201,168,76,0.35)] hover:-translate-y-px':''}  disabled:cursor-default`}>
              {opt.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Find.tsx — find the target letter in a row of Arabic text
// ════════════════════════════════════════════════════════════════════════════
const FORM_KEYS = ['iso', 'ini', 'med', 'fin'] as const;
function randomForm(letter: ArabicLetter): string {
  const form = FORM_KEYS[Math.floor(Math.random() * FORM_KEYS.length)];
  return letter[form];
}

export function FindPage() {
  const { t }    = useTranslation('learn');
  const lang     = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user     = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  const [phase, setPhase]   = useState<'start'|'session'|'result'>('start');
  useLeaveWarning(phase === 'session');
  const [target, setTarget] = useState<ArabicLetter|null>(null);
  const [targetForm, setTargetForm] = useState<string>('');
  const [row, setRow]       = useState<{letter: ArabicLetter; form: string}[]>([]);
  const [score, setScore]   = useState(0);
  const [answered, setAnswered] = useState<number|null>(null);
  const [results, setResults]   = useState<{letterCode:string;correct:boolean}[]>([]);
  const [round, setRound]   = useState(0);
  const startTime = useRef(0);
  const TOTAL = 15;
  const GRID_SIZE = 12;

  const nextRound = (r: typeof results, s: number) => {
    if (r.length >= TOTAL) {
      save({ mode:'find', score:s, totalQ:TOTAL, durationSec:Math.round((Date.now()-startTime.current)/1000), letterResults:r });
      setPhase('result'); return;
    }
    const tgt    = LETTERS[Math.floor(Math.random()*LETTERS.length)];
    const tgtForm = randomForm(tgt);
    const pool = shuffle(LETTERS.filter(l=>l.code!==tgt.code)).slice(0, GRID_SIZE - 1);
    const rowItems = shuffle([
      ...pool.map(l => ({ letter: l, form: randomForm(l) })),
      { letter: tgt, form: tgtForm },
    ]);
    setTarget(tgt); setTargetForm(tgtForm); setRow(rowItems); setAnswered(null); setRound(r.length);
  };

  const startSession = () => {
    setScore(0); setResults([]); startTime.current = Date.now(); setPhase('session');
    nextRound([], 0);
  };

  const pick = (idx: number) => {
    if (answered !== null || !target) return;
    const ok = row[idx].letter.code === target.code;
    setAnswered(idx);
    const newR = [...results, { letterCode:target.code, correct:ok }];
    setResults(newR);
    const newS = ok ? score+1 : score;
    if (ok) setScore(newS);
    setTimeout(() => nextRound(newR, newS), 600);
  };

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl">🔍</p>
      <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('find.title')}</h1>
      <p className="text-[#9a8a6a] font-raleway max-w-xs">{t('find.subtitle')}</p>
      <Button size="lg" onClick={startSession}>{t('find.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <SessionResult score={score} total={TOTAL} mode="find"
        level={user?.level ?? 'beginner'} durationSec={Math.round((Date.now()-startTime.current)/1000)}
        onRestart={startSession} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 gap-8">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4">
        <Link to="/learn" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('find.title')}</h1>
      </div>
      <div className="w-full max-w-sm h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-dim to-gold-light" style={{ width:`${round/TOTAL*100}%` }} />
      </div>
      {target && (
        <div className="text-center">
          <p className="font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase mb-2">{t('find.task')}</p>
          <p className="font-cinzel text-4xl text-gold-light drop-shadow-[0_0_30px_rgba(201,168,76,0.5)]">
            {getLetterName(target, lang)}
          </p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-3 w-full max-w-sm" dir="rtl">
        {row.map((item, i) => {
          const isA = answered === i; const isC = item.letter.code === target?.code;
          let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)] text-gold-light';
          if (answered !== null) { if(isC) cls='border-[rgba(76,175,120,0.5)] bg-[rgba(76,175,120,0.15)] text-[#4caf78]'; else if(isA) cls='border-[rgba(201,80,80,0.4)] bg-[rgba(201,80,80,0.15)] text-[#c95050]'; }
          return (
            <button key={i} onClick={()=>pick(i)} disabled={answered!==null}
              className={`font-scheherazade text-4xl py-5 rounded-2xl border transition-all ${cls}
                          ${answered===null?'hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-px':''} disabled:cursor-default`}>
              {item.form}
            </button>
          );
        })}
      </div>
    </div>
  );
}
