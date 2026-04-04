import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef }           from 'react';
import { LanguageSwitcher } from '../components/ui/Badges';
import { Button }           from '../components/ui/Button';

/* ── Data ─────────────────────────────────────────────────────────────────── */

const MODES = [
  { icon: '📇', key: 'flashcard', gradient: 'from-[#2a1f08] to-[#3a2c0e]' },
  { icon: '🎯', key: 'quiz',      gradient: 'from-[#1a0f2e] to-[#2a1a3e]' },
  { icon: '⚡', key: 'speed',     gradient: 'from-[#2e1a08] to-[#3e2a0a]' },
  { icon: '🧠', key: 'memory',    gradient: 'from-[#0a1e2e] to-[#0a2e3e]' },
  { icon: '🔊', key: 'listen',    gradient: 'from-[#1e2e0a] to-[#2e3e0a]' },
  { icon: '✍️', key: 'write',     gradient: 'from-[#2e0a1a] to-[#3e0a2a]' },
  { icon: '🔍', key: 'find',      gradient: 'from-[#0a2e1e] to-[#0a3e2e]' },
  { icon: '⚡⚡', key: 'lightning', gradient: 'from-[#2e2e08] to-[#3e3e0a]' },
];

const FEATURES = [
  {
    icon: '🎮',
    title: 'Геймификация',
    desc: 'XP, уровни, достижения и серии — учёба превращается в игру',
  },
  {
    icon: '📱',
    title: 'Всегда с собой',
    desc: 'Устанавливай как приложение на телефон и учись без интернета',
  },
  {
    icon: '🏆',
    title: 'Соревнуйся',
    desc: 'Таблица лидеров, вызовы друзьям и общий рейтинг',
  },
  {
    icon: '📊',
    title: 'Умный прогресс',
    desc: 'Система находит слабые буквы и тренирует именно их',
  },
  {
    icon: '📖',
    title: 'Учебник',
    desc: 'Курс «Муаллим Сани» с главами, тестами и дорожной картой',
  },
  {
    icon: '🕌',
    title: 'Режим Коран',
    desc: 'Читай аяты Корана и улучшай навык чтения арабского текста',
  },
];

const STEPS = [
  { num: '01', title: 'Зарегистрируйся', desc: 'Один клик — и ты в системе' },
  { num: '02', title: 'Выбери режим', desc: '8 режимов обучения на любой вкус' },
  { num: '03', title: 'Учись каждый день', desc: 'Серии и XP мотивируют не бросать' },
  { num: '04', title: 'Выучи все 28 букв', desc: 'От новичка до мастера за недели' },
];

const TESTIMONIALS = [
  { name: 'Алишер', text: 'За 2 недели выучил все буквы. Режим скорости — огонь!', level: '⭐ Expert' },
  { name: 'Мадина', text: 'Наконец-то могу читать арабский текст. Спасибо за Коран-режим!', level: '👑 Master' },
  { name: 'Рустам', text: 'Установил как приложение — учу в метро каждый день', level: '📚 Student' },
];

const LETTERS_PREVIEW = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <span className="inline-block font-cinzel text-[0.6rem] tracking-[0.3em] uppercase text-gold-dim
                       border border-[rgba(201,168,76,0.2)] rounded-full px-4 py-1.5 mb-4">
        {badge}
      </span>
      <h2 className="font-cinzel text-2xl md:text-3xl tracking-wide text-[#f0e6cc] mb-3">{title}</h2>
      {subtitle && <p className="text-[#9a8a6a] font-raleway max-w-lg mx-auto text-sm leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */

export function LandingPage() {
  const { t } = useTranslation(['common', 'learn']);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[rgba(13,10,7,0.85)] border-b border-[rgba(201,168,76,0.08)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-scheherazade text-2xl text-gold leading-none">ا</span>
            <span className="font-cinzel text-xs tracking-[0.2em] text-[#f0e6cc] uppercase hidden sm:inline">
              Arabic Alphabet
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login">
              <Button size="sm" variant="outline">Войти</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 pb-10">
        {/* Decorative background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
                          bg-[radial-gradient(circle,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32
                          bg-gradient-to-t from-[#0d0a07] to-transparent" />
        </div>

        {/* Floating Arabic letters background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
          {LETTERS_PREVIEW.map((letter, i) => (
            <motion.span
              key={i}
              className="absolute font-scheherazade text-gold"
              style={{
                fontSize: `${1.5 + Math.random() * 3}rem`,
                left: `${(i / LETTERS_PREVIEW.length) * 100}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center max-w-2xl mx-auto"
        >
          {/* Arabic title */}
          <motion.p
            className="font-scheherazade text-7xl sm:text-8xl md:text-9xl text-gold mb-4 leading-none"
            style={{ textShadow: '0 0 60px rgba(201,168,76,0.3), 0 0 120px rgba(201,168,76,0.1)' }}
            animate={{ textShadow: ['0 0 60px rgba(201,168,76,0.3)', '0 0 80px rgba(201,168,76,0.5)', '0 0 60px rgba(201,168,76,0.3)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            الأبجدية العربية
          </motion.p>

          <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.15em] text-[#f0e6cc] mb-6">
            {t('common:app_name')}
          </h1>

          <p className="text-[#b8a880] max-w-md mx-auto font-raleway text-base sm:text-lg leading-relaxed mb-3">
            Выучи арабский алфавит с нуля — прямо в своём телефоне
          </p>

          <p className="text-[#9a8a6a] font-raleway text-sm mb-10">
            8 игровых режимов · Геймификация · Работает офлайн
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/login">
              <Button size="lg" className="text-base px-12 py-5 shadow-[0_0_40px_rgba(201,168,76,0.2)]">
                Начать бесплатно
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="ghost" className="text-[#9a8a6a]">
                Узнать больше ↓
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: '28', label: 'Букв' },
            { value: '8', label: 'Режимов' },
            { value: '13', label: 'Достижений' },
            { value: '∞', label: 'Мотивации' },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <p className="font-cinzel text-3xl sm:text-4xl text-gold">{value}</p>
              <p className="font-cinzel text-[0.6rem] tracking-[0.2em] text-[#9a8a6a] uppercase mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-[rgba(201,168,76,0.3)] flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-gold-dim"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Phone Mockup Section ── */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge="✦ Мобильное приложение"
              title="Учись в любом месте"
              subtitle="Установи как приложение на телефон — работает офлайн, моментально открывается, всегда под рукой"
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              {/* Phone frame */}
              <div className="relative w-[260px] h-[520px] rounded-[3rem] border-2 border-[rgba(201,168,76,0.15)]
                              bg-gradient-to-b from-[#1a1208] to-[#0d0a07] p-3 shadow-[0_0_60px_rgba(201,168,76,0.08)]">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0d0a07] rounded-b-2xl" />
                {/* Screen content */}
                <div className="w-full h-full rounded-[2.3rem] bg-[#0d0a07] overflow-hidden p-4 pt-10 flex flex-col items-center">
                  <p className="font-scheherazade text-4xl text-gold mb-2">الأبجدية</p>
                  <p className="font-cinzel text-[0.5rem] tracking-[0.2em] text-[#9a8a6a] uppercase mb-6">Dashboard</p>
                  {/* Mini stat cards */}
                  <div className="grid grid-cols-3 gap-2 w-full mb-4">
                    {['🔥 7', '📚 18', '🏆 #3'].map((s) => (
                      <div key={s} className="bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.1)]
                                              rounded-xl py-2 text-center text-xs text-gold-light font-cinzel">
                        {s}
                      </div>
                    ))}
                  </div>
                  {/* Mini mode grid */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {['📇','🎯','⚡','🧠'].map((e) => (
                      <div key={e} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.08)]
                                              rounded-xl py-3 text-center text-lg">
                        {e}
                      </div>
                    ))}
                  </div>
                  {/* XP bar */}
                  <div className="w-full mt-4 bg-[rgba(201,168,76,0.1)] rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="font-cinzel text-[0.45rem] text-[#9a8a6a] tracking-wider mt-1">650 / 1000 XP</p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="flex flex-col gap-5 max-w-sm">
                {[
                  { icon: '⚡', title: 'Мгновенный запуск', desc: 'Открывается как родное приложение за 0.5 сек' },
                  { icon: '📶', title: 'Работает офлайн', desc: 'Учись в метро, самолёте или где нет связи' },
                  { icon: '🔔', title: 'Напоминания', desc: 'Не забывай практиковаться каждый день' },
                  { icon: '💾', title: 'Прогресс сохраняется', desc: 'Синхронизация между всеми устройствами' },
                ].map(({ icon, title, desc }, i) => (
                  <FadeIn key={title} delay={0.1 * i}>
                    <div className="flex items-start gap-4">
                      <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <h3 className="font-cinzel text-sm tracking-wide text-[#f0e6cc] mb-1">{title}</h3>
                        <p className="text-[#9a8a6a] text-sm font-raleway">{desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="relative py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge="✦ Возможности"
              title="Всё для изучения арабского"
              subtitle="Комплексная платформа — от первой буквы до чтения Корана"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="group relative bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.08)]
                                rounded-2xl p-6 transition-all duration-300
                                hover:border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.03)]
                                hover:shadow-[0_0_30px_rgba(201,168,76,0.06)]">
                  <span className="text-3xl mb-3 block">{icon}</span>
                  <h3 className="font-cinzel text-sm tracking-wide text-[#f0e6cc] mb-2">{title}</h3>
                  <p className="text-[#9a8a6a] text-sm font-raleway leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 Learning Modes ── */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge="✦ 8 Режимов"
              title="Учись как удобно именно тебе"
              subtitle="Флешкарточки, квизы, скоростные игры, тренировка на слух и многое другое"
            />
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
            {MODES.map(({ icon, key, gradient }, i) => (
              <FadeIn key={key} delay={i * 0.06}>
                <div className={`group bg-gradient-to-br ${gradient} border border-[rgba(201,168,76,0.1)]
                                rounded-2xl p-5 text-center transition-all duration-300
                                hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1
                                hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)]`}>
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{icon}</p>
                  <p className="font-cinzel text-[0.55rem] tracking-[0.15em] text-[#9a8a6a] uppercase
                               group-hover:text-gold-light transition-colors">
                    {t(`learn:modes.${key}`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge="✦ Как это работает"
              title="4 шага к арабскому"
            />
          </FadeIn>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-gradient-to-b from-gold-dim via-gold to-gold-dim
                            hidden sm:block opacity-20" />

            <div className="flex flex-col gap-6">
              {STEPS.map(({ num, title, desc }, i) => (
                <FadeIn key={num} delay={i * 0.12}>
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-[3.3rem] h-[3.3rem] rounded-full border border-gold-dim
                                    bg-[rgba(201,168,76,0.06)] flex items-center justify-center
                                    font-cinzel text-sm text-gold tracking-wider">
                      {num}
                    </div>
                    <div className="pt-2">
                      <h3 className="font-cinzel text-sm tracking-wide text-[#f0e6cc] mb-1">{title}</h3>
                      <p className="text-[#9a8a6a] text-sm font-raleway">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Arabic Letters Showcase ── */}
      <section className="relative py-16 md:py-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <SectionTitle
              badge="✦ 28 Букв"
              title="Весь арабский алфавит"
              subtitle="Каждую букву — с произношением, написанием и примерами"
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-xl mx-auto">
              {LETTERS_PREVIEW.map((letter, i) => (
                <motion.div
                  key={i}
                  className="w-11 h-11 md:w-14 md:h-14 rounded-xl border border-[rgba(201,168,76,0.12)]
                             bg-[rgba(201,168,76,0.04)] flex items-center justify-center
                             font-scheherazade text-xl md:text-2xl text-gold-light
                             hover:border-gold hover:bg-[rgba(201,168,76,0.1)] transition-all cursor-default"
                  whileHover={{ scale: 1.15, y: -4 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 + 0.2 }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge="✦ Отзывы"
              title="Нас уже используют"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {TESTIMONIALS.map(({ name, text, level }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.08)]
                                rounded-2xl p-6 flex flex-col h-full">
                  <p className="text-[#b8a880] font-raleway text-sm leading-relaxed mb-4 flex-1">
                    «{text}»
                  </p>
                  <div className="flex items-center justify-between border-t border-[rgba(201,168,76,0.08)] pt-3">
                    <span className="font-cinzel text-xs tracking-wide text-[#f0e6cc]">{name}</span>
                    <span className="text-[0.6rem] font-cinzel tracking-wider text-[#9a8a6a]">{level}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install PWA Banner ── */}
      <section className="relative py-16 md:py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl border border-[rgba(201,168,76,0.15)]
                          bg-gradient-to-br from-[#1a1208] via-[#0d0a07] to-[#1a1208]
                          p-8 md:p-12 text-center">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />

            <div className="relative">
              <p className="text-4xl mb-4">📲</p>
              <h2 className="font-cinzel text-xl md:text-2xl tracking-wide text-[#f0e6cc] mb-3">
                Установи на телефон
              </h2>
              <p className="text-[#9a8a6a] font-raleway text-sm max-w-md mx-auto mb-2 leading-relaxed">
                Открой сайт в браузере на телефоне → нажми «Поделиться» → «На экран Домой»
              </p>
              <p className="text-[#706040] font-raleway text-xs mb-6">
                Работает на iOS и Android · Не занимает места · Обновляется автоматически
              </p>
              <Link to="/login">
                <Button size="lg">Попробовать сейчас</Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-20 md:py-32 px-4 text-center">
        <FadeIn>
          <motion.p
            className="font-scheherazade text-5xl sm:text-6xl text-gold mb-6"
            style={{ textShadow: '0 0 40px rgba(201,168,76,0.2)' }}
          >
            بسم الله الرحمن الرحيم
          </motion.p>
          <h2 className="font-cinzel text-xl md:text-2xl tracking-wide text-[#f0e6cc] mb-4">
            Начни свой путь сегодня
          </h2>
          <p className="text-[#9a8a6a] font-raleway text-sm mb-8 max-w-md mx-auto">
            Присоединяйся к тем, кто уже учит арабский алфавит — бесплатно и без ограничений
          </p>
          <Link to="/login">
            <Button size="lg" className="text-base px-14 py-5 shadow-[0_0_50px_rgba(201,168,76,0.25)]">
              Начать учиться
            </Button>
          </Link>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(201,168,76,0.06)] py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-scheherazade text-xl text-gold">ا</span>
            <span className="font-cinzel text-[0.6rem] tracking-[0.2em] text-[#9a8a6a] uppercase">
              Arabic Alphabet · 2024–2026
            </span>
          </div>
          <p className="font-raleway text-[0.7rem] text-[#706040]">
            Бесплатная платформа для изучения арабского алфавита
          </p>
        </div>
      </footer>
    </div>
  );
}
