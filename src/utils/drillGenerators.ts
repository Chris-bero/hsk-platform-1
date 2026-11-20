import {
  ChapterData,
  DrillOption,
  DrillQuestion,
  DrillType,
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

  // Fallback subtle vowel shift
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

function collectSentencePool(chapter: ChapterData, excludeHanzi: string, count: number) {
  const fromChapter = chapter.sentences.filter((s) => s.hanzi !== excludeHanzi);
  const combined: { hanzi: string; pinyin: string; arabic: string }[] = [...fromChapter];

  for (const fb of FALLBACK_SENTENCE_DISTRACTORS) {
    if (combined.length >= count) break;
    if (fb.hanzi !== excludeHanzi && !combined.some((x) => x.hanzi === fb.hanzi)) {
      combined.push(fb);
    }
  }

  return shuffleArray(combined).slice(0, count);
}

export function generateDrillQuestions(
  chapter: ChapterData,
  drillKey: SessionDrillKey
): DrillQuestion[] {
  if (drillKey === 'mixed') {
    const mixed: DrillQuestion[] = [];
    const singleTypes: DrillType[] = [
      'hanzi-to-arabic',
      'arabic-to-hanzi',
      'hanzi-to-pinyin',
      'listening',
      'match-2-col',
      'match-3-col',
      'sentence-translation',
      'sentence-builder',
      'fill-in-blank',
    ];

    for (const type of singleTypes) {
      const qs = generateSingleDrillQuestions(chapter, type);
      if (qs.length > 0) {
        mixed.push(qs[0]);
      }
    }
    return mixed;
  }

  return generateSingleDrillQuestions(chapter, drillKey);
}

function generateSingleDrillQuestions(
  chapter: ChapterData,
  drillType: DrillType
): DrillQuestion[] {
  const vocab = chapter.vocab;
  const sentences = chapter.sentences;

  switch (drillType) {
    case 'hanzi-to-arabic': {
      return shuffleArray(vocab).map((item, idx) => {
        const distractors = collectVocabPool(chapter, item.hanzi, 3);
        const options: DrillOption[] = shuffleArray([
          { id: 'correct', label: item.arabic },
          ...distractors.map((d, i) => ({ id: `d-${i}`, label: d.arabic })),
        ]);
        return {
          id: `h2a-${item.id}-${idx}`,
          drillType,
          promptPrimary: item.hanzi,
          promptPinyin: item.pinyin,
          options,
          correctOptionId: 'correct',
          correctDisplay: item.arabic,
          correctPinyinDisplay: item.pinyin,
          meaningDisplay: item.hanzi,
        };
      });
    }

    case 'arabic-to-hanzi': {
      return shuffleArray(vocab).map((item, idx) => {
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
          id: `a2h-${item.id}-${idx}`,
          drillType,
          promptPrimary: item.arabic,
          options,
          correctOptionId: 'correct',
          correctDisplay: item.hanzi,
          correctPinyinDisplay: item.pinyin,
          meaningDisplay: item.arabic,
        };
      });
    }

    case 'hanzi-to-pinyin': {
      return shuffleArray(vocab).map((item, idx) => {
        const options = buildPinyinFiveOptions(item);
        return {
          id: `h2p-${item.id}-${idx}`,
          drillType,
          promptPrimary: item.hanzi,
          promptSecondary: item.arabic,
          options,
          correctOptionId: 'correct',
          correctDisplay: item.pinyin,
          meaningDisplay: `${item.hanzi} — ${item.arabic}`,
        };
      });
    }

    case 'match-2-col': {
      if (vocab.length === 0) return [];
      const chunkSize = Math.min(vocab.length, 5);
      const chunks: VocabItem[][] = [];
      const shuffled = shuffleArray(vocab);
      for (let i = 0; i < shuffled.length; i += chunkSize) {
        chunks.push(shuffled.slice(i, i + chunkSize));
      }
      return chunks.map((chunk, idx) => ({
        id: `m2-${idx}`,
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
        id: `m3-${idx}`,
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

    case 'listening': {
      return shuffleArray(vocab).map((item, idx) => {
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
          id: `lst-${item.id}-${idx}`,
          drillType,
          promptPrimary: 'استمع جيداً ثم اختر الرمز الصيني المطابق',
          audioText: item.hanzi,
          options,
          correctOptionId: 'correct',
          correctDisplay: item.hanzi,
          correctPinyinDisplay: item.pinyin,
          meaningDisplay: item.arabic,
        };
      });
    }

    case 'sentence-translation': {
      const questions: DrillQuestion[] = [];
      shuffleArray(sentences).forEach((s, idx) => {
        // Direction 1: Hanzi -> Arabic
        const arDistractors = collectSentencePool(chapter, s.hanzi, 3);
        questions.push({
          id: `st-h2a-${s.id}-${idx}`,
          drillType,
          direction: 'hanzi-to-arabic',
          promptPrimary: s.hanzi,
          promptPinyin: s.pinyin,
          options: shuffleArray([
            { id: 'correct', label: s.arabic },
            ...arDistractors.map((d, i) => ({ id: `d-${i}`, label: d.arabic })),
          ]),
          correctOptionId: 'correct',
          correctDisplay: s.arabic,
          correctPinyinDisplay: s.pinyin,
          meaningDisplay: s.hanzi,
        });

        // Direction 2: Arabic -> Hanzi
        const zhDistractors = collectSentencePool(chapter, s.hanzi, 3);
        questions.push({
          id: `st-a2h-${s.id}-${idx}`,
          drillType,
          direction: 'arabic-to-hanzi',
          promptPrimary: s.arabic,
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
        });
      });
      return questions;
    }

    case 'sentence-builder': {
      return shuffleArray(sentences).map((s, idx) => {
        const tiles = s.segments.map((text, tileIdx) => ({
          tileId: `tile-${s.id}-${tileIdx}`,
          text,
        }));
        let shuffledTiles = shuffleArray(tiles);
        // Ensure shuffled order differs from original when possible
        if (
          shuffledTiles.length > 1 &&
          shuffledTiles.every((t, i) => t.text === s.segments[i])
        ) {
          shuffledTiles = [...shuffledTiles.slice(1), shuffledTiles[0]];
        }
        return {
          id: `sb-${s.id}-${idx}`,
          drillType,
          promptPrimary: s.arabic,
          promptPinyin: s.pinyin,
          correctSegments: s.segments,
          shuffledSegments: shuffledTiles,
          correctDisplay: s.hanzi,
          correctPinyinDisplay: s.pinyin,
          meaningDisplay: s.arabic,
        };
      });
    }

    case 'fill-in-blank': {
      return shuffleArray(sentences).map((s, idx) => {
        const blanked = s.hanzi.includes(s.targetBlank)
          ? s.hanzi.replace(s.targetBlank, ' ____ ')
          : `${s.hanzi} ____`;

        const distractorWords: string[] = [];
        const used = new Set<string>([s.targetBlank]);

        if (s.blankDistractors) {
          for (const w of s.blankDistractors) {
            if (!used.has(w) && distractorWords.length < 3) {
              used.add(w);
              distractorWords.push(w);
            }
          }
        }
        for (const v of vocab) {
          if (!used.has(v.hanzi) && distractorWords.length < 3) {
            used.add(v.hanzi);
            distractorWords.push(v.hanzi);
          }
        }
        for (const fb of FALLBACK_VOCAB_DISTRACTORS) {
          if (!used.has(fb.hanzi) && distractorWords.length < 3) {
            used.add(fb.hanzi);
            distractorWords.push(fb.hanzi);
          }
        }

        const lookupPinyin = (hanzi: string) => {
          const fromChapter = vocab.find((v) => v.hanzi === hanzi);
          if (fromChapter) return fromChapter.pinyin;
          const fromFb = FALLBACK_VOCAB_DISTRACTORS.find((v) => v.hanzi === hanzi);
          return fromFb?.pinyin;
        };

        const options: DrillOption[] = shuffleArray([
          {
            id: 'correct',
            label: s.targetBlank,
            subLabel: lookupPinyin(s.targetBlank),
            isHanzi: true,
          },
          ...distractorWords.slice(0, 3).map((w, i) => ({
            id: `d-${i}`,
            label: w,
            subLabel: lookupPinyin(w),
            isHanzi: true,
          })),
        ]);

        return {
          id: `fib-${s.id}-${idx}`,
          drillType,
          promptPrimary: s.arabic,
          sentenceWithBlank: blanked,
          sentenceFullHanzi: s.hanzi,
          sentenceFullPinyin: s.pinyin,
          options,
          correctOptionId: 'correct',
          correctDisplay: s.targetBlank,
          correctPinyinDisplay: s.pinyin,
          meaningDisplay: s.hanzi,
        };
      });
    }
  }
}

export {
  initChineseVoices,
  isSpeechSupported,
  resolveBestChineseVoice,
  speakChinese,
  stopChineseSpeech,
} from './speech';
