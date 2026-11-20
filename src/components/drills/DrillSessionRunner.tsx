import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { DRILL_METADATA } from '../../data/chaptersData';
import {
  ChapterData,
  DrillQuestion,
  QuestionAnswerRecord,
  QuizMode,
  SessionDrillKey,
} from '../../types';
import { generateDrillQuestions, stopChineseSpeech } from '../../utils/drillGenerators';
import { ArabicToHanziDrill } from './ArabicToHanziDrill';
import { FillInBlankDrill } from './FillInBlankDrill';
import { HanziToArabicDrill } from './HanziToArabicDrill';
import { HanziToPinyinDrill } from './HanziToPinyinDrill';
import { ListeningDrill } from './ListeningDrill';
import { MatchingThreeColDrill } from './MatchingThreeColDrill';
import { MatchingTwoColDrill } from './MatchingTwoColDrill';
import { SentenceBuilderDrill } from './SentenceBuilderDrill';
import { SentenceTranslationDrill } from './SentenceTranslationDrill';

interface DrillSessionRunnerProps {
  chapter: ChapterData;
  drillKey: SessionDrillKey;
  mode: QuizMode;
  onExit: () => void;
}

export function DrillSessionRunner({
  chapter,
  drillKey,
  mode,
  onExit,
}: DrillSessionRunnerProps) {
  const { showPinyin, recordCompletedSession } = useApp();

  const [sessionSeed, setSessionSeed] = useState(0);
  const questions = useMemo<DrillQuestion[]>(
    () => generateDrillQuestions(chapter, drillKey),
    [chapter, drillKey, sessionSeed]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerRecord>>({});
  const [lockedQuestions, setLockedQuestions] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [syncSavedMessage, setSyncSavedMessage] = useState<string>('');

  const sessionTitle =
    drillKey === 'mixed' ? 'اختبار شامل للفصل' : DRILL_METADATA[drillKey].titleAr;

  const currentQuestion = questions[currentIndex];
  const currentRecord = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isCurrentLocked = currentQuestion ? Boolean(lockedQuestions[currentQuestion.id]) : false;

  const answeredCount = questions.filter((q) => answers[q.id]?.isAnswered).length;

  const handleRestart = () => {
    stopChineseSpeech();
    setSessionSeed((s) => s + 1);
    setCurrentIndex(0);
    setAnswers({});
    setLockedQuestions({});
    setIsFinished(false);
    setSyncSavedMessage('');
  };

  const handleSelectOption = (optionId: string, label: string, isCorrect: boolean) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        drillType: currentQuestion.drillType,
        isAnswered: true,
        isCorrect,
        selectedOptionId: optionId,
        userDisplay: label,
      },
    }));

    if (mode === 'practice') {
      setLockedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  const handleMatchingComplete = (
    correctPairs: number,
    totalPairs: number,
    summaryDisplay: string
  ) => {
    if (!currentQuestion) return;
    const allPerfect = correctPairs === totalPairs;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        drillType: currentQuestion.drillType,
        isAnswered: true,
        isCorrect: allPerfect,
        matchedCorrectPairs: correctPairs,
        totalMatchingPairs: totalPairs,
        userDisplay: summaryDisplay,
      },
    }));

    if (mode === 'practice') {
      setLockedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  const handleUpdateBuilderTiles = (
    nextTileIds: string[],
    assembledText: string,
    isCorrect: boolean
  ) => {
    if (!currentQuestion) return;
    const expectedCount = currentQuestion.shuffledSegments?.length ?? 0;
    const isComplete = nextTileIds.length === expectedCount && expectedCount > 0;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        drillType: currentQuestion.drillType,
        isAnswered: mode === 'exam' ? nextTileIds.length > 0 : isComplete,
        isCorrect: isComplete && isCorrect,
        assembledTileIds: nextTileIds,
        userDisplay: assembledText || 'لم يتم ترتيب الجملة',
      },
    }));
  };

  const handlePracticeBuilderCheck = () => {
    if (!currentQuestion) return;
    setLockedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
  };

  const finalizeSession = async () => {
    stopChineseSpeech();
    const finalRecords: QuestionAnswerRecord[] = questions.map((q) => {
      const existing = answers[q.id];
      if (existing) return existing;
      return {
        questionId: q.id,
        drillType: q.drillType,
        isAnswered: true,
        isCorrect: false,
        userDisplay: 'لم تتم الإجابة',
      };
    });

    setIsFinished(true);
    const syncRes = await recordCompletedSession(chapter.id, finalRecords);
    if (syncRes) {
      setSyncSavedMessage(
        syncRes.syncedRemotely
          ? 'تم حفظ النتائج ومزامنتها تلقائياً مع سجل المعلم.'
          : 'تم حفظ النتائج في ملفك المحلي على هذا الجهاز.'
      );
    }
  };

  if (questions.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
          محتوى هذا الفصل قيد الإضافة
        </h2>
        <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
          لا توجد عناصر كافية لتشغيل هذا التمرين حالياً.
        </p>
        <button
          type="button"
          onClick={onExit}
          className="px-6 py-3 rounded-lg bg-[#B91C1C] dark:bg-[#EF4444] text-white text-sm font-bold"
        >
          العودة إلى الفصل
        </button>
      </section>
    );
  }

  // شاشة النتيجة والمراجعة النهائية
  if (isFinished) {
    const total = questions.length;
    const correctTotal = questions.filter((q) => answers[q.id]?.isCorrect).length;
    const wrongTotal = total - correctTotal;
    const scorePercent = Math.round((correctTotal / total) * 100);

    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8"
      >
        {/* بطاقة النتيجة الإجمالية */}
        <div className="neo-frame rounded-xl p-8 text-center space-y-6 bg-white dark:bg-[#1E1C1A]">
          <div className="mx-auto cinnabar-seal w-16 h-16 rounded-lg flex items-center justify-center bg-[#B91C1C]/5 dark:bg-[#EF4444]/10">
            <Award className="w-8 h-8 text-[#B91C1C] dark:text-[#EF4444]" />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E]">
              {chapter.titleAr} · {sessionTitle} · {mode === 'practice' ? 'وضع التدريب' : 'وضع الامتحان'}
            </p>
            <h1 className="text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              اكتملت الجلسة بنتيجة <span className="tabular-nums text-[#B91C1C] dark:text-[#EF4444]">{scorePercent}%</span>
            </h1>
            {syncSavedMessage && (
              <p className="text-xs font-semibold text-[#15803D] dark:text-[#22C55E] pt-1">
                {syncSavedMessage}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
            <div className="rounded-lg border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 p-3.5 bg-[#F9F6F0] dark:bg-[#121110]">
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mb-1">الإجمالي</p>
              <p className="text-xl font-bold tabular-nums">{total}</p>
            </div>
            <div className="rounded-lg border border-[#15803D]/25 dark:border-[#22C55E]/25 p-3.5 bg-[#15803D]/8 dark:bg-[#22C55E]/10">
              <p className="text-xs text-[#15803D] dark:text-[#22C55E] mb-1">صحيح</p>
              <p className="text-xl font-bold tabular-nums text-[#15803D] dark:text-[#22C55E]">
                {correctTotal}
              </p>
            </div>
            <div className="rounded-lg border border-[#B91C1C]/25 dark:border-[#EF4444]/25 p-3.5 bg-[#B91C1C]/8 dark:bg-[#EF4444]/10">
              <p className="text-xs text-[#B91C1C] dark:text-[#EF4444] mb-1">خطأ</p>
              <p className="text-xl font-bold tabular-nums text-[#B91C1C] dark:text-[#EF4444]">
                {wrongTotal}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التمرين</span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/40 text-sm font-bold transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى مركز الفصل</span>
            </button>
          </div>
        </div>

        {/* مراجعة تفصيلية لكل سؤال */}
        <div className="rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB] border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
            مراجعة الإجابات
          </h2>

          <div className="divide-y divide-[#1C1917]/8 dark:divide-[#F5F2EB]/8">
            {questions.map((q, idx) => {
              const rec = answers[q.id];
              const isRight = Boolean(rec?.isCorrect);
              return (
                <div key={q.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
                      <span className="tabular-nums font-bold">سؤال {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{DRILL_METADATA[q.drillType].titleAr}</span>
                    </div>

                    <p className="text-base font-bold text-[#1C1917] dark:text-[#F5F2EB] break-words">
                      {q.sentenceWithBlank ?? q.promptPrimary}
                    </p>

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
                          {rec?.userDisplay ?? 'لم تتم الإجابة'}
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

                  <div className="shrink-0 mt-1">
                    {isRight ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] dark:text-[#22C55E]">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>صحيح</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B91C1C] dark:text-[#EF4444]">
                        <XCircle className="w-5 h-5" />
                        <span>خطأ</span>
                      </span>
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

  const progressRatio = Math.round(((currentIndex + 1) / questions.length) * 100);
  const canProceedPractice = isCurrentLocked;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10 space-y-6"
    >
      {/* شريط معلومات الجلسة */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              stopChineseSpeech();
              onExit();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-bold hover:border-[#B91C1C]/40 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>خروج</span>
          </button>

          <div>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              {chapter.titleAr} · {mode === 'practice' ? 'وضع التدريب' : 'وضع الامتحان'}
            </p>
            <h1 className="text-base sm:text-lg font-bold text-[#1C1917] dark:text-[#F5F2EB]">
              {sessionTitle}
              {drillKey === 'mixed' && currentQuestion && (
                <span className="text-xs font-normal text-[#57534E] dark:text-[#A8A29E] mr-2">
                  ({DRILL_METADATA[currentQuestion.drillType].titleAr})
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="text-xs sm:text-sm font-bold tabular-nums text-[#1C1917] dark:text-[#F5F2EB]">
          السؤال {currentIndex + 1} من {questions.length}
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="h-1.5 w-full rounded-full bg-[#1C1917]/10 dark:bg-[#F5F2EB]/10 overflow-hidden">
        <div
          className="h-full bg-[#B91C1C] dark:bg-[#EF4444] transition-all duration-200"
          style={{ width: `${progressRatio}%` }}
        />
      </div>

      {/* شريط التنقل الحر بين الأسئلة في وضع الامتحان */}
      {mode === 'exam' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {questions.map((q, idx) => {
              const answered = Boolean(answers[q.id]?.isAnswered);
              const active = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    stopChineseSpeech();
                    setCurrentIndex(idx);
                  }}
                  className={`w-9 h-9 rounded-md text-xs font-bold tabular-nums border transition-colors ${
                    active
                      ? 'border-[#B91C1C] dark:border-[#EF4444] bg-[#B91C1C] dark:bg-[#EF4444] text-white'
                      : answered
                        ? 'border-[#D97706]/50 dark:border-[#F59E0B]/50 bg-[#D97706]/12 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                        : 'border-[#1C1917]/12 dark:border-[#F5F2EB]/12 bg-[#F9F6F0] dark:bg-[#121110] text-[#57534E] dark:text-[#A8A29E] hover:border-[#1C1917]/30'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-[#57534E] dark:text-[#A8A29E] tabular-nums">
            تمت الإجابة على {answeredCount} من {questions.length}
          </span>
        </div>
      )}

      {/* عرض محرك السؤال النشط */}
      <div className="pt-2">
        {currentQuestion.drillType === 'hanzi-to-arabic' && (
          <HanziToArabicDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            selectedOptionId={currentRecord?.selectedOptionId}
            isLocked={isCurrentLocked}
            onSelectOption={handleSelectOption}
          />
        )}

        {currentQuestion.drillType === 'arabic-to-hanzi' && (
          <ArabicToHanziDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            selectedOptionId={currentRecord?.selectedOptionId}
            isLocked={isCurrentLocked}
            onSelectOption={handleSelectOption}
          />
        )}

        {currentQuestion.drillType === 'hanzi-to-pinyin' && (
          <HanziToPinyinDrill
            question={currentQuestion}
            mode={mode}
            selectedOptionId={currentRecord?.selectedOptionId}
            isLocked={isCurrentLocked}
            onSelectOption={handleSelectOption}
          />
        )}

        {currentQuestion.drillType === 'match-2-col' && (
          <MatchingTwoColDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            onComplete={handleMatchingComplete}
          />
        )}

        {currentQuestion.drillType === 'match-3-col' && (
          <MatchingThreeColDrill
            question={currentQuestion}
            mode={mode}
            onComplete={handleMatchingComplete}
          />
        )}

        {currentQuestion.drillType === 'listening' && (
          <ListeningDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            selectedOptionId={currentRecord?.selectedOptionId}
            isLocked={isCurrentLocked}
            onSelectOption={handleSelectOption}
          />
        )}

        {currentQuestion.drillType === 'sentence-translation' && (
          <SentenceTranslationDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            selectedOptionId={currentRecord?.selectedOptionId}
            isLocked={isCurrentLocked}
            onSelectOption={handleSelectOption}
          />
        )}

        {currentQuestion.drillType === 'sentence-builder' && (
          <SentenceBuilderDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            assembledTileIds={currentRecord?.assembledTileIds ?? []}
            isLocked={isCurrentLocked}
            onUpdateTiles={handleUpdateBuilderTiles}
            onPracticeCheck={handlePracticeBuilderCheck}
          />
        )}

        {currentQuestion.drillType === 'fill-in-blank' && (
          <FillInBlankDrill
            question={currentQuestion}
            mode={mode}
            showPinyin={showPinyin}
            selectedOptionId={currentRecord?.selectedOptionId}
            isLocked={isCurrentLocked}
            onSelectOption={handleSelectOption}
          />
        )}
      </div>

      {/* بطاقة التغذية الراجعة الفورية في وضع التدريب للأسئلة الاختيارية */}
      {mode === 'practice' &&
        isCurrentLocked &&
        currentQuestion.drillType !== 'sentence-builder' && (
          <div
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              currentRecord?.isCorrect
                ? 'border-[#15803D]/35 dark:border-[#22C55E]/40 bg-[#15803D]/10 dark:bg-[#22C55E]/12 text-[#15803D] dark:text-[#22C55E]'
                : 'border-[#B91C1C]/35 dark:border-[#EF4444]/40 bg-[#B91C1C]/10 dark:bg-[#EF4444]/12 text-[#B91C1C] dark:text-[#EF4444]'
            }`}
          >
            {currentRecord?.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
            )}
            <div className="space-y-1 text-sm">
              <p className="font-bold">
                {currentRecord?.isCorrect
                  ? 'إجابة صحيحة! أحسنت.'
                  : 'إجابة غير صحيحة — راجع الإجابة الصحيحة أدناه:'}
              </p>
              {!currentRecord?.isCorrect && (
                <p className="text-[#1C1917] dark:text-[#F5F2EB]">
                  الإجابة الصحيحة: <strong>{currentQuestion.correctDisplay}</strong>
                  {showPinyin && currentQuestion.correctPinyinDisplay && (
                    <span className="font-pinyin mr-2 text-[#57534E] dark:text-[#A8A29E]">
                      ({currentQuestion.correctPinyinDisplay})
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

      {/* أزرار التحكم السفلية */}
      <div className="pt-4 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex flex-wrap items-center justify-between gap-3">
        {mode === 'exam' ? (
          <>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  stopChineseSpeech();
                  setCurrentIndex((i) => Math.max(0, i - 1));
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-sm font-bold disabled:opacity-40"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              {!isLastQuestion && (
                <button
                  type="button"
                  onClick={() => {
                    stopChineseSpeech();
                    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] hover:border-[#B91C1C]/45 text-sm font-bold"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={finalizeSession}
              className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>تسليم الامتحان</span>
            </button>
          </>
        ) : (
          <div className="w-full flex justify-end">
            <button
              type="button"
              disabled={!canProceedPractice}
              onClick={() => {
                stopChineseSpeech();
                if (isLastQuestion) {
                  void finalizeSession();
                } else {
                  setCurrentIndex((i) => i + 1);
                }
              }}
              className="inline-flex items-center gap-2 px-7 py-3 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isLastQuestion ? 'عرض النتيجة النهائية' : 'السؤال التالي'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
