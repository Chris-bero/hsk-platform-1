import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { DrillQuestion, QuizMode } from '../../types';

interface SentenceBuilderProps {
  question: DrillQuestion;
  mode: QuizMode;
  showPinyin: boolean;
  assembledTileIds: string[];
  isLocked: boolean;
  onUpdateTiles: (nextTileIds: string[], assembledText: string, isCorrect: boolean) => void;
  onPracticeCheck: () => void;
}

export function SentenceBuilderDrill({
  question,
  mode,
  showPinyin,
  assembledTileIds,
  isLocked,
  onUpdateTiles,
  onPracticeCheck,
}: SentenceBuilderProps) {
  const showFeedback = mode === 'practice' && isLocked;
  const allTiles = question.shuffledSegments ?? [];
  const correctSegments = question.correctSegments ?? [];

  const tileById = new Map(allTiles.map((t) => [t.tileId, t]));
  const selectedTiles = assembledTileIds
    .map((id) => tileById.get(id))
    .filter((t): t is { tileId: string; text: string } => Boolean(t));

  const assembledText = selectedTiles.map((t) => t.text).join('');
  const expectedText = correctSegments.join('');
  const isCorrectNow = assembledText === expectedText;

  const handleAddTile = (tileId: string) => {
    if (showFeedback || assembledTileIds.includes(tileId)) return;
    const next = [...assembledTileIds, tileId];
    const nextText = next.map((id) => tileById.get(id)?.text ?? '').join('');
    onUpdateTiles(next, nextText, nextText === expectedText);
  };

  const handleRemoveTile = (tileId: string) => {
    if (showFeedback) return;
    const next = assembledTileIds.filter((id) => id !== tileId);
    const nextText = next.map((id) => tileById.get(id)?.text ?? '').join('');
    onUpdateTiles(next, nextText, nextText === expectedText);
  };

  const handleClear = () => {
    if (showFeedback) return;
    onUpdateTiles([], '', false);
  };

  return (
    <div className="space-y-6">
      {/* الدليل العربي */}
      <div className="neo-frame rounded-xl py-8 px-6 text-center space-y-2.5 bg-white dark:bg-[#1E1C1A]">
        <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
          اضغط على المقاطع الصينية بالترتيب الصحيح لتكوين الجملة التالية
        </p>
        <p className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed">
          {question.promptPrimary}
        </p>
        {showPinyin && question.promptPinyin && (
          <p className="font-pinyin text-sm text-[#D97706] dark:text-[#F59E0B]">
            {question.promptPinyin}
          </p>
        )}
      </div>

      {/* منطقة تركيب الجملة */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
            إجابتك المركّبة (اضغط على أي مقطع لإزالته):
          </span>
          {!showFeedback && assembledTileIds.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C1C] dark:text-[#EF4444] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الترتيب</span>
            </button>
          )}
        </div>

        <div
          dir="ltr"
          className={`min-h-[84px] p-4 rounded-xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-colors ${
            showFeedback
              ? isCorrectNow
                ? 'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/8 dark:bg-[#22C55E]/12'
                : 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12'
              : 'border-[#1C1917]/20 dark:border-[#F5F2EB]/20 bg-white dark:bg-[#1E1C1A]'
          }`}
        >
          {selectedTiles.length === 0 ? (
            <span dir="rtl" className="text-sm text-[#57534E]/70 dark:text-[#A8A29E]/70 mx-auto">
              اختر المقاطع من الأسفل لتكوين الجملة الصينية هنا...
            </span>
          ) : (
            selectedTiles.map((tile) => (
              <button
                key={tile.tileId}
                type="button"
                disabled={showFeedback}
                onClick={() => handleRemoveTile(tile.tileId)}
                className="font-hanzi px-4 py-2 min-h-[44px] rounded-lg border border-[#B91C1C]/40 dark:border-[#EF4444]/40 bg-[#F9F6F0] dark:bg-[#121110] text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C] dark:hover:border-[#EF4444] transition-colors"
              >
                {tile.text}
              </button>
            ))
          )}
        </div>
      </div>

      {/* بنك المقاطع المتاحة */}
      <div className="space-y-2">
        <span className="block text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
          المقاطع المتاحة:
        </span>
        <div dir="ltr" className="flex flex-wrap items-center gap-2.5">
          {allTiles.map((tile) => {
            const isUsed = assembledTileIds.includes(tile.tileId);
            return (
              <button
                key={tile.tileId}
                type="button"
                disabled={isUsed || showFeedback}
                onClick={() => handleAddTile(tile.tileId)}
                className={`font-hanzi px-4 py-2.5 min-h-[46px] rounded-lg border text-xl font-bold transition-all duration-150 ${
                  isUsed
                    ? 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/60 dark:bg-[#181614] text-transparent select-none cursor-default'
                    : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C] dark:hover:border-[#EF4444] hover:-translate-y-0.5'
                }`}
              >
                {tile.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* زر التحقق الفوري في وضع التدريب */}
      {mode === 'practice' && !showFeedback && (
        <div className="pt-2">
          <button
            type="button"
            disabled={assembledTileIds.length !== allTiles.length}
            onClick={onPracticeCheck}
            className="w-full sm:w-auto px-7 py-3 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-sm transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
          >
            تحقق من الترتيب
          </button>
        </div>
      )}

      {/* نتيجة التحقق في وضع التدريب */}
      {showFeedback && (
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 ${
            isCorrectNow
              ? 'border-[#15803D]/35 dark:border-[#22C55E]/40 bg-[#15803D]/10 dark:bg-[#22C55E]/12 text-[#15803D] dark:text-[#22C55E]'
              : 'border-[#B91C1C]/35 dark:border-[#EF4444]/40 bg-[#B91C1C]/10 dark:bg-[#EF4444]/12 text-[#B91C1C] dark:text-[#EF4444]'
          }`}
        >
          {isCorrectNow ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <div className="space-y-1 text-sm">
            <p className="font-bold">
              {isCorrectNow ? 'أحسنت! ترتيب الجملة صحيح تماماً.' : 'الترتيب غير مطابق، إليك الصياغة الصحيحة:'}
            </p>
            <p className="font-hanzi text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {expectedText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
