import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import { LanguageSwitcher } from '../components/ui/Badges';
import { Button }           from '../components/ui/Button';

const MODES = [
  { icon: '📇', key: 'flashcard' },
  { icon: '🎯', key: 'quiz' },
  { icon: '⚡', key: 'speed' },
  { icon: '🧠', key: 'memory' },
  { icon: '🔊', key: 'listen' },
  { icon: '✍️',  key: 'write' },
];

export function LandingPage() {
  const { t } = useTranslation(['common', 'learn']);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="absolute top-4 right-4"><LanguageSwitcher /></div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mt-16 mb-12"
      >
        <p className="font-scheherazade text-7xl text-gold text-shadow-gold mb-2">
          الأبجدية العربية
        </p>
        <h1 className="font-cinzel text-2xl tracking-widest text-[#f0e6cc] mb-4">
          {t('common:app_name')}
        </h1>
        <p className="text-[#9a8a6a] max-w-md mx-auto font-raleway leading-relaxed">
          Выучи все 28 букв арабского алфавита с геймификацией, квизами и соревнованиями
        </p>
      </motion.div>

      {/* Mode cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3 max-w-sm w-full mb-12"
      >
        {MODES.map(({ icon, key }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
            className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.12)]
                       rounded-2xl p-4 text-center"
          >
            <p className="text-2xl mb-1">{icon}</p>
            <p className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase">
              {t(`learn:modes.${key}`)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Link to="/login">
          <Button size="lg">Начать учиться</Button>
        </Link>
        <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase">
          ✦ 28 букв · 8 режимов · 13 достижений ✦
        </p>
      </div>
    </div>
  );
}
