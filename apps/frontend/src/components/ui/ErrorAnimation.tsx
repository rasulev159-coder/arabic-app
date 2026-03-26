import { motion, AnimatePresence } from 'framer-motion';

interface ErrorAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

export function ErrorAnimation({ visible, onComplete }: ErrorAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="relative inline-flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            scale: { type: 'spring', stiffness: 300, damping: 15 },
            x: { duration: 0.5, ease: 'easeInOut' },
          }}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-[rgba(201,80,80,0.15)] border-2 border-[#c95050]
                       flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c95050"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
