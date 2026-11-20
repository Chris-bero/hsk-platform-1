import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Target,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ALL_DRILL_TYPES, CHAPTERS_DATA, DRILL_METADATA } from '../data/chaptersData';
import { formatStudyDurationAr } from '../hooks/useActiveStudyTimer';
import { GOOGLE_SCRIPT_WEB_APP_URL } from '../services/sheetsSync';

export function AnalyticsView() {
  const { currentStudent, progress, analytics, lastSyncResult } = useApp();

  if (!currentStudent || !progress) return null;

  const weakestLabel = analytics.weakestDrillType
    ? DRILL_METADATA[analytics.weakestDrillType].titleAr
    : 'لا توجد بيانات كافية بعد';

  const kpiCards = [
    {
      label: 'إجمالي الأسئلة المحلولة',
      value: String(progress.totalSolved),
      icon: HelpCircle,
      tone: 'text-[#1C1917] dark:text-[#F5F2EB]',
    },
    {
      label: 'الإجابات الصحيحة',
      value: String(progress.correctCount),
      icon: CheckCircle2,
      tone: 'text-[#15803D] dark:text-[#22C55E]',
    },
    {
      label: 'الإجابات الخاطئة',
      value: String(progress.wrongCount),
      icon: XCircle,
      tone: 'text-[#B91C1C] dark:text-[#EF4444]',
    },
    {
      label: 'نسبة الدقة',
      value: `${analytics.accuracyPercent}%`,
      icon: Target,
      tone: 'text-[#D97706] dark:text-[#F59E0B]',
    },
    {
      label: 'وقت الدراسة النشط',
      value: formatStudyDurationAr(progress.activeSeconds),
      icon: Clock,
      tone: 'text-[#1C1917] dark:text-[#F5F2EB]',
    },
    {
      label: 'التقدم في ١٥ فصلاً',
      value: `${analytics.overallProgressPercent}%`,
      icon: BookOpen,
      tone: 'text-[#15803D] dark:text-[#22C55E]',
    },
    {
      label: 'سلسلة أيام الدراسة',
      value: `${analytics.streakDays} ${analytics.streakDays === 1 ? 'يوم' : 'أيام'}`,
      icon: Flame,
      tone: 'text-[#D97706] dark:text-[#F59E0B]',
    },
    {
      label: 'أضعف نمط تدريبي',
      value: weakestLabel,
      icon: AlertTriangle,
      tone: 'text-[#B91C1C] dark:text-[#EF4444]',
      smallText: true,
    },
  ];

  const isRemoteConfigured = Boolean(GOOGLE_SCRIPT_WEB_APP_URL.trim());

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-10"
    >
      {/* ترويسة ملف الطالب */}
      <div className="neo-frame rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="cinnabar-seal w-14 h-14 rounded-lg flex items-center justify-center bg-[#B91C1C]/5 dark:bg-[#EF4444]/10 shrink-0">
            <Award className="w-7 h-7 text-[#B91C1C] dark:text-[#EF4444]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] mb-1">
              <span>صفحتي والإحصائيات</span>
              <span aria-hidden="true">·</span>
              <span>المستوى الأول</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {currentStudent.name}
            </h1>
          </div>
        </div>

        <div className="text-xs text-[#57534E] dark:text-[#A8A29E] sm:text-left space-y-1">
          <p>
            حالة حفظ البيانات:{' '}
            <strong className="text-[#15803D] dark:text-[#22C55E]">
              {isRemoteConfigured
                ? lastSyncResult?.syncedRemotely
                  ? 'تمت المزامنة مع سجل المعلم'
                  : 'مرتبط بسجل المعلم (تلقائي عند إنهاء كل اختبار)'
                : 'محفوظ محلياً على هذا الجهاز'}
            </strong>
          </p>
          <p className="tabular-nums">
            آخر نشاط:{' '}
            {new Date(progress.lastActive).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* شبكة مؤشرات الأداء الثمانية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 shrink-0 ${kpi.tone}`} />
              </div>
              <p
                className={`font-bold tabular-nums leading-snug ${kpi.tone} ${
                  kpi.smallText ? 'text-base' : 'text-2xl'
                }`}
              >
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* تفصيل الأداء حسب كل فصل (١ إلى ١٥) */}
      <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            تفصيل التقدم والدقة لكل فصل
          </h2>
          <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">
            جميع الفصول من الأول إلى الخامس عشر
          </span>
        </div>

        <div className="divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
          {CHAPTERS_DATA.map((chapter) => {
            const st = progress.chapterStats[chapter.id];
            const completion = analytics.getChapterCompletion(chapter.id);
            const accuracy = analytics.getChapterAccuracy(chapter.id);
            const isEmpty = chapter.vocab.length === 0 && chapter.sentences.length === 0;

            return (
              <div
                key={chapter.id}
                className="py-4 grid grid-cols-1 md:grid-cols-12 items-center gap-4"
              >
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="font-hanzi w-9 h-9 rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] flex items-center justify-center text-sm font-bold shrink-0">
                    {chapter.chineseNumeral}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB] truncate">
                      {chapter.titleAr}
                    </p>
                    <p className="text-xs text-[#57534E] dark:text-[#A8A29E] truncate">
                      {isEmpty ? 'محتوى هذا الفصل قيد الإضافة' : chapter.subtitleAr}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span className="text-[#57534E] dark:text-[#A8A29E]">نسبة الإكمال</span>
                    <span className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                      {completion}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        completion === 100
                          ? 'bg-[#15803D] dark:bg-[#22C55E]'
                          : 'bg-[#B91C1C] dark:bg-[#EF4444]'
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex items-center md:justify-end gap-4 text-xs tabular-nums">
                  <span className="text-[#57534E] dark:text-[#A8A29E]">
                    المحلول: <strong className="text-[#1C1917] dark:text-[#F5F2EB]">{st?.solved ?? 0}</strong>
                  </span>
                  <span aria-hidden="true" className="text-[#1C1917]/20 dark:text-[#F5F2EB]/20">
                    /
                  </span>
                  <span className="text-[#57534E] dark:text-[#A8A29E]">
                    الدقة:{' '}
                    <strong
                      className={
                        st && st.solved > 0
                          ? accuracy >= 75
                            ? 'text-[#15803D] dark:text-[#22C55E]'
                            : 'text-[#D97706] dark:text-[#F59E0B]'
                          : 'text-[#57534E] dark:text-[#A8A29E]'
                      }
                    >
                      {st && st.solved > 0 ? `${accuracy}%` : '—'}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* تفصيل الأداء حسب الأنماط التدريبية التسعة */}
      <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 sm:p-8 space-y-5">
        <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB] border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
          الدقة حسب نوع التمرين
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_DRILL_TYPES.map((dt) => {
            const stat = progress.drillStats[dt] ?? { attempted: 0, correct: 0 };
            const rate =
              stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : null;
            const isWeakest = analytics.weakestDrillType === dt;

            return (
              <div
                key={dt}
                className={`rounded-lg border p-4 space-y-2 ${
                  isWeakest
                    ? 'border-[#B91C1C]/35 dark:border-[#EF4444]/40 bg-[#B91C1C]/5 dark:bg-[#EF4444]/8'
                    : 'border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0]/60 dark:bg-[#121110]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    {DRILL_METADATA[dt].titleAr}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
                    {rate === null ? '—' : `${rate}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                  <span>
                    {stat.correct} صحيح من أصل {stat.attempted}
                  </span>
                  {isWeakest && (
                    <span className="font-semibold text-[#B91C1C] dark:text-[#EF4444]">
                      يحتاج مراجعة
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
