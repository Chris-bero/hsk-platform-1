import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Play,
  Printer,
  RotateCcw,
  Scale,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CONFUSABLE_GROUPS_DATA,
  CONFUSABLES_QUIZ_QUESTIONS,
  ConfusableCategory,
  ConfusableQuizQuestion,
} from '../../data/confusablesData';
import { speakChinese, stopChineseSpeech } from '../../utils/speech';
import { RubyChinese } from '../RubyChinese';

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ConfusablesTrapsLab() {
  const { showPinyin, togglePinyin } = useApp();

  const [activeCategory, setActiveCategory] = useState<ConfusableCategory>('visual-phonetic');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  // حالة اختبار المتشابهات السريع (15 سؤالاً)
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizDeck, setQuizDeck] = useState<ConfusableQuizQuestion[]>(CONFUSABLES_QUIZ_QUESTIONS);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // ضبط صفحة الطباعة لـ A4 عمودي لورقة ملخص المتشابهات
  useEffect(() => {
    const styleId = 'confusables-dynamic-print-page';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = '@media print { @page { size: A4 portrait; margin: 10mm; } }';
    return () => {
      stopChineseSpeech();
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  const visualGroups = useMemo(
    () => CONFUSABLE_GROUPS_DATA.filter((g) => g.category === 'visual-phonetic'),
    []
  );
  const grammarGroups = useMemo(
    () => CONFUSABLE_GROUPS_DATA.filter((g) => g.category === 'grammar-trap'),
    []
  );

  const visibleGroups = activeCategory === 'visual-phonetic' ? visualGroups : grammarGroups;

  const handleSpeak = (key: string, text: string, rate: 1.0 | 0.7) => {
    const playKey = `${key}-${rate}`;
    if (speakingKey === playKey) {
      stopChineseSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(playKey);
    const ok = speakChinese(text, rate, {
      onEnd: () => setSpeakingKey((cur) => (cur === playKey ? null : cur)),
      onError: () => setSpeakingKey((cur) => (cur === playKey ? null : cur)),
    });
    if (!ok) setSpeakingKey(null);
  };

  const startQuiz = () => {
    stopChineseSpeech();
    setSpeakingKey(null);
    setQuizDeck(shuffleArray(CONFUSABLES_QUIZ_QUESTIONS));
    setQuizIndex(0);
    setSelectedOption(null);
    setCorrectCount(0);
    setQuizFinished(false);
    setIsQuizMode(true);
  };

  const currentQuestion = quizDeck[quizIndex];

  const handleChooseOption = (optIdx: number) => {
    if (!currentQuestion || selectedOption !== null) return;
    setSelectedOption(optIdx);
    if (optIdx === currentQuestion.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNextQuestion = () => {
    stopChineseSpeech();
    setSpeakingKey(null);
    if (quizIndex + 1 >= quizDeck.length) {
      setQuizFinished(true);
      return;
    }
    setQuizIndex((i) => i + 1);
    setSelectedOption(null);
  };

  const handlePrintCheatSheet = () => {
    stopChineseSpeech();
    setSpeakingKey(null);
    window.print();
  };

  // =========================================================================
  // واجهة اختبار المتشابهات السريع (15 سؤالاً)
  // =========================================================================
  if (isQuizMode) {
    const completedPrompt =
      currentQuestion && selectedOption !== null
        ? currentQuestion.promptZh.replace(
            '____',
            currentQuestion.options[currentQuestion.correctIndex].hanzi
          )
        : '';

    return (
      <div className="no-print space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stopChineseSpeech();
              setIsQuizMode(false);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى بطاقات المتشابهات وفخاخ الامتحان</span>
          </button>

          <button
            type="button"
            onClick={togglePinyin}
            aria-pressed={showPinyin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border text-xs font-bold transition-colors whitespace-nowrap ${
              showPinyin
                ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E]'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPinyin ? 'إخفاء البينين' : 'إظهار البينين'}</span>
          </button>
        </div>

        {quizFinished ? (
          <div className="neo-frame rounded-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#15803D]/12 dark:bg-[#22C55E]/16 text-[#15803D] dark:text-[#22C55E] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                نتيجتك في اختبار المتشابهات وفخاخ الامتحان
              </h2>
              <p className="text-base font-bold tabular-nums text-[#B91C1C] dark:text-[#EF4444]">
                {correctCount} / {quizDeck.length} ({Math.round((correctCount / quizDeck.length) * 100)}%)
              </p>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] max-w-md mx-auto">
                {correctCount >= 13
                  ? 'ممتاز جداً! أصبحت متمكناً من تفادي فخاخ امتحان HSK 3.0.'
                  : correctCount >= 9
                  ? 'أداء جيد! راجع بطاقات الأخطاء سريعاً وستصل للدرجة الكاملة.'
                  : 'بداية جيدة! راجع فروق القواعد والمتشابهات في البطاقات ثم أعد الاختبار.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار (15 سؤالاً)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsQuizMode(false)}
                className="px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              >
                العودة للملخص
              </button>
            </div>
          </div>
        ) : (
          currentQuestion && (
            <div className="neo-frame rounded-xl p-6 sm:p-8 space-y-6">
              {/* التقدم والنتيجة الحية */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                  <span>
                    السؤال {quizIndex + 1} من {quizDeck.length} ·{' '}
                    {currentQuestion.category === 'visual-phonetic'
                      ? 'متشابهات شكلية وصوتية'
                      : 'فخاخ القواعد والاستخدام'}
                  </span>
                  <span className="font-bold text-[#15803D] dark:text-[#22C55E]">
                    الإجابات الصحيحة: {correctCount}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F2ECE1] dark:bg-[#292623] overflow-hidden">
                  <div
                    className="h-full bg-[#B91C1C] dark:bg-[#EF4444] transition-all duration-200"
                    style={{ width: `${((quizIndex + 1) / quizDeck.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* نص السؤال */}
              <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0]/75 dark:bg-[#141312] p-6 text-center space-y-2.5">
                <p
                  dir="ltr"
                  className="font-hanzi text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed"
                >
                  {currentQuestion.promptZh}
                </p>
                {showPinyin && (
                  <p className="font-pinyin text-sm font-semibold text-[#57534E] dark:text-[#A8A29E]">
                    {currentQuestion.promptPinyin}
                  </p>
                )}
                <p className="text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] pt-1">
                  {currentQuestion.promptAr}
                </p>
              </div>

              {/* الاختيارات */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  let btnCls =
                    'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/55 text-[#1C1917] dark:text-[#F5F2EB]';

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnCls =
                        'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/12 dark:bg-[#22C55E]/18 text-[#15803D] dark:text-[#22C55E]';
                    } else if (isSelected) {
                      btnCls =
                        'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444]';
                    } else {
                      btnCls =
                        'border-[#1C1917]/10 dark:border-[#F5F2EB]/10 opacity-50 text-[#57534E] dark:text-[#A8A29E]';
                    }
                  }

                  return (
                    <button
                      key={`${currentQuestion.id}-${idx}`}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleChooseOption(idx)}
                      className={`p-4 min-h-[72px] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-150 ${btnCls}`}
                    >
                      <span className="font-hanzi text-2xl font-bold">{opt.hanzi}</span>
                      {showPinyin && (
                        <span className="font-pinyin text-xs font-semibold opacity-85">
                          {opt.pinyin}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* التغذية الراجعة الفورية مع الشرح العربي */}
              {selectedOption !== null && (
                <div
                  className={`rounded-xl border p-4 sm:p-5 space-y-3 ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'border-[#15803D]/35 dark:border-[#22C55E]/35 bg-[#15803D]/8 dark:bg-[#22C55E]/12'
                      : 'border-[#B91C1C]/35 dark:border-[#EF4444]/35 bg-[#B91C1C]/8 dark:bg-[#EF4444]/12'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-[#15803D] dark:text-[#22C55E]" />
                          <span className="text-[#15803D] dark:text-[#22C55E]">
                            إجابة صحيحة!
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
                          <span className="text-[#B91C1C] dark:text-[#EF4444]">
                            الإجابة الصحيحة هي:{' '}
                            <span className="font-hanzi text-base">
                              {currentQuestion.options[currentQuestion.correctIndex].hanzi}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(`quiz-${currentQuestion.id}`, completedPrompt, 1.0)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#EF4444]" />
                      <span>استمع للجملة الصحيحة</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed">
                    {currentQuestion.explanationAr}
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs sm:text-sm font-bold"
                    >
                      <span>
                        {quizIndex + 1 >= quizDeck.length ? 'عرض النتيجة النهائية' : 'السؤال التالي'}
                      </span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* شريط التحكم العلوي (يُخفى عند الطباعة) */}
      <div className="no-print rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
              <span className="font-bold text-[#B91C1C] dark:text-[#EF4444]">
                مختبر المتشابهات وفخاخ الامتحان
              </span>
              <span aria-hidden="true">·</span>
              <span>١٠ متشابهات شكلية وصوتية</span>
              <span aria-hidden="true">·</span>
              <span>١٠ فخاخ قواعد HSK 3.0</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              دليل التمييز السريع وتفادي فخاخ الامتحان
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={startQuiz}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 shrink-0" />
              <span>اختبر نفسك في المتشابهات (15 سؤالاً)</span>
            </button>

            <button
              type="button"
              onClick={handlePrintCheatSheet}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/18 dark:border-[#F5F2EB]/18 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/50 dark:hover:border-[#EF4444]/50 text-[#1C1917] dark:text-[#F5F2EB] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
              <span>طباعة ملخص المتشابهات (PDF أبيض وأسود)</span>
            </button>
          </div>
        </div>

        {/* التبويبان الفرعيان + زر البينين */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="أقسام مختبر المتشابهات"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F2ECE1] dark:bg-[#141312] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'visual-phonetic'}
              onClick={() => setActiveCategory('visual-phonetic')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeCategory === 'visual-phonetic'
                  ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span>المتشابهات الشكلية والصوتية ({visualGroups.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'grammar-trap'}
              onClick={() => setActiveCategory('grammar-trap')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeCategory === 'grammar-trap'
                  ? 'bg-white dark:bg-[#292623] text-[#15803D] dark:text-[#22C55E] shadow-xs'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>فخاخ القواعد والاستخدام ({grammarGroups.length})</span>
            </button>
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

      {/* بطاقات المقارنة التفاعلية على الشاشة */}
      <div className="no-print space-y-5">
        {visibleGroups.map((group) => {
          const itemCols =
            group.items.length >= 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : group.items.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2';

          return (
            <article
              key={group.id}
              className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-5 sm:p-6 space-y-5"
            >
              {/* رأس البطاقة */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold tabular-nums text-[#B91C1C] dark:text-[#EF4444]">
                    {String(group.number).padStart(2, '0')}.
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    {group.titleAr}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                  {group.chapterRef}
                </span>
              </div>

              {/* المقارنة جنباً إلى جنب */}
              <div className={`grid ${itemCols} gap-3`}>
                {group.items.map((item, idx) => {
                  const keyBase = `${group.id}-item-${idx}`;
                  const speakTarget = item.audioText ?? item.hanzi;
                  const activeNormal = speakingKey === `${keyBase}-1`;
                  const activeSlow = speakingKey === `${keyBase}-0.7`;

                  return (
                    <div
                      key={keyBase}
                      className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/65 dark:bg-[#141312] p-4 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5 text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-snug">
                          <RubyChinese
                            hanzi={item.hanzi}
                            pinyin={item.pinyin}
                            showPinyin={showPinyin}
                          />
                        </div>
                        {showPinyin && (
                          <div className="font-pinyin text-xs font-semibold text-[#B91C1C] dark:text-[#EF4444]">
                            {item.pinyin}
                          </div>
                        )}
                        <p className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB] pt-1">
                          {item.meaningAr}
                        </p>
                        {item.hintAr && (
                          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                            {item.hintAr}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                        <button
                          type="button"
                          onClick={() => handleSpeak(keyBase, speakTarget, 1.0)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[32px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
                            activeNormal
                              ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                              : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/50'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5 shrink-0" />
                          <span>1.0x</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpeak(keyBase, speakTarget, 0.7)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[32px] rounded-md border text-xs font-bold tabular-nums transition-colors ${
                            activeSlow
                              ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706] dark:bg-[#F59E0B] text-white dark:text-[#121110]'
                              : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E] hover:border-[#D97706]/50'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5 shrink-0" />
                          <span>0.7x</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* صندوق فخ الامتحان / الفرق السريع */}
              <div className="rounded-lg border border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#FFFBEB]/80 dark:bg-[#451A03]/25 p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed">
                  <strong className="text-[#B45309] dark:text-[#F59E0B] ml-1.5">
                    فخ الامتحان / الفرق السريع:
                  </strong>
                  {group.trapTipAr}
                </p>
              </div>

              {/* جمل الأمثلة المتقابلة */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                  أمثلة تطبيقية للتمييز:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.examples.map((ex, exIdx) => {
                    const exKey = `${group.id}-ex-${exIdx}`;
                    const exNormal = speakingKey === `${exKey}-1`;
                    const exSlow = speakingKey === `${exKey}-0.7`;
                    return (
                      <div
                        key={exKey}
                        className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0]/45 dark:bg-[#181614] p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                            <RubyChinese
                              hanzi={ex.hanzi}
                              pinyin={ex.pinyin}
                              showPinyin={showPinyin}
                            />
                          </div>
                          <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">{ex.arabic}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSpeak(exKey, ex.hanzi, 1.0)}
                            aria-label="استماع بسرعة عادية"
                            className={`inline-flex items-center gap-1 px-2 py-1.5 min-h-[32px] rounded-md border text-[11px] font-bold tabular-nums ${
                              exNormal
                                ? 'border-[#B91C1C] bg-[#B91C1C] text-white'
                                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB]'
                            }`}
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>1.0x</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSpeak(exKey, ex.hanzi, 0.7)}
                            aria-label="استماع بسرعة بطيئة"
                            className={`inline-flex items-center gap-1 px-2 py-1.5 min-h-[32px] rounded-md border text-[11px] font-bold tabular-nums ${
                              exSlow
                                ? 'border-[#D97706] bg-[#D97706] text-white'
                                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E]'
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
            </article>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* نسخة الطباعة المخصصة (ملخص المتشابهات وفخاخ الامتحان A4 أبيض وأسود) */}
      {/* ================================================================= */}
      <div className="hidden print-only confusables-print-sheet" dir="rtl">
        <div className="vault-print-header">
          <h2>ملخص المتشابهات وفخاخ امتحان HSK 3.0 — المستوى الأول (الفصول 1–15)</h2>
          <p>
            ورقة مراجعة ليلة الامتحان · 10 متشابهات شكلية وصوتية + 10 فخاخ قواعد واستخدام
          </p>
        </div>

        {(
          [
            {
              heading: 'أولاً: المتشابهات الشكلية والصوتية (10 مجموعات)',
              list: visualGroups,
            },
            {
              heading: 'ثانياً: فخاخ القواعد والاستخدام (10 فخاخ امتحانية)',
              list: grammarGroups,
            },
          ] as const
        ).map((sec) => (
          <div key={sec.heading} style={{ marginBottom: '6mm' }}>
            <h3 style={{ fontSize: '11pt', fontWeight: 700, marginBottom: '2.5mm' }}>
              {sec.heading}
            </h3>
            <table className="vault-print-table">
              <thead>
                <tr>
                  <th style={{ width: '5%', textAlign: 'center' }}>#</th>
                  <th style={{ width: '28%' }}>المقارنة (Hanzi / Pinyin)</th>
                  <th style={{ width: '37%' }}>فخ الامتحان والفرق السريع</th>
                  <th style={{ width: '30%' }}>أمثلة سريعة</th>
                </tr>
              </thead>
              <tbody>
                {sec.list.map((g) => (
                  <tr key={g.id}>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{g.number}</td>
                    <td>
                      {g.items.map((it, idx) => (
                        <div key={idx} style={{ marginBottom: '2px' }}>
                          <strong className="font-hanzi" style={{ fontSize: '10.5pt' }}>
                            {it.hanzi}
                          </strong>{' '}
                          <span className="font-pinyin" style={{ fontSize: '8pt' }}>
                            ({it.pinyin})
                          </span>
                          : {it.meaningAr}
                        </div>
                      ))}
                    </td>
                    <td>{g.trapTipAr}</td>
                    <td>
                      {g.examples.map((ex, idx) => (
                        <div key={idx} style={{ marginBottom: '2.5px' }}>
                          <div className="font-hanzi" style={{ fontWeight: 700, fontSize: '9.5pt' }}>
                            {ex.hanzi}
                          </div>
                          <div style={{ fontSize: '8pt', color: '#222' }}>{ex.arabic}</div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
