/**
 * Google Apps Script (Code.gs) — بوابة اللغة الصينية HSK 3.0
 *
 * خطوات التحديث السريع في جدول المعلم:
 * 1. افتح جدول Google Sheets الخاص بالمعلم > الإضافات (Extensions) > Apps Script.
 * 2. الصق هذا الملف كاملاً داخل Code.gs واحفظ (Save).
 * 3. اضغط: نشر (Deploy) > إدارة عمليات النشر (Manage deployments) > تعديل (Edit) > إصدار جديد (New version) > نشر (Deploy).
 *
 * ملاحظة: يستخدم هذا السكربت PropertiesService.getScriptProperties() لحفظ إعلان المعلم
 * (getBroadcast / setBroadcast) دون الحاجة لأي تنسيق يدوي أو تعديل لصفوف الطلاب القائمة.
 */

var BROADCAST_PROPERTY_KEY = 'TEACHER_BROADCAST_JSON';

function doPost(e) {
  try {
    var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(rawBody);

    // 1) حفظ وتحديث شريط إعلانات الطلاب (لا يلمس صفوف الطلاب إطلاقاً)
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
        BROADCAST_PROPERTY_KEY,
        JSON.stringify(broadcastObj)
      );

      return ContentService.createTextOutput(
        JSON.stringify({ ok: true, broadcast: broadcastObj })
      ).setMimeType(ContentService.MimeType.JSON);
    }

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

    // 2) تسجيل طالب جديد من لوحة المعلم
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

      sheet.appendRow([
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
      ]);

      return ContentService.createTextOutput(JSON.stringify({ ok: true, registered: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3) تحديث صلاحيات الوصول (العمود 14 فقط)
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

    // 4) ربط جهاز الطالب (العمود 15 فقط)
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

    // 5) فك ارتباط جهاز الطالب (تصفير العمود 15 فقط)
    if (data.action === 'unbindDevice') {
      var unbindRowIndex = findStudentRowNumber(data.studentId, data.studentCode);
      if (unbindRowIndex > 0) {
        sheet.getRange(unbindRowIndex, 15).setValue('');
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, unbound: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 6) تحديث إحصائيات تقدم الطالب (الأعمدة 1..13 فقط)
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
      var rawBroadcast = PropertiesService.getScriptProperties().getProperty(BROADCAST_PROPERTY_KEY);
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
        try { parsedBreakdown = JSON.parse(rawBreakdown); } catch (e0) { parsedBreakdown = []; }
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
