let cachedBestVoice: SpeechSynthesisVoice | null = null;
let voicesInitialized = false;

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

  // محاولة التحميل الفوري في حال كانت الأصوات محمّلة مسبقاً
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

export function speakChinese(text: string, rate: number = 1.0): boolean {
  if (!isSpeechSupported()) return false;

  try {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = resolveBestChineseVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'zh-CN';
    }

    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopChineseSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
