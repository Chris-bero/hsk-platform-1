import { useState } from 'react';
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Target,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatStudyDurationAr } from '../hooks/useActiveStudyTimer';
import { AppView } from '../types';

const HERO_INK_ART = '/src/assets/images/neo_chinese_hero_ink_1795181947264.jpg';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  onStartMistakeReview: () => void;
}

export function HomeView({ onNavigate, onStartMistakeReview }: HomeViewProps) {
  const { currentStudent, progress, analytics, vaultCount } = useApp();
  const [heroImgError, setHeroImgError] = useState(false);

  const mistakesCount = progress?.mistakes?.length ?? 0;

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
            <span>١٠ أنماط تدريبية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-tight mb-4 [text-wrap:balance]">
            أهلاً بك، {currentStudent?.name}
          </h1>

          <p className="text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed max-w-xl mb-8">
            مساحتك الهادئة للتدريب اليومي على الرموز الصينية والنغمات والاستماع وبناء الجمل، مع
            متابعة فورية لمستوى إتقانك في كل فصل.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
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

      {/* بطاقة بوابة الامتحانات الدولية HSK 3.0 */}
      <button
        type="button"
        onClick={() => onNavigate('hsk-portal')}
        className="w-full text-right neo-frame rounded-xl p-6 sm:p-7 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/50 dark:hover:border-[#EF4444]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C]"
      >
        <div className="flex items-start gap-4">
          <span className="cinnabar-seal w-13 h-13 rounded-lg bg-[#B91C1C]/6 dark:bg-[#EF4444]/12 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-[#B91C1C] dark:text-[#EF4444]" />
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#D97706] dark:text-[#F59E0B]">
              <span>٧ أنماط HSK 3.0 معتمدة</span>
              <span aria-hidden="true">·</span>
              <span>نماذج موحّدة (٤٠ سؤالاً · ٢٠٠ درجة)</span>
              <span aria-hidden="true">·</span>
              <span>Ruby Pinyin</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              بوابة الامتحانات الدولية HSK 3.0
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              تدرّب على الأنماط الدولية السبعة دون مؤقت، وخُض الامتحانات التجريبية الموحّدة
              بنسختيها الدولية الخالصة والتطبيقية العربية مع مراجعة كاملة لنصوص الاستماع.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg bg-[#B91C1C] dark:bg-[#EF4444] text-white text-sm font-bold shrink-0 self-start sm:self-center">
          <span>دخول البوابة</span>
          <ArrowLeft className="w-4 h-4" />
        </span>
      </button>

      {/* بطاقات الأدوات السريعة: تدريب مخصص + مراجعة أخطائي + محفوظاتي وملاحظاتي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('custom-builder')}
          className="text-right rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 p-6 flex items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C]"
        >
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-lg border border-[#D97706]/30 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/12 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B]" />
            </span>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                تدريب واختبار مخصص
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                ادمج فصلاً أو عدة فصول مع مهارة محددة أو جميع المهارات العشر وعدد الأسئلة الذي تريده.
              </p>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444] shrink-0" />
        </button>

        <button
          type="button"
          disabled={mistakesCount === 0}
          onClick={onStartMistakeReview}
          className={`text-right rounded-xl border p-6 flex items-center justify-between gap-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${
            mistakesCount > 0
              ? 'border-[#B91C1C]/30 dark:border-[#EF4444]/35 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C] dark:hover:border-[#EF4444] hover:-translate-y-0.5'
              : 'border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white/75 dark:bg-[#1E1C1A]/75 opacity-80 cursor-default'
          }`}
        >
          <div className="flex items-start gap-4">
            <span
              className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${
                mistakesCount > 0
                  ? 'border-[#B91C1C]/30 dark:border-[#EF4444]/35 bg-[#B91C1C]/10 dark:bg-[#EF4444]/15'
                  : 'border-[#15803D]/25 dark:border-[#22C55E]/30 bg-[#15803D]/10 dark:bg-[#22C55E]/12'
              }`}
            >
              {mistakesCount > 0 ? (
                <RotateCcw className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#15803D] dark:text-[#22C55E]" />
              )}
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  مراجعة أخطائي
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${
                    mistakesCount > 0
                      ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'bg-[#15803D]/12 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]'
                  }`}
                >
                  {mistakesCount}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                {mistakesCount > 0
                  ? 'تدرّب مجدداً على الأسئلة التي أخطأت فيها فقط، وتُحذف تلقائياً فور إتقانها.'
                  : 'سجلك خالٍ من الأخطاء حالياً — واصل التميز!'}
              </p>
            </div>
          </div>

          {mistakesCount > 0 && (
            <ArrowLeft className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444] shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('vault')}
          className="text-right rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#D97706]/55 dark:hover:border-[#F59E0B]/55 p-6 flex items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
        >
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-lg border border-[#D97706]/30 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/12 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B] fill-current" />
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  محفوظاتي وملاحظاتي
                </h2>
                <span className="text-xs font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                  ({vaultCount})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                خزنة ليلة الامتحان لكلماتك وجملك المميّزة وملاحظاتك الشخصية مع مراجعة سريعة وطباعة
                PDF.
              </p>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
        </button>
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
