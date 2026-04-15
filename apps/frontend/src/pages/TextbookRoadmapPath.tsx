import { useRef, useEffect, useState } from 'react';
import { Link }           from 'react-router-dom';
import { motion }         from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore }   from '../store/authStore';
import { useTextbookStore } from '../store/textbookStore';
import { MUALLIM_SONIY }  from '../data/muallimSoniy';
import { Language }        from '@arabic/shared';

/* ───────── helpers ───────── */

type NodeStatus = 'completed' | 'current' | 'locked';

function getStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 80) return 2;
  if (score >= 70) return 1;
  return 0;
}

function getTitle(ch: typeof MUALLIM_SONIY[0], lang: Language) {
  return lang === 'ru' ? ch.titleRu : lang === 'en' ? ch.titleEn : ch.titleUz;
}

/* node alignment pattern: left, center, right, center, left, center, right ... */
function getAlignment(index: number): 'left' | 'center' | 'right' {
  const cycle = index % 4;
  if (cycle === 0) return 'left';
  if (cycle === 1) return 'center';
  if (cycle === 2) return 'right';
  return 'center';
}

/* ───────── Stars component ───────── */

function StarDisplay({ count, delay }: { count: number; delay: number }) {
  return (
    <div className="flex gap-0.5 justify-center mt-1">
      {[1, 2, 3].map((star) => (
        <motion.span
          key={star}
          initial={{ scale: 0, opacity: 0 }}
          animate={star <= count ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0.2 }}
          transition={{ delay: delay + star * 0.1, type: 'spring', stiffness: 400, damping: 15 }}
          className="text-sm"
          style={{ filter: star <= count ? 'none' : 'grayscale(1)' }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}

/* ───────── SVG Path between nodes ───────── */

function ConnectingPath({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-full flex justify-center"
      style={{ height: 40, marginTop: -4, marginBottom: -4 }}
    >
      <motion.svg width="120" height="40" viewBox="0 0 120 40" fill="none">
        <motion.path
          d="M60 0 C60 10, 60 30, 60 40"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ───────── Main Component ───────── */

export function TextbookRoadmapPath() {
  const { t }  = useTranslation('common');
  const user   = useAuthStore((s) => s.user);
  const lang   = (user?.language ?? 'uz') as Language;
  const { progress } = useTextbookStore();

  const scrollRef    = useRef<HTMLDivElement>(null);
  const currentRef   = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  /* Build ordered chapters bottom-to-top → reverse for rendering (we render top-to-bottom,
     but visually chapters go 9→1 top→bottom so chapter 1 is at the bottom) */
  const chapters = [...MUALLIM_SONIY].sort((a, b) => a.order - b.order);

  /* Compute status for each chapter */
  const chapterStatuses: { chapter: typeof MUALLIM_SONIY[0]; status: NodeStatus; bestScore: number }[] = [];
  let foundCurrent = false;

  for (let i = 0; i < chapters.length; i++) {
    const ch   = chapters[i];
    const prog = progress[ch.id];
    const isCompleted = !!prog?.completedAt;

    if (isCompleted) {
      chapterStatuses.push({ chapter: ch, status: 'completed', bestScore: prog?.bestScore ?? 0 });
    } else if (!foundCurrent) {
      /* First incomplete chapter (or chapter 1) */
      const prevCompleted = i === 0 || !!progress[chapters[i - 1].id]?.completedAt;
      if (prevCompleted) {
        chapterStatuses.push({ chapter: ch, status: 'current', bestScore: prog?.bestScore ?? 0 });
        foundCurrent = true;
      } else {
        chapterStatuses.push({ chapter: ch, status: 'locked', bestScore: 0 });
        foundCurrent = true; // everything after is locked
      }
    } else {
      chapterStatuses.push({ chapter: ch, status: 'locked', bestScore: 0 });
    }
  }

  /* Reversed for display: top = chapter 9, bottom = chapter 1 */
  const displayItems = [...chapterStatuses].reverse();

  /* Scroll to current node on mount */
  useEffect(() => {
    const timer = setTimeout(() => {
      currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  /* Lock tooltip auto-dismiss */
  useEffect(() => {
    if (tooltip) {
      const timer = setTimeout(() => setTooltip(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [tooltip]);

  const tooltipText = lang === 'ru'
    ? 'Сначала завершите предыдущую главу'
    : lang === 'en'
    ? 'Complete previous chapter first'
    : 'Avval oldingi bobni tamomla';

  const finalExamText = lang === 'ru'
    ? 'Финальный экзамен'
    : lang === 'en'
    ? 'Final Exam'
    : 'Yakuniy imtihon';

  return (
    <div
      ref={scrollRef}
      className="min-h-screen bg-bg relative overflow-x-hidden"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%),
                          radial-gradient(circle at 20% 80%, rgba(201,168,76,0.02) 0%, transparent 50%)`,
      }}
    >
      {/* Subtle dot pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(201,168,76,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md border-b border-[rgba(201,168,76,0.1)] px-4 py-3"
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            to="/learn"
            className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                       hover:text-gold transition-colors"
          >
            &larr; {t('nav.dashboard')}
          </Link>
          <h1 className="font-cinzel text-sm text-[#f0e6cc] tracking-wide">
            {t('textbook.title')}
          </h1>
          <div className="w-12" />
        </div>
      </motion.div>

      {/* Path container */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-32 relative">
        {/* ── Final Exam Node (top) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + displayItems.length * 0.08 }}
          className="flex justify-center mb-2"
        >
          {(() => {
            const allCompleted = chapterStatuses.every((s) => s.status === 'completed');
            return (
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-20 h-20 flex items-center justify-center ${
                    allCompleted
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-40'
                  }`}
                  onClick={() => {
                    if (!allCompleted) setTooltip('final');
                  }}
                >
                  {/* Star shape via CSS clip-path */}
                  <div
                    className={`w-20 h-20 flex items-center justify-center text-2xl ${
                      allCompleted
                        ? 'bg-gradient-to-br from-gold to-gold-dim text-bg'
                        : 'bg-[rgba(255,255,255,0.05)] text-[#555]'
                    }`}
                    style={{
                      clipPath:
                        'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    }}
                  >
                    {allCompleted ? '🏆' : '🔒'}
                  </div>
                </div>
                <p className="font-cinzel text-[0.6rem] tracking-[2px] text-gold-light uppercase mt-1">
                  {finalExamText}
                </p>
                {tooltip === 'final' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[0.6rem] text-[#c98a32] mt-1 font-cinzel"
                  >
                    {tooltipText}
                  </motion.p>
                )}
              </div>
            );
          })()}
        </motion.div>

        {/* Connecting line from final exam */}
        <ConnectingPath delay={0.08 + displayItems.length * 0.08} />

        {/* ── Chapter Nodes ── */}
        {displayItems.map((item, displayIndex) => {
          const { chapter, status, bestScore } = item;
          const stars   = getStars(bestScore);
          const align   = getAlignment(displayIndex);
          const delay   = 0.08 + displayIndex * 0.08;
          const isCurrent = status === 'current';

          const alignClass =
            align === 'left'
              ? 'justify-start pl-4 md:pl-8'
              : align === 'right'
              ? 'justify-end pr-4 md:pr-8'
              : 'justify-center';

          const nodeContent = (
            <motion.div
              ref={isCurrent ? currentRef : undefined}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center relative"
              style={{ width: 130 }}
            >
              {/* Glow ring for current */}
              {isCurrent && (
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 84,
                    height: 84,
                    top: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '2px solid rgba(201,168,76,0.4)',
                    boxShadow: '0 0 20px rgba(201,168,76,0.3), 0 0 40px rgba(201,168,76,0.1)',
                  }}
                  animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Node circle */}
              <div
                className={`relative z-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${status === 'completed'
                    ? 'w-16 h-16 bg-gradient-to-br from-gold to-gold-dim shadow-[0_0_15px_rgba(201,168,76,0.3)]'
                    : status === 'current'
                    ? 'w-20 h-20 bg-bg-3 border-[3px] border-gold shadow-[0_0_25px_rgba(201,168,76,0.35)]'
                    : 'w-14 h-14 bg-[rgba(255,255,255,0.03)] border-2 border-[rgba(255,255,255,0.08)]'
                  }`}
              >
                {status === 'completed' ? (
                  <span className="text-bg text-xl font-bold">✓</span>
                ) : status === 'current' ? (
                  <span className="text-2xl">{chapter.icon}</span>
                ) : (
                  <span className="text-lg opacity-40">🔒</span>
                )}
              </div>

              {/* Chapter emoji for completed */}
              {status === 'completed' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.2, type: 'spring' }}
                  className="absolute z-20 -top-1 -right-1 text-base bg-bg-2 rounded-full w-7 h-7 flex items-center justify-center
                             border border-[rgba(201,168,76,0.2)]"
                >
                  {chapter.icon}
                </motion.span>
              )}

              {/* Chapter info */}
              <p className={`font-cinzel text-[0.55rem] tracking-[2px] uppercase mt-2 ${
                status === 'locked' ? 'text-[#555]' : 'text-[#9a8a6a]'
              }`}>
                {t('textbook.chapter')} {chapter.order}
              </p>
              <p className={`font-cinzel text-[0.65rem] tracking-wide text-center leading-tight mt-0.5 ${
                status === 'locked'
                  ? 'text-[#444]'
                  : status === 'current'
                  ? 'text-gold-light'
                  : 'text-[#c8b88a]'
              }`}>
                {getTitle(chapter, lang)}
              </p>

              {/* Stars for completed */}
              {status === 'completed' && stars > 0 && (
                <StarDisplay count={stars} delay={delay} />
              )}

              {/* Score badge for completed */}
              {status === 'completed' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.3 }}
                  className="font-cinzel text-[0.5rem] tracking-widest text-[#4caf78] mt-0.5"
                >
                  {bestScore}%
                </motion.p>
              )}

              {/* Current indicator */}
              {isCurrent && (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-cinzel text-[0.5rem] tracking-[3px] text-gold uppercase mt-1"
                >
                  {lang === 'ru' ? 'Текущий' : lang === 'en' ? 'Continue' : 'Davom etish'}
                </motion.p>
              )}

              {/* Locked tooltip */}
              {tooltip === chapter.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                             bg-bg-3 border border-[rgba(201,140,50,0.3)] rounded-lg px-3 py-1.5 z-30"
                >
                  <p className="font-cinzel text-[0.5rem] text-[#c98a32]">
                    {tooltipText}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );

          return (
            <div key={chapter.id}>
              <div className={`flex ${alignClass}`}>
                {status === 'completed' || status === 'current' ? (
                  <Link to={`/textbook/${chapter.id}`}>
                    {nodeContent}
                  </Link>
                ) : (
                  <div
                    className="cursor-not-allowed"
                    onClick={() => setTooltip(chapter.id)}
                  >
                    {nodeContent}
                  </div>
                )}
              </div>

              {/* Connecting path (not after last / bottom node) */}
              {displayIndex < displayItems.length - 1 && (
                <ConnectingPath delay={delay + 0.04} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
