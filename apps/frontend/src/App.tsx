import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore }       from './store/authStore';
import { AchievementToast }   from './components/ui/AchievementToast';
import { AppLayout }          from './components/layout/AppLayout';

// Pages
import { LandingPage }      from './pages/Landing';
import { LoginPage }        from './pages/Login';
import { DashboardPage }    from './pages/Dashboard';
import { AlphabetPage, ProgressPage, AchievementsPage,
         LeaderboardPage, SettingsPage, ChallengePage } from './pages/AllPages';

// Learn modes
import { FlashcardsPage }  from './pages/learn/Flashcards';
import { QuizPage }        from './pages/learn/Quiz';
import { SpeedPage }       from './pages/learn/Speed';
import { WritePage }       from './pages/learn/Write';
import { LightningPage, MemoryPage, ListenPage, FindPage } from './pages/learn/Modes';

function SplashScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <p className="font-scheherazade text-6xl text-gold animate-pulse"
         style={{ fontFamily: "'Scheherazade New', serif" }}>
        الأبجدية
      </p>
      <div className="flex gap-1.5 mt-2">
        {[0,1,2].map(i => (
          <div key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold-dim animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loc  = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, fetchMe, accessToken } = useAuthStore();
  const [hydrating, setHydrating]      = useState(!!accessToken && !user);

  useEffect(() => {
    if (accessToken && !user) {
      fetchMe()
        .catch(() => {})
        .finally(() => setHydrating(false));
    } else {
      setHydrating(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (hydrating) return <SplashScreen />;

  return (
    <>
      <AchievementToast />
      <Routes>
        {/* Public */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/challenge/:token" element={<ChallengePage />} />

        {/* Protected */}
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/dashboard"          element={<DashboardPage />} />
          <Route path="/alphabet"           element={<AlphabetPage />} />
          <Route path="/progress"           element={<ProgressPage />} />
          <Route path="/achievements"       element={<AchievementsPage />} />
          <Route path="/leaderboard"        element={<LeaderboardPage />} />
          <Route path="/settings"           element={<SettingsPage />} />
          <Route path="/learn/flashcards"   element={<FlashcardsPage />} />
          <Route path="/learn/quiz"         element={<QuizPage />} />
          <Route path="/learn/speed"        element={<SpeedPage />} />
          <Route path="/learn/lightning"    element={<LightningPage />} />
          <Route path="/learn/memory"       element={<MemoryPage />} />
          <Route path="/learn/listen"       element={<ListenPage />} />
          <Route path="/learn/find"         element={<FindPage />} />
          <Route path="/learn/write"        element={<WritePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
