import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface Option {
  uz: string;
  ru: string;
  en: string;
  value: Record<string, string>;
}

interface Question {
  id: string;
  uz: string;
  ru: string;
  en: string;
  options: Option[];
}

interface SpinAnswers {
  pain_level?: string;
  motivation?: string;
  problem?: string;
  impact?: string;
  urgency?: string;
  ready?: string;
}

/* ── Questions ─────────────────────────────────────────────────────────────── */

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    uz: 'Arab alifbosini bilasizmi?',
    ru: 'Знаете ли вы арабский алфавит?',
    en: 'Do you know the Arabic alphabet?',
    options: [
      { uz: 'Umuman bilmayman', ru: 'Совсем не знаю', en: 'Not at all', value: { pain_level: 'high' } },
      { uz: 'Bir oz bilaman', ru: 'Немного знаю', en: 'A little', value: { pain_level: 'medium' } },
      { uz: "Yaxshi bilaman, lekin o'qiy olmayman", ru: 'Знаю буквы, но не могу читать', en: "Know letters but can't read", value: { pain_level: 'medium' } },
      { uz: "O'qiy olaman", ru: 'Умею читать', en: 'Can read', value: { pain_level: 'low' } },
    ],
  },
  {
    id: 'q2',
    uz: "Arab alifbosini nima uchun o'rganmoqchisiz?",
    ru: 'Зачем хотите выучить арабский алфавит?',
    en: 'Why do you want to learn?',
    options: [
      { uz: "Qur'on o'qish uchun", ru: 'Для чтения Корана', en: 'To read Quran', value: { motivation: 'quran' } },
      { uz: 'Umumiy bilim uchun', ru: 'Для общего развития', en: 'General knowledge', value: { motivation: 'education' } },
      { uz: "Farzandlarimga o'rgatish uchun", ru: 'Чтобы учить детей', en: 'To teach my children', value: { motivation: 'family' } },
      { uz: "Arab tilini o'rganish uchun", ru: 'Для изучения арабского языка', en: 'To learn Arabic language', value: { motivation: 'language' } },
    ],
  },
  {
    id: 'q3',
    uz: 'Eng qiyin tomoni nima?',
    ru: 'Что самое сложное?',
    en: "What's the hardest part?",
    options: [
      { uz: "O'xshash harflarni farqlash (ب ت ث)", ru: 'Различать похожие буквы (ب ت ث)', en: 'Distinguishing similar letters (ب ت ث)', value: { problem: 'similar_letters' } },
      { uz: 'Harakatlarni tushunish', ru: 'Понимать огласовки', en: 'Understanding vowel marks', value: { problem: 'harakat' } },
      { uz: 'Muntazam mashq qilish', ru: 'Заниматься регулярно', en: 'Practicing regularly', value: { problem: 'consistency' } },
      { uz: "Yaxshi o'quv material topish", ru: 'Найти хороший учебный материал', en: 'Finding good learning material', value: { problem: 'material' } },
    ],
  },
  {
    id: 'q4',
    uz: "Bu muammo hayotingizga qanday ta'sir qilmoqda?",
    ru: 'Как эта проблема влияет на вашу жизнь?',
    en: 'How does this problem affect your life?',
    options: [
      { uz: "Qur'onni o'z kuchim bilan o'qiy olmayman", ru: 'Не могу самостоятельно читать Коран', en: "Can't read Quran independently", value: { impact: 'quran_reading' } },
      { uz: 'Masjidda boshqalardan orqadaman', ru: 'Отстаю от других в мечети', en: 'Falling behind others at mosque', value: { impact: 'social_pressure' } },
      { uz: 'Farzandlarimga yordam bera olmayman', ru: 'Не могу помочь детям', en: "Can't help my children", value: { impact: 'family' } },
      { uz: "O'rganishni boshladim, lekin tashlab qo'ydim", ru: 'Начинал учить, но бросил', en: 'Started learning but quit', value: { impact: 'gave_up' } },
    ],
  },
  {
    id: 'q5',
    uz: "Qancha vaqtdan beri o'rganmoqchi bo'lyapsiz?",
    ru: 'Сколько уже хотите выучить?',
    en: 'How long have you wanted to learn?',
    options: [
      { uz: "Ko'p yillar", ru: 'Много лет', en: 'Many years', value: { urgency: 'very_high' } },
      { uz: 'Bir necha oy', ru: 'Несколько месяцев', en: 'A few months', value: { urgency: 'high' } },
      { uz: 'Yaqinda boshladim', ru: 'Недавно начал', en: 'Just started', value: { urgency: 'medium' } },
    ],
  },
  {
    id: 'q6',
    uz: "Agar bepul, qiziqarli va kuniga 10 daqiqa sarflasangiz bo'ladigan ilova bo'lsa — o'rganarmidingiz?",
    ru: 'Если бы было бесплатное, интересное приложение на 10 минут в день — стали бы учить?',
    en: 'If there was a free, fun app that takes just 10 minutes a day — would you learn?',
    options: [
      { uz: 'Ha, albatta!', ru: 'Да, конечно!', en: 'Yes, absolutely!', value: { ready: 'yes' } },
      { uz: "Sinab ko'rardim", ru: 'Попробовал бы', en: "I'd try it", value: { ready: 'maybe' } },
      { uz: 'Bilmayman', ru: 'Не уверен', en: 'Not sure', value: { ready: 'unsure' } },
    ],
  },
];

/* ── Diagnosis logic ───────────────────────────────────────────────────────── */

function getDiagnosis(answers: SpinAnswers) {
  const titles: { uz: string; ru: string; en: string }[] = [];
  const bodies: { uz: string; ru: string; en: string }[] = [];

  if (answers.pain_level === 'high' && answers.urgency === 'very_high') {
    titles.push({
      uz: 'Sizning holatgingiz uchun ideal yechim bor!',
      ru: 'Для вашей ситуации есть идеальное решение!',
      en: 'There is a perfect solution for your situation!',
    });
    bodies.push({
      uz: "Siz ko'p yillar davomida o'rganmoqchi bo'lgansiz. Endi kuniga 10 daqiqa — va 1 oyda arab alifbosini o'rganasiz. Bepul.",
      ru: 'Вы хотели учить много лет. Теперь 10 минут в день — и через месяц вы выучите арабский алфавит. Бесплатно.',
      en: "You've wanted to learn for years. Now just 10 minutes a day — and in 1 month you'll know the Arabic alphabet. Free.",
    });
  }

  if (answers.problem === 'similar_letters') {
    titles.push({
      uz: "Biz sizning muammongizni bilamiz!",
      ru: 'Мы знаем вашу проблему!',
      en: 'We know your problem!',
    });
    bodies.push({
      uz: "Siz ب va ت kabi harflarni adashtirasan — bizning maxsus mashqlar aynan shu muammoni hal qiladi!",
      ru: 'Вы путаете буквы вроде ب и ت — наши специальные упражнения решают именно эту проблему!',
      en: 'You confuse letters like ب and ت — our special exercises solve exactly this problem!',
    });
  }

  if (answers.impact === 'gave_up') {
    bodies.push({
      uz: "Bu safar tashlab qo'ymaysiz — biz siz bilan birgamiz!",
      ru: 'В этот раз вы не бросите — мы с вами!',
      en: "This time you won't quit — we're with you!",
    });
  }

  if (answers.motivation === 'quran') {
    bodies.push({
      uz: "Qur'on o'qish — eng ulug' maqsad. Birinchi qadamni bugun tashlang!",
      ru: 'Чтение Корана — великая цель. Сделайте первый шаг сегодня!',
      en: 'Reading Quran — the greatest goal. Take the first step today!',
    });
  }

  if (answers.motivation === 'family') {
    bodies.push({
      uz: "Farzandlaringizga eng yaxshi hadya — bilim. O'zingiz o'rganing, so'ng ularga o'rgating!",
      ru: 'Лучший подарок детям — знания. Выучите сами, затем научите их!',
      en: 'The best gift for your children — knowledge. Learn yourself, then teach them!',
    });
  }

  // Fallback
  if (titles.length === 0) {
    titles.push({
      uz: 'Siz uchun maxsus dastur tayyor!',
      ru: 'Для вас готова специальная программа!',
      en: 'A special program is ready for you!',
    });
  }
  if (bodies.length === 0) {
    bodies.push({
      uz: "Kuniga atigi 10 daqiqa — va 1 oyda arab alifbosini o'rganasiz. Bepul va qiziqarli!",
      ru: 'Всего 10 минут в день — и через месяц вы выучите арабский алфавит. Бесплатно и интересно!',
      en: "Just 10 minutes a day — and in 1 month you'll know the Arabic alphabet. Free and fun!",
    });
  }

  return { title: titles[0], bodies };
}

/* ── Components ────────────────────────────────────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export function SpinQuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SpinAnswers>({});
  const [direction, setDirection] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const total = QUESTIONS.length;

  const handleSelect = useCallback((option: Option) => {
    const newAnswers = { ...answers, ...option.value };
    setAnswers(newAnswers);

    if (step < total - 1) {
      setDirection(1);
      setTimeout(() => setStep(step + 1), 150);
    } else {
      // Save to localStorage
      localStorage.setItem('spin_answers', JSON.stringify(newAnswers));
      setDirection(1);
      setTimeout(() => setShowResults(true), 150);
    }
  }, [answers, step, total]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }, [step]);

  const diagnosis = getDiagnosis(answers);

  if (showResults) {
    return <ResultsScreen diagnosis={diagnosis} answers={answers} onStart={() => navigate('/login')} />;
  }

  const q = QUESTIONS[step];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0d0a07] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                        bg-[radial-gradient(ellipse,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          {/* Back button */}
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-[#9a8a6a] hover:text-gold-light transition-colors mb-4
                         min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft size={18} />
              <span className="font-cinzel text-[0.6rem] tracking-widest uppercase">Ortga</span>
            </button>
          )}

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-1.5 bg-[rgba(201,168,76,0.08)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((step + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a]">
              {step + 1}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={q.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {/* Question text */}
              <div className="text-center mb-8">
                <h2 className="font-cinzel text-lg sm:text-xl tracking-wide text-[#f0e6cc] leading-relaxed mb-2">
                  {q.uz}
                </h2>
                <p className="text-[#9a8a6a] font-raleway text-sm leading-relaxed">
                  {q.ru}
                </p>
                <p className="text-[#706040] font-raleway text-xs mt-1">
                  {q.en}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className="w-full text-left bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.1)]
                               rounded-2xl px-5 py-4 min-h-[60px]
                               hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(201,168,76,0.04)]
                               active:scale-[0.98] transition-all duration-200 group cursor-pointer"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  >
                    <p className="font-cinzel text-sm tracking-wide text-[#f0e6cc] group-hover:text-gold-light transition-colors">
                      {opt.uz}
                    </p>
                    <p className="text-[#9a8a6a] font-raleway text-xs mt-0.5">
                      {opt.ru}
                    </p>
                    <p className="text-[#5a5030] font-raleway text-[0.6rem] mt-0.5">
                      {opt.en}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}

/* ── Results Screen ────────────────────────────────────────────────────────── */

function ResultsScreen({
  diagnosis,
  answers,
  onStart,
}: {
  diagnosis: ReturnType<typeof getDiagnosis>;
  answers: SpinAnswers;
  onStart: () => void;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0d0a07] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px]
                        bg-[radial-gradient(ellipse,rgba(201,168,76,0.12)_0%,transparent_70%)]" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[300px]
                        bg-[radial-gradient(ellipse,rgba(76,175,120,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          className="w-full max-w-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle size={64} className="text-gold mx-auto" strokeWidth={1.5} />
          </motion.div>

          {/* Arabic decorative text */}
          <motion.p
            className="font-scheherazade text-4xl sm:text-5xl text-gold mb-4 select-none"
            style={{ textShadow: '0 0 40px rgba(201,168,76,0.2)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            بسم الله
          </motion.p>

          {/* Diagnosis title */}
          <motion.h1
            className="font-cinzel text-xl sm:text-2xl tracking-wide text-[#f0e6cc] mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {diagnosis.title.uz}
          </motion.h1>

          <motion.p
            className="text-[#9a8a6a] font-cinzel text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {diagnosis.title.ru}
          </motion.p>

          {/* Diagnosis bodies */}
          <motion.div
            className="space-y-4 mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {diagnosis.bodies.map((body, i) => (
              <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.1)]
                                      rounded-2xl px-5 py-4">
                <p className="font-raleway text-sm text-[#b8a880] leading-relaxed mb-1">
                  {body.uz}
                </p>
                <p className="font-raleway text-xs text-[#706040] leading-relaxed">
                  {body.ru}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              onClick={onStart}
              className="text-sm px-14 py-5 min-h-[56px] cursor-pointer w-full sm:w-auto
                         shadow-[0_0_50px_rgba(201,168,76,0.2)]"
            >
              <span className="flex items-center justify-center gap-2">
                BEPUL BOSHLASH <ArrowRight size={18} />
              </span>
            </Button>

            <p className="font-raleway text-xs text-[#706040]">
              Ro'yxatdan o'tish bepul va 30 soniya vaqt oladi
            </p>

            {/* Social proof */}
            <motion.div
              className="flex items-center justify-center gap-2 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex -space-x-2">
                {['#c9a84c', '#8ab4ff', '#ff8c42', '#c8a0ff'].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#0d0a07]"
                    style={{ backgroundColor: `${color}30`, boxShadow: `0 0 8px ${color}20` }}
                  />
                ))}
              </div>
              <p className="font-cinzel text-[0.6rem] tracking-wider text-[#9a8a6a]">
                5,000+ foydalanuvchi allaqachon o'rganmoqda
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
