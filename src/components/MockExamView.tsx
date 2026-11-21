import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Headphones,
  Lock,
  RotateCcw,
  ShieldCheck,
  Users,
  Volume2,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { DrillType, MockExamAttempt, QuestionAnswerRecord } from '../types';
import {
  GeneratedMockExam,
  generateOfficialMockExam,
  MockExamQuestion,
  MockExamSubPart,
} from '../utils/mockExamGenerator';
import {
  initChineseVoices,
  isSpeechSupported,
  speakChinese,
  speakChineseDialogue,
  stopChineseSpeech,
} from '../utils/speech';
import { SpeakChineseButton } from './drills/SpeakChineseButton';

interface MockExamViewProps {
  onBack: () => void;
}

type ExamPhase = 'briefing' | 'listening' | 'reading' | 'results';
type ReviewFilter = 'all' | 'wrong' | 'listening' | 'reading';

interface MockAnswerState {
  selectedOptionId?: string;
  assembledTileIds?: string[];
  userDisplay: string;
  isAnswered: boolean;
}

const LISTENING_DURATION_SEC = 15 * 60; // 15:00
const READING_DURATION_SEC = 17 * 60; // 17:00
const MAX_PLAYS_PER_QUESTION = 2;
const PASSING_SCORE = 120;

const SUBPART_LABELS: Record<MockExamSubPart, string> = {
  'listening-word-phrase': 'استماع الكلمات والعبارات',
  'listening-dialogue': 'الحوارات الموقفية (متحدثان)',
  'reading-cloze': 'إكمال الفراغ السياقي',
  'reading-response': 'مطابقة الجمل والرد المنطقي',
  'reading-reorder': 'ترتيب الكلمات وبناء الجملة',
};

function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function mapSubPartToDrillType(subPart: MockExamSubPart): DrillType {
  switch (subPart) {
    case 'listening-word-phrase':
    case 'listening-dialogue':
      return 'listening';
    case 'reading-cloze':
      return 'fill-in-blank';
    case 'reading-response':
      return 'sentence-hanzi-to-arabic';
    case 'reading-reorder':
      return 'sentence-builder';
  }
}

function evaluateMockQuestion(q: MockExamQuestion, ans: MockAnswerState | undefined): boolean {
  if (!ans || !ans.isAnswered) return false;
  if (q.subPart === 'reading-reorder') {
    const tiles = q.shuffledSegments ?? [];
    const byId = new Map(tiles.map((t) => [t.tileId, t.text]));
    const assembled = (ans.assembledTileIds ?? []).map((id) => byId.get(id) ?? '').join('');
    const expected = (q.correctSegments ?? []).join('');
    return Boolean(expected) && assembled === expected;
  }
  return ans.selectedOptionId === q.correctOptionId;
}

export function MockExamView({ onBack }: MockExamViewProps) {
  const { showPinyin, progress, recordMockExamAttempt } = useApp();

  const [phase, setPhase] = useState<ExamPhase>('briefing');
  const [exam, setExam] = useState<GeneratedMockExam>(() =>
    generateOfficialMockExam(CHAPTERS_DATA)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, MockAnswerState>>({});
  const [playsUsed, setPlaysUsed] = useState<Record<string, number>>({});
  const [listeningRemaining, setListeningRemaining] = useState(LISTENING_DURATION_SEC);
  const [readingRemaining, setReadingRemaining] = useState(READING_DURATION_SEC);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'A' | 'B' | null>(null);

  const [confirmNextSection, setConfirmNextSection] = useState(false);
  const [confirmSubmitExam, setConfirmSubmitExam] = useState(false);
  const [confirmExitExam, setConfirmExitExam] = useState(false);

  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [completedAttempt, setCompletedAttempt] = useState<MockExamAttempt | null>(null);
  const [syncMessage, setSyncMessage] = useState('');

  const finalizedRef = useRef(false);
  const speechSupported = isSpeechSupported();

  useEffect(() => {
    const cleanup = initChineseVoices();
    return () => {
      cleanup();
      stopChineseSpeech();
    };
  }, []);

  const stopAudioPlayback = useCallback(() => {
    stopChineseSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker(null);
  }, []);

  const startNewExam = () => {
    stopAudioPlayback();
    finalizedRef.current = false;
    setExam(generateOfficialMockExam(CHAPTERS_DATA));
    setAnswers({});
    setPlaysUsed({});
    setCurrentIdx(0);
    setListeningRemaining(LISTENING_DURATION_SEC);
    setReadingRemaining(READING_DURATION_SEC);
    setConfirmNextSection(false);
    setConfirmSubmitExam(false);
    setConfirmExitExam(false);
    setCompletedAttempt(null);
    setSyncMessage('');
    setReviewFilter('all');
    setPhase('listening');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const transitionToReading = useCallback(() => {
    stopAudioPlayback();
    setConfirmNextSection(false);
    setConfirmExitExam(false);
    setCurrentIdx(0);
    setPhase('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopAudioPlayback]);

  const finalizeMockExam = useCallback(async () => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    stopAudioPlayback();
    setConfirmSubmitExam(false);
    setConfirmExitExam(false);

    const listeningCorrect = exam.listeningQuestions.filter((q) =>
      evaluateMockQuestion(q, answers[q.id])
    ).length;
    const readingCorrect = exam.readingQuestions.filter((q) =>
      evaluateMockQuestion(q, answers[q.id])
    ).length;

    const listeningScore = listeningCorrect * 5;
    const readingScore = readingCorrect * 5;
    const totalScore = listeningScore + readingScore;
    const passed = totalScore >= PASSING_SCORE;

    const listeningSpent = LISTENING_DURATION_SEC - listeningRemaining;
    const readingSpent = READING_DURATION_SEC - readingRemaining;
    const elapsedSeconds = Math.max(1, listeningSpent + readingSpent);

    const attempt: MockExamAttempt = {
      id: `hsk-mock-${Date.now()}`,
      completedAt: new Date().toISOString(),
      listeningCorrect,
      listeningTotal: exam.listeningQuestions.length,
      listeningScore,
      readingCorrect,
      readingTotal: exam.readingQuestions.length,
      readingScore,
      totalScore,
      maxScore: 200,
      passed,
      elapsedSeconds,
    };

    const records: QuestionAnswerRecord[] = exam.allQuestions.map((q) => {
      const ans = answers[q.id];
      const isCorrect = evaluateMockQuestion(q, ans);
      return {
        questionId: q.id,
        chapterId: q.chapterId,
        drillType: mapSubPartToDrillType(q.subPart),
        isAnswered: true,
        isCorrect,
        selectedOptionId: ans?.selectedOptionId,
        assembledTileIds: ans?.assembledTileIds,
        userDisplay: ans?.userDisplay || 'لم تتم الإجابة',
      };
    });

    setCompletedAttempt(attempt);
    setPhase('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const syncRes = await recordMockExamAttempt(attempt, records);
    if (syncRes) {
      setSyncMessage(
        syncRes.syncedRemotely
          ? 'تم تسجيل نتيجة الامتحان الدولي ومزامنتها مع سجل المعلم.'
          : 'تم تسجيل نتيجة الامتحان الدولي في ملفك المحلي.'
      );
    }
  }, [exam, answers, listeningRemaining, readingRemaining, recordMockExamAttempt, stopAudioPlayback]);

  // مؤقت العد التنازلي الصارم للقسم الأول (15:00) والقسم الثاني (17:00)
  useEffect(() => {
    if (phase !== 'listening' && phase !== 'reading') return;

    const intervalId = window.setInterval(() => {
      if (phase === 'listening') {
        setListeningRemaining((prev) => Math.max(0, prev - 1));
      } else if (phase === 'reading') {
        setReadingRemaining((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [phase]);

  // الانتقال التلقائي فور انتهاء مؤقت الاستماع (00:00)
  useEffect(() => {
    if (phase === 'listening' && listeningRemaining === 0) {
      transitionToReading();
    }
  }, [phase, listeningRemaining, transitionToReading]);

  // التسليم التلقائي فور انتهاء مؤقت القراءة والقواعد (00:00)
  useEffect(() => {
    if (phase === 'reading' && readingRemaining === 0) {
      void finalizeMockExam();
    }
  }, [phase, readingRemaining, finalizeMockExam]);

  const activeQuestions = useMemo(
    () => (phase === 'listening' ? exam.listeningQuestions : exam.readingQuestions),
    [phase, exam]
  );

  const currentQuestion = activeQuestions[currentIdx];

  const handlePlayListeningAudio = (q: MockExamQuestion) => {
    if (!speechSupported || isPlayingAudio) return;
    const used = playsUsed[q.id] ?? 0;
    if (used >= MAX_PLAYS_PER_QUESTION) return;

    setPlaysUsed((prev) => ({ ...prev, [q.id]: used + 1 }));
    setIsPlayingAudio(true);

    if (q.subPart === 'listening-dialogue' && q.dialogueLines) {
      speakChineseDialogue(
        q.dialogueLines.map((l) => ({ speaker: l.speaker, text: l.hanzi })),
        {
          onLineStart: (_idx, speaker) => setActiveSpeaker(speaker),
          onComplete: () => {
            setIsPlayingAudio(false);
            setActiveSpeaker(null);
          },
          onError: () => {
            setIsPlayingAudio(false);
            setActiveSpeaker(null);
          },
        }
      );
    } else if (q.audioText) {
      setActiveSpeaker('A');
      speakChinese(q.audioText, 0.95, {
        onEnd: () => {
          setIsPlayingAudio(false);
          setActiveSpeaker(null);
        },
        onError: () => {
          setIsPlayingAudio(false);
          setActiveSpeaker(null);
        },
      });
    }
  };

  const handleSelectOption = (q: MockExamQuestion, optionId: string, label: string) => {
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        selectedOptionId: optionId,
        userDisplay: label,
        isAnswered: true,
      },
    }));
  };

  const handleToggleReorderTile = (q: MockExamQuestion, tileId: string, remove: boolean) => {
    const tiles = q.shuffledSegments ?? [];
    const byId = new Map(tiles.map((t) => [t.tileId, t.text]));
    const prevIds = answers[q.id]?.assembledTileIds ?? [];

    const nextIds = remove
      ? prevIds.filter((id) => id !== tileId)
      : prevIds.includes(tileId)
        ? prevIds
        : [...prevIds, tileId];

    const assembledText = nextIds.map((id) => byId.get(id) ?? '').join('');
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        assembledTileIds: nextIds,
        userDisplay: assembledText || 'لم يتم ترتيب الجملة',
        isAnswered: nextIds.length > 0,
      },
    }));
  };

  const handleClearReorder = (q: MockExamQuestion) => {
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {
        assembledTileIds: [],
        userDisplay: 'لم يتم ترتيب الجملة',
        isAnswered: false,
      },
    }));
  };

  const navigateQuestion = (nextIndex: number) => {
    stopAudioPlayback();
    setCurrentIdx(nextIndex);
  };

  const pastAttempts = progress?.mockExamHistory ?? [];

  // ===========================================================================
  // المرحلة 1: شاشة التعليمات الرسمية قبل بدء الامتحان
  // ===========================================================================
  if (phase === 'briefing') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8"
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الرئيسية</span>
        </button>

        <div className="neo-frame rounded-xl p-7 sm:p-10 bg-white dark:bg-[#1E1C1A] space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-6">
            <div className="cinnabar-seal w-16 h-16 rounded-lg flex items-center justify-center bg-[#B91C1C]/6 dark:bg-[#EF4444]/12 shrink-0">
              <Award className="w-8 h-8 text-[#B91C1C] dark:text-[#EF4444]" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
                <span>اختبار محاكاة رسمي</span>
                <span aria-hidden="true">·</span>
                <span>المستوى الأول (الفصول ١ إلى ٥)</span>
                <span aria-hidden="true">·</span>
                <span>٤٠ سؤالاً · ٢٠٠ درجة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                محاكي امتحان HSK الدولي
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* بطاقة القسم الأول */}
            <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/75 dark:bg-[#121110]/75 p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Headphones className="w-5 h-5 text-[#B91C1C] dark:text-[#EF4444]" />
                  <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    القسم الأول: الاستماع
                  </h2>
                </div>
                <span className="text-xs font-bold tabular-nums text-[#B91C1C] dark:text-[#EF4444]">
                  ١٥:٠٠ دقيقة · ١٠٠ درجة
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] space-y-1.5 list-disc pr-5">
                <li>٢٠ سؤالاً مقسّمة إلى: ١٠ أسئلة كلمات وعبارات + ١٠ حوارات موقفية بين متحدثَين.</li>
                <li>يُسمح بالاستماع لكل تسجيل صوتي <strong className="text-[#1C1917] dark:text-[#F5F2EB]">مرتين فقط</strong> تماماً كالامتحان الدولي.</li>
                <li>فور تسليم هذا القسم أو انتهاء مؤقته يُغلق نهائياً ولا يمكن الرجوع إليه.</li>
              </ul>
            </div>

            {/* بطاقة القسم الثاني */}
            <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0]/75 dark:bg-[#121110]/75 p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B]" />
                  <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    القسم الثاني: القراءة والقواعد
                  </h2>
                </div>
                <span className="text-xs font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                  ١٧:٠٠ دقيقة · ١٠٠ درجة
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] space-y-1.5 list-disc pr-5">
                <li>٢٠ سؤالاً: ٧ إكمال فراغ سياقي + ٧ مطابقة رد منطقي + ٦ ترتيب وبناء الجمل.</li>
                <li>يُفتح تلقائياً بعد إنهاء قسم الاستماع، ويُسلّم الامتحان تلقائياً عند انتهاء المؤقت.</li>
                <li>درجة النجاح الرسمية: <strong className="text-[#15803D] dark:text-[#22C55E]">١٢٠ درجة فأكثر من أصل ٢٠٠</strong>.</li>
              </ul>
            </div>
          </div>

          {!speechSupported && (
            <div className="rounded-lg border border-[#D97706]/40 bg-[#D97706]/10 p-4 text-xs text-[#92400E] dark:text-[#F59E0B] flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                تنبيه: متصفحك الحالي لا يدعم تشغيل النطق الصوتي تلقائياً؛ يُفضّل فتح الامتحان عبر
                متصفح Chrome أو Edge للحصول على أفضل تجربة استماع.
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
              <ShieldCheck className="w-4 h-4 text-[#15803D] dark:text-[#22C55E]" />
              <span>تُحفظ نتيجتك وتقرير المراجعة الكامل في ملفك الشخصي تلقائياً.</span>
            </div>

            <button
              type="button"
              onClick={startNewExam}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 min-h-[48px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-base transition-colors"
            >
              <span>ابدأ الامتحان الدولي الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* سجل المحاولات السابقة إن وجد */}
        {pastAttempts.length > 0 && (
          <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 space-y-4">
            <h2 className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              محاولاتك السابقة في محاكي امتحان HSK الدولي
            </h2>
            <div className="divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
              {pastAttempts.slice(0, 5).map((att) => (
                <div
                  key={att.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <span className="text-[#57534E] dark:text-[#A8A29E] tabular-nums">
                    {new Date(att.completedAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex flex-wrap items-center gap-4 tabular-nums">
                    <span>الاستماع: <strong>{att.listeningScore}/100</strong></span>
                    <span>القراءة: <strong>{att.readingScore}/100</strong></span>
                    <span className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                      الإجمالي: {att.totalScore}/200
                    </span>
                    <span
                      className={`font-bold ${
                        att.passed
                          ? 'text-[#15803D] dark:text-[#22C55E]'
                          : 'text-[#B91C1C] dark:text-[#EF4444]'
                      }`}
                    >
                      {att.passed ? 'ناجح' : 'لم يجتز'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.section>
    );
  }

  // ===========================================================================
  // المرحلة 4: تقرير الدرجات الرسمي (من 200) والمراجعة الكاملة
  // ===========================================================================
  if (phase === 'results' && completedAttempt) {
    const subPartsOrder: MockExamSubPart[] = [
      'listening-word-phrase',
      'listening-dialogue',
      'reading-cloze',
      'reading-response',
      'reading-reorder',
    ];

    const subPartStats = subPartsOrder.map((sp) => {
      const qs = exam.allQuestions.filter((q) => q.subPart === sp);
      const correct = qs.filter((q) => evaluateMockQuestion(q, answers[q.id])).length;
      return { subPart: sp, label: SUBPART_LABELS[sp], correct, total: qs.length };
    });

    const totalWrong = exam.allQuestions.filter(
      (q) => !evaluateMockQuestion(q, answers[q.id])
    ).length;

    const filteredReview = exam.allQuestions.filter((q) => {
      if (reviewFilter === 'wrong') return !evaluateMockQuestion(q, answers[q.id]);
      if (reviewFilter === 'listening') return q.section === 'listening';
      if (reviewFilter === 'reading') return q.section === 'reading';
      return true;
    });

    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8"
      >
        {/* الشهادة والنتيجة الرسمية من 200 */}
        <div className="neo-frame rounded-xl p-7 sm:p-10 bg-white dark:bg-[#1E1C1A] text-center space-y-6">
          <div
            className={`mx-auto w-16 h-16 rounded-lg border-2 flex items-center justify-center ${
              completedAttempt.passed
                ? 'border-[#15803D] dark:border-[#22C55E] bg-[#15803D]/10 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#22C55E]'
                : 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              تقرير النتيجة الرسمي · محاكي امتحان HSK الدولي
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] tabular-nums">
              {completedAttempt.totalScore} <span className="text-xl text-[#57534E] dark:text-[#A8A29E]">/ 200</span>
            </h1>
            <p
              className={`text-base sm:text-lg font-bold ${
                completedAttempt.passed
                  ? 'text-[#15803D] dark:text-[#22C55E]'
                  : 'text-[#B91C1C] dark:text-[#EF4444]'
              }`}
            >
              {completedAttempt.passed
                ? 'ناجح — اجتزت الدرجة المطلوبة بنجاح (١٢٠+ / ٢٠٠)'
                : 'لم يجتز — الدرجة أقل من حد النجاح الرسمي (١٢٠ / ٢٠٠)'}
            </p>
            {syncMessage && (
              <p className="text-xs font-semibold text-[#15803D] dark:text-[#22C55E]">
                {syncMessage}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-4 bg-[#F9F6F0] dark:bg-[#121110]">
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mb-1">القسم الأول: الاستماع</p>
              <p className="text-2xl font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
                {completedAttempt.listeningScore} / 100
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums mt-0.5">
                {completedAttempt.listeningCorrect} صحيح من أصل {completedAttempt.listeningTotal}
              </p>
            </div>

            <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-4 bg-[#F9F6F0] dark:bg-[#121110]">
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mb-1">القسم الثاني: القراءة والقواعد</p>
              <p className="text-2xl font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
                {completedAttempt.readingScore} / 100
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums mt-0.5">
                {completedAttempt.readingCorrect} صحيح من أصل {completedAttempt.readingTotal}
              </p>
            </div>

            <div className="rounded-xl border border-[#D97706]/25 dark:border-[#F59E0B]/30 p-4 bg-[#D97706]/8 dark:bg-[#F59E0B]/10">
              <p className="text-xs text-[#92400E] dark:text-[#F59E0B] mb-1">إجمالي الوقت المستغرق</p>
              <p className="text-2xl font-bold tabular-nums text-[#92400E] dark:text-[#F59E0B]">
                {formatCountdown(completedAttempt.elapsedSeconds)}
              </p>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">من أصل ٣٢:٠٠ دقيقة</p>
            </div>
          </div>

          {/* تفصيل الأجزاء الخمسة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 text-right">
            {subPartStats.map((st) => (
              <div
                key={st.subPart}
                className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-3 bg-[#F9F6F0]/60 dark:bg-[#121110]/60"
              >
                <p className="text-[11px] font-semibold text-[#57534E] dark:text-[#A8A29E] mb-1">
                  {st.label}
                </p>
                <p className="text-base font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
                  {st.correct} / {st.total}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startNewExam}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>محاولة امتحان جديدة</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/40 text-sm font-bold transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى الرئيسية</span>
            </button>
          </div>
        </div>

        {/* مراجعة الأسئلة الأربعة والاربعين سؤالاً بسؤال */}
        <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
            <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              مراجعة تفصيلية لجميع الأسئلة
            </h2>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { key: 'all', label: `الكل (${exam.allQuestions.length})` },
                  { key: 'wrong', label: `الأخطاء فقط (${totalWrong})` },
                  { key: 'listening', label: 'الاستماع (20)' },
                  { key: 'reading', label: 'القراءة والقواعد (20)' },
                ] as { key: ReviewFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setReviewFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors tabular-nums ${
                    reviewFilter === tab.key
                      ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : 'bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] border border-[#1C1917]/12 dark:border-[#F5F2EB]/12'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
            {filteredReview.map((q) => {
              const ans = answers[q.id];
              const isRight = evaluateMockQuestion(q, ans);

              return (
                <div key={q.id} className="py-5 flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
                      <span className="font-bold tabular-nums">سؤال {q.questionNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.section === 'listening' ? 'الاستماع' : 'القراءة والقواعد'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{SUBPART_LABELS[q.subPart]}</span>
                    </div>

                    {/* نص الحوار الكامل في المراجعة */}
                    {q.dialogueLines && (
                      <div className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0]/70 dark:bg-[#121110]/70 p-3.5 space-y-2 text-sm">
                        {q.dialogueLines.map((line, lIdx) => (
                          <div key={lIdx} className="space-y-0.5">
                            <p className="font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                              <span className="text-xs text-[#B91C1C] dark:text-[#EF4444] ml-2">
                                {line.speaker === 'A' ? 'المتحدثة (أ):' : 'المتحدث (ب):'}
                              </span>
                              <span className="font-hanzi text-base">{line.hanzi}</span>
                              {showPinyin && (
                                <span className="font-pinyin text-xs text-[#D97706] dark:text-[#F59E0B] mr-2">
                                  ({line.pinyin})
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">{line.arabic}</p>
                          </div>
                        ))}
                        {q.promptAr && (
                          <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F2EB] pt-1 border-t border-[#1C1917]/8 dark:border-[#F5F2EB]/8">
                            السؤال: {q.promptAr}
                          </p>
                        )}
                      </div>
                    )}

                    {/* إكمال الفراغ في المراجعة */}
                    {q.subPart === 'reading-cloze' && q.sentenceWithBlank && (
                      <div className="space-y-1">
                        <p className="font-hanzi text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                          {q.sentenceFullHanzi}
                        </p>
                        {showPinyin && q.sentenceFullPinyin && (
                          <p className="font-pinyin text-xs text-[#D97706] dark:text-[#F59E0B]">
                            {q.sentenceFullPinyin}
                          </p>
                        )}
                        <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                          المعنى: {q.meaningAr}
                        </p>
                      </div>
                    )}

                    {/* مطابقة الرد أو ترتيب الجملة أو استماع كلمة */}
                    {!q.dialogueLines && q.subPart !== 'reading-cloze' && (
                      <div className="space-y-1">
                        {q.promptZh && (
                          <p className="font-hanzi text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                            {q.promptZh}
                          </p>
                        )}
                        {q.subPart === 'listening-word-phrase' && q.audioText && (
                          <p className="font-hanzi text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                            {q.audioText}
                          </p>
                        )}
                        <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                          المعنى: {q.meaningAr}
                        </p>
                      </div>
                    )}

                    <div className="text-xs space-y-1 pt-1">
                      <p className="text-[#57534E] dark:text-[#A8A29E]">
                        إجابتك:{' '}
                        <strong
                          className={
                            isRight
                              ? 'text-[#15803D] dark:text-[#22C55E]'
                              : 'text-[#B91C1C] dark:text-[#EF4444]'
                          }
                        >
                          {ans?.userDisplay ?? 'لم تتم الإجابة'}
                        </strong>
                      </p>

                      {!isRight && (
                        <p className="text-[#15803D] dark:text-[#22C55E]">
                          الإجابة الصحيحة: <strong>{q.correctDisplay}</strong>
                          {showPinyin && q.correctPinyinDisplay && (
                            <span className="font-pinyin mr-2 text-[#57534E] dark:text-[#A8A29E]">
                              ({q.correctPinyinDisplay})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {isRight ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] dark:text-[#22C55E]">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>+5</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                        <XCircle className="w-5 h-5" />
                        <span>0</span>
                      </span>
                    )}

                    {q.audioText && <SpeakChineseButton text={q.audioText} compact showSlow={false} />}
                    {q.dialogueLines && (
                      <button
                        type="button"
                        onClick={() =>
                          speakChineseDialogue(
                            q.dialogueLines!.map((l) => ({ speaker: l.speaker, text: l.hanzi }))
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-semibold hover:border-[#B91C1C]"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#EF4444]" />
                        <span>إعادة الحوار</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>
    );
  }

  // ===========================================================================
  // المرحلتان 2 و 3: شاشة الامتحان النشط (القسم الأول: الاستماع / القسم الثاني: القراءة والقواعد)
  // ===========================================================================
  if (!currentQuestion) return null;

  const isListeningPhase = phase === 'listening';
  const activeTimer = isListeningPhase ? listeningRemaining : readingRemaining;
  const isTimerUrgent = activeTimer <= 120;

  const sectionAnsweredCount = activeQuestions.filter((q) => answers[q.id]?.isAnswered).length;
  const currentAns = answers[currentQuestion.id];
  const playsForCurrent = playsUsed[currentQuestion.id] ?? 0;
  const remainingPlays = Math.max(0, MAX_PLAYS_PER_QUESTION - playsForCurrent);

  return (
    <motion.section
      key={`${phase}-${currentQuestion.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
      className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6"
    >
      {/* الترويسة العلوية للامتحان الدولي مع المؤقت الصارم وحالة القسمين */}
      <div className="rounded-xl border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setConfirmExitExam(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:border-[#B91C1C] hover:text-[#B91C1C]"
          >
            <ArrowRight className="w-4 h-4" />
            <span>خروج</span>
          </button>

          <div>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              محاكي امتحان HSK الدولي · {SUBPART_LABELS[currentQuestion.subPart]}
            </p>
            <h1 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {isListeningPhase
                ? 'القسم الأول: الاستماع (٢٠ سؤالاً · ١٠٠ درجة)'
                : 'القسم الثاني: القراءة والقواعد (٢٠ سؤالاً · ١٠٠ درجة)'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isListeningPhase && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              <Lock className="w-3.5 h-3.5" />
              <span>الاستماع مغلق</span>
            </span>
          )}

          <div
            aria-label="الوقت المتبقي للقسم"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border font-bold text-sm tabular-nums ${
              isTimerUrgent
                ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/12 dark:bg-[#EF4444]/18 text-[#B91C1C] dark:text-[#EF4444]'
                : 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>{formatCountdown(activeTimer)}</span>
          </div>

          <span className="text-xs sm:text-sm font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
            سؤال {currentQuestion.questionNumber} / 40
          </span>
        </div>
      </div>

      {/* شريط تأكيد الخروج المبكر */}
      {confirmExitExam && (
        <div className="rounded-xl border border-[#B91C1C]/40 dark:border-[#EF4444]/40 bg-[#B91C1C]/8 dark:bg-[#EF4444]/12 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-[#B91C1C] dark:text-[#EF4444]">
            هل تريد مغادرة الامتحان الآن؟ لن يتم احتساب هذه المحاولة إذا خرجت قبل التسليم.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmExitExam(false)}
              className="px-4 py-2 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold"
            >
              متابعة الامتحان
            </button>
            <button
              type="button"
              onClick={() => {
                stopAudioPlayback();
                onBack();
              }}
              className="px-4 py-2 rounded-md bg-[#B91C1C] dark:bg-[#EF4444] text-white text-xs font-bold"
            >
              تأكيد الخروج
            </button>
          </div>
        </div>
      )}

      {/* شبكة التنقل بين أسئلة القسم الحالي */}
      <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {activeQuestions.map((q, idx) => {
            const answered = Boolean(answers[q.id]?.isAnswered);
            const active = idx === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => navigateQuestion(idx)}
                className={`w-9 h-9 rounded-md text-xs font-bold tabular-nums border transition-colors ${
                  active
                    ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                    : answered
                      ? 'border-[#D97706]/50 dark:border-[#F59E0B]/50 bg-[#D97706]/12 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:border-[#1C1917]/35'
                }`}
              >
                {q.questionNumber}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
          أجبت على {sectionAnsweredCount} من {activeQuestions.length} في هذا القسم
        </span>
      </div>

      {/* ===================================================================== */}
      {/* محتوى السؤال النشط                                                    */}
      {/* ===================================================================== */}
      <div className="space-y-6">
        {/* القسم 1: الاستماع (كلمات/جمل + حوارات متحدثَين بحد أقصى مرتين) */}
        {currentQuestion.section === 'listening' && (
          <div className="neo-frame rounded-xl p-7 sm:p-9 bg-white dark:bg-[#1E1C1A] text-center space-y-5">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              {currentQuestion.instructionAr}
            </p>

            {/* مشغّل الصوت بحد الاستماع الصارم (مرتان فقط) */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                disabled={remainingPlays === 0 || isPlayingAudio || !speechSupported}
                onClick={() => handlePlayListeningAudio(currentQuestion)}
                className={`inline-flex items-center gap-3 px-7 py-4 min-h-[54px] rounded-xl border-2 font-bold text-sm sm:text-base transition-all ${
                  remainingPlays === 0
                    ? 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F2ECE1] dark:bg-[#181614] text-[#57534E] dark:text-[#A8A29E] cursor-not-allowed'
                    : isPlayingAudio
                      ? 'border-[#D97706] dark:border-[#F59E0B] bg-[#D97706]/12 dark:bg-[#F59E0B]/18 text-[#92400E] dark:text-[#F59E0B]'
                      : 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white hover:bg-[#991B1B] dark:hover:bg-[#DC2626]'
                }`}
              >
                {currentQuestion.subPart === 'listening-dialogue' ? (
                  <Users className="w-5 h-5 shrink-0" />
                ) : (
                  <Volume2 className="w-5 h-5 shrink-0" />
                )}
                <span>
                  {isPlayingAudio
                    ? activeSpeaker === 'B'
                      ? 'المتحدث (ب) يتحدث الآن...'
                      : currentQuestion.subPart === 'listening-dialogue'
                        ? 'المتحدثة (أ) تتحدث الآن...'
                        : 'جارٍ تشغيل التسجيل الصوتي...'
                    : remainingPlays === 0
                      ? 'تم استنفاد مرات الاستماع'
                      : currentQuestion.subPart === 'listening-dialogue'
                        ? 'تشغيل الحوار الصوتي (متحدثان)'
                        : 'تشغيل التسجيل الصوتي'}
                </span>
              </button>

              <p
                className={`text-xs font-bold tabular-nums ${
                  remainingPlays === 0
                    ? 'text-[#B91C1C] dark:text-[#EF4444]'
                    : 'text-[#57534E] dark:text-[#A8A29E]'
                }`}
              >
                مرات الاستماع المتبقية: {remainingPlays} من {MAX_PLAYS_PER_QUESTION}
              </p>
            </div>

            {/* سؤال الفهم للحوارات الموقفية */}
            {currentQuestion.subPart === 'listening-dialogue' && (
              <div className="pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 space-y-1.5">
                {currentQuestion.promptAr && (
                  <p className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
                    {currentQuestion.promptAr}
                  </p>
                )}
                {currentQuestion.promptZh && (
                  <p className="font-hanzi text-base text-[#57534E] dark:text-[#A8A29E]">
                    {currentQuestion.promptZh}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* القسم 2أ: إكمال الفراغ السياقي (بدون أي ترجمة عربية) */}
        {currentQuestion.subPart === 'reading-cloze' && (
          <div className="neo-frame rounded-xl p-8 bg-white dark:bg-[#1E1C1A] text-center space-y-4">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              {currentQuestion.instructionAr}
            </p>
            {(() => {
              const parts = (currentQuestion.sentenceWithBlank ?? '').split('____');
              const selectedOpt = (currentQuestion.options ?? []).find(
                (o) => o.id === currentAns?.selectedOptionId
              );
              return (
                <div
                  dir="ltr"
                  className="font-hanzi text-2xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed flex flex-wrap items-center justify-center gap-1"
                >
                  <span>{parts[0]}</span>
                  <span className="mx-1 px-3 py-0.5 rounded-md border-b-2 border-[#B91C1C] dark:border-[#EF4444] text-[#B91C1C] dark:text-[#EF4444]">
                    {selectedOpt?.label ?? '____'}
                  </span>
                  <span>{parts.slice(1).join('____')}</span>
                </div>
              );
            })()}
          </div>
        )}

        {/* القسم 2ب: مطابقة الجمل والرد المنطقي */}
        {currentQuestion.subPart === 'reading-response' && (
          <div className="neo-frame rounded-xl p-8 bg-white dark:bg-[#1E1C1A] text-center space-y-3">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              {currentQuestion.instructionAr}
            </p>
            <p className="font-hanzi text-2xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {currentQuestion.promptZh}
            </p>
            {showPinyin && currentQuestion.promptPinyin && (
              <p className="font-pinyin text-sm sm:text-base text-[#D97706] dark:text-[#F59E0B]">
                {currentQuestion.promptPinyin}
              </p>
            )}
          </div>
        )}

        {/* خيارات الاختيار من متعدد للأجزاء 1أ، 1ب، 2أ، 2ب */}
        {currentQuestion.options && currentQuestion.subPart !== 'reading-reorder' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = currentAns?.selectedOptionId === opt.id;
              const optionLetter = ['أ', 'ب', 'ج', 'د'][oIdx] ?? String(oIdx + 1);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion, opt.id, opt.label)}
                  className={`min-h-[72px] px-5 py-4 rounded-xl border text-right flex items-center justify-between gap-3 transition-all duration-150 ${
                    isSelected
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C]/8 dark:bg-[#EF4444]/15 ring-1 ring-[#B91C1C]/30 dark:ring-[#EF4444]/30'
                      : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                          : 'bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] border border-[#1C1917]/10 dark:border-[#F5F2EB]/10'
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <div className="min-w-0">
                      <span
                        className={`block font-bold text-[#1C1917] dark:text-[#F5F2EB] ${
                          opt.isHanzi ? 'font-hanzi text-xl sm:text-2xl' : 'text-base'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {showPinyin && opt.subLabel && opt.isHanzi && (
                        <span className="block font-pinyin text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                          {opt.subLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* القسم 2ج: ترتيب الكلمات وبناء الجملة النحوية */}
        {currentQuestion.subPart === 'reading-reorder' && (
          <div className="space-y-5">
            <div className="neo-frame rounded-xl p-6 bg-white dark:bg-[#1E1C1A] text-center space-y-2">
              <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
                {currentQuestion.instructionAr}
              </p>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
                اضغط على المقاطع الصينية بالترتيب النحوي الصحيح لتكوين جملة سليمة.
              </p>
            </div>

            {(() => {
              const allTiles = currentQuestion.shuffledSegments ?? [];
              const assembledIds = currentAns?.assembledTileIds ?? [];
              const tileMap = new Map(allTiles.map((t) => [t.tileId, t]));
              const selectedTiles = assembledIds
                .map((id) => tileMap.get(id))
                .filter((t): t is { tileId: string; text: string } => Boolean(t));

              return (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                        إجابتك المركّبة (اضغط على أي مقطع لإزالته):
                      </span>
                      {assembledIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleClearReorder(currentQuestion)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C1C] dark:text-[#EF4444] hover:underline"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>إعادة الترتيب</span>
                        </button>
                      )}
                    </div>

                    <div
                      dir="ltr"
                      className="min-h-[84px] p-4 rounded-xl border-2 border-dashed border-[#1C1917]/20 dark:border-[#F5F2EB]/20 bg-white dark:bg-[#1E1C1A] flex flex-wrap items-center gap-2"
                    >
                      {selectedTiles.length === 0 ? (
                        <span
                          dir="rtl"
                          className="text-sm text-[#57534E]/70 dark:text-[#A8A29E]/70 mx-auto"
                        >
                          اختر المقاطع من الأسفل لتكوين الجملة الصينية هنا...
                        </span>
                      ) : (
                        selectedTiles.map((tile) => (
                          <button
                            key={tile.tileId}
                            type="button"
                            onClick={() =>
                              handleToggleReorderTile(currentQuestion, tile.tileId, true)
                            }
                            className="font-hanzi px-4 py-2 min-h-[44px] rounded-lg border border-[#B91C1C]/45 dark:border-[#EF4444]/45 bg-[#F9F6F0] dark:bg-[#121110] text-xl font-bold text-[#1C1917] dark:text-[#F5F2EB]"
                          >
                            {tile.text}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
                      المقاطع المتاحة:
                    </span>
                    <div dir="ltr" className="flex flex-wrap items-center gap-2.5">
                      {allTiles.map((tile) => {
                        const isUsed = assembledIds.includes(tile.tileId);
                        return (
                          <button
                            key={tile.tileId}
                            type="button"
                            disabled={isUsed}
                            onClick={() =>
                              handleToggleReorderTile(currentQuestion, tile.tileId, false)
                            }
                            className={`font-hanzi px-4 py-2.5 min-h-[46px] rounded-lg border text-xl font-bold transition-all ${
                              isUsed
                                ? 'border-[#1C1917]/8 dark:border-[#F5F2EB]/8 bg-[#F2ECE1]/60 dark:bg-[#181614] text-transparent select-none cursor-default'
                                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]'
                            }`}
                          >
                            {tile.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* شريط تأكيد الانتقال من القسم الأول إلى الثاني */}
      {confirmNextSection && isListeningPhase && (
        <div className="rounded-xl border border-[#D97706]/45 dark:border-[#F59E0B]/45 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-[#1C1917] dark:text-[#F5F2EB]">
            <p className="font-bold">تأكيد إنهاء قسم الاستماع والانتقال إلى القراءة والقواعد</p>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5 tabular-nums">
              أجبت على {sectionAnsweredCount} من {activeQuestions.length} في قسم الاستماع. لا يمكنك
              العودة إلى هذا القسم بعد الانتقال.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmNextSection(false)}
              className="px-4 py-2 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={transitionToReading}
              className="px-5 py-2 rounded-md bg-[#B91C1C] dark:bg-[#EF4444] text-white text-xs font-bold"
            >
              تأكيد الانتقال للقسم الثاني
            </button>
          </div>
        </div>
      )}

      {/* شريط تأكيد التسليم النهائي للامتحان */}
      {confirmSubmitExam && !isListeningPhase && (
        <div className="rounded-xl border border-[#B91C1C]/40 dark:border-[#EF4444]/40 bg-[#B91C1C]/8 dark:bg-[#EF4444]/12 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-[#1C1917] dark:text-[#F5F2EB]">
            <p className="font-bold">هل أنت متأكد من تسليم الامتحان الدولي الآن؟</p>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5 tabular-nums">
              أجبت على {sectionAnsweredCount} من {activeQuestions.length} في قسم القراءة والقواعد.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmSubmitExam(false)}
              className="px-4 py-2 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold"
            >
              مراجعة إجاباتي
            </button>
            <button
              type="button"
              onClick={() => void finalizeMockExam()}
              className="px-5 py-2 rounded-md bg-[#B91C1C] dark:bg-[#EF4444] text-white text-xs font-bold"
            >
              تأكيد التسليم وإظهار النتيجة
            </button>
          </div>
        </div>
      )}

      {/* شريط التنقل السفلي وأزرار الانتقال/التسليم */}
      <div className="pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => navigateQuestion(Math.max(0, currentIdx - 1))}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-sm font-bold disabled:opacity-40"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          {currentIdx < activeQuestions.length - 1 && (
            <button
              type="button"
              onClick={() => navigateQuestion(Math.min(activeQuestions.length - 1, currentIdx + 1))}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 text-sm font-bold"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {isListeningPhase ? (
          <button
            type="button"
            onClick={() => setConfirmNextSection(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
          >
            <span>إنهاء الاستماع والانتقال للقراءة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmSubmitExam(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>تسليم الامتحان</span>
          </button>
        )}
      </div>
    </motion.section>
  );
}
