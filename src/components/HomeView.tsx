import { useState } from 'react';
import { ArrowLeft, BarChart3, BookOpen, Clock, Flame, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatStudyDurationAr } from '../hooks/useActiveStudyTimer';
import { AppView } from '../types';

const HERO_INK_ART = '/src/assets/images/neo_chinese_hero_ink_1795181947264.jpg';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { currentStudent, progress, analytics } = useApp();
  const [heroImgError, setHeroImgError] = useState(false);

  const summaryMetrics = [
    {
      label: 'نسبة الدقة',
      value: `${analytics.accuracyPercent}%`,
      sub: progress && progress.totalSolved > 0 ? `${progress.totalSolved} سؤال محلول` : 'ابدأ أول تدريب',
      icon: Target,
    },
    {
      label: 'سلسلة الدراسة',
      value: `${analytics.streakDays} ${analytics.streakDays === 1 ? 'يوم' : 'أيام'}`,
      sub: 'أيام متواصلة',
      icon: Flame,
    },
    {
      label: 'التقدم العام',
      value: `${analytics.overallProgressPercent}%`,
      sub: 'عبر ١٥ فصلاً دراسياً',
      icon: BookOpen,
    },
    {
      label: 'وقت الدراسة النشط',
      value: formatStudyDurationAr(progress?.activeSeconds ?? 0),
      sub: 'يُحتسب أثناء التفاعل فقط',
      icon: Clock,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-10"
    >
      {/* البطاقة الترحيبية الرئيسية */}
      <div className="neo-frame rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-[#1E1C1A]">
          <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] mb-4">
            <span>المنهج التأسيسي</span>
            <span aria-hidden="true">·</span>
            <span>المستوى الأول</span>
            <span aria-hidden="true">·</span>
            <span>٩ أنماط تدريبية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-tight mb-4 [text-wrap:balance]">
            أهلاً بك، {currentStudent?.name}
          </h1>

          <p className="text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed max-w-xl mb-8">
            مساحتك الهادئة للتدريب اليومي على الرموز الصينية والنغمات والاستماع وبناء الجمل، مع
            متابعة فورية لمستوى إتقانك في كل فصل.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('chapters')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-base transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444]"
            >
              <span>ابدأ التدريب</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="inline-flex items-center gap-2 px-5 py-3.5 min-h-[48px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/40 dark:hover:border-[#EF4444]/40 text-[#1C1917] dark:text-[#F5F2EB] font-semibold text-sm transition-colors duration-150"
            >
              <BarChart3 className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
              <span>استعراض الإحصائيات</span>
            </button>
          </div>
        </div>

        {/* اللوحة الفنية الجبلية بالحبر الصيني */}
        <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-[#F2ECE1] dark:bg-[#181614] border-t lg:border-t-0 lg:border-r border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
          {!heroImgError ? (
            <img
              src={HERO_INK_ART}
              alt="لوحة تقليدية صينية لجبال الضباب بالحبر الأسود على ورق الأرز"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
              className="w-full h-full object-cover dark:opacity-85"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <span className="cinnabar-seal font-hanzi w-16 h-16 flex items-center justify-center text-3xl font-bold mb-3">
                中
              </span>
              <p className="font-hanzi text-xl text-[#1C1917] dark:text-[#F5F2EB]">温故而知新</p>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121110]/80 via-[#121110]/35 to-transparent p-6 text-[#F5F2EB]">
            <p className="font-hanzi text-lg mb-0.5">温故而知新</p>
            <p className="text-xs text-[#F5F2EB]/85">
              بمراجعة ما تعلمته تكتسب فهماً جديداً وأعمق.
            </p>
          </div>
        </div>
      </div>

      {/* شريط ملخص أداء الطالب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  {metric.label}
                </span>
                <Icon className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444]" />
              </div>
              <p className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">{metric.sub}</p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
