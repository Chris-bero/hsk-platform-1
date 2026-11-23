import { useState } from 'react';
import { ArrowLeft, BookMarked, FolderClock, Lock, Unlock, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { ChapterData } from '../types';
import { countUnlockedChapters, isChapterUnlocked } from '../utils/accessControl';
import { LockedAccessModal } from './LockedAccessModal';

interface ChaptersGridViewProps {
  onSelectChapter: (chapter: ChapterData) => void;
}

export function ChaptersGridView({ onSelectChapter }: ChaptersGridViewProps) {
  const { analytics, unlockedAccess } = useApp();
  const [emptyChapterModal, setEmptyChapterModal] = useState<ChapterData | null>(null);
  const [lockedChapterModal, setLockedChapterModal] = useState<ChapterData | null>(null);

  const unlockedCount = countUnlockedChapters(unlockedAccess);
  const isFullChapters = unlockedCount >= CHAPTERS_DATA.length;

  const handleCardClick = (chapter: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, chapter.id)) {
      setLockedChapterModal(chapter);
      return;
    }

    const totalItems = chapter.vocab.length + chapter.sentences.length;
    if (totalItems === 0) {
      setEmptyChapterModal(chapter);
      return;
    }
    onSelectChapter(chapter);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8"
    >
      {/* عنوان القسم */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] mb-2">
            <span>المنهج الكامل</span>
            <span aria-hidden="true">·</span>
            <span>١٥ فصلاً</span>
            <span aria-hidden="true">·</span>
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                isFullChapters
                  ? 'text-[#15803D] dark:text-[#22C55E]'
                  : 'text-[#B45309] dark:text-[#F59E0B]'
              }`}
            >
              {isFullChapters ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>جميع الفصول مفتوحة</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>مفتوح {unlockedCount} من ١٥ فصلاً</span>
                </>
              )}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            فصول المستوى الأول
          </h1>
        </div>

        <div className="text-sm text-[#57534E] dark:text-[#A8A29E] tabular-nums">
          الإنجاز الإجمالي:{' '}
          <strong className="text-[#15803D] dark:text-[#22C55E] font-bold">
            {analytics.overallProgressPercent}%
          </strong>
        </div>
      </div>

      {/* شبكة الفصول الخمسة عشر */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHAPTERS_DATA.map((chapter) => {
          const itemCount = chapter.vocab.length + chapter.sentences.length;
          const isEmpty = itemCount === 0;
          const isUnlocked = isChapterUnlocked(unlockedAccess, chapter.id);
          const completion = analytics.getChapterCompletion(chapter.id);

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => handleCardClick(chapter)}
              className={`neo-frame text-right rounded-xl p-6 flex flex-col justify-between transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] ${
                !isUnlocked
                  ? 'opacity-90 bg-[#F4EFE6]/85 dark:bg-[#191715] border-[#1C1917]/12 dark:border-[#F5F2EB]/12 hover:border-[#D97706]/55 dark:hover:border-[#F59E0B]/55'
                  : isEmpty
                    ? 'opacity-85 hover:opacity-100 hover:border-[#1C1917]/25 dark:hover:border-[#F5F2EB]/25'
                    : 'hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-hanzi w-11 h-11 rounded-md flex items-center justify-center text-lg font-bold shrink-0 ${
                        !isUnlocked
                          ? 'border border-[#D97706]/35 dark:border-[#F59E0B]/35 text-[#B45309] dark:text-[#F59E0B] bg-[#D97706]/10 dark:bg-[#F59E0B]/12'
                          : isEmpty
                            ? 'border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-[#57534E] dark:text-[#A8A29E] bg-[#F9F6F0] dark:bg-[#121110]'
                            : 'cinnabar-seal bg-[#B91C1C]/5 dark:bg-[#EF4444]/10'
                      }`}
                    >
                      {chapter.chineseNumeral}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] truncate">
                        {chapter.titleAr}
                      </h2>
                      <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5 truncate">
                        {isEmpty ? 'محتوى هذا الفصل قيد الإضافة' : chapter.subtitleAr}
                      </p>
                    </div>
                  </div>

                  {!isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#B45309] dark:text-[#F59E0B] text-[11px] font-bold shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>مغلق</span>
                    </span>
                  ) : (
                    !isEmpty && (
                      <ArrowLeft className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444] shrink-0 mt-1" />
                    )
                  )}
                </div>

                {/* بيانات العناصر بدون كبسولات */}
                <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums mb-5">
                  {!isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 text-[#B45309] dark:text-[#F59E0B] font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>اضغط لمعرفة طريقة تفعيل هذا الفصل</span>
                    </span>
                  ) : isEmpty ? (
                    <span className="inline-flex items-center gap-1.5">
                      <FolderClock className="w-3.5 h-3.5" />
                      <span>٠ عنصر متاح حالياً</span>
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1">
                        <BookMarked className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                        <span>{chapter.vocab.length} مفردات</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{chapter.sentences.length} جمل</span>
                      <span aria-hidden="true">·</span>
                      <span>{itemCount} عنصر</span>
                    </>
                  )}
                </div>
              </div>

              {/* شريط نسبة الإنجاز */}
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span className="text-[#57534E] dark:text-[#A8A29E]">
                    {isUnlocked ? 'نسبة الإكمال' : 'حالة الوصول'}
                  </span>
                  <span
                    className={`font-bold ${
                      !isUnlocked
                        ? 'text-[#B45309] dark:text-[#F59E0B]'
                        : completion === 100
                          ? 'text-[#15803D] dark:text-[#22C55E]'
                          : 'text-[#1C1917] dark:text-[#F5F2EB]'
                    }`}
                  >
                    {isUnlocked ? `${completion}%` : '🔒 يتطلب التفعيل'}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      !isUnlocked
                        ? 'bg-[#D97706]/40 dark:bg-[#F59E0B]/40'
                        : completion === 100
                          ? 'bg-[#15803D] dark:bg-[#22C55E]'
                          : 'bg-[#B91C1C] dark:bg-[#EF4444]'
                    }`}
                    style={{ width: `${isUnlocked ? completion : 0}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* نافذة طلب التفعيل للفصول المقفلة */}
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

      {/* رسالة الحالة الفارغة النظيفة للفصول التي تحتوي على ٠ عنصر */}
      {emptyChapterModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="empty-chapter-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121110]/60 backdrop-blur-[2px]"
          onClick={() => setEmptyChapterModal(null)}
        >
          <div
            className="neo-frame w-full max-w-md rounded-xl p-7 bg-white dark:bg-[#1E1C1A] text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-hanzi cinnabar-seal w-10 h-10 rounded-md flex items-center justify-center text-base font-bold">
                {emptyChapterModal.chineseNumeral}
              </span>
              <button
                type="button"
                onClick={() => setEmptyChapterModal(null)}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-md inline-flex items-center justify-center text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 py-2">
              <h2
                id="empty-chapter-title"
                className="text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              >
                {emptyChapterModal.titleAr}
              </h2>
              <p className="text-base font-semibold text-[#B91C1C] dark:text-[#EF4444]">
                محتوى هذا الفصل قيد الإضافة
              </p>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                سيتم إتاحة المفردات والجمل التدريبية لهذا الفصل فور إضافتها من قبل المعلم. يمكنك
                مواصلة التدريب في الفصول المتاحة حالياً.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEmptyChapterModal(null)}
              className="w-full py-2.5 px-5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
            >
              العودة إلى قائمة الفصول
            </button>
          </div>
        </div>
      )}
    </motion.section>
  );
}
