import { useEffect }       from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation }  from 'react-i18next';
import { useToastStore }   from '../../store/toastStore';
import { useAuthStore }    from '../../store/authStore';
import { Language }        from '@arabic/shared';

function nameFor(ach: { nameRu: string; nameUz: string; nameEn: string }, lang: Language) {
  if (lang === 'ru') return ach.nameRu;
  if (lang === 'uz') return ach.nameUz;
  return ach.nameEn;
}

export function AchievementToast() {
  const { queue, pop }  = useToastStore();
  const { t }           = useTranslation('achievements');
  const lang            = (useAuthStore((s) => s.user?.language) ?? 'ru') as Language;
  const current         = queue[0];

  useEffect(() => {
    if (!current) return;
    const id = setTimeout(pop, 4000);
    return () => clearTimeout(id);
  }, [current, pop]);

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            exit={{    opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 bg-gradient-to-br from-[#201808] to-[#140f05]
                       border border-gold-dim rounded-2xl px-5 py-4
                       shadow-[0_8px_40px_rgba(201,168,76,0.3)] min-w-[280px]"
          >
            <span className="text-3xl">{current.icon}</span>
            <div>
              <p className="font-cinzel text-[0.6rem] tracking-widest text-gold-dim uppercase mb-0.5">
                {t('new_achievement')}
              </p>
              <p className="font-cinzel text-sm text-[#f0e6cc] tracking-wide">
                {nameFor(current, lang)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
