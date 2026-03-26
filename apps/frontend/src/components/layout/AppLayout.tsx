import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../../store/authStore';
import { LevelBadge, StreakBadge, LanguageSwitcher } from '../ui/Badges';

const NAV = [
  { to: '/dashboard',    icon: '🏠', key: 'dashboard' },
  { to: '/alphabet',     icon: '📖', key: 'alphabet' },
  { to: '/progress',     icon: '📈', key: 'progress' },
  { to: '/achievements', icon: '🏆', key: 'achievements' },
  { to: '/leaderboard',  icon: '🥇', key: 'leaderboard' },
  { to: '/settings',     icon: '⚙️',  key: 'settings' },
];

export function AppLayout() {
  const { t }    = useTranslation('common');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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
          </div>
        )}

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ to, icon, key }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all
                 ${isActive
                   ? 'bg-[rgba(201,168,76,0.1)] text-gold border border-[rgba(201,168,76,0.2)]'
                   : 'text-[#9a8a6a] hover:text-gold hover:bg-[rgba(201,168,76,0.05)]'}`
              }
            >
              <span className="text-base">{icon}</span>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all
                 ${isActive
                   ? 'bg-[rgba(201,168,76,0.1)] text-gold border border-[rgba(201,168,76,0.2)]'
                   : 'text-[#9a8a6a] hover:text-gold hover:bg-[rgba(201,168,76,0.05)]'}`
              }
            >
              <span className="text-base">🛠</span>
              Админ
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
                      flex justify-around py-2 z-40">
        {NAV.slice(0, 5).map(({ to, icon }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all
               ${isActive ? 'text-gold' : 'text-[#9a8a6a]'}`
            }
          >
            <span className="text-xl">{icon}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
