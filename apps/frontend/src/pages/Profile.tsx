import { useState }        from 'react';
import { useTranslation }  from 'react-i18next';
import { useSearchParams }  from 'react-router-dom';
import { motion }          from 'framer-motion';
import { BarChart3, Settings, Gem } from 'lucide-react';
import { useAuthStore }    from '../store/authStore';
import { LevelBadge, StreakBadge } from '../components/ui/Badges';
import { XpBar }           from '../components/ui/XpBar';
import { ProgressPage, SettingsPage } from './AllPages';

type Tab = 'stats' | 'settings' | 'subscription';

export function ProfilePage() {
  const { t }  = useTranslation('common');
  const user   = useAuthStore((s) => s.user);
  const [params, setParams] = useSearchParams();
  const initialTab = (params.get('tab') as Tab) || 'stats';
  const [tab, setTab] = useState<Tab>(initialTab);

  const switchTab = (next: Tab) => {
    setTab(next);
    setParams(next === 'stats' ? {} : { tab: next }, { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Profile header */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a88a3a]
                            flex items-center justify-center text-[#0d0a07] font-cinzel text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-lg text-[#f0e6cc] tracking-wide">{user.name}</h1>
                {user.plan === 'pro' && (
                  <span className="px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase
                                   bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                                   leading-none tracking-wider">
                    {t('pro.badge', { defaultValue: 'PRO' })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <LevelBadge level={user.level} />
                <StreakBadge current={user.streak.current} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <XpBar xp={user.xp} level={user.xpLevel} />
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cinzel text-[0.65rem] tracking-widest uppercase transition-all
            ${tab === 'stats'
              ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
              : 'text-[#9a8a6a] border border-transparent hover:bg-[rgba(201,168,76,0.05)]'}`}
        >
          <BarChart3 size={16} />
          {t('profile.stats', { defaultValue: t('progress_page.title') })}
        </button>
        <button
          onClick={() => switchTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cinzel text-[0.65rem] tracking-widest uppercase transition-all
            ${tab === 'settings'
              ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
              : 'text-[#9a8a6a] border border-transparent hover:bg-[rgba(201,168,76,0.05)]'}`}
        >
          <Settings size={16} />
          {t('nav.settings')}
        </button>
        <button
          onClick={() => switchTab('subscription')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cinzel text-[0.65rem] tracking-widest uppercase transition-all
            ${tab === 'subscription'
              ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
              : 'text-[#9a8a6a] border border-transparent hover:bg-[rgba(201,168,76,0.05)]'}`}
        >
          <Gem size={16} />
          {t('pro.badge', { defaultValue: 'Pro' })}
        </button>
      </div>

      {/* Content */}
      {tab === 'stats' && (
        <div className="-mx-4 -mt-2">
          <ProgressPage />
        </div>
      )}
      {tab === 'settings' && (
        <div className="-mx-4 -mt-2">
          <SettingsPage />
        </div>
      )}
      {tab === 'subscription' && (
        <SubscriptionTab />
      )}
    </div>
  );
}

function SubscriptionTab() {
  const { t } = useTranslation('common');
  const user = useAuthStore((s) => s.user);
  const isPro = user?.plan === 'pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <Gem size={48} className={isPro ? 'text-[#e8c96d] mx-auto' : 'text-[#555] mx-auto'} />
      <h2 className="font-cinzel text-lg text-[#f0e6cc] mt-4">
        {t('pro.title')}
      </h2>
      <p className="text-sm text-[#9a8a6a] mt-2 mb-6">
        {t('pro.current_plan')}: <span className={isPro ? 'text-[#e8c96d]' : 'text-[#9a8a6a]'}>
          {isPro ? 'PRO' : 'Free'}
        </span>
      </p>
      {!isPro && (
        <a
          href="/pro"
          className="inline-block font-cinzel text-xs tracking-widest uppercase px-8 py-3 rounded-full
                     bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                     hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all"
        >
          {t('pro.upgrade')}
        </a>
      )}
    </motion.div>
  );
}
