import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const FEATURES = [
  { key: 'features_unlimited', icon: '\u221E' },
  { key: 'features_model', icon: '\uD83E\uDDE0' },
  { key: 'features_detailed', icon: '\uD83D\uDCDD' },
  { key: 'features_no_ads', icon: '\uD83D\uDEAB' },
  { key: 'features_support', icon: '\u2B50' },
];

export function ProPage() {
  const { t } = useTranslation('common');
  const user = useAuthStore(s => s.user);
  const isPro = user?.plan === 'pro';

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-4xl block mb-3">{'\u26A1'}</span>
        <h1 className="font-cinzel text-2xl md:text-3xl tracking-widest text-[#e8c96d] uppercase">
          {t('pro.title', { defaultValue: 'Arab Alifbosi Pro' })}
        </h1>
        {isPro && (
          <div className="mt-3 inline-block px-4 py-1.5 rounded-full
                          bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                          font-bold text-sm">
            {t('pro.current_plan', { defaultValue: 'Current plan' })} {'\u2714'}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Monthly */}
        <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] rounded-2xl p-6
                        hover:border-[rgba(201,168,76,0.3)] transition-all">
          <h3 className="font-cinzel text-sm tracking-widest text-[#c9a84c] uppercase mb-2">
            {t('pro.monthly', { defaultValue: 'Monthly' })}
          </h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-[#f0e6cc]">30,000</span>
            <span className="text-[#9a8a6a] text-sm">UZS{t('pro.per_month', { defaultValue: '/mo' })}</span>
          </div>
          <p className="text-[#6a5a3a] text-xs mb-4">~ $3 USD</p>
          <button
            disabled
            className="w-full py-2.5 rounded-xl font-cinzel text-xs tracking-widest uppercase
                       bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)]
                       text-[#9a8a6a] cursor-not-allowed opacity-60"
          >
            {t('pro.coming_soon', { defaultValue: 'Coming soon' })}
          </button>
        </div>

        {/* Yearly */}
        <div className="bg-[rgba(201,168,76,0.08)] border-2 border-[rgba(201,168,76,0.3)] rounded-2xl p-6
                        relative overflow-hidden
                        hover:border-[rgba(201,168,76,0.5)] transition-all">
          {/* Save badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full
                          bg-[#c9a84c] text-[#1a1408] text-[0.6rem] font-bold uppercase">
            {t('pro.savings', { percent: 30, defaultValue: 'save 30%' })}
          </div>
          <h3 className="font-cinzel text-sm tracking-widest text-[#e8c96d] uppercase mb-2">
            {t('pro.yearly', { defaultValue: 'Yearly' })}
          </h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-[#f0e6cc]">250,000</span>
            <span className="text-[#9a8a6a] text-sm">UZS{t('pro.per_year', { defaultValue: '/yr' })}</span>
          </div>
          <p className="text-[#6a5a3a] text-xs mb-4">~ $25 USD</p>
          <button
            disabled
            className="w-full py-2.5 rounded-xl font-cinzel text-xs tracking-widest uppercase
                       bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)]
                       text-[#9a8a6a] cursor-not-allowed opacity-60"
          >
            {t('pro.coming_soon', { defaultValue: 'Coming soon' })}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] rounded-2xl p-6 mb-8">
        <div className="space-y-3">
          {FEATURES.map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.15)]
                              flex items-center justify-center text-sm flex-shrink-0">
                {f.icon}
              </span>
              <span className="text-[#c8b88a] text-sm">
                {t(`pro.${f.key}`, { defaultValue: f.key })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods (disabled) */}
      <div className="space-y-3 mb-8">
        <button
          disabled
          className="w-full py-3 rounded-xl font-bold text-sm
                     bg-[#00CCCC] text-white opacity-40 cursor-not-allowed"
        >
          Payme - {t('pro.coming_soon', { defaultValue: 'Coming soon' })}
        </button>
        <button
          disabled
          className="w-full py-3 rounded-xl font-bold text-sm
                     bg-[#23B34A] text-white opacity-40 cursor-not-allowed"
        >
          Click - {t('pro.coming_soon', { defaultValue: 'Coming soon' })}
        </button>
      </div>

      {/* Telegram contact */}
      <div className="text-center">
        <p className="text-[#9a8a6a] text-xs mb-2">
          {t('pro.contact_telegram', { defaultValue: 'Contact via Telegram' })}
        </p>
        <a
          href="https://t.me/arabalifbosi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-full font-cinzel text-xs tracking-widest uppercase
                     bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)]
                     text-[#c9a84c] hover:bg-[rgba(201,168,76,0.2)] transition-all"
        >
          Telegram {'\u2197'}
        </a>
      </div>

      {/* Back link */}
      <div className="text-center mt-8">
        <Link
          to="/learn"
          className="text-[#6a5a3a] text-xs hover:text-[#9a8a6a] transition-colors"
        >
          {'\u2190'} {t('nav.dashboard', { defaultValue: 'Dashboard' })}
        </Link>
      </div>
    </div>
  );
}
