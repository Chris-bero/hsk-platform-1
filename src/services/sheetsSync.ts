/*
================================================================================
كود Google Apps Script الجاهز للنسخ واللصق (ملحق جداول بيانات Google للمعلم)
================================================================================
1. افتح جدول Google Sheets جديداً من حساب المعلم.
2. من القائمة العلوية اختر: الإضافات (Extensions) > Apps Script.
3. احذف أي كود موجود والصق الكود التالي كاملاً، ثم اضغط حفظ (Save).
4. اضغط: نشر (Deploy) > نشر جديد (New deployment) > تطبيق ويب (Web app).
   - تنفيذ بصفتي (Execute as): أنا (Me)
   - من لديه صلاحية الوصول (Who has access): أي شخص (Anyone)
5. انسخ رابط تطبيق الويب (Web App URL) وضعه في المتغير GOOGLE_SCRIPT_WEB_APP_URL أدناه،
   وألصقه كذلك داخل لوحة المعلم (teacher-dashboard.html).

--------------------------------------------------------------------------------
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = [
      'studentId',
      'studentName',
      'studentCode',
      'totalSolved',
      'correctCount',
      'wrongCount',
      'accuracyPercent',
      'activeMinutes',
      'overallProgressPercent',
      'lastActive',
      'chaptersBreakdown'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else if (sheet.getLastColumn() < headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(rawBody);

    var breakdownStr =
      typeof data.chaptersBreakdown === 'string'
        ? data.chaptersBreakdown
        : JSON.stringify(data.chaptersBreakdown || []);

    var rowValues = [
      data.studentId || '',
      data.studentName || '',
      data.studentCode || '',
      Number(data.totalSolved || 0),
      Number(data.correctCount || 0),
      Number(data.wrongCount || 0),
      Number(data.accuracyPercent || 0),
      Number(data.activeMinutes || 0),
      Number(data.overallProgressPercent || 0),
      data.lastActive || new Date().toISOString(),
      breakdownStr
    ];

    // تحديث صف الطالب إن كان موجوداً بالفعل، أو إضافة صف جديد له
    var existingRows = sheet.getDataRange().getValues();
    var targetRowIndex = -1;
    for (var i = 1; i < existingRows.length; i++) {
      if (String(existingRows[i][0]) === String(data.studentId)) {
        targetRowIndex = i + 1;
        break;
      }
    }

    if (targetRowIndex > 0) {
      sheet.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, students: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = values[0];
    var students = [];

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[0] && !row[1]) continue;

      var item = {};
      for (var c = 0; c < headers.length; c++) {
        item[String(headers[c])] = row[c];
      }

      var rawBreakdown = item.chaptersBreakdown !== undefined ? item.chaptersBreakdown : row[10];
      var parsedBreakdown = [];
      if (typeof rawBreakdown === 'string' && rawBreakdown.trim()) {
        try {
          parsedBreakdown = JSON.parse(rawBreakdown);
        } catch (parseErr) {
          parsedBreakdown = [];
        }
      } else if (Array.isArray(rawBreakdown)) {
        parsedBreakdown = rawBreakdown;
      }

      students.push({
        studentId: String(item.studentId || row[0] || ''),
        studentName: String(item.studentName || row[1] || ''),
        studentCode: String(item.studentCode || row[2] || ''),
        totalSolved: Number(item.totalSolved || row[3] || 0),
        correctCount: Number(item.correctCount || row[4] || 0),
        wrongCount: Number(item.wrongCount || row[5] || 0),
        accuracyPercent: Number(item.accuracyPercent || row[6] || 0),
        activeMinutes: Number(item.activeMinutes || row[7] || 0),
        overallProgressPercent: Number(item.overallProgressPercent || row[8] || 0),
        lastActive: item.lastActive ? String(item.lastActive) : '',
        chaptersBreakdown: parsedBreakdown
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, students: students }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err), students: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
================================================================================
*/

import { SheetsSyncPayload } from '../types';

export const GOOGLE_SCRIPT_WEB_APP_URL = '';

const LOCAL_SYNC_BACKUP_KEY = 'chinese_portal_sheets_sync_backup_v1';
const STUDENT_PROGRESS_PREFIX = 'chinese_portal_progress_v1_';
const TOTAL_CHAPTERS = 15;

export interface ChapterBreakdownEntry {
  chapterId: number;
  solved: number;
  correct: number;
  wrong: number;
}

export interface EnrichedSheetsSyncPayload extends SheetsSyncPayload {
  chaptersBreakdown: string;
}

export interface SyncResult {
  syncedRemotely: boolean;
  savedLocally: boolean;
  timestamp: string;
}

function buildChaptersBreakdownFromStorage(studentId: string): ChapterBreakdownEntry[] {
  const breakdown: ChapterBreakdownEntry[] = [];
  let chapterStats: Record<string, { solved?: number; correct?: number }> = {};

  try {
    const raw = localStorage.getItem(`${STUDENT_PROGRESS_PREFIX}${studentId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        chapterStats?: Record<string, { solved?: number; correct?: number }>;
      };
      if (parsed && parsed.chapterStats) {
        chapterStats = parsed.chapterStats;
      }
    }
  } catch {
    // استخدام مصفوفة صفرية افتراضية عند تعذر القراءة
  }

  for (let chapterId = 1; chapterId <= TOTAL_CHAPTERS; chapterId++) {
    const stat = chapterStats[String(chapterId)];
    const solved = Math.max(0, Number(stat?.solved ?? 0));
    const correct = Math.max(0, Math.min(solved, Number(stat?.correct ?? 0)));
    const wrong = Math.max(0, solved - correct);
    breakdown.push({ chapterId, solved, correct, wrong });
  }

  return breakdown;
}

function resolveChaptersBreakdownJson(
  payload: SheetsSyncPayload & { chaptersBreakdown?: string | ChapterBreakdownEntry[] }
): string {
  if (typeof payload.chaptersBreakdown === 'string' && payload.chaptersBreakdown.trim()) {
    return payload.chaptersBreakdown;
  }
  if (Array.isArray(payload.chaptersBreakdown)) {
    return JSON.stringify(payload.chaptersBreakdown);
  }
  return JSON.stringify(buildChaptersBreakdownFromStorage(payload.studentId));
}

function saveLocalBackup(payload: EnrichedSheetsSyncPayload): void {
  try {
    const existingRaw = localStorage.getItem(LOCAL_SYNC_BACKUP_KEY);
    const records: Record<string, EnrichedSheetsSyncPayload> = existingRaw
      ? (JSON.parse(existingRaw) as Record<string, EnrichedSheetsSyncPayload>)
      : {};
    records[payload.studentId] = payload;
    localStorage.setItem(LOCAL_SYNC_BACKUP_KEY, JSON.stringify(records));
  } catch {
    // تجاهل أخطاء التخزين المحلي إن كانت مساحة المتصفح ممتلئة
  }
}

export function getLastLocalSync(studentId: string): EnrichedSheetsSyncPayload | null {
  try {
    const existingRaw = localStorage.getItem(LOCAL_SYNC_BACKUP_KEY);
    if (!existingRaw) return null;
    const records = JSON.parse(existingRaw) as Record<string, EnrichedSheetsSyncPayload>;
    return records[studentId] ?? null;
  } catch {
    return null;
  }
}

export async function syncStudentStatsToSheets(
  payload: SheetsSyncPayload & { chaptersBreakdown?: string | ChapterBreakdownEntry[] }
): Promise<SyncResult> {
  const timestamp = new Date().toISOString();
  const enrichedPayload: EnrichedSheetsSyncPayload = {
    ...payload,
    chaptersBreakdown: resolveChaptersBreakdownJson(payload),
  };

  saveLocalBackup(enrichedPayload);

  const endpoint = GOOGLE_SCRIPT_WEB_APP_URL.trim();
  if (!endpoint) {
    return {
      syncedRemotely: false,
      savedLocally: true,
      timestamp,
    };
  }

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(enrichedPayload),
    });

    return {
      syncedRemotely: true,
      savedLocally: true,
      timestamp,
    };
  } catch {
    return {
      syncedRemotely: false,
      savedLocally: true,
      timestamp,
    };
  }
}
