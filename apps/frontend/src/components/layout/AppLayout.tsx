import { useState }        from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }    from '../../store/authStore';
import { useSectionsStore } from '../../store/sectionsStore';
import { LevelBadge, StreakBadge, LanguageSwitcher } from '../ui/Badges';
import { XpBar }           from '../ui/XpBar';
import { TeacherChat }     from '../ui/TeacherChat';

const NAV = [
  { to: '/dashboard',    icon: '🏠', key: 'dashboard' },
  { to: '/alphabet',     icon: '📖', key: 'alphabet' },
  { to: '/progress',     icon: '📈', key: 'progress' },
  { to: '/achievements', icon: '🏆', key: 'achievements' },
  { to: '/leaderboard',  icon: '🥇', key: 'leaderboard' },
  { to: '/textbook',     icon: '\uD83D\uDCD6', key: 'textbook' },
  { to: '/settings',     icon: '\u2699\uFE0F',  key: 'settings' },
];

export function AppLayout() {
  const { t }    = useTranslation('common');
  const { user, logout } = useAuthStore();
  const isEnabled = useSectionsStore(s => s.isEnabled);
  const navigate = useNavigate();
  const location = useLocation();

  const SECTION_NAV_MAP: Record<string, string> = {
    leaderboard: 'leaderboard',
    achievements: 'achievements',
    textbook: 'textbook',
  };

  const filteredNav = NAV.filter(({ key }) => {
    const sectionKey = SECTION_NAV_MAP[key];
    if (sectionKey && !isEnabled(sectionKey)) return false;
    return true;
  });

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0d0a07] border-r border-[rgba(201,168,76,0.1)] px-4 py-6 gap-3">
        {/* Logo */}
        <Link to="/dashboard" className="text-center mb-4 block cursor-pointer hover:opacity-80 transition-opacity">
          <p className="font-scheherazade text-3xl text-gold">الأبجدية</p>
          <p className="font-cinzel text-[0.6rem] tracking-[4px] text-[#9a8a6a] uppercase mt-1">
            {t('app_name')}
          </p>
        </Link>

        {/* User info */}
        {user && (
          <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)] rounded-2xl p-3 mb-2">
            <p className="font-cinzel text-sm text-[#f0e6cc] truncate">{user.name}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              <LevelBadge level={user.level} />
              <StreakBadge current={user.streak.current} />
            </div>
            <div className="mt-3">
              <XpBar xp={user.xp} level={user.xpLevel} />
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {filteredNav.map(({ to, icon, key }) => {
            const active = isActive(to);
            return (
              <NavLink
                key={to} to={to}
                className={
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all
                   ${active
                     ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)] border-l-[3px] border-l-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.08)]'
                     : 'text-[#9a8a6a] hover:text-gold hover:bg-[rgba(201,168,76,0.05)] border border-transparent'}`
                }
              >
                <span className="text-base">{icon}</span>
                {t(`nav.${key}`)}
              </NavLink>
            );
          })}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all
                 ${isActive('/admin')
                   ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)] border-l-[3px] border-l-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.08)]'
                   : 'text-[#9a8a6a] hover:text-gold hover:bg-[rgba(201,168,76,0.05)] border border-transparent'}`
              }
            >
              <span className="text-base">🛠</span>
              {t('nav.admin', { defaultValue: 'Админ' })}
            </NavLink>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                       hover:text-[#c95050] transition-colors text-left px-3"
          >
            {t('auth.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0a07] border-t border-[rgba(201,168,76,0.1)]
                      flex justify-around py-2 z-40"
           style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}>
        {filteredNav.filter(n => ['dashboard','alphabet','textbook','progress'].includes(n.key)).map(({ to, icon }) => {
          const active = isActive(to);
          return (
            <NavLink
              key={to} to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={
                `flex flex-col items-center p-2 min-w-[44px] min-h-[44px] justify-center rounded-xl transition-all
                 ${active
                   ? 'text-[#e8c96d] bg-[rgba(201,168,76,0.08)] shadow-[0_-2px_0_0_#c9a84c_inset]'
                   : 'text-[#9a8a6a]'}`
              }
            >
              <span className="text-xl">{icon}</span>
            </NavLink>
          );
        })}
        {/* Hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center p-2 min-w-[44px] min-h-[44px] justify-center rounded-xl transition-all
                     ${mobileMenuOpen ? 'text-[#e8c96d] bg-[rgba(201,168,76,0.08)]' : 'text-[#9a8a6a]'}`}
        >
          <span className="text-xl">{mobileMenuOpen ? '✕' : '≡'}</span>
        </button>
      </nav>

      {/* Mobile slide-up menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-[42]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-16 left-0 right-0 z-[45]
                         bg-[#0d0a07] border-t border-[rgba(201,168,76,0.15)]
                         rounded-t-3xl px-4 pt-6 pb-4 max-h-[70vh] overflow-y-auto"
              style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
            >
              {/* User info */}
              {user && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[rgba(201,168,76,0.1)]">
                  <div className="flex-1">
                    <p className="font-cinzel text-sm text-[#f0e6cc]">{user.name}</p>
                    <div className="flex gap-1 mt-1">
                      <LevelBadge level={user.level} />
                      <StreakBadge current={user.streak.current} />
                    </div>
                  </div>
                </div>
              )}

              {/* All nav links */}
              <div className="flex flex-col gap-1 mb-4">
                {filteredNav.map(({ to, icon, key }) => {
                  const active = isActive(to);
                  return (
                    <NavLink
                      key={to} to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all
                        ${active
                          ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
                          : 'text-[#9a8a6a] hover:text-gold hover:bg-[rgba(201,168,76,0.05)] border border-transparent'}`}
                    >
                      <span className="text-base">{icon}</span>
                      {t(`nav.${key}`)}
                    </NavLink>
                  );
                })}
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all
                      ${isActive('/admin')
                        ? 'bg-[rgba(201,168,76,0.12)] text-[#e8c96d] border border-[rgba(201,168,76,0.25)]'
                        : 'text-[#9a8a6a] hover:text-gold hover:bg-[rgba(201,168,76,0.05)] border border-transparent'}`}
                  >
                    <span className="text-base">🛠</span>
                    {t('nav.admin', { defaultValue: 'Admin' })}
                  </NavLink>
                )}
              </div>

              {/* Language switcher */}
              <div className="pt-3 border-t border-[rgba(201,168,76,0.1)] mb-3">
                <LanguageSwitcher />
              </div>

              {/* Logout */}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left font-cinzel text-[0.6rem] tracking-widest uppercase text-[#9a8a6a]
                           hover:text-[#c95050] transition-colors px-4 py-2"
              >
                {t('auth.logout')}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Teacher Chat */}
      <TeacherChat />
    </div>
  );
}
