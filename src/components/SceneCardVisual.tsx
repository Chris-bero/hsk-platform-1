export type HskSceneId =
  | 'greeting-wave'
  | 'teacher-classroom'
  | 'student-desk'
  | 'laptop-new'
  | 'cooking-noodles'
  | 'cooking-dumplings'
  | 'family-four'
  | 'two-children'
  | 'calendar-sep8'
  | 'calendar-sunday-rest'
  | 'china-landmark'
  | 'doctor-hospital'
  | 'drinking-tea'
  | 'speaking-phone'
  | 'reading-book'
  | 'office-busy'
  | 'birthday-cake'
  | 'tennis-sport'
  | 'writing-hanzi'
  | 'friends-cafe';

interface SceneCardVisualProps {
  sceneId: HskSceneId;
  className?: string;
}

/**
 * Editorial Neo-Chinese visual scene illustrations for official HSK 3.0 Listening & Reading
 * picture-matching cards (zero Arabic or Chinese spoiler text inside illustrations).
 */
export function SceneCardVisual({ sceneId, className = 'w-full h-28' }: SceneCardVisualProps) {
  switch (sceneId) {
    case 'greeting-wave':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <circle cx="58" cy="40" r="14" className="fill-[#D97706]/25 stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M38 92 C38 68, 78 68, 78 92" className="fill-[#B91C1C]/18 stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M74 62 L88 42" className="stroke-[#B91C1C]" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M92 34 C96 36, 98 40, 96 45" fill="none" className="stroke-[#D97706]" strokeWidth="2" strokeLinecap="round" />
          <circle cx="124" cy="40" r="14" className="fill-[#15803D]/20 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M104 92 C104 68, 144 68, 144 92" className="fill-[#15803D]/18 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M108 62 L96 48" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'teacher-classroom':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="64" y="16" width="96" height="54" rx="4" className="fill-[#15803D]/20 stroke-[#15803D]" strokeWidth="2.2" />
          <line x1="78" y1="34" x2="144" y2="34" className="stroke-[#15803D]" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="78" y1="46" x2="132" y2="46" className="stroke-[#15803D]/70" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="58" x2="116" y2="58" className="stroke-[#15803D]/70" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="40" r="12" className="fill-[#D97706]/25 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M22 94 C22 68, 58 68, 58 94" className="fill-[#B91C1C]/18 stroke-[#B91C1C]" strokeWidth="2.2" />
          <line x1="54" y1="68" x2="88" y2="44" className="stroke-[#B91C1C]" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'student-desk':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <circle cx="90" cy="30" r="12" className="fill-[#D97706]/25 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M68 68 C68 50, 112 50, 112 68" className="fill-[#15803D]/18 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <rect x="34" y="68" width="112" height="10" rx="3" className="fill-[#D97706]/30 stroke-[#D97706]" strokeWidth="2" />
          <line x1="46" y1="78" x2="46" y2="98" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.5" />
          <line x1="134" y1="78" x2="134" y2="98" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.5" />
          <path d="M72 67 L90 61 L108 67 Z" className="fill-white dark:fill-[#292623] stroke-[#B91C1C]" strokeWidth="2" />
        </svg>
      );

    case 'laptop-new':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="44" y="22" width="92" height="54" rx="5" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.4" />
          <rect x="52" y="30" width="76" height="38" rx="2" className="fill-[#D97706]/15" />
          <line x1="64" y1="44" x2="112" y2="44" className="stroke-[#B91C1C]" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="64" y1="54" x2="98" y2="54" className="stroke-[#1C1917]/40 dark:stroke-[#F5F2EB]/40" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 80 L152 80 L144 90 L36 90 Z" className="fill-[#1C1917]/15 dark:fill-[#F5F2EB]/15 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M144 18 L147 26 L155 29 L147 32 L144 40 L141 32 L133 29 L141 26 Z" className="fill-[#D97706]" />
        </svg>
      );

    case 'cooking-noodles':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <path d="M44 58 C44 86, 136 86, 136 58 Z" className="fill-[#B91C1C]/20 stroke-[#B91C1C]" strokeWidth="2.4" />
          <line x1="68" y1="86" x2="112" y2="86" className="stroke-[#B91C1C]" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 56 Q72 44 86 56 Q100 44 114 56" fill="none" className="stroke-[#D97706]" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="88" y1="52" x2="138" y2="20" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="98" y1="52" x2="146" y2="28" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 38 C58 30, 66 26, 62 18" fill="none" className="stroke-[#57534E] dark:stroke-[#A8A29E]" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M78 36 C74 28, 82 24, 78 16" fill="none" className="stroke-[#57534E] dark:stroke-[#A8A29E]" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'cooking-dumplings':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <ellipse cx="90" cy="74" rx="58" ry="18" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M52 68 C56 46, 86 46, 90 68 Z" className="fill-[#D97706]/30 stroke-[#D97706]" strokeWidth="2.2" />
          <path d="M88 68 C92 46, 122 46, 126 68 Z" className="fill-[#D97706]/30 stroke-[#D97706]" strokeWidth="2.2" />
          <path d="M70 54 C74 34, 104 34, 108 54 Z" className="fill-[#F9F6F0] dark:fill-[#292623] stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M80 28 C78 22, 84 18, 82 12" fill="none" className="stroke-[#57534E] dark:stroke-[#A8A29E]" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M98 28 C96 22, 102 18, 100 12" fill="none" className="stroke-[#57534E] dark:stroke-[#A8A29E]" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'family-four':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <path d="M22 46 L90 14 L158 46" fill="none" className="stroke-[#B91C1C]" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Parent 1 */}
          <circle cx="48" cy="48" r="9" className="fill-[#D97706]/25 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2" />
          <path d="M35 88 C35 66, 61 66, 61 88" className="fill-[#1C1917]/15 dark:fill-[#F5F2EB]/15 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2" />
          {/* Parent 2 */}
          <circle cx="80" cy="48" r="9" className="fill-[#B91C1C]/20 stroke-[#B91C1C]" strokeWidth="2" />
          <path d="M67 88 C67 66, 93 66, 93 88" className="fill-[#B91C1C]/15 stroke-[#B91C1C]" strokeWidth="2" />
          {/* Child 1 */}
          <circle cx="110" cy="58" r="7.5" className="fill-[#15803D]/20 stroke-[#15803D]" strokeWidth="2" />
          <path d="M99 88 C99 72, 121 72, 121 88" className="fill-[#15803D]/15 stroke-[#15803D]" strokeWidth="2" />
          {/* Child 2 */}
          <circle cx="136" cy="60" r="7" className="fill-[#D97706]/25 stroke-[#D97706]" strokeWidth="2" />
          <path d="M126 88 C126 74, 146 74, 146 88" className="fill-[#D97706]/18 stroke-[#D97706]" strokeWidth="2" />
        </svg>
      );

    case 'two-children':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <circle cx="64" cy="44" r="13" className="fill-[#15803D]/20 stroke-[#15803D]" strokeWidth="2.2" />
          <path d="M44 92 C44 68, 84 68, 84 92" className="fill-[#15803D]/15 stroke-[#15803D]" strokeWidth="2.2" />
          <circle cx="116" cy="48" r="11" className="fill-[#B91C1C]/20 stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M98 92 C98 72, 134 72, 134 92" className="fill-[#B91C1C]/15 stroke-[#B91C1C]" strokeWidth="2.2" />
          <circle cx="90" cy="24" r="5" className="fill-[#D97706]" />
        </svg>
      );

    case 'calendar-sep8':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="46" y="18" width="88" height="76" rx="8" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <rect x="46" y="18" width="88" height="22" rx="8" className="fill-[#B91C1C]" />
          <text x="90" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">9 / SEP</text>
          <text x="90" y="76" textAnchor="middle" className="fill-[#1C1917] dark:fill-[#F5F2EB]" fontSize="34" fontWeight="700">8</text>
        </svg>
      );

    case 'calendar-sunday-rest':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <circle cx="42" cy="30" r="12" className="fill-[#D97706]/35 stroke-[#D97706]" strokeWidth="2" />
          <rect x="48" y="54" width="94" height="28" rx="8" className="fill-[#15803D]/20 stroke-[#15803D]" strokeWidth="2.2" />
          <rect x="40" y="64" width="14" height="24" rx="4" className="fill-[#15803D]/30 stroke-[#15803D]" strokeWidth="2" />
          <rect x="136" y="64" width="14" height="24" rx="4" className="fill-[#15803D]/30 stroke-[#15803D]" strokeWidth="2" />
          <circle cx="80" cy="48" r="9" className="fill-[#D97706]/25 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2" />
          <text x="122" y="42" className="fill-[#D97706]" fontSize="13" fontWeight="700">Zzz</text>
        </svg>
      );

    case 'china-landmark':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <path d="M36 42 Q90 22 144 42 L134 48 L46 48 Z" className="fill-[#B91C1C]" />
          <path d="M52 28 Q90 12 128 28 L120 33 L60 33 Z" className="fill-[#D97706]" />
          <rect x="54" y="48" width="72" height="38" className="fill-[#B91C1C]/15 stroke-[#B91C1C]" strokeWidth="2" />
          <line x1="70" y1="48" x2="70" y2="86" className="stroke-[#B91C1C]" strokeWidth="2.5" />
          <line x1="90" y1="48" x2="90" y2="86" className="stroke-[#B91C1C]" strokeWidth="2.5" />
          <line x1="110" y1="48" x2="110" y2="86" className="stroke-[#B91C1C]" strokeWidth="2.5" />
          <rect x="38" y="86" width="104" height="8" rx="2" className="fill-[#1C1917]/20 dark:fill-[#F5F2EB]/20" />
        </svg>
      );

    case 'doctor-hospital':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="46" y="20" width="88" height="72" rx="6" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <rect x="83" y="34" width="14" height="38" rx="2" className="fill-[#B91C1C]" />
          <rect x="71" y="46" width="38" height="14" rx="2" className="fill-[#B91C1C]" />
          <rect x="76" y="76" width="28" height="16" className="fill-[#1C1917]/15 dark:fill-[#F5F2EB]/15" />
        </svg>
      );

    case 'drinking-tea':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <path d="M56 46 L116 46 L110 82 C108 88, 64 88, 62 82 Z" className="fill-[#15803D]/22 stroke-[#15803D]" strokeWidth="2.4" />
          <path d="M115 54 C132 54, 132 74, 112 74" fill="none" className="stroke-[#15803D]" strokeWidth="2.4" />
          <path d="M74 36 C70 28, 78 24, 74 16" fill="none" className="stroke-[#D97706]" strokeWidth="2" strokeLinecap="round" />
          <path d="M94 36 C90 28, 98 24, 94 16" fill="none" className="stroke-[#D97706]" strokeWidth="2" strokeLinecap="round" />
          <line x1="48" y1="88" x2="128" y2="88" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'speaking-phone':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="66" y="18" width="48" height="76" rx="8" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.4" />
          <rect x="73" y="28" width="34" height="50" rx="2" className="fill-[#B91C1C]/12" />
          <circle cx="90" cy="85" r="3" className="fill-[#B91C1C]" />
          <path d="M124 38 C132 44, 132 58, 124 64" fill="none" className="stroke-[#D97706]" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M134 30 C146 40, 146 62, 134 72" fill="none" className="stroke-[#D97706]/60" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'reading-book':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <path d="M36 30 C58 24, 78 28, 90 36 L90 86 C78 78, 58 76, 36 82 Z" className="fill-white dark:fill-[#292623] stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M144 30 C122 24, 102 28, 90 36 L90 86 C102 78, 122 76, 144 82 Z" className="fill-white dark:fill-[#292623] stroke-[#B91C1C]" strokeWidth="2.2" />
          <line x1="48" y1="44" x2="78" y2="47" className="stroke-[#1C1917]/50 dark:stroke-[#F5F2EB]/50" strokeWidth="2" />
          <line x1="48" y1="56" x2="78" y2="59" className="stroke-[#1C1917]/50 dark:stroke-[#F5F2EB]/50" strokeWidth="2" />
          <line x1="102" y1="47" x2="132" y2="44" className="stroke-[#1C1917]/50 dark:stroke-[#F5F2EB]/50" strokeWidth="2" />
          <line x1="102" y1="59" x2="132" y2="56" className="stroke-[#1C1917]/50 dark:stroke-[#F5F2EB]/50" strokeWidth="2" />
        </svg>
      );

    case 'office-busy':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="34" y="62" width="112" height="10" rx="2" className="fill-[#1C1917]/20 dark:fill-[#F5F2EB]/20" />
          <rect x="44" y="34" width="24" height="28" rx="2" className="fill-[#D97706]/25 stroke-[#D97706]" strokeWidth="2" />
          <rect x="50" y="26" width="24" height="28" rx="2" className="fill-white dark:fill-[#292623] stroke-[#B91C1C]" strokeWidth="2" />
          <circle cx="118" cy="36" r="14" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <line x1="118" y1="36" x2="118" y2="27" className="stroke-[#B91C1C]" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="118" y1="36" x2="126" y2="39" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="86" y="72" width="10" height="22" className="fill-[#1C1917]/20 dark:fill-[#F5F2EB]/20" />
        </svg>
      );

    case 'birthday-cake':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="52" y="54" width="76" height="34" rx="6" className="fill-[#B91C1C]/20 stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M52 66 Q66 74 78 66 Q90 74 102 66 Q114 74 128 66" fill="none" className="stroke-[#D97706]" strokeWidth="2.4" />
          <rect x="74" y="34" width="6" height="20" className="fill-[#D97706]" />
          <rect x="100" y="34" width="6" height="20" className="fill-[#D97706]" />
          <circle cx="77" cy="27" r="4.5" className="fill-[#EF4444]" />
          <circle cx="103" cy="27" r="4.5" className="fill-[#EF4444]" />
        </svg>
      );

    case 'tennis-sport':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <ellipse cx="76" cy="42" rx="20" ry="26" transform="rotate(-25 76 42)" className="fill-[#15803D]/15 stroke-[#15803D]" strokeWidth="2.6" />
          <line x1="90" y1="64" x2="112" y2="92" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="4" strokeLinecap="round" />
          <circle cx="128" cy="36" r="11" className="fill-[#D97706]/35 stroke-[#D97706]" strokeWidth="2.2" />
          <path d="M120 30 Q128 36 120 42" fill="none" className="stroke-white dark:stroke-[#1A1816]" strokeWidth="1.8" />
        </svg>
      );

    case 'writing-hanzi':
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <rect x="44" y="20" width="66" height="70" rx="4" className="fill-white dark:fill-[#292623] stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2" />
          <line x1="77" y1="20" x2="77" y2="90" strokeDasharray="4 4" className="stroke-[#B91C1C]/40" strokeWidth="1.4" />
          <line x1="44" y1="55" x2="110" y2="55" strokeDasharray="4 4" className="stroke-[#B91C1C]/40" strokeWidth="1.4" />
          <path d="M62 42 L92 42 M77 32 L77 74 M60 72 L94 72" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="3" strokeLinecap="round" />
          <path d="M138 24 L112 68 L119 72 L145 28 Z" className="fill-[#B91C1C]" />
        </svg>
      );

    case 'friends-cafe':
    default:
      return (
        <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
          <rect width="180" height="110" rx="8" className="fill-[#F9F6F0] dark:fill-[#1A1816]" />
          <circle cx="52" cy="40" r="12" className="fill-[#D97706]/25 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <path d="M34 86 C34 64, 70 64, 70 86" className="fill-[#D97706]/20 stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.2" />
          <circle cx="128" cy="40" r="12" className="fill-[#B91C1C]/20 stroke-[#B91C1C]" strokeWidth="2.2" />
          <path d="M110 86 C110 64, 146 64, 146 86" className="fill-[#B91C1C]/18 stroke-[#B91C1C]" strokeWidth="2.2" />
          <rect x="74" y="64" width="32" height="6" rx="2" className="fill-[#1C1917] dark:fill-[#F5F2EB]" />
          <line x1="90" y1="70" x2="90" y2="92" className="stroke-[#1C1917] dark:stroke-[#F5F2EB]" strokeWidth="2.6" />
        </svg>
      );
  }
}
