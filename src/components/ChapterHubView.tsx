import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Layers,
  PenTool,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { DRILL_METADATA } from '../data/chaptersData';
import { ChapterData, DrillType, QuizMode, SessionDrillKey } from '../types';

interface ChapterHubViewProps {
  chapter: ChapterData;
  selectedMode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  onStartDrill: (drillKey: SessionDrillKey) => void;
  onBack: () => void;
}

interface DrillCardConfig {
  type: DrillType;
  numberLabel: string;
  difficultyLabel: string;
  difficultyTone: 'jade' | 'gold' | 'cinnabar';
}

const FOUNDATION_DRILLS: DrillCardConfig[] = [
  {
    type: 'hanzi-to-arabic',
    numberLabel: '01',
    difficultyLabel: 'تأسيسي • سهل',
    difficultyTone: 'jade',
  },
  {
    type: 'arabic-to-hanzi',
    numberLabel: '02',
    difficultyLabel: 'تأسيسي • سهل',
    difficultyTone: 'jade',
  },
  {
    type: 'hanzi-to-pinyin',
    numberLabel: '03',
    difficultyLabel: 'تأسيسي • متوسط',
    difficultyTone: 'gold',
  },
  {
    type: 'listening',
    numberLabel: '04',
    difficultyLabel: 'تأسيسي • متوسط',
    difficultyTone: 'gold',
  },
  {
    type: 'match-2-col',
    numberLabel: '05',
    difficultyLabel: 'تأسيسي • متوسط',
    difficultyTone: 'gold',
  },
  {
    type: 'match-3-col',
    numberLabel: '06',
    difficultyLabel: 'تأسيسي • متوسط',
    difficultyTone: 'gold',
  },
];

const APPLIED_DRILLS: DrillCardConfig[] = [
  {
    type: 'sentence-hanzi-to-arabic',
    numberLabel: '07',
    difficultyLabel: 'تطبيقي • متوسط',
    difficultyTone: 'gold',
  },
  {
    type: 'sentence-arabic-to-hanzi',
    numberLabel: '08',
    difficultyLabel: 'تطبيقي • متوسط',
    difficultyTone: 'gold',
  },
  {
    type: 'fill-in-blank',
    numberLabel: '09',
    difficultyLabel: 'تطبيقي • متوسط',
    difficultyTone: 'gold',
  },
  {
    type: 'sentence-builder',
    numberLabel: '10',
    difficultyLabel: 'تطبيقي • متقدم',
    difficultyTone: 'cinnabar',
  },
];

function getDifficultyColorClasses(tone: 'jade' | 'gold' | 'cinnabar'): string {
  if (tone === 'jade') {
    return 'text-[#15803D] dark:text-[#22C55E]';
  }
  if (tone === 'gold') {
    return 'text-[#B45309] dark:text-[#F59E0B]';
  }
  return 'text-[#B91C1C] dark:text-[#EF4444]';
}

function DrillFormatMiniPreview({ type }: { type: DrillType }) {
  switch (type) {
    case 'hanzi-to-arabic':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-between gap-2"
        >
          <span className="font-hanzi text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            你好
          </span>
          <span className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">←</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#15803D]/12 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E] font-bold">
              مرحباً
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1C1917]/6 dark:bg-[#F5F2EB]/8 text-[#57534E] dark:text-[#A8A29E]">
              معلم
            </span>
          </div>
        </div>
      );

    case 'arabic-to-hanzi':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-between gap-2"
        >
          <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]">معلم</span>
          <span className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">←</span>
          <div className="flex items-center gap-1.5 font-hanzi text-sm">
            <span className="px-2 py-0.5 rounded bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444] font-bold">
              老师
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1C1917]/6 dark:bg-[#F5F2EB]/8 text-[#57534E] dark:text-[#A8A29E]">
              学生
            </span>
          </div>
        </div>
      );

    case 'hanzi-to-pinyin':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-between gap-2"
        >
          <span className="font-hanzi text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            中国
          </span>
          <div className="flex items-center gap-1.5 font-pinyin text-xs">
            <span className="px-2 py-0.5 rounded bg-[#D97706]/15 dark:bg-[#F59E0B]/18 text-[#92400E] dark:text-[#F59E0B] font-bold">
              zhōngguó
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1C1917]/6 dark:bg-[#F5F2EB]/8 text-[#57534E] dark:text-[#A8A29E]">
              zhǒngguò
            </span>
          </div>
        </div>
      );

    case 'listening':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444] flex items-center justify-center">
              <Volume2 className="w-3.5 h-3.5" />
            </span>
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-0.5 h-2 bg-[#B91C1C]/70 dark:bg-[#EF4444]/70 rounded-full" />
              <span className="w-0.5 h-4 bg-[#B91C1C] dark:bg-[#EF4444] rounded-full" />
              <span className="w-0.5 h-3 bg-[#B91C1C]/80 dark:bg-[#EF4444]/80 rounded-full" />
              <span className="w-0.5 h-1.5 bg-[#B91C1C]/60 dark:bg-[#EF4444]/60 rounded-full" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E]">
            استماع ← اختيار المعنى
          </span>
        </div>
      );

    case 'match-2-col':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
        >
          <div className="flex flex-col gap-1 font-hanzi font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            <span>朋友</span>
            <span>学生</span>
          </div>
          <div className="flex-1 border-t border-dashed border-[#D97706]/60 mx-1" />
          <div className="flex flex-col gap-1 text-[#57534E] dark:text-[#A8A29E]">
            <span>صديق</span>
            <span>طالب</span>
          </div>
        </div>
      );

    case 'match-3-col':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-between gap-1 text-[11px]"
        >
          <span className="font-hanzi font-bold text-[#1C1917] dark:text-[#F5F2EB]">名字</span>
          <span className="text-[#D97706]">↔</span>
          <span className="font-pinyin text-[#57534E] dark:text-[#A8A29E]">míngzi</span>
          <span className="text-[#D97706]">↔</span>
          <span className="font-semibold text-[#15803D] dark:text-[#22C55E]">اسم</span>
        </div>
      );

    case 'sentence-hanzi-to-arabic':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 space-y-1"
        >
          <p className="font-hanzi text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] text-left">
            我是中国人。
          </p>
          <p className="text-[11px] font-semibold text-[#15803D] dark:text-[#22C55E]">
            ← أنا صيني الجنسية.
          </p>
        </div>
      );

    case 'sentence-arabic-to-hanzi':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2 space-y-1"
        >
          <p className="text-[11px] font-semibold text-[#1C1917] dark:text-[#F5F2EB]">
            هل تتحدث الصينية؟
          </p>
          <p className="font-hanzi text-xs font-bold text-[#B91C1C] dark:text-[#EF4444] text-left">
            你会说中文吗？
          </p>
        </div>
      );

    case 'fill-in-blank':
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-between gap-2"
        >
          <span className="font-hanzi text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            他 <span className="inline-block border-b-2 border-[#B91C1C] dark:border-[#EF4444] px-1.5 text-[#B91C1C] dark:text-[#EF4444]">___</span> 两个孩子
          </span>
          <span className="font-hanzi text-[11px] px-1.5 py-0.5 rounded bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444] font-bold">
            有
          </span>
        </div>
      );

    case 'sentence-builder':
    default:
      return (
        <div
          aria-hidden="true"
          className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/8 dark:border-[#F5F2EB]/8 px-3 py-2.5 flex items-center justify-center gap-1.5 font-hanzi text-xs"
        >
          <span className="px-2 py-0.5 rounded border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] font-bold">
            我
          </span>
          <span className="px-2 py-0.5 rounded border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] font-bold">
            会
          </span>
          <span className="px-2 py-0.5 rounded border border-[#B91C1C]/35 dark:border-[#EF4444]/35 bg-[#B91C1C]/8 dark:bg-[#EF4444]/12 text-[#B91C1C] dark:text-[#EF4444] font-bold">
            做饭
          </span>
        </div>
      );
  }
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

  const renderDrillGrid = (items: DrillCardConfig[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((cfg) => {
        const meta = DRILL_METADATA[cfg.type];
        const available = isDrillAvailable(cfg.type);
        const isCompleted = completedDrills.has(cfg.type);
        const itemCount =
          meta.requires === 'vocab' ? chapter.vocab.length : chapter.sentences.length;

        return (
          <button
            key={cfg.type}
            type="button"
            disabled={!available}
            onClick={() => onStartDrill(cfg.type)}
            className={`text-right rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] ${
              available
                ? 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 hover:-translate-y-0.5'
                : 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/60 dark:bg-[#181614] opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="space-y-3">
              {/* سطر المستوى والرقم وحالة الإنجاز */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-bold text-[#57534E] dark:text-[#A8A29E]">
                    {cfg.numberLabel}
                  </span>
                  <span aria-hidden="true" className="text-[#1C1917]/20 dark:text-[#F5F2EB]/20">
                    |
                  </span>
                  <span className={`font-bold ${getDifficultyColorClasses(cfg.difficultyTone)}`}>
                    {cfg.difficultyLabel}
                  </span>
                </div>

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] dark:text-[#22C55E]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>مُنجز</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] mb-1">
                  {meta.titleAr}
                </h3>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                  {meta.descriptionAr}
                </p>
              </div>

              {/* معاينة مصغّرة لشكل السؤال */}
              <DrillFormatMiniPreview type={cfg.type} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 text-xs">
              <span className="text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                {available
                  ? `${itemCount} ${meta.requires === 'vocab' ? 'مفردة' : 'جملة'} متاحة`
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
  );

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

          {/* القسم الأول: المستوى التأسيسي — مفردات ونطق */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg border border-[#15803D]/30 dark:border-[#22C55E]/30 bg-[#15803D]/10 dark:bg-[#22C55E]/12 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-[#15803D] dark:text-[#22C55E]" />
                </span>
                <div>
                  <div className="text-xs font-bold text-[#15803D] dark:text-[#22C55E]">
                    القسم الأول · ٦ تدريبات مفردات ونطق
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    المستوى التأسيسي — مفردات ونطق
                  </h2>
                </div>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                تمارين الرموز الصينية والبينين والنغمات والاستماع والتوصيل
              </p>
            </div>

            {renderDrillGrid(FOUNDATION_DRILLS)}
          </div>

          {/* فاصل بصري واضح بين المستوى التأسيسي والمستوى التطبيقي */}
          <div className="relative py-2" role="separator">
            <div className="border-t border-[#1C1917]/12 dark:border-[#F5F2EB]/12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                الانتقال من المفردات إلى التراكيب والجمل
              </span>
            </div>
          </div>

          {/* القسم الثاني: المستوى التطبيقي — تراكيب وجمل */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg border border-[#B91C1C]/30 dark:border-[#EF4444]/30 bg-[#B91C1C]/10 dark:bg-[#EF4444]/12 flex items-center justify-center shrink-0">
                  <PenTool className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
                </span>
                <div>
                  <div className="text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                    القسم الثاني · ٤ تدريبات تراكيب وجمل
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    المستوى التطبيقي — تراكيب وجمل
                  </h2>
                </div>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                تمارين الترجمة السياقية وإكمال الفراغ وبناء الجمل الصينية
              </p>
            </div>

            {renderDrillGrid(APPLIED_DRILLS)}
          </div>
        </>
      )}
    </motion.section>
  );
}
