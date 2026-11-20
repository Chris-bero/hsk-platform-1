import { useState } from 'react';
import { AnalyticsView } from './components/AnalyticsView';
import { ChapterHubView } from './components/ChapterHubView';
import { ChaptersGridView } from './components/ChaptersGridView';
import { DrillSessionRunner } from './components/drills/DrillSessionRunner';
import { HomeView } from './components/HomeView';
import { LoginGate } from './components/LoginGate';
import { Navbar } from './components/Navbar';
import { AppProvider, useApp } from './context/AppContext';
import { AppView, ChapterData, QuizMode, SessionDrillKey } from './types';

function MainShell() {
  const { currentStudent } = useApp();
  const [view, setView] = useState<AppView>('home');
  const [activeChapter, setActiveChapter] = useState<ChapterData | null>(null);
  const [activeDrillKey, setActiveDrillKey] = useState<SessionDrillKey>('hanzi-to-arabic');
  const [quizMode, setQuizMode] = useState<QuizMode>('practice');

  if (!currentStudent) {
    return <LoginGate />;
  }

  const handleNavigate = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (chapter: ChapterData) => {
    setActiveChapter(chapter);
    setView('chapter-hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDrill = (drillKey: SessionDrillKey) => {
    setActiveDrillKey(drillKey);
    setView('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen paper-lattice bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] flex flex-col">
      <Navbar currentView={view} onNavigate={handleNavigate} />

      <main className="flex-1">
        {view === 'home' && <HomeView onNavigate={handleNavigate} />}

        {view === 'chapters' && <ChaptersGridView onSelectChapter={handleSelectChapter} />}

        {view === 'chapter-hub' && activeChapter && (
          <ChapterHubView
            chapter={activeChapter}
            selectedMode={quizMode}
            onModeChange={setQuizMode}
            onStartDrill={handleStartDrill}
            onBack={() => handleNavigate('chapters')}
          />
        )}

        {view === 'drill' && activeChapter && (
          <DrillSessionRunner
            chapter={activeChapter}
            drillKey={activeDrillKey}
            mode={quizMode}
            onExit={() => handleNavigate('chapter-hub')}
          />
        )}

        {view === 'analytics' && <AnalyticsView />}
      </main>

      <footer className="border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
          <span>بوابة اللغة الصينية - المستوى الأول</span>
          <span>منصة تدريب تفاعلية · ١٥ فصلاً · ٩ أنماط تدريبية</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
