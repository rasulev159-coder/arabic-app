import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { MapPin, Gamepad2, Trophy, MessageCircle, User, Wrench } from 'lucide-react';
import { useAuthStore }    from '../../store/authStore';
import { LevelBadge, StreakBadge, LanguageSwitcher } from '../ui/Badges';
import { XpBar }           from '../ui/XpBar';
import { TeacherChat }     from '../ui/TeacherChat';
import type { LucideIcon } from 'lucide-react';

const NAV: { to: string; icon: LucideIcon; key: string }[] = [
  { to: '/learn',      icon: MapPin,        key: 'learn' },
  { to: '/practice',   icon: Gamepad2,      key: 'practice' },
  { to: '/community',  icon: Trophy,        key: 'community' },
  { to: '/chat',       icon: MessageCircle, key: 'chat' },
  { to: '/profile',    icon: User,          key: 'profile' },
];

export function AppLayout() {
  const { t }    = useTranslation('common');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredNav = NAV;
  const isChatPage = location.pathname === '/chat';

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0d0a07] border-r border-[rgba(201,168,76,0.1)] px-4 py-6 gap-3">
        {/* Logo */}
        <Link to="/learn" className="text-center mb-4 block cursor-pointer hover:opacity-80 transition-opacity">
          <p className="font-scheherazade text-3xl text-gold">الأبجدية</p>
          <p className="font-cinzel text-[0.6rem] tracking-[4px] text-[#9a8a6a] uppercase mt-1">
            {t('app_name')}
          </p>
        </Link>

        {/* User info */}
        {user && (
          <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)] rounded-2xl p-3 mb-2">
            <div className="flex items-center gap-1.5">
              <p className="font-cinzel text-sm text-[#f0e6cc] truncate">{user.name}</p>
              {user.plan === 'pro' && (
                <span className="px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase
                                 bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                                 leading-none tracking-wider">
                  {t('pro.badge', { defaultValue: 'PRO' })}
                </span>
              )}
            </div>
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
          {filteredNav.map(({ to, icon: Icon, key }) => {
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
                <Icon size={18} />
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
              <Wrench size={18} />
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

      {/* Mobile bottom nav — hidden on chat page */}
      {!isChatPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0a07] border-t border-[rgba(201,168,76,0.1)]
                        flex justify-around py-2 z-40"
             style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}>
          {filteredNav.map(({ to, icon: Icon, key }) => {
            const active = isActive(to);
            return (
              <NavLink
                key={to} to={to}
                className={
                  `flex flex-col items-center gap-0.5 p-1.5 min-w-[44px] min-h-[44px] justify-center rounded-xl transition-all
                   ${active
                     ? 'text-[#e8c96d] bg-[rgba(201,168,76,0.08)] shadow-[0_-2px_0_0_#c9a84c_inset]'
                     : 'text-[#9a8a6a]'}`
                }
              >
                <Icon size={20} />
                <span className="text-[0.55rem] font-cinzel tracking-wider">{t(`nav.${key}`)}</span>
              </NavLink>
            );
          })}
        </nav>
      )}

      {/* AI Teacher Chat widget — hidden on full-page chat */}
      {!isChatPage && <TeacherChat />}
    </div>
  );
}
