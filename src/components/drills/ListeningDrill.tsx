import { useEffect, useState } from 'react';
import { CheckCircle2, Gauge, Volume2, XCircle } from 'lucide-react';
import { DrillQuestion, QuizMode } from '../../types';
import {
  initChineseVoices,
  isSpeechSupported,
  speakChinese,
  stopChineseSpeech,
} from '../../utils/speech';

interface ListeningDrillProps {
  question: DrillQuestion;
  mode: QuizMode;
  showPinyin: boolean;
  selectedOptionId?: string;
  isLocked: boolean;
  onSelectOption: (optionId: string, label: string, isCorrect: boolean) => void;
}

export function ListeningDrill({
  question,
  mode,
  showPinyin,
  selectedOptionId,
  isLocked,
  onSelectOption,
}: ListeningDrillProps) {
  const showFeedback = mode === 'practice' && isLocked;
  const [speechError, setSpeechError] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow' | null>(null);
  const supported = isSpeechSupported();

  useEffect(() => {
    return initChineseVoices();
  }, []);

  useEffect(() => {
    setSpeechError(false);
    setActiveSpeed(null);
    return () => {
      stopChineseSpeech();
    };
  }, [question.id]);

  const handlePlay = (rate: number, speedKey: 'normal' | 'slow') => {
    if (!question.audioText) return;
    setActiveSpeed(speedKey);
    const ok = speakChinese(question.audioText, rate);
    if (!ok) {
      setSpeechError(true);
    }
    window.setTimeout(() => setActiveSpeed(null), 900);
  };

  return (
    <div className="space-y-8">
      {/* لوحة الاستماع عبر النطق الصوتي المدمج في المتصفح */}
      <div className="neo-frame rounded-xl py-10 px-6 text-center space-y-5 bg-white dark:bg-[#1E1C1A]">
        <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
          اضغط للاستماع إلى النطق الصيني ثم اختر الرمز الصحيح
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            disabled={!supported}
            onClick={() => handlePlay(1.0, 'normal')}
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-lg font-bold text-sm transition-colors ${
              activeSpeed === 'normal'
                ? 'bg-[#991B1B] dark:bg-[#DC2626] text-white'
                : 'bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white'
            } disabled:opacity-50`}
          >
            <Volume2 className="w-5 h-5" />
            <span>استماع عادي</span>
          </button>

          <button
            type="button"
            disabled={!supported}
            onClick={() => handlePlay(0.7, 'slow')}
            className={`inline-flex items-center gap-2.5 px-5 py-3.5 min-h-[48px] rounded-lg border font-bold text-sm transition-colors ${
              activeSpeed === 'slow'
                ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706]/15 dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#D97706]/60 text-[#1C1917] dark:text-[#F5F2EB]'
            } disabled:opacity-50`}
          >
            <Gauge className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
            <span>نطق بطيء (٠٫٧×)</span>
          </button>
        </div>

        {(!supported || speechError) && (
          <p className="text-xs text-[#B91C1C] dark:text-[#EF4444]">
            متصفحك الحالي لا يدعم النطق الصوتي الصيني بشكل مباشر.
          </p>
        )}

        {showFeedback && question.meaningDisplay && (
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
            المعنى: <strong className="text-[#1C1917] dark:text-[#F5F2EB]">{question.meaningDisplay}</strong>
          </p>
        )}
      </div>

      {/* خيارات الرموز الصينية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              className={`min-h-[82px] px-5 py-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-150 ${cardClass}`}
            >
              <div className="flex flex-col items-start">
                <span className="font-hanzi text-3xl font-bold">{opt.label}</span>
                {showPinyin && opt.subLabel && (
                  <span className="font-pinyin text-sm text-[#57534E] dark:text-[#A8A29E] mt-1">
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
