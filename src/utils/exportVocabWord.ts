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
  columnsPerRow: number;
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
 * إنشاء وتحميل ملف Microsoft Word (.doc) نظيف متوافق مع الطباعة بالأبيض والأسود
 * بالترميز UTF-8 BOM وبأسلوب جداول الكتب المدرسية متعددة الأعمدة.
 */
export function downloadVocabularyWordDoc({
  entries,
  mode,
  columnsPerRow,
  scopeLabelAr,
  fileScopeTag,
}: ExportVocabWordOptions): void {
  const isHanziOnly = mode === 'hanzi-only';
  const effectiveCols = isHanziOnly
    ? Math.min(6, Math.max(5, columnsPerRow))
    : Math.min(4, Math.max(3, columnsPerRow));

  const pageOrientation = isHanziOnly ? 'portrait' : 'landscape';
  const pageSize = isHanziOnly ? '21.0cm 29.7cm' : '29.7cm 21.0cm';
  const modeTitleAr = isHanziOnly
    ? 'شيت اختبار الحفظ — الرموز الصينية فقط (Hanzi Only)'
    : 'شيت المراجعة الشامل — الرموز والبينين والمعنى العربي';

  const rows = chunkEntries(entries, effectiveCols);

  let tableBodyHtml = '';

  if (isHanziOnly) {
    const serialWidthPct = (30 / effectiveCols).toFixed(2);
    const hanziWidthPct = (70 / effectiveCols).toFixed(2);

    tableBodyHtml = rows
      .map((row) => {
        const cells = Array.from({ length: effectiveCols }, (_, idx) => {
          const item = row[idx];
          if (!item) {
            return `<td class="serial-cell empty-cell" style="width:${serialWidthPct}%;">&nbsp;</td><td class="hanzi-cell empty-cell" style="width:${hanziWidthPct}%;">&nbsp;</td>`;
          }
          return (
            `<td class="serial-cell" style="width:${serialWidthPct}%;">${item.serial}</td>` +
            `<td class="hanzi-cell" dir="ltr" style="width:${hanziWidthPct}%;">${escapeHtml(item.hanzi)}</td>`
          );
        }).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('\n');
  } else {
    const colWidthPct = (100 / effectiveCols).toFixed(2);
    tableBodyHtml = rows
      .map((row) => {
        const cells = Array.from({ length: effectiveCols }, (_, idx) => {
          const item = row[idx];
          if (!item) {
            return `<td class="review-card-cell empty-cell" style="width:${colWidthPct}%;">&nbsp;</td>`;
          }
          return `
            <td class="review-card-cell" style="width:${colWidthPct}%;">
              <table class="inner-item-table" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="inner-serial">${item.serial}</td>
                  <td class="inner-hanzi" dir="ltr">${escapeHtml(item.hanzi)}</td>
                  <td class="inner-pinyin" dir="ltr">${escapeHtml(item.pinyin)}</td>
                  <td class="inner-arabic" dir="rtl">${escapeHtml(item.arabic)}</td>
                </tr>
              </table>
            </td>`;
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
  <title>تجميعة مفردات المستوى الأول HSK 3.0 — المعلم Laohu</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: ${pageSize};
      mso-page-orientation: ${pageOrientation};
      margin: 1.1cm 1.0cm 1.1cm 1.0cm;
      mso-header-margin: 0.5cm;
      mso-footer-margin: 0.5cm;
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
      border-bottom: 1.5pt solid #000000;
      padding-bottom: 6pt;
      margin-bottom: 10pt;
    }
    .doc-title {
      font-size: 14pt;
      font-weight: bold;
      margin: 0 0 3pt 0;
      color: #000000;
    }
    .doc-subtitle {
      font-size: 9.5pt;
      margin: 0;
      color: #222222;
    }
    table.master-grid {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      direction: ltr;
    }
    table.master-grid tr {
      page-break-inside: avoid;
    }
    table.master-grid td {
      border: 0.75pt solid #000000;
      vertical-align: middle;
    }
    td.serial-cell {
      background-color: #EAEAEA;
      text-align: center;
      font-size: 9pt;
      font-weight: bold;
      color: #000000;
      padding: 5pt 2pt;
      font-family: 'Arial', sans-serif;
    }
    td.hanzi-cell {
      background-color: #FFFFFF;
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      color: #000000;
      padding: 6pt 3pt;
      font-family: 'KaiTi', 'SimSun', 'Songti SC', 'Microsoft YaHei', serif;
    }
    td.review-card-cell {
      padding: 0;
      background-color: #FFFFFF;
    }
    table.inner-item-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      direction: ltr;
    }
    table.inner-item-table td {
      border: none;
      vertical-align: middle;
      padding: 4pt 3pt;
      color: #000000;
    }
    td.inner-serial {
      width: 11%;
      background-color: #EAEAEA;
      border-right: 0.5pt solid #000000 !important;
      text-align: center;
      font-size: 8.5pt;
      font-weight: bold;
      font-family: 'Arial', sans-serif;
    }
    td.inner-hanzi {
      width: 24%;
      border-right: 0.5pt solid #CCCCCC !important;
      text-align: center;
      font-size: 12pt;
      font-weight: bold;
      font-family: 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
    }
    td.inner-pinyin {
      width: 29%;
      border-right: 0.5pt solid #CCCCCC !important;
      text-align: center;
      font-size: 8.5pt;
      font-family: 'Calibri', 'Arial', sans-serif;
    }
    td.inner-arabic {
      width: 36%;
      text-align: right;
      font-size: 9pt;
      font-family: 'Arial', 'Tahoma', sans-serif;
      padding-right: 4pt !important;
    }
    td.empty-cell {
      background-color: #FAFAFA;
    }
    .doc-footer {
      margin-top: 8pt;
      text-align: center;
      font-size: 8pt;
      color: #333333;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <div class="doc-header" dir="rtl">
      <p class="doc-title">تجميعة مفردات المستوى الأول HSK 3.0 — المعلم Laohu</p>
      <p class="doc-subtitle">${escapeHtml(modeTitleAr)} &nbsp;|&nbsp; النطاق: ${escapeHtml(scopeLabelAr)} &nbsp;|&nbsp; إجمالي المفردات: ${entries.length} مفردة</p>
    </div>

    <table class="master-grid" cellspacing="0" cellpadding="0">
      <tbody>
        ${tableBodyHtml}
      </tbody>
    </table>

    <div class="doc-footer" dir="rtl">
      بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const modeSlug = isHanziOnly ? 'HanziOnly' : 'FullReview';
  link.href = url;
  link.download = `HSK3_Laohu_Vocab_${modeSlug}_${fileScopeTag}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
