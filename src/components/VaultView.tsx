import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Play,
  Printer,
  RotateCcw,
  Star,
  StickyNote,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { AppView, StudyBookmarkItemType } from '../types';
import { initChineseVoices, speakChinese, stopChineseSpeech } from '../utils/speech';
import { RubyChinese } from './RubyChinese';

interface VaultViewProps {
  onNavigate: (view: AppView) => void;
}

type VaultFilter = 'all' | 'vocab' | 'sentence' | 'notes-only';
type VaultPracticeMode = 'flashcards' | 'quiz';

interface ResolvedVaultItem {
  key: string;
  itemType: StudyBookmarkItemType;
  itemId: string;
  chapterId: number;
  chapterTitleAr: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
  bookmarked: boolean;
  note: string;
  updatedAt: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function VaultView({ onNavigate }: VaultViewProps) {
  const {
    currentStudent,
    studyVault,
    showPinyin,
    togglePinyin,
    saveItemNote,
    removeVaultEntry,
  } = useApp();

  const [filter, setFilter] = useState<VaultFilter>('all');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [editingNoteKey, setEditingNoteKey] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // وضع مراجعة محفوظاتي التفاعلي (بطاقات مراجعة / اختبار سريع)
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceMode, setPracticeMode] = useState<VaultPracticeMode>('flashcards');
  const [practiceDeck, setPracticeDeck] = useState<ResolvedVaultItem[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // حالة الاختبار السريع داخل محفوظاتي
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const cleanup = initChineseVoices();
    return () => {
      cleanup();
      stopChineseSpeech();
    };
  }, []);

  // ضبط صفحة الطباعة لـ A4 عمودي أثناء عرض خزنة ليلة الامتحان
  useEffect(() => {
    const styleId = 'vault-dynamic-print-page';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = '@media print { @page { size: A4 portrait; margin: 10mm; } }';
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // فهرس سريع لكل المفردات والجمل من المنهج لاسترجاع بيانات العنصر المحفوظ
  const curriculumLookup = useMemo(() => {
    const vocabMap = new Map<
      string,
      { chapterId: number; chapterTitleAr: string; hanzi: string; pinyin: string; arabic: string }
    >();
    const sentenceMap = new Map<
      string,
      { chapterId: number; chapterTitleAr: string; hanzi: string; pinyin: string; arabic: string }
    >();

    for (const ch of CHAPTERS_DATA) {
      for (const v of ch.vocab) {
        vocabMap.set(v.id, {
          chapterId: ch.id,
          chapterTitleAr: ch.titleAr,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          arabic: v.arabic,
        });
      }
      for (const s of ch.sentences) {
        sentenceMap.set(s.id, {
          chapterId: ch.id,
          chapterTitleAr: ch.titleAr,
          hanzi: s.hanzi,
          pinyin: s.pinyin,
          arabic: s.arabic,
        });
      }
    }
    return { vocabMap, sentenceMap };
  }, []);

  const resolvedItems = useMemo<ResolvedVaultItem[]>(() => {
    const list: ResolvedVaultItem[] = [];
    for (const entry of Object.values(studyVault)) {
      const src =
        entry.itemType === 'vocab'
          ? curriculumLookup.vocabMap.get(entry.itemId)
          : curriculumLookup.sentenceMap.get(entry.itemId);
      if (!src) continue;
      list.push({
        key: entry.key,
        itemType: entry.itemType,
        itemId: entry.itemId,
        chapterId: src.chapterId,
        chapterTitleAr: src.chapterTitleAr,
        hanzi: src.hanzi,
        pinyin: src.pinyin,
        arabic: src.arabic,
        bookmarked: entry.bookmarked,
        note: entry.note,
        updatedAt: entry.updatedAt,
      });
    }
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [studyVault, curriculumLookup]);

  const counts = useMemo(() => {
    const vocab = resolvedItems.filter((i) => i.itemType === 'vocab').length;
    const sentence = resolvedItems.filter((i) => i.itemType === 'sentence').length;
    const notesOnly = resolvedItems.filter((i) => i.note.trim().length > 0).length;
    return { all: resolvedItems.length, vocab, sentence, notesOnly };
  }, [resolvedItems]);

  const filteredItems = useMemo(() => {
    if (filter === 'vocab') return resolvedItems.filter((i) => i.itemType === 'vocab');
    if (filter === 'sentence') return resolvedItems.filter((i) => i.itemType === 'sentence');
    if (filter === 'notes-only') return resolvedItems.filter((i) => i.note.trim().length > 0);
    return resolvedItems;
  }, [resolvedItems, filter]);

  const printVocabItems = useMemo(
    () => resolvedItems.filter((i) => i.itemType === 'vocab'),
    [resolvedItems]
  );
  const printSentenceItems = useMemo(
    () => resolvedItems.filter((i) => i.itemType === 'sentence'),
    [resolvedItems]
  );

  const handleSpeak = (key: string, hanzi: string, rate: 1.0 | 0.7) => {
    const playKey = `${key}-${rate}`;
    if (speakingKey === playKey) {
      stopChineseSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(playKey);
    const ok = speakChinese(hanzi, rate, {
      onEnd: () => setSpeakingKey((cur) => (cur === playKey ? null : cur)),
      onError: () => setSpeakingKey((cur) => (cur === playKey ? null : cur)),
    });
    if (!ok) setSpeakingKey(null);
  };

  const handleStartEditNote = (item: ResolvedVaultItem) => {
    setEditingNoteKey(item.key);
    setEditingNoteText(item.note);
  };

  const handleSaveInlineNote = (item: ResolvedVaultItem) => {
    saveItemNote(item.itemType, item.itemId, item.chapterId, editingNoteText);
    setEditingNoteKey(null);
    setEditingNoteText('');
  };

  const handlePrintVault = () => {
    stopChineseSpeech();
    setSpeakingKey(null);
    window.print();
  };

  const startPracticeSession = (mode: VaultPracticeMode = 'flashcards') => {
    const source = filteredItems.length > 0 ? filteredItems : resolvedItems;
    if (source.length === 0) return;
    stopChineseSpeech();
    setPracticeDeck(shuffleArray(source));
    setPracticeMode(mode);
    setCardIdx(0);
    setIsFlipped(false);
    setQuizSelectedAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
    setIsPracticing(true);
  };

  // بناء خيارات الاختبار السريع (4 اختيارات عربية) للبطاقة الحالية
  const activePracticeItem = practiceDeck[cardIdx];
  const quizOptions = useMemo(() => {
    if (!activePracticeItem) return [];
    const pool =
      activePracticeItem.itemType === 'vocab'
        ? CHAPTERS_DATA.flatMap((ch) => ch.vocab.map((v) => v.arabic))
        : CHAPTERS_DATA.flatMap((ch) => ch.sentences.map((s) => s.arabic));

    const uniqueDistractors = Array.from(
      new Set(pool.filter((a) => a !== activePracticeItem.arabic))
    );
    const chosen = shuffleArray(uniqueDistractors).slice(0, 3);
    return shuffleArray([activePracticeItem.arabic, ...chosen]);
  }, [activePracticeItem]);

  const handleAnswerQuiz = (option: string) => {
    if (!activePracticeItem || quizSelectedAnswer !== null) return;
    setQuizSelectedAnswer(option);
    if (option === activePracticeItem.arabic) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextPracticeCard = () => {
    stopChineseSpeech();
    if (cardIdx + 1 >= practiceDeck.length) {
      if (practiceMode === 'quiz') {
        setQuizDone(true);
      } else {
        setCardIdx(0);
        setIsFlipped(false);
      }
      return;
    }
    setCardIdx((i) => i + 1);
    setIsFlipped(false);
    setQuizSelectedAnswer(null);
  };

  const handlePrevPracticeCard = () => {
    stopChineseSpeech();
    setCardIdx((i) => (i > 0 ? i - 1 : practiceDeck.length - 1));
    setIsFlipped(false);
    setQuizSelectedAnswer(null);
  };

  // =========================================================================
  // واجهة جلسة مراجعة محفوظاتي (بطاقات المراجعة السريعة + الاختبار السريع)
  // =========================================================================
  if (isPracticing && practiceDeck.length > 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stopChineseSpeech();
              setIsPracticing(false);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى محفوظاتي وملاحظاتي</span>
          </button>

          <div className="inline-flex p-1 rounded-lg border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F2ECE1] dark:bg-[#1E1C1A]">
            <button
              type="button"
              onClick={() => startPracticeSession('flashcards')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                practiceMode === 'flashcards'
                  ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              بطاقات سريعة
            </button>
            <button
              type="button"
              onClick={() => startPracticeSession('quiz')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                practiceMode === 'quiz'
                  ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              اختبار سريع
            </button>
          </div>
        </div>

        {practiceMode === 'quiz' && quizDone ? (
          <div className="neo-frame rounded-xl p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#15803D]/12 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                أحسنت! أنهيت مراجعة محفوظاتك
              </h2>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                نتيجتك: {quizScore} من {practiceDeck.length} (
                {Math.round((quizScore / practiceDeck.length) * 100)}%)
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => startPracticeSession('quiz')}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار السريع</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPracticing(false)}
                className="px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              >
                العودة للقائمة
              </button>
            </div>
          </div>
        ) : (
          activePracticeItem && (
            <div className="neo-frame rounded-xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between gap-3 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                <span>
                  البطاقة {cardIdx + 1} من {practiceDeck.length} ·{' '}
                  <span className="font-hanzi">第{activePracticeItem.chapterId}课</span> (
                  {activePracticeItem.itemType === 'vocab' ? 'مفردة' : 'جملة'})
                </span>
                {practiceMode === 'quiz' && (
                  <span className="font-bold text-[#15803D] dark:text-[#22C55E]">
                    الصحيحة: {quizScore}
                  </span>
                )}
              </div>

              <div className="text-center py-4 space-y-4">
                <div className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                  <RubyChinese
                    hanzi={activePracticeItem.hanzi}
                    pinyin={activePracticeItem.pinyin}
                    showPinyin={showPinyin}
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeak(activePracticeItem.key, activePracticeItem.hanzi, 1.0)
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50"
                  >
                    <Volume2 className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444]" />
                    <span>استماع (1.0x)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeak(activePracticeItem.key, activePracticeItem.hanzi, 0.7)
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#D97706]/50"
                  >
                    <Volume2 className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                    <span>بطيء (0.7x)</span>
                  </button>
                </div>
              </div>

              {practiceMode === 'flashcards' ? (
                <div className="space-y-4">
                  {isFlipped ? (
                    <div className="rounded-xl border border-[#15803D]/30 dark:border-[#22C55E]/30 bg-[#15803D]/6 dark:bg-[#22C55E]/10 p-5 text-center space-y-2.5">
                      <p className="font-pinyin text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
                        {activePracticeItem.pinyin}
                      </p>
                      <p className="text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                        {activePracticeItem.arabic}
                      </p>
                      {activePracticeItem.note && (
                        <div className="mt-3 pt-3 border-t border-[#15803D]/20 dark:border-[#22C55E]/20 text-xs text-[#1C1917] dark:text-[#F5F2EB]">
                          <strong className="text-[#B91C1C] dark:text-[#EF4444] ml-1">
                            ملاحظتك:
                          </strong>
                          {activePracticeItem.note}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="w-full py-4 rounded-xl border border-dashed border-[#B91C1C]/45 dark:border-[#EF4444]/45 bg-[#F9F6F0]/70 dark:bg-[#141312] text-sm font-bold text-[#B91C1C] dark:text-[#EF4444] hover:bg-[#B91C1C]/8 transition-colors"
                    >
                      اضغط لإظهار المعنى والملاحظة الشخصية
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevPracticeCard}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPracticeCard}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs font-bold"
                    >
                      <span>التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizOptions.map((opt) => {
                      const isChosen = quizSelectedAnswer === opt;
                      const isCorrectOpt = opt === activePracticeItem.arabic;
                      let stateCls =
                        'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/50 text-[#1C1917] dark:text-[#F5F2EB]';
                      if (quizSelectedAnswer !== null) {
                        if (isCorrectOpt) {
                          stateCls =
                            'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/12 dark:bg-[#22C55E]/18 text-[#15803D] dark:text-[#22C55E]';
                        } else if (isChosen) {
                          stateCls =
                            'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444]';
                        } else {
                          stateCls =
                            'border-[#1C1917]/10 dark:border-[#F5F2EB]/10 opacity-55 text-[#57534E] dark:text-[#A8A29E]';
                        }
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={quizSelectedAnswer !== null}
                          onClick={() => handleAnswerQuiz(opt)}
                          className={`text-right px-4 py-3.5 min-h-[50px] rounded-lg border text-sm font-bold transition-colors ${stateCls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSelectedAnswer !== null && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
                      <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                        {activePracticeItem.note ? (
                          <span>
                            <strong className="text-[#B91C1C] dark:text-[#EF4444] ml-1">
                              ملاحظتك:
                            </strong>
                            {activePracticeItem.note}
                          </span>
                        ) : (
                          <span>
                            {quizSelectedAnswer === activePracticeItem.arabic
                              ? 'إجابة صحيحة! استمر في التثبيت.'
                              : `الإجابة الصحيحة: ${activePracticeItem.arabic}`}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleNextPracticeCard}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs font-bold shrink-0"
                      >
                        <span>
                          {cardIdx + 1 >= practiceDeck.length ? 'عرض النتيجة' : 'السؤال التالي'}
                        </span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* الترويسة وشريط الإجراءات الرئيسي (تُخفى عند الطباعة) */}
      <div className="no-print neo-frame rounded-xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
              <span className="font-bold text-[#D97706] dark:text-[#F59E0B]">
                خزنة ليلة الامتحان
              </span>
              <span aria-hidden="true">·</span>
              <span>{counts.vocab} مفردة</span>
              <span aria-hidden="true">·</span>
              <span>{counts.sentence} جملة</span>
              <span aria-hidden="true">·</span>
              <span>{counts.notesOnly} ملاحظة شخصية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              محفوظاتي وملاحظاتي
            </h1>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] max-w-2xl">
              احفظ الكلمات والجمل الصعبة بنجمة ⭐ وأضف ملاحظاتك الشخصية لتراجعها بسرعة قبل الامتحان
              أو تطبعها كورقة مراجعة منظمة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={resolvedItems.length === 0}
              onClick={() => startPracticeSession('flashcards')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs sm:text-sm font-bold transition-colors disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 shrink-0" />
              <span>ابدأ مراجعة محفوظاتي</span>
            </button>

            <button
              type="button"
              disabled={resolvedItems.length === 0}
              onClick={handlePrintVault}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/18 dark:border-[#F5F2EB]/18 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/50 dark:hover:border-[#EF4444]/50 text-[#1C1917] dark:text-[#F5F2EB] text-xs sm:text-sm font-bold transition-colors disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
              <span>طباعة ورقة ليلة الامتحان (PDF)</span>
            </button>
          </div>
        </div>

        {/* شريط التصفية + مفتاح البينين */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F2ECE1] dark:bg-[#141312] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
            {(
              [
                { id: 'all', label: `الكل (${counts.all})` },
                { id: 'vocab', label: `المفردات (${counts.vocab})` },
                { id: 'sentence', label: `الجمل (${counts.sentence})` },
                { id: 'notes-only', label: `بها ملاحظات فقط (${counts.notesOnly})` },
              ] as { id: VaultFilter; label: string }[]
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap tabular-nums ${
                  filter === btn.id
                    ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={togglePinyin}
            aria-pressed={showPinyin}
            className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap ${
              showPinyin
                ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E]'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPinyin ? 'إخفاء البينين (Ruby)' : 'إظهار البينين (Ruby)'}</span>
          </button>
        </div>
      </div>

      {/* قائمة العناصر المحفوظة على الشاشة */}
      <div className="no-print">
        {resolvedItems.length === 0 ? (
          <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-10 sm:p-14 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl border border-[#D97706]/30 dark:border-[#F59E0B]/35 bg-[#D97706]/10 dark:bg-[#F59E0B]/12 flex items-center justify-center text-[#D97706] dark:text-[#F59E0B]">
              <Star className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                خزنة محفوظاتك فارغة حالياً
              </h2>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                اضغط على نجمة الحفظ ⭐ أو أيقونة الملاحظة 📝 بجانب أي كلمة أو جملة داخل الفصول أو
                صفحة التجميعات لتجميع ورقة ليلة الامتحان الخاصة بك.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('chapters')}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold"
              >
                <BookOpen className="w-4 h-4" />
                <span>تصفح الفصول</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              >
                <span>فتح التجميعات</span>
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-10 text-center space-y-2">
            <p className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              لا توجد عناصر مطابقة لهذا التصنيف
            </p>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              جرّب اختيار «الكل» لعرض جميع محفوظاتك.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const activeNormal = speakingKey === `${item.key}-1`;
              const activeSlow = speakingKey === `${item.key}-0.7`;
              const isEditing = editingNoteKey === item.key;

              return (
                <article
                  key={item.key}
                  className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* سطر معلومات الفصل والنوع بدون كبسولات مبالغ فيها */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-hanzi font-bold text-[#B91C1C] dark:text-[#EF4444]">
                          第{item.chapterId}课
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.chapterTitleAr}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.itemType === 'vocab' ? 'مفردة' : 'جملة'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeVaultEntry(item.key)}
                        aria-label={`إزالة ${item.hanzi} من محفوظاتي`}
                        title="إزالة من محفوظاتي"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>إزالة</span>
                      </button>
                    </div>

                    {/* الرمز الصيني + البينين + المعنى العربي */}
                    <div className="space-y-1.5">
                      <div className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                        <RubyChinese
                          hanzi={item.hanzi}
                          pinyin={item.pinyin}
                          showPinyin={showPinyin}
                        />
                      </div>
                      <p className="text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
                        {item.arabic}
                      </p>
                    </div>

                    {/* الملاحظة الشخصية القابلة للتعديل */}
                    <div className="pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            placeholder="اكتب ملاحظتك الشخصية هنا..."
                            className="w-full rounded-lg border border-[#B91C1C]/45 dark:border-[#EF4444]/45 bg-[#F9F6F0] dark:bg-[#121110] px-3 py-2 text-xs text-[#1C1917] dark:text-[#F5F2EB] focus:outline-none resize-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingNoteKey(null)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#57534E] dark:text-[#A8A29E]"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>إلغاء</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveInlineNote(item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#15803D] dark:bg-[#22C55E] text-white dark:text-[#121110] text-xs font-bold"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>حفظ</span>
                            </button>
                          </div>
                        </div>
                      ) : item.note.trim().length > 0 ? (
                        <div className="flex items-start justify-between gap-2 rounded-lg bg-[#F9F6F0] dark:bg-[#141312] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-3">
                          <div className="text-xs text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed min-w-0">
                            <span className="font-bold text-[#B91C1C] dark:text-[#EF4444] ml-1.5">
                              ملاحظتي:
                            </span>
                            {item.note}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStartEditNote(item)}
                            className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] shrink-0"
                          >
                            تعديل
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEditNote(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                          <span>أضف ملاحظة شخصية لهذا العنصر</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* أزرار الاستماع الصوتي */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                    <button
                      type="button"
                      onClick={() => handleSpeak(item.key, item.hanzi, 1.0)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
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
                      onClick={() => handleSpeak(item.key, item.hanzi, 0.7)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
                        activeSlow
                          ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706] dark:bg-[#F59E0B] text-white dark:text-[#121110]'
                          : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#141312] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#D97706]/50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 shrink-0" />
                      <span>0.7x</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* نسخة الطباعة المخصصة (ورقة ليلة الامتحان أبيض وأسود A4 عمودي)       */}
      {/* ================================================================= */}
      <div className="hidden print-only vault-print-sheet" dir="rtl">
        <div className="vault-print-header">
          <h2>ورقة ليلة الامتحان — محفوظاتي وملاحظاتي (HSK 3.0)</h2>
          <p>
            الطالب: {currentStudent?.name ?? ''} · إجمالي العناصر: {resolvedItems.length} (
            {printVocabItems.length} مفردة · {printSentenceItems.length} جملة)
          </p>
        </div>

        {printVocabItems.length > 0 && (
          <div>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, marginBottom: '3mm' }}>
              أولاً: المفردات المحفوظة ({printVocabItems.length})
            </h3>
            <table className="vault-print-table">
              <thead>
                <tr>
                  <th style={{ width: '7%', textAlign: 'center' }}>#</th>
                  <th style={{ width: '16%', textAlign: 'center' }}>الرمز (Hanzi)</th>
                  <th style={{ width: '17%', textAlign: 'center' }}>النطق (Pinyin)</th>
                  <th style={{ width: '23%' }}>المعنى بالعربية</th>
                  <th style={{ width: '9%', textAlign: 'center' }}>الفصل</th>
                  <th style={{ width: '28%' }}>ملاحظتي الشخصية</th>
                </tr>
              </thead>
              <tbody>
                {printVocabItems.map((item, idx) => (
                  <tr key={item.key}>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                    <td
                      className="font-hanzi"
                      style={{ textAlign: 'center', fontSize: '12pt', fontWeight: 700 }}
                    >
                      {item.hanzi}
                    </td>
                    <td className="font-pinyin" style={{ textAlign: 'center' }}>
                      {item.pinyin}
                    </td>
                    <td>{item.arabic}</td>
                    <td className="font-hanzi" style={{ textAlign: 'center' }}>
                      第{item.chapterId}课
                    </td>
                    <td>{item.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {printSentenceItems.length > 0 && (
          <div>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, marginBottom: '3mm' }}>
              ثانياً: الجمل والمحادثات المحفوظة ({printSentenceItems.length})
            </h3>
            <table className="vault-print-table">
              <thead>
                <tr>
                  <th style={{ width: '6%', textAlign: 'center' }}>#</th>
                  <th style={{ width: '34%' }}>الجملة الصينية والبينين</th>
                  <th style={{ width: '25%' }}>المعنى بالعربية</th>
                  <th style={{ width: '9%', textAlign: 'center' }}>الفصل</th>
                  <th style={{ width: '26%' }}>ملاحظتي الشخصية</th>
                </tr>
              </thead>
              <tbody>
                {printSentenceItems.map((item, idx) => (
                  <tr key={item.key}>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                    <td>
                      <div className="font-hanzi" style={{ fontSize: '11pt', fontWeight: 700 }}>
                        {item.hanzi}
                      </div>
                      <div className="font-pinyin" style={{ fontSize: '8.5pt', color: '#333' }}>
                        {item.pinyin}
                      </div>
                    </td>
                    <td>{item.arabic}</td>
                    <td className="font-hanzi" style={{ textAlign: 'center' }}>
                      第{item.chapterId}课
                    </td>
                    <td>{item.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
