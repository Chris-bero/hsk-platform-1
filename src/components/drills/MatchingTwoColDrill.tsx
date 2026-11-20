import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { DrillQuestion, QuizMode } from '../../types';
import { shuffleArray } from '../../utils/drillGenerators';

interface MatchingTwoColProps {
  question: DrillQuestion;
  mode: QuizMode;
  showPinyin: boolean;
  onComplete: (correctPairs: number, totalPairs: number, summaryDisplay: string) => void;
}

export function MatchingTwoColDrill({
  question,
  mode,
  showPinyin,
  onComplete,
}: MatchingTwoColProps) {
  const entries = question.matchingEntries ?? [];

  const leftItems = useMemo(() => shuffleArray(entries), [question.id]);
  const rightItems = useMemo(() => shuffleArray(entries), [question.id]);

  const [selectedHanziId, setSelectedHanziId] = useState<string | null>(null);
  const [selectedArabicId, setSelectedArabicId] = useState<string | null>(null);

  // خريطة الربط: hanziId -> arabicId
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState<{ hanziId: string; arabicId: string } | null>(null);
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    setSelectedHanziId(null);
    setSelectedArabicId(null);
    setPairs({});
    setWrongFlash(null);
    setMistakesCount(0);
  }, [question.id]);

  const pairedArabicIds = new Set(Object.values(pairs));

  const attemptPair = (hId: string, aId: string) => {
    if (mode === 'practice') {
      if (hId === aId) {
        const nextPairs = { ...pairs, [hId]: aId };
        setPairs(nextPairs);
        setSelectedHanziId(null);
        setSelectedArabicId(null);
        if (Object.keys(nextPairs).length === entries.length) {
          const effectiveCorrect = Math.max(0, entries.length - mistakesCount);
          const summary =
            mistakesCount === 0
              ? `تم توصيل جميع الأزواج (${entries.length}/${entries.length}) دون أخطاء`
              : `تم إكمال التوصيل مع ${mistakesCount} محاولة خاطئة`;
          onComplete(effectiveCorrect, entries.length, summary);
        }
      } else {
        setMistakesCount((m) => m + 1);
        setWrongFlash({ hanziId: hId, arabicId: aId });
        window.setTimeout(() => {
          setWrongFlash(null);
          setSelectedHanziId(null);
          setSelectedArabicId(null);
        }, 550);
      }
      return;
    }

    // وضع الامتحان: يسمح بربط وتعديل أي زوج بحرية قبل التسليم النهائي
    const cleanedPairs: Record<string, string> = {};
    Object.entries(pairs).forEach(([k, v]) => {
      if (k !== hId && v !== aId) {
        cleanedPairs[k] = v;
      }
    });
    const nextPairs = { ...cleanedPairs, [hId]: aId };
    setPairs(nextPairs);
    setSelectedHanziId(null);
    setSelectedArabicId(null);

    if (Object.keys(nextPairs).length === entries.length) {
      const correctCount = Object.entries(nextPairs).filter(([k, v]) => k === v).length;
      onComplete(
        correctCount,
        entries.length,
        `تم ربط ${correctCount} من ${entries.length} أزواج بشكل صحيح`
      );
    }
  };

  const handleSelectHanzi = (id: string) => {
    if (mode === 'practice' && pairs[id]) return;
    if (selectedArabicId) {
      attemptPair(id, selectedArabicId);
    } else {
      setSelectedHanziId((prev) => (prev === id ? null : id));
    }
  };

  const handleSelectArabic = (id: string) => {
    if (mode === 'practice' && pairedArabicIds.has(id)) return;
    if (selectedHanziId) {
      attemptPair(selectedHanziId, id);
    } else {
      setSelectedArabicId((prev) => (prev === id ? null : id));
    }
  };

  const handleResetExamPairs = () => {
    setPairs({});
    setSelectedHanziId(null);
    setSelectedArabicId(null);
  };

  // أرقام الأزواج المربوطة في وضع الامتحان لسهولة المراجعة البصرية
  const pairIndexByHanzi: Record<string, number> = {};
  const pairIndexByArabic: Record<string, number> = {};
  Object.entries(pairs).forEach(([hId, aId], idx) => {
    pairIndexByHanzi[hId] = idx + 1;
    pairIndexByArabic[aId] = idx + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
          اختر رمزاً صينياً من العمود الأول ثم اضغط على معناه العربي في العمود الثاني.
        </p>

        <div className="flex items-center gap-3 text-xs tabular-nums">
          <span className="text-[#57534E] dark:text-[#A8A29E]">
            الموصول: <strong className="text-[#1C1917] dark:text-[#F5F2EB]">{Object.keys(pairs).length}/{entries.length}</strong>
          </span>
          {mode === 'exam' && Object.keys(pairs).length > 0 && (
            <button
              type="button"
              onClick={handleResetExamPairs}
              className="inline-flex items-center gap-1 text-[#B91C1C] dark:text-[#EF4444] font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة التوصيل</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* عمود الرموز الصينية */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E] pb-1 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
            الرموز الصينية
          </h3>
          {leftItems.map((item) => {
            const isMatched = Boolean(pairs[item.id]);
            const isSelected = selectedHanziId === item.id;
            const isWrong = wrongFlash?.hanziId === item.id;
            const pairNum = pairIndexByHanzi[item.id];

            let cls =
              'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45';
            if (isWrong) {
              cls =
                'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]';
            } else if (isMatched && mode === 'practice') {
              cls =
                'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/10 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]';
            } else if (isMatched && mode === 'exam') {
              cls =
                'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706]/10 dark:bg-[#F59E0B]/15';
            } else if (isSelected) {
              cls =
                'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12 ring-1 ring-[#B91C1C]/35';
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={mode === 'practice' && isMatched}
                onClick={() => handleSelectHanzi(item.id)}
                className={`w-full min-h-[74px] px-4 py-3 rounded-xl border flex items-center justify-between gap-2 transition-all duration-150 ${cls}`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-hanzi text-2xl sm:text-3xl font-bold">{item.hanzi}</span>
                  {showPinyin && (
                    <span className="font-pinyin text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                      {item.pinyin}
                    </span>
                  )}
                </div>
                {mode === 'practice' && isMatched && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {isWrong && <XCircle className="w-5 h-5 shrink-0" />}
                {mode === 'exam' && pairNum && (
                  <span className="text-xs font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                    زوج {pairNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* عمود المعاني العربية */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E] pb-1 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
            المعنى العربي
          </h3>
          {rightItems.map((item) => {
            const isMatched = pairedArabicIds.has(item.id);
            const isSelected = selectedArabicId === item.id;
            const isWrong = wrongFlash?.arabicId === item.id;
            const pairNum = pairIndexByArabic[item.id];

            let cls =
              'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45';
            if (isWrong) {
              cls =
                'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]';
            } else if (isMatched && mode === 'practice') {
              cls =
                'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/10 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]';
            } else if (isMatched && mode === 'exam') {
              cls =
                'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706]/10 dark:bg-[#F59E0B]/15';
            } else if (isSelected) {
              cls =
                'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12 ring-1 ring-[#B91C1C]/35';
            }

            return (
              <button
                key={item.id}
                type="button"
                disabled={mode === 'practice' && isMatched}
                onClick={() => handleSelectArabic(item.id)}
                className={`w-full min-h-[74px] px-4 py-3 rounded-xl border flex items-center justify-between gap-2 text-right font-semibold text-base transition-all duration-150 ${cls}`}
              >
                <span>{item.arabic}</span>
                {mode === 'practice' && isMatched && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {isWrong && <XCircle className="w-5 h-5 shrink-0" />}
                {mode === 'exam' && pairNum && (
                  <span className="text-xs font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                    زوج {pairNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
