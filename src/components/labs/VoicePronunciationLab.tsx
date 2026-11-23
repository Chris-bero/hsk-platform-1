import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  MessageSquareText,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { ChapterData } from '../../types';
import { isChapterUnlocked } from '../../utils/accessControl';
import { speakChinese, stopChineseSpeech } from '../../utils/speech';
import { RubyChinese } from '../RubyChinese';

interface VoicePronunciationLabProps {
  initialChapterId?: number;
  onSelectLockedChapter: (chapter: ChapterData) => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface SpeakingTargetItem {
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
}

interface CharMatchResult {
  char: string;
  isPunctuation: boolean;
  matched: boolean;
}

interface PronunciationEvaluation {
  heardTranscript: string;
  matchPercent: number;
  charResults: CharMatchResult[];
}

const PUNCTUATION_REGEX = /[\s，。？！、；：“”‘’（）()《》【】,.?!;:—\-·～~]/g;

function normalizeChineseForCompare(text: string): string {
  return text.replace(PUNCTUATION_REGEX, '').trim();
}

/**
 * محاذاة دقيقة بالـ LCS لمقارنة النص الصيني المنطوق بالهدف
 * مع تمييز كل رمز: مطابق (أخضر) أو مفقود/مختلف (أحمر/كهرماني).
 */
function evaluatePronunciation(
  targetHanzi: string,
  candidates: string[]
): PronunciationEvaluation {
  const targetCleanChars = Array.from(normalizeChineseForCompare(targetHanzi));

  const scoreCandidate = (heardRaw: string) => {
    const heardCleanChars = Array.from(normalizeChineseForCompare(heardRaw));
    const n = targetCleanChars.length;
    const m = heardCleanChars.length;

    // جدول أطول تسلسل مشترك (LCS)
    const dp: number[][] = Array.from({ length: n + 1 }, () =>
      Array<number>(m + 1).fill(0)
    );
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        if (targetCleanChars[i] === heardCleanChars[j]) {
          dp[i][j] = 1 + dp[i + 1][j + 1];
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    const matchedIndices = new Set<number>();
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (targetCleanChars[i] === heardCleanChars[j]) {
        matchedIndices.add(i);
        i += 1;
        j += 1;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        i += 1;
      } else {
        j += 1;
      }
    }

    const matchPercent = n === 0 ? 100 : Math.round((matchedIndices.size / n) * 100);

    let cleanCursor = 0;
    const charResults: CharMatchResult[] = Array.from(targetHanzi).map((ch) => {
      if (normalizeChineseForCompare(ch).length === 0) {
        return { char: ch, isPunctuation: true, matched: true };
      }
      const isMatched = matchedIndices.has(cleanCursor);
      cleanCursor += 1;
      return { char: ch, isPunctuation: false, matched: isMatched };
    });

    return {
      heardTranscript: heardRaw.trim(),
      matchPercent,
      charResults,
    };
  };

  let best = scoreCandidate(candidates[0] ?? '');
  for (let idx = 1; idx < candidates.length; idx++) {
    const next = scoreCandidate(candidates[idx]);
    if (next.matchPercent > best.matchPercent) {
      best = next;
    }
  }
  return best;
}

export function VoicePronunciationLab({
  initialChapterId,
  onSelectLockedChapter,
}: VoicePronunciationLabProps) {
  const { unlockedAccess, showPinyin, togglePinyin } = useApp();

  const unlockedChapters = useMemo(
    () => CHAPTERS_DATA.filter((ch) => isChapterUnlocked(unlockedAccess, ch.id)),
    [unlockedAccess]
  );

  const defaultChapterId = useMemo(() => {
    if (
      initialChapterId &&
      unlockedChapters.some((ch) => ch.id === initialChapterId)
    ) {
      return initialChapterId;
    }
    return unlockedChapters[0]?.id ?? 1;
  }, [initialChapterId, unlockedChapters]);

  const [selectedChapterId, setSelectedChapterId] = useState<number>(defaultChapterId);
  const [practiceType, setPracticeType] = useState<'vocab' | 'sentences'>('vocab');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [speakingRate, setSpeakingRate] = useState<1.0 | 0.7 | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const speechApiSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const w = window as WindowWithSpeechRecognition;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    if (
      initialChapterId &&
      unlockedChapters.some((ch) => ch.id === initialChapterId)
    ) {
      setSelectedChapterId(initialChapterId);
      setActiveIndex(0);
      setEvaluation(null);
    }
  }, [initialChapterId, unlockedChapters]);

  const activeChapter = useMemo(
    () =>
      unlockedChapters.find((ch) => ch.id === selectedChapterId) ??
      unlockedChapters[0] ??
      CHAPTERS_DATA[0],
    [selectedChapterId, unlockedChapters]
  );

  const items = useMemo<SpeakingTargetItem[]>(() => {
    if (practiceType === 'vocab') {
      return activeChapter.vocab.map((v) => ({
        id: v.id,
        hanzi: v.hanzi,
        pinyin: v.pinyin,
        arabic: v.arabic,
      }));
    }
    return activeChapter.sentences.map((s) => ({
      id: s.id,
      hanzi: s.hanzi,
      pinyin: s.pinyin,
      arabic: s.arabic,
    }));
  }, [activeChapter, practiceType]);

  const safeIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
  const currentItem = items[safeIndex] ?? null;

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      stopRecognition();
      stopChineseSpeech();
    };
  }, []);

  const handleSelectChapter = (ch: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, ch.id)) {
      onSelectLockedChapter(ch);
      return;
    }
    stopRecognition();
    setSelectedChapterId(ch.id);
    setActiveIndex(0);
    setEvaluation(null);
    setInterimText('');
    setMicError(null);
  };

  const handleChangeType = (type: 'vocab' | 'sentences') => {
    stopRecognition();
    setPracticeType(type);
    setActiveIndex(0);
    setEvaluation(null);
    setInterimText('');
    setMicError(null);
  };

  const handleSelectIndex = (idx: number) => {
    stopRecognition();
    setActiveIndex(idx);
    setEvaluation(null);
    setInterimText('');
    setMicError(null);
  };

  const handlePlayTarget = (rate: 1.0 | 0.7) => {
    if (!currentItem) return;
    stopRecognition();
    if (speakingRate === rate) {
      stopChineseSpeech();
      setSpeakingRate(null);
      return;
    }
    setSpeakingRate(rate);
    const ok = speakChinese(currentItem.hanzi, rate, {
      onEnd: () => setSpeakingRate(null),
      onError: () => setSpeakingRate(null),
    });
    if (!ok) setSpeakingRate(null);
  };

  const handleToggleMic = () => {
    if (!currentItem) return;

    if (isListening) {
      stopRecognition();
      return;
    }

    const w = window as WindowWithSpeechRecognition;
    const SpeechRecCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecCtor) {
      setMicError('متصفحك الحالي لا يدعم التعرّف الصوتي التلقائي. يُنصح باستخدام Google Chrome أو Microsoft Edge.');
      return;
    }

    stopChineseSpeech();
    setSpeakingRate(null);
    setMicError(null);
    setInterimText('');
    setEvaluation(null);

    try {
      const recognition = new SpeechRecCtor();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const latest = event.results[event.results.length - 1];
        if (!latest) return;

        const candidates: string[] = [];
        for (let i = 0; i < latest.length; i++) {
          const alt = latest[i];
          if (alt?.transcript) {
            candidates.push(alt.transcript);
          }
        }

        if (latest.isFinal) {
          setInterimText('');
          if (candidates.length > 0) {
            setEvaluation(evaluatePronunciation(currentItem.hanzi, candidates));
          }
        } else if (candidates[0]) {
          setInterimText(candidates[0]);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicError(
            'لم يتم السماح بالوصول إلى المايكروفون. يرجى تفعيل إذن المايكروفون من إعدادات المتصفح ثم المحاولة مجدداً.'
          );
        } else if (event.error === 'no-speech') {
          setMicError('لم نسمع صوتاً واضحاً — اضغط «ابدأ التحدث» وتحدث بالقرب من المايكروفون.');
        } else if (event.error === 'network') {
          setMicError('تعذّر الاتصال بخدمة التعرّف الصوتي في المتصفح. تحقق من اتصال الإنترنت.');
        } else if (event.error !== 'aborted') {
          setMicError('حدث خطأ أثناء التقاط الصوت. يرجى المحاولة مرة أخرى.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setMicError('تعذّر تشغيل المايكروفون. تأكد من عدم استخدامه في تطبيق آخر ثم حاول مجدداً.');
    }
  };

  return (
    <div className="space-y-6">
      {/* تنبيه لطيف في حال عدم دعم المتصفح لـ SpeechRecognition */}
      {!speechApiSupported && (
        <div className="rounded-xl border border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#B45309] dark:text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-[#78350F] dark:text-[#FDE68A]">
            <p className="font-bold">
              متصفحك الحالي لا يدعم ميزة التعرّف الصوتي المباشر (Web Speech API)
            </p>
            <p className="leading-relaxed">
              للاستفادة من مدرّب النطق الصوتي بالمايكروفون، يُرجى فتح البوابة عبر متصفح{' '}
              <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong>. لا يزال بإمكانك
              الاستماع إلى النطق الصيني الصحيح بسرعتين (1.0x و0.7x) أدناه.
            </p>
          </div>
        </div>
      )}

      {/* شريط اختيار الفصل + التبديل بين المفردات والجمل */}
      <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            role="radiogroup"
            aria-label="نوع التدريب الصوتي"
            className="inline-flex flex-wrap max-w-full p-1 rounded-lg border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F2ECE1] dark:bg-[#141312] gap-1 self-start"
          >
            <button
              type="button"
              role="radio"
              aria-checked={practiceType === 'vocab'}
              onClick={() => handleChangeType('vocab')}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-bold transition-colors ${
                practiceType === 'vocab'
                  ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>مفردات الفصل ({activeChapter.vocab.length})</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={practiceType === 'sentences'}
              onClick={() => handleChangeType('sentences')}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-bold transition-colors ${
                practiceType === 'sentences'
                  ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              <MessageSquareText className="w-4 h-4 shrink-0" />
              <span>جمل ومحادثات ({activeChapter.sentences.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={togglePinyin}
            aria-pressed={showPinyin}
            className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border text-xs font-bold transition-colors self-start sm:self-auto ${
              showPinyin
                ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#57534E] dark:text-[#A8A29E]'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPinyin ? 'إخفاء البينين' : 'إظهار البينين'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CHAPTERS_DATA.map((ch) => {
            const unlocked = isChapterUnlocked(unlockedAccess, ch.id);
            const isActive = activeChapter.id === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => handleSelectChapter(ch)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap tabular-nums ${
                  !unlocked
                    ? 'border-[#D97706]/25 dark:border-[#F59E0B]/25 bg-[#F2ECE1]/60 dark:bg-[#181614] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/55'
                    : isActive
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45'
                }`}
              >
                {!unlocked && (
                  <Lock className="w-3 h-3 text-[#B45309] dark:text-[#F59E0B] shrink-0" />
                )}
                <span className="font-hanzi">第{ch.id}课</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* مساحة التدريب الصوتي التفاعلي */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* قائمة عناصر الفصل للاختيار السريع */}
        <aside className="order-2 lg:order-1 lg:col-span-4 rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] overflow-hidden">
          <div className="px-4 py-3 bg-[#F2ECE1]/75 dark:bg-[#25221F] border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {practiceType === 'vocab' ? 'مفردات' : 'جمل'} {activeChapter.titleAr}
            </h3>
            <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
              {safeIndex + 1} / {items.length}
            </span>
          </div>

          <div className="max-h-[220px] lg:max-h-[460px] overflow-y-auto divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
            {items.map((item, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className={`w-full text-right px-4 py-3 flex items-center justify-between gap-2.5 transition-colors ${
                    isSelected
                      ? 'bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 border-r-4 border-[#B91C1C] dark:border-[#EF4444]'
                      : 'hover:bg-[#F9F6F0] dark:hover:bg-[#25221F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E] tabular-nums w-5 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-hanzi text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] truncate">
                      {item.hanzi}
                    </span>
                  </div>
                  <span className="text-xs text-[#57534E] dark:text-[#A8A29E] truncate max-w-[115px]">
                    {item.arabic}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* بطاقة النطق والمايكروفون */}
        {currentItem && (
          <div className="order-1 lg:order-2 lg:col-span-8 rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-6 sm:p-8 space-y-6">
            {/* التنقل العلوي بين العناصر */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
              <span className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                {activeChapter.titleAr} (第{activeChapter.id}课) · العنصر {safeIndex + 1} من{' '}
                {items.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => handleSelectIndex(safeIndex - 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
                <button
                  type="button"
                  disabled={safeIndex >= items.length - 1}
                  onClick={() => handleSelectIndex(safeIndex + 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] disabled:opacity-40"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* النص المستهدف + الاستماع */}
            <div className="text-center space-y-4 py-2">
              <div className="text-2xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] flex justify-center">
                <RubyChinese
                  hanzi={currentItem.hanzi}
                  pinyin={currentItem.pinyin}
                  showPinyin={showPinyin}
                />
              </div>

              <p className="text-sm sm:text-base font-semibold text-[#57534E] dark:text-[#A8A29E]">
                {currentItem.arabic}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handlePlayTarget(1.0)}
                  className={`inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg border text-xs sm:text-sm font-bold transition-colors ${
                    speakingRate === 1.0
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50'
                  }`}
                >
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span>استمع للنطق الصحيح (1.0x)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlayTarget(0.7)}
                  className={`inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg border text-xs sm:text-sm font-bold transition-colors ${
                    speakingRate === 0.7
                      ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706] dark:bg-[#F59E0B] text-white dark:text-[#121110]'
                      : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/50'
                  }`}
                >
                  <span>استماع بطيء (0.7x)</span>
                </button>
              </div>
            </div>

            {/* زر المايكروفون المتحرك */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              <div className="relative">
                {isListening && (
                  <span
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-full bg-[#B91C1C]/25 dark:bg-[#EF4444]/30 animate-ping"
                  />
                )}
                <button
                  type="button"
                  disabled={!speechApiSupported}
                  onClick={handleToggleMic}
                  className={`relative z-10 inline-flex items-center justify-center gap-2.5 px-7 py-4 min-h-[56px] rounded-full text-sm sm:text-base font-bold transition-all shadow-sm disabled:opacity-45 disabled:cursor-not-allowed ${
                    isListening
                      ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white scale-105'
                      : 'bg-[#1C1917] hover:bg-[#B91C1C] dark:bg-[#F5F2EB] dark:hover:bg-[#EF4444] text-white dark:text-[#121110] dark:hover:text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 shrink-0" />
                      <span>جارٍ الاستماع... اضغط للإيقاف</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 shrink-0" />
                      <span>ابدأ التحدث بالصينية</span>
                    </>
                  )}
                </button>
              </div>

              {isListening && (
                <p className="text-xs font-semibold text-[#B91C1C] dark:text-[#EF4444]">
                  {interimText
                    ? `نسمع الآن: «${interimText}»`
                    : 'انطق الكلمة أو الجملة بوضوح باللغة الصينية (zh-CN)...'}
                </p>
              )}

              {micError && (
                <p className="text-xs sm:text-sm font-semibold text-[#B91C1C] dark:text-[#EF4444] text-center max-w-md">
                  {micError}
                </p>
              )}
            </div>

            {/* بطاقة تحليل النطق والنتيجة */}
            {evaluation && (
              <div
                className={`rounded-xl border p-5 space-y-4 ${
                  evaluation.matchPercent >= 80
                    ? 'border-[#15803D]/40 dark:border-[#22C55E]/40 bg-[#15803D]/8 dark:bg-[#22C55E]/12'
                    : evaluation.matchPercent >= 50
                      ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/8 dark:bg-[#F59E0B]/12'
                      : 'border-[#B91C1C]/40 dark:border-[#EF4444]/40 bg-[#B91C1C]/8 dark:bg-[#EF4444]/12'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        evaluation.matchPercent >= 80
                          ? 'text-[#15803D] dark:text-[#22C55E]'
                          : evaluation.matchPercent >= 50
                            ? 'text-[#B45309] dark:text-[#F59E0B]'
                            : 'text-[#B91C1C] dark:text-[#EF4444]'
                      }`}
                    />
                    <span className="text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                      {evaluation.matchPercent >= 85
                        ? 'ممتاز! نطقك واضح ودقيق جداً'
                        : evaluation.matchPercent >= 60
                          ? 'جيد جداً! حاول تحسين الرموز المظلّلة بالأحمر'
                          : 'محاولة طيبة! استمع للنطق البطيء (0.7x) وحاول مجدداً'}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-bold tabular-nums ${
                      evaluation.matchPercent >= 80
                        ? 'bg-[#15803D] text-white'
                        : evaluation.matchPercent >= 50
                          ? 'bg-[#D97706] text-white'
                          : 'bg-[#B91C1C] text-white'
                    }`}
                  >
                    نسبة التطابق: {evaluation.matchPercent}%
                  </span>
                </div>

                {/* مقارنة الرموز: الأخضر مطابق، الأحمر/الكهرماني مفقود أو مختلف */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white dark:bg-[#1E1C1A] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-3.5 space-y-1.5">
                    <p className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E]">
                      تحليل رموز الهدف (الأخضر مطابق · الأحمر يحتاج إعادة):
                    </p>
                    <div className="font-hanzi text-2xl font-bold tracking-wide" dir="ltr">
                      {evaluation.charResults.map((res, i) => (
                        <span
                          key={i}
                          className={
                            res.isPunctuation
                              ? 'text-[#57534E] dark:text-[#A8A29E]'
                              : res.matched
                                ? 'text-[#15803D] dark:text-[#22C55E]'
                                : 'text-[#B91C1C] dark:text-[#EF4444] underline decoration-wavy underline-offset-4'
                          }
                        >
                          {res.char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white dark:bg-[#1E1C1A] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-3.5 space-y-1.5">
                    <p className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E]">
                      ما سمعه المايكروفون:
                    </p>
                    <p
                      className="font-hanzi text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                      dir="ltr"
                    >
                      {evaluation.heardTranscript || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>حاول مجدداً</span>
                  </button>

                  {safeIndex < items.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleSelectIndex(safeIndex + 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] dark:bg-[#22C55E] dark:text-[#121110] text-white text-xs font-bold"
                    >
                      <span>العنصر التالي</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
