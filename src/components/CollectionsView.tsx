import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  BookOpenText,
  Check,
  Download,
  FileText,
  Grid2x2,
  LayoutGrid,
  Lock,
  MessageSquareText,
  Printer,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { ChapterData } from '../types';
import { isChapterUnlocked } from '../utils/accessControl';
import {
  downloadVocabularyWordDoc,
  NumberedVocabEntry,
  VocabSheetMode,
} from '../utils/exportVocabWord';
import { initChineseVoices, speakChinese, stopChineseSpeech } from '../utils/speech';
import { LockedAccessModal } from './LockedAccessModal';

type CollectionSubTab = 'vocab' | 'grammar' | 'dialogues';

function chunkRows<T>(items: T[], cols: number): T[][] {
  const safeCols = Math.max(1, cols);
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += safeCols) {
    rows.push(items.slice(i, i + safeCols));
  }
  return rows;
}

export function CollectionsView() {
  const { unlockedAccess } = useApp();

  const [subTab, setSubTab] = useState<CollectionSubTab>('vocab');
  const [selectedChapterId, setSelectedChapterId] = useState<'all' | number>('all');
  const [sheetMode, setSheetMode] = useState<VocabSheetMode>('hanzi-only');
  const [hanziCols, setHanziCols] = useState<5 | 6>(6);
  const [reviewCols, setReviewCols] = useState<3 | 4>(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [wordExported, setWordExported] = useState(false);
  const [lockedChapterModal, setLockedChapterModal] = useState<ChapterData | null>(null);

  useEffect(() => {
    const cleanup = initChineseVoices();
    return () => {
      cleanup();
      stopChineseSpeech();
    };
  }, []);

  const unlockedChapters = useMemo(
    () => CHAPTERS_DATA.filter((ch) => isChapterUnlocked(unlockedAccess, ch.id)),
    [unlockedAccess]
  );

  // إذا أُغلق الفصل المحدد بعد تحديث الصلاحيات، نعود تلقائياً إلى "كل الفصول المفتوحة"
  useEffect(() => {
    if (
      selectedChapterId !== 'all' &&
      !unlockedChapters.some((ch) => ch.id === selectedChapterId)
    ) {
      setSelectedChapterId('all');
    }
  }, [selectedChapterId, unlockedChapters]);

  const totalUnlockedVocab = useMemo(
    () => unlockedChapters.reduce((sum, ch) => sum + ch.vocab.length, 0),
    [unlockedChapters]
  );

  const totalUnlockedSentences = useMemo(
    () => unlockedChapters.reduce((sum, ch) => sum + ch.sentences.length, 0),
    [unlockedChapters]
  );

  const scopedChapters = useMemo(() => {
    if (selectedChapterId === 'all') return unlockedChapters;
    return unlockedChapters.filter((ch) => ch.id === selectedChapterId);
  }, [selectedChapterId, unlockedChapters]);

  const numberedEntries = useMemo<NumberedVocabEntry[]>(() => {
    const list: NumberedVocabEntry[] = [];
    let serial = 1;
    for (const ch of scopedChapters) {
      for (const v of ch.vocab) {
        list.push({
          serial,
          chapterId: ch.id,
          chapterTitleAr: ch.titleAr,
          id: v.id,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          arabic: v.arabic,
        });
        serial += 1;
      }
    }
    return list;
  }, [scopedChapters]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return numberedEntries;
    return numberedEntries.filter(
      (item) =>
        item.hanzi.includes(q) ||
        item.pinyin.toLowerCase().includes(q) ||
        item.arabic.toLowerCase().includes(q) ||
        String(item.serial) === q
    );
  }, [numberedEntries, searchQuery]);

  const activeColumns = sheetMode === 'hanzi-only' ? hanziCols : reviewCols;
  const tableRows = useMemo(
    () => chunkRows(filteredEntries, activeColumns),
    [filteredEntries, activeColumns]
  );

  const activeScopeLabelAr = useMemo(() => {
    if (selectedChapterId === 'all') {
      return unlockedChapters.length === CHAPTERS_DATA.length
        ? 'جميع الفصول (الفصل ١ – الفصل ١٥)'
        : `كل الفصول المفتوحة (${unlockedChapters.length} من ١٥)`;
    }
    const found = CHAPTERS_DATA.find((ch) => ch.id === selectedChapterId);
    return found ? `${found.titleAr} (第${found.id}课) — ${found.subtitleAr}` : `الفصل ${selectedChapterId}`;
  }, [selectedChapterId, unlockedChapters.length]);

  const fileScopeTag = useMemo(() => {
    if (selectedChapterId === 'all') {
      return unlockedChapters.length === CHAPTERS_DATA.length
        ? 'All_Ch1-15'
        : `Unlocked_${unlockedChapters.length}Ch`;
    }
    return `Ch${selectedChapterId}`;
  }, [selectedChapterId, unlockedChapters.length]);

  const handlePlayWord = (entry: NumberedVocabEntry) => {
    if (speakingId === entry.id) {
      stopChineseSpeech();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(entry.id);
    const ok = speakChinese(entry.hanzi, 0.92, {
      onEnd: () => setSpeakingId((cur) => (cur === entry.id ? null : cur)),
      onError: () => setSpeakingId((cur) => (cur === entry.id ? null : cur)),
    });
    if (!ok) {
      setSpeakingId(null);
    }
  };

  const handleExportWord = () => {
    if (filteredEntries.length === 0) return;
    downloadVocabularyWordDoc({
      entries: filteredEntries,
      mode: sheetMode,
      columnsPerRow: activeColumns,
      scopeLabelAr: activeScopeLabelAr,
      fileScopeTag,
    });
    setWordExported(true);
    window.setTimeout(() => setWordExported(false), 2600);
  };

  const handlePrintPdf = () => {
    stopChineseSpeech();
    setSpeakingId(null);
    window.print();
  };

  const handleSelectChapterFilter = (ch: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, ch.id)) {
      setLockedChapterModal(ch);
      return;
    }
    setSelectedChapterId(ch.id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="vocab-print-root mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-7"
    >
      {/* ترويسة الصفحة والتبويبات الفرعية الثلاثة (تُخفى عند الطباعة) */}
      <div className="no-print space-y-6">
        <div className="neo-frame rounded-xl p-6 sm:p-8 bg-white dark:bg-[#1E1C1A] space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="cinnabar-seal font-hanzi w-14 h-14 rounded-lg bg-[#B91C1C]/6 dark:bg-[#EF4444]/12 flex items-center justify-center text-2xl font-bold shrink-0">
                集
              </span>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                  <span>التجميعات الدراسية الشاملة</span>
                  <span aria-hidden="true">·</span>
                  <span>المستوى الأول HSK 3.0</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {unlockedChapters.length} من {CHAPTERS_DATA.length} فصل مفتوح
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{totalUnlockedVocab} مفردة متاحة</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB] [text-wrap:balance]">
                  التجميعات الشاملة للمنهج
                </h1>
                <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed max-w-2xl">
                  جداول منظّمة للمراجعة السريعة واختبار الحفظ بنظام الكتب المدرسية متعددة الأعمدة،
                  مع نطق صوتي فوري وإمكانية التحميل المباشر كملف Word أو طباعتها بصيغة PDF نظيفة
                  بالأبيض والأسود.
                </p>
              </div>
            </div>
          </div>

          {/* التبويبات الفرعية الثلاثة */}
          <div
            role="tablist"
            aria-label="أقسام التجميعات"
            className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'vocab'}
              onClick={() => setSubTab('vocab')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${
                subTab === 'vocab'
                  ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                  : 'border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <BookMarked className="w-4 h-4 shrink-0" />
              <span>تجميعة المفردات ({totalUnlockedVocab})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'grammar'}
              onClick={() => setSubTab('grammar')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${
                subTab === 'grammar'
                  ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                  : 'border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <BookOpenText className="w-4 h-4 shrink-0" />
              <span>تجميعة القواعد</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={subTab === 'dialogues'}
              onClick={() => setSubTab('dialogues')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] ${
                subTab === 'dialogues'
                  ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                  : 'border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <MessageSquareText className="w-4 h-4 shrink-0" />
              <span>تجميعة المحادثات والجمل ({totalUnlockedSentences})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* التبويب ١: تجميعة المفردات الشاملة (Vocabulary Master Sheet)           */}
      {/* ===================================================================== */}
      {subTab === 'vocab' && (
        <div className="space-y-5">
          {/* لوحة التحكم: اختيار النمط + أزرار التصدير Word/PDF + تصفية الفصول */}
          <div className="no-print rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 sm:p-6 space-y-5">
            {/* الصف العلوي: مبدّل النمط + أزرار التحميل والطباعة */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
              {/* مبدّل وضع الشيت (الوضع أ / الوضع ب) */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  اختر تخطيط شيت المفردات:
                </p>
                <div
                  role="radiogroup"
                  aria-label="وضع شيت المفردات"
                  className="inline-flex flex-wrap p-1 rounded-lg border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F2ECE1] dark:bg-[#141312] gap-1"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={sheetMode === 'hanzi-only'}
                    onClick={() => setSheetMode('hanzi-only')}
                    className={`inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                      sheetMode === 'hanzi-only'
                        ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                        : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                    }`}
                  >
                    <Grid2x2 className="w-4 h-4 shrink-0" />
                    <span>شيت اختبار الحفظ (رموز فقط)</span>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={sheetMode === 'full-review'}
                    onClick={() => setSheetMode('full-review')}
                    className={`inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                      sheetMode === 'full-review'
                        ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                        : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 shrink-0" />
                    <span>شيت المراجعة الشامل (رمز + بينين + عربي)</span>
                  </button>
                </div>
              </div>

              {/* زرا التصدير الرئيسيان: Word (.doc) وطباعة / PDF */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={filteredEntries.length === 0}
                  onClick={handleExportWord}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs sm:text-sm font-bold transition-colors disabled:opacity-45 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B91C1C]"
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
                  disabled={filteredEntries.length === 0}
                  onClick={handlePrintPdf}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/20 dark:border-[#F5F2EB]/20 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/55 dark:hover:border-[#EF4444]/55 text-[#1C1917] dark:text-[#F5F2EB] text-xs sm:text-sm font-bold transition-colors disabled:opacity-45 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C]"
                >
                  <Printer className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
                  <span>طباعة / حفظ PDF (أبيض وأسود)</span>
                </button>
              </div>
            </div>

            {/* شريط تصفية الفصول (كل الفصول المفتوحة أو فصل محدد 第1课–第15课) */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  تصفية حسب الفصل الدراسي:
                </p>

                {/* تحكم بعدد الأعمدة + البحث السريع */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 text-xs">
                    <span className="text-[#57534E] dark:text-[#A8A29E]">الأعمدة:</span>
                    {sheetMode === 'hanzi-only' ? (
                      <div className="inline-flex rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 p-0.5 bg-[#F9F6F0] dark:bg-[#121110]">
                        {([5, 6] as const).map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setHanziCols(n)}
                            className={`px-2.5 py-1 rounded text-xs font-bold tabular-nums transition-colors ${
                              hanziCols === n
                                ? 'bg-[#1C1917] dark:bg-[#F5F2EB] text-white dark:text-[#121110]'
                                : 'text-[#57534E] dark:text-[#A8A29E]'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="inline-flex rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 p-0.5 bg-[#F9F6F0] dark:bg-[#121110]">
                        {([3, 4] as const).map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewCols(n)}
                            className={`px-2.5 py-1 rounded text-xs font-bold tabular-nums transition-colors ${
                              reviewCols === n
                                ? 'bg-[#1C1917] dark:bg-[#F5F2EB] text-white dark:text-[#121110]'
                                : 'text-[#57534E] dark:text-[#A8A29E]'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* مربع البحث السريع */}
                  <div className="relative w-56 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#57534E] dark:text-[#A8A29E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث بالرمز أو البينين أو المعنى..."
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
                  onClick={() => setSelectedChapterId('all')}
                  className={`px-3.5 py-2 min-h-[38px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap tabular-nums ${
                    selectedChapterId === 'all'
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/45'
                  }`}
                >
                  كل الفصول المفتوحة (الكل · {totalUnlockedVocab})
                </button>

                {CHAPTERS_DATA.map((ch) => {
                  const unlocked = isChapterUnlocked(unlockedAccess, ch.id);
                  const isActive = selectedChapterId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      title={`${ch.titleAr}: ${ch.subtitleAr} (${ch.vocab.length} مفردة)`}
                      onClick={() => handleSelectChapterFilter(ch)}
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

            {/* سطر معلوماتي هادئ عن النطاق الحالي والاستماع */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 text-xs text-[#57534E] dark:text-[#A8A29E]">
              <div className="flex flex-wrap items-center gap-2 tabular-nums">
                <span className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  {activeScopeLabelAr}
                </span>
                <span aria-hidden="true">·</span>
                <span>المعروض حالياً: {filteredEntries.length} مفردة</span>
              </div>
              <span className="inline-flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#EF4444]" />
                <span>اضغط على أي مفردة في الجدول للاستماع إلى نطقها الصيني</span>
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* الورقة القابلة للطباعة والعرض (A4 Master Vocabulary Sheet)         */}
          {/* ================================================================= */}
          <div className="vocab-print-sheet rounded-xl border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] p-4 sm:p-6 shadow-xs">
            {/* الترويسة الرسمية التي تظهر فقط في الطباعة / PDF بالأبيض والأسود */}
            <div className="hidden print-only text-center border-b-2 border-black pb-2.5 mb-3">
              <h2 className="text-lg font-bold text-black">
                تجميعة مفردات المستوى الأول HSK 3.0 — المعلم Laohu
              </h2>
              <p className="text-xs text-black mt-1">
                {sheetMode === 'hanzi-only'
                  ? 'شيت اختبار الحفظ — الرموز الصينية فقط'
                  : 'شيت المراجعة الشامل — الرموز والبينين والمعنى العربي'}{' '}
                · {activeScopeLabelAr} · الإجمالي: {filteredEntries.length} مفردة
              </p>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  لا توجد مفردات مطابقة لبحثك
                </p>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                  جرّب مسح مربع البحث أو اختيار «كل الفصول المفتوحة».
                </p>
              </div>
            ) : sheetMode === 'hanzi-only' ? (
              /* ============================================================= */
              /* الوضع أ: شيت اختبار الحفظ — شبكة 5 أو 6 أعمدة (رقم + رمز فقط) */
              /* ============================================================= */
              <div className="overflow-x-auto">
                <table
                  dir="ltr"
                  className="vocab-print-table w-full min-w-[680px] border-collapse table-fixed"
                >
                  <tbody>
                    {tableRows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {Array.from({ length: hanziCols }, (_, colIdx) => {
                          const entry = row[colIdx];
                          if (!entry) {
                            return (
                              <td
                                key={`empty-${rowIdx}-${colIdx}`}
                                colSpan={2}
                                className="border border-[#1C1917]/20 dark:border-[#F5F2EB]/20 bg-[#F9F6F0]/45 dark:bg-[#141312]/45"
                              />
                            );
                          }
                          const isSpeaking = speakingId === entry.id;
                          return (
                            <Fragment key={entry.id}>
                              <td
                                style={{ width: `${(28 / hanziCols).toFixed(2)}%` }}
                                className="vocab-serial-cell border border-[#1C1917]/25 dark:border-[#F5F2EB]/25 bg-[#EFEAE0] dark:bg-[#292623] text-center text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums py-2 px-1 select-none"
                              >
                                {entry.serial}
                              </td>
                              <td
                                style={{ width: `${(72 / hanziCols).toFixed(2)}%` }}
                                onClick={() => handlePlayWord(entry)}
                                title={`اضغط للاستماع لنطق: ${entry.hanzi}`}
                                className={`group border border-[#1C1917]/25 dark:border-[#F5F2EB]/25 text-center py-2.5 px-1.5 cursor-pointer transition-colors select-none ${
                                  isSpeaking
                                    ? 'bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444]'
                                    : 'bg-white dark:bg-[#1E1C1A] hover:bg-[#F9F6F0] dark:hover:bg-[#25221F] text-[#1C1917] dark:text-[#F5F2EB]'
                                }`}
                              >
                                <div className="relative flex items-center justify-center">
                                  <span className="font-hanzi text-lg sm:text-xl font-bold leading-snug">
                                    {entry.hanzi}
                                  </span>
                                  <Volume2
                                    className={`no-print w-3 h-3 absolute right-0.5 transition-opacity ${
                                      isSpeaking
                                        ? 'opacity-100 text-[#B91C1C] dark:text-[#EF4444]'
                                        : 'opacity-0 group-hover:opacity-65 text-[#57534E] dark:text-[#A8A29E]'
                                    }`}
                                  />
                                </div>
                              </td>
                            </Fragment>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ============================================================= */
              /* الوضع ب: شيت المراجعة الشامل — 3 أو 4 أعمدة (رقم/رمز/بينين/عربي) */
              /* ============================================================= */
              <div className="overflow-x-auto">
                <table
                  dir="ltr"
                  className="vocab-print-table w-full min-w-[760px] border-collapse table-fixed"
                >
                  <tbody>
                    {tableRows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {Array.from({ length: reviewCols }, (_, colIdx) => {
                          const entry = row[colIdx];
                          if (!entry) {
                            return (
                              <td
                                key={`empty-r-${rowIdx}-${colIdx}`}
                                className="border border-[#1C1917]/20 dark:border-[#F5F2EB]/20 bg-[#F9F6F0]/45 dark:bg-[#141312]/45"
                              />
                            );
                          }
                          const isSpeaking = speakingId === entry.id;
                          return (
                            <td
                              key={`rev-${entry.id}`}
                              onClick={() => handlePlayWord(entry)}
                              title={`اضغط للاستماع لنطق: ${entry.hanzi}`}
                              className={`group border border-[#1C1917]/25 dark:border-[#F5F2EB]/25 p-0 align-middle cursor-pointer transition-colors ${
                                isSpeaking
                                  ? 'bg-[#B91C1C]/10 dark:bg-[#EF4444]/16'
                                  : 'bg-white dark:bg-[#1E1C1A] hover:bg-[#F9F6F0] dark:hover:bg-[#25221F]'
                              }`}
                            >
                              <div className="flex items-stretch min-h-[46px]">
                                {/* خلية الرقم التسلسلي المظللة */}
                                <div className="vocab-serial-cell w-9 shrink-0 bg-[#EFEAE0] dark:bg-[#292623] border-r border-[#1C1917]/20 dark:border-[#F5F2EB]/20 flex items-center justify-center text-[11px] font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums">
                                  {entry.serial}
                                </div>

                                {/* الرمز + البينين + المعنى العربي */}
                                <div className="flex-1 grid grid-cols-12 items-center gap-1 px-2 py-1.5">
                                  <div className="col-span-4 text-center">
                                    <span
                                      className={`font-hanzi text-base font-bold leading-tight block ${
                                        isSpeaking
                                          ? 'text-[#B91C1C] dark:text-[#EF4444]'
                                          : 'text-[#1C1917] dark:text-[#F5F2EB]'
                                      }`}
                                    >
                                      {entry.hanzi}
                                    </span>
                                  </div>

                                  <div className="col-span-4 text-center border-x border-[#1C1917]/10 dark:border-[#F5F2EB]/10 px-1">
                                    <span className="vocab-pinyin-text font-pinyin text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E] leading-tight block break-words">
                                      {entry.pinyin}
                                    </span>
                                  </div>

                                  <div
                                    dir="rtl"
                                    className="col-span-4 text-right pr-1 flex items-center justify-between gap-1"
                                  >
                                    <span className="vocab-arabic-text text-[11px] sm:text-xs font-semibold text-[#1C1917] dark:text-[#F5F2EB] leading-snug">
                                      {entry.arabic}
                                    </span>
                                    <Volume2
                                      className={`no-print w-3 h-3 shrink-0 transition-opacity ${
                                        isSpeaking
                                          ? 'opacity-100 text-[#B91C1C] dark:text-[#EF4444]'
                                          : 'opacity-0 group-hover:opacity-65 text-[#57534E] dark:text-[#A8A29E]'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* تذييل الطباعة فقط */}
            <div className="hidden print-only text-center text-[10px] text-black mt-3 pt-2 border-t border-black">
              بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* التبويب ٢: تجميعة القواعد (مهيّأ للخطوة القادمة)                        */}
      {/* ===================================================================== */}
      {subTab === 'grammar' && (
        <div className="no-print neo-frame rounded-xl p-8 sm:p-12 bg-white dark:bg-[#1E1C1A] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-xl border border-[#D97706]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 flex items-center justify-center">
            <FileText className="w-7 h-7 text-[#B45309] dark:text-[#F59E0B]" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <p className="text-xs font-bold text-[#B45309] dark:text-[#F59E0B]">
              قريباً في التحديث القادم
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              تجميعة القواعد النحوية للمستوى الأول (HSK 3.0)
            </h2>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              يجري تجهيز ملخص القواعد الشامل لجميع الفصول الخمسة عشر (بما يشمل التراكيب الأساسية،
              أدوات الاستفهام، النفي <span className="font-hanzi">不/没</span>،{' '}
              <span className="font-hanzi">了</span>،{' '}
              <span className="font-hanzi">在/正在</span>، والأفعال المنفصلة) مع التصدير المباشر
              بصيغة Word وPDF.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubTab('vocab')}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <BookMarked className="w-4 h-4" />
              <span>استعراض تجميعة المفردات الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* التبويب ٣: تجميعة المحادثات والجمل (مهيّأ للخطوة القادمة)               */}
      {/* ===================================================================== */}
      {subTab === 'dialogues' && (
        <div className="no-print neo-frame rounded-xl p-8 sm:p-12 bg-white dark:bg-[#1E1C1A] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-xl border border-[#15803D]/35 bg-[#15803D]/10 dark:bg-[#22C55E]/15 flex items-center justify-center">
            <MessageSquareText className="w-7 h-7 text-[#15803D] dark:text-[#22C55E]" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <p className="text-xs font-bold text-[#15803D] dark:text-[#22C55E] tabular-nums">
              قريباً في التحديث القادم · {totalUnlockedSentences} جملة جاهزة للإدراج
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              تجميعة المحادثات والجمل التطبيقية
            </h2>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              ستضم هذه المساحة جميع الجمل والحوارات المنهجية (٢٧٨ جملة عبر الفصول الـ ١٥) بنظام
              جداول منظمة مع الاستماع الصوتي والتصدير المباشر لملفات Word وPDF.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubTab('vocab')}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <BookMarked className="w-4 h-4" />
              <span>استعراض تجميعة المفردات الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* نافذة القفل عند الضغط على فصل غير مفعّل */}
      <LockedAccessModal
        isOpen={Boolean(lockedChapterModal)}
        itemTitle={
          lockedChapterModal
            ? `${lockedChapterModal.titleAr} (第${lockedChapterModal.id}课)`
            : ''
        }
        itemType="chapter"
        onClose={() => setLockedChapterModal(null)}
      />
    </motion.section>
  );
}
