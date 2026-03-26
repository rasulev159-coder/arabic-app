import { motion } from 'framer-motion';

interface XpBarProps {
  xp: number;
  level: number;
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function XpBar({ xp, level }: XpBarProps) {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progress = Math.min(Math.max((xpIntoLevel / xpNeeded) * 100, 0), 100);

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Level number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#2a1f08] to-[#3a2c0e]
                      border border-gold-dim flex items-center justify-center
                      shadow-[0_0_12px_rgba(201,168,76,0.2)]">
        <span className="font-cinzel text-xs font-bold text-gold-light">{level}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 min-w-0">
        <div className="h-2.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden
                        border border-[rgba(201,168,76,0.1)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full relative"
            style={{
              background: 'linear-gradient(90deg, #8a6f2e 0%, #c9a84c 40%, #e8c96d 70%, #c9a84c 100%)',
              boxShadow: '0 0 10px rgba(201,168,76,0.5), 0 0 4px rgba(232,201,109,0.3)',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>

      {/* XP text */}
      <p className="flex-shrink-0 font-cinzel text-[0.6rem] tracking-wider text-[#9a8a6a] whitespace-nowrap">
        <span className="text-gold-light font-bold">{xpIntoLevel}</span>
        {' / '}
        <span>{xpNeeded}</span>
        {' '}
        <span className="tracking-widest uppercase">XP</span>
      </p>
    </div>
  );
}
