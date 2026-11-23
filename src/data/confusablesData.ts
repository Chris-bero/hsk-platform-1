export type ConfusableCategory = 'visual-phonetic' | 'grammar-trap';

export interface ConfusableItem {
  hanzi: string;
  pinyin: string;
  meaningAr: string;
  hintAr?: string;
  /** نص مخصص للنطق الصوتي إذا اختلف عن العرض */
  audioText?: string;
}

export interface ConfusableExample {
  hanzi: string;
  pinyin: string;
  arabic: string;
}

export interface ConfusableGroup {
  id: string;
  category: ConfusableCategory;
  number: number;
  titleAr: string;
  chapterRef: string;
  items: ConfusableItem[];
  trapTipAr: string;
  examples: ConfusableExample[];
}

export interface ConfusableQuizQuestion {
  id: string;
  groupId: string;
  category: ConfusableCategory;
  promptZh: string;
  promptPinyin: string;
  promptAr: string;
  options: { hanzi: string; pinyin: string }[];
  correctIndex: number;
  explanationAr: string;
}

export const CONFUSABLE_GROUPS_DATA: ConfusableGroup[] = [
  // =========================================================================
  // القسم أ: المتشابهات الشكلية والصوتية (10 مجموعات أساسية)
  // =========================================================================
  {
    id: 'vp-1-da-tai-tian',
    category: 'visual-phonetic',
    number: 1,
    titleAr: 'كبير · جداً / للغاية · يوم / سماء',
    chapterRef: 'الفصول 2، 4، 11',
    items: [
      { hanzi: '大', pinyin: 'dà', meaningAr: 'كبير (في الحجم أو العمر)', hintAr: 'بدون نقطة أو شرطة علوية' },
      { hanzi: '太', pinyin: 'tài', meaningAr: 'جداً / للغاية (غالباً مع 了)', hintAr: 'نقطة أسفل 大' },
      { hanzi: '天', pinyin: 'tiān', meaningAr: 'يوم / سماء / طقس', hintAr: 'شرطة أفقية فوق 大' },
    ],
    trapTipAr:
      'الفرق البصري دقيق جداً: 大 أصل الشكل، إضافة نقطة سفلية تحولها إلى 太 (للغاية)، وإضافة خط أفقي فوقها كالسماء تحولها إلى 天 (سماء/يوم).',
    examples: [
      { hanzi: '今天天气太冷了！', pinyin: 'Jīntiān tiānqì tài lěng le!', arabic: 'طقس اليوم بارد جداً!' },
      { hanzi: '这个苹果很大。', pinyin: 'Zhège píngguǒ hěn dà.', arabic: 'هذه التفاحة كبيرة جداً.' },
    ],
  },
  {
    id: 'vp-2-mai-mai',
    category: 'visual-phonetic',
    number: 2,
    titleAr: 'يشتري · يبيع (فخ النغمة والشكل)',
    chapterRef: 'الفصل 9',
    items: [
      { hanzi: '买', pinyin: 'mǎi', meaningAr: 'يشتري', hintAr: 'النغمة الثالثة (mǎi) — بدون 十 في الأعلى' },
      { hanzi: '卖', pinyin: 'mài', meaningAr: 'يبيع', hintAr: 'النغمة الرابعة (mài) — فوقها علامة 十 (كأن التاجر لديه فائض للبيع)' },
    ],
    trapTipAr:
      'من أشهر فخاخ الاستماع والقراءة في HSK! تذكّر: البائع 卖 لديه بضاعة زائدة (علامة 十 في الأعلى) ونغمته الرابعة السريعة mài، بينما المشتري 买 ليس فوقه 十 ونغمته الثالثة mǎi.',
    examples: [
      { hanzi: '我想买两斤苹果。', pinyin: 'Wǒ xiǎng mǎi liǎng jīn píngguǒ.', arabic: 'أريد أن أشتري رطلين من التفاح.' },
      { hanzi: '这个商店卖水果。', pinyin: 'Zhège shāngdiàn mài shuǐguǒ.', arabic: 'هذا المتجر يبيع الفاكهة.' },
    ],
  },
  {
    id: 'vp-3-na-na',
    category: 'visual-phonetic',
    number: 3,
    titleAr: 'أيّ (للسؤال) · ذلك (للإشارة)',
    chapterRef: 'الفصول 2، 7، 8',
    items: [
      { hanzi: '哪', pinyin: 'nǎ', meaningAr: 'أيّ؟ / أين (مع 儿)', hintAr: 'يبدأ بجذر الفم 口 لأننا نسأل بفمنا — نغمة ثالثة' },
      { hanzi: '那', pinyin: 'nà', meaningAr: 'ذلك / تلك / هناك (مع 儿)', hintAr: 'بدون جذر الفم 口 — نغمة رابعة' },
    ],
    trapTipAr:
      'إذا وجدت جذر الفم 口 على اليسار فالجملة استفهامية (哪国人؟ / 哪儿؟). أما بدون 口 فهي للإشارة البعيدة (那个人 / 那儿).',
    examples: [
      { hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', arabic: 'من أي بلد أنت؟' },
      { hanzi: '那个人是我的老师。', pinyin: 'Nàge rén shì wǒ de lǎoshī.', arabic: 'ذلك الشخص هو معلمي.' },
    ],
  },
  {
    id: 'vp-4-ren-ba',
    category: 'visual-phonetic',
    number: 4,
    titleAr: 'إنسان · رقم ثمانية',
    chapterRef: 'الفصول 2، 3',
    items: [
      { hanzi: '人', pinyin: 'rén', meaningAr: 'إنسان / شخص', hintAr: 'الخطان ملتصقان معاً من الأعلى' },
      { hanzi: '八', pinyin: 'bā', meaningAr: 'ثمانية (8)', hintAr: 'الخطان منفصلان تماماً بمسافة واضحة في الأعلى' },
    ],
    trapTipAr:
      'في رمز 人 (إنسان) يتصل الخطان مثل شخص يقف على قدميه، أما في رقم 八 (ثمانية) فالخطان متباعدان ومفتوحان من الأعلى.',
    examples: [
      { hanzi: '我家有八个人。', pinyin: 'Wǒ jiā yǒu bā ge rén.', arabic: 'في عائلتي ثمانية أشخاص.' },
      { hanzi: '现在八点了。', pinyin: 'Xiànzài bā diǎn le.', arabic: 'الساعة الآن الثامنة.' },
    ],
  },
  {
    id: 'vp-5-wu-niu',
    category: 'visual-phonetic',
    number: 5,
    titleAr: 'الظهر (وقت) · بقرة / حليب',
    chapterRef: 'الفصول 4، 6، 9',
    items: [
      { hanzi: '午', pinyin: 'wǔ', meaningAr: 'الظهر (上午 / 中午 / 下午)', hintAr: 'الخط العمودي لا يخترق الخط الأفقي العلوي', audioText: '中午' },
      { hanzi: '牛', pinyin: 'niú', meaningAr: 'بقرة (牛奶 حليب)', hintAr: 'الخط العمودي يخترق للأعلى مثل قرن البقرة', audioText: '牛奶' },
    ],
    trapTipAr:
      'انتبه لرأس الخط العمودي: في 牛 (بقرة) يبرز الخط العمودي للأعلى كقرن البقرة، أما في 午 (أوقات النهار: 上午 صباحاً، 中午 ظهراً، 下午 عصراً) فيتوقف عند الخط الأفقي.',
    examples: [
      { hanzi: '我上午喝一杯牛奶。', pinyin: 'Wǒ shàngwǔ hē yì bēi niúnǎi.', arabic: 'أشرب كوباً من الحليب في الصباح.' },
      { hanzi: '中午十二点我们吃饭。', pinyin: 'Zhōngwǔ shí’èr diǎn wǒmen chīfàn.', arabic: 'نتناول الغداء الساعة الثانية عشرة ظهراً.' },
    ],
  },
  {
    id: 'vp-6-wen-jian',
    category: 'visual-phonetic',
    number: 6,
    titleAr: 'يسأل / سؤال · وقت / غرفة (داخل البوابة 门)',
    chapterRef: 'الفصول 4، 8، 12',
    items: [
      { hanzi: '问', pinyin: 'wèn', meaningAr: 'يسأل (请问 / 问题)', hintAr: 'فم 口 داخل البوابة 门 ← تسأل عند الباب', audioText: '问题' },
      { hanzi: '间', pinyin: 'jiān', meaningAr: 'مساحة / وقت (时间 / 房间)', hintAr: 'شمس 日 داخل البوابة 门 ← ضوء الشمس يدل على الوقت والمكان', audioText: '时间' },
    ],
    trapTipAr:
      'كلا الرمزين يحيط بهما جذر البوابة 门، لكن ما بالداخل يحسم المعنى: الفم 口 يعني السؤال (问)، والشمس 日 تعني الوقت والمكان (时间 / 房间).',
    examples: [
      { hanzi: '请问，你现在有时间吗？', pinyin: 'Qǐngwèn, nǐ xiànzài yǒu shíjiān ma?', arabic: 'لو سمحت، هل لديك وقت الآن؟' },
      { hanzi: '我有一个问题想问老师。', pinyin: 'Wǒ yǒu yí ge wèntí xiǎng wèn lǎoshī.', arabic: 'لديّ سؤال أريد أن أسأله للمعلم.' },
    ],
  },
  {
    id: 'vp-7-ri-yue',
    category: 'visual-phonetic',
    number: 7,
    titleAr: 'يوم / شمس · شهر / قمر',
    chapterRef: 'الفصل 4',
    items: [
      { hanzi: '日', pinyin: 'rì', meaningAr: 'يوم (في التواريخ) / شمس', hintAr: 'مستطيل مغلق وفي وسطه خط واحد فقط' },
      { hanzi: '月', pinyin: 'yuè', meaningAr: 'شهر / قمر', hintAr: 'مفتوح من الأسفل مع خطين بالداخل وذيل معقوف يميناً' },
    ],
    trapTipAr:
      'في كتابة التواريخ الصينية يسبق الشهر اليوم دائماً (月 ثم 日 / 号): مثلاً 5月10日 تعني العاشر من مايو وليس الخامس من أكتوبر!',
    examples: [
      { hanzi: '今天是三月八日。', pinyin: 'Jīntiān shì sānyuè bārì.', arabic: 'اليوم هو الثامن من مارس.' },
      { hanzi: '你的生日是几月几号？', pinyin: 'Nǐ de shēngrì shì jǐ yuè jǐ hào?', arabic: 'في أي شهر وأي يوم عيد ميلادك؟' },
    ],
  },
  {
    id: 'vp-8-shang-xia',
    category: 'visual-phonetic',
    number: 8,
    titleAr: 'فوق / يبدأ · تحت / ينهي',
    chapterRef: 'الفصول 4، 7، 8',
    items: [
      { hanzi: '上', pinyin: 'shàng', meaningAr: 'فوق / صباح / يبدأ (上课 / 上午 / 桌子上面)', hintAr: 'الخطوط تتجه للأعلى فوق القاعدة' },
      { hanzi: '下', pinyin: 'xià', meaningAr: 'تحت / عصر / ينهي / قادم (下课 / 下午 / 下雨)', hintAr: 'الخطوط تتدلى للأسفل تحت السقف' },
    ],
    trapTipAr:
      'فخ شائع في المواعيد: 上 تعني السابق في الأسابيع والأشهر (上个月 الشهر الماضي)، بينما 下 تعني القادم (下个星期 الأسبوع القادم) — عكس ما يتوقعه المبتدئون!',
    examples: [
      { hanzi: '书在桌子上，猫在桌子下。', pinyin: 'Shū zài zhuōzi shàng, māo zài zhuōzi xià.', arabic: 'الكتاب فوق الطاولة، والقطة تحت الطاولة.' },
      { hanzi: '我们上午八点上课，十二点下课。', pinyin: 'Wǒmen shàngwǔ bā diǎn shàngkè, shí’èr diǎn xiàkè.', arabic: 'نبدأ الحصة الثامنة صباحاً وننهيها الثانية عشرة.' },
    ],
  },
  {
    id: 'vp-9-er-ji',
    category: 'visual-phonetic',
    number: 9,
    titleAr: 'ابن / لاحقة نطق · كم (للسؤال)',
    chapterRef: 'الفصول 3، 5، 7',
    items: [
      { hanzi: '儿', pinyin: 'ér', meaningAr: 'ابن / لاحقة (儿子 / 哪儿 / 一点儿)', hintAr: 'الخطان منفصلان من الأعلى تماماً', audioText: '儿子' },
      { hanzi: '几', pinyin: 'jǐ', meaningAr: 'كم (للعدد القليل) / بضعة', hintAr: 'الخطان متصلان بسقف أفقي في الأعلى' },
    ],
    trapTipAr:
      'يخلط كثير من الطلاب بين 儿 و 几 عند القراءة السريعة: رمز 几 (كم) مغلق من الأعلى كطاولة صغيرة، أما 儿 فمفتوح من الأعلى.',
    examples: [
      { hanzi: '你儿子今年几岁了？', pinyin: 'Nǐ érzi jīnnián jǐ suì le?', arabic: 'كم عمر ابنك هذه السنة؟' },
      { hanzi: '你去哪儿？', pinyin: 'Nǐ qù nǎr?', arabic: 'إلى أين أنت ذاهب؟' },
    ],
  },
  {
    id: 'vp-10-kan-ting',
    category: 'visual-phonetic',
    number: 10,
    titleAr: 'فعل المحاولة مقابل نتيجة الإدراك (看/看见 · 听/听见)',
    chapterRef: 'الفصول 6، 10، 13',
    items: [
      { hanzi: '看', pinyin: 'kàn', meaningAr: 'ينظر / يشاهد / يقرأ (الفعل فقط)', hintAr: 'لا يشترط تحقق الرؤية' },
      { hanzi: '看见', pinyin: 'kànjiàn', meaningAr: 'يرى (نتيجة: وقعت عيناه عليه)', hintAr: 'فعل + مكمل النتيجة 见' },
      { hanzi: '听', pinyin: 'tīng', meaningAr: 'يستمع / ينصت (الفعل فقط)', hintAr: 'لا يشترط وصول الصوت بوضوح' },
      { hanzi: '听见', pinyin: 'tīngjiàn', meaningAr: 'يسمع (نتيجة: وصله الصوت)', hintAr: 'فعل + مكمل النتيجة 见' },
    ],
    trapTipAr:
      'في الامتحان: نستخدم 看 مع الكتب والتلفاز (看书 / 看电视)، أما عند الحديث عن «رأيتُ شخصاً أو لم أره» فنستخدم 看见 / 没看见. وكذلك 听音乐 (يستمع للموسيقى) مقابل 没听见 (لم أسمع).',
    examples: [
      { hanzi: '我没看见王老师。', pinyin: 'Wǒ méi kànjiàn Wáng lǎoshī.', arabic: 'لم أرَ المعلم وانغ.' },
      { hanzi: '我在听音乐，没听见你说话。', pinyin: 'Wǒ zài tīng yīnyuè, méi tīngjiàn nǐ shuōhuà.', arabic: 'كنت أستمع للموسيقى، فلم أسمعك تتكلم.' },
    ],
  },

  // =========================================================================
  // القسم ب: فخاخ القواعد والاستخدام (10 فخاخ امتحانية متكررة)
  // =========================================================================
  {
    id: 'gt-1-bu-mei',
    category: 'grammar-trap',
    number: 1,
    titleAr: 'النفي بـ 不 مقابل النفي بـ 没',
    chapterRef: 'الفصول 1، 5، 10',
    items: [
      { hanzi: '不', pinyin: 'bù', meaningAr: 'نفي المضارع والعادات والمستقبل والصفات وفعل 是', hintAr: 'لا يُستخدم أبداً مع 有' },
      { hanzi: '没', pinyin: 'méi', meaningAr: 'نفي الماضي (لم يحدث) ونفي الملكية 没有', hintAr: 'يُحذف 了 عند النفي بـ 没' },
    ],
    trapTipAr:
      'فخّان مضمونان في كل امتحان: (1) لا تقل أبداً *不有 بل دائماً 没有. (2) عند نفي حدث ماضٍ بـ 没 يجب حذف 了: نقول 昨天我没去 (وليس *没去了).',
    examples: [
      { hanzi: '昨天我没去学校，明天我也不去。', pinyin: 'Zuótiān wǒ méi qù xuéxiào, míngtiān wǒ yě bú qù.', arabic: 'أمس لم أذهب إلى المدرسة، وغداً أيضاً لن أذهب.' },
      { hanzi: '我没有哥哥，也不是老师。', pinyin: 'Wǒ méiyǒu gēge, yě bú shì lǎoshī.', arabic: 'ليس لديّ أخ أكبر، ولستُ معلماً أيضاً.' },
    ],
  },
  {
    id: 'gt-2-er-liang',
    category: 'grammar-trap',
    number: 2,
    titleAr: 'الرقم اثنان: 二 مقابل 两',
    chapterRef: 'الفصول 3، 4، 9',
    items: [
      { hanzi: '二', pinyin: 'èr', meaningAr: 'للعدّ، الأرقام المركبة، التواريخ، والترتيب', hintAr: '十二، 二十، 二月، 第二' },
      { hanzi: '两', pinyin: 'liǎng', meaningAr: 'قبل كلمات الكمية وعند قراءة الساعة الثانية', hintAr: '两个人، 两点، 两本书، 两百' },
    ],
    trapTipAr:
      'قاعدة ذهبية: إذا جاء بعد الرقم كلمة كمية (个، 本، 杯، 块، 点) نستخدم 两 (مثل: 两点 الساعة الثانية، 两个苹果 تفاحتان). أما في الأرقام 12 و20 والتواريخ والترتيب فنستخدم 二 دائماً.',
    examples: [
      { hanzi: '现在两点，我要买两杯茶。', pinyin: 'Xiànzài liǎng diǎn, wǒ yào mǎi liǎng bēi chá.', arabic: 'الساعة الآن الثانية، أريد شراء كوبين من الشاي.' },
      { hanzi: '二月十二号我二十二岁。', pinyin: 'Èryuè shí’èr hào wǒ èrshí’èr suì.', arabic: 'في الثاني عشر من فبراير أبلغ الثانية والعشرين.' },
    ],
  },
  {
    id: 'gt-3-youdianr-yidianr',
    category: 'grammar-trap',
    number: 3,
    titleAr: 'قليلاً: 有点儿 مقابل 一点儿',
    chapterRef: 'الفصول 9، 11، 13',
    items: [
      { hanzi: '有点儿', pinyin: 'yǒudiǎnr', meaningAr: 'قليلاً (قبل الصفة، وغالباً لمعنى سلبي أو غير مرغوب)', hintAr: 'الموقع: 有点儿 + صفة' },
      { hanzi: '一点儿', pinyin: 'yìdiǎnr', meaningAr: 'قليلاً من (بعد الفعل وقبل الاسم، أو بعد الصفة للمقارنة)', hintAr: 'الموقع: فعل + 一点儿 + اسم' },
    ],
    trapTipAr:
      'انظر لموقع الفراغ في الجملة! إذا كان الفراغ «قبل» الصفة (___贵، ___冷، ___累) فالحل 有点儿. وإذا كان «بعد» الفعل (喝___水، 会说___汉语) فالحل 一点儿.',
    examples: [
      { hanzi: '这件衣服有点儿贵。', pinyin: 'Zhè jiàn yīfu yǒudiǎnr guì.', arabic: 'هذه القطعة من الملابس غالية قليلاً.' },
      { hanzi: '我会说一点儿汉语。', pinyin: 'Wǒ huì shuō yìdiǎnr Hànyǔ.', arabic: 'أستطيع التحدث بقليل من اللغة الصينية.' },
    ],
  },
  {
    id: 'gt-4-hui-neng-keyi',
    category: 'grammar-trap',
    number: 4,
    titleAr: 'أفعال القدرة والاستئذان: 会 · 能 · 可以',
    chapterRef: 'الفصول 6، 10، 12',
    items: [
      { hanzi: '会', pinyin: 'huì', meaningAr: 'مهارة مكتسبة بالتعلّم (أو احتمال مستقبلي)', hintAr: '会说汉语 / 会做饭 / 会下雨' },
      { hanzi: '能', pinyin: 'néng', meaningAr: 'القدرة الجسدية أو الظروف المواتية', hintAr: 'مريض لا يستطيع الذهاب: 不能去' },
      { hanzi: '可以', pinyin: 'kěyǐ', meaningAr: 'الاستئذان أو السماح (هل يُسمح لي؟)', hintAr: '我可以坐这儿吗？' },
    ],
    trapTipAr:
      'فرّق بينها بسرعة: المهارات المتعلَّمة (الطبخ، السباحة، اللغات) تأخذ 会. الظروف/المرض/الوقت تأخذ 能. طلب الإذن أو السماح يأخذ 可以.',
    examples: [
      { hanzi: '我会写汉字，但是今天手疼不能写。', pinyin: 'Wǒ huì xiě Hànzì, dànshì jīntiān shǒu téng bù néng xiě.', arabic: 'أجيد كتابة الرموز الصينية، لكن يدي تؤلمني اليوم فلا أستطيع الكتابة.' },
      { hanzi: '请问，我可以坐在这儿吗？', pinyin: 'Qǐngwèn, wǒ kěyǐ zuò zài zhèr ma?', arabic: 'لو سمحت، هل يمكنني الجلوس هنا؟' },
    ],
  },
  {
    id: 'gt-5-xiang-yao',
    category: 'grammar-trap',
    number: 5,
    titleAr: 'الرغبة مقابل الإرادة والطلب: 想 مقابل 要',
    chapterRef: 'الفصول 6، 9، 14',
    items: [
      { hanzi: '想', pinyin: 'xiǎng', meaningAr: 'يرغب / يودّ (أكثر لطفاً وتعبّر عن رغبة ذهنية)', hintAr: 'النفي: 不想 (لا أرغب)' },
      { hanzi: '要', pinyin: 'yào', meaningAr: 'يريد بقوة / يطلب في مطعم أو متجر / سوف', hintAr: 'عند الطلب المباشر + اسم: 我要一杯茶' },
    ],
    trapTipAr:
      'انتبه للنفي! نفي 要 (أريد أن أفعل) هو 不想 وليس 不要 — لأن 不要 تعني «إياك / لا تفعل» (للنهي)، مثل 不要说话 (لا تتكلم!). كما أن 要 تأتي مباشرة قبل الأسماء عند الطلب (我要米饭) بينما 想 تحتاج فعلاً (我想吃米饭).',
    examples: [
      { hanzi: '我想去中国学习汉语。', pinyin: 'Wǒ xiǎng qù Zhōngguó xuéxí Hànyǔ.', arabic: 'أودّ الذهاب إلى الصين لتعلّم اللغة الصينية.' },
      { hanzi: '服务员，我要一碗面条。', pinyin: 'Fúwùyuán, wǒ yào yì wǎn miàntiáo.', arabic: 'يا نادل، أريد وعاءً من المعكرونة.' },
    ],
  },
  {
    id: 'gt-6-zenme-zenmeyang',
    category: 'grammar-trap',
    number: 6,
    titleAr: 'كيف (الطريقة) مقابل ما رأيك / كيف الحال: 怎么 · 怎么样',
    chapterRef: 'الفصول 7، 11، 13',
    items: [
      { hanzi: '怎么', pinyin: 'zěnme', meaningAr: 'كيف؟ (تأتي قبل الفعل للسؤال عن الطريقة أو السبب)', hintAr: '怎么去؟ / 怎么读؟ / 怎么了؟' },
      { hanzi: '怎么样', pinyin: 'zěnmeyàng', meaningAr: 'كيف حال / ما رأيك في...؟ (تأتي في نهاية الجملة)', hintAr: '天气怎么样؟ / 这本书怎么样؟' },
    ],
    trapTipAr:
      'مفتاح الحل الفوري في الامتحان: إذا جاء بعد الفراغ فعل (___走، ___写، ___去) اختر 怎么 دائماً. وإذا كان الفراغ في نهاية الجملة للسؤال عن رأي أو حال اختر 怎么样.',
    examples: [
      { hanzi: '请问，去火车站怎么走？', pinyin: 'Qǐngwèn, qù huǒchēzhàn zěnme zǒu?', arabic: 'لو سمحت، كيف أصل إلى محطة القطار؟' },
      { hanzi: '北京的天气怎么样？', pinyin: 'Běijīng de tiānqì zěnmeyàng?', arabic: 'كيف حال الطقس في بكين؟' },
    ],
  },
  {
    id: 'gt-7-ji-duoshao',
    category: 'grammar-trap',
    number: 7,
    titleAr: 'السؤال عن العدد: 几 مقابل 多少',
    chapterRef: 'الفصول 3، 5، 9',
    items: [
      { hanzi: '几', pinyin: 'jǐ', meaningAr: 'كم؟ (للأعداد الصغيرة أقل من 10 غالباً، وتلزمها كلمة كمية)', hintAr: '几口人 / 几个苹果 / 几点' },
      { hanzi: '多少', pinyin: 'duōshao', meaningAr: 'كم؟ (لأي عدد كبير أو غير معروف، وتُستخدم مع الأسعار والهواتف)', hintAr: '多少钱 / 多少学生' },
    ],
    trapTipAr:
      'قاعدتان سريعتان: (1) للسؤال عن السعر نستخدم 多少钱 دائماً وليس *几钱. (2) مع 几 يجب وجود كلمة كمية (مثل 几本书)، أما مع 多少 فيجوز حذف كلمة الكمية (多少学生).',
    examples: [
      { hanzi: '你们班有多少学生？', pinyin: 'Nǐmen bān yǒu duōshao xuésheng?', arabic: 'كم طالباً في صفكم؟' },
      { hanzi: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?', arabic: 'كم فرداً في عائلتك؟' },
    ],
  },
  {
    id: 'gt-8-le1-le2',
    category: 'grammar-trap',
    number: 8,
    titleAr: 'مواضع الأداة 了: نهاية الجملة (التغيّر) مقابل بعد الفعل (تمام الحدث)',
    chapterRef: 'الفصول 10، 11، 15',
    items: [
      { hanzi: '了 (نهاية الجملة)', pinyin: 'le', meaningAr: 'تدل على حدوث تغيّر جديد في الحالة أو الوقت', hintAr: '下雨了 / 太冷了 / 八点了', audioText: '下雨了' },
      { hanzi: 'فعل + 了 + عدد + اسم', pinyin: 'V + le + O', meaningAr: 'تدل على تمام واكتمال الفعل نفسه (خاصة مع مفعول محدد)', hintAr: '买了三本书 / 喝了一杯茶', audioText: '买了三本书' },
    ],
    trapTipAr:
      'إذا كان المفعول محدداً بعدد أو وصف (三本书 / 一杯咖啡) ضع 了 مباشرة بعد الفعل (买了三本书). أما عند وصف تغيّر حالة (أصبح بارداً، بدأ المطر) فضع 了 في نهاية الجملة.',
    examples: [
      { hanzi: '天气冷了，快多穿点儿衣服。', pinyin: 'Tiānqì lěng le, kuài duō chuān diǎnr yīfu.', arabic: 'أصبح الطقس بارداً، ارتدِ ملابس أثقل بسرعة.' },
      { hanzi: '昨天我在书店买了两本书。', pinyin: 'Zuótiān wǒ zài shūdiàn mǎi le liǎng běn shū.', arabic: 'أمس اشتريتُ كتابين من المكتبة.' },
    ],
  },
  {
    id: 'gt-9-doubu-budou',
    category: 'grammar-trap',
    number: 9,
    titleAr: 'النفي الكلي مقابل النفي الجزئي: 都不 / 都没 · 不都 / 没都',
    chapterRef: 'الفصول 2، 10، 15',
    items: [
      { hanzi: '都不 / 都没', pinyin: 'dōu bù / dōu méi', meaningAr: 'نفي كلي: ولا واحد منهم (الجميع لا...)', hintAr: '都 تأتي أولاً ← نفي شامل 100%', audioText: '都不' },
      { hanzi: '不都 / 没都', pinyin: 'bù dōu / méi dōu', meaningAr: 'نفي جزئي: ليس الجميع (بعضهم نعم وبعضهم لا)', hintAr: '不 تأتي أولاً ← بعضهم فقط', audioText: '不都' },
    ],
    trapTipAr:
      'فخ فهم المقروء الشهير في HSK! قارن جيداً: 我们都不是中国人 (ولا واحد منا صيني)، بينما 我们不都是中国人 (ليس كلنا صينيين؛ أي بعضنا صيني وبعضنا غير صيني).',
    examples: [
      { hanzi: '这些书我都还没看。', pinyin: 'Zhèxiē shū wǒ dōu hái méi kàn.', arabic: 'لم أقرأ أياً من هذه الكتب بعد (نفي كلي).' },
      { hanzi: '他们不都是大学生。', pinyin: 'Tāmen bù dōu shì dàxuéshēng.', arabic: 'ليس جميعهم طلاباً جامعيين (بعضهم فقط).' },
    ],
  },
  {
    id: 'gt-10-zhengzai-le',
    category: 'grammar-trap',
    number: 10,
    titleAr: 'الاستمرار مقابل الانتهاء: 在 / 正在...呢 · فعل + 了',
    chapterRef: 'الفصول 10، 13، 14',
    items: [
      { hanzi: '在 / 正在 + فعل + 呢', pinyin: 'zài / zhèngzài ... ne', meaningAr: 'الحدث مستمر الآن (المضارع المستمر)', hintAr: 'لا تُستخدم أبداً مع 了 في نفس الفعل', audioText: '正在学习呢' },
      { hanzi: 'فعل + 了', pinyin: 'V + le', meaningAr: 'الحدث انتهى واكتمل بالفعل', hintAr: 'تدل على الإنجاز وليس الاستمرار', audioText: '吃了饭' },
    ],
    trapTipAr:
      'تنبيه امتحاني حاسم: لا يجتمع في الفعل الواحد علامة الاستمرار 正在/呢 مع علامة الاكتمال 了! إذا رأيت 正在 أو 呢 في الجملة فالحدث ما زال جارياً الآن.',
    examples: [
      { hanzi: '妈妈正在做饭呢。', pinyin: 'Māma zhèngzài zuòfàn ne.', arabic: 'أمي تطبخ الطعام الآن (الحدث مستمر).' },
      { hanzi: '妈妈做好饭了。', pinyin: 'Māma zuòhǎo fàn le.', arabic: 'انتهت أمي من طهي الطعام (الحدث اكتمل).' },
    ],
  },
];

export const CONFUSABLES_QUIZ_QUESTIONS: ConfusableQuizQuestion[] = [
  {
    id: 'cq-1',
    groupId: 'vp-2-mai-mai',
    category: 'visual-phonetic',
    promptZh: '我想去水果店____两斤苹果。',
    promptPinyin: 'Wǒ xiǎng qù shuǐguǒdiàn ____ liǎng jīn píngguǒ.',
    promptAr: 'أريد الذهاب إلى متجر الفاكهة لـ(شراء) رطلين من التفاح.',
    options: [
      { hanzi: '买', pinyin: 'mǎi' },
      { hanzi: '卖', pinyin: 'mài' },
      { hanzi: '读', pinyin: 'dú' },
    ],
    correctIndex: 0,
    explanationAr: 'الصحيح هو 买 (mǎi) بمعنى «يشتري» بدون علامة 十 في الأعلى، أما 卖 (mài) فتعني «يبيع».',
  },
  {
    id: 'cq-2',
    groupId: 'vp-3-na-na',
    category: 'visual-phonetic',
    promptZh: '请问，你是____国人？',
    promptPinyin: 'Qǐngwèn, nǐ shì ____ guó rén?',
    promptAr: 'لو سمحت، من (أيّ) بلد أنت؟',
    options: [
      { hanzi: '那', pinyin: 'nà' },
      { hanzi: '哪', pinyin: 'nǎ' },
      { hanzi: '呢', pinyin: 'ne' },
    ],
    correctIndex: 1,
    explanationAr: 'لأن الجملة استفهامية نختار 哪 (nǎ) التي تبدأ بجذر الفم 口 على اليسار، بينما 那 (nà) للإشارة البعيدة.',
  },
  {
    id: 'cq-3',
    groupId: 'vp-1-da-tai-tian',
    category: 'visual-phonetic',
    promptZh: '今天的天气____热了！',
    promptPinyin: 'Jīntiān de tiānqì ____ rè le!',
    promptAr: 'طقس اليوم حار (جداً / للغاية)!',
    options: [
      { hanzi: '大', pinyin: 'dà' },
      { hanzi: '天', pinyin: 'tiān' },
      { hanzi: '太', pinyin: 'tài' },
    ],
    correctIndex: 2,
    explanationAr: 'الصيغة 太 + صفة + 了 تعني «جداً / للغاية»، وتتميز بوجود نقطة في أسفل الرمز 太.',
  },
  {
    id: 'cq-4',
    groupId: 'vp-5-wu-niu',
    category: 'visual-phonetic',
    promptZh: '我每天上午喝一杯____奶。',
    promptPinyin: 'Wǒ měitiān shàngwǔ hē yì bēi ____ nǎi.',
    promptAr: 'أشرب كل صباح كوباً من (الحليب / لبن البقر).',
    options: [
      { hanzi: '午', pinyin: 'wǔ' },
      { hanzi: '牛', pinyin: 'niú' },
      { hanzi: '生', pinyin: 'shēng' },
    ],
    correctIndex: 1,
    explanationAr: 'كلمة الحليب هي 牛奶 (niúnǎi)، والرمز 牛 يخترق خطه العمودي للأعلى، أما 午 فيُستخدم لأوقات النهار (上午/中午/下午).',
  },
  {
    id: 'cq-5',
    groupId: 'vp-6-wen-jian',
    category: 'visual-phonetic',
    promptZh: '老师，我有一个____题想请教您。',
    promptPinyin: 'Lǎoshī, wǒ yǒu yí ge ____ tí xiǎng qǐngjiào nín.',
    promptAr: 'يا معلم، لديّ (سؤال) أودّ استشارتك فيه.',
    options: [
      { hanzi: '间', pinyin: 'jiān' },
      { hanzi: '门', pinyin: 'mén' },
      { hanzi: '问', pinyin: 'wèn' },
    ],
    correctIndex: 2,
    explanationAr: 'كلمة «سؤال» هي 问题 (wèntí) بالرمز 问 (فم 口 داخل بوابة 门)، بينما 间 تُستخدم في 时间 (الوقت) و房间 (الغرفة).',
  },
  {
    id: 'cq-6',
    groupId: 'vp-10-kan-ting',
    category: 'visual-phonetic',
    promptZh: '房间里太暗了，我没____你的手机。',
    promptPinyin: 'Fángjiān lǐ tài àn le, wǒ méi ____ nǐ de shǒujī.',
    promptAr: 'الغرفة مظلمة جداً، لم (أرَ) هاتفك.',
    options: [
      { hanzi: '看见', pinyin: 'kànjiàn' },
      { hanzi: '看', pinyin: 'kàn' },
      { hanzi: '听', pinyin: 'tīng' },
    ],
    correctIndex: 0,
    explanationAr: 'للتعبير عن نتيجة الرؤية (وقع بصري عليه أو لم يقع) نستخدم 看见 / 没看见، أما 看 وحدها فتعني مجرد النظر.',
  },
  {
    id: 'cq-7',
    groupId: 'gt-1-bu-mei',
    category: 'grammar-trap',
    promptZh: '昨天我____去医院，今天才去。',
    promptPinyin: 'Zuótiān wǒ ____ qù yīyuàn, jīntiān cái qù.',
    promptAr: 'أمس (لم) أذهب إلى المستشفى، ذهبتُ اليوم فقط.',
    options: [
      { hanzi: '不', pinyin: 'bù' },
      { hanzi: '没', pinyin: 'méi' },
      { hanzi: '别', pinyin: 'bié' },
    ],
    correctIndex: 1,
    explanationAr: 'الجملة تبدأ بـ 昨天 (أمس)، ونفي وقوع حدث في الماضي يكون بـ 没 (مع حذف 了).',
  },
  {
    id: 'cq-8',
    groupId: 'gt-2-er-liang',
    category: 'grammar-trap',
    promptZh: '现在____点半，我买了____本书。',
    promptPinyin: 'Xiànzài ____ diǎn bàn, wǒ mǎi le ____ běn shū.',
    promptAr: 'الساعة الآن (الثانية) والنصف، وقد اشتريتُ (كتابين).',
    options: [
      { hanzi: '二 ... 二', pinyin: 'èr ... èr' },
      { hanzi: '两 ... 两', pinyin: 'liǎng ... liǎng' },
      { hanzi: '二 ... 两', pinyin: 'èr ... liǎng' },
    ],
    correctIndex: 1,
    explanationAr: 'قبل 点 (الساعة الثانية) وقبل كلمات الكمية مثل 本 نستخدم 两 دائماً: 两点半 و 两本书.',
  },
  {
    id: 'cq-9',
    groupId: 'gt-3-youdianr-yidianr',
    category: 'grammar-trap',
    promptZh: '这件衣服____大，有没有小一点儿的？',
    promptPinyin: 'Zhè jiàn yīfu ____ dà, yǒu méiyǒu xiǎo yìdiǎnr de?',
    promptAr: 'هذه القطعة كبيرة (قليلاً)، هل يوجد أصغر قليلاً؟',
    options: [
      { hanzi: '一点儿', pinyin: 'yìdiǎnr' },
      { hanzi: '有点儿', pinyin: 'yǒudiǎnr' },
      { hanzi: '几', pinyin: 'jǐ' },
    ],
    correctIndex: 1,
    explanationAr: 'الفراغ جاء «قبل» الصفة السلبية 大 (كبير أكثر من اللازم)، ولذلك نختار 有点儿 (أما 一点儿 فتأتي بعد الصفة كما في 小一点儿).',
  },
  {
    id: 'cq-10',
    groupId: 'gt-4-hui-neng-keyi',
    category: 'grammar-trap',
    promptZh: '请问，我____在这儿拍照吗？',
    promptPinyin: 'Qǐngwèn, wǒ ____ zài zhèr pāizhào ma?',
    promptAr: 'لو سمحت، هل (يُسمح لي) بالتصوير هنا؟',
    options: [
      { hanzi: '可以', pinyin: 'kěyǐ' },
      { hanzi: '会', pinyin: 'huì' },
      { hanzi: '想', pinyin: 'xiǎng' },
    ],
    correctIndex: 0,
    explanationAr: 'للاستئذان وطلب السماح (هل يُسمح لي...؟) نستخدم 可以، أما 会 فللمهارات المكتسبة بالتعلّم.',
  },
  {
    id: 'cq-11',
    groupId: 'gt-5-xiang-yao',
    category: 'grammar-trap',
    promptZh: '服务员，我____一碗米饭和一杯茶。',
    promptPinyin: 'Fúwùyuán, wǒ ____ yì wǎn mǐfàn hé yì bēi chá.',
    promptAr: 'يا نادل، (أريد / أطلب) وعاءً من الأرز وكوباً من الشاي.',
    options: [
      { hanzi: '想', pinyin: 'xiǎng' },
      { hanzi: '要', pinyin: 'yào' },
      { hanzi: '会', pinyin: 'huì' },
    ],
    correctIndex: 1,
    explanationAr: 'عند الطلب المباشر متبوعاً باسم دون فعل آخر نستخدم 要 (我要一碗米饭)، بينما 想 تحتاج فعلاً بعدها مثل 我想吃米饭.',
  },
  {
    id: 'cq-12',
    groupId: 'gt-6-zenme-zenmeyang',
    category: 'grammar-trap',
    promptZh: '请问，这个汉字____读？',
    promptPinyin: 'Qǐngwèn, zhège Hànzì ____ dú?',
    promptAr: 'لو سمحت، (كيف) يُنطق هذا الرمز الصيني؟',
    options: [
      { hanzi: '怎么样', pinyin: 'zěnmeyàng' },
      { hanzi: '怎么', pinyin: 'zěnme' },
      { hanzi: '什么', pinyin: 'shénme' },
    ],
    correctIndex: 1,
    explanationAr: 'لوجود الفعل 读 (يقرأ/ينطق) مباشرة بعد الفراغ نختار 怎么 للسؤال عن الكيفية، أما 怎么样 فتأتي في نهاية الجملة للسؤال عن الرأي.',
  },
  {
    id: 'cq-13',
    groupId: 'gt-7-ji-duoshao',
    category: 'grammar-trap',
    promptZh: '请问，这件衣服____钱？',
    promptPinyin: 'Qǐngwèn, zhè jiàn yīfu ____ qián?',
    promptAr: 'لو سمحت، بكم (ثمن) هذه القطعة من الملابس؟',
    options: [
      { hanzi: '几', pinyin: 'jǐ' },
      { hanzi: '多少', pinyin: 'duōshao' },
      { hanzi: '怎么', pinyin: 'zěnme' },
    ],
    correctIndex: 1,
    explanationAr: 'السؤال عن السعر في اللغة الصينية هو 多少钱 دائماً ولا نستخدم 几 قبل 钱 أبداً.',
  },
  {
    id: 'cq-14',
    groupId: 'gt-9-doubu-budou',
    category: 'grammar-trap',
    promptZh: '他们____是中国人，有的是中国人，有的是埃及人。',
    promptPinyin: 'Tāmen ____ shì Zhōngguórén, yǒude shì Zhōngguórén, yǒude shì Āijírén.',
    promptAr: '(ليس كلهم) صينيين؛ بعضهم صينيون وبعضهم مصريون.',
    options: [
      { hanzi: '都不', pinyin: 'dōu bù' },
      { hanzi: '不都', pinyin: 'bù dōu' },
      { hanzi: '都没', pinyin: 'dōu méi' },
    ],
    correctIndex: 1,
    explanationAr: 'بما أن بعضهم صينيون وبعضهم لا، فالنفي جزئي ويُعبّر عنه بـ 不都 (ليس الجميع). أما 都不 فتعني النفي الكلي (ولا واحد منهم).',
  },
  {
    id: 'cq-15',
    groupId: 'gt-10-zhengzai-le',
    category: 'grammar-trap',
    promptZh: '别打扰他，他____看书呢。',
    promptPinyin: 'Bié dǎrǎo tā, tā ____ kànshū ne.',
    promptAr: 'لا تزعجه، إنه (يقرأ الآن) كتاباً.',
    options: [
      { hanzi: '了', pinyin: 'le' },
      { hanzi: '正在', pinyin: 'zhèngzài' },
      { hanzi: '没', pinyin: 'méi' },
    ],
    correctIndex: 1,
    explanationAr: 'وجود 呢 في نهاية الجملة ومعنى «لا تزعجه الآن» يدلان على استمرار الفعل، والتركيب الصحيح هو 正在 + الفعل + 呢.',
  },
];
