import { UnlockedAccess } from '../types';

export const TOTAL_COURSE_CHAPTERS = 15;

export const DEFAULT_FREE_TRIAL_ACCESS: UnlockedAccess = {
  chapters: [1],
  mocks: false,
  patterns: true,
};

export function createDefaultFreeTrialAccess(): UnlockedAccess {
  return {
    chapters: [1],
    mocks: false,
    patterns: true,
  };
}

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

  const record = obj as { chapters?: unknown; mocks?: unknown; patterns?: unknown };
  let chapters: 'ALL' | number[] = [1];

  if (typeof record.chapters === 'string' && record.chapters.trim().toUpperCase() === 'ALL') {
    chapters = 'ALL';
  } else if (Array.isArray(record.chapters)) {
    const validNums = Array.from(
      new Set(
        record.chapters
          .map((n) => Number(n))
          .filter((n) => Number.isInteger(n) && n >= 1 && n <= TOTAL_COURSE_CHAPTERS)
      )
    ).sort((a, b) => a - b);
    chapters = validNums;
  }

  const mocks = Boolean(record.mocks);
  const patterns = record.patterns === undefined ? true : Boolean(record.patterns);
  return { chapters, mocks, patterns };
}

export function isChapterUnlocked(
  access: UnlockedAccess | undefined | null,
  chapterId: number
): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  if (resolved.chapters === 'ALL') return true;
  return resolved.chapters.includes(chapterId);
}

export function isMocksUnlocked(access: UnlockedAccess | undefined | null): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return Boolean(resolved.mocks);
}

export function isPatternsUnlocked(access: UnlockedAccess | undefined | null): boolean {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  return resolved.patterns !== false;
}

export function countUnlockedChapters(access: UnlockedAccess | undefined | null): number {
  const resolved = access ? parseUnlockedAccess(access) : DEFAULT_FREE_TRIAL_ACCESS;
  if (resolved.chapters === 'ALL') return TOTAL_COURSE_CHAPTERS;
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
