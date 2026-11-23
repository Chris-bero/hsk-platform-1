import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Lock,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { ChapterData, VocabItem } from '../../types';
import { isChapterUnlocked } from '../../utils/accessControl';
import {
  playMatchErrorTone,
  playMatchSuccessTone,
  playRoundFinishTone,
} from '../../utils/gameAudio';

interface SpeedMatchLabProps {
  initialChapterId?: number;
  onSelectLockedChapter: (chapter: ChapterData) => void;
}

type SpeedScope = 'chapter' | 'all-unlocked';
type RoundPhase = 'ready' | 'playing' | 'finished';

interface SpeedPersonalBest {
  bestScore: number;
  bestMatches: number;
  bestAccuracy: number;
  updatedAt: string;
}

interface ActiveSlotPair {
  slotId: number;
  vocab: VocabItem;
}

const ROUND_DURATION_SECONDS = 60;
const BOARD_SIZE = 5;
const BEST_KEY_PREFIX = 'chinese_portal_speed_best_v1_';

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function loadPersonalBest(studentId: string | undefined): SpeedPersonalBest | null {
  if (!studentId) return null;
  try {
    const raw = localStorage.getItem(`${BEST_KEY_PREFIX}${studentId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpeedPersonalBest>;
    if (typeof parsed.bestScore === 'number') {
      return {
        bestScore: parsed.bestScore,
        bestMatches: parsed.bestMatches ?? 0,
        bestAccuracy: parsed.bestAccuracy ?? 0,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function savePersonalBest(studentId: string | undefined, best: SpeedPersonalBest): void {
  if (!studentId) return;
  try {
    localStorage.setItem(`${BEST_KEY_PREFIX}${studentId}`, JSON.stringify(best));
  } catch {
    // تجاهل أخطاء مساحة التخزين
  }
}

export function SpeedMatchLab({
  initialChapterId,
  onSelectLockedChapter,
}: SpeedMatchLabProps) {
  const { currentStudent, unlockedAccess, showPinyin } = useApp();

  const unlockedChapters = useMemo(
    () => CHAPTERS_DATA.filter((ch) => isChapterUnlocked(unlockedAccess, ch.id)),
    [unlockedAccess]
  );

  const defaultChapterId = useMemo(() => {
    if (initialChapterId && unlockedChapters.some((ch) => ch.id === initialChapterId)) {
      return initialChapterId;
    }
    return unlockedChapters[0]?.id ?? 1;
  }, [initialChapterId, unlockedChapters]);

  const [scope, setScope] = useState<SpeedScope>(initialChapterId ? 'chapter' : 'all-unlocked');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(defaultChapterId);
  const [muted, setMuted] = useState(false);

  const [phase, setPhase] = useState<RoundPhase>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_DURATION_SECONDS);
  const [score, setScore] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(1);

  const [personalBest, setPersonalBest] = useState<SpeedPersonalBest | null>(() =>
    loadPersonalBest(currentStudent?.id)
  );
  const [isNewRecord, setIsNewRecord] = useState(false);

  // لوحة اللعب: 5 أزواج نشطة + ترتيب مستقل للعمود العربي
  const [zhSlots, setZhSlots] = useState<ActiveSlotPair[]>([]);
  const [arOrder, setArOrder] = useState<number[]>([]);
  const deckQueueRef = useRef<VocabItem[]>([]);

  const [selectedZhSlot, setSelectedZhSlot] = useState<number | null>(null);
  const [selectedArSlot, setSelectedArSlot] = useState<number | null>(null);
  const [flashSuccessSlot, setFlashSuccessSlot] = useState<number | null>(null);
  const [shakeErrorSlots, setShakeErrorSlots] = useState<{ zh: number; ar: number } | null>(null);

  // مزامنة الفصل المختار عند الدخول من داخل فصل محدد
  useEffect(() => {
    if (initialChapterId && unlockedChapters.some((ch) => ch.id === initialChapterId)) {
      setSelectedChapterId(initialChapterId);
      setScope('chapter');
      setPhase('ready');
    }
  }, [initialChapterId, unlockedChapters]);

  useEffect(() => {
    setPersonalBest(loadPersonalBest(currentStudent?.id));
  }, [currentStudent?.id]);

  // مجموعة المفردات النشطة حسب النطاق المختار (إزالة التكرار حسب الرمز الصيني)
  const vocabPool = useMemo<VocabItem[]>(() => {
    const sourceChapters =
      scope === 'chapter'
        ? unlockedChapters.filter((ch) => ch.id === selectedChapterId)
        : unlockedChapters;
    const seen = new Set<string>();
    const unique: VocabItem[] = [];
    for (const ch of sourceChapters) {
      for (const v of ch.vocab) {
        if (!seen.has(v.hanzi)) {
          seen.add(v.hanzi);
          unique.push(v);
        }
      }
    }
    return unique;
  }, [scope, selectedChapterId, unlockedChapters]);

  const drawNextVocab = useCallback(
    (excludeIds: Set<string>): VocabItem | null => {
      if (vocabPool.length === 0) return null;
      if (deckQueueRef.current.length === 0) {
        deckQueueRef.current = shuffleArray(vocabPool);
      }

      const candidateIdx = deckQueueRef.current.findIndex((v) => !excludeIds.has(v.id));
      if (candidateIdx >= 0) {
        const [picked] = deckQueueRef.current.splice(candidateIdx, 1);
        return picked;
      }

      // إعادة تعبئة الصف بأي مفردات غير معروضة حالياً
      const fresh = shuffleArray(vocabPool.filter((v) => !excludeIds.has(v.id)));
      if (fresh.length > 0) {
        const [picked, ...rest] = fresh;
        deckQueueRef.current = rest;
        return picked;
      }

      return deckQueueRef.current.shift() ?? vocabPool[0];
    },
    [vocabPool]
  );

  const startRound = useCallback(() => {
    if (vocabPool.length < 3) return;
    const count = Math.min(BOARD_SIZE, vocabPool.length);
    const shuffled = shuffleArray(vocabPool);
    const initialItems = shuffled.slice(0, count);
    deckQueueRef.current = shuffled.slice(count);

    const slots: ActiveSlotPair[] = initialItems.map((vocab, idx) => ({
      slotId: idx,
      vocab,
    }));

    setZhSlots(slots);
    setArOrder(shuffleArray(slots.map((s) => s.slotId)));
    setScore(0);
    setMatchedCount(0);
    setMistakeCount(0);
    setStreak(0);
    setMaxCombo(1);
    setIsNewRecord(false);
    setSelectedZhSlot(null);
    setSelectedArSlot(null);
    setFlashSuccessSlot(null);
    setShakeErrorSlots(null);
    setTimeLeft(ROUND_DURATION_SECONDS);
    setPhase('playing');
  }, [vocabPool]);

  // مؤقت العد التنازلي 60 ثانية
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  // إنهاء الجولة وحفظ أفضل رقم قياسي للطالب
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      setPhase('finished');
      playRoundFinishTone(muted);

      const totalAttempts = matchedCount + mistakeCount;
      const accuracy = totalAttempts > 0 ? Math.round((matchedCount / totalAttempts) * 100) : 0;

      if (!personalBest || score > personalBest.bestScore) {
        const nextBest: SpeedPersonalBest = {
          bestScore: score,
          bestMatches: matchedCount,
          bestAccuracy: accuracy,
          updatedAt: new Date().toISOString(),
        };
        setPersonalBest(nextBest);
        savePersonalBest(currentStudent?.id, nextBest);
        if (score > 0) setIsNewRecord(true);
      }
    }
  }, [
    phase,
    timeLeft,
    score,
    matchedCount,
    mistakeCount,
    personalBest,
    currentStudent?.id,
    muted,
  ]);

  const currentCombo = Math.min(5, 1 + Math.floor(streak / 2));

  const evaluatePair = useCallback(
    (zhSlotId: number, arSlotId: number) => {
      if (zhSlotId === arSlotId) {
        // تطابق صحيح
        const nextStreak = streak + 1;
        const multiplier = Math.min(5, 1 + Math.floor(nextStreak / 2));
        const pointsGained = 10 * multiplier;

        playMatchSuccessTone(multiplier, muted);

        setStreak(nextStreak);
        setMaxCombo((prev) => Math.max(prev, multiplier));
        setMatchedCount((c) => c + 1);
        setScore((s) => s + pointsGained);
        setFlashSuccessSlot(zhSlotId);
        setSelectedZhSlot(null);
        setSelectedArSlot(null);

        // استبدال الزوج المطابق فوراً بمفردة جديدة مع إعادة ترتيب لطيف للبطاقة الجديدة
        window.setTimeout(() => {
          setZhSlots((prevSlots) => {
            const exclude = new Set(prevSlots.map((p) => p.vocab.id));
            const nextVocab = drawNextVocab(exclude);
            if (!nextVocab) return prevSlots;
            return prevSlots.map((p) =>
              p.slotId === zhSlotId ? { ...p, vocab: nextVocab } : p
            );
          });
          setArOrder((prevOrder) => {
            // تبديل موضع البطاقة العربية الجديدة عشوائياً مع بطاقة أخرى لتجديد التحدي
            const next = [...prevOrder];
            const idx = next.indexOf(zhSlotId);
            if (idx >= 0 && next.length > 1) {
              const swapWith = Math.floor(Math.random() * next.length);
              [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
            }
            return next;
          });
          setFlashSuccessSlot((cur) => (cur === zhSlotId ? null : cur));
        }, 230);
      } else {
        // زوج غير متطابق: اهتزاز أحمر وتصفير السلسلة دون إيقاف اللوحة
        playMatchErrorTone(muted);
        setMistakeCount((m) => m + 1);
        setStreak(0);
        setShakeErrorSlots({ zh: zhSlotId, ar: arSlotId });
        setSelectedZhSlot(null);
        setSelectedArSlot(null);
        window.setTimeout(() => {
          setShakeErrorSlots(null);
        }, 340);
      }
    },
    [streak, muted, drawNextVocab]
  );

  const handleSelectZh = (slotId: number) => {
    if (phase !== 'playing' || flashSuccessSlot === slotId) return;
    if (selectedArSlot !== null) {
      evaluatePair(slotId, selectedArSlot);
    } else {
      setSelectedZhSlot((prev) => (prev === slotId ? null : slotId));
    }
  };

  const handleSelectAr = (slotId: number) => {
    if (phase !== 'playing' || flashSuccessSlot === slotId) return;
    if (selectedZhSlot !== null) {
      evaluatePair(selectedZhSlot, slotId);
    } else {
      setSelectedArSlot((prev) => (prev === slotId ? null : slotId));
    }
  };

  const handlePickChapter = (ch: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, ch.id)) {
      onSelectLockedChapter(ch);
      return;
    }
    setSelectedChapterId(ch.id);
    setScope('chapter');
    if (phase !== 'ready') setPhase('ready');
  };

  const totalAttempts = matchedCount + mistakeCount;
  const accuracyPercent = totalAttempts > 0 ? Math.round((matchedCount / totalAttempts) * 100) : 0;
  const timerPercent = Math.max(0, (timeLeft / ROUND_DURATION_SECONDS) * 100);
  const timerBarColor =
    timeLeft <= 10
      ? 'bg-[#B91C1C] dark:bg-[#EF4444]'
      : timeLeft <= 25
      ? 'bg-[#D97706] dark:bg-[#F59E0B]'
      : 'bg-[#15803D] dark:bg-[#22C55E]';

  const slotMap = useMemo(() => {
    const m = new Map<number, ActiveSlotPair>();
    for (const s of zhSlots) m.set(s.slotId, s);
    return m;
  }, [zhSlots]);

  return (
    <div className="space-y-5">
      {/* شريط اختيار النطاق والصوت */}
      <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
              نطاق الكلمات:
            </span>
            <div className="inline-flex flex-wrap max-w-full p-1 rounded-lg bg-[#F2ECE1] dark:bg-[#141312] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 gap-1">
              <button
                type="button"
                onClick={() => {
                  setScope('chapter');
                  if (phase === 'playing') setPhase('ready');
                }}
                className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                  scope === 'chapter'
                    ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                    : 'text-[#57534E] dark:text-[#A8A29E]'
                }`}
              >
                الفصل الحالي (第{selectedChapterId}课)
              </button>
              <button
                type="button"
                onClick={() => {
                  setScope('all-unlocked');
                  if (phase === 'playing') setPhase('ready');
                }}
                className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                  scope === 'all-unlocked'
                    ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                    : 'text-[#57534E] dark:text-[#A8A29E]'
                }`}
              >
                جميع الفصول المفتوحة ({unlockedChapters.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {personalBest && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] dark:text-[#F59E0B] tabular-nums">
                <Trophy className="w-4 h-4 shrink-0" />
                <span>أفضل رقم قياسي: {personalBest.bestScore} نقطة</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={muted}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45 transition-colors whitespace-nowrap"
            >
              {muted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#57534E] dark:text-[#A8A29E]" />
                  <span>الصوت مكتوم</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#15803D] dark:text-[#22C55E]" />
                  <span>المؤثرات مفعّلة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {scope === 'chapter' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
            {CHAPTERS_DATA.map((ch) => {
              const unlocked = isChapterUnlocked(unlockedAccess, ch.id);
              const isSelected = selectedChapterId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handlePickChapter(ch)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-bold transition-colors whitespace-nowrap ${
                    !unlocked
                      ? 'border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F2ECE1]/60 dark:bg-[#141312] text-[#57534E]/65 dark:text-[#A8A29E]/60'
                      : isSelected
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45'
                  }`}
                >
                  {!unlocked && <Lock className="w-3 h-3 text-[#D97706] dark:text-[#F59E0B]" />}
                  <span className="font-hanzi">第{ch.id}课</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* شاشة البدء (Ready) */}
      {phase === 'ready' && (
        <div className="neo-frame rounded-xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-xl border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#F59E0B] flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              تحدي السرعة — 60 ثانية ⚡
            </h2>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              طابق أكبر عدد ممكن من الكلمات الصينية بمعانيها العربية خلال دقيقة واحدة. كل تطابق
              متتالٍ يضاعف نقاطك (<span className="font-bold">x1 → x2 → x3 → x5</span>) وتُستبدل
              البطاقات تلقائياً بكلمات جديدة!
            </p>
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] tabular-nums pt-1">
              رصيد الكلمات الجاهز للتحدي: {vocabPool.length} مفردة ·{' '}
              {showPinyin ? 'البينين ظاهر' : 'بدون بينين (تحدٍ متقدم)'}
            </p>
          </div>

          <button
            type="button"
            disabled={vocabPool.length < 3}
            onClick={startRound}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 min-h-[48px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-base font-bold transition-colors disabled:opacity-45"
          >
            <Play className="w-5 h-5" />
            <span>ابدأ تحدي الـ 60 ثانية</span>
          </button>
        </div>
      )}

      {/* ساحة اللعب النشطة (Playing) */}
      {phase === 'playing' && (
        <div className="space-y-5">
          {/* لوحة العداد والنتيجة ومضاعف السلسلة */}
          <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-4 sm:p-5 space-y-3.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] p-3">
                <div className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E] flex items-center justify-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span>الوقت المتبقي</span>
                </div>
                <div
                  className={`text-2xl font-bold tabular-nums mt-0.5 ${
                    timeLeft <= 10
                      ? 'text-[#B91C1C] dark:text-[#EF4444]'
                      : 'text-[#1C1917] dark:text-[#F5F2EB]'
                  }`}
                >
                  {timeLeft}s
                </div>
              </div>

              <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] p-3">
                <div className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  النقاط
                </div>
                <div className="text-2xl font-bold tabular-nums text-[#B91C1C] dark:text-[#EF4444] mt-0.5">
                  {score}
                </div>
              </div>

              <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] p-3">
                <div className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  الأزواج المتطابقة
                </div>
                <div className="text-2xl font-bold tabular-nums text-[#15803D] dark:text-[#22C55E] mt-0.5">
                  {matchedCount}
                </div>
              </div>

              <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#141312] p-3">
                <div className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E] flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>مضاعف السلسلة</span>
                </div>
                <div className="text-2xl font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B] mt-0.5">
                  x{currentCombo}
                </div>
              </div>
            </div>

            {/* شريط العد التنازلي */}
            <div className="w-full h-2.5 rounded-full bg-[#F2ECE1] dark:bg-[#292623] overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-linear ${timerBarColor}`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>

          {/* لوحة التوصيل من عمودين: 5 كلمات صينية مقابل 5 معانٍ عربية */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
            {/* عمود الكلمات الصينية */}
            <div className="space-y-2 sm:space-y-2.5">
              <div className="text-[11px] sm:text-xs font-bold text-[#57534E] dark:text-[#A8A29E] px-1">
                الكلمات الصينية (اختر كلمة)
              </div>
              {zhSlots.map((slot) => {
                const isSelected = selectedZhSlot === slot.slotId;
                const isSuccess = flashSuccessSlot === slot.slotId;
                const isError = shakeErrorSlots?.zh === slot.slotId;

                let stateClasses =
                  'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/50 text-[#1C1917] dark:text-[#F5F2EB]';
                if (isSuccess) {
                  stateClasses =
                    'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/15 dark:bg-[#22C55E]/20 text-[#15803D] dark:text-[#22C55E] scale-[1.01]';
                } else if (isError) {
                  stateClasses =
                    'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444] animate-speed-shake';
                } else if (isSelected) {
                  stateClasses =
                    'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/15 ring-2 ring-[#B91C1C]/30 dark:ring-[#EF4444]/30 text-[#B91C1C] dark:text-[#EF4444]';
                }

                return (
                  <button
                    key={`zh-${slot.slotId}`}
                    type="button"
                    onClick={() => handleSelectZh(slot.slotId)}
                    className={`w-full min-h-[60px] sm:min-h-[68px] px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl border-2 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-0.5 sm:gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${stateClasses}`}
                  >
                    <span className="font-hanzi text-xl sm:text-2xl font-bold leading-tight">
                      {slot.vocab.hanzi}
                    </span>
                    {showPinyin && (
                      <span className="font-pinyin text-[11px] sm:text-sm font-semibold opacity-80 leading-tight">
                        {slot.vocab.pinyin}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* عمود المعاني العربية المخلوطة */}
            <div className="space-y-2 sm:space-y-2.5">
              <div className="text-[11px] sm:text-xs font-bold text-[#57534E] dark:text-[#A8A29E] px-1">
                المعنى بالعربية (طابق المعنى الصحيح)
              </div>
              {arOrder.map((slotId) => {
                const slot = slotMap.get(slotId);
                if (!slot) return null;
                const isSelected = selectedArSlot === slotId;
                const isSuccess = flashSuccessSlot === slotId;
                const isError = shakeErrorSlots?.ar === slotId;

                let stateClasses =
                  'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#D97706]/55 text-[#1C1917] dark:text-[#F5F2EB]';
                if (isSuccess) {
                  stateClasses =
                    'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/15 dark:bg-[#22C55E]/20 text-[#15803D] dark:text-[#22C55E] scale-[1.01]';
                } else if (isError) {
                  stateClasses =
                    'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444] animate-speed-shake';
                } else if (isSelected) {
                  stateClasses =
                    'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706]/10 dark:bg-[#F59E0B]/15 ring-2 ring-[#D97706]/30 dark:ring-[#F59E0B]/30 text-[#92400E] dark:text-[#F59E0B]';
                }

                return (
                  <button
                    key={`ar-${slotId}`}
                    type="button"
                    onClick={() => handleSelectAr(slotId)}
                    className={`w-full min-h-[60px] sm:min-h-[68px] px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl border-2 text-right flex items-center justify-between gap-1.5 sm:gap-2 text-xs sm:text-base font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] ${stateClasses}`}
                  >
                    <span className="leading-snug">{slot.vocab.arabic}</span>
                    {isSuccess && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ملخص نهاية الجولة والرقم القياسي الشخصي (Finished) */}
      {phase === 'finished' && (
        <div className="neo-frame rounded-xl p-7 sm:p-9 text-center space-y-6">
          <div className="space-y-2">
            {isNewRecord ? (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
                <Trophy className="w-4 h-4" />
                <span>تهانينا! حققت رقماً قياسياً جديداً</span>
              </div>
            ) : (
              <div className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                انتهى الوقت — ملخص الجولة
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              نتيجتك النهائية: <span className="text-[#B91C1C] dark:text-[#EF4444] tabular-nums">{score}</span> نقطة
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#141312] p-4">
              <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">الأزواج المتطابقة</div>
              <div className="text-2xl font-bold tabular-nums text-[#15803D] dark:text-[#22C55E] mt-1">
                {matchedCount}
              </div>
            </div>
            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#141312] p-4">
              <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">نسبة الدقة</div>
              <div className="text-2xl font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                {accuracyPercent}%
              </div>
            </div>
            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#141312] p-4">
              <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">أعلى مضاعف</div>
              <div className="text-2xl font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B] mt-1">
                x{maxCombo}
              </div>
            </div>
            <div className="rounded-xl border border-[#D97706]/30 dark:border-[#F59E0B]/35 bg-[#D97706]/8 dark:bg-[#F59E0B]/12 p-4">
              <div className="text-xs font-semibold text-[#92400E] dark:text-[#F59E0B]">
                أفضل رقم قياسي لك
              </div>
              <div className="text-2xl font-bold tabular-nums text-[#92400E] dark:text-[#F59E0B] mt-1">
                {personalBest?.bestScore ?? score}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startRound}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>العب مجدداً</span>
            </button>
            <button
              type="button"
              onClick={() => setPhase('ready')}
              className="px-5 py-3 min-h-[46px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]"
            >
              تغيير النطاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
