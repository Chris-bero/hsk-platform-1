import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUp,
  Check,
  Download,
  Eye,
  EyeOff,
  Lock,
  Maximize2,
  MessageSquareText,
  Printer,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTERS_DATA } from '../../data/chaptersData';
import { ChapterData } from '../../types';
import { isChapterUnlocked } from '../../utils/accessControl';
import { downloadDialoguesWordDoc } from '../../utils/exportCollectionsDocs';
import { speakChinese, stopChineseSpeech } from '../../utils/speech';
import { BookmarkNoteControls } from '../BookmarkNoteControls';
import { RubyChinese } from '../RubyChinese';

interface DialoguesCollectionTabProps {
  onSelectLockedChapter: (chapter: ChapterData) => void;
}

export function DialoguesCollectionTab({
  onSelectLockedChapter,
}: DialoguesCollectionTabProps) {
  const { unlockedAccess, showPinyin, togglePinyin } = useApp();

  const [selectedChapterId, setSelectedChapterId] = useState<'all' | number>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [wordExported, setWordExported] = useState(false);

  const unlockedChapters = useMemo(
    () => CHAPTERS_DATA.filter((ch) => isChapterUnlocked(unlockedAccess, ch.id)),
    [unlockedAccess]
  );

  useEffect(() => {
    if (
      selectedChapterId !== 'all' &&
      !unlockedChapters.some((ch) => ch.id === selectedChapterId)
    ) {
      setSelectedChapterId('all');
    }
  }, [selectedChapterId, unlockedChapters]);

  useEffect(() => {
    return () => {
      stopChineseSpeech();
    };
  }, []);

  const totalUnlockedSentences = useMemo(
    () => unlockedChapters.reduce((sum, ch) => sum + ch.sentences.length, 0),
    [unlockedChapters]
  );

  const scopedChapters = useMemo(() => {
    if (selectedChapterId === 'all') return unlockedChapters;
    return unlockedChapters.filter((ch) => ch.id === selectedChapterId);
  }, [selectedChapterId, unlockedChapters]);

  const filteredChapters = useMemo<ChapterData[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return scopedChapters;
    return scopedChapters
      .map((ch) => ({
        ...ch,
        sentences: ch.sentences.filter(
          (s) =>
            s.hanzi.includes(q) ||
            s.pinyin.toLowerCase().includes(q) ||
            s.arabic.toLowerCase().includes(q)
        ),
      }))
      .filter((ch) => ch.sentences.length > 0);
  }, [scopedChapters, searchQuery]);

  const filteredSentenceCount = useMemo(
    () => filteredChapters.reduce((sum, ch) => sum + ch.sentences.length, 0),
    [filteredChapters]
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

  const handlePlaySentence = (sentenceId: string, hanzi: string, rate: 1.0 | 0.7) => {
    const key = `${sentenceId}-${rate}`;
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
    if (filteredSentenceCount === 0) return;
    downloadDialoguesWordDoc({
      chapters: filteredChapters,
      totalSentences: filteredSentenceCount,
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

  const handleSelectChapter = (ch: ChapterData) => {
    if (!isChapterUnlocked(unlockedAccess, ch.id)) {
      onSelectLockedChapter(ch);
      return;
    }
    setSelectedChapterId(ch.id);
  };

  const scrollToTopControls = () => {
    const el = document.getElementById('dialogues-top-controls');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-5">
      {/* شريط التحكم العلوي لتجميعة المحادثات والجمل */}
      <div
        id="dialogues-top-controls"
        className="no-print scroll-mt-24 rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 sm:p-6 space-y-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-[#15803D] dark:text-[#22C55E]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                تجميعة المحادثات والجمل التطبيقية (278 جملة)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
              جميع الجمل والحوارات المنهجية مصنّفة حسب الفصول مع البينين التفاعلي فوق كل رمز
              والتشغيل الصوتي بسرعتين والتصدير المباشر لملف Word وPDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#D97706]/8 dark:bg-[#F59E0B]/12 text-[#92400E] dark:text-[#F59E0B] text-xs font-bold whitespace-nowrap shrink-0">
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              <span>مقاس الطباعة: A4 عمودي (المحادثات والجمل)</span>
            </div>

            <button
              type="button"
              disabled={filteredSentenceCount === 0}
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
              disabled={filteredSentenceCount === 0}
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
              تصفية الجمل حسب الفصل الدراسي:
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
                  placeholder="ابحث في الجمل بالصيني أو العربي..."
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
              كل الفصول المفتوحة ({totalUnlockedSentences} جملة)
            </button>

            {CHAPTERS_DATA.map((ch) => {
              const unlocked = isChapterUnlocked(unlockedAccess, ch.id);
              const isActive = selectedChapterId === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  title={`${ch.titleAr}: ${ch.subtitleAr} (${ch.sentences.length} جملة)`}
                  onClick={() => handleSelectChapter(ch)}
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
            <span>المعروض حالياً: {filteredSentenceCount} جملة</span>
          </div>
          <span>اضغط على أي جملة أو زر الصوت للاستماع (1.0x عادي · 0.7x بطيء)</span>
        </div>
      </div>

      {/* عرض الجمل المجمّعة حسب الفصل على الشاشة */}
      <div className="no-print space-y-6">
        {filteredChapters.length === 0 ? (
          <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] py-12 text-center space-y-2">
            <p className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              لا توجد جمل مطابقة لبحثك
            </p>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              جرّب مسح مربع البحث أو اختيار «كل الفصول المفتوحة».
            </p>
          </div>
        ) : (
          filteredChapters.map((ch) => (
            <section
              key={ch.id}
              className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] overflow-hidden shadow-xs"
            >
              <div className="px-4 sm:px-5 py-3.5 bg-[#F2ECE1]/75 dark:bg-[#25221F] border-b border-[#1C1917]/12 dark:border-[#F5F2EB]/12 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-[#15803D]/30 dark:border-[#22C55E]/35 bg-[#15803D]/8 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E] text-xs font-bold font-hanzi">
                    第{ch.id}课
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    {ch.titleAr}:{' '}
                    <span className="font-semibold text-[#57534E] dark:text-[#A8A29E]">
                      {ch.subtitleAr}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                    {ch.sentences.length} جملة
                  </span>
                  <button
                    type="button"
                    onClick={scrollToTopControls}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/50 text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors whitespace-nowrap"
                  >
                    <span>أعلى الصفحة</span>
                    <ArrowUp className="w-3 h-3 shrink-0" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-[#1C1917]/10 dark:divide-[#F5F2EB]/10">
                {ch.sentences.map((s, idx) => {
                  const activeNormal = speakingKey === `${s.id}-1`;
                  const activeSlow = speakingKey === `${s.id}-0.7`;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handlePlaySentence(s.id, s.hanzi, 1.0)}
                      className={`px-4 sm:px-5 py-3.5 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        activeNormal || activeSlow
                          ? 'bg-[#B91C1C]/8 dark:bg-[#EF4444]/14'
                          : 'hover:bg-[#F9F6F0]/75 dark:hover:bg-[#25221F]/65'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-7 h-7 mt-0.5 rounded-md bg-[#F2ECE1] dark:bg-[#292623] text-[#57534E] dark:text-[#A8A29E] text-xs font-bold tabular-nums flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="space-y-1.5 min-w-0">
                          <div className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                            <RubyChinese
                              hanzi={s.hanzi}
                              pinyin={s.pinyin}
                              showPinyin={showPinyin}
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
                            {s.arabic}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handlePlaySentence(s.id, s.hanzi, 1.0)}
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
                          onClick={() => handlePlaySentence(s.id, s.hanzi, 0.7)}
                          title="استماع بسرعة بطيئة للمبتدئين"
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
                            activeSlow
                              ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706] dark:bg-[#F59E0B] text-white dark:text-[#121110]'
                              : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/50'
                          }`}
                        >
                          <span>0.7x</span>
                        </button>

                        <BookmarkNoteControls
                          itemType="sentence"
                          itemId={s.id}
                          chapterId={ch.id}
                          hanzi={s.hanzi}
                          pinyin={s.pinyin}
                          arabic={s.arabic}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* نسخة الطباعة / PDF بالأبيض والأسود (A4 عمودي) */}
      {filteredSentenceCount > 0 && (
        <div className="hidden print-only vocab-cat-print-sheet" dir="rtl">
          <div className="vocab-cat-print-header">
            <h2>تجميعة المحادثات والجمل للمستوى الأول HSK 3.0 — المعلم Laohu</h2>
            <p>
              {activeScopeLabelAr} · إجمالي الجمل: {filteredSentenceCount} جملة
            </p>
          </div>

          {filteredChapters.map((ch) => (
            <div key={`pdlg-${ch.id}`} className="vocab-cat-print-section">
              <div className="vocab-cat-print-section-head">
                <span className="font-hanzi" dir="ltr">
                  第{ch.id}课
                </span>{' '}
                — {ch.titleAr}: {ch.subtitleAr} ({ch.sentences.length} جملة)
              </div>
              <table className="vocab-cat-print-table">
                <thead>
                  <tr>
                    <th style={{ width: '6%' }}>#</th>
                    <th style={{ width: '52%' }}>الجملة الصينية والنطق (Hanzi &amp; Pinyin)</th>
                    <th style={{ width: '42%' }}>الترجمة بالعربية</th>
                  </tr>
                </thead>
                <tbody>
                  {ch.sentences.map((s, idx) => (
                    <tr key={`ps-${s.id}`}>
                      <td className="cat-p-num tabular-nums">{idx + 1}</td>
                      <td dir="ltr" style={{ textAlign: 'left' }}>
                        <div className="font-hanzi" style={{ fontWeight: 700, fontSize: '10.5pt' }}>
                          {s.hanzi}
                        </div>
                        <div className="font-pinyin" style={{ fontSize: '8.5pt', color: '#222' }}>
                          {s.pinyin}
                        </div>
                      </td>
                      <td className="cat-p-arabic">{s.arabic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="vocab-cat-print-footer">
            بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu · تجميعة المحادثات والجمل
          </div>
        </div>
      )}
    </div>
  );
}
