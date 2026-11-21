let cachedBestVoice: SpeechSynthesisVoice | null = null;
let voicesInitialized = false;
let activePlaybackToken = 0;
let pendingDialogueTimer: number | null = null;

function isMandarinVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = voice.lang.toLowerCase().replace('_', '-');
  return lang === 'zh-cn' || lang === 'zh-hans' || lang.startsWith('zh-cn-') || lang.startsWith('zh');
}

function scoreMandarinVoice(voice: SpeechSynthesisVoice): number {
  if (!isMandarinVoice(voice)) return -1;

  const name = voice.name;
  const lowerName = name.toLowerCase();
  const lang = voice.lang.toLowerCase().replace('_', '-');
  const isMainland = lang === 'zh-cn' || lang === 'zh-hans' || lang.startsWith('zh-cn-');

  let score = isMainland ? 100 : 40;

  // أولوية قصوى للأصوات الطبيعية والعصبية عالية الجودة
  if (lowerName.includes('microsoft xiaoxiao')) {
    score += 500;
  } else if (lowerName.includes('microsoft yunxi')) {
    score += 480;
  } else if (name.includes('Google 普通话') || lowerName.includes('google 普通话')) {
    score += 460;
  } else if (lowerName.includes('natural') || lowerName.includes('neural')) {
    score += 420;
  } else if (lowerName.includes('xiaoxiao') || lowerName.includes('yunxi')) {
    score += 400;
  } else if (lowerName.includes('google') && isMainland) {
    score += 320;
  } else if (lowerName.includes('tingting') || lowerName.includes('xiaoyi') || lowerName.includes('yunyang')) {
    score += 240;
  }

  // تفضيل الأصوات المتصلة الطبيعية (مثل Edge/Chrome Online Natural) عند تساوي الفئة
  if (lowerName.includes('online')) {
    score += 30;
  }

  return score;
}

function resolveGenderedMandarinVoice(speaker: 'A' | 'B'): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices().filter(isMandarinVoice);
  if (voices.length === 0) return cachedBestVoice;

  const femaleHints = ['xiaoxiao', 'xiaoyi', 'tingting', 'yaoyao', 'huihui', 'lili', 'meijia', 'female'];
  const maleHints = ['yunxi', 'yunyang', 'yunjian', 'kangkang', 'yunjie', 'sinji', 'male'];
  const targetHints = speaker === 'A' ? femaleHints : maleHints;

  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  for (const voice of voices) {
    const baseScore = scoreMandarinVoice(voice);
    const lower = voice.name.toLowerCase();
    const matchesRole = targetHints.some((h) => lower.includes(h));
    const total = baseScore + (matchesRole ? 600 : 0);
    if (total > bestScore) {
      bestScore = total;
      best = voice;
    }
  }

  return best ?? resolveBestChineseVoice();
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function resolveBestChineseVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return cachedBestVoice;
  }

  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  for (const voice of voices) {
    const score = scoreMandarinVoice(voice);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  cachedBestVoice = best;
  return best;
}

/**
 * تهيئة مستمع onvoiceschanged لضمان جاهزية الأصوات الطبيعية من أول نقرة.
 */
export function initChineseVoices(onReady?: (voice: SpeechSynthesisVoice | null) => void): () => void {
  if (!isSpeechSupported()) return () => {};

  const updateVoice = () => {
    const best = resolveBestChineseVoice();
    onReady?.(best);
  };

  updateVoice();

  const synth = window.speechSynthesis;
  const handleVoicesChanged = () => {
    updateVoice();
  };

  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', handleVoicesChanged);
  } else if (!voicesInitialized) {
    synth.onvoiceschanged = handleVoicesChanged;
  }

  voicesInitialized = true;

  return () => {
    if (typeof synth.removeEventListener === 'function') {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    }
  };
}

export function stopChineseSpeech(): void {
  activePlaybackToken += 1;
  if (pendingDialogueTimer !== null) {
    window.clearTimeout(pendingDialogueTimer);
    pendingDialogueTimer = null;
  }
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speakChinese(
  text: string,
  rate: number = 1.0,
  callbacks?: { onEnd?: () => void; onError?: () => void }
): boolean {
  if (!isSpeechSupported()) return false;

  try {
    stopChineseSpeech();
    const myToken = activePlaybackToken;
    const synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = resolveBestChineseVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'zh-CN';
    }

    utterance.onend = () => {
      if (activePlaybackToken === myToken) {
        callbacks?.onEnd?.();
      }
    };
    utterance.onerror = () => {
      if (activePlaybackToken === myToken) {
        callbacks?.onError?.();
      }
    };

    synth.speak(utterance);
    return true;
  } catch {
    callbacks?.onError?.();
    return false;
  }
}

export interface DialogueAudioLine {
  speaker: 'A' | 'B';
  text: string;
}

/**
 * تشغيل حوار صيني بين متحدثَين (المتحدثة أ بصوت أنثوي/نبرة أعلى، والمتحدث ب بصوت ذكوري/نبرة أعمق)
 * مع فاصل زمني طبيعي بين الجملتين.
 */
export function speakChineseDialogue(
  lines: DialogueAudioLine[],
  callbacks?: {
    onLineStart?: (index: number, speaker: 'A' | 'B') => void;
    onComplete?: () => void;
    onError?: () => void;
  }
): boolean {
  if (!isSpeechSupported() || lines.length === 0) return false;

  try {
    stopChineseSpeech();
    const myToken = activePlaybackToken;
    const synth = window.speechSynthesis;

    const voiceA = resolveGenderedMandarinVoice('A');
    const voiceB = resolveGenderedMandarinVoice('B');
    const sameVoice = Boolean(voiceA && voiceB && voiceA.name === voiceB.name);

    const playIndex = (idx: number) => {
      if (activePlaybackToken !== myToken) return;
      if (idx >= lines.length) {
        callbacks?.onComplete?.();
        return;
      }

      const line = lines[idx];
      const utterance = new SpeechSynthesisUtterance(line.text);
      const chosenVoice = line.speaker === 'A' ? voiceA : voiceB;

      utterance.lang = chosenVoice?.lang || 'zh-CN';
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // تمييز واضح وطبيعي بين المتحدثة (أ) والمتحدث (ب) حتى في حال توفر صوت واحد فقط بالمتصفح
      if (line.speaker === 'A') {
        utterance.pitch = sameVoice ? 1.16 : 1.06;
        utterance.rate = 0.95;
      } else {
        utterance.pitch = sameVoice ? 0.82 : 0.92;
        utterance.rate = 0.92;
      }

      utterance.onstart = () => {
        if (activePlaybackToken === myToken) {
          callbacks?.onLineStart?.(idx, line.speaker);
        }
      };

      utterance.onend = () => {
        if (activePlaybackToken !== myToken) return;
        if (idx + 1 < lines.length) {
          pendingDialogueTimer = window.setTimeout(() => {
            pendingDialogueTimer = null;
            playIndex(idx + 1);
          }, 420);
        } else {
          callbacks?.onComplete?.();
        }
      };

      utterance.onerror = () => {
        if (activePlaybackToken === myToken) {
          callbacks?.onError?.();
        }
      };

      callbacks?.onLineStart?.(idx, line.speaker);
      synth.speak(utterance);
    };

    playIndex(0);
    return true;
  } catch {
    callbacks?.onError?.();
    return false;
  }
}
