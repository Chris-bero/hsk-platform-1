export interface Student {
  id: string;
  name: string;
  code: string;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
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
  | 'sentence-translation'
  | 'sentence-builder'
  | 'fill-in-blank';

export type SessionDrillKey = DrillType | 'mixed';

export type QuizMode = 'practice' | 'exam';

export type AppView = 'home' | 'chapters' | 'chapter-hub' | 'drill' | 'analytics';

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
  drillType: DrillType;
  promptPrimary: string;
  promptPinyin?: string;
  promptSecondary?: string;
  /** Used in Sentence Translation to indicate direction */
  direction?: 'hanzi-to-arabic' | 'arabic-to-hanzi';
  /** Used in Listening drill for speechSynthesis */
  audioText?: string;
  /** Multiple-choice options (Drills 1, 2, 3, 6, 7, 9) */
  options?: DrillOption[];
  correctOptionId?: string;
  /** Matching sets (Drills 4, 5) */
  matchingEntries?: MatchingEntry[];
  /** Sentence Builder (Drill 8) */
  correctSegments?: string[];
  shuffledSegments?: { tileId: string; text: string }[];
  /** Fill in the Blank (Drill 9) */
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

export interface StudentProgress {
  studentId: string;
  totalSolved: number;
  correctCount: number;
  wrongCount: number;
  activeSeconds: number;
  studyDates: string[];
  lastActive: string;
  drillStats: Record<DrillType, DrillStatEntry>;
  chapterStats: Record<number, ChapterStatEntry>;
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
}
