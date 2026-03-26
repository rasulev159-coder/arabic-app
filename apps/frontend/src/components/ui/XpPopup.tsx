import { motion, AnimatePresence } from 'framer-motion';

interface XpPopupProps {
  xp: number;
  visible: boolean;
  onComplete?: () => void;
}

export function XpPopup({ xp, visible, onComplete }: XpPopupProps) {
  if (xp <= 0) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="pointer-events-none fixed z-[90] flex items-center justify-center"
          style={{ left: '50%', top: '40%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -30, -60, -90], scale: [0.5, 1.2, 1, 0.8] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <span
            className="font-cinzel text-2xl font-bold tracking-wider"
            style={{
              color: '#e8c96d',
              textShadow: '0 0 20px rgba(232,201,109,0.6), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            +{xp} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
