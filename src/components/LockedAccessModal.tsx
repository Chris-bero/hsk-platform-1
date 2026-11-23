import { useEffect, useState } from 'react';
import { Check, Copy, Lock, RefreshCw, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LockedAccessModalProps {
  isOpen: boolean;
  itemTitle: string;
  itemType: 'chapter' | 'mock-exam' | 'pattern-drill';
  onClose: () => void;
}

export function LockedAccessModal({
  isOpen,
  itemTitle,
  itemType,
  onClose,
}: LockedAccessModalProps) {
  const { currentStudent, refreshStudentAccess } = useApp();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentStudent) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentStudent.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // تجاهل أخطاء الحافظة
    }
  };

  const handleRefreshAccess = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshMsg('');
    try {
      const updated = await refreshStudentAccess();
      if (updated) {
        setRefreshMsg('تم تحديث حالة الصلاحيات من جدول المعلم.');
      } else {
        setRefreshMsg('تعذر الاتصال بجدول المعلم حالياً. جرّب إعادة تحميل الصفحة بعد قليل.');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="locked-access-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121110]/65 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="neo-frame w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl p-6 sm:p-7 bg-white dark:bg-[#1E1C1A] space-y-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-lg border border-[#D97706]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#B45309] dark:text-[#F59E0B]" />
            </span>
            <div className="text-right">
              <p className="text-[11px] font-bold text-[#B45309] dark:text-[#F59E0B]">
                {itemType === 'chapter'
                  ? 'محتوى يتطلب تفعيل الصلاحية'
                  : itemType === 'pattern-drill'
                    ? 'تدريبات الأنماط الدولية HSK 3.0'
                    : 'الامتحانات الشاملة الموحّدة'}
              </p>
              <h2
                id="locked-access-title"
                className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              >
                {itemTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-md inline-flex items-center justify-center text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
          هذا المحتوى غير مفعّل في حسابك التجريبي حالياً. يرجى إرسال كود الطالب الخاص بك إلى
          المعلم (<strong className="text-[#1C1917] dark:text-[#F5F2EB]">Laohu</strong>) لتفعيل
          الصلاحية الكاملة وفتح جميع الفصول والامتحانات الشاملة.
        </p>

        {/* بطاقة بيانات الطالب لإرسالها للمعلم */}
        <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[#57534E] dark:text-[#A8A29E]">اسم الطالب</span>
            <strong className="text-sm text-[#1C1917] dark:text-[#F5F2EB]">
              {currentStudent.name}
            </strong>
          </div>

          <div className="h-px bg-[#1C1917]/8 dark:bg-[#F5F2EB]/8" />

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="block text-xs text-[#57534E] dark:text-[#A8A29E]">
                كود الطالب (Student Code)
              </span>
              <strong
                dir="ltr"
                className="inline-block text-lg font-bold tracking-wider text-[#B91C1C] dark:text-[#EF4444] tabular-nums mt-0.5"
              >
                {currentStudent.code}
              </strong>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803D] dark:text-[#22C55E]" />
                  <span className="text-[#15803D] dark:text-[#22C55E]">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
        </div>

        {refreshMsg && (
          <p className="text-xs font-semibold text-center text-[#15803D] dark:text-[#22C55E]">
            {refreshMsg}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleRefreshAccess}
            disabled={isRefreshing}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45 disabled:opacity-60 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'جارٍ التحقق...' : 'تحديث الصلاحيات'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
}
