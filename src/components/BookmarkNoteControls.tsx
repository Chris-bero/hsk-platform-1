import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Star, StickyNote, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudyBookmarkItemType } from '../types';

interface BookmarkNoteControlsProps {
  itemType: StudyBookmarkItemType;
  itemId: string;
  chapterId: number;
  hanzi: string;
  pinyin: string;
  arabic: string;
  compact?: boolean;
}

export function BookmarkNoteControls({
  itemType,
  itemId,
  chapterId,
  hanzi,
  pinyin,
  arabic,
  compact = false,
}: BookmarkNoteControlsProps) {
  const { isItemBookmarked, getItemNote, toggleBookmark, saveItemNote } = useApp();
  const bookmarked = isItemBookmarked(itemType, itemId);
  const existingNote = getItemNote(itemType, itemId);
  const hasNote = existingNote.trim().length > 0;

  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [draftNote, setDraftNote] = useState(existingNote);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!isNoteOpen) return;
    setDraftNote(existingNote);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNoteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNoteOpen, existingNote]);

  const handleSave = () => {
    saveItemNote(itemType, itemId, chapterId, draftNote);
    setSavedFlash(true);
    window.setTimeout(() => {
      setSavedFlash(false);
      setIsNoteOpen(false);
    }, 350);
  };

  const handleClearNote = () => {
    saveItemNote(itemType, itemId, chapterId, '');
    setDraftNote('');
    setIsNoteOpen(false);
  };

  const btnSize = compact ? 'w-6 h-6 rounded' : 'w-8 h-8 rounded-md';
  const iconSize = compact ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <>
      <span
        className="inline-flex items-center gap-1 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => toggleBookmark(itemType, itemId, chapterId)}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? `إزالة ${hanzi} من محفوظاتي` : `حفظ ${hanzi} في محفوظاتي`}
          title={bookmarked ? 'محفوظ في محفوظاتي (اضغط للإزالة)' : 'إضافة إلى محفوظاتي'}
          className={`inline-flex items-center justify-center ${btnSize} border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] ${
            bookmarked
              ? 'border-[#D97706]/55 dark:border-[#F59E0B]/55 bg-[#D97706]/14 dark:bg-[#F59E0B]/18 text-[#B45309] dark:text-[#F59E0B]'
              : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white/80 dark:bg-[#1E1C1A]/80 text-[#57534E] dark:text-[#A8A29E] hover:text-[#D97706] dark:hover:text-[#F59E0B] hover:border-[#D97706]/40'
          }`}
        >
          <Star className={`${iconSize} ${bookmarked ? 'fill-current' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => setIsNoteOpen(true)}
          aria-label={hasNote ? `تعديل ملاحظة ${hanzi}` : `إضافة ملاحظة شخصية لـ ${hanzi}`}
          title={hasNote ? `ملاحظتك: ${existingNote}` : 'أضف ملاحظة شخصية'}
          className={`inline-flex items-center justify-center ${btnSize} border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${
            hasNote
              ? 'border-[#B91C1C]/45 dark:border-[#EF4444]/45 bg-[#B91C1C]/10 dark:bg-[#EF4444]/16 text-[#B91C1C] dark:text-[#EF4444]'
              : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white/80 dark:bg-[#1E1C1A]/80 text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] hover:border-[#B91C1C]/40'
          }`}
        >
          <StickyNote className={iconSize} />
        </button>
      </span>

      {isNoteOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="ملاحظة دراسية شخصية"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
            onClick={() => setIsNoteOpen(false)}
          >
            <div
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] shadow-xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                    ملاحظة ليلة الامتحان · 第{chapterId}课
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-hanzi text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                      {hanzi}
                    </span>
                    <span className="font-pinyin text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                      {pinyin}
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">{arabic}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNoteOpen(false)}
                  aria-label="إغلاق"
                  className="w-8 h-8 rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 flex items-center justify-center text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`study-note-input-${itemId}`}
                  className="block text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                >
                  ملاحظتك الشخصية (تلميح حفظ، فرق نحوي، أو تنبيه للامتحان):
                </label>
                <textarea
                  id={`study-note-input-${itemId}`}
                  rows={3}
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="مثال: انتبه للنغمة الثالثة، أو لا تخلط بينها وبين..."
                  className="w-full rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] px-3.5 py-2.5 text-sm text-[#1C1917] dark:text-[#F5F2EB] placeholder:text-[#57534E]/70 dark:placeholder:text-[#A8A29E]/70 focus:outline-none focus:border-[#B91C1C] dark:focus:border-[#EF4444] resize-none"
                />
                <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                  تُحفظ الملاحظة تلقائياً في خزنتك الشخصية (محفوظاتي) وتظهر عند طباعة ورقة ليلة
                  الامتحان.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                {hasNote ? (
                  <button
                    type="button"
                    onClick={handleClearNote}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[#B91C1C]/30 dark:border-[#EF4444]/30 text-xs font-bold text-[#B91C1C] dark:text-[#EF4444] hover:bg-[#B91C1C]/8 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح الملاحظة</span>
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteOpen(false)}
                    className="px-4 py-2 min-h-[40px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 px-5 py-2 min-h-[40px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs font-bold transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>{savedFlash ? 'تم الحفظ' : 'حفظ الملاحظة'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
