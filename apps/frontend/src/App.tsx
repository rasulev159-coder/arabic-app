import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore }       from './store/authStore';
import { useSectionsStore }   from './store/sectionsStore';
import { AchievementToast }   from './components/ui/AchievementToast';
import { FeedbackButton }    from './components/ui/FeedbackButton';
import { AppLayout }          from './components/layout/AppLayout';

// Pages
import { LandingPage }      from './pages/Landing';
import { LoginPage }        from './pages/Login';
import { DashboardPage }    from './pages/Dashboard';
import { AlphabetPage, ProgressPage, AchievementsPage,
         LeaderboardPage, SettingsPage, ChallengePage } from './pages/AllPages';

import { AdminPage }        from './pages/Admin';
import { ProPage }          from './pages/ProPage';
import { InvitePage }       from './pages/Invite';
import { SpinQuizPage }    from './pages/SpinQuiz';

// Learn modes
import { FlashcardsPage }  from './pages/learn/Flashcards';
import { QuizPage }        from './pages/learn/Quiz';
import { SpeedPage }       from './pages/learn/Speed';
import { WritePage }       from './pages/learn/Write';
import { LightningPage, MemoryPage, ListenPage, FindPage } from './pages/learn/Modes';
import { WeaknessTrainingPage } from './pages/learn/WeaknessTraining';
import { SessionFlowPage }      from './pages/learn/SessionFlow';
import { QuranModePage }         from './pages/learn/QuranMode';
import { ConnectionsPage }      from './pages/learn/Connections';
import { FormsPage }             from './pages/learn/Forms';
import { TextbookPage }          from './pages/Textbook';
import { TextbookChapterPage }   from './pages/TextbookChapter';
import { TextbookQuizPage }      from './pages/TextbookQuiz';
import { TextbookRoadmapPath }   from './pages/TextbookRoadmapPath';
import { TextbookRoadmapIsland } from './pages/TextbookRoadmapIsland';
import { QuranWordsPage }        from './pages/learn/QuranWords';
import { QuranWordsLessonPage }  from './pages/learn/QuranWordsLesson';
import { QuranWordsQuizPage }    from './pages/learn/QuranWordsQuiz';

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

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <p className="font-scheherazade text-6xl text-gold">٤٠٤</p>
      <h1 className="font-cinzel text-xl tracking-widest text-[#f0e6cc]">Page not found</h1>
      <p className="text-[#9a8a6a] text-sm text-center">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard"
        className="font-cinzel text-xs tracking-widest uppercase px-8 py-3 rounded-full border
                   border-gold-dim text-gold-light bg-[rgba(201,168,76,0.08)]
                   hover:bg-[rgba(201,168,76,0.15)] transition-all">
        ← Go to Dashboard
      </Link>
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
  const fetchSections = useSectionsStore(s => s.fetchSections);
  const [hydrating, setHydrating]      = useState(!!accessToken && !user);

  useEffect(() => { fetchSections(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (accessToken && !user) {
      fetchMe()
        .catch(() => {
          // Token is invalid/expired — clear stored auth so user sees login page
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('auth');
          useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });
        })
        .finally(() => setHydrating(false));
    } else {
      setHydrating(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (hydrating) return <SplashScreen />;

  return (
    <>
      <AchievementToast />
      <FeedbackButton />
      <Routes>
        {/* Public */}
        <Route path="/"      element={<SpinQuizPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/spin-quiz" element={<SpinQuizPage />} />
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
          <Route path="/learn/weakness"    element={<WeaknessTrainingPage />} />
          <Route path="/learn/session"     element={<SessionFlowPage />} />
          <Route path="/learn/quran"       element={<QuranModePage />} />
          <Route path="/learn/connections" element={<ConnectionsPage />} />
          <Route path="/learn/forms"       element={<FormsPage />} />
          <Route path="/learn/quran-words"            element={<QuranWordsPage />} />
          <Route path="/learn/quran-words/:lessonId"   element={<QuranWordsLessonPage />} />
          <Route path="/learn/quran-words/:lessonId/quiz" element={<QuranWordsQuizPage />} />
          <Route path="/textbook"                  element={<TextbookPage />} />
          <Route path="/textbook/roadmap-path"     element={<TextbookRoadmapPath />} />
          <Route path="/textbook/roadmap-island"   element={<TextbookRoadmapIsland />} />
          <Route path="/textbook/:chapterId"       element={<TextbookChapterPage />} />
          <Route path="/textbook/:chapterId/quiz"  element={<TextbookQuizPage />} />
          <Route path="/pro"               element={<ProPage />} />
          <Route path="/admin"             element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
