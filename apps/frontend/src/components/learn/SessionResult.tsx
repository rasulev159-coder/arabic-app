import { motion }          from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { Button }          from '../ui/Button';
import { ShareResultCard } from '../ui/ShareResultCard';
import { LevelBadge }      from '../ui/Badges';
import { UserLevel }       from '@arabic/shared';

interface SessionResultProps {
  score:       number;
  total:       number;
  mode:        string;
  level:       UserLevel;
  durationSec: number;
  attempts?:   number;
  onRestart:   () => void;
}

export function SessionResult({ score, total, mode, level, durationSec, attempts, onRestart }: SessionResultProps) {
  const { t }    = useTranslation('learn');
  const pct      = total > 0 ? Math.round(score / total * 100) : 0;
  const time     = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, '0')}`;
  const titleKey = pct === 100 ? 'title_perfect' : pct >= 75 ? 'title_great' : pct >= 50 ? 'title_good' : 'title_keep';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-6"
    >
      {/* Circle */}
      <div className="w-40 h-40 rounded-full border-2 border-gold-dim flex flex-col items-center justify-center
                      bg-gradient-to-br from-[#201808] to-[#0d0a07]
                      shadow-[0_0_60px_rgba(201,168,76,0.2)]">
        <p className="font-cinzel text-4xl font-bold text-gold-light">{pct}%</p>
        <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase">{t('result.accuracy', { n: pct }).split(':')[0]}</p>
      </div>

      <div>
        <p className="font-cinzel text-xl text-[#f0e6cc] tracking-wide mb-1">{t(`result.${titleKey}`)}</p>
        <LevelBadge level={level} size="md" />
      </div>

      <div className="flex gap-6 font-cinzel text-xs text-[#9a8a6a]">
        <span>{t('result.score', { score, total })}</span>
        <span>·</span>
        <span>{time}</span>
        {attempts !== undefined && <><span>·</span><span>{t('result.attempts', { n: attempts })}</span></>}
      </div>

      <ShareResultCard score={score} total={total} mode={mode} level={level} durationSec={durationSec} />

      <Button size="lg" onClick={onRestart}>{t('restart', { ns: 'common' })}</Button>
    </motion.div>
  );
}
