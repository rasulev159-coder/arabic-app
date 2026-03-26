import { useRef, useEffect, useState } from 'react';
import { useTranslation }   from 'react-i18next';
import { useAuthStore }     from '../../store/authStore';
import { useSaveSession }   from '../../hooks/useProgress';
import { Button }           from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName } from '@arabic/shared';

function shuffle<T>(a: T[]): T[] { const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b; }

export function WritePage() {
  const { t }  = useTranslation('learn');
  const lang   = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user   = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  const [phase, setPhase]   = useState<'start'|'session'|'result'>('start');
  const [queue, setQueue]   = useState<ArabicLetter[]>([]);
  const [current, setCurrent] = useState<ArabicLetter|null>(null);
  const [compared, setCompared] = useState(false);
  const [score, setScore]   = useState(0);
  const [results, setResults]   = useState<{letterCode:string;correct:boolean}[]>([]);
  const startTime = useRef(0);
  const TOTAL = 10;

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const drawing      = useRef(false);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#e8c96d';
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    clearCanvas();
  }, [current]);

  const clearCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCompared(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const {x, y} = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(x, y);
    drawing.current = true;
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const {x, y} = getPos(e, canvas);
    ctx.lineTo(x, y); ctx.stroke();
  };

  const onEnd = () => { drawing.current = false; };

  const compare = () => {
    if (!current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    // Draw semi-transparent template letter
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#c9a84c';
    ctx.font = `${canvas.height * 0.7}px "Scheherazade New"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(current.code, canvas.width / 2, canvas.height / 2);
    ctx.restore();
    setCompared(true);
  };

  const markResult = (ok: boolean) => {
    if (!current) return;
    const newR = [...results, { letterCode: current.code, correct: ok }];
    setResults(newR);
    if (ok) setScore(s => s+1);
    clearCanvas();
    if (newR.length >= TOTAL || queue.length === 0) {
      save({ mode:'write', score: ok ? score+1 : score, totalQ: TOTAL, durationSec: Math.round((Date.now()-startTime.current)/1000), letterResults: newR });
      setPhase('result'); return;
    }
    setCurrent(queue[0]); setQueue(q => q.slice(1));
  };

  const startSession = () => {
    const q = shuffle(LETTERS);
    setQueue(q.slice(1)); setCurrent(q[0]); setResults([]); setScore(0);
    startTime.current = Date.now(); setPhase('session');
  };

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl">✍️</p>
      <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('write.title')}</h1>
      <p className="text-[#9a8a6a] font-raleway max-w-xs">{t('write.subtitle')}</p>
      <Button size="lg" onClick={startSession}>{t('write.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <p className="font-scheherazade text-7xl text-gold mb-2">✍️</p>
        <p className="font-cinzel text-2xl text-[#f0e6cc]">{score} / {TOTAL}</p>
        <p className="font-cinzel text-xs text-[#9a8a6a] mt-2 tracking-widest">НАПИСАНО ВЕРНО</p>
      </div>
      <Button size="lg" onClick={() => setPhase('start')}>Начать заново</Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between font-cinzel text-xs text-[#9a8a6a]">
        <span>Буква {results.length + 1} / {TOTAL}</span>
        <span>✓ {score}</span>
      </div>

      {/* Template */}
      {current && (
        <div className="text-center">
          <p className="font-cinzel text-[0.65rem] tracking-widest text-[#9a8a6a] uppercase mb-2">Образец</p>
          <p className="font-scheherazade text-8xl text-gold drop-shadow-[0_0_40px_rgba(201,168,76,0.5)]">
            {current.code}
          </p>
          <p className="font-cinzel text-sm text-[#9a8a6a] mt-1">{getLetterName(current, lang)}</p>
        </div>
      )}

      {/* Canvas */}
      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.15)] rounded-3xl overflow-hidden">
        <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase text-center pt-3">
          Нарисуй букву
        </p>
        <canvas
          ref={canvasRef}
          width={360} height={280}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={clearCanvas}>
          {t('write.clear')}
        </Button>
        {!compared ? (
          <Button size="sm" className="flex-1" onClick={compare}>
            {t('write.compare')}
          </Button>
        ) : (
          <>
            <Button variant="danger"  size="sm" className="flex-1" onClick={() => markResult(false)}>✗</Button>
            <Button variant="success" size="sm" className="flex-1" onClick={() => markResult(true)}>✓</Button>
          </>
        )}
      </div>
      {compared && (
        <p className="font-cinzel text-xs text-center text-[#9a8a6a] tracking-widest">
          Похоже? Нажми ✓ или ✗
        </p>
      )}
    </div>
  );
}
