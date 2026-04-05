import { Link }            from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef }           from 'react';
import { LanguageSwitcher } from '../components/ui/Badges';
import { Button }           from '../components/ui/Button';
import {
  Layers, Target, Zap, Brain, Volume2, PenTool,
  Search, BookOpen, Smartphone, Wifi, WifiOff, Trophy,
  BarChart3, Gamepad2, Users, Star, ChevronDown,
  ArrowRight, Download, Sparkles, Clock, TrendingUp,
  Shield, Globe,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────────────────────────────── */

const MODES = [
  { icon: Layers,   key: 'flashcard', color: '#c9a84c' },
  { icon: Target,   key: 'quiz',      color: '#8ab4ff' },
  { icon: Zap,      key: 'speed',     color: '#ff8c42' },
  { icon: Brain,    key: 'memory',    color: '#c8a0ff' },
  { icon: Volume2,  key: 'listen',    color: '#4caf78' },
  { icon: PenTool,  key: 'write',     color: '#ff6b8a' },
  { icon: Search,   key: 'find',      color: '#42d4ff' },
  { icon: Zap,      key: 'lightning', color: '#ffe042' },
];

const FEATURES = [
  {
    icon: Gamepad2,
    title: 'Геймификация',
    desc: 'XP, уровни, достижения и серии — учёба превращается в игру',
  },
  {
    icon: Smartphone,
    title: 'Всегда с собой',
    desc: 'Установи как приложение и учись офлайн — в метро, самолёте, где угодно',
  },
  {
    icon: Trophy,
    title: 'Соревнуйся',
    desc: 'Таблица лидеров, вызовы друзьям и общий рейтинг скорости',
  },
  {
    icon: TrendingUp,
    title: 'Умный прогресс',
    desc: 'Система находит слабые буквы и тренирует именно их',
  },
  {
    icon: BookOpen,
    title: 'Учебник',
    desc: 'Курс «Муаллим Сани» — главы, тесты и дорожная карта обучения',
  },
  {
    icon: Sparkles,
    title: 'Режим Коран',
    desc: 'Читай аяты Корана и улучшай навык чтения арабского текста',
  },
];

const STEPS = [
  { icon: Users,      title: 'Зарегистрируйся', desc: 'Один клик через Google — и ты в системе' },
  { icon: Gamepad2,   title: 'Выбери режим',     desc: '8 режимов обучения на любой вкус' },
  { icon: Clock,      title: 'Учись каждый день', desc: 'Серии и XP мотивируют не бросать' },
  { icon: Star,       title: 'Стань мастером',   desc: 'От новичка до мастера за недели' },
];

const TESTIMONIALS = [
  { name: 'Алишер',  text: 'За 2 недели выучил все буквы. Режим скорости затягивает!', level: 'Expert' },
  { name: 'Мадина',  text: 'Наконец-то могу читать арабский текст. Коран-режим — то что нужно.', level: 'Master' },
  { name: 'Рустам',  text: 'Установил как приложение — учу в метро каждый день без интернета.', level: 'Student' },
];

const LEVEL_ICONS: Record<string, typeof Star> = { Expert: Star, Master: Shield, Student: BookOpen };

const LETTERS = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

/* ── Animation variants (respects reduced motion) ─────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeUpReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/* ── Reusable components ──────────────────────────────────────────────────── */

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={prefersReduced ? fadeUpReduced : fadeUp}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-cinzel text-[0.6rem] tracking-[0.25em] uppercase
                     text-gold-dim border border-[rgba(201,168,76,0.2)] rounded-full px-4 py-1.5 mb-5">
      {children}
    </span>
  );
}

function SectionTitle({ badge, title, subtitle }: { badge: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <SectionBadge>{badge}</SectionBadge>
      <h2 className="font-cinzel text-2xl md:text-3xl tracking-wide text-[#f0e6cc] mb-3">{title}</h2>
      {subtitle && <p className="text-[#9a8a6a] font-raleway max-w-lg mx-auto text-sm md:text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */

export function LandingPage() {
  const { t } = useTranslation(['common', 'learn']);
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[rgba(13,10,7,0.88)]
                       border-b border-[rgba(201,168,76,0.08)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer group"
                aria-label="Arabic Alphabet — На главную">
            <span className="font-scheherazade text-2xl text-gold leading-none
                             group-hover:text-gold-light transition-colors duration-200">ا</span>
            <span className="font-cinzel text-[0.65rem] tracking-[0.2em] text-[#9a8a6a] uppercase
                             hidden sm:inline group-hover:text-[#b8a880] transition-colors duration-200">
              Arabic Alphabet
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login">
              <Button size="sm" variant="outline" className="min-h-[44px] min-w-[44px] cursor-pointer">
                Войти
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-14">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-[500px]
                          bg-[radial-gradient(ellipse,rgba(201,168,76,0.1)_0%,transparent_70%)]" />
        </div>

        <div className="relative text-center max-w-2xl mx-auto">
          {/* Arabic title */}
          <motion.p
            className="font-scheherazade text-7xl sm:text-8xl md:text-9xl text-gold mb-4 leading-none select-none"
            style={{ textShadow: '0 0 60px rgba(201,168,76,0.25)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.8 }}
          >
            الأبجدية العربية
          </motion.p>

          <motion.h1
            className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-[0.15em] text-[#f0e6cc] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.6, delay: 0.2 }}
          >
            {t('common:app_name')}
          </motion.h1>

          <motion.p
            className="text-[#b8a880] max-w-md mx-auto font-raleway text-base sm:text-lg leading-relaxed mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.35 }}
          >
            Выучи арабский алфавит с нуля — прямо на своём телефоне
          </motion.p>

          <motion.p
            className="text-[#9a8a6a] font-raleway text-sm mb-10 flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.45 }}
          >
            <span className="inline-flex items-center gap-1"><Gamepad2 size={14} /> 8 режимов</span>
            <span className="text-gold-dim">·</span>
            <span className="inline-flex items-center gap-1"><Trophy size={14} /> Соревнования</span>
            <span className="text-gold-dim">·</span>
            <span className="inline-flex items-center gap-1"><WifiOff size={14} /> Офлайн</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.55 }}
          >
            <Link to="/login">
              <Button size="lg" className="text-sm px-12 py-5 min-h-[52px] cursor-pointer
                                           shadow-[0_0_40px_rgba(201,168,76,0.15)]
                                           focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                                           focus-visible:ring-offset-[#0d0a07]">
                <span className="flex items-center gap-2">
                  Начать бесплатно <ArrowRight size={18} />
                </span>
              </Button>
            </Link>
            <a href="#features" className="cursor-pointer">
              <Button size="lg" variant="ghost"
                      className="min-h-[48px] cursor-pointer text-[#9a8a6a] hover:text-gold-light
                                 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                                 focus-visible:ring-offset-[#0d0a07]">
                Узнать больше
              </Button>
            </a>
          </motion.div>

          {/* SPIN Quiz CTA */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.7 }}
          >
            <Link to="/spin-quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                         border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)]
                         hover:border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.08)]
                         transition-all duration-200 group cursor-pointer">
              <span className="font-scheherazade text-lg text-gold group-hover:text-gold-light transition-colors">
                {''}
              </span>
              <span className="font-cinzel text-[0.6rem] tracking-[0.15em] text-[#9a8a6a] group-hover:text-[#b8a880] transition-colors">
                O'zingizni sinab ko'ring — 1 daqiqalik test
              </span>
              <ArrowRight size={14} className="text-gold-dim group-hover:text-gold transition-colors" />
            </Link>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          className="relative mt-16 grid grid-cols-4 gap-4 sm:gap-10 max-w-lg w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.7 }}
        >
          {[
            { value: '28', label: 'Букв' },
            { value: '8',  label: 'Режимов' },
            { value: '13', label: 'Достижений' },
            { value: '3',  label: 'Языка' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-cinzel text-2xl sm:text-3xl text-gold">{value}</p>
              <p className="font-cinzel text-[0.55rem] tracking-[0.15em] text-[#9a8a6a] uppercase mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        {!prefersReduced && (
          <motion.a
            href="#features"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer
                       min-w-[44px] min-h-[44px] flex items-center justify-center"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            aria-label="Прокрутить вниз"
          >
            <ChevronDown size={24} className="text-gold-dim" />
          </motion.a>
        )}
      </section>

      {/* ── Mobile App Section ── */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge={<><Smartphone size={12} /> Мобильное приложение</>}
              title="Учись в любом месте"
              subtitle="Установи на телефон — работает офлайн, моментально открывается, всегда под рукой"
            />
          </FadeIn>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {/* Phone mockup */}
            <FadeIn delay={0.1}>
              <div className="relative w-[260px] shrink-0" aria-hidden="true">
                {/* Phone frame */}
                <div className="rounded-[2.5rem] border-2 border-[rgba(201,168,76,0.12)]
                                bg-gradient-to-b from-[#1a1208] to-[#0d0a07]
                                p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(201,168,76,0.05)]">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#0d0a07] rounded-b-xl z-10" />
                  {/* Screen */}
                  <div className="rounded-[2rem] bg-[#0d0a07] overflow-hidden p-4 pt-8 min-h-[460px] flex flex-col items-center">
                    <p className="font-scheherazade text-3xl text-gold mb-1">الأبجدية</p>
                    <p className="font-cinzel text-[0.45rem] tracking-[0.2em] text-[#706040] uppercase mb-5">Dashboard</p>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-2 w-full mb-4">
                      {[
                        { icon: Zap, label: '7', color: '#ff8c42' },
                        { icon: BookOpen, label: '18', color: '#c9a84c' },
                        { icon: Trophy, label: '#3', color: '#8ab4ff' },
                      ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.08)]
                                                     rounded-xl py-2 flex items-center justify-center gap-1">
                          <Icon size={12} style={{ color }} />
                          <span className="text-[0.65rem] font-cinzel" style={{ color }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Mini mode grid */}
                    <div className="grid grid-cols-2 gap-2 w-full mb-4">
                      {MODES.slice(0, 4).map(({ icon: Icon, key, color }) => (
                        <div key={key} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.06)]
                                                   rounded-xl py-3 flex items-center justify-center">
                          <Icon size={20} style={{ color }} />
                        </div>
                      ))}
                    </div>

                    {/* XP bar */}
                    <div className="w-full bg-[rgba(201,168,76,0.08)] rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full"
                        initial={{ width: '0%' }}
                        whileInView={{ width: '65%' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: prefersReduced ? 0 : 1.2, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="font-cinzel text-[0.4rem] text-[#706040] tracking-wider mt-1.5">650 / 1000 XP</p>

                    {/* Mini letters */}
                    <div className="flex flex-wrap justify-center gap-1 mt-4">
                      {LETTERS.slice(0, 14).map((l, i) => (
                        <span key={i} className="w-6 h-6 rounded bg-[rgba(201,168,76,0.04)]
                                                  border border-[rgba(201,168,76,0.06)]
                                                  flex items-center justify-center
                                                  font-scheherazade text-[0.6rem] text-gold-dim">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Benefits */}
            <div className="flex flex-col gap-6 max-w-sm">
              {[
                { icon: Zap,     title: 'Мгновенный запуск',     desc: 'Открывается как родное приложение — без App Store' },
                { icon: WifiOff, title: 'Работает офлайн',       desc: 'Учись в метро, самолёте или где нет связи' },
                { icon: BarChart3, title: 'Прогресс сохраняется', desc: 'Синхронизация между всеми устройствами' },
                { icon: Globe,   title: '3 языка интерфейса',    desc: 'Русский, узбекский и английский' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <FadeIn key={title} delay={0.15 + i * 0.08}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.06)]
                                    border border-[rgba(201,168,76,0.12)]
                                    flex items-center justify-center">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-sm tracking-wide text-[#f0e6cc] mb-1">{title}</h3>
                      <p className="text-[#9a8a6a] text-sm font-raleway leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="relative py-20 md:py-28 px-4 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge={<><Sparkles size={12} /> Возможности</>}
              title="Всё для изучения арабского"
              subtitle="Комплексная платформа — от первой буквы до чтения Корана"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.06}>
                <div className="group relative bg-[rgba(255,255,255,0.015)] border border-[rgba(201,168,76,0.08)]
                                rounded-2xl p-6 cursor-default transition-colors duration-200
                                hover:border-[rgba(201,168,76,0.22)] hover:bg-[rgba(201,168,76,0.025)]">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.06)]
                                  border border-[rgba(201,168,76,0.12)]
                                  flex items-center justify-center mb-4
                                  group-hover:border-[rgba(201,168,76,0.25)] transition-colors duration-200">
                    <Icon size={20} className="text-gold group-hover:text-gold-light transition-colors duration-200" />
                  </div>
                  <h3 className="font-cinzel text-sm tracking-wide text-[#f0e6cc] mb-2">{title}</h3>
                  <p className="text-[#9a8a6a] text-sm font-raleway leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 Learning Modes ── */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge={<><Gamepad2 size={12} /> 8 Режимов</>}
              title="Учись так, как удобно тебе"
              subtitle="Флешкарточки, квизы, скоростные игры, тренировка на слух и другое"
            />
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {MODES.map(({ icon: Icon, key, color }, i) => (
              <FadeIn key={key} delay={i * 0.05}>
                <div className="group bg-[rgba(255,255,255,0.015)] border border-[rgba(201,168,76,0.08)]
                                rounded-2xl p-5 text-center cursor-default transition-all duration-200
                                hover:border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.03)]">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center
                                  transition-colors duration-200"
                       style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
                    <Icon size={24} style={{ color }} className="group-hover:scale-105 transition-transform duration-200" />
                  </div>
                  <p className="font-cinzel text-[0.6rem] tracking-[0.12em] text-[#9a8a6a] uppercase
                               group-hover:text-[#b8a880] transition-colors duration-200">
                    {t(`learn:modes.${key}`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge={<><ArrowRight size={12} /> Как начать</>}
              title="4 шага к арабскому"
            />
          </FadeIn>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-gold-dim/30 via-gold/20 to-transparent
                            hidden sm:block" aria-hidden="true" />

            <div className="flex flex-col gap-8">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <FadeIn key={title} delay={i * 0.1}>
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-10 h-10 rounded-full border border-gold-dim/40
                                    bg-[rgba(201,168,76,0.05)] flex items-center justify-center relative z-10">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-cinzel text-sm tracking-wide text-[#f0e6cc] mb-1">{title}</h3>
                      <p className="text-[#9a8a6a] text-sm font-raleway leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Arabic Letters ── */}
      <section className="relative py-20 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <SectionTitle
              badge={<><BookOpen size={12} /> 28 Букв</>}
              title="Весь арабский алфавит"
              subtitle="Каждую букву — с произношением, правильным написанием и примерами"
            />
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-wrap justify-center gap-2 md:gap-2.5 max-w-xl mx-auto">
              {LETTERS.map((letter, i) => (
                <div
                  key={i}
                  className="w-11 h-11 md:w-13 md:h-13 rounded-xl border border-[rgba(201,168,76,0.1)]
                             bg-[rgba(201,168,76,0.03)] flex items-center justify-center
                             font-scheherazade text-xl md:text-2xl text-gold-light/80
                             hover:border-gold/40 hover:bg-[rgba(201,168,76,0.07)]
                             hover:text-gold-light transition-colors duration-200 cursor-default select-none"
                >
                  {letter}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Social Proof / Testimonials ── */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <SectionTitle
              badge={<><Users size={12} /> Отзывы</>}
              title="Нас уже используют"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {TESTIMONIALS.map(({ name, text, level }, i) => {
              const LevelIcon = LEVEL_ICONS[level] ?? Star;
              return (
                <FadeIn key={name} delay={i * 0.08}>
                  <div className="bg-[rgba(255,255,255,0.015)] border border-[rgba(201,168,76,0.08)]
                                  rounded-2xl p-6 flex flex-col h-full">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} className="text-gold fill-gold" />
                      ))}
                    </div>
                    <p className="text-[#b8a880] font-raleway text-sm leading-relaxed mb-5 flex-1">
                      &laquo;{text}&raquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-[rgba(201,168,76,0.08)] pt-3">
                      <span className="font-cinzel text-xs tracking-wide text-[#f0e6cc]">{name}</span>
                      <span className="inline-flex items-center gap-1 text-[0.6rem] font-cinzel tracking-wider text-[#9a8a6a]">
                        <LevelIcon size={10} /> {level}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Install PWA CTA ── */}
      <section className="relative py-16 md:py-20 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl
                          border border-[rgba(201,168,76,0.12)]
                          bg-gradient-to-br from-[#1a1208] via-[#0d0a07] to-[#1a1208]
                          p-8 md:p-12 text-center">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04)_0%,transparent_70%)]"
                 aria-hidden="true" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)]
                              flex items-center justify-center mx-auto mb-5">
                <Download size={24} className="text-gold" />
              </div>
              <h2 className="font-cinzel text-xl md:text-2xl tracking-wide text-[#f0e6cc] mb-3">
                Установи на телефон
              </h2>
              <p className="text-[#9a8a6a] font-raleway text-sm max-w-md mx-auto mb-2 leading-relaxed">
                Открой сайт в браузере на телефоне, нажми «Поделиться», затем «На экран Домой»
              </p>
              <p className="text-[#5a5030] font-raleway text-xs mb-7">
                iOS и Android · Не занимает места · Обновляется автоматически
              </p>
              <Link to="/login">
                <Button size="lg" className="min-h-[52px] cursor-pointer
                                             focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                                             focus-visible:ring-offset-[#0d0a07]">
                  <span className="flex items-center gap-2">
                    Попробовать сейчас <ArrowRight size={18} />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-24 md:py-32 px-4 text-center">
        <FadeIn>
          <p className="font-scheherazade text-4xl sm:text-5xl text-gold mb-6 select-none"
             style={{ textShadow: '0 0 40px rgba(201,168,76,0.15)' }}>
            بسم الله الرحمن الرحيم
          </p>
          <h2 className="font-cinzel text-xl md:text-2xl tracking-wide text-[#f0e6cc] mb-4">
            Начни свой путь сегодня
          </h2>
          <p className="text-[#9a8a6a] font-raleway text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Присоединяйся — учи арабский алфавит бесплатно и без ограничений
          </p>
          <Link to="/login">
            <Button size="lg" className="text-sm px-14 py-5 min-h-[52px] cursor-pointer
                                         shadow-[0_0_50px_rgba(201,168,76,0.2)]
                                         focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                                         focus-visible:ring-offset-[#0d0a07]">
              <span className="flex items-center gap-2">
                Начать учиться <ArrowRight size={18} />
              </span>
            </Button>
          </Link>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(201,168,76,0.06)] py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-scheherazade text-xl text-gold">ا</span>
            <span className="font-cinzel text-[0.55rem] tracking-[0.15em] text-[#706040] uppercase">
              Arabic Alphabet · 2024–2026
            </span>
          </div>
          <p className="font-raleway text-[0.65rem] text-[#5a5030]">
            Бесплатная платформа для изучения арабского алфавита
          </p>
        </div>
      </footer>
    </div>
  );
}
