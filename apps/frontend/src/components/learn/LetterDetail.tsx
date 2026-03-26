import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { ArabicLetter, getLetterName, getLetterAssociation, Language } from '@arabic/shared';

interface LetterDetailProps {
  letter: ArabicLetter | null;
  visible: boolean;
  onClose: () => void;
  originRect?: { x: number; y: number } | null;
}

const FORM_LABELS = {
  iso: { en: 'Isolated', ru: 'Изолированная', uz: 'Alohida' },
  ini: { en: 'Initial', ru: 'Начальная', uz: 'Boshlanish' },
  med: { en: 'Medial', ru: 'Срединная', uz: "O'rtadagi" },
  fin: { en: 'Final', ru: 'Конечная', uz: 'Oxirgi' },
} as const;

function playSound(letter: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

export function LetterDetail({ letter, visible, onClose, originRect }: LetterDetailProps) {
  const lang = (useAuthStore((s) => s.user?.language) ?? 'uz') as Language;
  const { t } = useTranslation('common');

  if (!letter) return null;

  const name = getLetterName(letter, lang);
  const association = getLetterAssociation(letter, lang);
  const transcription = letter.transcription.split(' — ');

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-[rgba(0,0,0,0.7)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-[81] left-1/2 top-1/2 w-[90vw] max-w-sm
                       bg-gradient-to-br from-[#1c160e] to-[#0d0a07]
                       border border-[#3a2d10] rounded-3xl p-6
                       shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(201,168,76,0.15)]"
            initial={{
              opacity: 0,
              scale: 0.3,
              x: originRect ? originRect.x - window.innerWidth / 2 : '-50%',
              y: originRect ? originRect.y - window.innerHeight / 2 : '-50%',
            }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#9a8a6a] hover:text-gold-light transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Main letter */}
            <div className="text-center mb-5">
              <motion.p
                className="font-scheherazade text-7xl text-gold-light leading-none mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              >
                {letter.code}
              </motion.p>
              <p className="font-cinzel text-lg text-[#f0e6cc] tracking-wide">{name}</p>
              <p className="font-cinzel text-xs text-[#9a8a6a] tracking-widest mt-1">
                {transcription[0]}
              </p>
              {transcription[1] && (
                <p className="font-raleway text-xs text-[#9a8a6a] mt-0.5">{transcription[1]}</p>
              )}
            </div>

            {/* Four forms */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {(['iso', 'ini', 'med', 'fin'] as const).map((form) => (
                <motion.div
                  key={form}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl
                             bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + (['iso','ini','med','fin'].indexOf(form)) * 0.05 }}
                >
                  <span className="font-scheherazade text-2xl text-[#f0e6cc]">{letter[form]}</span>
                  <span className="font-cinzel text-[0.5rem] tracking-wider text-[#9a8a6a] uppercase">
                    {FORM_LABELS[form][lang]}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Association */}
            {association && (
              <motion.div
                className="mb-4 p-3 rounded-xl bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase mb-1">
                  {lang === 'ru' ? 'Ассоциация' : lang === 'uz' ? 'Assotsiatsiya' : 'Association'}
                </p>
                <p className="font-raleway text-sm text-[#f0e6cc]">{association}</p>
              </motion.div>
            )}

            {/* Play sound */}
            <motion.button
              onClick={() => playSound(letter.code)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full
                         border border-gold-dim bg-[rgba(201,168,76,0.08)]
                         text-gold-light font-cinzel text-xs tracking-widest uppercase
                         hover:bg-[rgba(201,168,76,0.15)] transition-all"
              whileTap={{ scale: 0.97 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.08"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {lang === 'ru' ? 'Прослушать' : lang === 'uz' ? 'Eshitish' : 'Play sound'}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
