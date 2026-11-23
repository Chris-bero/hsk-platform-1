import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  PenTool,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { ChapterData, VocabItem } from '../../types';
import { isChapterUnlocked } from '../../utils/accessControl';
import { speakChinese, stopChineseSpeech } from '../../utils/speech';

interface HanziWritingLabProps {
  initialChapterId?: number;
  initialWordId?: string;
  initialChar?: string;
  onSelectLockedChapter: (chapter: ChapterData) => void;
}

function extractHanziChars(text: string): string[] {
  return Array.from(text).filter((ch) => /[\u4e00-\u9fff]/.test(ch));
}

export function HanziWritingLab({
  initialChapterId,
  initialWordId,
  initialChar,
  onSelectLockedChapter,
}: HanziWritingLabProps) {
  const { unlockedAccess, theme } = useApp();

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
  const [selectedWordId, setSelectedWordId] = useState<string>(initialWordId ?? '');
  const [selectedCharIdx, setSelectedCharIdx] = useState<number>(0);

  const [canvasMode, setCanvasMode] = useState<'animate' | 'quiz'>('animate');
  const [showOutline, setShowOutline] = useState(true);
  const [strokeCount, setStrokeCount] = useState<number | null>(null);
  const [isLoadingChar, setIsLoadingChar] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [strokesDone, setStrokesDone] = useState(0);
  const [quizHintMessage, setQuizHintMessage] = useState<string | null>(null);
  const [speakingRate, setSpeakingRate] = useState<1.0 | 0.7 | null>(null);
  const [canvasSize, setCanvasSize] = useState<number>(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? 300 : 260
  );

  const mountRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = () => setCanvasSize(mediaQuery.matches ? 300 : 260);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync when launched from Radicals Explorer or Chapter Hub
  useEffect(() => {
    if (
      initialChapterId &&
      unlockedChapters.some((ch) => ch.id === initialChapterId)
    ) {
      setSelectedChapterId(initialChapterId);
    }
  }, [initialChapterId, unlockedChapters]);

  const activeChapter = useMemo(
    () =>
      unlockedChapters.find((ch) => ch.id === selectedChapterId) ??
      unlockedChapters[0] ??
      CHAPTERS_DATA[0],
    [selectedChapterId, unlockedChapters]
  );

  const activeWord = useMemo<VocabItem>(() => {
    if (selectedWordId) {
      const found = activeChapter.vocab.find((v) => v.id === selectedWordId);
      if (found) return found;
    }
    return activeChapter.vocab[0];
  }, [activeChapter, selectedWordId]);

  useEffect(() => {
    if (initialWordId && activeChapter.vocab.some((v) => v.id === initialWordId)) {
      setSelectedWordId(initialWordId);
      if (initialChar) {
        const w = activeChapter.vocab.find((v) => v.id === initialWordId);
        if (w) {
          const idx = extractHanziChars(w.hanzi).indexOf(initialChar);
          setSelectedCharIdx(idx >= 0 ? idx : 0);
        }
      } else {
        setSelectedCharIdx(0);
      }
    }
  }, [initialWordId, initialChar, activeChapter]);

  const hanziChars = useMemo(
    () => extractHanziChars(activeWord?.hanzi ?? '你'),
    [activeWord]
  );

  const activeChar = hanziChars[selectedCharIdx] ?? hanziChars[0] ?? '你';

  useEffect(() => {
    return () => {
      stopChineseSpeech();
    };
  }, []);

  const startQuizOnWriter = useCallback((writer: HanziWriter) => {
    setQuizCompleted(false);
    setQuizMistakes(0);
    setStrokesDone(0);
    setQuizHintMessage('ارسم الخط الأول على الشبكة بالماوس أو اللمس.');

    writer.quiz({
      leniency: 1.15,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      onCorrectStroke: (data) => {
        setStrokesDone(data.strokeNum + 1);
        setQuizHintMessage(
          data.strokesRemaining > 0
            ? `أحسنت! متبقٍّ ${data.strokesRemaining} خط لإكمال الرمز.`
            : 'رائع! اكتمل الرمز بنجاح!'
        );
      },
      onMistake: (data) => {
        setQuizMistakes(data.totalMistakes);
        if (data.mistakesOnStroke >= 2) {
          setQuizHintMessage('تلميح: اتّبع الخط المضيء باللون الذهبي في نفس الاتجاه.');
        } else {
          setQuizHintMessage('حاول مرة أخرى — راقب بداية الخط واتجاهه الصحيح.');
        }
      },
      onComplete: (summary) => {
        setQuizCompleted(true);
        setQuizMistakes(summary.totalMistakes);
        setQuizHintMessage(
          summary.totalMistakes === 0
            ? `ممتاز! كتبت الرمز «${summary.character}» بإتقان تام دون أي خطأ!`
            : `أحسنت! أتممت كتابة الرمز «${summary.character}» بنجاح (${summary.totalMistakes} محاولات تصحيح).`
        );
      },
    });
  }, []);

  // Mount & rebuild HanziWriter cleanly whenever character, mode, or theme changes
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !activeChar) return;

    container.innerHTML = '';
    writerRef.current = null;
    setIsLoadingChar(true);
    setLoadError(false);
    setStrokeCount(null);
    setQuizCompleted(false);
    setQuizMistakes(0);
    setStrokesDone(0);
    setQuizHintMessage(null);

    const isDark = theme === 'dark';
    const isQuiz = canvasMode === 'quiz';

    let cancelled = false;

    const writer = HanziWriter.create(container, activeChar, {
      width: canvasSize,
      height: canvasSize,
      padding: canvasSize >= 300 ? 20 : 18,
      showOutline,
      showCharacter: !isQuiz,
      strokeAnimationSpeed: 1.0,
      delayBetweenStrokes: 260,
      strokeColor: isDark ? '#F5F2EB' : '#1C1917',
      radicalColor: isDark ? '#EF4444' : '#B91C1C',
      highlightColor: isDark ? '#F59E0B' : '#D97706',
      outlineColor: isDark ? '#3B3631' : '#D6D0C4',
      drawingColor: isDark ? '#22C55E' : '#15803D',
      highlightCompleteColor: isDark ? '#22C55E' : '#15803D',
      drawingWidth: 16,
      showHintAfterMisses: 2,
      onLoadCharDataSuccess: (data) => {
        if (cancelled) return;
        setStrokeCount(data.strokes.length);
        setIsLoadingChar(false);
        setLoadError(false);
      },
      onLoadCharDataError: () => {
        if (cancelled) return;
        setIsLoadingChar(false);
        setLoadError(true);
      },
    });

    writerRef.current = writer;

    if (isQuiz) {
      startQuizOnWriter(writer);
    }

    return () => {
      cancelled = true;
      try {
        writer.cancelQuiz();
      } catch {
        // ignore cleanup race
      }
      if (container) {
        container.innerHTML = '';
      }
      writerRef.current = null;
    };
  }, [activeChar, canvasMode, theme, showOutline, canvasSize, startQuizOnWriter]);

  const handleAnimateStrokes = () => {
    if (canvasMode !== 'animate') {
      setCanvasMode('animate');
      window.setTimeout(() => {
        writerRef.current?.animateCharacter();
      }, 120);
      return;
    }
    writerRef.current?.animateCharacter();
  };

  const handleStartQuiz = () => {
    if (canvasMode !== 'quiz') {
      setCanvasMode('quiz');
      return;
    }
    if (writerRef.current) {
      startQuizOnWriter(writerRef.current);
    }
  };

  const handlePlayAudio = (rate: 1.0 | 0.7) => {
    if (!activeWord) return;
    if (speakingRate === rate) {
      stopChineseSpeech();
      setSpeakingRate(null);
      return;
    }
    setSpeakingRate(rate);
    const ok = speakChinese(activeWord.hanzi, rate, {
      onEnd: () => setSpeakingRate(null),
      onError: () => setSpeakingRate(null),
    });
    if (!ok) setSpeakingRate(null);
  };

  const handleSelectChapter = (ch: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, ch.id)) {
      onSelectLockedChapter(ch);
      return;
    }
    setSelectedChapterId(ch.id);
    setSelectedWordId(ch.vocab[0]?.id ?? '');
    setSelectedCharIdx(0);
  };

  const handleSelectWord = (word: VocabItem) => {
    setSelectedWordId(word.id);
    setSelectedCharIdx(0);
  };

  const handleNextCharOrWord = () => {
    if (selectedCharIdx + 1 < hanziChars.length) {
      setSelectedCharIdx(selectedCharIdx + 1);
      return;
    }
    const wordIndex = activeChapter.vocab.findIndex((v) => v.id === activeWord.id);
    const nextWord = activeChapter.vocab[(wordIndex + 1) % activeChapter.vocab.length];
    if (nextWord) {
      setSelectedWordId(nextWord.id);
      setSelectedCharIdx(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط اختيار الفصل */}
      <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
            اختر الفصل للتدرب على كتابة مفرداته:
          </p>
          <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums">
            {activeChapter.titleAr} (第{activeChapter.id}课) · {activeChapter.vocab.length} مفردة
          </span>
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

      {/* مساحة العمل الرئيسية: اللوح التفاعلي أولاً على الجوال + قائمة مفردات الفصل */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* العمود الأيمن: قائمة مفردات الفصل */}
        <aside className="order-2 lg:order-1 lg:col-span-4 rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] overflow-hidden">
          <div className="px-4 py-3 bg-[#F2ECE1]/75 dark:bg-[#25221F] border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              مفردات {activeChapter.titleAr}
            </h3>
            <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
              {activeChapter.vocab.length} كلمة
            </span>
          </div>

          <div className="max-h-[220px] lg:max-h-[460px] overflow-y-auto divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
            {activeChapter.vocab.map((word, idx) => {
              const isSelected = word.id === activeWord?.id;
              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => handleSelectWord(word)}
                  className={`w-full text-right px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 border-r-4 border-[#B91C1C] dark:border-[#EF4444]'
                      : 'hover:bg-[#F9F6F0] dark:hover:bg-[#25221F]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E] tabular-nums w-5 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-hanzi text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB] shrink-0">
                      {word.hanzi}
                    </span>
                    <span className="font-pinyin text-xs text-[#57534E] dark:text-[#A8A29E] truncate">
                      {word.pinyin}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] truncate max-w-[110px]">
                    {word.arabic}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* العمود الأيسر: مختبر الرسم والخطوط (米字格) */}
        <div className="order-1 lg:order-2 lg:col-span-8 rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 sm:p-6 space-y-6">
          {/* بطاقة الكلمة المختارة + الصوت + تبويبات تقسيم الرموز */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-hanzi text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  {activeWord?.hanzi}
                </span>
                <span className="font-pinyin text-base font-bold text-[#B91C1C] dark:text-[#EF4444]">
                  {activeWord?.pinyin}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
                {activeWord?.arabic}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handlePlayAudio(1.0)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border text-xs font-bold tabular-nums transition-colors ${
                  speakingRate === 1.0
                    ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                    : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50'
                }`}
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>نطق 1.0x</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlayAudio(0.7)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg border text-xs font-bold tabular-nums transition-colors ${
                  speakingRate === 0.7
                    ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706] dark:bg-[#F59E0B] text-white dark:text-[#121110]'
                    : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/50'
                }`}
              >
                <span>بطيء 0.7x</span>
              </button>
            </div>
          </div>

          {/* تبويبات اختيار الرمز الفردي عند وجود أكثر من رمز في الكلمة */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                اختر الرمز للتدريب:
              </span>
              {hanziChars.map((ch, idx) => {
                const isSelected = idx === selectedCharIdx;
                return (
                  <button
                    key={`${activeWord?.id}-${idx}`}
                    type="button"
                    onClick={() => setSelectedCharIdx(idx)}
                    className={`font-hanzi w-12 h-12 rounded-lg border text-2xl font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white shadow-xs'
                        : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            {strokeCount !== null && (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                <span>عدد الخطوط:</span>
                <span className="px-2.5 py-1 rounded-md bg-[#F2ECE1] dark:bg-[#292623] text-[#1C1917] dark:text-[#F5F2EB]">
                  {strokeCount} خط
                </span>
              </div>
            )}
          </div>

          {/* لوح الكتابة الصينية 米字格 + أزرار التحكم */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* شبكة 米字格 Mizige */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div
                className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-xl border-2 border-[#B91C1C]/45 dark:border-[#EF4444]/45 bg-[#FCFBF8] dark:bg-[#161513] overflow-hidden select-none touch-none shadow-xs"
                dir="ltr"
              >
                {/* خطوط الشبكة الصينية التقليدية 米字格 */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 260 260"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="260"
                    y2="260"
                    stroke="currentColor"
                    strokeDasharray="5,5"
                    className="text-[#B91C1C]/20 dark:text-[#EF4444]/20"
                    strokeWidth="1"
                  />
                  <line
                    x1="260"
                    y1="0"
                    x2="0"
                    y2="260"
                    stroke="currentColor"
                    strokeDasharray="5,5"
                    className="text-[#B91C1C]/20 dark:text-[#EF4444]/20"
                    strokeWidth="1"
                  />
                  <line
                    x1="130"
                    y1="0"
                    x2="130"
                    y2="260"
                    stroke="currentColor"
                    strokeDasharray="4,4"
                    className="text-[#B91C1C]/30 dark:text-[#EF4444]/30"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="130"
                    x2="260"
                    y2="130"
                    stroke="currentColor"
                    strokeDasharray="4,4"
                    className="text-[#B91C1C]/30 dark:text-[#EF4444]/30"
                    strokeWidth="1"
                  />
                </svg>

                {/* حاوية HanziWriter */}
                <div
                  ref={mountRef}
                  className="relative z-10 w-[260px] h-[260px] md:w-[300px] md:h-[300px] cursor-crosshair touch-none"
                />

                {isLoadingChar && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FCFBF8]/85 dark:bg-[#161513]/85 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#B91C1C] dark:text-[#EF4444]" />
                    <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                      جارٍ تحميل خطوط الرمز...
                    </span>
                  </div>
                )}

                {loadError && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#FCFBF8]/95 dark:bg-[#161513]/95 p-4 text-center gap-2">
                    <span className="font-hanzi text-5xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                      {activeChar}
                    </span>
                    <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                      تعذّر تحميل بيانات الخطوط — تحقق من الاتصال بالإنترنت.
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#57534E] dark:text-[#A8A29E] text-center">
                الخطوط الحمراء تميّز <strong className="text-[#B91C1C] dark:text-[#EF4444]">جذر الرمز (Radical)</strong> تلقائياً
              </p>
            </div>

            {/* لوحة التحكم والتغذية الراجعة */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAnimateStrokes}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] rounded-lg text-sm font-bold transition-colors ${
                    canvasMode === 'animate'
                      ? 'bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white'
                      : 'border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50'
                  }`}
                >
                  <Play className="w-4 h-4 shrink-0" />
                  <span>عرض ترتيب الخطوط</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] rounded-lg text-sm font-bold transition-colors ${
                    canvasMode === 'quiz'
                      ? 'bg-[#15803D] hover:bg-[#166534] dark:bg-[#22C55E] dark:text-[#121110] text-white'
                      : 'border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#15803D]/50'
                  }`}
                >
                  <PenTool className="w-4 h-4 shrink-0" />
                  <span>تدرّب على الكتابة</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOutline((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]"
                >
                  {showOutline ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showOutline ? 'إخفاء التظليل (تحدي الذاكرة)' : 'إظهار التظليل الإرشادي'}</span>
                </button>

                {canvasMode === 'quiz' && (
                  <button
                    type="button"
                    onClick={handleStartQuiz}
                    className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة الرسم</span>
                  </button>
                )}
              </div>

              {/* حالة التدريب والتغذية الراجعة */}
              {canvasMode === 'quiz' ? (
                <div
                  className={`rounded-xl border p-4 space-y-2.5 ${
                    quizCompleted
                      ? 'border-[#15803D]/40 dark:border-[#22C55E]/40 bg-[#15803D]/10 dark:bg-[#22C55E]/15'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#141312]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {quizCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-[#22C55E]" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                      )}
                      <span
                        className={
                          quizCompleted
                            ? 'text-[#15803D] dark:text-[#22C55E]'
                            : 'text-[#1C1917] dark:text-[#F5F2EB]'
                        }
                      >
                        {quizCompleted ? 'أتممت كتابة الرمز بنجاح!' : 'وضع التتبّع التفاعلي نشط'}
                      </span>
                    </div>

                    {strokeCount !== null && (
                      <span className="text-xs font-bold tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                        {strokesDone} / {strokeCount} خط
                      </span>
                    )}
                  </div>

                  {quizHintMessage && (
                    <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed">
                      {quizHintMessage}
                    </p>
                  )}

                  {quizMistakes > 0 && !quizCompleted && (
                    <p className="text-[11px] text-[#B45309] dark:text-[#F59E0B] font-semibold tabular-nums">
                      محاولات التصحيح حتى الآن: {quizMistakes} (يظهر التلميح المضيء بعد خطأين)
                    </p>
                  )}

                  {quizCompleted && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleNextCharOrWord}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#15803D] hover:bg-[#166534] dark:bg-[#22C55E] dark:text-[#121110] text-white text-xs font-bold"
                      >
                        <span>
                          {selectedCharIdx + 1 < hanziChars.length
                            ? 'الانتقال للرمز التالي في الكلمة'
                            : 'الانتقال للمفردة التالية'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStartQuiz}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#15803D]/35 text-xs font-bold text-[#15803D] dark:text-[#22C55E]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>أعد كتابته</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#141312] p-4 space-y-1.5 text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                  <p className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    كيف تتقن كتابة الرمز الصيني؟
                  </p>
                  <p>
                    ١. اضغط على <strong>«عرض ترتيب الخطوط»</strong> لمشاهدة التسلسل الصحيح (من أعلى
                    لأسفل ومن اليسار لليمين).
                  </p>
                  <p>
                    ٢. انتقل إلى <strong>«تدرّب على الكتابة»</strong> وارسم كل خط مباشرة على شبكة
                    米字格 بالماوس أو بإصبعك على الشاشة.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
