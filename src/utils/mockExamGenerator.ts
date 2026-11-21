import { ChapterData, DrillOption } from '../types';
import { shuffleArray } from './drillGenerators';

export type MockExamSection = 'listening' | 'reading';

export type MockExamSubPart =
  | 'listening-word-phrase'
  | 'listening-dialogue'
  | 'reading-cloze'
  | 'reading-response'
  | 'reading-reorder';

export interface MockDialogueLine {
  speaker: 'A' | 'B';
  hanzi: string;
  pinyin: string;
  arabic: string;
}

export interface MockExamQuestion {
  id: string;
  questionNumber: number; // 1..40
  section: MockExamSection;
  subPart: MockExamSubPart;
  chapterId: number;
  points: number; // 5 points each (40 * 5 = 200)

  /** Listening single-item audio OR Dialogue lines */
  audioText?: string;
  dialogueLines?: MockDialogueLine[];

  /** Prompt display */
  instructionAr: string;
  promptZh?: string;
  promptPinyin?: string;
  promptAr?: string;

  /** Multiple-choice (Parts 1A, 1B, 2A, 2B) */
  options?: DrillOption[];
  correctOptionId?: string;

  /** Fill-in-the-blank (Part 2A) */
  sentenceWithBlank?: string;
  sentenceFullHanzi?: string;
  sentenceFullPinyin?: string;
  targetBlank?: string;

  /** Word Reordering (Part 2C) */
  correctSegments?: string[];
  shuffledSegments?: { tileId: string; text: string }[];

  /** Review display metadata */
  correctDisplay: string;
  correctPinyinDisplay?: string;
  meaningAr: string;
}

export interface GeneratedMockExam {
  listeningQuestions: MockExamQuestion[]; // 20 questions (100 pts)
  readingQuestions: MockExamQuestion[]; // 20 questions (100 pts)
  allQuestions: MockExamQuestion[]; // 40 questions (200 pts)
}

interface DialogueBankItem {
  id: string;
  chapterId: number;
  lineA: { hanzi: string; pinyin: string; arabic: string };
  lineB: { hanzi: string; pinyin: string; arabic: string };
  questionAr: string;
  questionZh: string;
  correctAr: string;
  distractorsAr: [string, string, string];
}

interface LogicalResponseItem {
  id: string;
  chapterId: number;
  promptZh: string;
  promptPinyin: string;
  promptAr: string;
  replyZh: string;
  replyPinyin: string;
  replyAr: string;
}

// القائمة النظيفة والمكتملة من ١٦ حواراً موقفياً من الفصول ١–٥
const SITUATIONAL_DIALOGUES: DialogueBankItem[] = [
  {
    id: 'dlg-c1-1',
    chapterId: 1,
    lineA: { hanzi: '你好，王老师！', pinyin: 'Nǐ hǎo, Wáng lǎoshī!', arabic: 'مرحباً يا أستاذة وانغ!' },
    lineB: { hanzi: '同学，你好！', pinyin: 'Tóngxué, nǐ hǎo!', arabic: 'مرحباً أيها الزميل!' },
    questionAr: 'مَن الشخص الذي تُحيّيه المتحدثة؟',
    questionZh: '她在跟谁问好？',
    correctAr: 'الأستاذة وانغ',
    distractorsAr: ['الأستاذ لي', 'والدها', 'حبيبتها'],
  },
  {
    id: 'dlg-c1-2',
    chapterId: 1,
    lineA: { hanzi: '我下班了，再见！', pinyin: 'Wǒ xiàbān le, zàijiàn!', arabic: 'لقد انتهيت من عملي، إلى اللقاء!' },
    lineB: { hanzi: '再见，明天见！', pinyin: 'Zàijiàn, míngtiān jiàn!', arabic: 'إلى اللقاء، أراك غداً!' },
    questionAr: 'ماذا فعلت المتحدثة الآن؟',
    questionZh: '女的现在做什么了？',
    correctAr: 'انتهت من عملها وتودّعه حتى الغد',
    distractorsAr: ['تدرس في الفصل الآن', 'تطبخ النودلز في البيت', 'تبحث عن السوبر ماركت'],
  },
  {
    id: 'dlg-c1-3',
    chapterId: 1,
    lineA: { hanzi: '他是李老师的学生吗？', pinyin: 'Tā shì Lǐ lǎoshī de xuéshēng ma?', arabic: 'هل هو طالب الأستاذ لي؟' },
    lineB: { hanzi: '对，我和他是同学。', pinyin: 'Duì, wǒ hé tā shì tóngxué.', arabic: 'نعم، أنا وهو زملاء دراسة.' },
    questionAr: 'ما علاقة المتحدث (ب) بذلك الشخص؟',
    questionZh: '男的和他是什么关系？',
    correctAr: 'زملاء دراسة',
    distractorsAr: ['أخوه الأكبر', 'أستاذه في المدرسة', 'والده'],
  },
  {
    id: 'dlg-c2-1',
    chapterId: 2,
    lineA: { hanzi: '请问，你叫什么名字？', pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?', arabic: 'من فضلك، ما اسمك؟' },
    lineB: { hanzi: '我叫陈天中，很高兴认识你。', pinyin: 'Wǒ jiào Chén Tiānzhōng, hěn gāoxìng rènshi nǐ.', arabic: 'اسمي تشن تيان تشونغ، سعيد بالتعرف عليك.' },
    questionAr: 'ما اسم المتحدث (ب)؟',
    questionZh: '男的叫什么名字？',
    correctAr: 'تشن تيان تشونغ (陈天中)',
    distractorsAr: ['لي ون (李文)', 'باي جيا يويه (白家月)', 'آني (安妮)'],
  },
  {
    id: 'dlg-c2-2',
    chapterId: 2,
    lineA: { hanzi: '请问，你是安妮吗？', pinyin: 'Qǐngwèn, nǐ shì Ānnī ma?', arabic: 'من فضلك، هل أنتِ آني؟' },
    lineB: { hanzi: '对不起，我不是安妮，我是白家月。', pinyin: 'Duìbuqǐ, wǒ bú shì Ānnī, wǒ shì Bái Jiāyuè.', arabic: 'آسفة، أنا لست آني، أنا باي جيا يويه.' },
    questionAr: 'ما الاسم الحقيقي للشخص الثاني؟',
    questionZh: '第二个人叫什么名字？',
    correctAr: 'باي جيا يويه (白家月)',
    distractorsAr: ['آني (安妮)', 'الأستاذة وانغ (王老师)', 'لي ون (李文)'],
  },
  {
    id: 'dlg-c2-3',
    chapterId: 2,
    lineA: { hanzi: '你认识李文吗？', pinyin: 'Nǐ rènshi Lǐ Wén ma?', arabic: 'هل تعرف لي ون؟' },
    lineB: { hanzi: '我不认识他。', pinyin: 'Wǒ bú rènshi tā.', arabic: 'أنا لا أعرفه.' },
    questionAr: 'هل يعرف المتحدث (ب) لي ون؟',
    questionZh: '男的认识李文吗？',
    correctAr: 'لا، لا يعرفه',
    distractorsAr: ['نعم، إنه أخوه الأكبر', 'نعم، إنه أستاذه', 'نعم، يدرسان معاً'],
  },
  {
    id: 'dlg-c2-4',
    chapterId: 2,
    lineA: { hanzi: '对不起！', pinyin: 'Duìbuqǐ!', arabic: 'آسفة!' },
    lineB: { hanzi: '没关系，没事。', pinyin: 'Méi guānxi, méishì.', arabic: 'لا بأس، لا توجد مشكلة.' },
    questionAr: 'ما معنى رد المتحدث (ب)؟',
    questionZh: '男的这句话是什么意思？',
    correctAr: 'لا بأس ولا توجد مشكلة',
    distractorsAr: ['إلى اللقاء غداً', 'أنا مشغول جداً اليوم', 'كم عمرك هذا العام'],
  },
  {
    id: 'dlg-c3-1',
    chapterId: 3,
    lineA: { hanzi: '你女朋友是哪国人？', pinyin: 'Nǐ nǚpéngyou shì nǎ guó rén?', arabic: 'ما جنسية حبيبتك؟' },
    lineB: { hanzi: '她是泰国人。', pinyin: 'Tā shì Tàiguó rén.', arabic: 'هي تايلاندية.' },
    questionAr: 'من أي بلد حبيبة المتحدث (ب)؟',
    questionZh: '他女朋友是哪国人？',
    correctAr: 'تايلاند',
    distractorsAr: ['الصين', 'فرنسا', 'غير معروف'],
  },
  {
    id: 'dlg-c3-2',
    chapterId: 3,
    lineA: { hanzi: '喂，姐姐，你工作还忙吗？', pinyin: 'Wèi, jiějie, nǐ gōngzuò hái máng ma?', arabic: 'ألو، يا أختي الكبرى، هل عملك ما زال مزدحماً؟' },
    lineB: { hanzi: '我今天不忙，我们很想你。', pinyin: 'Wǒ jīntiān bù máng, wǒmen hěn xiǎng nǐ.', arabic: 'أنا لست مشغولة اليوم، نحن نشتاق إليك كثيراً.' },
    questionAr: 'كيف حال العمل اليوم حسب الحوار؟',
    questionZh: '今天工作忙吗？',
    correctAr: 'ليس مشغولاً اليوم',
    distractorsAr: ['مشغول جداً طوال اليوم', 'أخذت إجازة في فرنسا', 'انتهى العمل في السادسة'],
  },
  {
    id: 'dlg-c3-3',
    chapterId: 3,
    lineA: { hanzi: '你的中文老师是中国人吗？', pinyin: 'Nǐ de Zhōngwén lǎoshī shì Zhōngguó rén ma?', arabic: 'هل معلمك للغة الصينية صيني؟' },
    lineB: { hanzi: '对，她是中国人，我在中国学习。', pinyin: 'Duì, tā shì Zhōngguó rén, wǒ zài Zhōngguó xuéxí.', arabic: 'نعم، هي صينية وأنا أدرس في الصين.' },
    questionAr: 'أين يدرس المتحدث (ب)؟',
    questionZh: '男的在哪里学习？',
    correctAr: 'في الصين',
    distractorsAr: ['في فرنسا', 'في تايلاند', 'في البيت فقط'],
  },
  {
    id: 'dlg-c4-1',
    chapterId: 4,
    lineA: { hanzi: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?', arabic: 'كم فرداً في أسرتك؟' },
    lineB: { hanzi: '我家有四口人，爸爸、妈妈、妹妹和我。', pinyin: 'Wǒ jiā yǒu sì kǒu rén, bàba, māma, mèimei hé wǒ.', arabic: 'أسرتي أربعة أفراد: أبي وأمي وأختي الصغرى وأنا.' },
    questionAr: 'كم عدد أفراد أسرة المتحدث (ب)؟',
    questionZh: '男的家有几口人？',
    correctAr: 'أربعة أفراد',
    distractorsAr: ['فردان فقط', 'ثلاثة أفراد', 'خمسة أفراد'],
  },
  {
    id: 'dlg-c4-2',
    chapterId: 4,
    lineA: { hanzi: '您有几个孩子？', pinyin: 'Nín yǒu jǐ gè háizi?', arabic: 'كم طفلاً لدى حضرتك؟' },
    lineB: { hanzi: '我有两个孩子，一个儿子，一个女儿。', pinyin: 'Wǒ yǒu liǎng gè háizi, yí gè érzi, yí gè nǚ\'ér.', arabic: 'لديّ طفلان: ابن واحد وابنة واحدة.' },
    questionAr: 'كم عدد أطفال المتحدث (ب)؟',
    questionZh: '男的有几个孩子？',
    correctAr: 'طفلان (ابن وابنة)',
    distractorsAr: ['ابن واحد فقط', 'ابنتان', 'ليس لديه أطفال'],
  },
  {
    id: 'dlg-c4-3',
    chapterId: 4,
    lineA: { hanzi: '您儿子今年几岁？', pinyin: 'Nín érzi jīnnián jǐ suì?', arabic: 'كم عمر ابن حضرتك هذا العام؟' },
    lineB: { hanzi: '他今年五岁。', pinyin: 'Tā jīnnián wǔ suì.', arabic: 'عمره خمس سنوات هذا العام.' },
    questionAr: 'كم عمر الابن هذا العام؟',
    questionZh: '他儿子今年几岁？',
    correctAr: 'خمس سنوات',
    distractorsAr: ['عشر سنوات', 'عشرون سنة', 'أربع سنوات'],
  },
  {
    id: 'dlg-c5-1',
    chapterId: 5,
    lineA: { hanzi: '今天星期几？', pinyin: 'Jīntiān xīngqī jǐ?', arabic: 'ما اليوم في الأسبوع؟' },
    lineB: { hanzi: '星期日，今天我休息。', pinyin: 'Xīngqīrì, jīntiān wǒ xiūxi.', arabic: 'يوم الأحد، واليوم أنا في إجازة.' },
    questionAr: 'ما اليوم المذكور في الحوار؟',
    questionZh: '今天星期几？',
    correctAr: 'يوم الأحد (وهو يوم إجازته)',
    distractorsAr: ['يوم الإثنين وعنده عمل', 'اليوم الأول من مارس', 'يوم الثلاثاء وعنده درس'],
  },
  {
    id: 'dlg-c5-2',
    chapterId: 5,
    lineA: { hanzi: '你会做饭吗？', pinyin: 'Nǐ huì zuò fàn ma?', arabic: 'هل تعرف كيف تطبخ؟' },
    lineB: { hanzi: '我会做面条儿、饺子，也会做一些菜。', pinyin: 'Wǒ huì zuò miàntiáor, jiǎozi, yě huì zuò yìxiē cài.', arabic: 'أعرف إعداد النودلز والجياوتسي وبعض الأطباق.' },
    questionAr: 'ماذا يستطيع المتحدث (ب) أن يطبخ؟',
    questionZh: '男的会做什么？',
    correctAr: 'النودلز والجياوتسي وبعض الأطباق',
    distractorsAr: ['لا يعرف الطبخ أبداً', 'يشتري الطعام من السوبر ماركت', 'يطبخ النودلز فقط'],
  },
  {
    id: 'dlg-c5-3',
    chapterId: 5,
    lineA: { hanzi: '这是你的新电脑吗？真好看！', pinyin: 'Zhè shì nǐ de xīn diànnǎo ma? Zhēn hǎokàn!', arabic: 'هل هذا حاسوبك الجديد؟ جميل حقاً!' },
    lineB: { hanzi: '对，我也很喜欢它。', pinyin: 'Duì, wǒ yě hěn xǐhuan tā.', arabic: 'نعم، وأنا أيضاً أحبه كثيراً.' },
    questionAr: 'عمّ يتحدثان في هذا الحوار؟',
    questionZh: '他们在说什么？',
    correctAr: 'عن حاسوب جديد جميل',
    distractorsAr: ['عن ملابس جديدة', 'عن موعد انتهاء العمل', 'عن السفر إلى تايلاند'],
  },
];

// بنك الردود المنطقية (١٤ زوجاً من الفصول ١ إلى ٥) لقسم القراءة الجزء الثاني
const LOGICAL_RESPONSE_BANK: LogicalResponseItem[] = [
  {
    id: 'resp-1',
    chapterId: 2,
    promptZh: '请问，你叫什么名字？',
    promptPinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?',
    promptAr: 'من فضلك، ما اسمك؟',
    replyZh: '我叫陈天中。',
    replyPinyin: 'Wǒ jiào Chén Tiānzhōng.',
    replyAr: 'اسمي تشن تيان تشونغ.',
  },
  {
    id: 'resp-2',
    chapterId: 2,
    promptZh: '很高兴认识你。',
    promptPinyin: 'Hěn gāoxìng rènshi nǐ.',
    promptAr: 'سعيد جداً بالتعرف عليك.',
    replyZh: '认识你我也很高兴。',
    replyPinyin: 'Rènshi nǐ wǒ yě hěn gāoxìng.',
    replyAr: 'أنا أيضاً سعيد جداً بالتعرف عليك.',
  },
  {
    id: 'resp-3',
    chapterId: 2,
    promptZh: '对不起！',
    promptPinyin: 'Duìbuqǐ!',
    promptAr: 'آسف!',
    replyZh: '没关系，没事。',
    replyPinyin: 'Méi guānxi, méishì.',
    replyAr: 'لا بأس، لا مشكلة.',
  },
  {
    id: 'resp-4',
    chapterId: 1,
    promptZh: '我下班了，再见！',
    promptPinyin: 'Wǒ xiàbān le, zàijiàn!',
    promptAr: 'لقد انتهيت من عملي، إلى اللقاء!',
    replyZh: '再见，明天见！',
    replyPinyin: 'Zàijiàn, míngtiān jiàn!',
    replyAr: 'إلى اللقاء، أراك غداً!',
  },
  {
    id: 'resp-5',
    chapterId: 2,
    promptZh: '你认识他吗？',
    promptPinyin: 'Nǐ rènshi tā ma?',
    promptAr: 'هل تعرفه؟',
    replyZh: '我不认识他。',
    replyPinyin: 'Wǒ bú rènshi tā.',
    replyAr: 'أنا لا أعرفه.',
  },
  {
    id: 'resp-6',
    chapterId: 3,
    promptZh: '这是谁？',
    promptPinyin: 'Zhè shì shéi?',
    promptAr: 'مَن هذا / هذه؟',
    replyZh: '这是我女朋友。',
    replyPinyin: 'Zhè shì wǒ nǚpéngyou.',
    replyAr: 'هذه حبيبتي.',
  },
  {
    id: 'resp-7',
    chapterId: 3,
    promptZh: '你女朋友是哪国人？',
    promptPinyin: 'Nǐ nǚpéngyou shì nǎ guó rén?',
    promptAr: 'ما جنسية حبيبتك؟',
    replyZh: '她也是泰国人。',
    replyPinyin: 'Tā yě shì Tàiguó rén.',
    replyAr: 'هي تايلاندية أيضاً.',
  },
  {
    id: 'resp-8',
    chapterId: 3,
    promptZh: '你工作还忙吗？',
    promptPinyin: 'Nǐ gōngzuò hái máng ma?',
    promptAr: 'هل ما زال عملك مزدحماً؟',
    replyZh: '我不太忙，我们很想你。',
    replyPinyin: 'Wǒ bú tài máng, wǒmen hěn xiǎng nǐ.',
    replyAr: 'أنا لست مشغولاً جداً، نحن نشتاق إليك كثيراً.',
  },
  {
    id: 'resp-9',
    chapterId: 4,
    promptZh: '她有多少个学生？',
    promptPinyin: 'Tā yǒu duōshao gè xuéshēng?',
    promptAr: 'كم عدد الطلاب لديها؟',
    replyZh: '她有二十个学生。',
    replyPinyin: 'Tā yǒu èrshí gè xuéshēng.',
    replyAr: 'لديها عشرون طالباً.',
  },
  {
    id: 'resp-10',
    chapterId: 4,
    promptZh: '你家有几口人？',
    promptPinyin: 'Nǐ jiā yǒu jǐ kǒu rén?',
    promptAr: 'كم فرداً في أسرتك؟',
    replyZh: '我家有四口人，爸爸、妈妈、妹妹和我。',
    replyPinyin: 'Wǒ jiā yǒu sì kǒu rén, bàba, māma, mèimei hé wǒ.',
    replyAr: 'أسرتي أربعة أفراد: أبي وأمي وأختي الصغرى وأنا.',
  },
  {
    id: 'resp-11',
    chapterId: 4,
    promptZh: '您儿子几岁？',
    promptPinyin: 'Nín érzi jǐ suì?',
    promptAr: 'كم عمر ابن حضرتك؟',
    replyZh: '他今年五岁。',
    replyPinyin: 'Tā jīnnián wǔ suì.',
    replyAr: 'عمره خمس سنوات هذا العام.',
  },
  {
    id: 'resp-12',
    chapterId: 4,
    promptZh: '我有两个哥哥，你呢？',
    promptPinyin: 'Wǒ yǒu liǎng gè gēge, nǐ ne?',
    promptAr: 'لديّ أخوان أكبر مني، وماذا عنك؟',
    replyZh: '我没有哥哥。',
    replyPinyin: 'Wǒ méiyǒu gēge.',
    replyAr: 'ليس لديّ أخ أكبر.',
  },
  {
    id: 'resp-13',
    chapterId: 5,
    promptZh: '今天星期几？',
    promptPinyin: 'Jīntiān xīngqī jǐ?',
    promptAr: 'ما اليوم في الأسبوع؟',
    replyZh: '星期日，今天我休息。',
    replyPinyin: 'Xīngqīrì, jīntiān wǒ xiūxi.',
    replyAr: 'يوم الأحد، واليوم أنا في إجازة.',
  },
  {
    id: 'resp-14',
    chapterId: 5,
    promptZh: '你会做饭吗？',
    promptPinyin: 'Nǐ huì zuò fàn ma?',
    promptAr: 'هل تعرف كيف تطبخ؟',
    replyZh: '我会做面条儿、饺子，也会做一些菜。',
    replyPinyin: 'Wǒ huì zuò miàntiáor, jiǎozi, yě huì zuò yìxiē cài.',
    replyAr: 'أعرف إعداد النودلز والجياوتسي وبعض الأطباق.',
  },
];

// معرفات الجمل النحوية المميزة لاختبار ترتيب الكلمات (S+P+O، 的، 吗، 有، 会، التواريخ)
const GRAMMAR_REORDER_IDS = new Set<string>([
  'c1-s6', // 他是李老师的学生。 (的)
  'c1-s9', // 她是我的中文老师。 (的)
  'c2-s1', // 请问，你叫什么名字？ (S+P+O)
  'c2-s10', // 很高兴认识你。
  'c2-s14', // 你认识他吗？ (吗)
  'c3-s2', // 我的中文老师也是中国人。 (的 + 也)
  'c3-s10', // 你女朋友是哪国人？
  'c3-s16', // 你工作还忙吗？ (吗)
  'c4-s2', // 她有二十个学生。 (有)
  'c4-s7', // 你家有几口人？ (有)
  'c4-s17', // 他今年五岁。
  'c5-s1', // 今天9月8号。 (التواريخ)
  'c5-s3', // 我们3月1号上课。 (التواريخ)
  'c5-s9', // 你会做饭吗？ (会 + 吗)
  'c5-s11', // 我会说中文。 (会)
  'c5-s17', // 这是你的新电脑吗？ (的 + 吗)
]);

export function generateOfficialMockExam(chapters: ChapterData[]): GeneratedMockExam {
  const populated = chapters.filter((ch) => ch.vocab.length > 0 || ch.sentences.length > 0);
  const allVocab = populated.flatMap((ch) =>
    ch.vocab.map((v) => ({ ...v, chapterId: ch.id }))
  );
  const allSentences = populated.flatMap((ch) =>
    ch.sentences.map((s) => ({ ...s, chapterId: ch.id }))
  );

  const pinyinByHanzi = new Map<string, string>();
  allVocab.forEach((v) => pinyinByHanzi.set(v.hanzi, v.pinyin));

  // =========================================================================
  // القسم الأول: الاستماع (20 سؤالاً — 100 درجة)
  // =========================================================================

  // الجزء 1أ: استماع الكلمات والعبارات (10 أسئلة: 5 مفردات + 5 جمل قصيرة)
  const pickedVocab = shuffleArray(allVocab).slice(0, 5);
  const pickedShortSentences = shuffleArray(
    allSentences.filter((s) => s.hanzi.length <= 12)
  ).slice(0, 5);

  const listeningPartA: MockExamQuestion[] = [];

  pickedVocab.forEach((v, idx) => {
    const distractors = shuffleArray(
      allVocab.filter((other) => other.id !== v.id && other.arabic !== v.arabic)
    ).slice(0, 3);

    const options: DrillOption[] = shuffleArray([
      { id: 'correct', label: v.arabic, subLabel: v.hanzi },
      ...distractors.map((d, i) => ({ id: `d-${i}`, label: d.arabic, subLabel: d.hanzi })),
    ]);

    listeningPartA.push({
      id: `mock-l1-${idx + 1}`,
      questionNumber: idx + 1,
      section: 'listening',
      subPart: 'listening-word-phrase',
      chapterId: v.chapterId,
      points: 5,
      audioText: v.hanzi,
      instructionAr: 'استمع إلى الكلمة الصينية ثم اختر المعنى المطابق لها (مسموح بالاستماع مرتين فقط).',
      options,
      correctOptionId: 'correct',
      correctDisplay: `${v.hanzi} — ${v.arabic}`,
      correctPinyinDisplay: v.pinyin,
      meaningAr: v.arabic,
    });
  });

  pickedShortSentences.forEach((s, idx) => {
    const distractors = shuffleArray(
      allSentences.filter((other) => other.id !== s.id && other.arabic !== s.arabic)
    ).slice(0, 3);

    const options: DrillOption[] = shuffleArray([
      { id: 'correct', label: s.arabic },
      ...distractors.map((d, i) => ({ id: `d-${i}`, label: d.arabic })),
    ]);

    listeningPartA.push({
      id: `mock-l1-${idx + 6}`,
      questionNumber: idx + 6,
      section: 'listening',
      subPart: 'listening-word-phrase',
      chapterId: s.chapterId,
      points: 5,
      audioText: s.hanzi,
      instructionAr: 'استمع إلى الجملة الصينية ثم اختر المعنى الصحيح (مسموح بالاستماع مرتين فقط).',
      options,
      correctOptionId: 'correct',
      correctDisplay: `${s.hanzi} — ${s.arabic}`,
      correctPinyinDisplay: s.pinyin,
      meaningAr: s.arabic,
    });
  });

  // الجزء 1ب: الحوارات الموقفية بين متحدثَين (10 أسئلة)
  const pickedDialogues = shuffleArray(SITUATIONAL_DIALOGUES).slice(0, 10);
  const listeningPartB: MockExamQuestion[] = pickedDialogues.map((dlg, idx) => {
    const options: DrillOption[] = shuffleArray([
      { id: 'correct', label: dlg.correctAr },
      ...dlg.distractorsAr.map((d, i) => ({ id: `d-${i}`, label: d })),
    ]);

    return {
      id: `mock-l2-${idx + 1}`,
      questionNumber: 11 + idx,
      section: 'listening',
      subPart: 'listening-dialogue',
      chapterId: dlg.chapterId,
      points: 5,
      dialogueLines: [
        { speaker: 'A', ...dlg.lineA },
        { speaker: 'B', ...dlg.lineB },
      ],
      instructionAr: 'استمع إلى الحوار بين المتحدثَين ثم أجب عن السؤال التالي (مرتان فقط للاستماع).',
      promptAr: dlg.questionAr,
      promptZh: dlg.questionZh,
      options,
      correctOptionId: 'correct',
      correctDisplay: dlg.correctAr,
      meaningAr: `${dlg.lineA.arabic} / ${dlg.lineB.arabic}`,
    };
  });

  const listeningQuestions = [...listeningPartA, ...listeningPartB];

  // =========================================================================
  // القسم الثاني: القراءة والقواعد (20 سؤالاً — 100 درجة)
  // =========================================================================

  // الجزء 2أ: إكمال الفراغ السياقي بدون ترجمة عربية (7 أسئلة)
  const clozeCandidates = shuffleArray(
    allSentences.filter(
      (s) =>
        s.hanzi.includes(s.targetBlank) &&
        Array.isArray(s.blankDistractors) &&
        s.blankDistractors.length >= 3
    )
  ).slice(0, 7);

  const readingPartA: MockExamQuestion[] = clozeCandidates.map((s, idx) => {
    const blanked = s.hanzi.replace(s.targetBlank, ' ____ ');
    const distractors = (s.blankDistractors ?? []).slice(0, 3);
    const options: DrillOption[] = shuffleArray([
      {
        id: 'correct',
        label: s.targetBlank,
        subLabel: pinyinByHanzi.get(s.targetBlank),
        isHanzi: true,
      },
      ...distractors.map((w, i) => ({
        id: `d-${i}`,
        label: w,
        subLabel: pinyinByHanzi.get(w),
        isHanzi: true,
      })),
    ]);

    return {
      id: `mock-r1-${idx + 1}`,
      questionNumber: 21 + idx,
      section: 'reading',
      subPart: 'reading-cloze',
      chapterId: s.chapterId,
      points: 5,
      instructionAr: 'اقرأ الجملة الصينية واختر الكلمة المناسبة لإكمال الفراغ وفق السياق والنحو.',
      sentenceWithBlank: blanked,
      sentenceFullHanzi: s.hanzi,
      sentenceFullPinyin: s.pinyin,
      targetBlank: s.targetBlank,
      audioText: s.hanzi,
      options,
      correctOptionId: 'correct',
      correctDisplay: s.targetBlank,
      correctPinyinDisplay: s.pinyin,
      meaningAr: s.arabic,
    };
  });

  // الجزء 2ب: مطابقة الجمل والرد المنطقي (7 أسئلة)
  const pickedResponses = shuffleArray(LOGICAL_RESPONSE_BANK).slice(0, 7);
  const readingPartB: MockExamQuestion[] = pickedResponses.map((item, idx) => {
    const distractors = shuffleArray(
      LOGICAL_RESPONSE_BANK.filter((other) => other.id !== item.id)
    ).slice(0, 3);

    const options: DrillOption[] = shuffleArray([
      { id: 'correct', label: item.replyZh, subLabel: item.replyPinyin, isHanzi: true },
      ...distractors.map((d, i) => ({
        id: `d-${i}`,
        label: d.replyZh,
        subLabel: d.replyPinyin,
        isHanzi: true,
      })),
    ]);

    return {
      id: `mock-r2-${idx + 1}`,
      questionNumber: 28 + idx,
      section: 'reading',
      subPart: 'reading-response',
      chapterId: item.chapterId,
      points: 5,
      instructionAr: 'اقرأ الجملة أو السؤال الصيني واختر الرد الصيني المنطقي المطابق له.',
      promptZh: item.promptZh,
      promptPinyin: item.promptPinyin,
      audioText: item.promptZh,
      options,
      correctOptionId: 'correct',
      correctDisplay: item.replyZh,
      correctPinyinDisplay: item.replyPinyin,
      meaningAr: `${item.promptAr} ← ${item.replyAr}`,
    };
  });

  // الجزء 2ج: ترتيب الكلمات وبناء الجملة النحوية (6 أسئلة)
  const grammarPool = allSentences.filter(
    (s) => GRAMMAR_REORDER_IDS.has(s.id) && s.segments.length >= 4 && s.segments.length <= 9
  );
  const pickedReorder = shuffleArray(
    grammarPool.length >= 6 ? grammarPool : allSentences.filter((s) => s.segments.length >= 4)
  ).slice(0, 6);

  const readingPartC: MockExamQuestion[] = pickedReorder.map((s, idx) => {
    const tiles = s.segments.map((text, tIdx) => ({
      tileId: `mr-tile-${idx}-${tIdx}`,
      text,
    }));
    let shuffled = shuffleArray(tiles);
    if (shuffled.length > 1 && shuffled.every((t, i) => t.text === s.segments[i])) {
      shuffled = [...shuffled.slice(1), shuffled[0]];
    }

    return {
      id: `mock-r3-${idx + 1}`,
      questionNumber: 35 + idx,
      section: 'reading',
      subPart: 'reading-reorder',
      chapterId: s.chapterId,
      points: 5,
      instructionAr: 'رتّب المقاطع الصينية التالية لتكوين جملة صحيحة نحوياً.',
      promptAr: s.arabic,
      audioText: s.hanzi,
      correctSegments: s.segments,
      shuffledSegments: shuffled,
      correctDisplay: s.hanzi,
      correctPinyinDisplay: s.pinyin,
      meaningAr: s.arabic,
    };
  });

  const readingQuestions = [...readingPartA, ...readingPartB, ...readingPartC];

  return {
    listeningQuestions,
    readingQuestions,
    allQuestions: [...listeningQuestions, ...readingQuestions],
  };
}
