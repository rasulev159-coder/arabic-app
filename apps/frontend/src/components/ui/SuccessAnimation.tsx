import { motion, AnimatePresence } from 'framer-motion';

interface SuccessAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

function Sparkle({ delay, angle, distance }: { delay: number; angle: number; distance: number }) {
  const rad = (angle * Math.PI) / 180;
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-[#4caf78]"
      style={{
        left: '50%',
        top: '50%',
        boxShadow: '0 0 6px rgba(76,175,120,0.8)',
      }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        x: [0, Math.cos(rad) * distance],
        y: [0, Math.sin(rad) * distance],
      }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    />
  );
}

export function SuccessAnimation({ visible, onComplete }: SuccessAnimationProps) {
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    delay: 0.1 + i * 0.04,
    angle: i * 45,
    distance: 30 + Math.random() * 20,
  }));

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="relative inline-flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {sparkles.map((s, i) => (
            <Sparkle key={i} {...s} />
          ))}

          <motion.div
            className="w-16 h-16 rounded-full bg-[rgba(76,175,120,0.15)] border-2 border-[#4caf78]
                       flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4caf78"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
