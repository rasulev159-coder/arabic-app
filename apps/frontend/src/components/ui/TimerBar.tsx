import { motion } from 'framer-motion';

interface TimerBarProps {
  totalSeconds: number;
  timeLeft: number;
  className?: string;
}

function getTimerColor(pct: number): string {
  if (pct > 60) return '#4caf78';
  if (pct > 40) return '#e8c96d';
  if (pct > 20) return '#ff8c42';
  return '#c95050';
}

function getTimerGlow(pct: number): string {
  if (pct > 60) return 'rgba(76,175,120,0.3)';
  if (pct > 40) return 'rgba(232,201,109,0.3)';
  if (pct > 20) return 'rgba(255,140,66,0.4)';
  return 'rgba(201,80,80,0.6)';
}

export function TimerBar({ totalSeconds, timeLeft, className = '' }: TimerBarProps) {
  const pct = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const color = getTimerColor(pct);
  const glow = getTimerGlow(pct);
  const isUrgent = pct <= 20;
  const isCritical = pct <= 10;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Screen border glow for critical time */}
      {isCritical && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          animate={{
            boxShadow: [
              'inset 0 0 40px rgba(201,80,80,0)',
              'inset 0 0 40px rgba(201,80,80,0.3)',
              'inset 0 0 40px rgba(201,80,80,0)',
            ],
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden transition-all duration-300"
        style={{
          height: isUrgent ? 8 : 6,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Fill */}
        <motion.div
          className="h-full rounded-full"
          animate={
            isUrgent
              ? {
                  boxShadow: [
                    `0 0 8px ${glow}`,
                    `0 0 20px ${glow}`,
                    `0 0 8px ${glow}`,
                  ],
                }
              : { boxShadow: `0 0 8px ${glow}` }
          }
          transition={
            isUrgent
              ? { duration: isCritical ? 0.4 : 0.8, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            transition: 'width 1s linear, background-color 0.5s ease',
          }}
        />
      </div>

      {/* Time text */}
      <div className="flex justify-between mt-1">
        <motion.span
          className="font-cinzel text-xs tracking-wider"
          style={{ color }}
          animate={
            isCritical
              ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            isCritical
              ? { duration: 0.5, repeat: Infinity }
              : {}
          }
        >
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </motion.span>
      </div>
    </div>
  );
}
