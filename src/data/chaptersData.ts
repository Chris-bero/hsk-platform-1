import { ChapterData, DrillType } from '../types';

export type { ChapterData, VocabItem, SentenceItem } from '../types';

export const DRILL_METADATA: Record<
  DrillType,
  { titleAr: string; descriptionAr: string; requires: 'vocab' | 'sentences' }
> = {
  'hanzi-to-arabic': {
    titleAr: 'الرموز الصينية إلى العربية',
    descriptionAr: 'اقرأ الرمز الصيني واختر المعنى العربي الصحيح.',
    requires: 'vocab',
  },
  'arabic-to-hanzi': {
    titleAr: 'العربية إلى الرموز الصينية',
    descriptionAr: 'اقرأ المعنى العربي واختر الرمز الصيني المطابق.',
    requires: 'vocab',
  },
  'hanzi-to-pinyin': {
    titleAr: 'الرموز الصينية إلى النطق الصوتي',
    descriptionAr: 'ميّز النغمة الصحيحة من بين خمسة خيارات صوتية متقاربة.',
    requires: 'vocab',
  },
  'match-2-col': {
    titleAr: 'توصيل ثنائي',
    descriptionAr: 'صل كل رمز صيني بمعناه العربي المقابل له.',
    requires: 'vocab',
  },
  'match-3-col': {
    titleAr: 'توصيل ثلاثي',
    descriptionAr: 'اربط بين الرمز الصيني والنطق الصوتي والمعنى العربي.',
    requires: 'vocab',
  },
  listening: {
    titleAr: 'استماع',
    descriptionAr: 'استمع إلى النطق الصيني بالسرعة العادية أو البطيئة واختر الرمز.',
    requires: 'vocab',
  },
  'sentence-translation': {
    titleAr: 'ترجمة الجمل',
    descriptionAr: 'ترجم الجمل بين الصينية والعربية في الاتجاهين.',
    requires: 'sentences',
  },
  'sentence-builder': {
    titleAr: 'تكوين الجملة',
    descriptionAr: 'رتّب المقاطع الصينية لتكوين الجملة المطابقة للمعنى العربي.',
    requires: 'sentences',
  },
  'fill-in-blank': {
    titleAr: 'أكمل الناقص',
    descriptionAr: 'اختر الكلمة الصينية المناسبة لإتمام الجملة.',
    requires: 'sentences',
  },
};

export const ALL_DRILL_TYPES: DrillType[] = [
  'hanzi-to-arabic',
  'arabic-to-hanzi',
  'hanzi-to-pinyin',
  'match-2-col',
  'match-3-col',
  'listening',
  'sentence-translation',
  'sentence-builder',
  'fill-in-blank',
];

/**
 * هيكل الفصول الخمسة عشر للمستوى الأول (الإصدار الثالث).
 * الفصل الأول يحتوي على ٣ كلمات وجملتين تجريبيتين فقط لضمان عمل الواجهة وجميع المحركات.
 * الفصول ٢ إلى ١٥ جاهزة لإضافة المحتوى التعليمي مباشرة.
 */
export const CHAPTERS_DATA: ChapterData[] = [
  {
    id: 1,
    chineseNumeral: '一',
    titleAr: 'الفصل الأول',
    subtitleAr: 'التحيات والتعارف الأساسي',
    vocab: [
      {
        id: 'c1-v1',
        hanzi: '你好',
        pinyin: 'nǐ hǎo',
        arabic: 'مرحباً',
        toneVariants: ['nī hǎo', 'nǐ hào'],
        similarSyllables: ['lǐ hǎo', 'nǐ hāo'],
      },
      {
        id: 'c1-v2',
        hanzi: '谢谢',
        pinyin: 'xiè xie',
        arabic: 'شكراً',
        toneVariants: ['xiē xie', 'xiě xie'],
        similarSyllables: ['xuè xue', 'jiè jie'],
      },
      {
        id: 'c1-v3',
        hanzi: '再见',
        pinyin: 'zài jiàn',
        arabic: 'إلى اللقاء',
        toneVariants: ['zǎi jiàn', 'zài jiān'],
        similarSyllables: ['cài jiàn', 'zài qiàn'],
      },
    ],
    sentences: [
      {
        id: 'c1-s1',
        hanzi: '你好，很高兴认识你。',
        pinyin: 'nǐ hǎo, hěn gāo xìng rèn shi nǐ.',
        arabic: 'مرحباً، يسعدني التعرف إليك.',
        segments: ['你好', '，', '很', '高兴', '认识', '你', '。'],
        targetBlank: '高兴',
        blankDistractors: ['谢谢', '再见', '明天'],
      },
      {
        id: 'c1-s2',
        hanzi: '谢谢你，明天再见。',
        pinyin: 'xiè xie nǐ, míng tiān zài jiàn.',
        arabic: 'شكراً لك، أراك غداً.',
        segments: ['谢谢', '你', '，', '明天', '再见', '。'],
        targetBlank: '再见',
        blankDistractors: ['你好', '高兴', '认识'],
      },
    ],
  },
  { id: 2, chineseNumeral: '二', titleAr: 'الفصل الثاني', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 3, chineseNumeral: '三', titleAr: 'الفصل الثالث', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 4, chineseNumeral: '四', titleAr: 'الفصل الرابع', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 5, chineseNumeral: '五', titleAr: 'الفصل الخامس', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 6, chineseNumeral: '六', titleAr: 'الفصل السادس', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 7, chineseNumeral: '七', titleAr: 'الفصل السابع', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 8, chineseNumeral: '八', titleAr: 'الفصل الثامن', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 9, chineseNumeral: '九', titleAr: 'الفصل التاسع', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 10, chineseNumeral: '十', titleAr: 'الفصل العاشر', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 11, chineseNumeral: '十一', titleAr: 'الفصل الحادي عشر', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 12, chineseNumeral: '十二', titleAr: 'الفصل الثاني عشر', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 13, chineseNumeral: '十三', titleAr: 'الفصل الثالث عشر', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 14, chineseNumeral: '十四', titleAr: 'الفصل الرابع عشر', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
  { id: 15, chineseNumeral: '十五', titleAr: 'الفصل الخامس عشر', subtitleAr: 'قيد الإضافة', vocab: [], sentences: [] },
];
