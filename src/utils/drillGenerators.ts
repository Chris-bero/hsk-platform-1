import { ALL_DRILL_TYPES } from '../data/chaptersData';
import {
  ChapterData,
  CustomQuizConfig,
  DrillOption,
  DrillQuestion,
  DrillType,
  MistakeItem,
  SentenceItem,
  SessionDrillKey,
  VocabItem,
} from '../types';

const TONE_MAP: Record<string, [string, string, string, string]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

const REVERSE_TONE_MAP: Record<string, { base: string; tone: number }> = {};
Object.entries(TONE_MAP).forEach(([base, tones]) => {
  tones.forEach((char, idx) => {
    REVERSE_TONE_MAP[char] = { base, tone: idx + 1 };
  });
});

const SIMILAR_INITIAL_PAIRS: [string, string][] = [
  ['zh', 'z'],
  ['ch', 'c'],
  ['sh', 's'],
  ['j', 'q'],
  ['q', 'x'],
  ['x', 's'],
  ['n', 'l'],
  ['b', 'p'],
  ['d', 't'],
  ['g', 'k'],
  ['f', 'h'],
  ['z', 'c'],
  ['r', 'l'],
];

const FALLBACK_VOCAB_DISTRACTORS: { hanzi: string; pinyin: string; arabic: string }[] = [
  { hanzi: '学习', pinyin: 'xué xí', arabic: 'يدرس / يتعلم' },
  { hanzi: '朋友', pinyin: 'péng you', arabic: 'صديق' },
  { hanzi: '老师', pinyin: 'lǎo shī', arabic: 'معلم' },
  { hanzi: '明天', pinyin: 'míng tiān', arabic: 'غداً' },
  { hanzi: '高兴', pinyin: 'gāo xìng', arabic: 'سعيد' },
];

const FALLBACK_SENTENCE_DISTRACTORS: { hanzi: string; pinyin: string; arabic: string }[] = [
  {
    hanzi: '我是学生，我在学习汉语。',
    pinyin: 'wǒ shì xué shēng, wǒ zài xué xí hàn yǔ.',
    arabic: 'أنا طالب، وأدرس اللغة الصينية.',
  },
  {
    hanzi: '今天天气很好，我们去学校。',
    pinyin: 'jīn tiān tiān qì hěn hǎo, wǒ men qù xué xiào.',
    arabic: 'الطقس جميل اليوم، سنذهب إلى المدرسة.',
  },
  {
    hanzi: '请问，老师在教室吗？',
    pinyin: 'qǐng wèn, lǎo shī zài jiào shì ma?',
    arabic: 'عفواً، هل المعلم في قاعة الدرس؟',
  },
];

const EXTRA_PINYIN_LOOKUP: Record<string, string> = {
  同学们: 'tóngxuémen',
  王老师: 'Wáng lǎoshī',
  学生: 'xuéshēng',
  谢谢: 'xièxie',
  不客气: 'bú kèqi',
  再见: 'zàijiàn',
  你好: 'nǐ hǎo',
  您好: 'nín hǎo',
  大家: 'dàjiā',
  你们: 'nǐmen',
  他们: 'tāmen',
};

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mutatePinyinTone(pinyin: string, toneShift: number): string {
  const chars = Array.from(pinyin);
  for (let i = 0; i < chars.length; i++) {
    const info = REVERSE_TONE_MAP[chars[i]];
    if (info) {
      const nextToneIndex = (info.tone - 1 + toneShift + 4) % 4;
      chars[i] = TONE_MAP[info.base][nextToneIndex];
      return chars.join('');
    }
  }
  return pinyin;
}

function mutateSimilarSyllable(pinyin: string, attempt: number): string {
  const words = pinyin.split(' ');
  const targetIdx = attempt % words.length;
  const word = words[targetIdx];

  for (let i = 0; i < SIMILAR_INITIAL_PAIRS.length; i++) {
    const [a, b] = SIMILAR_INITIAL_PAIRS[(i + attempt) % SIMILAR_INITIAL_PAIRS.length];
    if (word.startsWith(a)) {
      words[targetIdx] = b + word.slice(a.length);
      return words.join(' ');
    }
    if (word.startsWith(b)) {
      words[targetIdx] = a + word.slice(b.length);
      return words.join(' ');
    }
  }

  if (word.includes('an')) {
    words[targetIdx] = word.replace('an', 'ang');
    return words.join(' ');
  }
  if (word.includes('en')) {
    words[targetIdx] = word.replace('en', 'eng');
    return words.join(' ');
  }
  return mutatePinyinTone(pinyin, attempt + 2);
}

function buildPinyinFiveOptions(item: VocabItem): DrillOption[] {
  const unique = new Set<string>([item.pinyin]);
  const distractors: string[] = [];

  const candidateToneVariants: string[] = item.toneVariants
    ? [...item.toneVariants]
    : [mutatePinyinTone(item.pinyin, 1), mutatePinyinTone(item.pinyin, 2)];

  for (const variant of candidateToneVariants) {
    if (variant && !unique.has(variant) && distractors.length < 2) {
      unique.add(variant);
      distractors.push(variant);
    }
  }

  let extraToneShift = 3;
  while (distractors.length < 2 && extraToneShift < 8) {
    const candidate = mutatePinyinTone(item.pinyin, extraToneShift);
    if (!unique.has(candidate)) {
      unique.add(candidate);
      distractors.push(candidate);
    }
    extraToneShift++;
  }

  const candidateSimilar: string[] = item.similarSyllables
    ? [...item.similarSyllables]
    : [mutateSimilarSyllable(item.pinyin, 0), mutateSimilarSyllable(item.pinyin, 1)];

  for (const sim of candidateSimilar) {
    if (sim && !unique.has(sim) && distractors.length < 4) {
      unique.add(sim);
      distractors.push(sim);
    }
  }

  let fallbackIdx = 0;
  while (distractors.length < 4 && fallbackIdx < FALLBACK_VOCAB_DISTRACTORS.length) {
    const candidate = FALLBACK_VOCAB_DISTRACTORS[fallbackIdx].pinyin;
    if (!unique.has(candidate)) {
      unique.add(candidate);
      distractors.push(candidate);
    }
    fallbackIdx++;
  }

  const allPinyins = shuffleArray([item.pinyin, ...distractors.slice(0, 4)]);
  return allPinyins.map((py, idx) => ({
    id: py === item.pinyin ? 'correct' : `opt-${idx}`,
    label: py,
    isPinyin: true,
  }));
}

function collectVocabPool(chapter: ChapterData, excludeHanzi: string, count: number) {
  const fromChapter = chapter.vocab.filter((v) => v.hanzi !== excludeHanzi);
  const combined: { hanzi: string; pinyin: string; arabic: string }[] = [...fromChapter];

  for (const fb of FALLBACK_VOCAB_DISTRACTORS) {
    if (combined.length >= count) break;
    if (fb.hanzi !== excludeHanzi && !combined.some((x) => x.hanzi === fb.hanzi)) {
      combined.push(fb);
    }
  }

  return shuffleArray(combined).slice(0, count);
}

function collectSentencePool(
  chapter: ChapterData,
  excludeHanzi: string,
  excludeArabic: string,
  count: number
) {
  const fromChapter = chapter.sentences.filter(
    (s) => s.hanzi !== excludeHanzi && s.arabic !== excludeArabic
  );
  const combined: { hanzi: string; pinyin: string; arabic: string }[] = [...fromChapter];

  for (const fb of FALLBACK_SENTENCE_DISTRACTORS) {
    if (combined.length >= count) break;
    if (
      fb.hanzi !== excludeHanzi &&
      fb.arabic !== excludeArabic &&
      !combined.some((x) => x.hanzi === fb.hanzi || x.arabic === fb.arabic)
    ) {
      combined.push(fb);
    }
  }

  return shuffleArray(combined).slice(0, count);
}

function buildVocabQuestion(
  chapter: ChapterData,
  drillType: DrillType,
  item: VocabItem,
  idx: number
): DrillQuestion | null {
  switch (drillType) {
    case 'hanzi-to-arabic': {
      const distractors = collectVocabPool(chapter, item.hanzi, 3);
      const options: DrillOption[] = shuffleArray([
        { id: 'correct', label: item.arabic },
        ...distractors.map((d, i) => ({ id: `d-${i}`, label: d.arabic })),
      ]);
      return {
        id: `h2a-${chapter.id}-${item.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: item.id,
        drillType,
        promptPrimary: item.hanzi,
        promptPinyin: item.pinyin,
        audioText: item.hanzi,
        options,
        correctOptionId: 'correct',
        correctDisplay: item.arabic,
        correctPinyinDisplay: item.pinyin,
        meaningDisplay: item.hanzi,
      };
    }

    case 'arabic-to-hanzi': {
      const distractors = collectVocabPool(chapter, item.hanzi, 3);
      const options: DrillOption[] = shuffleArray([
        { id: 'correct', label: item.hanzi, subLabel: item.pinyin, isHanzi: true },
        ...distractors.map((d, i) => ({
          id: `d-${i}`,
          label: d.hanzi,
          subLabel: d.pinyin,
          isHanzi: true,
        })),
      ]);
      return {
        id: `a2h-${chapter.id}-${item.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: item.id,
        drillType,
        promptPrimary: item.arabic,
        audioText: item.hanzi,
        options,
        correctOptionId: 'correct',
        correctDisplay: item.hanzi,
        correctPinyinDisplay: item.pinyin,
        meaningDisplay: item.arabic,
      };
    }

    case 'hanzi-to-pinyin': {
      const options = buildPinyinFiveOptions(item);
      return {
        id: `h2p-${chapter.id}-${item.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: item.id,
        drillType,
        promptPrimary: item.hanzi,
        promptSecondary: item.arabic,
        audioText: item.hanzi,
        options,
        correctOptionId: 'correct',
        correctDisplay: item.pinyin,
        meaningDisplay: `${item.hanzi} — ${item.arabic}`,
      };
    }

    case 'listening': {
      const distractors = collectVocabPool(chapter, item.hanzi, 3);
      const options: DrillOption[] = shuffleArray([
        { id: 'correct', label: item.hanzi, subLabel: item.pinyin, isHanzi: true },
        ...distractors.map((d, i) => ({
          id: `d-${i}`,
          label: d.hanzi,
          subLabel: d.pinyin,
          isHanzi: true,
        })),
      ]);
      return {
        id: `lst-${chapter.id}-${item.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: item.id,
        drillType,
        promptPrimary: 'استمع جيداً ثم اختر الرمز الصيني المطابق',
        audioText: item.hanzi,
        options,
        correctOptionId: 'correct',
        correctDisplay: item.hanzi,
        correctPinyinDisplay: item.pinyin,
        meaningDisplay: item.arabic,
      };
    }

    default:
      return null;
  }
}

function buildSentenceQuestion(
  chapter: ChapterData,
  drillType: DrillType,
  s: SentenceItem,
  idx: number
): DrillQuestion | null {
  switch (drillType) {
    case 'sentence-hanzi-to-arabic': {
      const arDistractors = collectSentencePool(chapter, s.hanzi, s.arabic, 3);
      return {
        id: `st-h2a-${chapter.id}-${s.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: s.id,
        drillType,
        direction: 'hanzi-to-arabic',
        promptPrimary: s.hanzi,
        promptPinyin: s.pinyin,
        audioText: s.hanzi,
        options: shuffleArray([
          { id: 'correct', label: s.arabic },
          ...arDistractors.map((d, i) => ({ id: `d-${i}`, label: d.arabic })),
        ]),
        correctOptionId: 'correct',
        correctDisplay: s.arabic,
        correctPinyinDisplay: s.pinyin,
        meaningDisplay: s.hanzi,
      };
    }

    case 'sentence-arabic-to-hanzi': {
      const zhDistractors = collectSentencePool(chapter, s.hanzi, s.arabic, 3);
      return {
        id: `st-a2h-${chapter.id}-${s.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: s.id,
        drillType,
        direction: 'arabic-to-hanzi',
        promptPrimary: s.arabic,
        audioText: s.hanzi,
        options: shuffleArray([
          { id: 'correct', label: s.hanzi, subLabel: s.pinyin, isHanzi: true },
          ...zhDistractors.map((d, i) => ({
            id: `d-${i}`,
            label: d.hanzi,
            subLabel: d.pinyin,
            isHanzi: true,
          })),
        ]),
        correctOptionId: 'correct',
        correctDisplay: s.hanzi,
        correctPinyinDisplay: s.pinyin,
        meaningDisplay: s.arabic,
      };
    }

    case 'sentence-builder': {
      const tiles = s.segments.map((text, tileIdx) => ({
        tileId: `tile-${chapter.id}-${s.id}-${tileIdx}`,
        text,
      }));
      let shuffledTiles = shuffleArray(tiles);
      if (
        shuffledTiles.length > 1 &&
        shuffledTiles.every((t, i) => t.text === s.segments[i])
      ) {
        shuffledTiles = [...shuffledTiles.slice(1), shuffledTiles[0]];
      }
      return {
        id: `sb-${chapter.id}-${s.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: s.id,
        drillType,
        promptPrimary: s.arabic,
        promptPinyin: s.pinyin,
        audioText: s.hanzi,
        correctSegments: s.segments,
        shuffledSegments: shuffledTiles,
        correctDisplay: s.hanzi,
        correctPinyinDisplay: s.pinyin,
        meaningDisplay: s.arabic,
      };
    }

    case 'fill-in-blank': {
      const blanked = s.hanzi.includes(s.targetBlank)
        ? s.hanzi.replace(s.targetBlank, ' ____ ')
        : `${s.hanzi} ____`;

      const lookupPinyin = (hanzi: string) => {
        const fromChapter = chapter.vocab.find((v) => v.hanzi === hanzi);
        if (fromChapter) return fromChapter.pinyin;
        return EXTRA_PINYIN_LOOKUP[hanzi];
      };

      // استخدام [targetBlank, ...blankDistractors] حصرياً دون سحب كلمات عشوائية من جمل أخرى
      const explicitDistractors: string[] = [];
      const seen = new Set<string>([s.targetBlank]);
      for (const d of s.blankDistractors ?? []) {
        if (d && !seen.has(d)) {
          seen.add(d);
          explicitDistractors.push(d);
        }
      }

      const options: DrillOption[] = shuffleArray([
        {
          id: 'correct',
          label: s.targetBlank,
          subLabel: lookupPinyin(s.targetBlank),
          isHanzi: true,
        },
        ...explicitDistractors.slice(0, 3).map((w, i) => ({
          id: `d-${i}`,
          label: w,
          subLabel: lookupPinyin(w),
          isHanzi: true,
        })),
      ]);

      return {
        id: `fib-${chapter.id}-${s.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: s.id,
        drillType,
        promptPrimary: s.arabic,
        targetBlank: s.targetBlank,
        sentenceWithBlank: blanked,
        sentenceFullHanzi: s.hanzi,
        sentenceFullPinyin: s.pinyin,
        audioText: s.hanzi,
        options,
        correctOptionId: 'correct',
        correctDisplay: s.targetBlank,
        correctPinyinDisplay: s.pinyin,
        meaningDisplay: s.hanzi,
      };
    }

    default:
      return null;
  }
}

export function generateDrillQuestions(
  chapter: ChapterData,
  drillKey: SessionDrillKey
): DrillQuestion[] {
  if (drillKey === 'mixed') {
    const mixed: DrillQuestion[] = [];
    for (const type of ALL_DRILL_TYPES) {
      const qs = generateSingleDrillQuestions(chapter, type);
      if (qs.length > 0) {
        mixed.push(qs[0]);
      }
    }
    return mixed;
  }

  return generateSingleDrillQuestions(chapter, drillKey);
}

export function generateSingleDrillQuestions(
  chapter: ChapterData,
  drillType: DrillType
): DrillQuestion[] {
  const vocab = chapter.vocab;
  const sentences = chapter.sentences;

  switch (drillType) {
    case 'hanzi-to-arabic':
    case 'arabic-to-hanzi':
    case 'hanzi-to-pinyin':
    case 'listening':
      return shuffleArray(vocab)
        .map((item, idx) => buildVocabQuestion(chapter, drillType, item, idx))
        .filter((q): q is DrillQuestion => q !== null);

    case 'match-2-col': {
      if (vocab.length === 0) return [];
      const chunkSize = Math.min(vocab.length, 5);
      const chunks: VocabItem[][] = [];
      const shuffled = shuffleArray(vocab);
      for (let i = 0; i < shuffled.length; i += chunkSize) {
        chunks.push(shuffled.slice(i, i + chunkSize));
      }
      return chunks.map((chunk, idx) => ({
        id: `m2-${chapter.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: `m2-${chunk.map((c) => c.id).join('_')}`,
        drillType,
        promptPrimary: 'صل كل رمز صيني بمعناه العربي الصحيح',
        matchingEntries: chunk.map((v) => ({
          id: v.id,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          arabic: v.arabic,
        })),
        correctDisplay: chunk.map((c) => `${c.hanzi} ← ${c.arabic}`).join(' · '),
      }));
    }

    case 'match-3-col': {
      if (vocab.length === 0) return [];
      const chunkSize = Math.min(vocab.length, 4);
      const chunks: VocabItem[][] = [];
      const shuffled = shuffleArray(vocab);
      for (let i = 0; i < shuffled.length; i += chunkSize) {
        chunks.push(shuffled.slice(i, i + chunkSize));
      }
      return chunks.map((chunk, idx) => ({
        id: `m3-${chapter.id}-${idx}`,
        chapterId: chapter.id,
        sourceItemId: `m3-${chunk.map((c) => c.id).join('_')}`,
        drillType,
        promptPrimary: 'اربط الرمز الصيني بالنطق الصوتي والمعنى العربي المطابق',
        matchingEntries: chunk.map((v) => ({
          id: v.id,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          arabic: v.arabic,
        })),
        correctDisplay: chunk.map((c) => `${c.hanzi} (${c.pinyin}) ← ${c.arabic}`).join(' · '),
      }));
    }

    case 'sentence-hanzi-to-arabic':
    case 'sentence-arabic-to-hanzi':
    case 'sentence-builder':
    case 'fill-in-blank':
      return shuffleArray(sentences)
        .map((s, idx) => buildSentenceQuestion(chapter, drillType, s, idx))
        .filter((q): q is DrillQuestion => q !== null);
  }
}

export function generateCustomQuizQuestions(
  allChapters: ChapterData[],
  config: CustomQuizConfig
): DrillQuestion[] {
  const selectedChapters = allChapters.filter((ch) => config.chapterIds.includes(ch.id));
  const targetDrills: DrillType[] =
    config.drillScope === 'all' ? ALL_DRILL_TYPES : [config.drillScope];

  const pool: DrillQuestion[] = [];
  for (const chapter of selectedChapters) {
    for (const dt of targetDrills) {
      pool.push(...generateSingleDrillQuestions(chapter, dt));
    }
  }

  const shuffled = shuffleArray(pool);
  if (config.questionLimit === 'all') {
    return shuffled;
  }
  return shuffled.slice(0, config.questionLimit);
}

export function generateMistakeReviewQuestions(
  allChapters: ChapterData[],
  mistakes: MistakeItem[]
): DrillQuestion[] {
  const chapterById = new Map(allChapters.map((c) => [c.id, c]));
  const questions: DrillQuestion[] = [];

  mistakes.forEach((m, idx) => {
    const chapter = chapterById.get(m.chapterId);
    if (!chapter) return;

    if (
      m.drillType === 'hanzi-to-arabic' ||
      m.drillType === 'arabic-to-hanzi' ||
      m.drillType === 'hanzi-to-pinyin' ||
      m.drillType === 'listening'
    ) {
      const vocab = chapter.vocab.find((v) => v.id === m.sourceItemId);
      if (vocab) {
        const q = buildVocabQuestion(chapter, m.drillType, vocab, idx);
        if (q) questions.push(q);
      }
      return;
    }

    if (
      m.drillType === 'sentence-hanzi-to-arabic' ||
      m.drillType === 'sentence-arabic-to-hanzi' ||
      m.drillType === 'sentence-builder' ||
      m.drillType === 'fill-in-blank'
    ) {
      const sentence = chapter.sentences.find((s) => s.id === m.sourceItemId);
      if (sentence) {
        const q = buildSentenceQuestion(chapter, m.drillType, sentence, idx);
        if (q) questions.push(q);
      }
      return;
    }

    if (m.drillType === 'match-2-col' || m.drillType === 'match-3-col') {
      const ids = m.sourceItemId.replace(/^m[23]-/, '').split('_');
      const items = chapter.vocab.filter((v) => ids.includes(v.id));
      const fallbackItems = items.length > 0 ? items : chapter.vocab.slice(0, 4);
      if (fallbackItems.length > 0) {
        questions.push({
          id: `rev-${m.drillType}-${chapter.id}-${idx}`,
          chapterId: chapter.id,
          sourceItemId: m.sourceItemId,
          drillType: m.drillType,
          promptPrimary:
            m.drillType === 'match-2-col'
              ? 'صل كل رمز صيني بمعناه العربي الصحيح'
              : 'اربط الرمز الصيني بالنطق الصوتي والمعنى العربي المطابق',
          matchingEntries: fallbackItems.map((v) => ({
            id: v.id,
            hanzi: v.hanzi,
            pinyin: v.pinyin,
            arabic: v.arabic,
          })),
          correctDisplay:
            m.drillType === 'match-2-col'
              ? fallbackItems.map((c) => `${c.hanzi} ← ${c.arabic}`).join(' · ')
              : fallbackItems.map((c) => `${c.hanzi} (${c.pinyin}) ← ${c.arabic}`).join(' · '),
        });
      }
    }
  });

  return shuffleArray(questions);
}

export function countAvailableQuestionsForConfig(
  allChapters: ChapterData[],
  chapterIds: number[],
  drillScope: DrillType | 'all'
): number {
  const selectedChapters = allChapters.filter((ch) => chapterIds.includes(ch.id));
  const drills = drillScope === 'all' ? ALL_DRILL_TYPES : [drillScope];

  let total = 0;
  for (const ch of selectedChapters) {
    for (const dt of drills) {
      if (
        dt === 'hanzi-to-arabic' ||
        dt === 'arabic-to-hanzi' ||
        dt === 'hanzi-to-pinyin' ||
        dt === 'listening'
      ) {
        total += ch.vocab.length;
      } else if (dt === 'match-2-col') {
        total += ch.vocab.length > 0 ? Math.ceil(ch.vocab.length / 5) : 0;
      } else if (dt === 'match-3-col') {
        total += ch.vocab.length > 0 ? Math.ceil(ch.vocab.length / 4) : 0;
      } else {
        total += ch.sentences.length;
      }
    }
  }
  return total;
}

export {
  initChineseVoices,
  isSpeechSupported,
  resolveBestChineseVoice,
  speakChinese,
  stopChineseSpeech,
} from './speech';
