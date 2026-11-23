import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpenText,
  Check,
  Download,
  Eye,
  EyeOff,
  Lock,
  Maximize2,
  Printer,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { GRAMMAR_COLLECTION_DATA } from '../../data/grammarCollectionData';
import { ChapterData } from '../../types';
import { isChapterUnlocked } from '../../utils/accessControl';
import { downloadGrammarWordDoc } from '../../utils/exportCollectionsDocs';
import { speakChinese, stopChineseSpeech } from '../../utils/speech';
import { RubyChinese } from '../RubyChinese';

interface GrammarCollectionTabProps {
  onSelectLockedChapter: (chapter: ChapterData) => void;
}

export function GrammarCollectionTab({ onSelectLockedChapter }: GrammarCollectionTabProps) {
  const { unlockedAccess, showPinyin, togglePinyin } = useApp();

  const [selectedLessonId, setSelectedLessonId] = useState<'all' | number>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [wordExported, setWordExported] = useState(false);

  const unlockedChapters = useMemo(
    () => CHAPTERS_DATA.filter((ch) => isChapterUnlocked(unlockedAccess, ch.id)),
    [unlockedAccess]
  );

  const unlockedLessonIds = useMemo(
    () => new Set(unlockedChapters.map((ch) => ch.id)),
    [unlockedChapters]
  );

  useEffect(() => {
    if (selectedLessonId !== 'all' && !unlockedLessonIds.has(selectedLessonId)) {
      setSelectedLessonId('all');
    }
  }, [selectedLessonId, unlockedLessonIds]);

  useEffect(() => {
    return () => {
      stopChineseSpeech();
    };
  }, []);

  const scopedCards = useMemo(() => {
    const unlockedCards = GRAMMAR_COLLECTION_DATA.filter((card) =>
      unlockedLessonIds.has(card.lessonId)
    );
    if (selectedLessonId === 'all') return unlockedCards;
    return unlockedCards.filter((card) => card.lessonId === selectedLessonId);
  }, [selectedLessonId, unlockedLessonIds]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return scopedCards;
    return scopedCards.filter(
      (card) =>
        card.titleAr.toLowerCase().includes(q) ||
        card.titleZh.toLowerCase().includes(q) ||
        card.formula.toLowerCase().includes(q) ||
        card.explanationAr.toLowerCase().includes(q) ||
        card.examTrapTipAr.toLowerCase().includes(q) ||
        card.examples.some(
          (ex) =>
            ex.hanzi.includes(q) ||
            ex.pinyin.toLowerCase().includes(q) ||
            ex.arabic.toLowerCase().includes(q)
        )
    );
  }, [scopedCards, searchQuery]);

  const totalUnlockedGrammarCount = useMemo(
    () => GRAMMAR_COLLECTION_DATA.filter((c) => unlockedLessonIds.has(c.lessonId)).length,
    [unlockedLessonIds]
  );

  const activeScopeLabelAr = useMemo(() => {
    if (selectedLessonId === 'all') {
      return unlockedChapters.length === CHAPTERS_DATA.length
        ? 'جميع الفصول (الفصل ١ – الفصل ١٥)'
        : `كل الفصول المفتوحة (${unlockedChapters.length} من ١٥)`;
    }
    const found = CHAPTERS_DATA.find((ch) => ch.id === selectedLessonId);
    return found ? `${found.titleAr} (第${found.id}课) — ${found.subtitleAr}` : `الفصل ${selectedLessonId}`;
  }, [selectedLessonId, unlockedChapters.length]);

  const fileScopeTag = useMemo(() => {
    if (selectedLessonId === 'all') {
      return unlockedChapters.length === CHAPTERS_DATA.length
        ? 'All_Ch1-15'
        : `Unlocked_${unlockedChapters.length}Ch`;
    }
    return `Ch${selectedLessonId}`;
  }, [selectedLessonId, unlockedChapters.length]);

  const handlePlayExample = (exampleId: string, hanzi: string, rate: 1.0 | 0.7) => {
    const key = `${exampleId}-${rate}`;
    if (speakingKey === key) {
      stopChineseSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    const ok = speakChinese(hanzi, rate, {
      onEnd: () => setSpeakingKey((cur) => (cur === key ? null : cur)),
      onError: () => setSpeakingKey((cur) => (cur === key ? null : cur)),
    });
    if (!ok) setSpeakingKey(null);
  };

  const handleExportWord = () => {
    if (filteredCards.length === 0) return;
    downloadGrammarWordDoc({
      cards: filteredCards,
      scopeLabelAr: activeScopeLabelAr,
      fileScopeTag,
    });
    setWordExported(true);
    window.setTimeout(() => setWordExported(false), 2600);
  };

  const handlePrintPdf = () => {
    stopChineseSpeech();
    setSpeakingKey(null);
    window.print();
  };

  const handleSelectLesson = (ch: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, ch.id)) {
      onSelectLockedChapter(ch);
      return;
    }
    setSelectedLessonId(ch.id);
  };

  return (
    <div className="space-y-5">
      {/* شريط التحكم العلوي للقواعد */}
      <div className="no-print rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpenText className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                تجميعة القواعد الشاملة (الفصل ١ – الفصل ١٥)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
              شرح عربي واضح لكل قاعدة نحوية في منهج HSK 3.0 مع القالب النحوي وتنبيهات أخطاء
              الامتحان وأمثلة منهجية بالبينين والصوت.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#D97706]/8 dark:bg-[#F59E0B]/12 text-[#92400E] dark:text-[#F59E0B] text-xs font-bold whitespace-nowrap shrink-0">
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              <span>مقاس الطباعة: A4 عمودي (دليل القواعد)</span>
            </div>

            <button
              type="button"
              disabled={filteredCards.length === 0}
              onClick={handleExportWord}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs sm:text-sm font-bold transition-colors disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              {wordExported ? (
                <>
                  <Check className="w-4 h-4 shrink-0" />
                  <span>تم تحميل ملف Word</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <span>تحميل ملف Word (.doc)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={filteredCards.length === 0}
              onClick={handlePrintPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/20 dark:border-[#F5F2EB]/20 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/55 dark:hover:border-[#EF4444]/55 text-[#1C1917] dark:text-[#F5F2EB] text-xs sm:text-sm font-bold transition-colors disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
              <span>طباعة / حفظ PDF (أبيض وأسود)</span>
            </button>
          </div>
        </div>

        {/* التصفية بالفصول + زر البينين + البحث */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              تصفية القواعد حسب الدرس:
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={togglePinyin}
                aria-pressed={showPinyin}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap ${
                  showPinyin
                    ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                    : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E]'
                }`}
              >
                {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showPinyin ? 'إخفاء البينين (Ruby)' : 'إظهار البينين (Ruby)'}</span>
              </button>

              <div className="relative w-56 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#57534E] dark:text-[#A8A29E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في القواعد (مثلاً: 了، 在، 吗)..."
                  className="w-full pr-8 pl-8 py-1.5 min-h-[38px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-xs text-[#1C1917] dark:text-[#F5F2EB] placeholder:text-[#57534E]/75 dark:placeholder:text-[#A8A29E]/75 focus:outline-none focus:border-[#B91C1C] dark:focus:border-[#EF4444]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="مسح البحث"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#B91C1C]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedLessonId('all')}
              className={`px-3.5 py-2 min-h-[38px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap tabular-nums ${
                selectedLessonId === 'all'
                  ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                  : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45'
              }`}
            >
              كل الفصول ({totalUnlockedGrammarCount} قاعدة)
            </button>

            {CHAPTERS_DATA.map((ch) => {
              const unlocked = isChapterUnlocked(unlockedAccess, ch.id);
              const isActive = selectedLessonId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  title={`${ch.titleAr}: ${ch.subtitleAr}`}
                  onClick={() => handleSelectLesson(ch)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap tabular-nums ${
                    !unlocked
                      ? 'border-[#D97706]/25 dark:border-[#F59E0B]/25 bg-[#F2ECE1]/60 dark:bg-[#181614] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/55'
                      : isActive
                        ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                        : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45'
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

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 text-xs text-[#57534E] dark:text-[#A8A29E]">
          <div className="flex flex-wrap items-center gap-2 tabular-nums">
            <span className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {activeScopeLabelAr}
            </span>
            <span aria-hidden="true">·</span>
            <span>المعروض حالياً: {filteredCards.length} قاعدة نحوية</span>
          </div>
          <span>يدعم التشغيل الصوتي لكل مثال بسرعتين (1.0x عادي · 0.7x بطيء)</span>
        </div>
      </div>

      {/* بطاقات القواعد التفاعلية (تُخفى عند الطباعة لصالح نسخة الطباعة B&W) */}
      <div className="no-print space-y-5">
        {filteredCards.length === 0 ? (
          <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] py-12 text-center space-y-2">
            <p className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              لا توجد قواعد مطابقة لبحثك
            </p>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              جرّب مسح مربع البحث أو اختيار «كل الفصول».
            </p>
          </div>
        ) : (
          filteredCards.map((card, idx) => (
            <article
              key={card.id}
              className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] overflow-hidden shadow-xs"
            >
              {/* رأس بطاقة القاعدة */}
              <div className="px-5 py-4 bg-[#F2ECE1]/75 dark:bg-[#25221F] border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#B91C1C]/30 dark:border-[#EF4444]/35 bg-[#B91C1C]/8 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444] text-xs font-bold whitespace-nowrap">
                    <span className="font-hanzi">{card.lessonLabelZh}</span>
                    <span>· {card.lessonTitleAr}</span>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    <span className="tabular-nums text-[#57534E] dark:text-[#A8A29E] ml-1.5">
                      {idx + 1}.
                    </span>
                    {card.titleAr}
                  </h3>
                </div>
                <span className="font-hanzi text-xs sm:text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  {card.titleZh}
                </span>
              </div>

              {/* محتوى بطاقة القاعدة */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* صندوق القاعدة / الصيغة */}
                <div className="rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs font-bold text-[#B91C1C] dark:text-[#EF4444] shrink-0">
                    القالب / الصيغة النحوية:
                  </span>
                  <code className="font-hanzi text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] bg-transparent">
                    {card.formula}
                  </code>
                </div>

                {/* الشرح العربي */}
                <p className="text-sm text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed">
                  {card.explanationAr}
                </p>

                {/* تنبيه امتحاني / فخ شائع */}
                <div className="rounded-lg border border-[#D97706]/35 dark:border-[#F59E0B]/30 bg-[#D97706]/8 dark:bg-[#F59E0B]/10 px-4 py-3 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#78350F] dark:text-[#FDE68A] leading-relaxed font-medium">
                    {card.examTrapTipAr}
                  </p>
                </div>

                {/* أمثلة منهجية مع Ruby Pinyin والصوت */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                    أمثلة تطبيقية من المنهج:
                  </p>
                  <div className="divide-y divide-[#1C1917]/10 dark:divide-[#F5F2EB]/10 rounded-lg border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 overflow-hidden">
                    {card.examples.map((ex, exIdx) => {
                      const activeNormal = speakingKey === `${ex.id}-1`;
                      const activeSlow = speakingKey === `${ex.id}-0.7`;
                      return (
                        <div
                          key={ex.id}
                          className="p-3.5 sm:px-4 bg-white dark:bg-[#1E1C1A] hover:bg-[#F9F6F0]/60 dark:hover:bg-[#25221F]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 mt-1 rounded bg-[#F2ECE1] dark:bg-[#292623] text-[#57534E] dark:text-[#A8A29E] text-[11px] font-bold tabular-nums flex items-center justify-center shrink-0">
                                {exIdx + 1}
                              </span>
                              <div className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                                <RubyChinese
                                  hanzi={ex.hanzi}
                                  pinyin={ex.pinyin}
                                  showPinyin={showPinyin}
                                />
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] pr-7">
                              {ex.arabic}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handlePlayExample(ex.id, ex.hanzi, 1.0)}
                              title="استماع بالسرعة العادية"
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
                                activeNormal
                                  ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                                  : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50'
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5 shrink-0" />
                              <span>1.0x</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePlayExample(ex.id, ex.hanzi, 0.7)}
                              title="استماع بسرعة بطيئة للمبتدئين"
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
                                activeSlow
                                  ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706] dark:bg-[#F59E0B] text-white dark:text-[#121110]'
                                  : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/50'
                              }`}
                            >
                              <span>0.7x</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* نسخة الطباعة / PDF بالأبيض والأسود (A4 عمودي) */}
      {filteredCards.length > 0 && (
        <div className="hidden print-only vocab-cat-print-sheet" dir="rtl">
          <div className="vocab-cat-print-header">
            <h2>تجميعة القواعد الشاملة للمستوى الأول HSK 3.0 — المعلم Laohu</h2>
            <p>
              {activeScopeLabelAr} · إجمالي القواعد: {filteredCards.length} قاعدة نحوية
            </p>
          </div>

          {filteredCards.map((card, idx) => (
            <div key={`p-${card.id}`} className="grammar-print-card">
              <div className="grammar-print-head">
                <span>
                  [{card.lessonLabelZh} · {card.lessonTitleAr}] {idx + 1}. {card.titleAr}
                </span>
                <span className="font-hanzi" dir="ltr">
                  {card.titleZh}
                </span>
              </div>
              <div className="grammar-print-body">
                <div className="grammar-print-formula">
                  <strong>القاعدة / الصيغة:</strong>{' '}
                  <span className="font-hanzi">{card.formula}</span>
                </div>
                <p className="grammar-print-exp">{card.explanationAr}</p>
                <div className="grammar-print-trap">
                  <strong>تنبيه امتحاني:</strong> {card.examTrapTipAr}
                </div>
                <table className="vocab-cat-print-table">
                  <thead>
                    <tr>
                      <th style={{ width: '6%' }}>#</th>
                      <th style={{ width: '52%' }}>المثال الصيني والنطق (Hanzi &amp; Pinyin)</th>
                      <th style={{ width: '42%' }}>الترجمة بالعربية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {card.examples.map((ex, exIdx) => (
                      <tr key={`pex-${ex.id}`}>
                        <td className="cat-p-num tabular-nums">{exIdx + 1}</td>
                        <td dir="ltr" style={{ textAlign: 'left' }}>
                          <div className="font-hanzi" style={{ fontWeight: 700, fontSize: '10.5pt' }}>
                            {ex.hanzi}
                          </div>
                          <div className="font-pinyin" style={{ fontSize: '8.5pt', color: '#222' }}>
                            {ex.pinyin}
                          </div>
                        </td>
                        <td className="cat-p-arabic">{ex.arabic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="vocab-cat-print-footer">
            بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu · دليل القواعد الشامل
          </div>
        </div>
      )}
    </div>
  );
}
