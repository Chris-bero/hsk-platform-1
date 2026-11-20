import { CheckCircle2, XCircle } from 'lucide-react';
import { DrillQuestion, QuizMode } from '../../types';

interface SentenceTranslationProps {
  question: DrillQuestion;
  mode: QuizMode;
  showPinyin: boolean;
  selectedOptionId?: string;
  isLocked: boolean;
  onSelectOption: (optionId: string, label: string, isCorrect: boolean) => void;
}

export function SentenceTranslationDrill({
  question,
  mode,
  showPinyin,
  selectedOptionId,
  isLocked,
  onSelectOption,
}: SentenceTranslationProps) {
  const showFeedback = mode === 'practice' && isLocked;
  const isHanziPrompt = question.direction !== 'arabic-to-hanzi';

  return (
    <div className="space-y-8">
      <div className="neo-frame rounded-xl py-9 px-6 text-center space-y-3 bg-white dark:bg-[#1E1C1A]">
        <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
          {isHanziPrompt
            ? 'اختر الترجمة العربية الصحيحة للجملة الصينية'
            : 'اختر الجملة الصينية المطابقة للجملة العربية'}
        </p>

        <div
          className={
            isHanziPrompt
              ? 'font-hanzi text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed'
              : 'text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed'
          }
        >
          {question.promptPrimary}
        </div>

        {isHanziPrompt && showPinyin && question.promptPinyin && (
          <p className="font-pinyin text-base text-[#D97706] dark:text-[#F59E0B] font-medium">
            {question.promptPinyin}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {(question.options ?? []).map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrectOption = opt.id === question.correctOptionId;

          let cardClass =
            'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 text-[#1C1917] dark:text-[#F5F2EB]';

          if (showFeedback) {
            if (isCorrectOption) {
              cardClass =
                'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/10 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]';
            } else if (isSelected && !isCorrectOption) {
              cardClass =
                'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]';
            } else {
              cardClass =
                'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F9F6F0]/50 dark:bg-[#181614] opacity-60 text-[#57534E] dark:text-[#A8A29E]';
            }
          } else if (isSelected) {
            cardClass =
              'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/14 text-[#1C1917] dark:text-[#F5F2EB] ring-1 ring-[#B91C1C]/30 dark:ring-[#EF4444]/30';
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={showFeedback}
              onClick={() => onSelectOption(opt.id, opt.label, isCorrectOption)}
              className={`min-h-[68px] px-5 py-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-150 ${cardClass}`}
            >
              <div className="flex flex-col items-start text-right">
                <span
                  className={
                    opt.isHanzi
                      ? 'font-hanzi text-xl sm:text-2xl font-bold leading-relaxed'
                      : 'text-base font-semibold leading-relaxed'
                  }
                >
                  {opt.label}
                </span>
                {opt.isHanzi && showPinyin && opt.subLabel && (
                  <span className="font-pinyin text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">
                    {opt.subLabel}
                  </span>
                )}
              </div>
              {showFeedback && isCorrectOption && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {showFeedback && isSelected && !isCorrectOption && (
                <XCircle className="w-5 h-5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
