import React from 'react';

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
    Ǖ: 'v', Ǘ: 'v', Ǚ: 'v', Ǜ: 'v', Ü: 'v',
  };
  return map[ch] ?? ch.toLowerCase();
}

/**
 * Authoritative Mandarin Pinyin syllable dictionary (~415 standard syllables).
 * Ensures exact syllable boundaries (e.g. "yuè" -> ["yuè"], "xīngqī" -> ["xīng", "qī"],
 * "xuéshēng" -> ["xué", "shēng"], "nǚér" -> ["nǚ", "ér"]).
 */
const VALID_MANDARIN_SYLLABLES = new Set<string>([
  // Zero-initial
  'a', 'ai', 'an', 'ang', 'ao', 'e', 'ei', 'en', 'eng', 'er', 'o', 'ou',
  // b
  'ba', 'bai', 'ban', 'bang', 'bao', 'bei', 'ben', 'beng', 'bi', 'bian', 'biao', 'bie', 'bin', 'bing', 'bo', 'bu',
  // p
  'pa', 'pai', 'pan', 'pang', 'pao', 'pei', 'pen', 'peng', 'pi', 'pian', 'piao', 'pie', 'pin', 'ping', 'po', 'pou', 'pu',
  // m
  'ma', 'mai', 'man', 'mang', 'mao', 'me', 'mei', 'men', 'meng', 'mi', 'mian', 'miao', 'mie', 'min', 'ming', 'miu', 'mo', 'mou', 'mu',
  // f
  'fa', 'fan', 'fang', 'fei', 'fen', 'feng', 'fiao', 'fo', 'fou', 'fu',
  // d
  'da', 'dai', 'dan', 'dang', 'dao', 'de', 'dei', 'den', 'deng', 'di', 'dia', 'dian', 'diao', 'die', 'ding', 'diu', 'dong', 'dou', 'du', 'duan', 'dui', 'dun', 'duo',
  // t
  'ta', 'tai', 'tan', 'tang', 'tao', 'te', 'tei', 'teng', 'ti', 'tian', 'tiao', 'tie', 'ting', 'tong', 'tou', 'tu', 'tuan', 'tui', 'tun', 'tuo',
  // n
  'na', 'nai', 'nan', 'nang', 'nao', 'ne', 'nei', 'nen', 'neng', 'ni', 'nian', 'niang', 'niao', 'nie', 'nin', 'ning', 'niu', 'nong', 'nou', 'nu', 'nuan', 'nun', 'nuo', 'nv', 'nve',
  // l
  'la', 'lai', 'lan', 'lang', 'lao', 'le', 'lei', 'leng', 'li', 'lia', 'lian', 'liang', 'liao', 'lie', 'lin', 'ling', 'liu', 'lo', 'long', 'lou', 'lu', 'luan', 'lun', 'luo', 'lv', 'lve',
  // g
  'ga', 'gai', 'gan', 'gang', 'gao', 'ge', 'gei', 'gen', 'geng', 'gong', 'gou', 'gu', 'gua', 'guai', 'guan', 'guang', 'gui', 'gun', 'guo',
  // k
  'ka', 'kai', 'kan', 'kang', 'kao', 'ke', 'kei', 'ken', 'keng', 'kong', 'kou', 'ku', 'kua', 'kuai', 'kuan', 'kuang', 'kui', 'kun', 'kuo',
  // h
  'ha', 'hai', 'han', 'hang', 'hao', 'he', 'hei', 'hen', 'heng', 'hong', 'hou', 'hu', 'hua', 'huai', 'huan', 'huang', 'hui', 'hun', 'huo',
  // j
  'ji', 'jia', 'jian', 'jiang', 'jiao', 'jie', 'jin', 'jing', 'jiong', 'jiu', 'ju', 'juan', 'jue', 'jun',
  // q
  'qi', 'qia', 'qian', 'qiang', 'qiao', 'qie', 'qin', 'qing', 'qiong', 'qiu', 'qu', 'quan', 'que', 'qun',
  // x
  'xi', 'xia', 'xian', 'xiang', 'xiao', 'xie', 'xin', 'xing', 'xiong', 'xiu', 'xu', 'xuan', 'xue', 'xun',
  // zh
  'zha', 'zhai', 'zhan', 'zhang', 'zhao', 'zhe', 'zhei', 'zhen', 'zheng', 'zhi', 'zhong', 'zhou', 'zhu', 'zhua', 'zhuai', 'zhuan', 'zhuang', 'zhui', 'zhun', 'zhuo',
  // ch
  'cha', 'chai', 'chan', 'chang', 'chao', 'che', 'chen', 'cheng', 'chi', 'chong', 'chou', 'chu', 'chua', 'chuai', 'chuan', 'chuang', 'chui', 'chun', 'chuo',
  // sh
  'sha', 'shai', 'shan', 'shang', 'shao', 'she', 'shei', 'shen', 'sheng', 'shi', 'shou', 'shu', 'shua', 'shuai', 'shuan', 'shuang', 'shui', 'shun', 'shuo',
  // r
  'ran', 'rang', 'rao', 're', 'ren', 'reng', 'ri', 'rong', 'rou', 'ru', 'rua', 'ruan', 'rui', 'run', 'ruo',
  // z
  'za', 'zai', 'zan', 'zang', 'zao', 'ze', 'zei', 'zen', 'zeng', 'zi', 'zong', 'zou', 'zu', 'zuan', 'zui', 'zun', 'zuo',
  // c
  'ca', 'cai', 'can', 'cang', 'cao', 'ce', 'cei', 'cen', 'ceng', 'ci', 'cong', 'cou', 'cu', 'cuan', 'cui', 'cun', 'cuo',
  // s
  'sa', 'sai', 'san', 'sang', 'sao', 'se', 'sen', 'seng', 'si', 'song', 'sou', 'su', 'suan', 'sui', 'sun', 'suo',
  // y
  'ya', 'yan', 'yang', 'yao', 'ye', 'yi', 'yin', 'ying', 'yo', 'yong', 'you', 'yu', 'yuan', 'yue', 'yun',
  // w
  'wa', 'wai', 'wan', 'wang', 'wei', 'wen', 'weng', 'wo', 'wu',
]);

function isValidAsciiSyllable(raw: string): boolean {
  return VALID_MANDARIN_SYLLABLES.has(raw);
}

/**
 * Splits a single Pinyin word (e.g., "Zhōngguórén", "xīngqīrì", "miàntiáor", "yuè")
 * into exact individual Mandarin syllables using minimum-syllable dynamic programming.
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

  // Fast path: whole token is already a single valid Mandarin syllable (e.g. "yuè", "xīng", "shì")
  if (isValidAsciiSyllable(ascii)) {
    return [cleaned];
  }

  // Handle trailing erhua 'r' (e.g. miàntiáor -> miàn, tiáo, r; yìdiǎnr -> yì, diǎn, r)
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

  // Dynamic programming: pick the valid segmentation with the FEWEST syllables
  // (ties broken by preferring longer leading syllable).
  const n = coreAscii.length;
  const memo = new Map<number, string[] | null>();

  function solve(pos: number): string[] | null {
    if (pos === n) return [];
    if (memo.has(pos)) return memo.get(pos)!;

    let best: string[] | null = null;
    const maxLen = Math.min(6, n - pos);

    for (let len = maxLen; len >= 1; len--) {
      const sliceAscii = coreAscii.slice(pos, pos + len);
      if (!isValidAsciiSyllable(sliceAscii)) continue;

      const rest = solve(pos + len);
      if (rest === null) continue;

      const candidate = [coreChars.slice(pos, pos + len).join(''), ...rest];
      if (best === null || candidate.length < best.length) {
        best = candidate;
      }
    }

    memo.set(pos, best);
    return best;
  }

  const solved = solve(0);
  if (solved) {
    return trailingR ? [...solved, 'r'] : solved;
  }

  return [cleaned];
}

export function tokenizePinyinString(pinyin: string): string[] {
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

  if (syllables.length === hanziCount) {
    let sIdx = 0;
    return chars.map((ch) => {
      if (isHanziChar(ch)) {
        return { hanzi: ch, pinyin: syllables[sIdx++] };
      }
      return { hanzi: ch };
    });
  }

  let sIdx = 0;
  return chars.map((ch) => {
    if (isHanziChar(ch) && sIdx < syllables.length) {
      return { hanzi: ch, pinyin: syllables[sIdx++] };
    }
    return { hanzi: ch };
  });
}

interface RubyChineseProps {
  hanzi: string;
  pinyin?: string;
  showPinyin?: boolean;
  className?: string;
  blankPlaceholder?: React.ReactNode;
}

/**
 * Renders Chinese text with proper HTML <ruby> Pinyin annotations directly above
 * each Chinese character. When showPinyin is false, omits <rt> entirely so Pinyin
 * toggles cleanly across every browser without leftover spacing.
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
    const pinyinSyllables = showPinyin && pinyin ? tokenizePinyinString(pinyin) : [];
    const totalHanzi = Array.from(hanzi).filter(isHanziChar).length;
    const canPair = showPinyin && pinyinSyllables.length === totalHanzi;
    let cursor = 0;

    return (
      <span
        dir="ltr"
        className={`font-hanzi inline-flex flex-wrap items-end ${
          showPinyin ? 'hsk-ruby-line' : 'leading-relaxed'
        } ${className}`}
      >
        {parts.map((part, partIdx) => {
          const chars = Array.from(part);
          return (
            <React.Fragment key={partIdx}>
              {chars.map((ch, charIdx) => {
                if (isHanziChar(ch)) {
                  const py = canPair ? pinyinSyllables[cursor++] : undefined;
                  if (showPinyin && py) {
                    return (
                      <ruby key={`${partIdx}-${charIdx}`} className="hsk-ruby">
                        {ch}
                        <rp>(</rp>
                        <rt>{py}</rt>
                        <rp>)</rp>
                      </ruby>
                    );
                  }
                  return (
                    <span key={`${partIdx}-${charIdx}`} className="inline-block">
                      {ch}
                    </span>
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

  const pairs = buildRubyPairs(hanzi, showPinyin ? pinyin : undefined);

  return (
    <span
      dir="ltr"
      className={`font-hanzi inline-flex flex-wrap items-end ${
        showPinyin ? 'hsk-ruby-line' : 'leading-relaxed'
      } ${className}`}
    >
      {pairs.map((pair, idx) =>
        showPinyin && pair.pinyin ? (
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
