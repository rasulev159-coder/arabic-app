import { useRef, useEffect, useState } from 'react';
import { Link }             from 'react-router-dom';
import { useTranslation }   from 'react-i18next';
import { useAuthStore }     from '../../store/authStore';
import { useSaveSession }   from '../../hooks/useProgress';
import { useLeaveWarning }  from '../../hooks/useLeaveWarning';
import { Button }           from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName } from '@arabic/shared';

function shuffle<T>(a: T[]): T[] { const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b; }

export function WritePage() {
  const { t }  = useTranslation('learn');
  const lang   = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user   = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  const [phase, setPhase]   = useState<'start'|'session'|'result'>('start');
  useLeaveWarning(phase === 'session');
  const [queue, setQueue]   = useState<ArabicLetter[]>([]);
  const [current, setCurrent] = useState<ArabicLetter|null>(null);
  const [compared, setCompared] = useState(false);
  const [similarity, setSimilarity] = useState<number|null>(null);
  const [autoResult, setAutoResult] = useState<'correct'|'incorrect'|'manual'|null>(null);
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
    setSimilarity(null);
    setAutoResult(null);
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
    const w = canvas.width, h = canvas.height;

    // Get drawn pixels before overlaying template
    const drawnData = ctx.getImageData(0, 0, w, h).data;

    // Render template to an offscreen canvas for comparison
    const offscreen = document.createElement('canvas');
    offscreen.width = w; offscreen.height = h;
    const offCtx = offscreen.getContext('2d')!;
    offCtx.fillStyle = '#c9a84c';
    offCtx.font = `${h * 0.7}px "Scheherazade New"`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(current.code, w / 2, h / 2);
    const templateData = offCtx.getImageData(0, 0, w, h).data;

    // Compare pixel overlap
    let drawnPixels = 0, templatePixels = 0, overlap = 0;
    for (let i = 3; i < drawnData.length; i += 4) {
      const dAlpha = drawnData[i] > 30;
      const tAlpha = templateData[i] > 30;
      if (dAlpha) drawnPixels++;
      if (tAlpha) templatePixels++;
      if (dAlpha && tAlpha) overlap++;
    }

    const total = Math.max(drawnPixels, templatePixels, 1);
    const pct = Math.round((overlap / total) * 100);
    setSimilarity(pct);

    if (pct > 60) setAutoResult('correct');
    else if (pct < 40) setAutoResult('incorrect');
    else setAutoResult('manual');

    // Draw semi-transparent template letter on the user canvas
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#c9a84c';
    ctx.font = `${h * 0.7}px "Scheherazade New"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(current.code, w / 2, h / 2);
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
        <p className="font-cinzel text-xs text-[#9a8a6a] mt-2 tracking-widest uppercase">{t('result.score', { score, total: TOTAL })}</p>
      </div>
      <Button size="lg" onClick={() => setPhase('start')}>{t('restart', { ns: 'common' })}</Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Game header */}
      <div className="w-full max-w-md flex items-center gap-3 mb-4">
        <Link to="/dashboard" className="text-[#9a8a6a] hover:text-gold transition-colors text-lg">&larr;</Link>
        <h1 className="font-cinzel text-sm tracking-widest text-[#9a8a6a] uppercase">{t('write.title')}</h1>
      </div>
      {/* Header */}
      <div className="flex justify-between font-cinzel text-xs text-[#9a8a6a]">
        <span>Буква {results.length + 1} / {TOTAL}</span>
        <span>✓ {score}</span>
      </div>

      {/* Template */}
      {current && (
        <div className="text-center">
          <p className="font-cinzel text-[0.65rem] tracking-widest text-[#9a8a6a] uppercase mb-2">
            {lang === 'ru' ? 'Напиши букву' : lang === 'uz' ? 'Harfni yozing' : 'Write the letter'}
          </p>
          <p className="font-cinzel text-4xl text-gold-light drop-shadow-[0_0_40px_rgba(201,168,76,0.5)]">
            {getLetterName(current, lang)}
          </p>
          {compared && (
            <p className="font-scheherazade text-6xl text-gold mt-2 drop-shadow-[0_0_30px_rgba(201,168,76,0.4)]">
              {current.code}
            </p>
          )}
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
        ) : autoResult === 'manual' ? (
          <>
            <Button variant="danger"  size="sm" className="flex-1" onClick={() => markResult(false)}>✗</Button>
            <Button variant="success" size="sm" className="flex-1" onClick={() => markResult(true)}>✓</Button>
          </>
        ) : (
          <Button size="sm" className="flex-1" onClick={() => markResult(autoResult === 'correct')}>
            {t('next', { ns: 'common' })}
          </Button>
        )}
      </div>
      {compared && similarity !== null && (
        <div className="text-center">
          <p className="font-cinzel text-sm text-gold tracking-widest">
            {lang === 'ru' ? 'Сходство' : lang === 'uz' ? "O'xshashlik" : 'Similarity'}: {similarity}%
          </p>
          {autoResult === 'correct' && (
            <p className="font-cinzel text-xs text-[#4caf78] tracking-widest mt-1">
              {lang === 'ru' ? 'Отлично!' : lang === 'uz' ? "A'lo!" : 'Excellent!'}
            </p>
          )}
          {autoResult === 'incorrect' && (
            <p className="font-cinzel text-xs text-[#c95050] tracking-widest mt-1">
              {lang === 'ru' ? 'Попробуй ещё' : lang === 'uz' ? "Yana urinib ko'ring" : 'Try again'}
            </p>
          )}
          {autoResult === 'manual' && (
            <p className="font-cinzel text-xs text-[#9a8a6a] tracking-widest mt-1">
              {lang === 'ru' ? 'Похоже? Нажми ✓ или ✗' : lang === 'uz' ? "O'xshaydimi? ✓ yoki ✗ bosing" : 'Similar? Press ✓ or ✗'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
