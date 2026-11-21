import { useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck2,
  Globe2,
  Headphones,
  Lock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  ARABIC_MOCK_EXAMS,
  FixedMockExamPaper,
  HSK_PATTERN_MODULES,
  HskPatternModule,
  INTERNATIONAL_MOCK_EXAMS,
} from '../data/mockExamsData';
import { HskPatternId } from '../types';
import { HskFixedMockExamRunner } from './HskFixedMockExamRunner';
import { HskPatternPracticeRunner } from './HskPatternPracticeRunner';

function getToneClasses(tone: 'jade' | 'gold' | 'cinnabar'): string {
  if (tone === 'jade') return 'text-[#15803D] dark:text-[#22C55E]';
  if (tone === 'gold') return 'text-[#B45309] dark:text-[#F59E0B]';
  return 'text-[#B91C1C] dark:text-[#EF4444]';
}

function PatternMiniPreview({ id }: { id: HskPatternId }) {
  switch (id) {
    case 'listening-p1':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="inline-flex items-center gap-1 font-bold text-[#B91C1C] dark:text-[#EF4444]">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio</span>
          </span>
          <div className="flex items-center gap-1 font-bold">
            <span className="px-2 py-0.5 rounded bg-[#15803D]/15 text-[#15803D] dark:text-[#22C55E]">A</span>
            <span className="px-2 py-0.5 rounded bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10">B</span>
            <span className="px-2 py-0.5 rounded bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10">C</span>
          </div>
        </div>
      );

    case 'listening-p2':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="inline-flex items-center gap-1 font-bold text-[#B91C1C] dark:text-[#EF4444]">
            <Volume2 className="w-3.5 h-3.5" />
            <span>问句</span>
          </span>
          <span className="font-hanzi font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            A / B / C 回答
          </span>
        </div>
      );

    case 'listening-p3':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="font-hanzi font-bold text-[#D97706] dark:text-[#F59E0B]">女 / 男 对话</span>
          <span className="font-bold text-[#57534E] dark:text-[#A8A29E]">A – F 场景图</span>
        </div>
      );

    case 'listening-p4':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="font-hanzi font-bold text-[#B91C1C] dark:text-[#EF4444]">对话 + 问：</span>
          <span className="font-bold text-[#57534E] dark:text-[#A8A29E]">A / B / C</span>
        </div>
      );

    case 'reading-p1':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="font-hanzi font-bold text-[#1C1917] dark:text-[#F5F2EB]">5 句子</span>
          <span className="text-[#D97706]">↔</span>
          <span className="font-bold text-[#15803D] dark:text-[#22C55E]">6 图 A–F</span>
        </div>
      );

    case 'reading-p2':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="font-hanzi font-bold text-[#1C1917] dark:text-[#F5F2EB]">5 问句</span>
          <span className="text-[#D97706]">↔</span>
          <span className="font-hanzi font-bold text-[#57534E] dark:text-[#A8A29E]">A–F 应答</span>
        </div>
      );

    case 'reading-p3-4':
    default:
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <span className="font-hanzi font-bold text-[#D97706] dark:text-[#F59E0B]">选词填空 A–F</span>
          <span className="font-hanzi font-bold text-[#B91C1C] dark:text-[#EF4444]">★ 推理判断</span>
        </div>
      );
  }
}

export function HskPortalView() {
  const { progress } = useApp();
  const [activePattern, setActivePattern] = useState<HskPatternModule | null>(null);
  const [activePaper, setActivePaper] = useState<FixedMockExamPaper | null>(null);
  const [examTrackTab, setExamTrackTab] = useState<'international' | 'arabic'>('international');

  if (activePattern) {
    return (
      <HskPatternPracticeRunner
        module={activePattern}
        onExit={() => setActivePattern(null)}
      />
    );
  }

  if (activePaper) {
    return (
      <HskFixedMockExamRunner
        paper={activePaper}
        onExit={() => setActivePaper(null)}
      />
    );
  }

  const hskResults = progress?.hskMockResults ?? [];
  const patternStats = progress?.hskPatternStats;

  const bestScore =
    hskResults.length > 0 ? Math.max(...hskResults.map((r) => r.totalScore)) : null;
  const passedCount = hskResults.filter((r) => r.passed).length;

  let patternAttempted = 0;
  let patternCorrect = 0;
  if (patternStats) {
    for (const m of HSK_PATTERN_MODULES) {
      const st = patternStats[m.id];
      if (st) {
        patternAttempted += st.attempted;
        patternCorrect += st.correct;
      }
    }
  }
  const patternAccuracy =
    patternAttempted > 0 ? Math.round((patternCorrect / patternAttempted) * 100) : null;

  const displayedPapers =
    examTrackTab === 'international' ? INTERNATIONAL_MOCK_EXAMS : ARABIC_MOCK_EXAMS;

  const getBestResultForPaper = (examId: string) => {
    const matches = hskResults.filter((r) => r.examId === examId);
    if (matches.length === 0) return null;
    return matches.reduce((best, cur) => (cur.totalScore > best.totalScore ? cur : best), matches[0]);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-12"
    >
      {/* الترويسة الرئيسية للبوابة الدولية */}
      <div className="neo-frame rounded-xl p-7 sm:p-9 bg-white dark:bg-[#1E1C1A] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="cinnabar-seal font-hanzi w-14 h-14 rounded-lg bg-[#B91C1C]/6 dark:bg-[#EF4444]/12 flex items-center justify-center text-xl font-bold shrink-0">
              考
            </span>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#D97706] dark:text-[#F59E0B]">
                <span>HSK 3.0 المستوى الأول</span>
                <span aria-hidden="true">·</span>
                <span>نظام Ruby Pinyin المعتمد</span>
                <span aria-hidden="true">·</span>
                <span>إحصائيات مستقلة عن التدريبات اليومية</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB] [text-wrap:balance]">
                بوابة الامتحانات الدولية HSK 3.0
              </h1>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed">
                بوابة متكاملة للتدرب على الأنماط الرسمية السبعة لامتحان HSK 3.0 دون مؤقت، وخوض
                الامتحانات التجريبية الموحّدة (٤٠ سؤالاً · ٢٠٠ درجة) بنسختيها الدولية الخالصة
                والتطبيقية العربية.
              </p>
            </div>
          </div>
        </div>

        {/* شريط ملخص أداء الطالب في البوابة الدولية */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 tabular-nums">
          <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 p-4">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              الامتحانات الموحّدة المنجزة
            </p>
            <p className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
              {hskResults.length}
            </p>
          </div>
          <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 p-4">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              أعلى درجة محققة
            </p>
            <p className="text-2xl font-bold text-[#B91C1C] dark:text-[#EF4444] mt-1">
              {bestScore !== null ? `${bestScore} / 200` : '—'}
            </p>
          </div>
          <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 p-4">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              مرات النجاح (١٢٠+)
            </p>
            <p className="text-2xl font-bold text-[#15803D] dark:text-[#22C55E] mt-1">
              {passedCount}
            </p>
          </div>
          <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 p-4">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              دقة تدريبات الأنماط الـ ٧
            </p>
            <p className="text-2xl font-bold text-[#D97706] dark:text-[#F59E0B] mt-1">
              {patternAccuracy !== null ? `${patternAccuracy}%` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* الجزء أ: تدريبات أنماط HSK 3.0 المعتمدة (7 وحدات غير مؤقتة) */}
      {/* ===================================================================== */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg border border-[#D97706]/30 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/12 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B]" />
            </span>
            <div>
              <span className="text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
                القسم أ · تدريب حر غير مؤقت (صيني خالص مع Ruby Pinyin)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                تدريبات أنماط HSK 3.0 المعتمدة (٧ أنماط)
              </h2>
            </div>
          </div>
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
            ٤ أنماط للاستماع (听力) · ٣ أنماط للقراءة والاستنتاج (阅读)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HSK_PATTERN_MODULES.map((mod) => {
            const st = patternStats?.[mod.id];
            const acc = st && st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : null;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActivePattern(mod)}
                className="text-right rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 hover:-translate-y-0.5 p-5 flex flex-col justify-between gap-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="font-bold text-[#57534E] dark:text-[#A8A29E]">
                        {mod.numberLabel}
                      </span>
                      <span aria-hidden="true" className="text-[#1C1917]/20 dark:text-[#F5F2EB]/20">
                        |
                      </span>
                      <span className={`font-bold ${getToneClasses(mod.difficultyTone)}`}>
                        {mod.difficultyLabel}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E]">
                      {mod.section === 'listening' ? (
                        <Headphones className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#EF4444]" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                      )}
                      <span>{mod.section === 'listening' ? 'استماع' : 'قراءة'}</span>
                    </span>
                  </div>

                  <div>
                    <p className="font-hanzi text-xs font-bold text-[#B91C1C] dark:text-[#EF4444] mb-0.5 text-left">
                      {mod.codeZh}
                    </p>
                    <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] mb-1">
                      {mod.titleAr}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {mod.descriptionAr}
                    </p>
                  </div>

                  <PatternMiniPreview id={mod.id} />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 text-xs tabular-nums">
                  <span className="text-[#57534E] dark:text-[#A8A29E]">
                    {acc !== null
                      ? `دقتك: ${acc}% (${st?.correct}/${st?.attempted})`
                      : `${mod.questions.length} أسئلة تدريبية`}
                  </span>
                  <span className="font-bold text-[#B91C1C] dark:text-[#EF4444] inline-flex items-center gap-1">
                    <span>ابدأ النمط</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* فاصل بصري واضح */}
      <div className="relative py-1" role="separator">
        <div className="border-t border-[#1C1917]/12 dark:border-[#F5F2EB]/12" />
      </div>

      {/* ===================================================================== */}
      {/* الجزء ب: الامتحانات التجريبية الموحدة (Fixed 40-Question Mock Exams) */}
      {/* ===================================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg border border-[#B91C1C]/30 dark:border-[#EF4444]/35 bg-[#B91C1C]/10 dark:bg-[#EF4444]/12 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
            </span>
            <div>
              <span className="text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                القسم ب · امتحانات تجريبية ثابتة (٤٠ سؤالاً · ٢٠٠ درجة · ١٢د استماع + ٢٠د قراءة)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                الامتحانات التجريبية الموحدة
              </h2>
            </div>
          </div>

          {/* تبويب المسار الدولي (10 نماذج) مقابل التطبيقي العربي (5 نماذج) */}
          <div
            role="tablist"
            aria-label="اختيار مسار الامتحانات التجريبية"
            className="inline-flex p-1 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F2ECE1] dark:bg-[#1E1C1A] self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={examTrackTab === 'international'}
              onClick={() => setExamTrackTab('international')}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                examTrackTab === 'international'
                  ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <Globe2 className="w-4 h-4 shrink-0" />
              <span>النماذج الدولية المعتمدة (١٠)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={examTrackTab === 'arabic'}
              onClick={() => setExamTrackTab('arabic')}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                examTrackTab === 'arabic'
                  ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>النماذج التطبيقية العربية (٥)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPapers.map((paper) => {
            const isReady = paper.status === 'ready';
            const best = getBestResultForPaper(paper.id);

            return (
              <div
                key={paper.id}
                className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-150 ${
                  isReady
                    ? 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A]'
                    : 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/60 dark:bg-[#181614] opacity-75'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                    <span className="font-hanzi font-bold text-[#D97706] dark:text-[#F59E0B]">
                      {paper.titleZh}
                    </span>
                    {isReady ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#15803D] dark:text-[#22C55E]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>متاح الآن</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#57534E] dark:text-[#A8A29E]">
                        <Lock className="w-3.5 h-3.5" />
                        <span>قريباً</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    {paper.titleAr}
                  </h3>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                    {paper.subtitleAr}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#57534E] dark:text-[#A8A29E] tabular-nums pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>١٢د استماع + ٢٠د قراءة</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>٢٠٠ درجة</span>
                  </div>

                  {best && (
                    <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 text-xs tabular-nums flex items-center justify-between">
                      <span className="text-[#57534E] dark:text-[#A8A29E]">أفضل نتيجة:</span>
                      <strong
                        className={
                          best.passed
                            ? 'text-[#15803D] dark:text-[#22C55E]'
                            : 'text-[#B91C1C] dark:text-[#EF4444]'
                        }
                      >
                        {best.totalScore}/200 ({best.passed ? 'ناجح' : 'لم يجتز'})
                      </strong>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                  {isReady ? (
                    <button
                      type="button"
                      onClick={() => setActivePaper(paper)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs font-bold transition-colors"
                    >
                      <span>{best ? 'إعادة الامتحان الموحّد' : 'ابدأ الامتحان الموحّد'}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-center text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] py-2">
                      نموذج مهيّأ للإدراج لاحقاً
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* سجل محاولات الامتحانات التجريبية الموحّدة */}
      {hskResults.length > 0 && (
        <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-3">
            <Award className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
            <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              سجل نتائجك في الامتحانات التجريبية الموحدة
            </h3>
          </div>

          <div className="divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
            {hskResults.slice(0, 8).map((res) => (
              <div
                key={res.id}
                className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm tabular-nums"
              >
                <div>
                  <p className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">{res.examTitle}</p>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                    {new Date(res.completedAt).toLocaleString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span>
                    الاستماع: <strong>{res.listeningScore}/100</strong>
                  </span>
                  <span>
                    القراءة: <strong>{res.readingScore}/100</strong>
                  </span>
                  <span className="font-bold">
                    المجموع: {res.totalScore}/{res.maxScore}
                  </span>
                  <span
                    className={`font-bold ${
                      res.passed
                        ? 'text-[#15803D] dark:text-[#22C55E]'
                        : 'text-[#B91C1C] dark:text-[#EF4444]'
                    }`}
                  >
                    {res.passed ? 'ناجح' : 'لم يجتز'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
