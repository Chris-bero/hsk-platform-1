import { UnlockedAccess } from '../types';

export const TOTAL_COURSE_CHAPTERS = 15;
export const TOTAL_INTL_MOCKS = 10;
export const TOTAL_ARABIC_MOCKS = 5;
export const TOTAL_HSK_PATTERNS = 7;

export const ALL_CHAPTER_IDS: number[] = Array.from(
  { length: TOTAL_COURSE_CHAPTERS },
  (_, idx) => idx + 1
);
export const ALL_INTL_MOCK_IDS: number[] = Array.from(
  { length: TOTAL_INTL_MOCKS },
  (_, idx) => idx + 1
);
export const ALL_ARABIC_MOCK_IDS: number[] = Array.from(
  { length: TOTAL_ARABIC_MOCKS },
  (_, idx) => idx + 1
);
export const ALL_HSK_PATTERN_NUMS: number[] = Array.from(
  { length: TOTAL_HSK_PATTERNS },
  (_, idx) => idx + 1
);

export const DEFAULT_FREE_TRIAL_ACCESS: UnlockedAccess = {
  chapters: [1],
  intlMocks: [],
  arabicMocks: [],
  patterns: [1],
};

export function createDefaultFreeTrialAccess(): UnlockedAccess {
  return {
    chapters: [1],
    intlMocks: [],
    arabicMocks: [],
    patterns: [1],
  };
}

export function createFullVipAccess(): UnlockedAccess {
  return {
    chapters: [...ALL_CHAPTER_IDS],
    intlMocks: [...ALL_INTL_MOCK_IDS],
    arabicMocks: [...ALL_ARABIC_MOCK_IDS],
    patterns: [...ALL_HSK_PATTERN_NUMS],
  };
}

function sanitizeRangeArray(raw: unknown, max: number): number[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(
      raw
        .map((n) => Number(n))
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= max)
    )
  ).sort((a, b) => a - b);
}

/**
 * تحليل صلاحيات الطالب الدقيقة (Granular Access Control) مع دعم كامل للتوافق العكسي
 * مع الصفوف القديمة التي كانت تحتوي على `chapters: "ALL"` أو `mocks: true` أو `patterns: true/false`.
 */
export function parseUnlockedAccess(raw: unknown): UnlockedAccess {
  if (!raw) {
    return createDefaultFreeTrialAccess();
  }

  let obj: unknown = raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return createDefaultFreeTrialAccess();
    try {
      obj = JSON.parse(trimmed);
    } catch {
      return createDefaultFreeTrialAccess();
    }
  }

  if (!obj || typeof obj !== 'object') {
    return createDefaultFreeTrialAccess();
  }

  const record = obj as {
    chapters?: unknown;
    intlMocks?: unknown;
    arabicMocks?: unknown;
    patterns?: unknown;
    mocks?: unknown;
  };

  // 1. الدروس (1..15)
  let chapters: number[] = [1];
  if (typeof record.chapters === 'string' && record.chapters.trim().toUpperCase() === 'ALL') {
    chapters = [...ALL_CHAPTER_IDS];
  } else if (Array.isArray(record.chapters)) {
    chapters = sanitizeRangeArray(record.chapters, TOTAL_COURSE_CHAPTERS);
  }

  // 2. الامتحانات الدولية المعتمدة (1..10)
  let intlMocks: number[] = [];
  if (typeof record.intlMocks === 'string' && record.intlMocks.trim().toUpperCase() === 'ALL') {
    intlMocks = [...ALL_INTL_MOCK_IDS];
  } else if (Array.isArray(record.intlMocks)) {
    intlMocks = sanitizeRangeArray(record.intlMocks, TOTAL_INTL_MOCKS);
  } else if (record.mocks === true) {
    intlMocks = [...ALL_INTL_MOCK_IDS];
  }

  // 3. الامتحانات التطبيقية بالعربية (1..5)
  let arabicMocks: number[] = [];
  if (typeof record.arabicMocks === 'string' && record.arabicMocks.trim().toUpperCase() === 'ALL') {
    arabicMocks = [...ALL_ARABIC_MOCK_IDS];
  } else if (Array.isArray(record.arabicMocks)) {
    arabicMocks = sanitizeRangeArray(record.arabicMocks, TOTAL_ARABIC_MOCKS);
  } else if (record.mocks === true) {
    arabicMocks = [...ALL_ARABIC_MOCK_IDS];
  }

  // 4. تدريبات الأنماط الدولية (1..7) — الافتراضي [1] للتجربة المجانية
  let patterns: number[] = [1];
  if (typeof record.patterns === 'string' && record.patterns.trim().toUpperCase() === 'ALL') {
    patterns = [...ALL_HSK_PATTERN_NUMS];
  } else if (Array.isArray(record.patterns)) {
    patterns = sanitizeRangeArray(record.patterns, TOTAL_HSK_PATTERNS);
  } else if (record.patterns === true) {
    patterns = [...ALL_HSK_PATTERN_NUMS];
  } else if (record.patterns === false) {
    patterns = [];
  }

  return { chapters, intlMocks, arabicMocks, patterns };
}

export function isChapterUnlocked(
  access: UnlockedAccess | undefined | null,
  chapterId: number
): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.chapters.includes(chapterId);
}

export function isIntlMockUnlocked(
  access: UnlockedAccess | undefined | null,
  modelNumber: number
): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.intlMocks.includes(modelNumber);
}

export function isArabicMockUnlocked(
  access: UnlockedAccess | undefined | null,
  modelNumber: number
): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.arabicMocks.includes(modelNumber);
}

export function isMockExamUnlocked(
  access: UnlockedAccess | undefined | null,
  track: 'international' | 'arabic',
  modelNumber: number
): boolean {
  return track === 'international'
    ? isIntlMockUnlocked(access, modelNumber)
    : isArabicMockUnlocked(access, modelNumber);
}

export function isPatternUnlocked(
  access: UnlockedAccess | undefined | null,
  patternNumber: number
): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.patterns.includes(patternNumber);
}

export function isMocksUnlocked(access: UnlockedAccess | undefined | null): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.intlMocks.length > 0 || resolved.arabicMocks.length > 0;
}

export function isPatternsUnlocked(access: UnlockedAccess | undefined | null): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.patterns.length > 0;
}

export function countUnlockedChapters(access: UnlockedAccess | undefined | null): number {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.chapters.length;
}

const CLIENT_DEVICE_ID_KEY = 'chinese_portal_client_device_id_v1';

export function getOrCreateClientDeviceId(): string {
  if (typeof window === 'undefined') return 'DEV-SSR';
  try {
    const existing = localStorage.getItem(CLIENT_DEVICE_ID_KEY);
    if (existing && existing.trim()) {
      return existing.trim();
    }
  } catch {
    // تجاهل أخطاء التخزين
  }

  let randomPart = '';
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
    }
  } catch {
    // تجاهل
  }

  if (!randomPart) {
    randomPart = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
      .slice(0, 16)
      .toUpperCase();
  }

  const newDeviceId = `DEV-${randomPart}`;
  try {
    localStorage.setItem(CLIENT_DEVICE_ID_KEY, newDeviceId);
  } catch {
    // تجاهل
  }
  return newDeviceId;
}
