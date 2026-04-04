import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TELEGRAM_URL = 'https://t.me/+qWPbfngZX1YxZmRi';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 z-50
                   w-12 h-12 rounded-full
                   bg-[rgba(30,22,10,0.85)] border border-[rgba(201,168,76,0.2)]
                   backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                   flex items-center justify-center
                   hover:border-[rgba(201,168,76,0.5)] hover:shadow-[0_0_15px_rgba(201,168,76,0.15)]
                   active:scale-95 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        title={t('feedback.title', { defaultValue: 'Feedback' })}
      >
        <span className="text-xl">💬</span>
      </motion.button>

      {/* Popup overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-[calc(8rem+env(safe-area-inset-bottom,0px))] md:bottom-20 right-4 z-50
                         w-[280px] bg-gradient-to-br from-[#1e160a] to-[#140f05]
                         border border-[rgba(201,168,76,0.2)] rounded-2xl
                         shadow-[0_8px_40px_rgba(0,0,0,0.6)] p-5"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💬</span>
                <p className="font-cinzel text-xs tracking-widest text-gold-light uppercase">
                  {t('feedback.title', { defaultValue: 'Feedback' })}
                </p>
              </div>

              {/* Text */}
              <p className="text-[0.8rem] text-[#c8b88a] leading-relaxed mb-4"
                 style={{ fontFamily: "'Raleway', sans-serif" }}>
                {t('feedback.description', {
                  defaultValue: "Fikr-mulohaza yoki shikoyatingiz bormi? Telegram guruhimizga yozing!"
                })}
              </p>

              {/* Telegram button */}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                           bg-[#2AABEE] hover:bg-[#229ED9] text-white
                           font-cinzel text-xs tracking-widest uppercase
                           transition-colors shadow-[0_4px_15px_rgba(42,171,238,0.3)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t('feedback.telegram_button', { defaultValue: "Telegram guruhga yozish" })}
              </a>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="w-full mt-3 py-2 rounded-xl
                           border border-[rgba(201,168,76,0.1)] text-[#9a8a6a]
                           font-cinzel text-[0.6rem] tracking-widest uppercase
                           hover:text-gold hover:border-[rgba(201,168,76,0.3)] transition-all"
              >
                {t('feedback.close', { defaultValue: 'Yopish' })}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
