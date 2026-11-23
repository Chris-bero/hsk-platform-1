import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Headphones,
  Lock,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { FixedMockExamPaper, FixedMockExamQuestion } from '../data/mockExamsData';
import { HskMockExamResult } from '../types';
import {
  initChineseVoices,
  speakChinese,
  speakChineseDialogue,
  stopChineseSpeech,
} from '../utils/speech';
import { RubyChinese } from './RubyChinese';
import { SceneCardVisual } from './SceneCardVisual';

interface HskFixedMockExamRunnerProps {
  paper: FixedMockExamPaper;
  onExit: () => void;
}

type ExamPhase = 'briefing' | 'listening' | 'reading' | 'results';
type ReviewFilter = 'all' | 'wrong' | 'listening' | 'reading';

const MAX_LISTENING_PLAYS = 2;

function formatTimer(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function HskFixedMockExamRunner({ paper, onExit }: HskFixedMockExamRunnerProps) {
  const { showPinyin, togglePinyin, recordHskFixedMockExam } = useApp();

  const listeningQuestions = useMemo(
    () => paper.questions.filter((q) => q.section === 'listening'),
    [paper]
  );
  const readingQuestions = useMemo(
    () => paper.questions.filter((q) => q.section === 'reading'),
    [paper]
  );

  const [phase, setPhase] = useState<ExamPhase>('briefing');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(paper.listeningDurationSeconds);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [playsUsed, setPlaysUsed] = useState<Record<number, number>>({});
  const [showListeningQuestionText, setShowListeningQuestionText] = useState<
    Record<number, boolean>
  >({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'A' | 'B' | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [finalResult, setFinalResult] = useState<HskMockExamResult | null>(null);
  const [confirmAction, setConfirmAction] = useState<'none' | 'to-reading' | 'submit' | 'exit'>(
    'none'
  );
  const [replayingNumber, setReplayingNumber] = useState<number | null>(null);

  const startedAtRef = useRef<number>(Date.now());
  const submittedRef = useRef<boolean>(false);

  const isInternational = paper.track === 'international';

  useEffect(() => {
    const cleanup = initChineseVoices();
    return () => {
      cleanup();
      stopChineseSpeech();
    };
  }, []);

  const currentSectionList = phase === 'listening' ? listeningQuestions : readingQuestions;
  const currentQ: FixedMockExamQuestion | undefined = currentSectionList[sectionIndex];

  const finishExam = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    stopChineseSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker(null);
    setConfirmAction('none');

    const listeningCorrect = listeningQuestions.filter(
      (q) => answers[q.number] === q.correctLetter
    ).length;
    const readingCorrect = readingQuestions.filter(
      (q) => answers[q.number] === q.correctLetter
    ).length;

    const listeningScore = listeningQuestions.reduce(
      (sum, q) => sum + (answers[q.number] === q.correctLetter ? q.points : 0),
      0
    );
    const readingScore = readingQuestions.reduce(
      (sum, q) => sum + (answers[q.number] === q.correctLetter ? q.points : 0),
      0
    );
    const totalScore = listeningScore + readingScore;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));

    const result: HskMockExamResult = {
      id: `hsk-${paper.id}-${Date.now()}`,
      examId: paper.id,
      examTitle: paper.titleAr,
      examTrack: paper.track,
      modelNumber: paper.modelNumber,
      completedAt: new Date().toISOString(),
      listeningCorrect,
      listeningTotal: listeningQuestions.length,
      listeningScore,
      readingCorrect,
      readingTotal: readingQuestions.length,
      readingScore,
      totalScore,
      maxScore: paper.maxScore,
      passed: totalScore >= paper.passScore,
      elapsedSeconds,
    };

    setFinalResult(result);
    setPhase('results');
    void recordHskFixedMockExam(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers, listeningQuestions, paper, readingQuestions, recordHskFixedMockExam]);

  const moveToReadingSection = useCallback(() => {
    stopChineseSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker(null);
    setConfirmAction('none');
    setPhase('reading');
    setSectionIndex(0);
    setRemainingSeconds(paper.readingDurationSeconds);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [paper.readingDurationSeconds]);

  // المؤقت التنازلي الرسمي
  useEffect(() => {
    if (phase !== 'listening' && phase !== 'reading') return;

    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          if (phase === 'listening') {
            moveToReadingSection();
          } else {
            finishExam();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase, moveToReadingSection, finishExam]);

  useEffect(() => {
    stopChineseSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker(null);
  }, [sectionIndex, phase]);

  const handleStartExam = () => {
    submittedRef.current = false;
    startedAtRef.current = Date.now();
    setAnswers({});
    setPlaysUsed({});
    setShowListeningQuestionText({});
    setSectionIndex(0);
    setRemainingSeconds(paper.listeningDurationSeconds);
    setPhase('listening');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayExamAudio = (q: FixedMockExamQuestion, enforceLimit: boolean) => {
    const used = playsUsed[q.number] ?? 0;
    if (enforceLimit && used >= MAX_LISTENING_PLAYS) return;

    if (isPlayingAudio || replayingNumber === q.number) {
      stopChineseSpeech();
      setIsPlayingAudio(false);
      setActiveSpeaker(null);
      setReplayingNumber(null);
      return;
    }

    if (enforceLimit) {
      setPlaysUsed((prev) => ({ ...prev, [q.number]: (prev[q.number] ?? 0) + 1 }));
    } else {
      setReplayingNumber(q.number);
    }

    setIsPlayingAudio(true);

    const onDone = () => {
      setIsPlayingAudio(false);
      setActiveSpeaker(null);
      setReplayingNumber(null);
    };

    if (q.audioDialogue && q.audioDialogue.length > 0) {
      const lines = q.audioDialogue.map((t) => ({ speaker: t.speaker, text: t.hanzi }));
      if (q.questionZh) {
        lines.push({ speaker: 'A', text: q.questionZh.replace(/^问：/, '') });
      }
      const ok = speakChineseDialogue(lines, {
        onLineStart: (_, sp) => setActiveSpeaker(sp),
        onComplete: onDone,
        onError: onDone,
      });
      if (!ok) onDone();
      return;
    }

    if (q.audioSingle) {
      const ok = speakChinese(q.audioSingle.hanzi, 0.96, {
        onEnd: onDone,
        onError: onDone,
      });
      if (!ok) onDone();
    }
  };

  // =========================================================================
  // شاشة التعليمات قبل البدء
  // =========================================================================
  if (phase === 'briefing') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-6"
      >
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى بوابة الامتحانات الدولية</span>
        </button>

        <div className="neo-frame rounded-xl p-7 sm:p-10 bg-white dark:bg-[#1E1C1A] space-y-6">
          <div className="space-y-2 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
              <span>نموذج موحّد ثابت (مطابق لجميع الطلاب)</span>
              <span aria-hidden="true">·</span>
              <span className="font-hanzi">{paper.titleZh}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {paper.titleAr}
            </h1>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">{paper.subtitleAr}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB] flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#B91C1C] dark:text-[#EF4444]" />
                  <span>القسم الأول: الاستماع (听力)</span>
                </span>
                <span className="text-xs font-bold tabular-nums text-[#B91C1C] dark:text-[#EF4444]">
                  ١٢:٠٠ دقيقة
                </span>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                ٢٠ سؤالاً (١٠٠ درجة) موزعة على الأجزاء الأربعة المعتمدة مع حد صارم للاستماع مرتين فقط
                لكل سؤال.
              </p>
            </div>

            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
                  <span>القسم الثاني: القراءة (阅读)</span>
                </span>
                <span className="text-xs font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                  ٢٠:٠٠ دقيقة
                </span>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                ٢٠ سؤالاً (١٠٠ درجة) يُفتح تلقائياً بعد إنهاء قسم الاستماع ولا يمكن العودة للاستماع
                بعد الانتقال.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#D97706]/30 bg-[#D97706]/8 dark:bg-[#F59E0B]/10 p-4 text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F2EB] space-y-1">
            <p>
              • الدرجة النهائية من <strong>{paper.maxScore}</strong> درجة، ودرجة النجاح المعتمدة هي{' '}
              <strong>{paper.passScore}</strong> درجة فأكثر.
            </p>
            <p>
              • بعد التسليم ستظهر لك مراجعة شاملة للأسئلة الـ ٤٠ تتضمن إجابتك مقابل الإجابة الصحيحة،
              ونصوص الاستماع المخفية، والترجمة العربية الكاملة.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-7 py-3.5 min-h-[48px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-sm transition-colors"
            >
              <span>بدء الامتحان الموحّد الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>
    );
  }

  // =========================================================================
  // شاشة النتائج والمراجعة الكاملة للأسئلة الـ 40
  // =========================================================================
  if (phase === 'results' && finalResult) {
    const filteredQuestions = paper.questions.filter((q) => {
      if (reviewFilter === 'wrong') return answers[q.number] !== q.correctLetter;
      if (reviewFilter === 'listening') return q.section === 'listening';
      if (reviewFilter === 'reading') return q.section === 'reading';
      return true;
    });

    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8"
      >
        <div className="neo-frame rounded-xl p-7 sm:p-9 bg-white dark:bg-[#1E1C1A] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-5">
            <div className="flex items-center gap-4">
              <span
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                  finalResult.passed
                    ? 'border-[#15803D] bg-[#15803D]/10 text-[#15803D] dark:text-[#22C55E]'
                    : 'border-[#B91C1C] bg-[#B91C1C]/10 text-[#B91C1C] dark:text-[#EF4444]'
                }`}
              >
                <Award className="w-7 h-7" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                  تقرير الدرجات الرسمي — {paper.titleAr}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums">
                  {finalResult.totalScore} / {finalResult.maxScore} —{' '}
                  <span
                    className={
                      finalResult.passed
                        ? 'text-[#15803D] dark:text-[#22C55E]'
                        : 'text-[#B91C1C] dark:text-[#EF4444]'
                    }
                  >
                    {finalResult.passed ? 'ناجح (اجتاز ١٢٠+)' : 'لم يجتز (أقل من ١٢٠)'}
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleStartExam}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة النموذج</span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] dark:bg-[#EF4444] text-white text-xs font-bold"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى بوابة HSK 3.0</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-4">
              <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                درجة الاستماع (听力)
              </p>
              <p className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                {finalResult.listeningScore} / 100
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                {finalResult.listeningCorrect} إجابة صحيحة من ٢٠
              </p>
            </div>

            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-4">
              <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                درجة القراءة (阅读)
              </p>
              <p className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                {finalResult.readingScore} / 100
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                {finalResult.readingCorrect} إجابة صحيحة من ٢٠
              </p>
            </div>

            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-4">
              <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                الزمن المستغرق وحفظ النتيجة
              </p>
              <p className="text-2xl font-bold text-[#D97706] dark:text-[#F59E0B] mt-1">
                {formatTimer(finalResult.elapsedSeconds)}
              </p>
              <p className="text-xs text-[#15803D] dark:text-[#22C55E] mt-0.5 font-semibold">
                تم الحفظ والمزامنة في سجل HSK الدولي
              </p>
            </div>
          </div>
        </div>

        {/* مراجعة الأسئلة الـ 40 مع كشف النصوص الصوتية والترجمة العربية */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              مراجعة شاملة للأسئلة الـ ٤٠ ونصوص الاستماع
            </h2>

            <div className="inline-flex flex-wrap p-1 rounded-lg border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F2ECE1] dark:bg-[#1E1C1A] gap-1 text-xs font-bold">
              {(
                [
                  { key: 'all', label: `الكل (${paper.questions.length})` },
                  {
                    key: 'wrong',
                    label: `الأخطاء (${
                      paper.questions.filter((q) => answers[q.number] !== q.correctLetter).length
                    })`,
                  },
                  { key: 'listening', label: 'الاستماع (١–٢٠)' },
                  { key: 'reading', label: 'القراءة (٢١–٤٠)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setReviewFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    reviewFilter === tab.key
                      ? 'bg-white dark:bg-[#292623] text-[#B91C1C] dark:text-[#EF4444]'
                      : 'text-[#57534E] dark:text-[#A8A29E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const userAns = answers[q.number];
              const isOk = userAns === q.correctLetter;
              const correctOpt = q.options.find((o) => o.letter === q.correctLetter);
              const userOpt = q.options.find((o) => o.letter === userAns);

              return (
                <div
                  key={q.number}
                  className={`rounded-xl border p-5 bg-white dark:bg-[#1E1C1A] space-y-3 ${
                    isOk
                      ? 'border-[#15803D]/30 dark:border-[#22C55E]/30'
                      : 'border-[#B91C1C]/35 dark:border-[#EF4444]/35'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-bold">
                      <span className="tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
                        سؤال {q.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#57534E] dark:text-[#A8A29E]">
                        {q.partLabelZh} ({q.partLabelAr})
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        isOk
                          ? 'text-[#15803D] dark:text-[#22C55E]'
                          : 'text-[#B91C1C] dark:text-[#EF4444]'
                      }`}
                    >
                      {isOk ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>صحيح (+{q.points})</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>خطأ (0)</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* كشف النص الصوتي المخفي + زر إعادة الاستماع */}
                  {q.section === 'listening' && (
                    <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
                          نص الاستماع المخفي (Audio Transcript)
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlayExamAudio(q, false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{replayingNumber === q.number ? 'إيقاف' : 'إعادة الاستماع'}</span>
                        </button>
                      </div>

                      {q.audioSingle && (
                        <div>
                          <RubyChinese
                            hanzi={q.audioSingle.hanzi}
                            pinyin={q.audioSingle.pinyin}
                            showPinyin={showPinyin}
                            className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                          />
                          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                            {q.audioSingle.arabic}
                          </p>
                        </div>
                      )}

                      {q.audioDialogue && (
                        <div className="space-y-1.5">
                          {q.audioDialogue.map((t, i) => (
                            <div key={i} className="space-y-0.5">
                              <div dir="ltr" className="flex items-baseline gap-2 text-left">
                                <span className="font-hanzi text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                                  {t.roleLabelZh}：
                                </span>
                                <RubyChinese
                                  hanzi={t.hanzi}
                                  pinyin={t.pinyin}
                                  showPinyin={showPinyin}
                                  className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                                />
                              </div>
                              <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                                ({t.roleLabelZh === '女' ? 'المتحدثة' : 'المتحدث'}): {t.arabic}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {q.questionZh && (
                        <div className="pt-2 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                          <RubyChinese
                            hanzi={q.questionZh}
                            pinyin={q.questionPinyin}
                            showPinyin={showPinyin}
                            className="text-sm font-bold text-[#B91C1C] dark:text-[#EF4444]"
                          />
                        </div>
                      )}
                      {q.questionAr && (
                        <p className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F2EB]">
                          {q.questionAr}
                        </p>
                      )}
                    </div>
                  )}

                  {/* نص القراءة في المراجعة */}
                  {q.section === 'reading' && (
                    <div className="rounded-lg bg-[#F9F6F0] dark:bg-[#121110] p-4 space-y-1.5">
                      {q.promptZh && (
                        <RubyChinese
                          hanzi={q.promptZh}
                          pinyin={q.promptPinyin}
                          showPinyin={showPinyin}
                          className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                        />
                      )}
                      {q.questionZh && (
                        <div>
                          <RubyChinese
                            hanzi={q.questionZh}
                            pinyin={q.questionPinyin}
                            showPinyin={showPinyin}
                            className="text-sm font-bold text-[#B91C1C] dark:text-[#EF4444]"
                          />
                        </div>
                      )}
                      {q.promptAr && (
                        <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">{q.promptAr}</p>
                      )}
                      {q.questionAr && (
                        <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                          {q.questionAr}
                        </p>
                      )}
                    </div>
                  )}

                  {/* إجابة الطالب مقابل الإجابة الصحيحة */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-3">
                      <span className="text-[#57534E] dark:text-[#A8A29E] block text-xs mb-1">
                        إجابتك:
                      </span>
                      <strong
                        className={
                          isOk
                            ? 'text-[#15803D] dark:text-[#22C55E]'
                            : 'text-[#B91C1C] dark:text-[#EF4444]'
                        }
                      >
                        {userAns
                          ? `${userAns}${
                              userOpt?.hanzi
                                ? ` — ${userOpt.hanzi}`
                                : userOpt?.arabic
                                  ? ` — ${userOpt.arabic}`
                                  : userOpt?.sceneCaptionAr
                                    ? ` — ${userOpt.sceneCaptionAr}`
                                    : ''
                            }`
                          : 'لم تتم الإجابة'}
                      </strong>
                    </div>

                    <div className="rounded-lg border border-[#15803D]/30 dark:border-[#22C55E]/30 bg-[#15803D]/6 dark:bg-[#22C55E]/10 p-3">
                      <span className="text-[#57534E] dark:text-[#A8A29E] block text-xs mb-1">
                        الإجابة الصحيحة:
                      </span>
                      <strong className="text-[#15803D] dark:text-[#22C55E]">
                        {q.correctLetter}
                        {correctOpt?.hanzi
                          ? ` — ${correctOpt.hanzi}`
                          : correctOpt?.arabic
                            ? ` — ${correctOpt.arabic}`
                            : correctOpt?.sceneCaptionAr
                              ? ` — ${correctOpt.sceneCaptionAr}`
                              : ''}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
                    <strong className="text-[#1C1917] dark:text-[#F5F2EB]">الترجمة والتوضيح: </strong>
                    {q.translationAr}
                    {q.noteAr ? ` — ${q.noteAr}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>
    );
  }

  if (!currentQ) return null;

  // =========================================================================
  // واجهة الامتحان النشط (القسم ١: الاستماع ١٢:٠٠ | القسم ٢: القراءة ٢٠:٠٠)
  // =========================================================================
  const usedPlays = playsUsed[currentQ.number] ?? 0;
  const remainingPlays = Math.max(0, MAX_LISTENING_PLAYS - usedPlays);
  const selectedLetter = answers[currentQ.number];
  const isVisualOptions = currentQ.options.some((o) => Boolean(o.sceneId));
  const answeredInSection = currentSectionList.filter((q) => Boolean(answers[q.number])).length;
  const isLowTime = remainingSeconds <= 120;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-5"
    >
      {/* الشريط العلوي للامتحان مع المؤقت وحالة القفل */}
      <div className="sticky top-16 z-30 rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white/95 dark:bg-[#1E1C1A]/95 backdrop-blur-sm shadow-xs px-4 sm:px-5 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <span className="font-hanzi text-sm font-bold text-[#B91C1C] dark:text-[#EF4444]">
            {phase === 'listening' ? '第一部分 · 听力' : '第二部分 · 阅读'}
          </span>
          <span aria-hidden="true" className="text-[#1C1917]/20 dark:text-[#F5F2EB]/20">
            |
          </span>
          <span className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] tabular-nums">
            {phase === 'listening' ? '١–٢٠' : '٢١–٤٠'} ({answeredInSection}/{currentSectionList.length})
          </span>
          {phase === 'reading' && (
            <span className="inline-flex items-center gap-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
              <Lock className="w-3.5 h-3.5" />
              <span>تم إغلاق قسم الاستماع</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={togglePinyin}
            aria-pressed={showPinyin}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
              showPinyin
                ? 'border-[#D97706]/40 bg-[#D97706]/10 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E]'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPinyin ? 'إخفاء البينين (Pinyin)' : 'إظهار البينين (Pinyin)'}</span>
          </button>

          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-bold text-sm tabular-nums ${
              isLowTime
                ? 'border-[#B91C1C] bg-[#B91C1C]/10 text-[#B91C1C] dark:text-[#EF4444]'
                : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setConfirmAction('exit')}
            className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444]"
          >
            إنهاء والخروج
          </button>
        </div>
      </div>

      {/* شريط التأكيد المدمج (بدون window.confirm) */}
      {confirmAction !== 'none' && (
        <div className="rounded-xl border border-[#D97706]/50 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm font-bold text-[#1C1917] dark:text-[#F5F2EB]">
            <AlertTriangle className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B] shrink-0" />
            <span>
              {confirmAction === 'to-reading' &&
                'هل تريد الانتقال إلى القسم الثاني (القراءة)؟ لن تتمكن من العودة إلى الاستماع بعد ذلك.'}
              {confirmAction === 'submit' &&
                'هل أنت متأكد من تسليم الامتحان الآن وعرض التقرير الرسمي من ٢٠٠ درجة؟'}
              {confirmAction === 'exit' &&
                'سيتم إلغاء المحاولة الحالية دون حفظ النتيجة. هل تريد الخروج؟'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmAction('none')}
              className="px-3.5 py-2 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold"
            >
              تراجع
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirmAction === 'to-reading') moveToReadingSection();
                else if (confirmAction === 'submit') finishExam();
                else {
                  stopChineseSpeech();
                  onExit();
                }
              }}
              className="px-4 py-2 rounded-lg bg-[#B91C1C] dark:bg-[#EF4444] text-white text-xs font-bold"
            >
              تأكيد
            </button>
          </div>
        </div>
      )}

      {/* شريط التنقل بين أسئلة القسم الحالي (1-20 أو 21-40) */}
      <div
        dir="ltr"
        className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-3"
      >
        {currentSectionList.map((q, idx) => {
          const isCurrent = idx === sectionIndex;
          const isDone = Boolean(answers[q.number]);
          return (
            <button
              key={q.number}
              type="button"
              onClick={() => setSectionIndex(idx)}
              className={`w-9 h-9 rounded-md text-xs font-bold tabular-nums transition-colors ${
                isCurrent
                  ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                  : isDone
                    ? 'bg-[#15803D]/15 dark:bg-[#22C55E]/20 text-[#15803D] dark:text-[#22C55E] border border-[#15803D]/30'
                    : 'bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:border hover:border-[#B91C1C]/40'
              }`}
            >
              {q.number}
            </button>
          );
        })}
      </div>

      {/* بطاقة السؤال الحالية */}
      <div className="neo-frame rounded-xl p-6 sm:p-8 bg-white dark:bg-[#1E1C1A] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span
            dir={isInternational ? 'ltr' : 'rtl'}
            className="font-hanzi font-bold text-[#D97706] dark:text-[#F59E0B]"
          >
            {isInternational
              ? `${currentQ.partLabelZh} · 第 ${currentQ.number} 题`
              : `السؤال ${currentQ.number} · ${currentQ.partLabelAr}`}
          </span>
          <span
            dir={isInternational ? 'ltr' : 'rtl'}
            className="tabular-nums font-semibold text-[#57534E] dark:text-[#A8A29E]"
          >
            {isInternational ? `${currentQ.points} 分` : `${currentQ.points} درجات`}
          </span>
        </div>

        {/* مشغل الاستماع مع حد صارم مرتين فقط */}
        {phase === 'listening' && (
          <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-6 flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              disabled={!isPlayingAudio && remainingPlays === 0}
              onClick={() => handlePlayExamAudio(currentQ, true)}
              className={`inline-flex items-center justify-center gap-3 px-7 py-3.5 min-h-[52px] rounded-xl font-bold text-sm transition-colors ${
                isPlayingAudio
                  ? 'bg-[#D97706] text-white'
                  : remainingPlays === 0
                    ? 'bg-[#1C1917]/15 dark:bg-[#F5F2EB]/15 text-[#57534E] dark:text-[#A8A29E] cursor-not-allowed'
                    : 'bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] text-white'
              }`}
            >
              {isPlayingAudio ? (
                <Headphones className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              <span className={isInternational ? 'font-hanzi text-base' : ''}>
                {isPlayingAudio
                  ? activeSpeaker
                    ? activeSpeaker === 'A'
                      ? isInternational
                        ? '正在播放 · 女'
                        : 'جارٍ التشغيل · المتحدثة'
                      : isInternational
                        ? '正在播放 · 男'
                        : 'جارٍ التشغيل · المتحدث'
                    : isInternational
                      ? '正在播放...'
                      : 'جارٍ التشغيل...'
                  : remainingPlays === 0
                    ? isInternational
                      ? '已播放 2 次'
                      : 'انتهت مرات الاستماع (0)'
                    : isInternational
                      ? '播放录音'
                      : 'تشغيل الصوت'}
              </span>
            </button>

            <span className="text-xs font-bold tabular-nums text-[#57534E] dark:text-[#A8A29E]">
              {isInternational
                ? `剩余播放次数：${remainingPlays} / ${MAX_LISTENING_PLAYS}`
                : `مرات الاستماع المتبقية: ${remainingPlays} / ${MAX_LISTENING_PLAYS}`}
            </span>

            {/* إخفاء نص السؤال (问：...) افتراضياً في 听力第四部分 مع زر إظهار اختياري */}
            {currentQ.partId === 'listening-p4' && (currentQ.questionZh || currentQ.questionAr) && (
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
                  <div className="w-full flex flex-col items-center gap-1.5">
                    {isInternational && currentQ.questionZh && (
                      <RubyChinese
                        hanzi={currentQ.questionZh}
                        pinyin={currentQ.questionPinyin}
                        showPinyin={showPinyin}
                        className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                      />
                    )}
                    {!isInternational && currentQ.questionAr && (
                      <p className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                        {currentQ.questionAr}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* نص القراءة */}
        {phase === 'reading' && (
          <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0] dark:bg-[#121110] p-6 space-y-4 text-center">
            {currentQ.promptZh && (
              <div className="flex justify-center">
                <RubyChinese
                  hanzi={currentQ.promptZh}
                  pinyin={currentQ.promptPinyin}
                  showPinyin={showPinyin}
                  className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                />
              </div>
            )}

            {!isInternational && currentQ.promptAr && (
              <p className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                {currentQ.promptAr}
              </p>
            )}

            {isInternational && currentQ.questionZh && (
              <div className="pt-3 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex justify-center">
                <RubyChinese
                  hanzi={currentQ.questionZh}
                  pinyin={currentQ.questionPinyin}
                  showPinyin={showPinyin}
                  className="text-lg sm:text-xl font-bold text-[#B91C1C] dark:text-[#EF4444]"
                />
              </div>
            )}

            {!isInternational && currentQ.questionAr && (
              <div className="pt-3 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
                <p className="text-base sm:text-lg font-bold text-[#B91C1C] dark:text-[#EF4444]">
                  {currentQ.questionAr}
                </p>
              </div>
            )}
          </div>
        )}

        {/* الخيارات (بصرية أو نصية) */}
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
              const isSelected = selectedLetter === opt.letter;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQ.number]: opt.letter }))
                  }
                  className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2.5 transition-all duration-150 ${
                    isSelected
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#181614] hover:border-[#B91C1C]/45'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                        : 'bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10 text-[#1C1917] dark:text-[#F5F2EB]'
                    }`}
                  >
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
            dir={isInternational ? 'ltr' : 'rtl'}
            className={`grid gap-3 ${
              currentQ.options.length > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {currentQ.options.map((opt) => {
              const isSelected = selectedLetter === opt.letter;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQ.number]: opt.letter }))
                  }
                  className={`rounded-xl border-2 px-4 py-3.5 flex items-center gap-4 transition-all duration-150 ${
                    isInternational ? 'text-left' : 'text-right'
                  } ${
                    isSelected
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/12'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#181614] hover:border-[#B91C1C]/45'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                        : 'bg-[#1C1917]/8 dark:bg-[#F5F2EB]/10 text-[#1C1917] dark:text-[#F5F2EB]'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <div className="flex-1">
                    {isInternational ? (
                      opt.hanzi && (
                        <RubyChinese
                          hanzi={opt.hanzi}
                          pinyin={opt.pinyin}
                          showPinyin={showPinyin}
                          className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                        />
                      )
                    ) : opt.hanzi ? (
                      <RubyChinese
                        hanzi={opt.hanzi}
                        pinyin={opt.pinyin}
                        showPinyin={showPinyin}
                        className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                      />
                    ) : (
                      <span className="text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                        {opt.arabic}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* أزرار التنقل السفلي والانتقال/التسليم */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
          <button
            type="button"
            disabled={sectionIndex === 0}
            onClick={() => setSectionIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold disabled:opacity-40"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السؤال السابق</span>
          </button>

          <div className="flex items-center gap-2.5">
            {sectionIndex + 1 < currentSectionList.length ? (
              <button
                type="button"
                onClick={() => setSectionIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#1C1917] dark:bg-[#F5F2EB] text-white dark:text-[#121110] text-xs font-bold"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : phase === 'listening' ? (
              <button
                type="button"
                onClick={() => setConfirmAction('to-reading')}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold"
              >
                <span>الانتقال إلى قسم القراءة (阅读)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmAction('submit')}
                className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[42px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] text-white text-xs font-bold"
              >
                <span>تسليم الامتحان</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
