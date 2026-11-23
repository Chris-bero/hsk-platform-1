import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { FixedMockExamQuestion, HskPatternModule } from '../data/mockExamsData';
import {
  initChineseVoices,
  speakChinese,
  speakChineseDialogue,
  stopChineseSpeech,
} from '../utils/speech';
import { RubyChinese } from './RubyChinese';
import { SceneCardVisual } from './SceneCardVisual';

interface HskPatternPracticeRunnerProps {
  module: HskPatternModule;
  onExit: () => void;
}

const CHOICE_LETTERS: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'> = ['A', 'B', 'C', 'D', 'E', 'F'];

function shuffleQuestionOptions(q: FixedMockExamQuestion): FixedMockExamQuestion {
  // Shuffle text options in untimed Pattern Drills (reading-p2 / reading-p3) for fresh order every run
  if (q.partId !== 'reading-p2' && q.partId !== 'reading-p3') return q;
  const indexed = q.options.map((opt) => ({
    opt,
    isCorrect: opt.letter === q.correctLetter,
  }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const remapped = indexed.map((entry, idx) => ({
    ...entry.opt,
    letter: CHOICE_LETTERS[idx] ?? entry.opt.letter,
  }));
  const newCorrectIdx = indexed.findIndex((entry) => entry.isCorrect);
  return {
    ...q,
    options: remapped,
    correctLetter: CHOICE_LETTERS[newCorrectIdx] ?? q.correctLetter,
  };
}

export function HskPatternPracticeRunner({ module, onExit }: HskPatternPracticeRunnerProps) {
  const { showPinyin, togglePinyin, recordHskPatternPractice } = useApp();

  const [sessionSeed, setSessionSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showListeningQuestionText, setShowListeningQuestionText] = useState<
    Record<number, boolean>
  >({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'A' | 'B' | null>(null);
  const [slowMode, setSlowMode] = useState(false);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(
    () => module.questions.map(shuffleQuestionOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module, sessionSeed]
  );
  const currentQ: FixedMockExamQuestion | undefined = questions[currentIndex];

  useEffect(() => {
    const cleanupVoices = initChineseVoices();
    return () => {
      cleanupVoices();
      stopChineseSpeech();
    };
  }, []);

  useEffect(() => {
    stopChineseSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker(null);
  }, [currentIndex, finished]);

  const handlePlayAudio = (q: FixedMockExamQuestion) => {
    if (isPlayingAudio) {
      stopChineseSpeech();
      setIsPlayingAudio(false);
      setActiveSpeaker(null);
      return;
    }

    setIsPlayingAudio(true);

    if (q.audioDialogue && q.audioDialogue.length > 0) {
      const lines = q.audioDialogue.map((t) => ({ speaker: t.speaker, text: t.hanzi }));
      if (q.questionZh) {
        const cleanQ = q.questionZh.replace(/^问：/, '');
        lines.push({ speaker: 'A', text: cleanQ });
      }
      const ok = speakChineseDialogue(lines, {
        onLineStart: (_, sp) => setActiveSpeaker(sp),
        onComplete: () => {
          setIsPlayingAudio(false);
          setActiveSpeaker(null);
        },
        onError: () => {
          setIsPlayingAudio(false);
          setActiveSpeaker(null);
        },
      });
      if (!ok) {
        setIsPlayingAudio(false);
        setActiveSpeaker(null);
      }
      return;
    }

    if (q.audioSingle) {
      const ok = speakChinese(q.audioSingle.hanzi, slowMode ? 0.72 : 0.96, {
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });
      if (!ok) setIsPlayingAudio(false);
    }
  };

  const handleSelectOption = (letter: string) => {
    if (!currentQ || selectedAnswers[currentQ.number]) return;
    const answeredCorrectly = letter === currentQ.correctLetter;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.number]: letter }));
    // تسجيل فوري لكل سؤال مع مزامنة مباشرة إلى التخزين المحلي و Google Sheets
    void recordHskPatternPractice(module.id, 1, answeredCorrectly ? 1 : 0);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    stopChineseSpeech();
    setSessionSeed((s) => s + 1);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowListeningQuestionText({});
    setFinished(false);
  };

  if (finished) {
    const total = questions.length;
    const correct = questions.filter((q) => selectedAnswers[q.number] === q.correctLetter).length;
    const wrong = Math.max(0, total - correct);
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const pctColor =
      pct >= 85
        ? 'text-[#15803D] dark:text-[#22C55E]'
        : pct >= 70
          ? 'text-[#B45309] dark:text-[#F59E0B]'
          : 'text-[#B91C1C] dark:text-[#EF4444]';

    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8"
      >
        <div className="neo-frame rounded-xl p-8 text-center space-y-5 bg-white dark:bg-[#1E1C1A]">
          <div className="text-xs font-bold text-[#D97706] dark:text-[#F59E0B] font-hanzi">
            {module.codeZh}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            اكتمل تدريب: {module.titleAr}
          </h1>

          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-4 rounded-xl bg-[#F9F6F0] dark:bg-[#121110] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 tabular-nums">
            <div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">الصحيح</p>
              <p className="text-2xl font-bold text-[#15803D] dark:text-[#22C55E]">
                {correct} / {total}
              </p>
            </div>
            <div className="h-8 w-px bg-[#1C1917]/12 dark:bg-[#F5F2EB]/12" />
            <div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">الأخطاء</p>
              <p className="text-2xl font-bold text-[#B91C1C] dark:text-[#EF4444]">{wrong}</p>
            </div>
            <div className="h-8 w-px bg-[#1C1917]/12 dark:bg-[#F5F2EB]/12" />
            <div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">نسبة الدقة</p>
              <p className={`text-2xl font-bold ${pctColor}`}>{pct}%</p>
            </div>
          </div>

          <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
            تم حفظ ومزامنة نتائجك في سجل بوابة الامتحانات الدولية HSK 3.0 بشكل مستقل عن تدريبات الفصول اليومية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] text-white text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التدريب</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى بوابة HSK 3.0</span>
            </button>
          </div>
        </div>
      </motion.section>
    );
  }

  if (!currentQ) return null;

  const chosenLetter = selectedAnswers[currentQ.number];
  const isAnswered = Boolean(chosenLetter);
  const isCorrect = chosenLetter === currentQ.correctLetter;
  const isVisualOptions = currentQ.options.some((o) => Boolean(o.sceneId));

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6"
    >
      {/* شريط علوي للنمط والتقدم */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
        <button
          type="button"
          onClick={() => {
            stopChineseSpeech();
            onExit();
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى بوابة الامتحانات الدولية</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs tabular-nums">
          <button
            type="button"
            onClick={togglePinyin}
            aria-pressed={showPinyin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
              showPinyin
                ? 'border-[#D97706]/40 bg-[#D97706]/10 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E]'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPinyin ? 'إخفاء البينين (Pinyin)' : 'إظهار البينين (Pinyin)'}</span>
          </button>

          <span className="font-hanzi font-bold text-[#B91C1C] dark:text-[#EF4444]">
            {module.codeZh}
          </span>
          <span aria-hidden="true" className="text-[#1C1917]/20 dark:text-[#F5F2EB]/20">
            ·
          </span>
          <span className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* بطاقة السؤال بنمط HSK 3.0 الدولي الخالص (بدون أي نص عربي داخل السؤال والخيارات قبل الإجابة) */}
      <div className="neo-frame rounded-xl p-6 sm:p-8 bg-white dark:bg-[#1E1C1A] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span dir="ltr" className="font-hanzi text-sm font-bold text-[#D97706] dark:text-[#F59E0B]">
            {currentQ.partLabelZh} · 第 {currentIndex + 1} 题
          </span>
          <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
            تدريب غير مؤقت
          </span>
        </div>

        {/* مشغّل الصوت لأسئلة الاستماع */}
        {currentQ.section === 'listening' && (
          <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-6 flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              onClick={() => handlePlayAudio(currentQ)}
              className={`inline-flex items-center justify-center gap-3 px-7 py-3.5 min-h-[52px] rounded-xl font-bold text-sm transition-colors ${
                isPlayingAudio
                  ? 'bg-[#D97706] text-white'
                  : 'bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white'
              }`}
            >
              {isPlayingAudio ? (
                <Headphones className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              <span className="font-hanzi text-base">
                {isPlayingAudio
                  ? activeSpeaker
                    ? activeSpeaker === 'A'
                      ? '正在播放 · 女'
                      : '正在播放 · 男'
                    : '正在播放...'
                  : '播放录音'}
              </span>
            </button>

            {!currentQ.audioDialogue && (
              <div className="inline-flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSlowMode(false)}
                  className={`px-3 py-1 rounded-md font-bold transition-colors ${
                    !slowMode
                      ? 'bg-[#1C1917] dark:bg-[#F5F2EB] text-white dark:text-[#121110]'
                      : 'text-[#57534E] dark:text-[#A8A29E]'
                  }`}
                >
                  1.0x
                </button>
                <button
                  type="button"
                  onClick={() => setSlowMode(true)}
                  className={`px-3 py-1 rounded-md font-bold transition-colors ${
                    slowMode
                      ? 'bg-[#1C1917] dark:bg-[#F5F2EB] text-white dark:text-[#121110]'
                      : 'text-[#57534E] dark:text-[#A8A29E]'
                  }`}
                >
                  0.7x
                </button>
              </div>
            )}

            {/* إخفاء نص السؤال (问：...) افتراضياً في 听力第四部分 مع زر إظهار اختياري */}
            {currentQ.partId === 'listening-p4' && currentQ.questionZh && (
              <div className="pt-3 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8 w-full flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowListeningQuestionText((prev) => ({
                      ...prev,
                      [currentQ.number]: !prev[currentQ.number],
                    }))
                  }
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:border-[#B91C1C]/45 hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
                >
                  {showListeningQuestionText[currentQ.number] ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>إخفاء نص السؤال / 隐藏问题</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>إظهار نص السؤال / 显示问题</span>
                    </>
                  )}
                </button>

                {showListeningQuestionText[currentQ.number] && (
                  <RubyChinese
                    hanzi={currentQ.questionZh}
                    pinyin={currentQ.questionPinyin}
                    showPinyin={showPinyin}
                    className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* نص القراءة بنظام Ruby Pinyin */}
        {currentQ.section === 'reading' && currentQ.promptZh && (
          <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-6 space-y-4 text-center">
            <div className="flex justify-center">
              <RubyChinese
                hanzi={currentQ.promptZh}
                pinyin={currentQ.promptPinyin}
                showPinyin={showPinyin}
                className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              />
            </div>
            {currentQ.questionZh && (
              <div className="pt-3 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex justify-center">
                <RubyChinese
                  hanzi={currentQ.questionZh}
                  pinyin={currentQ.questionPinyin}
                  showPinyin={showPinyin}
                  className="text-lg sm:text-xl font-bold text-[#B91C1C] dark:text-[#EF4444]"
                />
              </div>
            )}
          </div>
        )}

        {/* الخيارات — إما مشاهد بصرية (A–C / A–F) أو خيارات صينية Ruby خالصة */}
        {isVisualOptions ? (
          <div
            dir="ltr"
            className={`grid gap-4 ${
              currentQ.options.length <= 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {currentQ.options.map((opt) => {
              const isSelected = chosenLetter === opt.letter;
              const isOptCorrect = opt.letter === currentQ.correctLetter;

              let borderCls =
                'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#181614] hover:border-[#B91C1C]/50 dark:hover:border-[#EF4444]/50';
              if (isAnswered) {
                if (isOptCorrect) {
                  borderCls =
                    'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/8 dark:bg-[#22C55E]/12';
                } else if (isSelected) {
                  borderCls =
                    'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12';
                } else {
                  borderCls =
                    'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 opacity-60';
                }
              }

              return (
                <button
                  key={opt.letter}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.letter)}
                  className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2.5 transition-all duration-150 ${borderCls}`}
                >
                  <span className="w-7 h-7 rounded-md bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10 text-xs font-bold flex items-center justify-center text-[#1C1917] dark:text-[#F5F2EB]">
                    {opt.letter}
                  </span>
                  {opt.sceneId && (
                    <SceneCardVisual sceneId={opt.sceneId} className="w-full h-32 sm:h-36" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            dir="ltr"
            className={`grid gap-3 ${
              currentQ.options.length > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {currentQ.options.map((opt) => {
              const isSelected = chosenLetter === opt.letter;
              const isOptCorrect = opt.letter === currentQ.correctLetter;

              let borderCls =
                'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#181614] hover:border-[#B91C1C]/50 dark:hover:border-[#EF4444]/50';
              if (isAnswered) {
                if (isOptCorrect) {
                  borderCls =
                    'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/8 dark:bg-[#22C55E]/12';
                } else if (isSelected) {
                  borderCls =
                    'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12';
                } else {
                  borderCls = 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 opacity-60';
                }
              }

              return (
                <button
                  key={opt.letter}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.letter)}
                  className={`rounded-xl border-2 px-4 py-3.5 flex items-center gap-4 text-left transition-all duration-150 ${borderCls}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10 text-sm font-bold flex items-center justify-center shrink-0 text-[#1C1917] dark:text-[#F5F2EB]">
                    {opt.letter}
                  </span>
                  <div className="flex-1">
                    {opt.hanzi && (
                      <RubyChinese
                        hanzi={opt.hanzi}
                        pinyin={opt.pinyin}
                        showPinyin={showPinyin}
                        className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* التغذية الراجعة بعد الإجابة فقط (كشف النص الصوتي والترجمة العربية) */}
        {isAnswered && (
          <div
            className={`rounded-xl border p-5 space-y-3 ${
              isCorrect
                ? 'border-[#15803D]/35 bg-[#15803D]/8 dark:bg-[#22C55E]/10'
                : 'border-[#B91C1C]/35 bg-[#B91C1C]/8 dark:bg-[#EF4444]/10'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] dark:text-[#22C55E]" />
                    <span className="text-[#15803D] dark:text-[#22C55E]">إجابة صحيحة!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
                    <span className="text-[#B91C1C] dark:text-[#EF4444]">
                      الإجابة الصحيحة هي: {currentQ.correctLetter}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* النص الصوتي المخفي يُكشف بعد الإجابة */}
            {currentQ.audioSingle && (
              <div className="rounded-lg bg-white/80 dark:bg-[#1E1C1A]/80 p-3 space-y-1">
                <p className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E]">
                  نص الاستماع:
                </p>
                <RubyChinese
                  hanzi={currentQ.audioSingle.hanzi}
                  pinyin={currentQ.audioSingle.pinyin}
                  showPinyin={showPinyin}
                  className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                />
              </div>
            )}

            {currentQ.audioDialogue && (
              <div className="rounded-lg bg-white/80 dark:bg-[#1E1C1A]/80 p-3 space-y-2">
                <p className="text-[11px] font-bold text-[#57534E] dark:text-[#A8A29E]">
                  نص الحوار الصوتي:
                </p>
                {currentQ.audioDialogue.map((turn, idx) => (
                  <div key={idx} dir="ltr" className="flex items-baseline gap-2 text-left">
                    <span className="font-hanzi text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                      {turn.roleLabelZh}：
                    </span>
                    <RubyChinese
                      hanzi={turn.hanzi}
                      pinyin={turn.pinyin}
                      showPinyin={showPinyin}
                      className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                    />
                  </div>
                ))}
                {currentQ.questionZh && (
                  <div className="pt-2 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
                    <RubyChinese
                      hanzi={currentQ.questionZh}
                      pinyin={currentQ.questionPinyin}
                      showPinyin={showPinyin}
                      className="text-sm font-bold text-[#B91C1C] dark:text-[#EF4444]"
                    />
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-[#1C1917] dark:text-[#F5F2EB]">
              <strong className="text-[#57534E] dark:text-[#A8A29E]">الشرح والترجمة: </strong>
              {currentQ.translationAr}
            </p>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] text-white text-sm font-bold transition-colors"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'السؤال التالي' : 'إنهاء التدريب'}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
