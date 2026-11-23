import { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, Megaphone, Sparkles, X } from 'lucide-react';
import {
  fetchTeacherBroadcast,
  loadLocalTeacherBroadcast,
  sanitizeBroadcastUrl,
  TEACHER_BROADCAST_LOCAL_KEY,
} from '../services/sheetsSync';
import { BroadcastStyle, TeacherBroadcast } from '../types';

const DISMISSED_IDS_KEY = 'chinese_portal_dismissed_broadcasts_v1';

function loadDismissedIds(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveDismissedId(id: string): string[] {
  const existing = loadDismissedIds();
  if (existing.includes(id)) return existing;
  const updated = [id, ...existing].slice(0, 30);
  try {
    localStorage.setItem(DISMISSED_IDS_KEY, JSON.stringify(updated));
  } catch {
    // تجاهل أخطاء التخزين المحلي
  }
  return updated;
}

const STYLE_CONFIG: Record<
  BroadcastStyle,
  {
    label: string;
    icon: typeof Megaphone;
    barClass: string;
    labelClass: string;
    ctaClass: string;
  }
> = {
  info: {
    label: 'إعلان المعلم',
    icon: Megaphone,
    barClass:
      'border-[#1D4ED8]/25 dark:border-[#60A5FA]/30 bg-[#EFF6FF] dark:bg-[#172554]/55 text-[#1E3A8A] dark:text-[#DBEAFE]',
    labelClass: 'text-[#1D4ED8] dark:text-[#93C5FD]',
    ctaClass:
      'bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white',
  },
  important: {
    label: 'تنبيه هام',
    icon: AlertTriangle,
    barClass:
      'border-[#D97706]/35 dark:border-[#F59E0B]/35 bg-[#FFFBEB] dark:bg-[#451A03]/55 text-[#78350F] dark:text-[#FEF3C7]',
    labelClass: 'text-[#B45309] dark:text-[#FBBF24]',
    ctaClass:
      'bg-[#B45309] hover:bg-[#92400E] dark:bg-[#F59E0B] dark:hover:bg-[#D97706] text-white dark:text-[#121110]',
  },
  promo: {
    label: 'عرض / موعد',
    icon: Sparkles,
    barClass:
      'border-[#15803D]/30 dark:border-[#22C55E]/35 bg-[#F0FDF4] dark:bg-[#052E16]/55 text-[#14532D] dark:text-[#DCFCE7]',
    labelClass: 'text-[#15803D] dark:text-[#4ADE80]',
    ctaClass:
      'bg-[#15803D] hover:bg-[#166534] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-[#121110]',
  },
};

export function TeacherBroadcastBanner() {
  const [broadcast, setBroadcast] = useState<TeacherBroadcast | null>(() =>
    loadLocalTeacherBroadcast()
  );
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => loadDismissedIds());

  useEffect(() => {
    let active = true;

    const refresh = () => {
      fetchTeacherBroadcast().then((next) => {
        if (!active) return;
        setBroadcast(next);
      });
    };

    refresh();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === TEACHER_BROADCAST_LOCAL_KEY) {
        setBroadcast(loadLocalTeacherBroadcast());
      }
      if (event.key === DISMISSED_IDS_KEY) {
        setDismissedIds(loadDismissedIds());
      }
    };

    const handleFocus = () => {
      refresh();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (!broadcast || !broadcast.enabled || !broadcast.message.trim()) {
    return null;
  }

  if (dismissedIds.includes(broadcast.id)) {
    return null;
  }

  const config = STYLE_CONFIG[broadcast.style] ?? STYLE_CONFIG.info;
  const Icon = config.icon;
  const safeUrl = sanitizeBroadcastUrl(broadcast.ctaUrl);

  const handleDismiss = () => {
    const nextDismissed = saveDismissedId(broadcast.id);
    setDismissedIds(nextDismissed);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`no-print border-b transition-colors ${config.barClass}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Icon className={`w-4 h-4 shrink-0 ${config.labelClass}`} aria-hidden="true" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed min-w-0">
            <strong className={`font-bold ml-1.5 ${config.labelClass}`}>{config.label}:</strong>
            <span>{broadcast.message}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {safeUrl && (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${config.ctaClass}`}
            >
              <span>{broadcast.ctaLabel || 'التفاصيل'}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="إغلاق الإعلان"
            title="إغلاق الإعلان"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-black/8 dark:hover:bg-white/10 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
