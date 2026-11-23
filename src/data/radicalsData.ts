export interface RadicalItem {
  id: string;
  radical: string;
  pinyin: string;
  meaningAr: string;
  meaningEn: string;
  memoryTipAr: string;
  /** Exact simplified Hanzi characters appearing in our curriculum that contain this radical */
  matchChars: string[];
}

export const HSK_RADICALS_DATA: RadicalItem[] = [
  {
    id: 'rad-ren',
    radical: '亻',
    pinyin: 'rén zì páng',
    meaningAr: 'شخص / إنسان',
    meaningEn: 'Person',
    memoryTipAr:
      'يشبه شخصاً واقفاً بجانبه — يظهر غالباً على يسار الكلمات المرتبطة بالبشر والضمائر والأفعال اليومية مثل 你 و他 و们 و做 و住.',
    matchChars: ['你', '们', '他', '休', '做', '住', '件', '便', '什', '候', '你'],
  },
  {
    id: 'rad-shui',
    radical: '氵',
    pinyin: 'sān diǎn shuǐ',
    meaningAr: 'ماء / سائل',
    meaningEn: 'Water',
    memoryTipAr:
      'ثلاث قطرات ماء متتالية على اليسار — يظهر في الكلمات المتعلقة بالسوائل والجمال واللغة الصينية (汉语) مثل 没 و法 و汉 و漂.',
    matchChars: ['没', '法', '汉', '漂', '泰'],
  },
  {
    id: 'rad-kou',
    radical: '口',
    pinyin: 'kǒu zì páng',
    meaningAr: 'فم / كلام / أكل',
    meaningEn: 'Mouth',
    memoryTipAr:
      'مربع يمثل الفم المفتوح — يظهر في أفعال الأكل والشرب والغناء والنداء وأدوات الاستفهام مثل 吃 و喝 و叫 و唱 و吗 و呢 و吧.',
    matchChars: [
      '口', '叫', '吗', '呢', '吃', '喝', '唱', '听', '问', '吧',
      '喂', '哪', '哥', '同', '喜', '售', '员', '号', '商', '回', '只', '和',
    ],
  },
  {
    id: 'rad-yan',
    radical: '讠',
    pinyin: 'yán zì páng',
    meaningAr: 'كلام / حديث / لغة',
    meaningEn: 'Speech',
    memoryTipAr:
      'نقطة فوق خط يشبه خروج الكلام — يرتبط دائماً بالتحدث والقراءة والدروس واللغة مثل 请 و谢 و说 و话 و认 و识 و读 و课 و谁.',
    matchChars: ['请', '谢', '说', '话', '认', '识', '读', '课', '谁'],
  },
  {
    id: 'rad-nv',
    radical: '女',
    pinyin: 'nǚ zì páng',
    meaningAr: 'امرأة / أنوثة',
    meaningEn: 'Woman',
    memoryTipAr:
      'يمثل هيئة امرأة جالسة — يظهر في قريبات العائلة والضمير 她 وفي كلمة 好 (امرأة + طفل 子 = خير وجودة!).',
    matchChars: ['女', '她', '好', '妈', '姐', '妹', '奶'],
  },
  {
    id: 'rad-mu',
    radical: '木',
    pinyin: 'mù zì páng',
    meaningAr: 'شجر / خشب',
    meaningEn: 'Tree / Wood',
    memoryTipAr:
      'جذع شجرة بفروعها وجذورها — يظهر في الأثاث والمدرسة والفواكه والأكواب مثل 桌 (طاولة) و椅 (كرسي) و杯 (كوب) و校 و果 و本.',
    matchChars: ['桌', '椅', '本', '校', '机', '休', '杯', '样', '果', '来'],
  },
  {
    id: 'rad-ri',
    radical: '日',
    pinyin: 'rì zì páng',
    meaningAr: 'شمس / يوم / وقت',
    meaningEn: 'Sun / Day',
    memoryTipAr:
      'نافذة مستطيلة ترمز لقرص الشمس — يظهر في كل ما يتعلق بالزمن والصباح والمساء والأيام مثل 日 و明 و时 و早 و晚 و星 و昨 و是.',
    matchChars: ['日', '明', '时', '早', '晚', '星', '昨', '是'],
  },
  {
    id: 'rad-yue',
    radical: '月',
    pinyin: 'yuè zì páng',
    meaningAr: 'قمر / شهر / جسم',
    meaningEn: 'Moon / Body',
    memoryTipAr:
      'هلال القمر بخطين داخليين — يدل على الشهور والزمن (月، 期، 明) وكذلك على الصداقة (朋 = قمران معاً) والملابس (服) والعقل (脑).',
    matchChars: ['月', '明', '期', '朋', '脑', '服', '能', '有', '胡'],
  },
  {
    id: 'rad-xin',
    radical: '心 / 忄',
    pinyin: 'xīn zì dǐ / shù xīn',
    meaningAr: 'قلب / شعور / تفكير',
    meaningEn: 'Heart / Mind',
    memoryTipAr:
      'يأتي بصورتين: 心 أسفل الرمز (مثل 您 احترام من القلب، 想 يفكر/يشتاق، 怎، 息) أو 忄 على اليسار (مثل 忙 مشغول: قلب + فقدان).',
    matchChars: ['您', '想', '忙', '怎', '息'],
  },
  {
    id: 'rad-shou',
    radical: '扌',
    pinyin: 'tí shǒu páng',
    meaningAr: 'يد / حركة باليد',
    meaningEn: 'Hand',
    memoryTipAr:
      'صورة مختصرة لليد 手 على يسار الرمز — يدل على الأفعال التي تُنفّذ باليد مثل 打 (يتصل/يضرب) و找 (يبحث) و接 (يستقبل/يمسك).',
    matchChars: ['打', '找', '接', '手'],
  },
  {
    id: 'rad-zouzhi',
    radical: '辶',
    pinyin: 'zǒu zhī páng',
    meaningAr: 'مشي / حركة / طريق',
    meaningEn: 'Walk / Path',
    memoryTipAr:
      'يشبه قارباً أو طريقاً طويلاً يحمل الرمز فوقه — يدل على الجهة والانتقال والطريق مثل 这 و边 و还 و道.',
    matchChars: ['这', '边', '还', '道'],
  },
  {
    id: 'rad-baogai',
    radical: '宀',
    pinyin: 'bǎo gài tóu',
    meaningAr: 'سقف / بيت / مأوى',
    meaningEn: 'Roof / House',
    memoryTipAr:
      'يشبه سقف المنزل فوق الرمز — يظهر في كلمات البيت والأمان والضيافة والكتابة مثل 家 (بيت) و客 (ضيف) و安 (أمان) و宜 و字 و它.',
    matchChars: ['家', '客', '安', '宜', '字', '它'],
  },
  {
    id: 'rad-shi',
    radical: '饣',
    pinyin: 'shí zì páng',
    meaningAr: 'طعام / وجبة',
    meaningEn: 'Food / Eat',
    memoryTipAr:
      'صورة مبسّطة لوعاء الطعام — بمجرد رؤيته على يسار الرمز اعرف أنه مرتبط بالأكل والمطاعم مثل 饭 (وجبة/أرز/مطعم) و饺 (زلابية جياوتسي).',
    matchChars: ['饭', '饺'],
  },
  {
    id: 'rad-mu-eye',
    radical: '目',
    pinyin: 'mù zì páng',
    meaningAr: 'عين / نظر / نوم',
    meaningEn: 'Eye',
    memoryTipAr:
      'يشبه عيناً بثلاثة خطوط أفقية — يظهر في أفعال الرؤية والنوم والحقيقة مثل 看 (يد 手 فوق عين 目 = ينظر!) و睡 (ينام) و真 (حقيقي).',
    matchChars: ['看', '睡', '真'],
  },
  {
    id: 'rad-che',
    radical: '车',
    pinyin: 'chē zì páng',
    meaningAr: 'مركبة / سيارة / عربة',
    meaningEn: 'Vehicle',
    memoryTipAr:
      'يمثل عربة بعجلتين ومحور — يظهر في جميع وسائل النقل البرية بالمنهج مثل 车 و开车 و出租车 (تاكسي) و火车 (قطار).',
    matchChars: ['车'],
  },
  {
    id: 'rad-men',
    radical: '门',
    pinyin: 'mén zì kuàng',
    meaningAr: 'باب / مدخل',
    meaningEn: 'Gate / Door',
    memoryTipAr:
      'يشبه باباً بمصراعين — لاحظ الذكاء الصيني: فم 口 داخل باب 门 = 问 (يسأل)، وشمس 日 داخل باب 门 = 间 (غرفة / وقت)!',
    matchChars: ['问', '间', '们'],
  },
  {
    id: 'rad-cao',
    radical: '艹',
    pinyin: 'cǎo zì tóu',
    meaningAr: 'نبات / عشب / خضار',
    meaningEn: 'Grass / Plant',
    memoryTipAr:
      'نبتتان صغيرتان أعلى الرمز — يظهر فوق كل ما أصله نباتي أو أعشاب مثل 菜 (خضار/طبق) و茶 (شاي) و苹 (تفاح) و药 (دواء عشبي).',
    matchChars: ['菜', '茶', '苹', '药'],
  },
  {
    id: 'rad-yu',
    radical: '雨',
    pinyin: 'yǔ zì tóu',
    meaningAr: 'مطر / ظواهر جوية',
    meaningEn: 'Rain / Weather',
    memoryTipAr:
      'سحابة تسقط منها أربع قطرات مطر — يظهر في الظواهر الجوية مثل 雨 (مطر) و下雨 (تمطر) و雪 (ثلج).',
    matchChars: ['雨', '雪'],
  },
  {
    id: 'rad-bei',
    radical: '贝',
    pinyin: 'bèi zì páng',
    meaningAr: 'مال / تجارة / قيمة',
    meaningEn: 'Shell / Wealth',
    memoryTipAr:
      'في الصين القديمة استُخدمت الأصداف (贝) كعملة — لذلك يظهر هذا الجذر في التجارة والأسعار مثل 贵 (غالٍ) و买 (يشتري) و卖 (يبيع) و货 و员.',
    matchChars: ['贵', '买', '卖', '货', '员'],
  },
  {
    id: 'rad-zu',
    radical: '足 / 走',
    pinyin: 'zú / zǒu zì dǐ',
    meaningAr: 'قدم / مشي / نهوض',
    meaningEn: 'Foot / Stepping',
    memoryTipAr:
      'يرتبط جذرا 足 (قدم) و走 (مشي/نهوض) بالحركة بالقدمين والانطلاق — يظهر في المنهج في 起 (起床 يستيقظ، 对不起 آسف) و超 (超市 سوبر ماركت).',
    matchChars: ['足', '起', '超', '路', '跑'],
  },
];
