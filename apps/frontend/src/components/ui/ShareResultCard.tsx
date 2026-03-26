import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas   from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { LevelBadge }     from '../ui/Badges';
import { Button }         from '../ui/Button';
import { UserLevel }      from '@arabic/shared';

interface ShareResultCardProps {
  score:       number;
  total:       number;
  mode:        string;
  level:       UserLevel;
  durationSec: number;
}

export function ShareResultCard({ score, total, mode, level, durationSec }: ShareResultCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const { t }    = useTranslation('common');
  const url      = window.location.origin;
  const accuracy = total > 0 ? Math.round(score / total * 100) : 0;
  const time     = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, '0')}`;

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0d0a07', scale: 2 });
    const link   = document.createElement('a');
    link.download = 'arabic-result.png';
    link.href     = canvas.toDataURL();
    link.click();
  };

  const shareNative = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0d0a07', scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'arabic-result.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Арабский алфавит — мой результат' });
      } else {
        downloadPNG();
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={cardRef}
        className="w-80 bg-gradient-to-br from-[#1c160e] to-[#0d0a07]
                   border border-[#3a2d10] rounded-3xl p-6 text-center"
      >
        <p className="font-cinzel text-[0.6rem] tracking-[4px] text-[#8a6f2e] uppercase mb-2">
          الأبجدية العربية
        </p>
        <p className="font-scheherazade text-5xl text-[#e8c96d] my-2">بسم</p>
        <div className="my-3"><LevelBadge level={level} size="md" /></div>
        <p className="font-cinzel text-3xl text-[#f0e6cc] font-bold">{score}/{total}</p>
        <p className="font-cinzel text-xs text-[#9a8a6a] tracking-widest mt-1">{accuracy}% · {time}</p>
        <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#8a6f2e] uppercase mt-3">{mode}</p>
        <div className="mt-4 flex justify-center">
          <QRCodeSVG value={url} size={64} bgColor="transparent" fgColor="#8a6f2e" />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="gold" size="sm" onClick={shareNative}>{t('share')}</Button>
        <Button variant="outline" size="sm" onClick={downloadPNG}>PNG</Button>
      </div>
    </div>
  );
}
