import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../../store/authStore';
import { useSaveSession }  from '../../hooks/useProgress';
import { useLeaveWarning } from '../../hooks/useLeaveWarning';
import { SessionResult }   from '../../components/learn/SessionResult';
import { Button }          from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName, getLetterAssociation } from '@arabic/shared';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardsPage() {
  const { t }    = useTranslation('learn');
  const lang     = (useAuthStore((s) => s.user?.language) ?? 'ru') as any;
  const user     = useAuthStore((s) => s.user);
  const { mutate: saveSession } = useSaveSession();

  const [phase, setPhase]     = useState<'start' | 'session' | 'result'>('start');
  useLeaveWarning(phase === 'session');
  const navigate = useNavigate();
  const [deck, setDeck]       = useState<ArabicLetter[]>([]);
  const [idx, setIdx]         = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown]     = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<{ letterCode: string; correct: boolean }[]>([]);

  const overlayRef = useRef<HTMLDivElement>(null);

  // Timer tick
  useEffect(() => {
    if (phase !== 'session') return;
    const id = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [phase, startTime]);

  // Keyboard
  useEffect(() => {
    if (phase !== 'session') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!flipped) reveal(); }
      else if (e.key === 'ArrowRight' || e.key === 'l') { if (flipped) answer(true); }
      else if (e.key === 'ArrowLeft'  || e.key === 'j') { if (flipped) answer(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, flipped, idx]);

  const startSession = () => {
    setDeck(shuffle(LETTERS));
    setIdx(0); setKnown(0); setAttempts(0); setFlipped(false);
    setResults([]); setStartTime(Date.now()); setElapsed(0);
    setPhase('session');
  };

  const reveal = () => setFlipped(true);

  const answer = useCallback((ok: boolean) => {
    const letter = deck[idx];
    const newResults = [...results, { letterCode: letter.code, correct: ok }];
    setResults(newResults);
    setAttempts((a) => a + 1);

    let newDeck: ArabicLetter[];
    let newKnown = known;
    if (ok) {
      newKnown = known + 1;
      setKnown(newKnown);
      newDeck = deck.filter((_, i) => i !== idx);
    } else {
      const removed = [...deck];
      const [card]  = removed.splice(idx, 1);
      removed.push(card); // always to end
      newDeck = removed;
    }

    if (newDeck.length === 0) {
      const dur = Math.round((Date.now() - startTime) / 1000);
      saveSession({ mode: 'flashcard', score: newKnown, totalQ: LETTERS.length, durationSec: dur, letterResults: newResults });
      setDeck(newDeck);
      setPhase('result');
      return;
    }

    // Reset card instantly (no flip-back animation)
    setFlipped(false);
    setDeck(newDeck);
    setIdx((i) => (i >= newDeck.length ? 0 : i));
  }, [deck, idx, known, results, startTime]);

  const current = deck[idx];
  const timeStr = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="font-scheherazade text-7xl text-gold mb-2">بسم</p>
        <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('flashcard.title')}</h1>
        <p className="text-[#9a8a6a] mt-2 font-raleway">{t('flashcard.subtitle')}</p>
      </motion.div>
      <div className="flex gap-3 flex-wrap justify-center">
        {[t('flashcard.hint_reveal'), t('flashcard.hint_know'), t('flashcard.hint_dontknow')].map((h) => (
          <span key={h} className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase
                                    px-3 py-1.5 rounded-full border border-[rgba(201,168,76,0.15)]">{h}</span>
        ))}
      </div>
      <Button size="lg" onClick={startSession}>{t('flashcard.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <SessionResult
        score={known} total={LETTERS.length} mode="flashcard"
        level={user?.level ?? 'beginner'} durationSec={elapsed} attempts={attempts}
        onRestart={startSession}
      />
    </div>
  );

  if (!current) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4">
        <Link to="/learn" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('flashcard.title')}</h1>
      </div>
      {/* Stats bar */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between font-cinzel text-xs text-[#9a8a6a] mb-2">
          <span>{t('flashcard.card_of', { current: idx + 1, total: deck.length })}</span>
          <span>{t('flashcard.known_of', { known, total: LETTERS.length })}</span>
        </div>
        <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-dim to-gold-light rounded-full transition-all duration-500"
            style={{ width: `${known / LETTERS.length * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 font-cinzel text-[0.65rem] text-[#9a8a6a]">
          <span>{t('flashcard.attempts', { n: attempts })}</span>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.code + flipped}
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md h-72 relative perspective-[1200px]"
          style={{ perspective: 1200 }}
        >
          <div
            className="w-full h-full relative preserve-3d transition-transform duration-[0.65s]"
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#201808] to-[#140f05]
                            border border-[#3a2d10] rounded-3xl flex flex-col items-center justify-center
                            shadow-[0_4px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(201,168,76,0.15)]"
                 style={{ backfaceVisibility: 'hidden' }}>

              {/* Blurred back preview */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1
                              pointer-events-none select-none"
                   style={{ filter: 'blur(12px)', opacity: 0.4 }}>
                <p className="font-scheherazade text-5xl text-gold">{current.code}</p>
                <p className="font-cinzel text-base text-[#f0e6cc]">{getLetterName(current, lang)}</p>
              </div>

              {/* Opaque overlay */}
              <div ref={overlayRef}
                   className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center
                              bg-gradient-to-br from-[rgba(32,24,8,0.97)] to-[rgba(20,15,5,0.98)]
                              transition-opacity duration-200"
                   style={{ opacity: flipped ? 0 : 1 }}>
                <p className="font-scheherazade text-[9rem] leading-none text-gold-light
                               drop-shadow-[0_0_60px_rgba(201,168,76,0.5)] select-none">
                  {current.code}
                </p>
                <p className="font-cinzel text-[0.6rem] tracking-[4px] text-[#9a8a6a] uppercase absolute bottom-5">
                  Назови букву
                </p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#201808] to-[#140f05]
                            border border-[#3a2d10] rounded-3xl flex flex-col items-center justify-center gap-2
                            shadow-[0_4px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(201,168,76,0.15)] p-6"
                 style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <p className="font-scheherazade text-5xl text-gold">{current.code}</p>
              <p className="font-cinzel text-xl font-semibold text-[#f0e6cc] tracking-widest">
                {getLetterName(current, lang)}
              </p>
              <p className="text-sm text-gold-dim">{current.transcription}</p>
              {getLetterAssociation(current, lang) && (
                <p className="font-raleway text-xs italic text-[#9a8a6a] mt-1 max-w-[16rem] text-center">
                  {getLetterAssociation(current, lang)}
                </p>
              )}
              <div className="w-14 h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent my-1" />
              <div className="flex gap-4">
                {(['ini', 'med', 'fin', 'iso'] as const).map((pos) => (
                  <div key={pos} className="text-center">
                    <p className="font-cinzel text-[0.45rem] tracking-widest text-[#9a8a6a] uppercase mb-1">
                      {pos === 'iso' ? 'Изол.' : pos === 'ini' ? 'Нач.' : pos === 'med' ? 'Сред.' : 'Кон.'}
                    </p>
                    <p className="font-scheherazade text-xl text-[#f0e6cc]">{current[pos]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-md">
        {!flipped ? (
          <Button size="lg" className="w-full max-w-xs" onClick={reveal}>
            {t('flashcard.show_answer')}
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 w-full"
          >
            <Button variant="danger" size="lg" className="flex-1" onClick={() => answer(false)}>
              {t('flashcard.dont_know')}
            </Button>
            <Button variant="success" size="lg" className="flex-1" onClick={() => answer(true)}>
              {t('flashcard.know')}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
