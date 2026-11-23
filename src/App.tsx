import { useState } from 'react';
import { AnalyticsView } from './components/AnalyticsView';
import { ChapterHubView } from './components/ChapterHubView';
import { ChaptersGridView } from './components/ChaptersGridView';
import { CollectionsView } from './components/CollectionsView';
import { CustomQuizBuilderView } from './components/CustomQuizBuilderView';
import { DrillSessionRunner, DrillSessionSource } from './components/drills/DrillSessionRunner';
import { HomeView } from './components/HomeView';
import { HskPortalView } from './components/HskPortalView';
import { LoginGate } from './components/LoginGate';
import { MockExamView } from './components/MockExamView';
import { Navbar } from './components/Navbar';
import { SkillLabTab, SkillsLabsView } from './components/SkillsLabsView';
import { TeacherBroadcastBanner } from './components/TeacherBroadcastBanner';
import { VaultView } from './components/VaultView';
import { AppProvider, useApp } from './context/AppContext';
import { AppView, ChapterData, CustomQuizConfig, QuizMode, SessionDrillKey } from './types';
import { isChapterUnlocked } from './utils/accessControl';

function MainShell() {
  const { currentStudent, unlockedAccess } = useApp();
  const [view, setView] = useState<AppView>('home');
  const [activeChapter, setActiveChapter] = useState<ChapterData | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>('practice');
  const [sessionSource, setSessionSource] = useState<DrillSessionSource | null>(null);
  const [sessionReturnView, setSessionReturnView] = useState<AppView>('home');
  const [labConfig, setLabConfig] = useState<{
    tab: SkillLabTab;
    chapterId?: number;
    nonce: number;
  }>({ tab: 'writing', nonce: 0 });

  if (!currentStudent) {
    return <LoginGate />;
  }

  const handleNavigate = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLab = (tab: SkillLabTab, chapterId?: number) => {
    setLabConfig((prev) => ({
      tab,
      chapterId,
      nonce: prev.nonce + 1,
    }));
    setView('labs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (chapter: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, chapter.id)) return;
    setActiveChapter(chapter);
    setView('chapter-hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapterDrill = (drillKey: SessionDrillKey) => {
    if (!activeChapter) return;
    setSessionSource({
      kind: 'chapter',
      chapter: activeChapter,
      drillKey,
      mode: quizMode,
    });
    setSessionReturnView('chapter-hub');
    setView('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCustomQuiz = (config: CustomQuizConfig) => {
    setSessionSource({
      kind: 'custom',
      config,
    });
    setSessionReturnView('custom-builder');
    setView('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMistakeReview = () => {
    setSessionSource({ kind: 'mistakes' });
    setSessionReturnView(view === 'analytics' ? 'analytics' : 'home');
    setView('drill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen paper-lattice bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] flex flex-col">
      <Navbar currentView={view} onNavigate={handleNavigate} />
      <TeacherBroadcastBanner />

      <main className="flex-1">
        {view === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onStartMistakeReview={handleStartMistakeReview}
          />
        )}

        {view === 'chapters' && <ChaptersGridView onSelectChapter={handleSelectChapter} />}

        {view === 'chapter-hub' && activeChapter && (
          <ChapterHubView
            chapter={activeChapter}
            selectedMode={quizMode}
            onModeChange={setQuizMode}
            onStartDrill={handleStartChapterDrill}
            onOpenLab={handleOpenLab}
            onBack={() => handleNavigate('chapters')}
          />
        )}

        {view === 'custom-builder' && (
          <CustomQuizBuilderView
            onStartCustomQuiz={handleStartCustomQuiz}
            onBack={() => handleNavigate('home')}
          />
        )}

        {view === 'collections' && <CollectionsView />}

        {view === 'labs' && (
          <SkillsLabsView
            initialTab={labConfig.tab}
            initialChapterId={labConfig.chapterId}
            launchNonce={labConfig.nonce}
          />
        )}

        {view === 'vault' && <VaultView onNavigate={handleNavigate} />}

        {view === 'hsk-portal' && <HskPortalView />}

        {view === 'mock-exam' && <MockExamView onBack={() => handleNavigate('hsk-portal')} />}

        {view === 'drill' && sessionSource && (
          <DrillSessionRunner
            source={sessionSource}
            onExit={() => handleNavigate(sessionReturnView)}
          />
        )}

        {view === 'analytics' && (
          <AnalyticsView
            onStartMistakeReview={handleStartMistakeReview}
            onOpenMockExam={() => handleNavigate('hsk-portal')}
          />
        )}
      </main>

      <footer className="border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
          <span>بوابة اللغة الصينية - المستوى الأول</span>
          <span>منصة تدريب تفاعلية · ١٥ فصلاً · ١٠ أنماط تدريبية</span>
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
