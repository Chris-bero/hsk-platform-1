import React from 'react';

const PINYIN_VOWEL_TONES = 'aāáǎàeēéěèiīíǐìoōóǒòuūúǔùüǖǘǚǜv';

function normalizeAsciiTone(ch: string): string {
  const map: Record<string, string> = {
    ā: 'a', á: 'a', ǎ: 'a', à: 'a',
    ē: 'e', é: 'e', ě: 'e', è: 'e',
    ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
    ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
    ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
    ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
    Ā: 'a', Á: 'a', Ǎ: 'a', À: 'a',
    Ē: 'e', É: 'e', Ě: 'e', È: 'e',
    Ī: 'i', Í: 'i', Ǐ: 'i', Ì: 'i',
    Ō: 'o', Ó: 'o', Ǒ: 'o', Ò: 'o',
    Ū: 'u', Ú: 'u', Ǔ: 'u', Ù: 'u',
  };
  return map[ch] ?? ch.toLowerCase();
}

const VALID_FINALS = new Set([
  'a', 'o', 'e', 'i', 'u', 'v', 'er',
  'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 've',
  'an', 'en', 'in', 'un', 'vn',
  'ang', 'eng', 'ing', 'ong',
  'ia', 'iao', 'ian', 'iang', 'iong',
  'ua', 'uo', 'uai', 'uan', 'uang',
  'van',
]);

const VALID_INITIALS = [
  'zh', 'ch', 'sh',
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
  'g', 'k', 'h', 'j', 'q', 'x',
  'r', 'z', 'c', 's', 'y', 'w',
];

function isValidAsciiSyllable(raw: string): boolean {
  if (!raw) return false;
  if (VALID_FINALS.has(raw)) return true;
  for (const init of VALID_INITIALS) {
    if (raw.startsWith(init)) {
      const rest = raw.slice(init.length);
      if (VALID_FINALS.has(rest)) return true;
    }
  }
  return false;
}

/**
 * Splits a single Pinyin word (which may contain multiple joined syllables like
 * "Zhōngguórén", "lǎoshī", "miàntiáor", "xiǎojie") into individual syllables.
 */
function splitPinyinWord(word: string): string[] {
  const cleaned = word.replace(/[’']/g, "'").trim();
  if (!cleaned) return [];
  if (cleaned.includes("'")) {
    return cleaned.split("'").flatMap((part) => splitPinyinWord(part));
  }
  // Keep pure numbers or uppercase acronyms (e.g. "AI", "9", "20") untouched
  if (/^[0-9]+$/.test(cleaned) || /^[A-Z]{2,}$/.test(cleaned)) {
    return [cleaned];
  }

  const chars = Array.from(cleaned);
  const asciiChars = chars.map(normalizeAsciiTone);
  const ascii = asciiChars.join('');

  // Handle trailing erhua 'r' (e.g. miàntiáor -> miàn, tiáo, r)
  let trailingR = false;
  let coreAscii = ascii;
  let coreChars = chars;
  if (
    coreAscii.length > 2 &&
    coreAscii.endsWith('r') &&
    !coreAscii.endsWith('er') &&
    !isValidAsciiSyllable(coreAscii)
  ) {
    trailingR = true;
    coreAscii = coreAscii.slice(0, -1);
    coreChars = chars.slice(0, -1);
  }

  // Dynamic programming / greedy longest valid syllable split
  const n = coreAscii.length;
  const memo = new Map<number, string[] | null>();

  function solve(pos: number): string[] | null {
    if (pos === n) return [];
    if (memo.has(pos)) return memo.get(pos)!;

    // Try longer valid syllables first (max Pinyin syllable length is 6: zhuang, chuang, shuang)
    const maxLen = Math.min(6, n - pos);
    for (let len = maxLen; len >= 1; len--) {
      const sliceAscii = coreAscii.slice(pos, pos + len);
      if (isValidAsciiSyllable(sliceAscii)) {
        const rest = solve(pos + len);
        if (rest !== null) {
          const piece = coreChars.slice(pos, pos + len).join('');
          const result = [piece, ...rest];
          memo.set(pos, result);
          return result;
        }
      }
    }

    memo.set(pos, null);
    return null;
  }

  const solved = solve(0);
  if (solved) {
    return trailingR ? [...solved, 'r'] : solved;
  }

  return [cleaned];
}

function tokenizePinyinString(pinyin: string): string[] {
  // Strip Chinese & Latin punctuation, split on whitespace/separators
  const tokens = pinyin
    .replace(/[，。？！、；：“”‘’（）()《》【】,.?!;:★—\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const out: string[] = [];
  for (const tok of tokens) {
    if (/^[0-9]+$/.test(tok) || /^[A-Z]{2,}$/.test(tok)) {
      continue;
    }
    out.push(...splitPinyinWord(tok));
  }
  return out;
}

function isHanziChar(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}

export interface RubyPair {
  hanzi: string;
  pinyin?: string;
}

/**
 * Aligns each Hanzi character with its exact Pinyin syllable so <ruby> renders
 * Pinyin centered directly above every single Chinese character.
 */
export function buildRubyPairs(hanziText: string, pinyinText?: string): RubyPair[] {
  const chars = Array.from(hanziText);
  if (!pinyinText || !pinyinText.trim()) {
    return chars.map((ch) => ({ hanzi: ch }));
  }

  const syllables = tokenizePinyinString(pinyinText);
  const hanziCount = chars.filter(isHanziChar).length;

  // If syllable count matches Hanzi count cleanly, pair 1-to-1
  if (syllables.length === hanziCount) {
    let sIdx = 0;
    return chars.map((ch) => {
      if (isHanziChar(ch)) {
        return { hanzi: ch, pinyin: syllables[sIdx++] };
      }
      return { hanzi: ch };
    });
  }

  // Fallback when blanks (____) or special tokens appear inside the sentence:
  // Pair Hanzi runs sequentially with available syllables.
  let sIdx = 0;
  return chars.map((ch) => {
    if (isHanziChar(ch) && sIdx < syllables.length) {
      return { hanzi: ch, pinyin: syllables[sIdx++] };
    }
    return { hanzi: ch };
  });
}

void PINYIN_VOWEL_TONES;

interface RubyChineseProps {
  hanzi: string;
  pinyin?: string;
  showPinyin?: boolean;
  className?: string;
  blankPlaceholder?: React.ReactNode;
}

/**
 * Renders Chinese text with proper HTML <ruby> Pinyin annotations directly above
 * each Chinese character. Supports optional blank slots marked by `____` or `（　）`.
 */
export function RubyChinese({
  hanzi,
  pinyin,
  showPinyin = true,
  className = '',
  blankPlaceholder,
}: RubyChineseProps) {
  // Handle blank markers `____` cleanly while keeping exact ruby pairing for surrounding Hanzi
  if (hanzi.includes('____')) {
    const parts = hanzi.split('____');
    const pinyinSyllables = pinyin ? tokenizePinyinString(pinyin) : [];
    const totalHanzi = Array.from(hanzi).filter(isHanziChar).length;
    const canPair = pinyinSyllables.length === totalHanzi;
    let cursor = 0;

    return (
      <span
        dir="ltr"
        className={`hsk-ruby-line font-hanzi inline-flex flex-wrap items-end ${
          showPinyin ? '' : 'hsk-ruby-hide-pinyin'
        } ${className}`}
      >
        {parts.map((part, partIdx) => {
          const chars = Array.from(part);
          return (
            <React.Fragment key={partIdx}>
              {chars.map((ch, charIdx) => {
                if (isHanziChar(ch)) {
                  const py = canPair ? pinyinSyllables[cursor++] : undefined;
                  return (
                    <ruby key={`${partIdx}-${charIdx}`} className="hsk-ruby">
                      {ch}
                      <rp>(</rp>
                      <rt>{py ?? ''}</rt>
                      <rp>)</rp>
                    </ruby>
                  );
                }
                return (
                  <span key={`${partIdx}-${charIdx}`} className="inline-block">
                    {ch}
                  </span>
                );
              })}
              {partIdx < parts.length - 1 && (
                <span className="inline-flex items-end mx-1.5">
                  {blankPlaceholder ?? (
                    <span className="inline-block min-w-[3.4rem] px-2 py-0.5 text-center border-b-2 border-[#B91C1C] dark:border-[#EF4444] text-[#B91C1C] dark:text-[#EF4444] font-bold">
                      （　）
                    </span>
                  )}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    );
  }

  const pairs = buildRubyPairs(hanzi, pinyin);

  return (
    <span
      dir="ltr"
      className={`hsk-ruby-line font-hanzi inline-flex flex-wrap items-end ${
        showPinyin ? '' : 'hsk-ruby-hide-pinyin'
      } ${className}`}
    >
      {pairs.map((pair, idx) =>
        pair.pinyin ? (
          <ruby key={idx} className="hsk-ruby">
            {pair.hanzi}
            <rp>(</rp>
            <rt>{pair.pinyin}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={idx} className="inline-block">
            {pair.hanzi}
          </span>
        )
      )}
    </span>
  );
}
