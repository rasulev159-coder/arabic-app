import { useState }        from 'react';
import { useTranslation }  from 'react-i18next';
import { useSearchParams }  from 'react-router-dom';
import { motion }          from 'framer-motion';
import { Trophy, Medal }   from 'lucide-react';
import { AchievementsPage, LeaderboardPage } from './AllPages';

type Tab = 'achievements' | 'leaderboard';

export function CommunityPage() {
  const { t }  = useTranslation('common');
  const [params, setParams] = useSearchParams();
  const initialTab = (params.get('tab') as Tab) || 'achievements';
  const [tab, setTab] = useState<Tab>(initialTab);

  const switchTab = (next: Tab) => {
    setTab(next);
    setParams(next === 'achievements' ? {} : { tab: next }, { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-cinzel text-lg text-[#f0e6cc] tracking-wide">
          {t('nav.community')}
        </h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchTab('achievements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cinzel text-[0.65rem] tracking-widest uppercase transition-all
            ${tab === 'achievements'
              ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
              : 'text-[#9a8a6a] border border-transparent hover:bg-[rgba(201,168,76,0.05)]'}`}
        >
          <Trophy size={16} />
          {t('achievements_page.title')}
        </button>
        <button
          onClick={() => switchTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-cinzel text-[0.65rem] tracking-widest uppercase transition-all
            ${tab === 'leaderboard'
              ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
              : 'text-[#9a8a6a] border border-transparent hover:bg-[rgba(201,168,76,0.05)]'}`}
        >
          <Medal size={16} />
          {t('leaderboard_page.title')}
        </button>
      </div>

      {/* Content — render existing page components inline (they already have their own containers) */}
      {tab === 'achievements' ? <AchievementsContent /> : <LeaderboardContent />}
    </div>
  );
}

/* We re-render the existing pages but strip their outer wrappers.
   Since the existing pages include their own padding/headers,
   we wrap them with a div that neutralizes the outer padding. */

function AchievementsContent() {
  return (
    <div className="-mx-4 -mt-2">
      <AchievementsPage />
    </div>
  );
}

function LeaderboardContent() {
  return (
    <div className="-mx-4 -mt-2">
      <LeaderboardPage />
    </div>
  );
}
