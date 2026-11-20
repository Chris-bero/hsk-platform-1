import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ALL_DRILL_TYPES, DRILL_METADATA } from '../data/chaptersData';
import { ChapterData, DrillType, QuizMode, SessionDrillKey } from '../types';

interface ChapterHubViewProps {
  chapter: ChapterData;
  selectedMode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  onStartDrill: (drillKey: SessionDrillKey) => void;
  onBack: () => void;
}

export function ChapterHubView({
  chapter,
  selectedMode,
  onModeChange,
  onStartDrill,
  onBack,
}: ChapterHubViewProps) {
  const { progress, analytics } = useApp();

  const chapterStats = progress?.chapterStats[chapter.id];
  const completedDrills = new Set<DrillType>(chapterStats?.completedDrills ?? []);
  const completionPercent = analytics.getChapterCompletion(chapter.id);

  const isDrillAvailable = (drillType: DrillType) => {
    const req = DRILL_METADATA[drillType].requires;
    return req === 'vocab' ? chapter.vocab.length > 0 : chapter.sentences.length > 0;
  };

  const hasAnyContent = chapter.vocab.length > 0 || chapter.sentences.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8"
    >
      {/* الترويسة وزر الرجوع */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الفصول الخمسة عشر</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="cinnabar-seal font-hanzi w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold bg-white dark:bg-[#1E1C1A] shrink-0">
              {chapter.chineseNumeral}
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums mb-1">
                <span>{chapter.vocab.length} مفردات</span>
                <span aria-hidden="true">·</span>
                <span>{chapter.sentences.length} جمل</span>
                <span aria-hidden="true">·</span>
                <span>الإكمال {completionPercent}%</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                {chapter.titleAr}: {chapter.subtitleAr}
              </h1>
            </div>
          </div>

          {/* مفتاح التبديل بين وضع التدريب ووضع الامتحان */}
          <div
            role="radiogroup"
            aria-label="اختيار نمط الجلسة"
            className="inline-flex p-1 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F2ECE1] dark:bg-[#1E1C1A] self-start lg:self-auto"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedMode === 'practice'}
              onClick={() => onModeChange('practice')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                selectedMode === 'practice'
                  ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>وضع التدريب</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedMode === 'exam'}
              onClick={() => onModeChange('exam')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                selectedMode === 'exam'
                  ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              <span>وضع الامتحان</span>
            </button>
          </div>
        </div>
      </div>

      {/* توضيح مختصر لآلية الوضع المختار */}
      <div className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] px-5 py-3.5 text-sm text-[#57534E] dark:text-[#A8A29E]">
        {selectedMode === 'practice' ? (
          <span>
            <strong className="text-[#15803D] dark:text-[#22C55E]">وضع التدريب:</strong> يعرض
            التصحيح الفوري والإجابة الصحيحة بعد كل سؤال لمساعدتك على التثبيت السريع.
          </span>
        ) : (
          <span>
            <strong className="text-[#B91C1C] dark:text-[#EF4444]">وضع الامتحان:</strong> يتيح لك
            التنقل الحر بين الأسئلة وتعديل إجاباتك قبل التسليم النهائي، ثم عرض النتيجة والمراجعة
            الكاملة.
          </span>
        )}
      </div>

      {!hasAnyContent ? (
        <div className="neo-frame rounded-xl p-12 text-center space-y-3">
          <p className="text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            محتوى هذا الفصل قيد الإضافة
          </p>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
            لا توجد مفردات أو جمل مضافة في هذا الفصل بعد.
          </p>
        </div>
      ) : (
        <>
          {/* بطاقة الاختبار الشامل */}
          <div className="neo-frame rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706] dark:text-[#F59E0B]">
                <Layers className="w-4 h-4" />
                <span>تدريب متكامل يجمع جميع المحركات المتاحة</span>
              </div>
              <h2 className="text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                اختبار شامل للفصل
              </h2>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
                مجموعة متنوعة تشمل القراءة والنغمات والتوصيل والاستماع وترجمة وتكوين الجمل في جلسة
                واحدة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStartDrill('mixed')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {selectedMode === 'practice' ? 'ابدأ التدريب الشامل' : 'ابدأ الامتحان الشامل'}
              </span>
            </button>
          </div>

          {/* شبكة الأنماط التدريبية التسعة */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              الأنماط التدريبية الفردية (٩ محركات)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_DRILL_TYPES.map((drillType, index) => {
                const meta = DRILL_METADATA[drillType];
                const available = isDrillAvailable(drillType);
                const isCompleted = completedDrills.has(drillType);
                const itemCount =
                  meta.requires === 'vocab' ? chapter.vocab.length : chapter.sentences.length;

                return (
                  <button
                    key={drillType}
                    type="button"
                    disabled={!available}
                    onClick={() => onStartDrill(drillType)}
                    className={`text-right rounded-xl border p-5 flex flex-col justify-between transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] ${
                      available
                        ? 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 hover:-translate-y-0.5'
                        : 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/60 dark:bg-[#181614] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                          {String(index + 1).padStart(2, '0')} ·{' '}
                          {meta.requires === 'vocab' ? 'مفردات' : 'جمل'}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] dark:text-[#22C55E]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>مُنجز</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] mb-1.5">
                        {meta.titleAr}
                      </h3>
                      <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-5">
                        {meta.descriptionAr}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 text-xs">
                      <span className="text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                        {available
                          ? `${itemCount} ${meta.requires === 'vocab' ? 'كلمات' : 'جمل'} متاحة`
                          : 'لا توجد عناصر متاحة'}
                      </span>
                      {available && (
                        <span className="font-bold text-[#B91C1C] dark:text-[#EF4444]">
                          {selectedMode === 'practice' ? 'تدرّب الآن' : 'ابدأ الامتحان'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
}
