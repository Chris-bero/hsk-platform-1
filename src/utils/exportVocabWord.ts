export type VocabSheetMode = 'hanzi-only' | 'full-review';

export interface NumberedVocabEntry {
  serial: number;
  chapterId: number;
  chapterTitleAr: string;
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
}

export interface ExportVocabWordOptions {
  entries: NumberedVocabEntry[];
  mode: VocabSheetMode;
  scopeLabelAr: string;
  fileScopeTag: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function chunkEntries<T>(items: T[], size: number): T[][] {
  const safeSize = Math.max(1, size);
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += safeSize) {
    rows.push(items.slice(i, i + safeSize));
  }
  return rows;
}

/**
 * إنشاء وتحميل ملف Microsoft Word (.doc) بمقاس A3 أفقي (420mm × 297mm)
 * لاحتواء جميع مفردات المستوى (329 مفردة) في ورقة واحدة شاملة:
 * - الوضع أ (رموز فقط): شبكة 10 أعمدة مزدوجة [رقم مظلل | رمز صيني 12pt] (~33 صفاً)
 * - الوضع ب (مراجعة شاملة): شبكة 6 أعمدة كثيفة [# | رمز | بينين | عربي] (~55 صفاً)
 */
export function downloadVocabularyWordDoc({
  entries,
  mode,
  scopeLabelAr,
  fileScopeTag,
}: ExportVocabWordOptions): void {
  const isHanziOnly = mode === 'hanzi-only';
  const effectiveCols = isHanziOnly ? 10 : 6;

  const modeTitleAr = isHanziOnly
    ? 'شيت اختبار الحفظ — الرموز الصينية فقط (10 أعمدة · A3 أفقي)'
    : 'شيت المراجعة الشامل — الرموز والبينين والمعنى العربي (6 أعمدة · A3 أفقي)';

  const rows = chunkEntries(entries, effectiveCols);

  let colGroupHtml = '';
  let tableBodyHtml = '';

  if (isHanziOnly) {
    // 10 أزواج × 2 خلية = 20 عموداً عبر عرض 408mm
    // كل زوج = 10% (2.4% رقم تسلسلي + 7.6% رمز صيني)
    colGroupHtml = `<colgroup>${Array.from(
      { length: 10 },
      () => `<col style="width:2.4%;" /><col style="width:7.6%;" />`
    ).join('')}</colgroup>`;

    tableBodyHtml = rows
      .map((row) => {
        const cells = Array.from({ length: 10 }, (_, idx) => {
          const item = row[idx];
          if (!item) {
            return `<td class="serial-cell empty-cell">&nbsp;</td><td class="hanzi-cell empty-cell">&nbsp;</td>`;
          }
          return (
            `<td class="serial-cell">${item.serial}</td>` +
            `<td class="hanzi-cell" dir="ltr">${escapeHtml(item.hanzi)}</td>`
          );
        }).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('\n');
  } else {
    // 6 مجموعات × 4 خلايا مسطّحة = 24 عموداً عبر عرض 408mm (تجنّب الجداول المتداخلة في Word لضمان ورقة A3 واحدة)
    // كل مجموعة = 16.666%: (1.65% رقم + 3.35% رمز + 4.95% بينين + 6.716% معنى عربي)
    colGroupHtml = `<colgroup>${Array.from(
      { length: 6 },
      () =>
        `<col style="width:1.65%;" /><col style="width:3.35%;" /><col style="width:4.95%;" /><col style="width:6.716%;" />`
    ).join('')}</colgroup>`;

    tableBodyHtml = rows
      .map((row) => {
        const cells = Array.from({ length: 6 }, (_, idx) => {
          const item = row[idx];
          if (!item) {
            return (
              `<td class="full-serial empty-cell">&nbsp;</td>` +
              `<td class="full-hanzi empty-cell">&nbsp;</td>` +
              `<td class="full-pinyin empty-cell">&nbsp;</td>` +
              `<td class="full-arabic empty-cell">&nbsp;</td>`
            );
          }
          return (
            `<td class="full-serial">${item.serial}</td>` +
            `<td class="full-hanzi" dir="ltr">${escapeHtml(item.hanzi)}</td>` +
            `<td class="full-pinyin" dir="ltr">${escapeHtml(item.pinyin)}</td>` +
            `<td class="full-arabic" dir="rtl">${escapeHtml(item.arabic)}</td>`
          );
        }).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('\n');
  }

  const htmlDocument = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تجميعة مفردات المستوى الأول HSK 3.0 — المعلم Laohu (A3 أفقي)</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>75</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 420mm 297mm;
      mso-page-orientation: landscape;
      margin: 6mm;
      mso-header-margin: 3mm;
      mso-footer-margin: 3mm;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Arial', 'Tahoma', 'Microsoft YaHei', sans-serif;
      color: #000000;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .doc-header {
      text-align: center;
      border-bottom: 1.2pt solid #222222;
      padding-bottom: 3pt;
      margin-bottom: 5pt;
    }
    .doc-title {
      font-size: 12pt;
      font-weight: bold;
      margin: 0 0 2pt 0;
      color: #000000;
      mso-line-height-rule: exactly;
      line-height: 14pt;
    }
    .doc-subtitle {
      font-size: 8pt;
      margin: 0;
      color: #222222;
      mso-line-height-rule: exactly;
      line-height: 10pt;
    }
    table.master-grid {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      direction: ltr;
      page-break-inside: avoid;
    }
    table.master-grid tr {
      page-break-inside: avoid;
      mso-height-rule: at-least;
    }
    /* الوضع أ: شيت اختبار الحفظ — 10 أعمدة مزدوجة */
    td.serial-cell {
      border: 0.75pt solid #444444;
      background-color: #e5e7eb;
      text-align: center;
      vertical-align: middle;
      font-size: 8.5pt;
      font-weight: bold;
      color: #000000;
      padding: 1.5pt 2pt;
      font-family: 'Arial', sans-serif;
      mso-line-height-rule: exactly;
      line-height: 13pt;
    }
    td.hanzi-cell {
      border: 0.75pt solid #444444;
      background-color: #ffffff;
      text-align: center;
      vertical-align: middle;
      font-size: 12pt;
      font-weight: bold;
      color: #000000;
      padding: 1.5pt 2.5pt;
      font-family: 'KaiTi', 'SimSun', 'Songti SC', 'Microsoft YaHei', serif;
      white-space: nowrap;
      mso-line-height-rule: exactly;
      line-height: 14.5pt;
    }
    /* الوضع ب: شيت المراجعة الشامل — 6 أعمدة كثيفة في ورقة A3 واحدة */
    td.full-serial {
      border-top: 0.75pt solid #666666;
      border-bottom: 0.75pt solid #666666;
      border-left: 0.75pt solid #444444;
      border-right: 0.5pt solid #999999;
      background-color: #e5e7eb;
      text-align: center;
      vertical-align: middle;
      font-size: 7.5pt;
      font-weight: bold;
      color: #000000;
      padding: 1pt 1.5pt;
      font-family: 'Arial', sans-serif;
      white-space: nowrap;
      mso-line-height-rule: exactly;
      line-height: 10.5pt;
    }
    td.full-hanzi {
      border-top: 0.75pt solid #666666;
      border-bottom: 0.75pt solid #666666;
      border-left: none;
      border-right: 0.4pt solid #cccccc;
      background-color: #ffffff;
      text-align: center;
      vertical-align: middle;
      font-size: 8.5pt;
      font-weight: bold;
      color: #000000;
      padding: 1pt 1.5pt;
      font-family: 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
      white-space: nowrap;
      mso-line-height-rule: exactly;
      line-height: 10.5pt;
    }
    td.full-pinyin {
      border-top: 0.75pt solid #666666;
      border-bottom: 0.75pt solid #666666;
      border-left: none;
      border-right: 0.4pt solid #cccccc;
      background-color: #ffffff;
      text-align: center;
      vertical-align: middle;
      font-size: 7.5pt;
      color: #222222;
      padding: 1pt 1.5pt;
      font-family: 'Calibri', 'Arial', sans-serif;
      white-space: nowrap;
      mso-line-height-rule: exactly;
      line-height: 10.5pt;
    }
    td.full-arabic {
      border-top: 0.75pt solid #666666;
      border-bottom: 0.75pt solid #666666;
      border-left: none;
      border-right: 0.75pt solid #444444;
      background-color: #ffffff;
      text-align: right;
      vertical-align: middle;
      font-size: 8pt;
      font-weight: normal;
      color: #000000;
      padding: 1pt 2.5pt 1pt 1.5pt;
      font-family: 'Arial', 'Tahoma', sans-serif;
      white-space: nowrap;
      mso-line-height-rule: exactly;
      line-height: 10.5pt;
    }
    td.empty-cell {
      background-color: #fafafa;
    }
    .doc-footer {
      margin-top: 4pt;
      padding-top: 2pt;
      border-top: 0.6pt solid #666666;
      text-align: center;
      font-size: 7.5pt;
      color: #333333;
      mso-line-height-rule: exactly;
      line-height: 9.5pt;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <div class="doc-header" dir="rtl">
      <p class="doc-title">تجميعة مفردات المستوى الأول HSK 3.0 — المعلم Laohu</p>
      <p class="doc-subtitle">${escapeHtml(modeTitleAr)} &nbsp;|&nbsp; النطاق: ${escapeHtml(scopeLabelAr)} &nbsp;|&nbsp; إجمالي المفردات: ${entries.length} مفردة &nbsp;|&nbsp; مقاس الطباعة: A3 أفقي (420mm × 297mm)</p>
    </div>

    <table class="master-grid" cellspacing="0" cellpadding="0">
      ${colGroupHtml}
      <tbody>
        ${tableBodyHtml}
      </tbody>
    </table>

    <div class="doc-footer" dir="rtl">
      بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu · ورقة طباعة A3 أفقي شاملة
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const modeSlug = isHanziOnly ? 'HanziOnly_10Col' : 'FullReview_6Col';
  link.href = url;
  link.download = `HSK3_Laohu_Vocab_A3_${modeSlug}_${fileScopeTag}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
