export interface UnlockedAccess {
  chapters: number[];
  intlMocks: number[];
  arabicMocks: number[];
  patterns: number[];
}

export interface Student {
  id: string;
  name: string;
  code: string;
  unlockedAccess?: UnlockedAccess;
  boundDeviceId?: string;
}

export interface VocabSyllable {
  hanzi: string;
  pinyin: string;
  tone: number;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
  syllables?: VocabSyllable[];
  partOfSpeech?: string;
  /** Optional custom tone variants for Hanzi -> Pinyin drill */
  toneVariants?: [string, string];
  /** Optional custom similar-syllable distractors for Hanzi -> Pinyin drill */
  similarSyllables?: [string, string];
}

export interface SentenceItem {
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
  /** Ordered Chinese segments used in Sentence Builder drill */
  segments: string[];
  /** Exact substring inside `hanzi` replaced by ____ in Fill in the Blank drill */
  targetBlank: string;
  /** Optional custom 3 distractor words for Fill in the Blank drill */
  blankDistractors?: string[];
}

export interface ChapterData {
  id: number;
  chineseNumeral: string;
  titleAr: string;
  subtitleAr: string;
  vocab: VocabItem[];
  sentences: SentenceItem[];
}

export type DrillType =
  | 'hanzi-to-arabic'
  | 'arabic-to-hanzi'
  | 'hanzi-to-pinyin'
  | 'match-2-col'
  | 'match-3-col'
  | 'listening'
  | 'sentence-hanzi-to-arabic'
  | 'sentence-arabic-to-hanzi'
  | 'sentence-builder'
  | 'fill-in-blank';

export type SessionDrillKey = DrillType | 'mixed';

export type QuizMode = 'practice' | 'exam';

export type AppView =
  | 'home'
  | 'chapters'
  | 'chapter-hub'
  | 'collections'
  | 'labs'
  | 'vault'
  | 'custom-builder'
  | 'hsk-portal'
  | 'mock-exam'
  | 'drill'
  | 'analytics';

export type StudyBookmarkItemType = 'vocab' | 'sentence';

export interface StudentStudyBookmark {
  key: string;
  itemType: StudyBookmarkItemType;
  itemId: string;
  chapterId: number;
  bookmarked: boolean;
  note: string;
  updatedAt: string;
}

export type BroadcastStyle = 'info' | 'important' | 'promo';

export interface TeacherBroadcast {
  id: string;
  enabled: boolean;
  message: string;
  style: BroadcastStyle;
  ctaLabel?: string;
  ctaUrl?: string;
  updatedAt: string;
}

export type HskPatternId =
  | 'listening-p1'
  | 'listening-p2'
  | 'listening-p3'
  | 'listening-p4'
  | 'reading-p1'
  | 'reading-p2'
  | 'reading-p3-4';

export interface HskPatternStatEntry {
  solved: number;
  attempted: number;
  correct: number;
  wrong: number;
  accuracyPercent: number;
}

export interface HskMockExamResult {
  id: string;
  examId: string;
  examTitle: string;
  examTrack: 'international' | 'arabic';
  modelNumber: number;
  completedAt: string;
  listeningCorrect: number;
  listeningTotal: number;
  listeningScore: number;
  readingCorrect: number;
  readingTotal: number;
  readingScore: number;
  totalScore: number;
  maxScore: number;
  passed: boolean;
  elapsedSeconds: number;
}

export interface CustomQuizConfig {
  chapterIds: number[];
  drillScope: DrillType | 'all';
  questionLimit: 10 | 20 | 40 | 'all';
  mode: QuizMode;
}

export interface MistakeItem {
  key: string;
  chapterId: number;
  drillType: DrillType;
  sourceItemId: string;
  recordedAt: string;
}

export interface DrillOption {
  id: string;
  label: string;
  subLabel?: string;
  isHanzi?: boolean;
  isPinyin?: boolean;
}

export interface MatchingEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
}

export interface DrillQuestion {
  id: string;
  chapterId: number;
  sourceItemId?: string;
  drillType: DrillType;
  promptPrimary: string;
  promptPinyin?: string;
  promptSecondary?: string;
  /** Used in Sentence Translation to indicate direction */
  direction?: 'hanzi-to-arabic' | 'arabic-to-hanzi';
  /** Used in Listening or TTS buttons for speechSynthesis */
  audioText?: string;
  /** Multiple-choice options */
  options?: DrillOption[];
  correctOptionId?: string;
  /** Matching sets (Drills 4, 5) */
  matchingEntries?: MatchingEntry[];
  /** Sentence Builder */
  correctSegments?: string[];
  shuffledSegments?: { tileId: string; text: string }[];
  /** Fill in the Blank */
  targetBlank?: string;
  sentenceWithBlank?: string;
  sentenceFullHanzi?: string;
  sentenceFullPinyin?: string;
  /** Human-readable explanation shown in review / feedback */
  correctDisplay: string;
  correctPinyinDisplay?: string;
  meaningDisplay?: string;
}

export interface QuestionAnswerRecord {
  questionId: string;
  chapterId: number;
  sourceItemId?: string;
  drillType: DrillType;
  isAnswered: boolean;
  isCorrect: boolean;
  selectedOptionId?: string;
  assembledTileIds?: string[];
  matchedCorrectPairs?: number;
  totalMatchingPairs?: number;
  userDisplay: string;
}

export interface DrillStatEntry {
  attempted: number;
  correct: number;
}

export interface ChapterStatEntry {
  solved: number;
  correct: number;
  completedDrills: DrillType[];
}

export interface MockExamAttempt {
  id: string;
  completedAt: string;
  listeningCorrect: number;
  listeningTotal: number;
  listeningScore: number;
  readingCorrect: number;
  readingTotal: number;
  readingScore: number;
  totalScore: number;
  maxScore: number;
  passed: boolean;
  elapsedSeconds: number;
}

export interface StudentProgress {
  studentId: string;
  totalSolved: number;
  correctCount: number;
  wrongCount: number;
  activeSeconds: number;
  studyDates: string[];
  lastActive: string;
  drillStats: Record<DrillType, DrillStatEntry>;
  drillTimeSeconds: Record<DrillType, number>;
  chapterStats: Record<number, ChapterStatEntry>;
  mistakes: MistakeItem[];
  mockExamHistory?: MockExamAttempt[];
  /** Separate HSK 3.0 International Portal analytics */
  hskPatternStats?: Record<HskPatternId, HskPatternStatEntry>;
  hskMockResults?: HskMockExamResult[];
}

export interface SheetsSyncPayload {
  studentId: string;
  studentName: string;
  studentCode: string;
  totalSolved: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercent: number;
  activeMinutes: number;
  overallProgressPercent: number;
  lastActive: string;
  hskMockResults?: string | HskMockExamResult[];
  hskPatternStats?: string | Record<HskPatternId, HskPatternStatEntry>;
  unlockedAccess?: string | UnlockedAccess;
}
