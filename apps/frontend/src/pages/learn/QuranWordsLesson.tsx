import { useParams, Link } from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion }          from 'framer-motion';
import { useAuthStore }    from '../../store/authStore';
import { useQuranWordsStore } from '../../store/quranWordsStore';
import { QURAN_WORDS_LESSONS, QuranWord } from '../../data/quranWords';
import { Language } from '@arabic/shared';
import { useCallback } from 'react';

function playArabicTTS(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ar-SA';
  utter.rate = 0.8;
  window.speechSynthesis.speak(utter);
}

function getTranslation(word: QuranWord, lang: Language) {
  if (lang === 'ru') return word.meaningRu;
  if (lang === 'en') return word.meaningEn;
  return word.meaningUz;
}

const STATUS_BADGES: Record<string, { label: string; color: string; icon: string }> = {
  mastered: { label: 'mastered', color: 'text-[#4caf78] bg-[rgba(76,175,120,0.12)] border-[rgba(76,175,120,0.25)]', icon: '\u2705' },
  learning: { label: 'learning', color: 'text-[#e8c96d] bg-[rgba(201,168,76,0.12)] border-[rgba(201,168,76,0.25)]', icon: '\uD83D\uDCD6' },
  new:      { label: 'new_word', color: 'text-[#9a8a6a] bg-[rgba(154,138,106,0.08)] border-[rgba(154,138,106,0.2)]', icon: '\uD83C\uDD95' },
};

export function QuranWordsLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { t } = useTranslation('common');
  const lang = (useAuthStore((s) => s.user)?.language ?? 'uz') as Language;
  const getWordStatus = useQuranWordsStore((s) => s.getWordStatus);

  const lesson = QURAN_WORDS_LESSONS.find((l) => l.id === Number(lessonId));

  const getLessonTitle = useCallback(() => {
    if (!lesson) return '';
    if (lang === 'ru') return lesson.titleRu;
    if (lang === 'en') return lesson.titleEn;
    return lesson.titleUz;
  }, [lesson, lang]);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="font-cinzel text-[#9a8a6a]">Lesson not found</p>
        <Link to="/learn/quran-words" className="font-cinzel text-xs text-gold-light mt-4 inline-block">
          {'\u2190'} Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          to="/learn/quran-words"
          className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase
                     hover:text-gold transition-colors inline-block mb-4"
        >
          {'\u2190'} {t('quran_words.title')}
        </Link>
        <h1 className="font-cinzel text-xl text-[#f0e6cc] tracking-wide">
          {t('quran_words.lesson', { n: lesson.id })}
        </h1>
        <p className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] mt-1">
          {getLessonTitle()}
        </p>
      </motion.div>

      {/* Word cards */}
      <div className="flex flex-col gap-3 mb-8">
        {lesson.words.map((word, i) => {
          const status = getWordStatus(word.id);
          const badge = STATUS_BADGES[status];

          return (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className="bg-gradient-to-br from-[#1a1508] to-[#140f05] border border-[rgba(201,168,76,0.1)]
                         rounded-2xl p-4 hover:border-[rgba(201,168,76,0.25)] transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Arabic word */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-3xl text-gold-light leading-relaxed"
                    style={{ fontFamily: "'Scheherazade New', serif", direction: 'rtl' }}
                  >
                    {word.arabic}
                  </p>
                  <p className="font-cinzel text-xs text-[#b8a880] mt-1">
                    {word.transliteration}
                  </p>
                  <p className="font-cinzel text-sm text-[#f0e6cc] mt-1">
                    {getTranslation(word, lang)}
                  </p>
                </div>

                {/* Right side: badge + TTS */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[0.55rem]
                                    font-cinzel tracking-widest uppercase ${badge.color}`}>
                    {badge.icon} {t(`quran_words.${badge.label}`)}
                  </span>
                  <button
                    onClick={() => playArabicTTS(word.arabic)}
                    className="w-10 h-10 rounded-full flex items-center justify-center
                               bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)]
                               hover:bg-[rgba(201,168,76,0.15)] transition-all active:scale-95
                               text-lg"
                    aria-label="Play pronunciation"
                  >
                    {'\uD83D\uDD0A'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Take Quiz button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Link
          to={`/learn/quran-words/${lesson.id}/quiz`}
          className="inline-block font-cinzel text-sm tracking-widest uppercase px-8 py-4 rounded-full
                     border border-gold-dim text-gold-light bg-[rgba(201,168,76,0.08)]
                     hover:bg-[rgba(201,168,76,0.15)] hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]
                     transition-all active:scale-95"
        >
          {t('quran_words.take_quiz')}
        </Link>
      </motion.div>
    </div>
  );
}
