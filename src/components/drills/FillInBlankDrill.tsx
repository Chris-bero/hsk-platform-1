import { CheckCircle2, XCircle } from 'lucide-react';
import { DrillQuestion, QuizMode } from '../../types';
import { SpeakChineseButton } from './SpeakChineseButton';

interface FillInBlankProps {
  question: DrillQuestion;
  mode: QuizMode;
  showPinyin: boolean;
  selectedOptionId?: string;
  isLocked: boolean;
  onSelectOption: (optionId: string, label: string, isCorrect: boolean) => void;
}

export function FillInBlankDrill({
  question,
  mode,
  showPinyin,
  selectedOptionId,
  isLocked,
  onSelectOption,
}: FillInBlankProps) {
  const showFeedback = mode === 'practice' && isLocked;
  const selectedOpt = (question.options ?? []).find((o) => o.id === selectedOptionId);
  const selectedLabel = selectedOpt?.label;
  const isCorrectSelected = selectedOptionId === question.correctOptionId;

  const targetBlank = question.targetBlank ?? question.correctDisplay;
  const blankTemplate = question.sentenceWithBlank ?? '';
  const parts = blankTemplate.split('____');
  const hasSplit = parts.length >= 2;

  return (
    <div className="space-y-6">
      {/* بطاقة الجملة: بدون ترجمة عربية قبل الإجابة للاعتماد على السياق والنحو الصيني */}
      <div className="neo-frame rounded-xl py-9 px-6 text-center space-y-4 bg-white dark:bg-[#1E1C1A]">
        <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
          اختر الكلمة الصينية المناسبة لإكمال الفراغ في الجملة
        </p>

        {/* معاينة الجملة مع تمييز الإجابة الصحيحة بالأخضر وشطب الإجابة الخاطئة بالأحمر عند التصحيح */}
        <div
          dir="ltr"
          className="font-hanzi text-2xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed flex flex-wrap items-center justify-center gap-1"
        >
          {showFeedback && hasSplit ? (
            <>
              <span>{parts[0]}</span>
              <span className="inline-flex items-center gap-1.5 mx-1">
                {!isCorrectSelected && selectedLabel && (
                  <span className="line-through decoration-2 text-[#B91C1C] dark:text-[#EF4444] bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 px-2 py-0.5 rounded-md">
                    {selectedLabel}
                  </span>
                )}
                <span className="text-[#15803D] dark:text-[#22C55E] bg-[#15803D]/12 dark:bg-[#22C55E]/18 px-2.5 py-0.5 rounded-md border border-[#15803D]/30 dark:border-[#22C55E]/35">
                  {targetBlank}
                </span>
              </span>
              <span>{parts.slice(1).join('____')}</span>
            </>
          ) : hasSplit ? (
            <>
              <span>{parts[0]}</span>
              <span className="mx-1 px-2.5 py-0.5 rounded-md border-b-2 border-[#B91C1C] dark:border-[#EF4444] text-[#B91C1C] dark:text-[#EF4444]">
                {selectedLabel ?? '____'}
              </span>
              <span>{parts.slice(1).join('____')}</span>
            </>
          ) : (
            <span>{selectedLabel ? blankTemplate.replace('____', selectedLabel) : blankTemplate}</span>
          )}
        </div>
      </div>

      {/* ٤ خيارات صينية فقط من [targetBlank, ...blankDistractors] */}
      <div className="grid grid-cols-2 gap-3.5">
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
              className={`min-h-[78px] px-5 py-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-150 ${cardClass}`}
            >
              <div className="flex flex-col items-start">
                <span className="font-hanzi text-2xl sm:text-3xl font-bold">{opt.label}</span>
                {showPinyin && opt.subLabel && (
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

      {/* صندوق التغذية الراجعة: يكشف الجملة الصينية الكاملة والبينين والترجمة العربية بعد الإجابة فقط */}
      {showFeedback && (
        <div
          className={`rounded-xl border p-5 flex items-start gap-3.5 ${
            isCorrectSelected
              ? 'border-[#15803D]/35 dark:border-[#22C55E]/40 bg-[#15803D]/10 dark:bg-[#22C55E]/12'
              : 'border-[#B91C1C]/35 dark:border-[#EF4444]/40 bg-[#B91C1C]/10 dark:bg-[#EF4444]/12'
          }`}
        >
          {isCorrectSelected ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#15803D] dark:text-[#22C55E]" />
          ) : (
            <XCircle className="w-5 h-5 mt-0.5 shrink-0 text-[#B91C1C] dark:text-[#EF4444]" />
          )}

          <div className="flex-1 space-y-2 text-sm">
            <p
              className={`font-bold ${
                isCorrectSelected
                  ? 'text-[#15803D] dark:text-[#22C55E]'
                  : 'text-[#B91C1C] dark:text-[#EF4444]'
              }`}
            >
              {isCorrectSelected
                ? 'إجابة صحيحة! أحسنت.'
                : `إجابة غير صحيحة — الكلمة الصحيحة هي: ${targetBlank}`}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="space-y-1">
                {question.sentenceFullHanzi && (
                  <p
                    dir="ltr"
                    className="font-hanzi text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB] text-right"
                  >
                    {question.sentenceFullHanzi}
                  </p>
                )}

                {showPinyin && question.sentenceFullPinyin && (
                  <p className="font-pinyin text-sm text-[#D97706] dark:text-[#F59E0B]">
                    {question.sentenceFullPinyin}
                  </p>
                )}

                <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
                  المعنى:{' '}
                  <strong className="text-[#1C1917] dark:text-[#F5F2EB]">
                    {question.promptPrimary}
                  </strong>
                </p>
              </div>

              {question.sentenceFullHanzi && (
                <SpeakChineseButton text={question.sentenceFullHanzi} compact />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
