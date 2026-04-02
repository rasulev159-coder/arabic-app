import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useTextbookStore } from '../store/textbookStore';
import { MUALLIM_SONIY } from '../data/muallimSoniy';
import { Language } from '@arabic/shared';

/* ───────── Island color themes by chapter index ───────── */
const ISLAND_THEMES = [
  { bg: '#d4a843', border: '#c9982e', label: 'Sandy yellow' },      // Ch1
  { bg: '#3a7d44', border: '#2d6335', label: 'Green forest' },      // Ch2
  { bg: '#d47735', border: '#b8612a', label: 'Orange sunset' },     // Ch3
  { bg: '#7b4ea0', border: '#63398a', label: 'Purple mountain' },   // Ch4
  { bg: '#2e7d9a', border: '#1f6680', label: 'Blue lagoon' },       // Ch5
  { bg: '#b84a3c', border: '#993d32', label: 'Red desert' },        // Ch6
  { bg: '#c9a84c', border: '#b08f38', label: 'Golden temple' },     // Ch7
  { bg: '#2aa198', border: '#1e8078', label: 'Teal oasis' },        // Ch8
  { bg: '#d4cfc0', border: '#b8b3a4', label: 'White palace' },      // Ch9
];

/* ───────── Helpers ───────── */
function getTitle(ch: (typeof MUALLIM_SONIY)[0], lang: Language) {
  return lang === 'ru' ? ch.titleRu : lang === 'en' ? ch.titleEn : ch.titleUz;
}

function getStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 80) return 2;
  if (score >= 70) return 1;
  return 0;
}

type IslandStatus = 'completed' | 'current' | 'locked';

/* ───────── Component ───────── */
export function TextbookRoadmapIsland() {
  const { t } = useTranslation('common');
  const user = useAuthStore((s) => s.user);
  const lang = (user?.language ?? 'uz') as Language;
  const { progress } = useTextbookStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  /* Derive status for each chapter */
  const chapters = MUALLIM_SONIY.map((ch, i) => {
    const chProgress = progress[ch.id];
    const isCompleted = !!chProgress?.completedAt;
    const prevCompleted =
      i === 0 ? true : !!progress[MUALLIM_SONIY[i - 1].id]?.completedAt;
    const isUnlocked = i === 0 || prevCompleted;

    let status: IslandStatus = 'locked';
    if (isCompleted) status = 'completed';
    else if (isUnlocked) status = 'current';

    return { ...ch, status, bestScore: chProgress?.bestScore ?? 0 };
  });

  /* Ensure only the FIRST incomplete-unlocked island is "current" */
  let foundCurrent = false;
  for (const ch of chapters) {
    if (ch.status === 'current' && !foundCurrent) {
      foundCurrent = true;
    } else if (ch.status === 'current' && foundCurrent) {
      ch.status = 'locked';
    }
  }

  /* Auto-scroll current island into view */
  useEffect(() => {
    if (currentRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = currentRef.current;
      const scrollLeft =
        el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
    }
  }, []);

  /* ──── Bridge SVG between islands ──── */
  const Bridge = ({ completed }: { completed: boolean }) => (
    <svg
      width="80"
      height="20"
      viewBox="0 0 80 20"
      className="flex-shrink-0 self-center"
      style={{ marginTop: -30 }}
    >
      {completed ? (
        <>
          <line
            x1="0" y1="10" x2="80" y2="10"
            stroke="#c9a84c" strokeWidth="2.5"
          />
          {[10, 25, 40, 55, 70].map((cx) => (
            <circle key={cx} cx={cx} cy={10} r={2.5} fill="#c9a84c" />
          ))}
        </>
      ) : (
        <line
          x1="0" y1="10" x2="80" y2="10"
          stroke="#3a3a50" strokeWidth="2" strokeDasharray="6 4"
        />
      )}
    </svg>
  );

  /* ──── Star rendering ──── */
  const Stars = ({ count }: { count: number }) => (
    <div className="flex gap-0.5 justify-center mt-1">
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          animate={
            n <= count
              ? { opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }
              : undefined
          }
          transition={
            n <= count
              ? { duration: 1.6, repeat: Infinity, delay: n * 0.2 }
              : undefined
          }
          className="text-xs"
          style={{ color: n <= count ? '#c9a84c' : '#3a3a50' }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );

  /* ──── Island node ──── */
  const Island = ({
    ch,
    index,
  }: {
    ch: (typeof chapters)[0];
    index: number;
  }) => {
    const theme = ISLAND_THEMES[index] ?? ISLAND_THEMES[0];
    const isCurrent = ch.status === 'current';
    const isCompleted = ch.status === 'completed';
    const isLocked = ch.status === 'locked';
    const stars = getStars(ch.bestScore);

    const islandBody = (
      <motion.div
        ref={isCurrent ? currentRef : undefined}
        className="flex flex-col items-center flex-shrink-0"
        style={{ width: 200 }}
        /* Bobbing animation */
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3 + index * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Flag / lock indicator above */}
        <div className="h-6 flex items-end justify-center mb-1 text-sm">
          {isCompleted && '🏳️'}
          {isLocked && '🔒'}
          {isCurrent && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              💡
            </motion.span>
          )}
        </div>

        {/* Island blob */}
        <motion.div
          className="relative flex flex-col items-center justify-center rounded-[50%_48%_52%_46%/48%_50%_46%_52%]"
          style={{
            width: isCurrent ? 140 : 120,
            height: isCurrent ? 140 : 120,
            background: isLocked
              ? 'linear-gradient(135deg, #1a1a2e, #16162a)'
              : `linear-gradient(135deg, ${theme.bg}, ${theme.border})`,
            border: `3px solid ${isLocked ? '#2a2a40' : theme.border}`,
            boxShadow: isCurrent
              ? `0 0 30px rgba(201,168,76,0.45), 0 0 60px rgba(201,168,76,0.2)`
              : isCompleted
                ? `0 0 15px rgba(${hexToRgb(theme.bg)},0.3)`
                : 'none',
            opacity: isLocked ? 0.5 : 1,
            cursor: isLocked ? 'not-allowed' : 'pointer',
          }}
          /* Glow pulse for current */
          animate={
            isCurrent
              ? {
                  boxShadow: [
                    '0 0 30px rgba(201,168,76,0.45), 0 0 60px rgba(201,168,76,0.2)',
                    '0 0 45px rgba(201,168,76,0.65), 0 0 80px rgba(201,168,76,0.35)',
                    '0 0 30px rgba(201,168,76,0.45), 0 0 60px rgba(201,168,76,0.2)',
                  ],
                }
              : undefined
          }
          transition={
            isCurrent ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined
          }
          /* Locked shake on click */
          whileTap={isLocked ? { x: [0, -4, 4, -4, 4, 0] } : undefined}
        >
          {/* Chapter icon */}
          <span className="text-3xl">{ch.icon}</span>
          {/* Chapter number */}
          <span
            className="font-cinzel text-[0.6rem] tracking-widest mt-1"
            style={{ color: isLocked ? '#555' : '#fff' }}
          >
            {t('textbook.chapter')} {ch.order}
          </span>
          {/* Treasure chest for completed */}
          {isCompleted && (
            <span className="absolute -bottom-1 -right-1 text-lg">💰</span>
          )}
        </motion.div>

        {/* Title */}
        <p
          className="font-cinzel text-[0.65rem] tracking-wide text-center mt-2 max-w-[180px] leading-tight"
          style={{ color: isLocked ? '#555' : '#f0e6cc' }}
        >
          {getTitle(ch, lang)}
        </p>

        {/* Stars */}
        {isCompleted && <Stars count={stars} />}
      </motion.div>
    );

    if (isLocked) {
      return islandBody;
    }

    return (
      <Link to={`/textbook/${ch.id}`} className="no-underline">
        {islandBody}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-6 pb-3"
      >
        <Link
          to="/dashboard"
          className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                     hover:text-gold transition-colors"
        >
          &larr; {t('nav.dashboard')}
        </Link>
        <h1 className="font-cinzel text-2xl text-[#f0e6cc] mt-3 tracking-wide">
          {t('textbook.title')}
        </h1>
        <p className="font-cinzel text-[0.65rem] tracking-[3px] text-[#9a8a6a] uppercase mt-1">
          {t('textbook.subtitle')}
        </p>
      </motion.div>

      {/* Ocean / Scroll container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{
          background:
            'linear-gradient(180deg, #0a0e1a 0%, #0d1b2a 40%, #132a3e 70%, #1a3550 100%)',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Inner track */}
        <div
          className="flex items-center px-8 py-12"
          style={{ minWidth: chapters.length * 280 + 280, height: '100%' }}
        >
          {chapters.map((ch, i) => {
            const prevCompleted =
              i === 0
                ? false
                : chapters[i - 1].status === 'completed';

            return (
              <div
                key={ch.id}
                className="flex items-center"
                style={{ scrollSnapAlign: 'center' }}
              >
                {/* Bridge before this island (except first) */}
                {i > 0 && <Bridge completed={prevCompleted || ch.status === 'completed'} />}

                {/* Island */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 * i, duration: 0.4 }}
                >
                  <Island ch={ch} index={i} />
                </motion.div>
              </div>
            );
          })}

          {/* Final destination mosque */}
          <Bridge
            completed={chapters[chapters.length - 1]?.status === 'completed'}
          />
          <motion.div
            className="flex flex-col items-center flex-shrink-0"
            style={{ width: 200 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <span className="text-5xl">🕌</span>
            <p className="font-cinzel text-xs tracking-widest text-gold-light mt-2 uppercase">
              {lang === 'ru' ? 'Финиш' : lang === 'en' ? 'Finish' : 'Yakuniy'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center pb-4 pt-2"
      >
        <span className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase">
          ← {lang === 'ru' ? 'листайте' : lang === 'en' ? 'scroll' : "suring"} →
        </span>
      </motion.div>
    </div>
  );
}

/* ───────── Utility: hex → r,g,b string ───────── */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
