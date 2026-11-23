import { useEffect, useState } from 'react';
import { Mic, PenTool, Scale, Sparkles, Zap } from 'lucide-react';
import { ChapterData } from '../types';
import { initChineseVoices, stopChineseSpeech } from '../utils/speech';
import { LockedAccessModal } from './LockedAccessModal';
import { ConfusablesTrapsLab } from './labs/ConfusablesTrapsLab';
import { HanziWritingLab } from './labs/HanziWritingLab';
import { RadicalsExplorerLab } from './labs/RadicalsExplorerLab';
import { SpeedMatchLab } from './labs/SpeedMatchLab';
import { VoicePronunciationLab } from './labs/VoicePronunciationLab';

export type SkillLabTab = 'writing' | 'radicals' | 'speaking' | 'speed' | 'confusables';

interface SkillsLabsViewProps {
  initialTab?: SkillLabTab;
  initialChapterId?: number;
  launchNonce?: number;
}

interface PracticeWordTarget {
  chapterId: number;
  wordId: string;
  char: string;
}

export function SkillsLabsView({
  initialTab = 'writing',
  initialChapterId,
  launchNonce = 0,
}: SkillsLabsViewProps) {
  const [activeTab, setActiveTab] = useState<SkillLabTab>(initialTab);
  const [chapterIdContext, setChapterIdContext] = useState<number | undefined>(
    initialChapterId
  );
  const [practiceTarget, setPracticeTarget] = useState<PracticeWordTarget | null>(
    null
  );
  const [lockedChapter, setLockedChapter] = useState<ChapterData | null>(null);

  useEffect(() => {
    initChineseVoices();
    return () => {
      stopChineseSpeech();
    };
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
    if (initialChapterId !== undefined) {
      setChapterIdContext(initialChapterId);
      setPracticeTarget(null);
    }
  }, [initialTab, initialChapterId, launchNonce]);

  const handleSelectTab = (tab: SkillLabTab) => {
    stopChineseSpeech();
    setActiveTab(tab);
  };

  const handlePracticeWordFromRadical = (
    chapterId: number,
    wordId: string,
    matchedChar: string
  ) => {
    stopChineseSpeech();
    setChapterIdContext(chapterId);
    setPracticeTarget({ chapterId, wordId, char: matchedChar });
    setActiveTab('writing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs: {
    id: SkillLabTab;
    label: string;
    subtitle: string;
    icon: typeof PenTool;
  }[] = [
    {
      id: 'writing',
      label: 'مختبر الكتابة (Hanzi Lab)',
      subtitle: 'ترتيب الخطوط والتتبع التفاعلي على شبكة 米字格',
      icon: PenTool,
    },
    {
      id: 'radicals',
      label: 'مستكشف الجذور (Radicals)',
      subtitle: 'أهم ٢٠ جذراً صينياً وكلماتها من المنهج',
      icon: Sparkles,
    },
    {
      id: 'speaking',
      label: 'مدرّب النطق الصوتي (Speaking)',
      subtitle: 'تدريب النطق بالمايكروفون وتصحيح فوري للرموز',
      icon: Mic,
    },
    {
      id: 'speed',
      label: 'تحدي السرعة ⚡',
      subtitle: 'مطابقة الكلمات الصينية خلال 60 ثانية مع مضاعف السلسلة',
      icon: Zap,
    },
    {
      id: 'confusables',
      label: 'المتشابهات وفخاخ الامتحان',
      subtitle: 'مقارنة الرموز المتشابهة وفخاخ القواعد + اختبار سريع',
      icon: Scale,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* الترويسة الرئيسية للمختبرات التفاعلية */}
      <div className="no-print neo-frame rounded-xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
              <span
                aria-hidden="true"
                className="cinnabar-seal font-hanzi w-6 h-6 flex items-center justify-center text-xs rounded-[3px]"
              >
                练
              </span>
              <span>المختبرات التفاعلية لمهارات اللغة الصينية · HSK 3.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F2EB]">
              المختبرات التفاعلية (الكتابة · الجذور · النطق · السرعة · المتشابهات)
            </h1>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] max-w-2xl">
              أتقن كتابة الرموز الصينية بخطوات صحيحة، افهم الجذور الأساسية، اختبر نطقك بالمايكروفون،
              نافس نفسك في تحدي السرعة، وتفادَ أشهر المتشابهات وفخاخ الامتحان.
            </p>
          </div>
        </div>

        {/* شريط التبويبات الخمسة */}
        <div
          role="tablist"
          aria-label="المختبرات التفاعلية"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTab(tab.id)}
                className={`text-right rounded-lg p-4 border transition-all duration-150 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] ${
                  isActive
                    ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/14 shadow-xs'
                    : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/40 dark:hover:border-[#EF4444]/40'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'bg-[#F9F6F0] dark:bg-[#292623] text-[#57534E] dark:text-[#A8A29E]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0 space-y-0.5">
                  <span
                    className={`block text-sm font-bold ${
                      isActive
                        ? 'text-[#B91C1C] dark:text-[#EF4444]'
                        : 'text-[#1C1917] dark:text-[#F5F2EB]'
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span className="block text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                    {tab.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* محتوى المختبر المختار */}
      <div>
        {activeTab === 'writing' && (
          <HanziWritingLab
            initialChapterId={practiceTarget?.chapterId ?? chapterIdContext}
            initialWordId={practiceTarget?.wordId}
            initialChar={practiceTarget?.char}
            onSelectLockedChapter={setLockedChapter}
          />
        )}

        {activeTab === 'radicals' && (
          <RadicalsExplorerLab onPracticeWord={handlePracticeWordFromRadical} />
        )}

        {activeTab === 'speaking' && (
          <VoicePronunciationLab
            initialChapterId={chapterIdContext}
            onSelectLockedChapter={setLockedChapter}
          />
        )}

        {activeTab === 'speed' && (
          <SpeedMatchLab
            initialChapterId={chapterIdContext}
            onSelectLockedChapter={setLockedChapter}
          />
        )}

        {activeTab === 'confusables' && <ConfusablesTrapsLab />}
      </div>

      <LockedAccessModal
        isOpen={lockedChapter !== null}
        itemTitle={
          lockedChapter
            ? `第${lockedChapter.id}课 — ${lockedChapter.titleAr}`
            : ''
        }
        itemType="chapter"
        onClose={() => setLockedChapter(null)}
      />
    </section>
  );
}
