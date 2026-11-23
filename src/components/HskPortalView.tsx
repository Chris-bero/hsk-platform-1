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
import { isMockExamUnlocked, isPatternUnlocked } from '../utils/accessControl';
import { HskFixedMockExamRunner } from './HskFixedMockExamRunner';
import { HskPatternPracticeRunner } from './HskPatternPracticeRunner';
import { LockedAccessModal } from './LockedAccessModal';

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
  const { progress, unlockedAccess } = useApp();
  const [activePattern, setActivePattern] = useState<HskPatternModule | null>(null);
  const [activePaper, setActivePaper] = useState<FixedMockExamPaper | null>(null);
  const [lockedPaperModal, setLockedPaperModal] = useState<FixedMockExamPaper | null>(null);
  const [lockedPatternModal, setLockedPatternModal] = useState<HskPatternModule | null>(null);
  const [examTrackTab, setExamTrackTab] = useState<'international' | 'arabic'>('international');
  const unlockedPatternsCount = unlockedAccess.patterns.length;
  const unlockedIntlCount = unlockedAccess.intlMocks.length;
  const unlockedArabicCount = unlockedAccess.arabicMocks.length;

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

  let patternSolved = 0;
  let patternCorrect = 0;
  let patternWrong = 0;
  let patternsStarted = 0;
  if (patternStats) {
    for (const m of HSK_PATTERN_MODULES) {
      const st = patternStats[m.id];
      if (st) {
        const solved = st.solved ?? st.attempted ?? 0;
        const correct = st.correct ?? 0;
        const wrong = st.wrong ?? Math.max(0, solved - correct);
        if (solved > 0) patternsStarted += 1;
        patternSolved += solved;
        patternCorrect += correct;
        patternWrong += wrong;
      }
    }
  }
  const patternAccuracy =
    patternSolved > 0 ? Math.round((patternCorrect / patternSolved) * 100) : null;

  const getAccuracyBadgeClasses = (acc: number | null) => {
    if (acc === null) {
      return {
        text: 'text-[#57534E] dark:text-[#A8A29E]',
        badge: 'bg-[#1C1917]/6 dark:bg-[#F5F2EB]/8 text-[#57534E] dark:text-[#A8A29E]',
        bar: 'bg-[#1C1917]/20 dark:bg-[#F5F2EB]/20',
      };
    }
    if (acc >= 85) {
      return {
        text: 'text-[#15803D] dark:text-[#22C55E]',
        badge: 'bg-[#15803D]/12 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]',
        bar: 'bg-[#15803D] dark:bg-[#22C55E]',
      };
    }
    if (acc >= 70) {
      return {
        text: 'text-[#B45309] dark:text-[#F59E0B]',
        badge: 'bg-[#D97706]/12 dark:bg-[#F59E0B]/15 text-[#B45309] dark:text-[#F59E0B]',
        bar: 'bg-[#D97706] dark:bg-[#F59E0B]',
      };
    }
    return {
      text: 'text-[#B91C1C] dark:text-[#EF4444]',
      badge: 'bg-[#B91C1C]/12 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]',
      bar: 'bg-[#B91C1C] dark:bg-[#EF4444]',
    };
  };

  const overallPatternStyle = getAccuracyBadgeClasses(patternAccuracy);

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
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <p className={`text-2xl font-bold ${overallPatternStyle.text}`}>
                {patternAccuracy !== null ? `${patternAccuracy}%` : '—'}
              </p>
              <span className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E]">
                {patternsStarted}/7 أنماط
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] mt-1">
              {patternSolved > 0
                ? `${patternSolved} محلول · ${patternCorrect} صحيح · ${patternWrong} خطأ`
                : 'ابدأ بأي نمط بالأسفل'}
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
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
            ٤ أنماط للاستماع (听力) · ٣ أنماط للقراءة (阅读) · مفتوح لك{' '}
            <strong className="text-[#15803D] dark:text-[#22C55E]">{unlockedPatternsCount}/7</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HSK_PATTERN_MODULES.map((mod, idx) => {
            const patternNum = idx + 1;
            const isPatternOpen = isPatternUnlocked(unlockedAccess, patternNum);
            const st = patternStats?.[mod.id];
            const solved = st ? (st.solved ?? st.attempted ?? 0) : 0;
            const correct = st ? (st.correct ?? 0) : 0;
            const wrong = st ? (st.wrong ?? Math.max(0, solved - correct)) : 0;
            const acc =
              solved > 0
                ? (st?.accuracyPercent ?? Math.round((correct / solved) * 100))
                : null;
            const accStyle = getAccuracyBadgeClasses(acc);

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  if (!isPatternOpen) {
                    setLockedPatternModal(mod);
                    return;
                  }
                  setActivePattern(mod);
                }}
                className={`text-right rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${
                  isPatternOpen
                    ? 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 hover:-translate-y-0.5'
                    : 'border-[#D97706]/25 dark:border-[#F59E0B]/25 bg-[#F4EFE6]/85 dark:bg-[#191715]'
                }`}
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

                    {isPatternOpen ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E]">
                        {mod.section === 'listening' ? (
                          <Headphones className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#EF4444]" />
                        ) : (
                          <BookOpen className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                        )}
                        <span>{mod.section === 'listening' ? 'استماع' : 'قراءة'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 font-bold text-[#B45309] dark:text-[#F59E0B] text-[11px]">
                        <Lock className="w-3 h-3" />
                        <span>مقفل</span>
                      </span>
                    )}
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

                  {/* مؤشر تقدم ودقة الطالب في هذا النمط */}
                  <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 p-3 space-y-2 tabular-nums">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-[#57534E] dark:text-[#A8A29E]">
                        {solved > 0 ? `تم حل ${solved} سؤال` : `${mod.questions.length} أسئلة تدريبية`}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${accStyle.badge}`}>
                        {acc !== null ? `الدقة: ${acc}%` : 'لم يبدأ بعد'}
                      </span>
                    </div>

                    <div
                      className="h-1.5 w-full rounded-full bg-[#1C1917]/10 dark:bg-[#F5F2EB]/10 overflow-hidden"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${accStyle.bar}`}
                        style={{ width: `${acc ?? 0}%` }}
                      />
                    </div>

                    {solved > 0 && (
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-[#15803D] dark:text-[#22C55E]">صحيح: {correct}</span>
                        <span className="text-[#B91C1C] dark:text-[#EF4444]">أخطاء: {wrong}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 text-xs tabular-nums">
                  <span className="text-[#57534E] dark:text-[#A8A29E]">
                    {!isPatternOpen
                      ? 'يتطلب التفعيل من المعلم'
                      : solved > 0
                        ? 'مواصلة التدريب'
                        : 'تدريب غير مؤقت'}
                  </span>
                  {isPatternOpen ? (
                    <span className="font-bold text-[#B91C1C] dark:text-[#EF4444] inline-flex items-center gap-1">
                      <span>ابدأ النمط</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="font-bold text-[#B45309] dark:text-[#F59E0B] inline-flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>🔒 تفعيل النمط</span>
                    </span>
                  )}
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
            className="inline-flex flex-wrap max-w-full gap-1 p-1 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F2ECE1] dark:bg-[#1E1C1A] self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={examTrackTab === 'international'}
              onClick={() => setExamTrackTab('international')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap tabular-nums ${
                examTrackTab === 'international'
                  ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <Globe2 className="w-4 h-4 shrink-0" />
              <span>النماذج الدولية ({unlockedIntlCount}/10)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={examTrackTab === 'arabic'}
              onClick={() => setExamTrackTab('arabic')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap tabular-nums ${
                examTrackTab === 'arabic'
                  ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>النماذج العربية ({unlockedArabicCount}/5)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPapers.map((paper) => {
            const isReady = paper.status === 'ready';
            const isLocked = !isMockExamUnlocked(unlockedAccess, paper.track, paper.modelNumber);
            const best = getBestResultForPaper(paper.id);

            return (
              <div
                key={paper.id}
                className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-150 ${
                  isLocked
                    ? 'border-[#D97706]/25 dark:border-[#F59E0B]/25 bg-[#F4EFE6]/85 dark:bg-[#191715]'
                    : isReady
                      ? 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A]'
                      : 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/60 dark:bg-[#181614] opacity-75'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                    <span className="font-hanzi font-bold text-[#D97706] dark:text-[#F59E0B]">
                      {paper.titleZh}
                    </span>
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 font-bold text-[#B45309] dark:text-[#F59E0B] text-[11px]">
                        <Lock className="w-3 h-3" />
                        <span>مغلق</span>
                      </span>
                    ) : isReady ? (
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
                  {isLocked ? (
                    <button
                      type="button"
                      onClick={() => setLockedPaperModal(paper)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 hover:bg-[#D97706]/18 dark:bg-[#F59E0B]/15 dark:hover:bg-[#F59E0B]/22 text-[#B45309] dark:text-[#F59E0B] text-xs font-bold transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>🔒 تفعيل الامتحان الشامل</span>
                    </button>
                  ) : isReady ? (
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
      <LockedAccessModal
        isOpen={Boolean(lockedPaperModal || lockedPatternModal)}
        itemTitle={
          lockedPaperModal
            ? lockedPaperModal.titleAr
            : lockedPatternModal
              ? `${lockedPatternModal.codeZh} — ${lockedPatternModal.titleAr}`
              : ''
        }
        itemType={lockedPatternModal ? 'pattern-drill' : 'mock-exam'}
        onClose={() => {
          setLockedPaperModal(null);
          setLockedPatternModal(null);
        }}
      />
    </motion.section>
  );
}
