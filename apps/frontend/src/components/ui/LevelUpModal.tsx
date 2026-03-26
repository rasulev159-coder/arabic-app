import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface LevelUpModalProps {
  level: number;
  visible: boolean;
  onDismiss: () => void;
}

function Particle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        background: `radial-gradient(circle, #e8c96d, #c9a84c)`,
        boxShadow: '0 0 6px rgba(232,201,109,0.8)',
        left: '50%',
        top: '50%',
      }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 0.8, 0],
        x: [0, x * 0.5, x],
        y: [0, y * 0.5, y],
      }}
      transition={{
        duration: 1.8,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

function Sparkle({ delay, angle }: { delay: number; angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const dist = 60 + Math.random() * 80;
  return (
    <motion.div
      className="absolute text-gold-light"
      style={{
        left: '50%',
        top: '50%',
        fontSize: `${8 + Math.random() * 8}px`,
      }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0.8, 0],
        scale: [0, 1.5, 1, 0],
        x: [0, Math.cos(rad) * dist],
        y: [0, Math.sin(rad) * dist],
      }}
      transition={{
        duration: 1.5,
        delay: delay + 0.3,
        ease: 'easeOut',
      }}
    >
      {Math.random() > 0.5 ? '\u2726' : '\u2728'}
    </motion.div>
  );
}

export function LevelUpModal({ level, visible, onDismiss }: LevelUpModalProps) {
  const { t } = useTranslation('common');

  const dismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [visible, dismiss]);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: 0.1 + i * 0.05,
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 300,
  }));

  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.08,
    angle: i * 30 + Math.random() * 15,
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismiss}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[rgba(0,0,0,0.85)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center">
            {/* Particles */}
            {particles.map((p, i) => (
              <Particle key={`p-${i}`} {...p} />
            ))}
            {sparkles.map((s, i) => (
              <Sparkle key={`s-${i}`} {...s} />
            ))}

            {/* Glow ring */}
            <motion.div
              className="absolute w-48 h-48 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2.5, 2], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />

            {/* Level number */}
            <motion.div
              className="relative z-10 w-32 h-32 rounded-full border-2 border-gold
                         bg-gradient-to-br from-[#2a1f08] to-[#1a1005]
                         flex items-center justify-center
                         shadow-[0_0_60px_rgba(201,168,76,0.4)]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-180, 10, 0] }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <span className="font-cinzel text-5xl font-bold text-gold-light
                               drop-shadow-[0_0_20px_rgba(232,201,109,0.6)]">
                {level}
              </span>
            </motion.div>

            {/* Level Up text */}
            <motion.p
              className="relative z-10 font-cinzel text-2xl tracking-[6px] text-gold uppercase mt-6
                         drop-shadow-[0_0_20px_rgba(201,168,76,0.5)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {t('level_up', { defaultValue: 'Level Up!' })}
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="relative z-10 font-cinzel text-xs tracking-widest text-[#9a8a6a] uppercase mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {t('level_reached', { level, defaultValue: `Level ${level} reached` })}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
