import { useEffect, useRef } from 'react';

/**
 * مؤقت ذكي لاحتساب وقت الدراسة الفعلي فقط عندما تكون الصفحة مرئية ونشطة.
 * يتوقف تلقائياً عند إخفاء التبويب أو فقدان التركيز عبر visibilitychange.
 */
export function useActiveStudyTimer(
  isEnabled: boolean,
  onTickSeconds: (deltaSeconds: number) => void
) {
  const callbackRef = useRef(onTickSeconds);
  callbackRef.current = onTickSeconds;

  useEffect(() => {
    if (!isEnabled) return;

    let isVisible = document.visibilityState === 'visible';
    let accumulated = 0;

    const flush = () => {
      if (accumulated > 0) {
        callbackRef.current(accumulated);
        accumulated = 0;
      }
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (!isVisible) {
        flush();
      }
    };

    const handleBlur = () => {
      flush();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    const intervalId = window.setInterval(() => {
      if (isVisible && document.visibilityState === 'visible') {
        accumulated += 1;
        if (accumulated >= 10) {
          flush();
        }
      }
    }, 1000);

    return () => {
      flush();
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isEnabled]);
}

export function formatStudyDurationAr(totalSeconds: number): string {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) {
    return totalSeconds > 0 ? 'أقل من دقيقة' : '٠ دقيقة';
  }
  if (hours === 0) {
    return `${minutes} دقيقة`;
  }
  if (minutes === 0) {
    return `${hours} ساعة`;
  }
  return `${hours} س ${minutes} د`;
}
