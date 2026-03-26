import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../../store/authStore';
import { useSaveSession }  from '../../hooks/useProgress';
import { SessionResult }   from '../../components/learn/SessionResult';
import { Button }          from '../../components/ui/Button';
import { LETTERS, ArabicLetter, getLetterName, LetterGroup } from '@arabic/shared';

function shuffle<T>(a: T[]): T[] { const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b; }

const GROUPS: { id: LetterGroup | 'mix'; label: string; codes: string[] }[] = [
  { id:'btt', label:'ب ت ث', codes:['ب','ت','ث'] },
  { id:'jch', label:'ج ح خ', codes:['ج','ح','خ'] },
  { id:'dz',  label:'د ذ',   codes:['د','ذ'] },
  { id:'rz',  label:'ر ز',   codes:['ر','ز'] },
  { id:'ss',  label:'س ش',   codes:['س','ش'] },
  { id:'sd',  label:'ص ض',   codes:['ص','ض'] },
  { id:'tz',  label:'ط ظ',   codes:['ط','ظ'] },
  { id:'ag',  label:'ع غ',   codes:['ع','غ'] },
  { id:'fq',  label:'ف ق',   codes:['ف','ق'] },
  { id:'mix', label:'Всё вместе', codes:['ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق'] },
];

const POSITIONS = ['iso', 'ini', 'med', 'fin'] as const;
type Pos = typeof POSITIONS[number];

interface Question {
  type: 'iso' | 'pos' | 'name';
  badge: string; badgeCls: string;
  label: string;
  prompt: { kind: 'arabic' | 'text'; value: string };
  posTag?: string;
  options: { code: string; display: { kind: 'arabic' | 'text'; value: string } }[];
  answer: string;
}

function buildQuestion(letter: ArabicLetter, groupCodes: string[], lang: any): Question {
  const r = Math.random();
  const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  const wrongCodes = shuffle(groupCodes.filter(c => c !== letter.code));
  const padded = wrongCodes.length < 3
    ? [...wrongCodes, ...shuffle(LETTERS.map(l=>l.code).filter(c=>c!==letter.code&&!wrongCodes.includes(c)))]
    : wrongCodes;
  const opts4 = shuffle([letter.code, ...padded.slice(0, 3)]);
  const posLabels: Record<Pos, string> = { iso:'изолированная', ini:'нач. слова', med:'сер. слова', fin:'кон. слова' };

  if (r < 0.33) { // iso: show glyph → pick name
    return {
      type: 'iso', badge: 'Изолированная', badgeCls: 'text-gold border-gold-dim bg-[rgba(201,168,76,0.08)]',
      label: 'Как называется эта буква?',
      prompt: { kind:'arabic', value: letter.iso },
      options: opts4.map(c => { const l=LETTERS.find(x=>x.code===c)!; return { code:c, display:{ kind:'text', value:getLetterName(l,lang) } }; }),
      answer: letter.code,
    };
  }
  if (r < 0.66) { // pos: show form in position → pick name
    return {
      type: 'pos', badge: posLabels[pos], badgeCls: 'text-[#8ab4ff] border-[rgba(100,160,255,0.2)] bg-[rgba(100,160,255,0.06)]',
      label: 'Как называется эта буква?',
      prompt: { kind:'arabic', value: letter[pos] },
      posTag: posLabels[pos],
      options: opts4.map(c => { const l=LETTERS.find(x=>x.code===c)!; return { code:c, display:{ kind:'text', value:getLetterName(l,lang) } }; }),
      answer: letter.code,
    };
  }
  // name: show name → pick form
  return {
    type: 'name', badge: `Угадай форму (${posLabels[pos]})`, badgeCls: 'text-[#c8a0ff] border-[rgba(180,120,255,0.2)] bg-[rgba(180,120,255,0.06)]',
    label: 'Выбери правильную форму буквы',
    prompt: { kind:'text', value: getLetterName(letter, lang) },
    options: opts4.map(c => { const l=LETTERS.find(x=>x.code===c)!; return { code:c, display:{ kind:'arabic', value:l[pos] } }; }),
    answer: letter.code,
  };
}

const QUIZ_LEN = 12;

export function QuizPage() {
  const { t }    = useTranslation('learn');
  const lang     = (useAuthStore(s=>s.user?.language) ?? 'ru') as any;
  const user     = useAuthStore(s=>s.user);
  const { mutate: save } = useSaveSession();

  const [phase, setPhase]   = useState<'start'|'session'|'result'>('start');
  const [groupIdx, setGroupIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qi, setQi]         = useState(0);
  const [score, setScore]   = useState(0);
  const [answered, setAnswered] = useState<string|null>(null);
  const [results, setResults]   = useState<{letterCode:string;correct:boolean}[]>([]);
  const startTime = useRef(0);

  const startSession = (gIdx = groupIdx) => {
    const g = GROUPS[gIdx];
    const letters = shuffle(
      [...g.codes, ...g.codes, ...g.codes].map(c=>LETTERS.find(l=>l.code===c)!).filter(Boolean)
    ).slice(0, QUIZ_LEN);
    const qs = letters.map(l => buildQuestion(l, g.codes, lang));
    setQuestions(qs); setQi(0); setScore(0); setAnswered(null); setResults([]);
    startTime.current = Date.now(); setPhase('session');
  };

  const pick = (code: string) => {
    if (answered || !questions[qi]) return;
    const q  = questions[qi];
    const ok = code === q.answer;
    setAnswered(code);
    const newR = [...results, { letterCode: q.answer, correct: ok }];
    setResults(newR);
    if (ok) setScore(s=>s+1);
  };

  const next = () => {
    if (qi + 1 >= questions.length) {
      save({ mode:'quiz', score, totalQ:QUIZ_LEN, durationSec:Math.round((Date.now()-startTime.current)/1000), letterResults:results });
      setPhase('result'); return;
    }
    setQi(q => q + 1);
    setAnswered(null);
  };

  if (phase === 'start') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-5xl mb-3">🎯</p>
        <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">{t('quiz.title')}</h1>
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {GROUPS.map((g, i) => (
          <button key={g.id} onClick={() => setGroupIdx(i)}
            className={`font-cinzel text-[0.6rem] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all
              ${groupIdx === i ? 'border-gold-dim text-gold bg-[rgba(201,168,76,0.1)]' : 'border-[rgba(201,168,76,0.1)] text-[#9a8a6a] hover:text-gold'}`}>
            {g.label}
          </button>
        ))}
      </div>
      <Button size="lg" onClick={() => startSession()}>{t('quiz.title')}</Button>
    </div>
  );

  if (phase === 'result') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <SessionResult score={score} total={QUIZ_LEN} mode="quiz"
        level={user?.level ?? 'beginner'} durationSec={Math.round((Date.now()-startTime.current)/1000)}
        onRestart={() => setPhase('start')} />
    </div>
  );

  const q = questions[qi];
  if (!q) return null;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-5">
      <div className="w-full max-w-md">
        <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-gold-dim to-gold-light transition-all"
               style={{ width: `${qi/QUIZ_LEN*100}%` }} />
        </div>
        <div className="flex justify-between font-cinzel text-xs text-[#9a8a6a]">
          <span>{t('quiz.question_of', { n: qi+1, total: QUIZ_LEN })}</span>
          <span>✓ {score}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{opacity:0,scale:0.93}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
          className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10] rounded-3xl
                     w-full max-w-md p-6 flex flex-col items-center gap-3">
          <span className={`font-cinzel text-[0.55rem] tracking-[3px] uppercase px-3 py-1 rounded-full border ${q.badgeCls}`}>
            {q.badge}
          </span>
          <p className="font-cinzel text-[0.65rem] tracking-widest text-[#9a8a6a] uppercase">{q.label}</p>
          {q.prompt.kind === 'arabic'
            ? <p className="font-scheherazade text-7xl text-gold-light drop-shadow-[0_0_30px_rgba(201,168,76,0.4)]">{q.prompt.value}</p>
            : <p className="font-cinzel text-2xl text-gold-light tracking-widest">{q.prompt.value}</p>
          }

          <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
            {q.options.map(opt => {
              const isA = answered===opt.code; const isC = opt.code===q.answer;
              let cls = 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.04)] text-[#f0e6cc]';
              if (answered) { if(isC) cls='border-[rgba(76,175,120,0.5)] bg-[rgba(76,175,120,0.15)] text-[#4caf78]'; else if(isA) cls='border-[rgba(201,80,80,0.4)] bg-[rgba(201,80,80,0.15)] text-[#c95050]'; }
              return (
                <button key={opt.code} onClick={() => pick(opt.code)} disabled={!!answered}
                  className={`font-cinzel py-3 rounded-xl border transition-all ${cls}
                              ${!answered?'hover:border-[rgba(201,168,76,0.35)] hover:-translate-y-px':''} disabled:cursor-default`}>
                  {opt.display.kind === 'arabic'
                    ? <span className="font-scheherazade text-3xl">{opt.display.value}</span>
                    : <span className="text-sm tracking-wide uppercase">{opt.display.value}</span>
                  }
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.p initial={{opacity:0}} animate={{opacity:1}}
              className={`font-cinzel text-xs tracking-widest mt-1
                ${answered===q.answer ? 'text-[#4caf78]' : 'text-[#c95050]'}`}>
              {answered === q.answer ? t('quiz.correct') : t('quiz.wrong', { name: getLetterName(LETTERS.find(l=>l.code===q.answer)!, lang) })}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <button onClick={next} disabled={!answered}
        className={`font-cinzel text-xs tracking-widest uppercase px-8 py-3 rounded-full border transition-all
          ${answered ? 'border-gold-dim text-gold-light bg-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.15)]'
                     : 'border-transparent text-[#3a2d10] cursor-default'}`}>
        {qi+1 >= QUIZ_LEN ? 'Завершить' : 'Следующий →'}
      </button>
    </div>
  );
}
