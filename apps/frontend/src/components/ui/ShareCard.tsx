import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useProgress } from '../../hooks/useProgress';
import { Button } from './Button';
import { LevelBadge } from './Badges';
import html2canvas from 'html2canvas';

export function ShareCard() {
  const { t } = useTranslation('common');
  const user = useAuthStore((s) => s.user);
  const { data: stats } = useProgress();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0d0a07',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `arabic-progress-${user.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareNative = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0d0a07',
      scale: 2,
    });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'arabic-progress.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t('share_card.share_title', { defaultValue: 'My Arabic Learning Progress' }),
        });
      } else {
        downloadPNG();
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-80 bg-gradient-to-br from-[#1c160e] to-[#0d0a07]
                   border border-[#3a2d10] rounded-3xl p-6 text-center"
      >
        {/* App branding */}
        <p className="font-scheherazade text-3xl text-gold mb-1">{'\u0627\u0644\u0623\u0628\u062c\u062f\u064a\u0629'}</p>
        <p className="font-cinzel text-[0.5rem] tracking-[4px] text-[#8a6f2e] uppercase mb-4">
          {t('app_name')}
        </p>

        {/* User name */}
        <p className="font-cinzel text-lg text-[#f0e6cc] font-bold mb-3">{user.name}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-xl bg-[rgba(255,100,0,0.05)] border border-[rgba(255,100,0,0.15)]">
            <span className="text-lg">{'\ud83d\udd25'}</span>
            <p className="font-cinzel text-lg text-[#ff8c42] font-bold">{user.streak.current}</p>
            <p className="font-cinzel text-[0.45rem] tracking-wider text-[#9a8a6a] uppercase">{t('streak')}</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)]">
            <span className="text-lg">{'\u2b50'}</span>
            <p className="font-cinzel text-lg text-gold-light font-bold">{user.xpLevel}</p>
            <p className="font-cinzel text-[0.45rem] tracking-wider text-[#9a8a6a] uppercase">Level</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-[rgba(100,160,255,0.05)] border border-[rgba(100,160,255,0.15)]">
            <span className="text-lg">{'\ud83d\udcda'}</span>
            <p className="font-cinzel text-lg text-[#8ab4ff] font-bold">{stats?.knownCount ?? user.knownLettersCount}</p>
            <p className="font-cinzel text-[0.45rem] tracking-wider text-[#9a8a6a] uppercase">Letters</p>
          </div>
        </div>

        {/* Level badge */}
        <div className="flex justify-center mb-3">
          <LevelBadge level={user.level} size="md" />
        </div>

        {/* Branding footer */}
        <p className="font-cinzel text-[0.45rem] tracking-[3px] text-[#8a6f2e] uppercase">
          arabicapp.uz
        </p>
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="gold" size="sm" onClick={shareNative}>
          {t('share')}
        </Button>
        <Button variant="outline" size="sm" onClick={downloadPNG}>
          PNG
        </Button>
      </div>
    </div>
  );
}
