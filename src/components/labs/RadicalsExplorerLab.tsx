import { useMemo, useState } from 'react';
import { Lightbulb, PenTool, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { HSK_RADICALS_DATA, RadicalItem } from '../../data/radicalsData';
import { isChapterUnlocked } from '../../utils/accessControl';
import { speakChinese, stopChineseSpeech } from '../../utils/speech';

interface RadicalsExplorerLabProps {
  onPracticeWord: (chapterId: number, wordId: string, matchedChar: string) => void;
}

interface MatchedCurriculumWord {
  chapterId: number;
  chapterTitleAr: string;
  wordId: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
  matchedChar: string;
}

export function RadicalsExplorerLab({ onPracticeWord }: RadicalsExplorerLabProps) {
  const { unlockedAccess } = useApp();
  const [selectedRadicalId, setSelectedRadicalId] = useState<string>(HSK_RADICALS_DATA[0].id);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const unlockedChapters = useMemo(
    () => CHAPTERS_DATA.filter((ch) => isChapterUnlocked(unlockedAccess, ch.id)),
    [unlockedAccess]
  );

  // حساب الكلمات المطابقة من الفصول المفتوحة لكل جذر من الجذور الـ 20
  const matchesByRadical = useMemo(() => {
    const map = new Map<string, MatchedCurriculumWord[]>();
    for (const rad of HSK_RADICALS_DATA) {
      const charSet = new Set(rad.matchChars);
      const matches: MatchedCurriculumWord[] = [];
      const seenHanzi = new Set<string>();

      for (const ch of unlockedChapters) {
        for (const v of ch.vocab) {
          const matchedChar = Array.from(v.hanzi).find((c) => charSet.has(c));
          if (matchedChar && !seenHanzi.has(v.hanzi)) {
            seenHanzi.add(v.hanzi);
            matches.push({
              chapterId: ch.id,
              chapterTitleAr: ch.titleAr,
              wordId: v.id,
              hanzi: v.hanzi,
              pinyin: v.pinyin,
              arabic: v.arabic,
              matchedChar,
            });
          }
        }
      }
      map.set(rad.id, matches);
    }
    return map;
  }, [unlockedChapters]);

  const activeRadical: RadicalItem = useMemo(
    () => HSK_RADICALS_DATA.find((r) => r.id === selectedRadicalId) ?? HSK_RADICALS_DATA[0],
    [selectedRadicalId]
  );

  const activeMatches = matchesByRadical.get(activeRadical.id) ?? [];
  const activeMatchCharSet = useMemo(
    () => new Set(activeRadical.matchChars),
    [activeRadical]
  );

  const handlePlayWord = (wordId: string, hanzi: string) => {
    if (speakingId === wordId) {
      stopChineseSpeech();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(wordId);
    const ok = speakChinese(hanzi, 0.92, {
      onEnd: () => setSpeakingId((cur) => (cur === wordId ? null : cur)),
      onError: () => setSpeakingId((cur) => (cur === wordId ? null : cur)),
    });
    if (!ok) setSpeakingId(null);
  };

  return (
    <div className="space-y-6">
      {/* شبكة الجذور الـ 20 الأساسية */}
      <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              أهم ٢٠ جذراً صينياً في منهج HSK 3.0 (المستوى الأول)
            </h2>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
              اضغط على أي جذر لاكتشاف معناه، حيلة حفظه البصرية، وجميع مفردات المنهج التي تحتوي
              عليه.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
            الفصول المفعّلة: {unlockedChapters.length} من ١٥
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {HSK_RADICALS_DATA.map((rad) => {
            const isSelected = rad.id === activeRadical.id;
            const count = matchesByRadical.get(rad.id)?.length ?? 0;
            return (
              <button
                key={rad.id}
                type="button"
                onClick={() => setSelectedRadicalId(rad.id)}
                className={`text-right p-3 rounded-xl border transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/15 shadow-xs'
                    : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/70 dark:bg-[#141312] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`font-hanzi text-2xl font-bold leading-none ${
                      isSelected
                        ? 'text-[#B91C1C] dark:text-[#EF4444]'
                        : 'text-[#1C1917] dark:text-[#F5F2EB]'
                    }`}
                  >
                    {rad.radical}
                  </span>
                  <span className="text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-white/80 dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E]">
                    {count}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] truncate">
                    {rad.meaningAr}
                  </p>
                  <p className="font-pinyin text-[10px] text-[#57534E] dark:text-[#A8A29E] truncate text-right">
                    {rad.pinyin}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* بطاقة تفاصيل الجذر المختار والكلمات المطابقة */}
      <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] overflow-hidden">
        <div className="p-5 sm:p-6 bg-[#F2ECE1]/70 dark:bg-[#25221F] border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-xl border-2 border-[#B91C1C]/45 dark:border-[#EF4444]/45 bg-white dark:bg-[#1E1C1A] flex items-center justify-center shrink-0">
            <span className="font-hanzi text-4xl font-bold text-[#B91C1C] dark:text-[#EF4444]">
              {activeRadical.radical}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                جذر {activeRadical.meaningAr}
              </h3>
              <span className="font-pinyin text-xs font-bold px-2.5 py-0.5 rounded bg-white dark:bg-[#1E1C1A] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 text-[#57534E] dark:text-[#A8A29E]">
                {activeRadical.pinyin} · {activeRadical.meaningEn}
              </span>
            </div>

            <div className="rounded-lg border border-[#D97706]/30 dark:border-[#F59E0B]/30 bg-[#D97706]/8 dark:bg-[#F59E0B]/10 px-3.5 py-2.5 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#78350F] dark:text-[#FDE68A] leading-relaxed">
                <strong>حيلة بصرية للحفظ:</strong> {activeRadical.memoryTipAr}
              </p>
            </div>
          </div>
        </div>

        {/* قائمة الكلمات المطابقة من المنهج */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444]" />
              <h4 className="text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                مفردات المنهج المحتوية على هذا الجذر ({activeMatches.length})
              </h4>
            </div>
            <span className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              الرمز الملوّن بالأحمر هو الرمز الحامل للجذر
            </span>
          </div>

          {activeMatches.length === 0 ? (
            <div className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#141312] p-6 text-center space-y-1">
              <p className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                لا توجد مفردات مطابقة لهذا الجذر في الفصول المفتوحة حالياً
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                ستظهر مفردات هذا الجذر تلقائياً فور تفعيل الفصول المتقدمة في حسابك.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeMatches.map((item) => {
                const isSpeaking = speakingId === item.wordId;
                return (
                  <div
                    key={`${activeRadical.id}-${item.wordId}`}
                    className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/60 dark:bg-[#141312] p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-hanzi text-2xl font-bold tracking-wide" dir="ltr">
                          {Array.from(item.hanzi).map((ch, i) => (
                            <span
                              key={i}
                              className={
                                activeMatchCharSet.has(ch)
                                  ? 'text-[#B91C1C] dark:text-[#EF4444]'
                                  : 'text-[#1C1917] dark:text-[#F5F2EB]'
                              }
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                        <p className="font-pinyin text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                          {item.pinyin}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                          {item.arabic}
                        </p>
                      </div>

                      <span className="font-hanzi text-[11px] font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1E1C1A] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 text-[#57534E] dark:text-[#A8A29E] shrink-0">
                        第{item.chapterId}课
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                      <button
                        type="button"
                        onClick={() => handlePlayWord(item.wordId, item.hanzi)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border text-xs font-bold transition-colors ${
                          isSpeaking
                            ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                            : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                        <span>استمع</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onPracticeWord(item.chapterId, item.wordId, item.matchedChar)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#1C1917] hover:bg-[#B91C1C] dark:bg-[#F5F2EB] dark:hover:bg-[#EF4444] text-white dark:text-[#121110] dark:hover:text-white text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        <PenTool className="w-3.5 h-3.5 shrink-0" />
                        <span>تدرّب على كتابته</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
