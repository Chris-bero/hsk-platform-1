import { GrammarPointCard } from '../data/grammarCollectionData';
import { ChapterData } from '../types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface ExportGrammarWordOptions {
  cards: GrammarPointCard[];
  scopeLabelAr: string;
  fileScopeTag: string;
}

export interface ExportDialoguesWordOptions {
  chapters: ChapterData[];
  totalSentences: number;
  scopeLabelAr: string;
  fileScopeTag: string;
}

/**
 * تصدير تجميعة القواعد الشاملة إلى ملف Microsoft Word (.doc) بمقاس A4 عمودي بالأبيض والأسود
 */
export function downloadGrammarWordDoc({
  cards,
  scopeLabelAr,
  fileScopeTag,
}: ExportGrammarWordOptions): void {
  const cardsHtml = cards
    .map((card, index) => {
      const examplesRows = card.examples
        .map(
          (ex, exIdx) => `
          <tr>
            <td class="ex-num">${exIdx + 1}</td>
            <td class="ex-zh" dir="ltr">
              <div class="ex-hanzi">${escapeHtml(ex.hanzi)}</div>
              <div class="ex-pinyin">${escapeHtml(ex.pinyin)}</div>
            </td>
            <td class="ex-ar" dir="rtl">${escapeHtml(ex.arabic)}</td>
          </tr>`
        )
        .join('\n');

      return `
      <div class="grammar-card">
        <div class="card-head" dir="rtl">
          <span class="lesson-tag">${escapeHtml(card.lessonLabelZh)} · ${escapeHtml(card.lessonTitleAr)}</span>
          <span class="card-title">${index + 1}. ${escapeHtml(card.titleAr)}</span>
          <span class="card-title-zh" dir="ltr"> (${escapeHtml(card.titleZh)})</span>
        </div>
        <div class="card-body" dir="rtl">
          <div class="formula-box">
            <strong>القاعدة / الصيغة:</strong> <span dir="ltr" class="formula-text">${escapeHtml(card.formula)}</span>
          </div>
          <p class="explanation">${escapeHtml(card.explanationAr)}</p>
          <div class="trap-box">
            <strong>تنبيه امتحاني:</strong> ${escapeHtml(card.examTrapTipAr)}
          </div>
          <table class="examples-table" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th style="width:6%;">#</th>
                <th style="width:52%;">المثال الصيني والنطق (Hanzi &amp; Pinyin)</th>
                <th style="width:42%;">الترجمة بالعربية</th>
              </tr>
            </thead>
            <tbody>
              ${examplesRows}
            </tbody>
          </table>
        </div>
      </div>`;
    })
    .join('\n');

  const htmlDocument = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تجميعة القواعد الشاملة للمستوى الأول HSK 3.0 — المعلم Laohu</title>
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
    @page SectionGrammar {
      size: 210mm 297mm;
      mso-page-orientation: portrait;
      margin: 12mm 11mm 12mm 11mm;
      mso-header-margin: 6mm;
      mso-footer-margin: 6mm;
    }
    div.SectionGrammar {
      page: SectionGrammar;
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
      margin-bottom: 12pt;
    }
    .doc-title {
      font-size: 15pt;
      font-weight: bold;
      margin: 0 0 3pt 0;
    }
    .doc-subtitle {
      font-size: 9.5pt;
      margin: 0;
      color: #222222;
    }
    .grammar-card {
      border: 0.9pt solid #333333;
      margin-bottom: 11pt;
      page-break-inside: avoid;
    }
    .card-head {
      background-color: #e5e7eb;
      border-bottom: 0.75pt solid #333333;
      padding: 5pt 8pt;
      font-size: 10.5pt;
      font-weight: bold;
    }
    .lesson-tag {
      display: inline-block;
      background-color: #ffffff;
      border: 0.6pt solid #333333;
      padding: 1pt 5pt;
      font-size: 8.5pt;
      margin-left: 6pt;
    }
    .card-title-zh {
      font-size: 9.5pt;
      font-weight: normal;
      color: #222222;
      font-family: 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
    }
    .card-body {
      padding: 7pt 8pt;
    }
    .formula-box {
      background-color: #f3f4f6;
      border: 0.6pt solid #666666;
      padding: 4.5pt 7pt;
      margin-bottom: 6pt;
      font-size: 9.5pt;
    }
    .formula-text {
      font-family: 'Microsoft YaHei', 'Arial', sans-serif;
      font-weight: bold;
    }
    .explanation {
      font-size: 9.5pt;
      line-height: 1.55;
      margin: 0 0 6pt 0;
    }
    .trap-box {
      border-right: 2.5pt solid #000000;
      background-color: #fafafa;
      padding: 4pt 7pt;
      margin-bottom: 7pt;
      font-size: 9pt;
      line-height: 1.45;
    }
    table.examples-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      direction: rtl;
    }
    table.examples-table th {
      border: 0.6pt solid #444444;
      background-color: #f3f4f6;
      padding: 3.5pt 5pt;
      font-size: 8.5pt;
      text-align: center;
    }
    table.examples-table td {
      border: 0.6pt solid #444444;
      padding: 4pt 6pt;
      vertical-align: middle;
    }
    td.ex-num {
      text-align: center;
      font-size: 8.5pt;
      font-weight: bold;
      background-color: #f9fafb;
    }
    td.ex-zh {
      text-align: left;
    }
    .ex-hanzi {
      font-size: 11pt;
      font-weight: bold;
      font-family: 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
    }
    .ex-pinyin {
      font-size: 8.5pt;
      color: #333333;
      font-family: 'Calibri', 'Arial', sans-serif;
      margin-top: 1.5pt;
    }
    td.ex-ar {
      text-align: right;
      font-size: 9.2pt;
    }
    .doc-footer {
      margin-top: 12pt;
      padding-top: 5pt;
      border-top: 0.75pt solid #444444;
      text-align: center;
      font-size: 8.5pt;
      color: #333333;
    }
  </style>
</head>
<body>
  <div class="SectionGrammar">
    <div class="doc-header" dir="rtl">
      <p class="doc-title">تجميعة القواعد الشاملة للمستوى الأول HSK 3.0 — المعلم Laohu</p>
      <p class="doc-subtitle">النطاق: ${escapeHtml(scopeLabelAr)} &nbsp;|&nbsp; إجمالي القواعد: ${cards.length} قاعدة نحوية</p>
    </div>

    ${cardsHtml}

    <div class="doc-footer" dir="rtl">
      بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu · دليل القواعد الشامل
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `HSK3_Laohu_Grammar_${fileScopeTag}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * تصدير تجميعة المحادثات والجمل (278 جملة) إلى ملف Microsoft Word (.doc) بمقاس A4 عمودي بالأبيض والأسود
 */
export function downloadDialoguesWordDoc({
  chapters,
  totalSentences,
  scopeLabelAr,
  fileScopeTag,
}: ExportDialoguesWordOptions): void {
  const sectionsHtml = chapters
    .filter((ch) => ch.sentences.length > 0)
    .map((ch) => {
      const rowsHtml = ch.sentences
        .map(
          (s, idx) => `
          <tr>
            <td class="dlg-num">${idx + 1}</td>
            <td class="dlg-zh" dir="ltr">
              <div class="dlg-hanzi">${escapeHtml(s.hanzi)}</div>
              <div class="dlg-pinyin">${escapeHtml(s.pinyin)}</div>
            </td>
            <td class="dlg-ar" dir="rtl">${escapeHtml(s.arabic)}</td>
          </tr>`
        )
        .join('\n');

      return `
      <div class="chapter-section">
        <div class="chapter-heading" dir="rtl">
          <span dir="ltr" class="ch-zh">第${ch.id}课</span>
          — ${escapeHtml(ch.titleAr)}: ${escapeHtml(ch.subtitleAr)} (${ch.sentences.length} جملة)
        </div>
        <table class="dlg-table" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th style="width:6%;">#</th>
              <th style="width:52%;">الجملة الصينية والنطق (Hanzi &amp; Pinyin)</th>
              <th style="width:42%;">الترجمة بالعربية</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>`;
    })
    .join('\n');

  const htmlDocument = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تجميعة المحادثات والجمل للمستوى الأول HSK 3.0 — المعلم Laohu</title>
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
    @page SectionDialogues {
      size: 210mm 297mm;
      mso-page-orientation: portrait;
      margin: 12mm 11mm 12mm 11mm;
      mso-header-margin: 6mm;
      mso-footer-margin: 6mm;
    }
    div.SectionDialogues {
      page: SectionDialogues;
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
      margin-bottom: 12pt;
    }
    .doc-title {
      font-size: 15pt;
      font-weight: bold;
      margin: 0 0 3pt 0;
    }
    .doc-subtitle {
      font-size: 9.5pt;
      margin: 0;
      color: #222222;
    }
    .chapter-section {
      margin-top: 10pt;
      margin-bottom: 10pt;
    }
    .chapter-heading {
      background-color: #e5e7eb;
      border: 0.75pt solid #333333;
      border-bottom: none;
      padding: 5pt 8pt;
      font-size: 10.5pt;
      font-weight: bold;
      page-break-after: avoid;
    }
    .ch-zh {
      font-family: 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
    }
    table.dlg-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      direction: rtl;
    }
    table.dlg-table thead {
      display: table-header-group;
    }
    table.dlg-table tr {
      page-break-inside: avoid;
    }
    table.dlg-table th {
      border: 0.75pt solid #333333;
      background-color: #f3f4f6;
      padding: 4pt 5pt;
      font-size: 8.5pt;
      font-weight: bold;
      text-align: center;
    }
    table.dlg-table td {
      border: 0.75pt solid #444444;
      padding: 4pt 6pt;
      vertical-align: middle;
    }
    td.dlg-num {
      text-align: center;
      font-size: 8.5pt;
      font-weight: bold;
      background-color: #f9fafb;
    }
    td.dlg-zh {
      text-align: left;
    }
    .dlg-hanzi {
      font-size: 11.5pt;
      font-weight: bold;
      font-family: 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
    }
    .dlg-pinyin {
      font-size: 8.5pt;
      color: #333333;
      font-family: 'Calibri', 'Arial', sans-serif;
      margin-top: 1.5pt;
    }
    td.dlg-ar {
      text-align: right;
      font-size: 9.3pt;
    }
    .doc-footer {
      margin-top: 12pt;
      padding-top: 5pt;
      border-top: 0.75pt solid #444444;
      text-align: center;
      font-size: 8.5pt;
      color: #333333;
    }
  </style>
</head>
<body>
  <div class="SectionDialogues">
    <div class="doc-header" dir="rtl">
      <p class="doc-title">تجميعة المحادثات والجمل للمستوى الأول HSK 3.0 — المعلم Laohu</p>
      <p class="doc-subtitle">النطاق: ${escapeHtml(scopeLabelAr)} &nbsp;|&nbsp; إجمالي الجمل: ${totalSentences} جملة</p>
    </div>

    ${sectionsHtml}

    <div class="doc-footer" dir="rtl">
      بوابة اللغة الصينية - المستوى الأول (HSK 3.0) · إعداد المعلم Laohu · تجميعة المحادثات والجمل
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `HSK3_Laohu_Dialogues_${fileScopeTag}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
