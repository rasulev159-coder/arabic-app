import { Link }           from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion }         from 'framer-motion';
import { useAuthStore }   from '../store/authStore';
import { MUALLIM_SONIY }  from '../data/muallimSoniy';
import { Language }        from '@arabic/shared';

export function TextbookPage() {
  const { t }  = useTranslation('common');
  const user   = useAuthStore((s) => s.user);
  const lang   = (user?.language ?? 'uz') as Language;

  const getTitle = (ch: typeof MUALLIM_SONIY[0]) =>
    lang === 'ru' ? ch.titleRu : lang === 'en' ? ch.titleEn : ch.titleUz;

  const getDesc = (ch: typeof MUALLIM_SONIY[0]) =>
    lang === 'ru' ? ch.descRu : lang === 'en' ? ch.descEn : ch.descUz;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/dashboard"
          className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                     hover:text-gold transition-colors"
        >
          &larr; {t('nav.dashboard')}
        </Link>
        <h1 className="font-cinzel text-2xl text-[#f0e6cc] mt-3 tracking-wide">
          {t('textbook.title')}
        </h1>
        <p className="font-cinzel text-[0.65rem] tracking-[3px] text-[#9a8a6a] uppercase mt-1">
          {t('textbook.subtitle')}
        </p>
      </motion.div>

      {/* Chapter cards */}
      <div className="flex flex-col gap-4">
        {MUALLIM_SONIY.map((chapter, i) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i + 0.1 }}
          >
            <Link
              to={`/textbook/${chapter.id}`}
              className="block bg-gradient-to-br from-[#201808] to-[#140f05]
                         border border-[rgba(201,168,76,0.12)]
                         hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_0_20px_rgba(201,168,76,0.08)]
                         rounded-2xl p-5 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                                bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.1)]
                                rounded-xl text-2xl group-hover:scale-110 transition-transform">
                  {chapter.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#9a8a6a] uppercase">
                    {t('textbook.chapter')} {chapter.order}
                  </p>
                  <h3 className="font-cinzel text-sm text-[#f0e6cc] mt-0.5 tracking-wide">
                    {getTitle(chapter)}
                  </h3>
                  <p className="text-[0.7rem] text-[#9a8a6a] mt-1 leading-relaxed line-clamp-2">
                    {getDesc(chapter)}
                  </p>
                  <p className="font-cinzel text-[0.5rem] tracking-widest text-[rgba(201,168,76,0.5)] uppercase mt-2">
                    {chapter.lessons.length} {t('textbook.lesson').toLowerCase()}
                    {chapter.lessons.length !== 1 ? (lang === 'en' ? 's' : '') : ''}
                  </p>
                </div>

                {/* Arrow */}
                <span className="font-cinzel text-gold-light text-lg opacity-40 group-hover:opacity-100
                                 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2">
                  &rarr;
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
