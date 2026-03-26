import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { LetterDetail } from '../../components/learn/LetterDetail';
import { Button } from '../../components/ui/Button';
import { LETTERS, ArabicLetter, Language } from '@arabic/shared';

interface QuranPhrase {
  arabic: string;
  transliteration: string;
  translationRu: string;
  translationUz: string;
  translationEn: string;
}

const PHRASES: QuranPhrase[] = [
  {
    arabic: '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0647\u0650',
    transliteration: 'Bismillahi',
    translationRu: '\u0412\u043e \u0438\u043c\u044f \u0410\u043b\u043b\u0430\u0445\u0430',
    translationUz: 'Alloh nomi bilan',
    translationEn: 'In the name of Allah',
  },
  {
    arabic: '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650',
    transliteration: 'Bismillahir Rahmanir Rahim',
    translationRu: '\u0412\u043e \u0438\u043c\u044f \u0410\u043b\u043b\u0430\u0445\u0430, \u041c\u0438\u043b\u043e\u0441\u0442\u0438\u0432\u043e\u0433\u043e, \u041c\u0438\u043b\u043e\u0441\u0435\u0440\u0434\u043d\u043e\u0433\u043e',
    translationUz: 'Mehribon va rahmli Alloh nomi bilan',
    translationEn: 'In the name of Allah, the Most Gracious, the Most Merciful',
  },
  {
    arabic: '\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0647\u0650',
    transliteration: 'Alhamdu lillahi',
    translationRu: '\u0425\u0432\u0430\u043b\u0430 \u0410\u043b\u043b\u0430\u0445\u0443',
    translationUz: 'Allohga hamd bo\'lsin',
    translationEn: 'Praise be to Allah',
  },
  {
    arabic: '\u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e \u0627\u0644\u0644\u0647\u0650',
    transliteration: 'Subhanallahi',
    translationRu: '\u0421\u043b\u0430\u0432\u0430 \u0410\u043b\u043b\u0430\u0445\u0443',
    translationUz: 'Alloh pokdir',
    translationEn: 'Glory be to Allah',
  },
  {
    arabic: '\u0627\u0644\u0644\u0647\u064f \u0623\u0643\u0652\u0628\u064e\u0631\u064f',
    transliteration: 'Allahu Akbar',
    translationRu: '\u0410\u043b\u043b\u0430\u0445 \u0412\u0435\u043b\u0438\u043a',
    translationUz: 'Alloh buyukdir',
    translationEn: 'Allah is the Greatest',
  },
  {
    arabic: '\u0644\u0627 \u0625\u0650\u0644\u064e\u0647\u064e \u0625\u0650\u0644\u0651\u064e\u0627 \u0627\u0644\u0644\u0647\u064f',
    transliteration: 'La ilaha illallah',
    translationRu: '\u041d\u0435\u0442 \u0431\u043e\u0436\u0435\u0441\u0442\u0432\u0430, \u043a\u0440\u043e\u043c\u0435 \u0410\u043b\u043b\u0430\u0445\u0430',
    translationUz: 'Allohdan boshqa iloh yo\'q',
    translationEn: 'There is no god but Allah',
  },
  {
    arabic: '\u0625\u0650\u0646\u0652 \u0634\u064e\u0627\u0621\u064e \u0627\u0644\u0644\u0647\u064f',
    transliteration: 'In sha Allah',
    translationRu: '\u0415\u0441\u043b\u0438 \u041c\u043e\u043b\u0438\u0442 \u0410\u043b\u043b\u0430\u0445',
    translationUz: 'Alloh xohlasa',
    translationEn: 'If Allah wills',
  },
  {
    arabic: '\u0645\u064e\u0627 \u0634\u064e\u0627\u0621\u064e \u0627\u0644\u0644\u0647\u064f',
    transliteration: 'Ma sha Allah',
    translationRu: '\u0422\u0430\u043a \u043f\u043e\u0436\u0435\u043b\u0430\u043b \u0410\u043b\u043b\u0430\u0445',
    translationUz: 'Alloh xohlagan narsa',
    translationEn: 'As Allah has willed',
  },
  {
    arabic: '\u0623\u064e\u0633\u0652\u062a\u064e\u063a\u0652\u0641\u0650\u0631\u064f \u0627\u0644\u0644\u0647\u064e',
    transliteration: 'Astaghfirullah',
    translationRu: '\u041f\u0440\u043e\u0448\u0443 \u043f\u0440\u043e\u0449\u0435\u043d\u0438\u044f \u0443 \u0410\u043b\u043b\u0430\u0445\u0430',
    translationUz: 'Allohdan kechirim so\'rayman',
    translationEn: 'I seek forgiveness from Allah',
  },
  {
    arabic: '\u062c\u064e\u0632\u064e\u0627\u0643\u064e \u0627\u0644\u0644\u0647\u064f \u062e\u064e\u064a\u0652\u0631\u064b\u0627',
    transliteration: 'Jazakallahu khayran',
    translationRu: '\u0414\u0430 \u0432\u043e\u0437\u043d\u0430\u0433\u0440\u0430\u0434\u0438\u0442 \u0442\u0435\u0431\u044f \u0410\u043b\u043b\u0430\u0445 \u0431\u043b\u0430\u0433\u043e\u043c',
    translationUz: 'Alloh sizga yaxshilik bersin',
    translationEn: 'May Allah reward you with goodness',
  },
  {
    arabic: '\u0627\u0644\u0633\u0651\u064e\u0644\u064e\u0627\u0645\u064f \u0639\u064e\u0644\u064e\u064a\u0652\u0643\u064f\u0645\u0652',
    transliteration: 'Assalamu alaykum',
    translationRu: '\u041c\u0438\u0440 \u0432\u0430\u043c',
    translationUz: 'Sizga tinchlik',
    translationEn: 'Peace be upon you',
  },
  {
    arabic: '\u0628\u064e\u0627\u0631\u064e\u0643\u064e \u0627\u0644\u0644\u0647\u064f \u0641\u0650\u064a\u0643\u064e',
    transliteration: 'Barakallahu feek',
    translationRu: '\u0414\u0430 \u0431\u043b\u0430\u0433\u043e\u0441\u043b\u043e\u0432\u0438\u0442 \u0442\u0435\u0431\u044f \u0410\u043b\u043b\u0430\u0445',
    translationUz: 'Alloh sizga baraka bersin',
    translationEn: 'May Allah bless you',
  },
];

function getTranslation(phrase: QuranPhrase, lang: Language): string {
  if (lang === 'ru') return phrase.translationRu;
  if (lang === 'uz') return phrase.translationUz;
  return phrase.translationEn;
}

function findLetterForChar(char: string): ArabicLetter | null {
  // Strip diacritics to find the base letter
  const baseChar = char.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  return LETTERS.find((l) => l.code === baseChar) ?? null;
}

export function QuranModePage() {
  const { t } = useTranslation(['learn', 'common']);
  const lang = (useAuthStore((s) => s.user?.language) ?? 'uz') as Language;
  const [selectedPhrase, setSelectedPhrase] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter | null>(null);
  const [showLetterDetail, setShowLetterDetail] = useState(false);

  const phrase = PHRASES[selectedPhrase];

  const handleCharTap = (char: string) => {
    const letter = findLetterForChar(char);
    if (letter) {
      setSelectedLetter(letter);
      setShowLetterDetail(true);
    }
  };

  // Split arabic text into characters (keeping diacritics with their base chars)
  const getCharacterGroups = (text: string): string[] => {
    const groups: string[] = [];
    let current = '';
    for (const char of text) {
      if (/[\u064B-\u065F\u0670\u06D6-\u06ED\u0651]/.test(char)) {
        // Diacritic — append to current
        current += char;
      } else {
        if (current) groups.push(current);
        current = char;
      }
    }
    if (current) groups.push(current);
    return groups;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8">
      <LetterDetail
        letter={selectedLetter}
        visible={showLetterDetail}
        onClose={() => setShowLetterDetail(false)}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-cinzel text-[0.65rem] tracking-[4px] text-[#9a8a6a] uppercase mb-2">
          {t('common:quran.title')}
        </p>
        <p className="font-cinzel text-xs text-[#9a8a6a]">
          {t('common:quran.subtitle')}
        </p>
      </motion.div>

      {/* Phrase card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-[#201808] to-[#140f05] border border-[#3a2d10]
                     rounded-3xl p-8 mb-6 text-center"
        >
          {/* Arabic text — each letter tappable */}
          <div className="mb-6 rtl" dir="rtl">
            <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
              {getCharacterGroups(phrase.arabic).map((charGroup, i) => {
                const isSpace = charGroup === ' ';
                const letter = findLetterForChar(charGroup);
                if (isSpace) return <span key={i} className="w-3" />;

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleCharTap(charGroup)}
                    className={`font-scheherazade text-4xl leading-relaxed transition-all
                      ${letter
                        ? 'text-gold-light hover:text-gold cursor-pointer hover:scale-110'
                        : 'text-[#f0e6cc] cursor-default'}`}
                    whileTap={letter ? { scale: 1.3 } : undefined}
                    dir="rtl"
                  >
                    {charGroup}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Transliteration */}
          <p className="font-raleway text-sm text-[#9a8a6a] italic mb-3">
            {phrase.transliteration}
          </p>

          {/* Translation */}
          <p className="font-cinzel text-sm text-[#f0e6cc]">
            {getTranslation(phrase, lang)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedPhrase((p) => Math.max(0, p - 1))}
          disabled={selectedPhrase === 0}
        >
          {'\u2190'}
        </Button>

        <p className="font-cinzel text-xs text-[#9a8a6a] tracking-widest">
          {selectedPhrase + 1} / {PHRASES.length}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedPhrase((p) => Math.min(PHRASES.length - 1, p + 1))}
          disabled={selectedPhrase === PHRASES.length - 1}
        >
          {'\u2192'}
        </Button>
      </div>

      {/* Phrase list */}
      <div className="flex flex-col gap-2">
        <p className="font-cinzel text-[0.6rem] tracking-[3px] text-[#9a8a6a] uppercase mb-2">
          {t('common:quran.all_phrases')}
        </p>
        {PHRASES.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => setSelectedPhrase(i)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`text-left p-3 rounded-xl border transition-all
              ${i === selectedPhrase
                ? 'border-gold-dim bg-[rgba(201,168,76,0.08)]'
                : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(201,168,76,0.15)]'}`}
          >
            <p className="font-scheherazade text-lg text-gold-light" dir="rtl">{p.arabic}</p>
            <p className="font-cinzel text-[0.55rem] text-[#9a8a6a] mt-0.5">{p.transliteration}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
