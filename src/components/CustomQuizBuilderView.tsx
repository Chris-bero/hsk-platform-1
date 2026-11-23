import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  GraduationCap,
  Layers,
  Lock,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ALL_DRILL_TYPES, CHAPTERS_DATA, DRILL_METADATA } from '../data/chaptersData';
import { ChapterData, CustomQuizConfig, DrillType, QuizMode } from '../types';
import { isChapterUnlocked } from '../utils/accessControl';
import { countAvailableQuestionsForConfig } from '../utils/drillGenerators';
import { LockedAccessModal } from './LockedAccessModal';

interface CustomQuizBuilderViewProps {
  onStartCustomQuiz: (config: CustomQuizConfig) => void;
  onBack: () => void;
}

const QUESTION_LIMIT_OPTIONS: { value: 10 | 20 | 40 | 'all'; label: string }[] = [
  { value: 10, label: '١٠ أسئلة' },
  { value: 20, label: '٢٠ سؤالاً' },
  { value: 40, label: '٤٠ سؤالاً' },
  { value: 'all', label: 'الكل' },
];

export function CustomQuizBuilderView({
  onStartCustomQuiz,
  onBack,
}: CustomQuizBuilderViewProps) {
  const { unlockedAccess } = useApp();
  const [lockedChapterModal, setLockedChapterModal] = useState<ChapterData | null>(null);

  const populatedUnlockedChapterIds = useMemo(
    () =>
      CHAPTERS_DATA.filter(
        (ch) =>
          (ch.vocab.length > 0 || ch.sentences.length > 0) &&
          isChapterUnlocked(unlockedAccess, ch.id)
      ).map((ch) => ch.id),
    [unlockedAccess]
  );

  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>(
    populatedUnlockedChapterIds
  );
  const [drillScope, setDrillScope] = useState<DrillType | 'all'>('all');
  const [questionLimit, setQuestionLimit] = useState<10 | 20 | 40 | 'all'>(20);
  const [mode, setMode] = useState<QuizMode>('practice');

  // إزالة أي فصل مقفل من التحديد تلقائياً أو تفعيل المفتوحة إن تغيرت الصلاحيات
  useEffect(() => {
    setSelectedChapterIds((prev) => {
      const stillValid = prev.filter((id) => populatedUnlockedChapterIds.includes(id));
      return stillValid.length > 0 ? stillValid : populatedUnlockedChapterIds;
    });
  }, [populatedUnlockedChapterIds]);

  const availableQuestionsCount = useMemo(
    () => countAvailableQuestionsForConfig(CHAPTERS_DATA, selectedChapterIds, drillScope),
    [selectedChapterIds, drillScope]
  );

  const effectiveQuestionCount =
    questionLimit === 'all'
      ? availableQuestionsCount
      : Math.min(availableQuestionsCount, questionLimit);

  const allPopulatedSelected =
    populatedUnlockedChapterIds.length > 0 &&
    populatedUnlockedChapterIds.every((id) => selectedChapterIds.includes(id));

  const toggleChapter = (chapter: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, chapter.id)) {
      setLockedChapterModal(chapter);
      return;
    }
    setSelectedChapterIds((prev) =>
      prev.includes(chapter.id) ? prev.filter((id) => id !== chapter.id) : [...prev, chapter.id]
    );
  };

  const handleSelectAllPopulated = () => {
    setSelectedChapterIds(populatedUnlockedChapterIds);
  };

  const handleClearChapters = () => {
    setSelectedChapterIds([]);
  };

  const canStart = selectedChapterIds.length > 0 && availableQuestionsCount > 0;

  const handleLaunch = () => {
    if (!canStart) return;
    onStartCustomQuiz({
      chapterIds: selectedChapterIds,
      drillScope,
      questionLimit,
      mode,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8"
    >
      {/* الترويسة وزر العودة */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الرئيسية</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="cinnabar-seal w-14 h-14 rounded-lg flex items-center justify-center bg-white dark:bg-[#1E1C1A] shrink-0">
              <SlidersHorizontal className="w-6 h-6 text-[#B91C1C] dark:text-[#EF4444]" />
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] mb-1">
                <span>تدريب واختبار مخصص</span>
                <span aria-hidden="true">·</span>
                <span>متعدد الفصول والمهارات</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                صمّم جلستك التدريبية
              </h1>
            </div>
          </div>

          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] max-w-md">
            اختر فصلاً واحداً أو عدة فصول معاً، وحدّد مهارة واحدة أو جميع المهارات العشر في وضع
            التدريب أو الاختبار.
          </p>
        </div>
      </div>

      {/* ١. اختيار الفصول */}
      <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/8 dark:border-[#F5F2EB]/8 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              ١. اختيار الفصول الدراسية
            </h2>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5 tabular-nums">
              الفصول المحددة: {selectedChapterIds.length} من أصل {populatedUnlockedChapterIds.length}{' '}
              فصل مفتوح لك حالياً
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllPopulated}
              disabled={allPopulatedSelected}
              className="px-3.5 py-2 min-h-[38px] rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45 disabled:opacity-45 transition-colors"
            >
              تحديد الكل
            </button>
            <button
              type="button"
              onClick={handleClearChapters}
              disabled={selectedChapterIds.length === 0}
              className="px-3.5 py-2 min-h-[38px] rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] disabled:opacity-40 transition-colors"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHAPTERS_DATA.map((chapter) => {
            const isEmpty = chapter.vocab.length === 0 && chapter.sentences.length === 0;
            const isUnlocked = isChapterUnlocked(unlockedAccess, chapter.id);
            const isSelected = isUnlocked && selectedChapterIds.includes(chapter.id);

            return (
              <button
                key={chapter.id}
                type="button"
                disabled={isUnlocked && isEmpty}
                onClick={() => toggleChapter(chapter)}
                aria-pressed={isSelected}
                className={`text-right rounded-xl border p-4 flex items-center justify-between gap-3 transition-all duration-150 ${
                  !isUnlocked
                    ? 'border-[#D97706]/25 dark:border-[#F59E0B]/25 bg-[#F2ECE1]/65 dark:bg-[#181614] hover:border-[#D97706]/55'
                    : isEmpty
                      ? 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/45 dark:bg-[#181614] opacity-55 cursor-not-allowed'
                      : isSelected
                        ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/7 dark:bg-[#EF4444]/12 ring-1 ring-[#B91C1C]/25 dark:ring-[#EF4444]/25'
                        : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/60 dark:bg-[#121110]/60 hover:border-[#B91C1C]/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-hanzi w-9 h-9 rounded-md border flex items-center justify-center text-sm font-bold shrink-0 ${
                      !isUnlocked
                        ? 'border-[#D97706]/35 bg-[#D97706]/10 text-[#B45309] dark:text-[#F59E0B]'
                        : isSelected
                          ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                          : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB]'
                    }`}
                  >
                    {chapter.chineseNumeral}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB] truncate">
                      {chapter.titleAr}
                    </p>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] truncate tabular-nums">
                      {!isUnlocked
                        ? '🔒 مغلق · اضغط للتفعيل'
                        : isEmpty
                          ? 'قيد الإضافة'
                          : `${chapter.vocab.length} مفردة · ${chapter.sentences.length} جملة`}
                    </p>
                  </div>
                </div>

                {!isUnlocked ? (
                  <Lock className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B] shrink-0" />
                ) : (
                  !isEmpty && (
                    <span
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                          : 'border-[#1C1917]/25 dark:border-[#F5F2EB]/25 bg-white dark:bg-[#1E1C1A]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ٢. اختيار نوع التدريب (مهارة واحدة أو جميع المهارات العشر) */}
      <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 sm:p-7 space-y-5">
        <div className="border-b border-[#1C1917]/8 dark:border-[#F5F2EB]/8 pb-4">
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            ٢. اختيار المهارة التدريبية
          </h2>
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
            اختر جميع الأنماط العشرة معاً أو ركّز على مهارة واحدة فقط.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrillScope('all')}
          className={`w-full text-right rounded-xl border p-4 flex items-center justify-between gap-4 transition-all duration-150 ${
            drillScope === 'all'
              ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/14 ring-1 ring-[#B91C1C]/25 dark:ring-[#EF4444]/25'
              : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/60 dark:bg-[#121110]/60 hover:border-[#B91C1C]/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                جميع الأنماط التدريبية (١٠ أنماط شاملة)
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                مزيج متوازن من المفردات والنغمات والتوصيل والاستماع وترجمة وتكوين الجمل
              </p>
            </div>
          </div>
          <span className="text-xs font-bold tabular-nums text-[#57534E] dark:text-[#A8A29E] shrink-0">
            {countAvailableQuestionsForConfig(CHAPTERS_DATA, selectedChapterIds, 'all')} سؤال
          </span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_DRILL_TYPES.map((dt, idx) => {
            const meta = DRILL_METADATA[dt];
            const countForDrill = countAvailableQuestionsForConfig(
              CHAPTERS_DATA,
              selectedChapterIds,
              dt
            );
            const isSelected = drillScope === dt;

            return (
              <button
                key={dt}
                type="button"
                onClick={() => setDrillScope(dt)}
                className={`text-right rounded-xl border p-4 flex flex-col justify-between gap-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/14 ring-1 ring-[#B91C1C]/25 dark:ring-[#EF4444]/25'
                    : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/50 dark:bg-[#121110]/50 hover:border-[#B91C1C]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                  <span>
                    {String(idx + 1).padStart(2, '0')} · {meta.requires === 'vocab' ? 'مفردات' : 'جمل'}
                  </span>
                  <span className="font-bold">{countForDrill} سؤال</span>
                </div>
                <p className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  {meta.titleAr}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ٣. عدد الأسئلة ووضع الجلسة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* عدد الأسئلة */}
        <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 space-y-4">
          <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            ٣. عدد الأسئلة في الجلسة
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {QUESTION_LIMIT_OPTIONS.map((opt) => {
              const active = questionLimit === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setQuestionLimit(opt.value)}
                  className={`py-3 px-3 min-h-[46px] rounded-lg border text-sm font-bold transition-colors ${
                    active
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/40'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* وضع التدريب أم وضع الامتحان */}
        <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 space-y-4">
          <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            ٤. وضع التشغيل
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`p-3.5 rounded-lg border text-right transition-all ${
                mode === 'practice'
                  ? 'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/10 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]'
                  : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>وضع التدريب</span>
              </div>
              <p className="text-xs opacity-85">تصحيح فوري وإظهار الإجابة بعد كل سؤال</p>
            </button>

            <button
              type="button"
              onClick={() => setMode('exam')}
              className={`p-3.5 rounded-lg border text-right transition-all ${
                mode === 'exam'
                  ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]'
                  : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <ClipboardCheck className="w-4 h-4 shrink-0" />
                <span>وضع الاختبار</span>
              </div>
              <p className="text-xs opacity-85">تنقل حر ونتيجة ومراجعة شاملة في النهاية</p>
            </button>
          </div>
        </div>
      </div>

      {/* شريط الانطلاق */}
      <div className="neo-frame rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E1C1A]">
        <div className="space-y-1">
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">ملخص الجلسة المخصصة</p>
          <p className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums">
            {canStart
              ? `ستبدأ جلسة من ${effectiveQuestionCount} سؤال (من أصل ${availableQuestionsCount} متاح) في ${
                  mode === 'practice' ? 'وضع التدريب' : 'وضع الاختبار'
                }`
              : 'يرجى تحديد فصل واحد متاح على الأقل للبدء'}
          </p>
        </div>

        <button
          type="button"
          disabled={!canStart}
          onClick={handleLaunch}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <span>ابدأ الجلسة المخصصة</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
      <LockedAccessModal
        isOpen={Boolean(lockedChapterModal)}
        itemTitle={
          lockedChapterModal
            ? `${lockedChapterModal.titleAr} (第${lockedChapterModal.id}课)`
            : ''
        }
        itemType="chapter"
        onClose={() => setLockedChapterModal(null)}
      />
    </motion.section>
  );
}
