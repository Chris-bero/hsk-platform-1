import { useEffect, useState } from 'react';
import { Gauge, Volume2 } from 'lucide-react';
import { initChineseVoices, isSpeechSupported, speakChinese } from '../../utils/speech';

interface SpeakChineseButtonProps {
  text: string;
  showSlow?: boolean;
  compact?: boolean;
}

export function SpeakChineseButton({
  text,
  showSlow = true,
  compact = false,
}: SpeakChineseButtonProps) {
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow' | null>(null);
  const supported = isSpeechSupported();

  useEffect(() => {
    if (!supported) return;
    return initChineseVoices();
  }, [supported]);

  if (!supported || !text.trim()) {
    return null;
  }

  const handleSpeak = (rate: number, key: 'normal' | 'slow') => {
    setActiveSpeed(key);
    speakChinese(text, rate);
    window.setTimeout(() => setActiveSpeed(null), 850);
  };

  return (
    <div className="inline-flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSpeak(1.0, 'normal');
        }}
        title="استماع للنطق الصيني بالسرعة العادية"
        aria-label="استماع للنطق الصيني"
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] ${
          compact ? 'px-2.5 py-1.5 min-h-[34px] text-xs' : 'px-3.5 py-2 min-h-[40px] text-xs'
        } font-semibold ${
          activeSpeed === 'normal'
            ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444]'
            : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45'
        }`}
      >
        <Volume2 className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444] shrink-0" />
        {!compact && <span>استماع</span>}
      </button>

      {showSlow && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSpeak(0.7, 'slow');
          }}
          title="استماع للنطق الصيني بسرعة بطيئة (٠٫٧×)"
          aria-label="استماع بطيء للنطق الصيني"
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] dark:focus-visible:ring-[#F59E0B] ${
            compact ? 'px-2.5 py-1.5 min-h-[34px] text-xs' : 'px-3 py-2 min-h-[40px] text-xs'
          } font-semibold ${
            activeSpeed === 'slow'
              ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706]/15 dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#F59E0B]'
              : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/50 hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
          }`}
        >
          <Gauge className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
          <span>بطيء</span>
        </button>
      )}
    </div>
  );
}
