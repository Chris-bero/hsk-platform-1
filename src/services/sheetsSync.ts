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
      'chaptersBreakdown',
      'hskMockResults',
      'hskPatternStats',
      'unlockedAccess',
      'boundDeviceId'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else if (sheet.getLastColumn() < headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(rawBody);
    var existingRows = sheet.getDataRange().getValues();
    var defaultAccessStr = '{"chapters":[1],"intlMocks":[],"arabicMocks":[],"patterns":[1]}';

    function findStudentRowNumber(idVal, codeVal) {
      var targetId = String(idVal || '').trim();
      var targetCode = String(codeVal || '').trim().toLowerCase();
      for (var idx = 1; idx < existingRows.length; idx++) {
        var rId = String(existingRows[idx][0] || '').trim();
        var rCode = String(existingRows[idx][2] || '').trim().toLowerCase();
        if ((targetId && rId === targetId) || (targetCode && rCode === targetCode)) {
          return idx + 1;
        }
      }
      return -1;
    }

    // حفظ إعلان المعلم العام في PropertiesService دون المساس بصفوف الطلاب
    if (data.action === 'setBroadcast') {
      var allowedStyles = ['info', 'important', 'promo'];
      var styleVal = String(data.style || 'info');
      if (allowedStyles.indexOf(styleVal) === -1) styleVal = 'info';
      var broadcastObj = {
        id: String(data.id || ('bc_' + new Date().getTime())),
        enabled: Boolean(data.enabled),
        message: String(data.message || '').trim(),
        style: styleVal,
        ctaLabel: String(data.ctaLabel || '').trim(),
        ctaUrl: String(data.ctaUrl || '').trim(),
        updatedAt: String(data.updatedAt || new Date().toISOString())
      };
      PropertiesService.getScriptProperties().setProperty(
        'TEACHER_BROADCAST_JSON',
        JSON.stringify(broadcastObj)
      );
      return ContentService.createTextOutput(JSON.stringify({ ok: true, broadcast: broadcastObj }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // تسجيل طالب جديد من لوحة المعلم (بإحصائيات صفرية وصلاحية تجريبية افتراضية دون ربط جهاز)
    if (data.action === 'registerStudent') {
      var newCode = String(data.studentCode || '').trim();
      if (findStudentRowNumber(data.studentId, newCode) > 0) {
        return ContentService.createTextOutput(JSON.stringify({ ok: true, alreadyExists: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var initialAccessStr =
        typeof data.unlockedAccess === 'string' && data.unlockedAccess.trim()
          ? data.unlockedAccess
          : data.unlockedAccess && typeof data.unlockedAccess === 'object'
            ? JSON.stringify(data.unlockedAccess)
            : defaultAccessStr;

      var newRow = [
        String(data.studentId || newCode || ''),
        String(data.studentName || '').trim(),
        newCode,
        0,
        0,
        0,
        0,
        0,
        0,
        new Date().toISOString(),
        '[]',
        '[]',
        '{}',
        initialAccessStr,
        ''
      ];
      sheet.appendRow(newRow);

      return ContentService.createTextOutput(JSON.stringify({ ok: true, registered: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // تحديث صلاحيات الوصول (الفصول + الامتحانات الشاملة) في العمود 14 فقط
    if (data.action === 'updateAccess') {
      var accessStr =
        typeof data.unlockedAccess === 'string' && data.unlockedAccess.trim()
          ? data.unlockedAccess
          : data.unlockedAccess && typeof data.unlockedAccess === 'object'
            ? JSON.stringify(data.unlockedAccess)
            : defaultAccessStr;

      var accessRowIndex = findStudentRowNumber(data.studentId, data.studentCode);
      if (accessRowIndex > 0) {
        sheet.getRange(accessRowIndex, 14).setValue(accessStr);
      } else {
        sheet.appendRow([
          String(data.studentId || data.studentCode || ''),
          String(data.studentName || '').trim(),
          String(data.studentCode || '').trim(),
          0,
          0,
          0,
          0,
          0,
          0,
          new Date().toISOString(),
          '[]',
          '[]',
          '{}',
          accessStr,
          ''
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({ ok: true, updatedAccess: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ربط جهاز الطالب (العمود 15 فقط) عند أول تسجيل دخول إذا كان فارغاً
    if (data.action === 'bindDevice') {
      var deviceToBind = String(data.boundDeviceId || data.deviceId || '').trim();
      var bindRowIndex = findStudentRowNumber(data.studentId, data.studentCode);
      if (bindRowIndex > 0 && deviceToBind) {
        var currentDevice = String(existingRows[bindRowIndex - 1][14] || '').trim();
        if (!currentDevice || currentDevice === deviceToBind) {
          sheet.getRange(bindRowIndex, 15).setValue(deviceToBind);
          return ContentService.createTextOutput(JSON.stringify({ ok: true, bound: true }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        return ContentService.createTextOutput(JSON.stringify({ ok: false, alreadyBound: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: false, notFound: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // فك ارتباط جهاز الطالب (تصفير العمود 15 فقط) من لوحة المعلم عند تغيير الهاتف/الجهاز
    if (data.action === 'unbindDevice') {
      var unbindRowIndex = findStudentRowNumber(data.studentId, data.studentCode);
      if (unbindRowIndex > 0) {
        sheet.getRange(unbindRowIndex, 15).setValue('');
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, unbound: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // تحديث أو إضافة صف تقدم الطالب عند إتمام أي تدريب أو امتحان (الأعمدة 1..13 فقط)
    var breakdownStr =
      typeof data.chaptersBreakdown === 'string'
        ? data.chaptersBreakdown
        : JSON.stringify(data.chaptersBreakdown || []);
    var hskMockStr =
      typeof data.hskMockResults === 'string'
        ? data.hskMockResults
        : JSON.stringify(data.hskMockResults || []);
    var hskPatternStr =
      typeof data.hskPatternStats === 'string'
        ? data.hskPatternStats
        : JSON.stringify(data.hskPatternStats || {});

    var rowValues = [
      String(data.studentId || ''),
      String(data.studentName || ''),
      String(data.studentCode || ''),
      Number(data.totalSolved || 0),
      Number(data.correctCount || 0),
      Number(data.wrongCount || 0),
      Number(data.accuracyPercent || 0),
      Number(data.activeMinutes || 0),
      Number(data.overallProgressPercent || 0),
      data.lastActive || new Date().toISOString(),
      breakdownStr,
      hskMockStr,
      hskPatternStr
    ];

    var targetRowIndex = findStudentRowNumber(data.studentId, data.studentCode);

    if (targetRowIndex > 0) {
      // تحديث الأعمدة 1..13 فقط للحفاظ على صلاحيات المعلم (14) والجهاز المرتبط (15)
      sheet.getRange(targetRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
      var existingAccessCell = existingRows[targetRowIndex - 1][13];
      if (!existingAccessCell || String(existingAccessCell).trim() === '') {
        sheet.getRange(targetRowIndex, 14).setValue(defaultAccessStr);
      }
    } else {
      rowValues.push(defaultAccessStr);
      rowValues.push('');
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
    // جلب شريط إعلان المعلم النشط للطلاب عبر ?action=getBroadcast
    if (e && e.parameter && e.parameter.action === 'getBroadcast') {
      var rawBroadcast = PropertiesService.getScriptProperties().getProperty('TEACHER_BROADCAST_JSON');
      var parsedBroadcast = null;
      if (rawBroadcast) {
        try {
          parsedBroadcast = JSON.parse(rawBroadcast);
        } catch (errB) {
          parsedBroadcast = null;
        }
      }
      return ContentService.createTextOutput(
        JSON.stringify({ ok: true, broadcast: parsedBroadcast })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = values[0];
    var students = [];

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[0] && !row[1] && !row[2]) continue;

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

      var rawHskMock = item.hskMockResults !== undefined ? item.hskMockResults : row[11];
      var parsedHskMock = [];
      if (typeof rawHskMock === 'string' && rawHskMock.trim()) {
        try { parsedHskMock = JSON.parse(rawHskMock); } catch (e1) { parsedHskMock = []; }
      } else if (Array.isArray(rawHskMock)) {
        parsedHskMock = rawHskMock;
      }

      var rawHskPattern = item.hskPatternStats !== undefined ? item.hskPatternStats : row[12];
      var parsedHskPattern = {};
      if (typeof rawHskPattern === 'string' && rawHskPattern.trim()) {
        try { parsedHskPattern = JSON.parse(rawHskPattern); } catch (e2) { parsedHskPattern = {}; }
      } else if (rawHskPattern && typeof rawHskPattern === 'object') {
        parsedHskPattern = rawHskPattern;
      }

      var rawAccess = item.unlockedAccess !== undefined ? item.unlockedAccess : row[13];
      var parsedAccess = { chapters: [1], intlMocks: [], arabicMocks: [], patterns: [1] };
      if (typeof rawAccess === 'string' && rawAccess.trim()) {
        try { parsedAccess = JSON.parse(rawAccess); } catch (e3) { parsedAccess = { chapters: [1], intlMocks: [], arabicMocks: [], patterns: [1] }; }
      } else if (rawAccess && typeof rawAccess === 'object') {
        parsedAccess = rawAccess;
      }

      var rawBoundDevice = item.boundDeviceId !== undefined ? item.boundDeviceId : row[14];
      var parsedBoundDevice = rawBoundDevice ? String(rawBoundDevice).trim() : '';

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
        chaptersBreakdown: parsedBreakdown,
        hskMockResults: parsedHskMock,
        hskPatternStats: parsedHskPattern,
        unlockedAccess: parsedAccess,
        boundDeviceId: parsedBoundDevice
      });
    }

    return ContentService.createTextOutput(JSON.stringify(students))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
================================================================================
*/

import { ALLOWED_STUDENTS, authenticateStudent } from '../data/students';
import {
  BroadcastStyle,
  SheetsSyncPayload,
  Student,
  TeacherBroadcast,
  UnlockedAccess,
} from '../types';
import { getOrCreateClientDeviceId, parseUnlockedAccess } from '../utils/accessControl';

export const GOOGLE_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxA27jKarngLH1l9aIK8vVxd_vNj1UZG6dXTMqluOcaBe6VoFd0VzE7snVvPXqQFdR_fQ/exec ';

const LOCAL_SYNC_BACKUP_KEY = 'chinese_portal_sheets_sync_backup_v1';
const STUDENT_PROGRESS_PREFIX = 'chinese_portal_progress_v1_';
export const TEACHER_URL_STORAGE_KEY = 'teacher_dashboard_sheets_url_v1';
const LOCAL_REGISTERED_STUDENTS_KEY = 'chinese_portal_registered_students_v1';
const TOTAL_CHAPTERS = 15;

// مزامنة الرابط المعرّف في الكود مع التخزين المحلي تلقائياً ليبقى متطابقاً مع لوحة المعلم
if (typeof window !== 'undefined' && GOOGLE_SCRIPT_WEB_APP_URL.trim()) {
  try {
    localStorage.setItem(TEACHER_URL_STORAGE_KEY, GOOGLE_SCRIPT_WEB_APP_URL.trim());
  } catch {
    // تجاهل أخطاء التخزين المحلي
  }
}

export interface ChapterBreakdownEntry {
  chapterId: number;
  solved: number;
  correct: number;
  wrong: number;
}

export interface EnrichedSheetsSyncPayload extends SheetsSyncPayload {
  chaptersBreakdown: string;
  hskMockResults: string;
  hskPatternStats: string;
}

export interface SyncResult {
  syncedRemotely: boolean;
  savedLocally: boolean;
  timestamp: string;
}

function normalizeCredential(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeCodeCompact(value: string): string {
  return value.trim().replace(/\s+/g, '').toLowerCase();
}

export function getConfiguredSheetsUrl(): string {
  const configured = GOOGLE_SCRIPT_WEB_APP_URL.trim();
  if (configured) return configured;

  try {
    const saved = localStorage.getItem(TEACHER_URL_STORAGE_KEY);
    return saved ? saved.trim() : '';
  } catch {
    return '';
  }
}

function registerDynamicStudentInMemory(student: Student): void {
  const normId = normalizeCredential(student.id);
  const normName = normalizeCredential(student.name);
  const normCode = normalizeCodeCompact(student.code);

  const existingIdx = ALLOWED_STUDENTS.findIndex(
    (s) =>
      normalizeCredential(s.id) === normId ||
      (normalizeCredential(s.name) === normName && normalizeCodeCompact(s.code) === normCode)
  );
  if (existingIdx === -1) {
    ALLOWED_STUDENTS.push(student);
  } else {
    ALLOWED_STUDENTS[existingIdx] = {
      ...ALLOWED_STUDENTS[existingIdx],
      ...student,
    };
  }
}

export const DEVICE_LOCKED_WARNING_AR =
  'عذراً، هذا الكود مرتبط بجهاز آخر بالفعل ولا يمكن استخدامه على أكثر من جهاز. تواصل مع المعلم (Laohu) في حال تغيير جهازك.';

export type StudentVerificationResult =
  | { status: 'ok'; student: Student }
  | { status: 'device_locked'; message: string }
  | { status: 'not_found' };

export interface StudentSheetSessionState {
  unlockedAccess: UnlockedAccess;
  boundDeviceId: string;
}

function updateLocalStudentBoundDevice(studentId: string, studentCode: string, deviceId: string): void {
  const normId = normalizeCredential(studentId);
  const compactCode = normalizeCodeCompact(studentCode);
  try {
    const raw = localStorage.getItem(LOCAL_REGISTERED_STUDENTS_KEY);
    if (!raw) return;
    const list = JSON.parse(raw) as Array<Record<string, unknown>>;
    if (!Array.isArray(list)) return;
    let changed = false;
    for (const item of list) {
      const itemId = normalizeCredential(String(item.studentId ?? item.id ?? ''));
      const itemCode = normalizeCodeCompact(String(item.studentCode ?? item.code ?? ''));
      if ((normId && itemId === normId) || (compactCode && itemCode === compactCode)) {
        item.boundDeviceId = deviceId;
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(LOCAL_REGISTERED_STUDENTS_KEY, JSON.stringify(list));
    }
  } catch {
    // تجاهل
  }
}

export async function bindStudentDeviceInSheet(
  student: Pick<Student, 'id' | 'name' | 'code'>,
  deviceId: string
): Promise<void> {
  updateLocalStudentBoundDevice(student.id, student.code, deviceId);
  const endpoint = getConfiguredSheetsUrl();
  if (!endpoint || !deviceId.trim()) return;

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'bindDevice',
        studentId: student.id,
        studentName: student.name,
        studentCode: student.code,
        boundDeviceId: deviceId,
      }),
    });
  } catch {
    // تجاهل أخطاء الشبكة العابرة؛ تم الحفظ محلياً
  }
}

function findLocallyRegisteredStudent(name: string, code: string): Student | null {
  const cleanedName = normalizeCredential(name);
  const cleanedCode = normalizeCredential(code);
  const compactCode = normalizeCodeCompact(code);
  if (!cleanedName || !cleanedCode) return null;

  try {
    const raw = localStorage.getItem(LOCAL_REGISTERED_STUDENTS_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as Array<{
      studentId?: string;
      id?: string;
      studentName?: string;
      name?: string;
      studentCode?: string;
      code?: string;
      unlockedAccess?: unknown;
      boundDeviceId?: unknown;
    }>;

    if (!Array.isArray(list)) return null;

    for (const item of list) {
      const sName = String(item.studentName ?? item.name ?? '').trim().replace(/\s+/g, ' ');
      const sCode = String(item.studentCode ?? item.code ?? '').trim().replace(/\s+/g, ' ');
      const sId = String(item.studentId ?? item.id ?? sCode).trim();

      const nameMatches =
        normalizeCredential(sName) === cleanedName || normalizeCredential(sId) === cleanedName;
      const codeMatches =
        normalizeCredential(sCode) === cleanedCode || normalizeCodeCompact(sCode) === compactCode;

      if (nameMatches && codeMatches) {
        const matched: Student = {
          id: sId,
          name: sName,
          code: sCode,
          unlockedAccess: parseUnlockedAccess(item.unlockedAccess),
          boundDeviceId: String(item.boundDeviceId ?? '').trim(),
        };
        registerDynamicStudentInMemory(matched);
        return matched;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function findLocalSessionOverride(
  studentId: string,
  studentCode: string
): StudentSheetSessionState | null {
  const normId = normalizeCredential(studentId);
  const compactCode = normalizeCodeCompact(studentCode);
  try {
    const raw = localStorage.getItem(LOCAL_REGISTERED_STUDENTS_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as Array<{
      studentId?: string;
      id?: string;
      studentCode?: string;
      code?: string;
      unlockedAccess?: unknown;
      boundDeviceId?: unknown;
    }>;
    if (!Array.isArray(list)) return null;

    for (const item of list) {
      const itemId = normalizeCredential(String(item.studentId ?? item.id ?? ''));
      const itemCode = normalizeCodeCompact(String(item.studentCode ?? item.code ?? ''));
      if ((normId && itemId === normId) || (compactCode && itemCode === compactCode)) {
        return {
          unlockedAccess: parseUnlockedAccess(item.unlockedAccess),
          boundDeviceId: String(item.boundDeviceId ?? '').trim(),
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * التحقق الديناميكي من بيانات الطالب عبر Google Sheets (GET) مع نظام ربط الجهاز الواحد (Single-Device Lock):
 * - إن كان عمود boundDeviceId فارغاً، يُربط هذا الجهاز تلقائياً ويُحفظ في Google Sheets (action: 'bindDevice').
 * - إن كان مرتبطاً بنفس الجهاز الحالي، يُسمح بالدخول.
 * - إن كان مرتبطاً بجهاز آخر مختلف، يُحظر الدخول مع رسالة تنبيه عربية واضحة.
 */
export async function verifyStudentFromSheet(
  name: string,
  code: string
): Promise<StudentVerificationResult> {
  const normalizedInputName = normalizeCredential(name);
  const normalizedInputCode = normalizeCredential(code);
  const compactInputCode = normalizeCodeCompact(code);
  if (!normalizedInputName || !normalizedInputCode) {
    return { status: 'not_found' };
  }

  const clientDeviceId = getOrCreateClientDeviceId();
  const endpoint = getConfiguredSheetsUrl();

  if (endpoint) {
    try {
      const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
      if (response.ok) {
        const data: unknown = await response.json();
        const rows = Array.isArray(data)
          ? data
          : data &&
              typeof data === 'object' &&
              'students' in data &&
              Array.isArray((data as { students?: unknown }).students)
            ? (data as { students: unknown[] }).students
            : data &&
                typeof data === 'object' &&
                'rows' in data &&
                Array.isArray((data as { rows?: unknown }).rows)
              ? (data as { rows: unknown[] }).rows
              : [];

        for (const rawRow of rows) {
          if (!rawRow || typeof rawRow !== 'object') continue;
          const row = rawRow as Record<string, unknown>;
          const rowName = String(row.studentName ?? row.name ?? '')
            .trim()
            .replace(/\s+/g, ' ');
          const rowCode = String(row.studentCode ?? row.code ?? '')
            .trim()
            .replace(/\s+/g, ' ');
          const rowId = String(row.studentId ?? row.id ?? rowCode).trim();

          const nameMatches =
            normalizeCredential(rowName) === normalizedInputName ||
            normalizeCredential(rowId) === normalizedInputName;
          const codeMatches =
            normalizeCredential(rowCode) === normalizedInputCode ||
            normalizeCodeCompact(rowCode) === compactInputCode;

          if (nameMatches && codeMatches) {
            const existingBoundDevice = String(row.boundDeviceId ?? '').trim();

            if (existingBoundDevice && existingBoundDevice !== clientDeviceId) {
              return {
                status: 'device_locked',
                message: DEVICE_LOCKED_WARNING_AR,
              };
            }

            const matched: Student = {
              id: rowId || rowCode,
              name: rowName || name.trim().replace(/\s+/g, ' '),
              code: rowCode,
              unlockedAccess: parseUnlockedAccess(row.unlockedAccess),
              boundDeviceId: existingBoundDevice || clientDeviceId,
            };

            if (!existingBoundDevice) {
              void bindStudentDeviceInSheet(matched, clientDeviceId);
            }

            registerDynamicStudentInMemory(matched);
            return { status: 'ok', student: matched };
          }
        }
      }
    } catch {
      // في حال انقطاع الاتصال أو خطأ الشبكة، ننتقل إلى التحقق الاحتياطي المحلي أدناه
    }
  }

  const localDynamic = findLocallyRegisteredStudent(name, code);
  if (localDynamic) {
    const existingLocalDevice = String(localDynamic.boundDeviceId ?? '').trim();
    if (existingLocalDevice && existingLocalDevice !== clientDeviceId) {
      return {
        status: 'device_locked',
        message: DEVICE_LOCKED_WARNING_AR,
      };
    }
    const boundStudent: Student = {
      ...localDynamic,
      boundDeviceId: existingLocalDevice || clientDeviceId,
    };
    if (!existingLocalDevice) {
      void bindStudentDeviceInSheet(boundStudent, clientDeviceId);
    }
    return { status: 'ok', student: boundStudent };
  }

  const fallback = authenticateStudent(name, code);
  if (fallback) {
    return {
      status: 'ok',
      student: {
        ...fallback,
        unlockedAccess: parseUnlockedAccess(fallback.unlockedAccess),
        boundDeviceId: clientDeviceId,
      },
    };
  }

  return { status: 'not_found' };
}

/**
 * جلب أحدث صلاحيات الوصول (unlockedAccess) وحالة الجهاز المرتبط (boundDeviceId) من Google Sheets.
 */
export async function fetchStudentSessionFromSheet(
  student: Pick<Student, 'id' | 'code'>
): Promise<StudentSheetSessionState | null> {
  const normId = normalizeCredential(student.id);
  const compactCode = normalizeCodeCompact(student.code);
  const endpoint = getConfiguredSheetsUrl();

  if (endpoint) {
    try {
      const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
      if (response.ok) {
        const data: unknown = await response.json();
        const rows = Array.isArray(data)
          ? data
          : data &&
              typeof data === 'object' &&
              'students' in data &&
              Array.isArray((data as { students?: unknown }).students)
            ? (data as { students: unknown[] }).students
            : data &&
                typeof data === 'object' &&
                'rows' in data &&
                Array.isArray((data as { rows?: unknown }).rows)
              ? (data as { rows: unknown[] }).rows
              : [];

        for (const rawRow of rows) {
          if (!rawRow || typeof rawRow !== 'object') continue;
          const row = rawRow as Record<string, unknown>;
          const rowCode = String(row.studentCode ?? row.code ?? '').trim();
          const rowId = String(row.studentId ?? row.id ?? rowCode).trim();

          if (
            (normId && normalizeCredential(rowId) === normId) ||
            (compactCode && normalizeCodeCompact(rowCode) === compactCode)
          ) {
            return {
              unlockedAccess: parseUnlockedAccess(row.unlockedAccess),
              boundDeviceId: String(row.boundDeviceId ?? '').trim(),
            };
          }
        }
      }
    } catch {
      // الرجوع إلى النسخة المحلية في حال تعذر الاتصال
    }
  }

  return findLocalSessionOverride(student.id, student.code);
}

export async function fetchStudentAccessFromSheet(
  student: Pick<Student, 'id' | 'code'>
): Promise<UnlockedAccess | null> {
  const session = await fetchStudentSessionFromSheet(student);
  return session ? session.unlockedAccess : null;
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

function resolveHskDataFromStorage(studentId: string): {
  hskMockResults: string;
  hskPatternStats: string;
} {
  try {
    const raw = localStorage.getItem(`${STUDENT_PROGRESS_PREFIX}${studentId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        hskMockResults?: unknown;
        hskPatternStats?: unknown;
      };
      return {
        hskMockResults: JSON.stringify(Array.isArray(parsed.hskMockResults) ? parsed.hskMockResults : []),
        hskPatternStats: JSON.stringify(
          parsed.hskPatternStats && typeof parsed.hskPatternStats === 'object'
            ? parsed.hskPatternStats
            : {}
        ),
      };
    }
  } catch {
    // تجاهل
  }
  return { hskMockResults: '[]', hskPatternStats: '{}' };
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
  const storedHsk = resolveHskDataFromStorage(payload.studentId);
  const hskMockResultsStr =
    typeof payload.hskMockResults === 'string'
      ? payload.hskMockResults
      : Array.isArray(payload.hskMockResults)
        ? JSON.stringify(payload.hskMockResults)
        : storedHsk.hskMockResults;
  const hskPatternStatsStr =
    typeof payload.hskPatternStats === 'string'
      ? payload.hskPatternStats
      : payload.hskPatternStats && typeof payload.hskPatternStats === 'object'
        ? JSON.stringify(payload.hskPatternStats)
        : storedHsk.hskPatternStats;

  const enrichedPayload: EnrichedSheetsSyncPayload = {
    ...payload,
    chaptersBreakdown: resolveChaptersBreakdownJson(payload),
    hskMockResults: hskMockResultsStr,
    hskPatternStats: hskPatternStatsStr,
  };

  saveLocalBackup(enrichedPayload);

  const endpoint = getConfiguredSheetsUrl();
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

export const TEACHER_BROADCAST_LOCAL_KEY = 'chinese_portal_teacher_broadcast_v1';

export function sanitizeBroadcastUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function normalizeTeacherBroadcast(raw: unknown): TeacherBroadcast | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const styleCandidate = String(obj.style ?? 'info');
  const style: BroadcastStyle =
    styleCandidate === 'important' || styleCandidate === 'promo' ? styleCandidate : 'info';
  const message = String(obj.message ?? '').trim();
  const enabled = Boolean(obj.enabled);
  const updatedAt =
    typeof obj.updatedAt === 'string' && obj.updatedAt.trim()
      ? obj.updatedAt.trim()
      : new Date().toISOString();
  const id =
    typeof obj.id === 'string' && obj.id.trim()
      ? obj.id.trim()
      : `bc_${message.slice(0, 24)}_${updatedAt}`;
  const ctaLabel = typeof obj.ctaLabel === 'string' ? obj.ctaLabel.trim() : '';
  const ctaUrl = sanitizeBroadcastUrl(typeof obj.ctaUrl === 'string' ? obj.ctaUrl : undefined);

  return {
    id,
    enabled,
    message,
    style,
    ctaLabel: ctaLabel || undefined,
    ctaUrl,
    updatedAt,
  };
}

export function loadLocalTeacherBroadcast(): TeacherBroadcast | null {
  try {
    const raw = localStorage.getItem(TEACHER_BROADCAST_LOCAL_KEY);
    if (!raw) return null;
    return normalizeTeacherBroadcast(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * جلب إعلان المعلم النشط من Google Sheets عبر ?action=getBroadcast
 * مع تراجع صامت وآمن للتخزين المحلي عند عدم التوفر أو عدم تحديث السكربت بعد.
 */
export async function fetchTeacherBroadcast(): Promise<TeacherBroadcast | null> {
  const endpoint = getConfiguredSheetsUrl();

  if (endpoint) {
    try {
      const separator = endpoint.includes('?') ? '&' : '?';
      const response = await fetch(`${endpoint}${separator}action=getBroadcast`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (response.ok) {
        const data: unknown = await response.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const payload = data as Record<string, unknown>;
          if ('broadcast' in payload) {
            const normalized = normalizeTeacherBroadcast(payload.broadcast);
            try {
              if (normalized) {
                localStorage.setItem(TEACHER_BROADCAST_LOCAL_KEY, JSON.stringify(normalized));
              } else {
                localStorage.removeItem(TEACHER_BROADCAST_LOCAL_KEY);
              }
            } catch {
              // تجاهل
            }
            return normalized;
          }
          const direct = normalizeTeacherBroadcast(payload);
          if (direct) {
            try {
              localStorage.setItem(TEACHER_BROADCAST_LOCAL_KEY, JSON.stringify(direct));
            } catch {
              // تجاهل
            }
            return direct;
          }
        }
      }
    } catch {
      // تراجع صامت للتخزين المحلي في حال انقطاع الشبكة
    }
  }

  return loadLocalTeacherBroadcast();
}

