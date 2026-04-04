import { Link }   from 'react-router-dom';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Floating Arabic letters config                                     */
/* ------------------------------------------------------------------ */
const FLOAT_LETTERS = [
  { ch: 'ب', x: '8%',  y: '12%', size: '2rem',  dur: 18, delay: 0   },
  { ch: 'ت', x: '85%', y: '8%',  size: '1.6rem',dur: 22, delay: 2   },
  { ch: 'ث', x: '78%', y: '35%', size: '1.4rem',dur: 20, delay: 1   },
  { ch: 'ج', x: '12%', y: '55%', size: '1.8rem',dur: 24, delay: 3   },
  { ch: 'ح', x: '90%', y: '60%', size: '1.5rem',dur: 19, delay: 0.5 },
  { ch: 'خ', x: '5%',  y: '82%', size: '1.3rem',dur: 21, delay: 1.5 },
  { ch: 'د', x: '70%', y: '78%', size: '1.7rem',dur: 23, delay: 2.5 },
  { ch: 'ذ', x: '50%', y: '18%', size: '1.2rem',dur: 17, delay: 4   },
  { ch: 'ر', x: '30%', y: '88%', size: '1.4rem',dur: 25, delay: 1   },
  { ch: 'س', x: '60%', y: '48%', size: '1.1rem',dur: 20, delay: 3.5 },
  { ch: 'ع', x: '20%', y: '35%', size: '1.3rem',dur: 22, delay: 2   },
  { ch: 'ف', x: '42%', y: '70%', size: '1.5rem',dur: 19, delay: 0   },
];

/* ------------------------------------------------------------------ */
/*  Feature cards                                                      */
/* ------------------------------------------------------------------ */
const FEATURES = [
  { emoji: '🎮', label: "8 ta o'yin"    },
  { emoji: '📖', label: 'Muallim Soniy' },
  { emoji: '🏆', label: 'Reyting'       },
];

/* ------------------------------------------------------------------ */
/*  Stagger helpers                                                    */
/* ------------------------------------------------------------------ */
const stagger = (i: number) => ({ delay: 0.15 + i * 0.1 });
const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function InvitePage() {
  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(165deg, #0a0705 0%, #120e06 40%, #1a1208 100%)',
      }}
    >
      {/* ---- Arabesque geometric overlay ---- */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              #c9a84c 0deg 30deg,
              transparent 30deg 60deg
            )`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ---- Radial gold haze (top) ---- */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-15%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ---- Gold particle dots ---- */}
      {[
        { top: '6%',  left: '18%', size: 3 },
        { top: '14%', left: '75%', size: 2 },
        { top: '30%', left: '88%', size: 2.5 },
        { top: '50%', left: '10%', size: 2 },
        { top: '65%', left: '82%', size: 3 },
        { top: '78%', left: '25%', size: 2 },
        { top: '88%', left: '65%', size: 2.5 },
        { top: '42%', left: '5%',  size: 1.5 },
        { top: '22%', left: '55%', size: 2 },
        { top: '72%', left: '48%', size: 1.5 },
      ].map((d, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: d.top, left: d.left,
            width: d.size, height: d.size,
            background: '#c9a84c',
          }}
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ---- Floating Arabic letters ---- */}
      {FLOAT_LETTERS.map((l, i) => (
        <motion.span
          key={`fl-${i}`}
          className="absolute pointer-events-none select-none font-scheherazade"
          style={{
            left: l.x, top: l.y,
            fontSize: l.size,
            color: '#c9a84c',
            opacity: 0.06,
            fontFamily: "'Scheherazade New', serif",
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: l.dur,
            delay: l.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {l.ch}
        </motion.span>
      ))}

      {/* ================================================================ */}
      {/*  MAIN CONTENT                                                    */}
      {/* ================================================================ */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-center px-5 py-10"
        style={{ maxWidth: 430 }}
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12 }}
      >
        {/* ---- Arabic title ---- */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="font-scheherazade text-center leading-tight"
          style={{
            fontSize: 'clamp(3.2rem, 12vw, 4.8rem)',
            color: '#e8c96d',
            fontFamily: "'Scheherazade New', serif",
            textShadow: '0 0 40px rgba(201,168,76,0.35), 0 0 80px rgba(201,168,76,0.15)',
          }}
        >
          الأبجدية
        </motion.p>

        {/* ---- Decorative divider ---- */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 mt-2 mb-5"
        >
          <span className="block h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #8a6f2e)' }} />
          <span style={{ color: '#8a6f2e', fontSize: '0.6rem' }}>✦</span>
          <span className="block h-px w-10" style={{ background: 'linear-gradient(90deg, #8a6f2e, transparent)' }} />
        </motion.div>

        {/* ---- Tagline ---- */}
        <motion.h1
          variants={fadeUp}
          className="font-cinzel text-center tracking-wide"
          style={{
            fontSize: 'clamp(1.15rem, 5vw, 1.45rem)',
            color: '#f0e6cc',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.08em',
          }}
        >
          Arab alifbosini o'rganing
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-raleway text-center mt-2 mb-7"
          style={{
            fontSize: '0.85rem',
            color: '#9a8a6a',
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: '0.12em',
          }}
        >
          Bepul&ensp;•&ensp;O'yinlar&ensp;•&ensp;Muallim Soniy
        </motion.p>

        {/* ---- Feature cards ---- */}
        <motion.div
          variants={fadeUp}
          className="flex gap-3 w-full justify-center mb-6"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...stagger(i), duration: 0.5 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl flex-1"
              style={{
                padding: '14px 6px 12px',
                background: 'linear-gradient(145deg, rgba(201,168,76,0.08), rgba(26,18,8,0.9))',
                border: '1px solid rgba(138,111,46,0.2)',
                backdropFilter: 'blur(4px)',
                maxWidth: 120,
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{f.emoji}</span>
              <span
                className="font-raleway text-center"
                style={{
                  fontSize: '0.7rem',
                  color: '#d4c49a',
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                }}
              >
                {f.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ---- Social proof ---- */}
        <motion.p
          variants={fadeUp}
          className="font-raleway text-center mb-8"
          style={{
            fontSize: '0.78rem',
            color: '#b8a878',
            fontFamily: "'Raleway', sans-serif",
            letterSpacing: '0.06em',
          }}
        >
          ⭐ 9 ta bob&ensp;•&ensp;159 ta test&ensp;•&ensp;28 ta harf
        </motion.p>

        {/* ---- CTA Button ---- */}
        <motion.div variants={fadeUp} className="w-full flex justify-center mb-8">
          <Link to="/login" className="block" style={{ textDecoration: 'none' }}>
            <motion.div
              className="font-cinzel text-center cursor-pointer select-none"
              style={{
                padding: '16px 52px',
                fontSize: '1.05rem',
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#0d0a07',
                background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96d 50%, #c9a84c 100%)',
                borderRadius: 9999,
                boxShadow: '0 0 30px rgba(201,168,76,0.35), 0 0 60px rgba(201,168,76,0.15)',
              }}
              animate={{
                boxShadow: [
                  '0 0 30px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.12)',
                  '0 0 45px rgba(201,168,76,0.5), 0 0 90px rgba(201,168,76,0.2)',
                  '0 0 30px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.12)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              BOSHLASH&ensp;→
            </motion.div>
          </Link>
        </motion.div>

        {/* ---- Bottom appeal ---- */}
        <motion.div
          variants={fadeUp}
          className="text-center flex flex-col items-center gap-2"
        >
          <p
            className="font-raleway"
            style={{
              fontSize: '0.95rem',
              color: '#e8c96d',
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 600,
            }}
          >
            10 ta tester kerak! 🙏
          </p>
          <p
            className="font-raleway"
            style={{
              fontSize: '0.75rem',
              color: '#9a8a6a',
              fontFamily: "'Raleway', sans-serif",
              lineHeight: 1.6,
            }}
          >
            15 daqiqa vaqtingiz — mening 3 oylik ishim
          </p>

          {/* ---- Decorative divider ---- */}
          <div className="flex items-center gap-3 my-2">
            <span className="block h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(138,111,46,0.4))' }} />
            <span style={{ color: '#8a6f2e', fontSize: '0.5rem' }}>✦</span>
            <span className="block h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(138,111,46,0.4), transparent)' }} />
          </div>

          <p
            className="font-raleway"
            style={{
              fontSize: '0.65rem',
              color: '#6a5a3a',
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: '0.14em',
            }}
          >
            arabic-app-ruddy.vercel.app
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
