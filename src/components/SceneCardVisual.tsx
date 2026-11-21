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
 * Rich, multi-element, full-color editorial SVG scene illustrations for official HSK 3.0
 * Listening (Part 1 & Part 3) and Reading (Part 1) visual cards.
 * Strictly ZERO text, letters, or numerals inside any illustration.
 */
export function SceneCardVisual({ sceneId, className = 'w-full h-32' }: SceneCardVisualProps) {
  switch (sceneId) {
    case 'greeting-wave':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Warm courtyard sky & ground */}
          <rect width="240" height="150" rx="10" fill="#FDF6EC" />
          <rect y="106" width="240" height="44" rx="4" fill="#E8DCC8" />
          {/* Background trees & archway */}
          <circle cx="30" cy="72" r="24" fill="#6AA876" opacity="0.5" />
          <circle cx="212" cy="70" r="26" fill="#6AA876" opacity="0.5" />
          <path d="M84 106 V48 A36 30 0 0 1 156 48 V106" fill="#F4E8D6" stroke="#D2B48C" strokeWidth="3" />
          <circle cx="192" cy="28" r="12" fill="#FBBF24" opacity="0.85" />

          {/* Person 1 (Left — terracotta coat, waving & shaking hands) */}
          <ellipse cx="76" cy="134" rx="26" ry="6" fill="#C9B79C" />
          <path d="M56 84 C56 68, 96 68, 96 84 L100 132 H52 Z" fill="#C2410C" />
          <path d="M68 84 L76 102 L84 84 Z" fill="#FFF7ED" />
          {/* Hair & head */}
          <circle cx="76" cy="48" r="17" fill="#F8D2B4" />
          <path d="M59 46 C59 29, 93 29, 93 46 C87 38, 65 38, 59 46 Z" fill="#292524" />
          <circle cx="71" cy="48" r="1.8" fill="#1C1917" />
          <circle cx="82" cy="48" r="1.8" fill="#1C1917" />
          <path d="M72 55 Q76.5 59 81 55" fill="none" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="67" cy="52" r="2.6" fill="#F472B6" opacity="0.35" />
          <circle cx="85" cy="52" r="2.6" fill="#F472B6" opacity="0.35" />
          {/* Left raised waving hand */}
          <path d="M58 84 L40 60" stroke="#C2410C" strokeWidth="9" strokeLinecap="round" />
          <circle cx="37" cy="56" r="5.5" fill="#F8D2B4" />
          <path d="M26 48 Q24 55 28 61" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M20 44 Q17 55 22 65" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          {/* Right arm reaching to shake hands */}
          <path d="M92 88 L116 96" stroke="#C2410C" strokeWidth="9" strokeLinecap="round" />

          {/* Person 2 (Right — jade cardigan, shaking hands) */}
          <ellipse cx="164" cy="134" rx="26" ry="6" fill="#C9B79C" />
          <path d="M144 84 C144 68, 184 68, 184 84 L188 132 H140 Z" fill="#15803D" />
          <path d="M156 84 L164 104 L172 84 Z" fill="#FEF3C7" />
          {/* Hair (bob) & head */}
          <path d="M146 44 C146 27, 182 27, 182 44 L185 62 L143 62 Z" fill="#3B2314" />
          <circle cx="164" cy="48" r="16.5" fill="#F8D2B4" />
          <path d="M148 44 Q164 34 180 44" fill="#3B2314" />
          <circle cx="158" cy="48" r="1.8" fill="#1C1917" />
          <circle cx="169" cy="48" r="1.8" fill="#1C1917" />
          <path d="M159 55 Q163.5 59 168 55" fill="none" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="155" cy="52" r="2.6" fill="#F472B6" opacity="0.35" />
          <circle cx="172" cy="52" r="2.6" fill="#F472B6" opacity="0.35" />
          {/* Reaching arm & warm handshake clasp */}
          <path d="M148 88 L124 96" stroke="#15803D" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="120" cy="96" rx="9" ry="6.5" fill="#F3C19D" stroke="#9A3412" strokeWidth="1.4" />
          {/* Friendly sparkle above handshake */}
          <path d="M120 72 L122 77 L127 79 L122 81 L120 86 L118 81 L113 79 L118 77 Z" fill="#F59E0B" />
        </svg>
      );

    case 'teacher-classroom':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Classroom wall & wooden floor */}
          <rect width="240" height="150" rx="10" fill="#FBF6EE" />
          <rect y="116" width="240" height="34" fill="#DFC9A8" />
          {/* Green chalkboard with wood frame */}
          <rect x="82" y="16" width="142" height="78" rx="5" fill="#8B5A2B" />
          <rect x="88" y="22" width="130" height="66" rx="2" fill="#1E5631" />
          {/* Chalk diagrams (geometric shapes & lines — zero text) */}
          <circle cx="116" cy="46" r="11" fill="none" stroke="#FEF9C3" strokeWidth="2.2" />
          <polygon points="146,56 158,34 170,56" fill="none" stroke="#FDE68A" strokeWidth="2.2" />
          <line x1="182" y1="38" x2="206" y2="38" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
          <line x1="182" y1="48" x2="202" y2="48" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          <line x1="102" y1="72" x2="204" y2="72" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 5" opacity="0.6" />
          {/* Chalk tray */}
          <rect x="116" y="92" width="66" height="5" rx="2" fill="#6D441F" />
          <rect x="128" y="89" width="14" height="3.5" rx="1" fill="#FFFFFF" />
          <rect x="150" y="88" width="18" height="4.5" rx="1" fill="#F59E0B" />

          {/* Teacher figure (Left) */}
          <path d="M32 42 C32 23, 66 23, 66 42 L68 62 L30 62 Z" fill="#292524" />
          <circle cx="49" cy="44" r="15" fill="#F8D2B4" />
          {/* Glasses */}
          <circle cx="43.5" cy="44" r="4" fill="none" stroke="#1C1917" strokeWidth="1.5" />
          <circle cx="54.5" cy="44" r="4" fill="none" stroke="#1C1917" strokeWidth="1.5" />
          <line x1="47.5" y1="44" x2="50.5" y2="44" stroke="#1C1917" strokeWidth="1.4" />
          <path d="M45 52 Q49 55 53 52" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
          {/* Burgundy blazer & white blouse */}
          <path d="M28 76 C28 62, 70 62, 70 76 L74 132 H24 Z" fill="#991B1B" />
          <path d="M42 66 L49 92 L56 66 Z" fill="#FFFFFF" />
          {/* Pointer stick pointing at chalkboard */}
          <path d="M64 82 L82 70" stroke="#991B1B" strokeWidth="8" strokeLinecap="round" />
          <circle cx="84" cy="69" r="4.5" fill="#F8D2B4" />
          <line x1="85" y1="68" x2="128" y2="46" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          {/* Teacher podium/desk with apple & books */}
          <rect x="132" y="106" width="84" height="44" rx="3" fill="#B47B44" />
          <rect x="128" y="102" width="92" height="8" rx="2" fill="#8B5A2B" />
          <rect x="144" y="94" width="32" height="8" rx="1.5" fill="#2563EB" />
          <rect x="148" y="88" width="26" height="6" rx="1.5" fill="#DC2626" />
          <circle cx="196" cy="95" r="7" fill="#DC2626" />
          <path d="M196 88 Q200 83 203 86" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'student-desk':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F5F0E6" />
          {/* Window on right */}
          <rect x="166" y="14" width="56" height="58" rx="4" fill="#BAE6FD" stroke="#A67C52" strokeWidth="3" />
          <line x1="194" y1="14" x2="194" y2="72" stroke="#A67C52" strokeWidth="2.5" />
          <line x1="166" y1="43" x2="222" y2="43" stroke="#A67C52" strokeWidth="2.5" />
          {/* Potted plant on windowsill */}
          <polygon points="184,72 198,72 195,60 187,60" fill="#C2410C" />
          <ellipse cx="187" cy="56" rx="5" ry="7" transform="rotate(-25 187 56)" fill="#16A34A" />
          <ellipse cx="195" cy="56" rx="5" ry="7" transform="rotate(25 195 56)" fill="#15803D" />

          {/* Desk lamp (Left) with warm glow cone */}
          <polygon points="44,54 88,98 20,98" fill="#FDE047" opacity="0.22" />
          <line x1="36" y1="98" x2="36" y2="62" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          <line x1="36" y1="62" x2="50" y2="52" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 50 L60 44 L64 56 L42 60 Z" fill="#D97706" />
          <rect x="24" y="94" width="24" height="6" rx="3" fill="#334155" />

          {/* Student sitting at desk */}
          <circle cx="116" cy="44" r="16" fill="#F8D2B4" />
          <path d="M100 42 C100 24, 132 24, 132 42 C126 34, 106 34, 100 42 Z" fill="#1C1917" />
          <circle cx="111" cy="45" r="1.7" fill="#1C1917" />
          <circle cx="121" cy="45" r="1.7" fill="#1C1917" />
          <path d="M112 51 Q116 54 120 51" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
          {/* Blue-green sweater */}
          <path d="M88 98 C88 64, 144 64, 144 98 Z" fill="#0F766E" />
          <path d="M108 66 L116 76 L124 66" fill="#FFFFFF" />
          {/* Hands resting near open book */}
          <circle cx="96" cy="94" r="5" fill="#F8D2B4" />
          <circle cx="136" cy="94" r="5" fill="#F8D2B4" />

          {/* Wooden study desk */}
          <rect x="20" y="98" width="200" height="12" rx="3" fill="#B47B44" />
          <rect x="34" y="110" width="10" height="36" fill="#8B5A2B" />
          <rect x="196" y="110" width="10" height="36" fill="#8B5A2B" />
          {/* Open textbook on desk */}
          <path d="M86 98 L116 90 L116 99 L86 102 Z" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="1.6" />
          <path d="M146 98 L116 90 L116 99 L146 102 Z" fill="#FFFBEB" stroke="#B91C1C" strokeWidth="1.6" />
          {/* Pencil cup */}
          <rect x="166" y="82" width="16" height="16" rx="2" fill="#2563EB" />
          <line x1="170" y1="82" x2="167" y2="70" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="177" y1="82" x2="180" y2="71" stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" />
          {/* Backpack leaning on right */}
          <rect x="194" y="114" width="24" height="28" rx="7" fill="#DC2626" />
          <rect x="199" y="124" width="14" height="11" rx="3" fill="#FCA5A5" />
        </svg>
      );

    case 'laptop-new':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F4F6FA" />
          {/* Wooden desk surface */}
          <rect y="102" width="240" height="48" fill="#DFC39D" />
          <line x1="0" y1="102" x2="240" y2="102" stroke="#B89364" strokeWidth="2.5" />

          {/* Small desk plant on left */}
          <rect x="20" y="88" width="22" height="22" rx="3" fill="#C2410C" />
          <path d="M31 88 Q20 72 26 62 Q33 72 31 88 Z" fill="#15803D" />
          <path d="M31 88 Q42 70 36 60 Q29 72 31 88 Z" fill="#22C55E" />

          {/* Modern sleek laptop */}
          <rect x="60" y="24" width="120" height="76" rx="7" fill="#1E293B" />
          <rect x="66" y="30" width="108" height="64" rx="3" fill="#E0F2FE" />
          {/* Abstract colorful UI panels on screen (zero text) */}
          <rect x="72" y="36" width="30" height="52" rx="3" fill="#FFFFFF" />
          <rect x="76" y="42" width="22" height="6" rx="2" fill="#94A3B8" />
          <rect x="76" y="53" width="18" height="5" rx="2" fill="#CBD5E1" />
          <rect x="76" y="63" width="20" height="5" rx="2" fill="#CBD5E1" />
          <rect x="108" y="36" width="60" height="24" rx="3" fill="#3B82F6" opacity="0.85" />
          <rect x="108" y="65" width="28" height="23" rx="3" fill="#F59E0B" opacity="0.85" />
          <rect x="140" y="65" width="28" height="23" rx="3" fill="#10B981" opacity="0.85" />
          <circle cx="120" cy="27" r="1.5" fill="#64748B" />
          {/* Laptop aluminum base & keyboard deck */}
          <path d="M46 100 H194 L204 114 H36 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.8" />
          <rect x="64" y="103" width="112" height="4" rx="1.5" fill="#64748B" opacity="0.5" />
          <rect x="104" y="109" width="32" height="3" rx="1.5" fill="#94A3B8" />

          {/* Wireless mouse & coffee mug on right */}
          <ellipse cx="216" cy="116" rx="10" ry="6" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.6" />
          <line x1="216" y1="110" x2="216" y2="115" stroke="#64748B" strokeWidth="1.4" />
          <rect x="200" y="78" width="20" height="22" rx="3" fill="#B91C1C" />
          <path d="M220 83 C227 83, 227 95, 220 95" fill="none" stroke="#B91C1C" strokeWidth="3" />

          {/* Golden brand-new shine sparkles */}
          <path d="M192 16 L195 25 L204 28 L195 31 L192 40 L189 31 L180 28 L189 25 Z" fill="#F59E0B" />
          <path d="M48 20 L50 25 L55 27 L50 29 L48 34 L46 29 L41 27 L46 25 Z" fill="#FBBF24" />
          <circle cx="208" cy="44" r="3" fill="#F59E0B" />
        </svg>
      );

    case 'cooking-noodles':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Warm kitchen tile backdrop */}
          <rect width="240" height="150" rx="10" fill="#FFF7ED" />
          <line x1="0" y1="36" x2="240" y2="36" stroke="#FED7AA" strokeWidth="1.2" />
          <line x1="0" y1="72" x2="240" y2="72" stroke="#FED7AA" strokeWidth="1.2" />
          <rect y="108" width="240" height="42" fill="#E7D2B8" />

          {/* Rising steam ribbons */}
          <path d="M84 52 C78 40, 92 32, 84 18" fill="none" stroke="#9CA3AF" strokeWidth="2.8" strokeLinecap="round" opacity="0.65" />
          <path d="M108 44 C102 32, 116 24, 108 12" fill="none" stroke="#9CA3AF" strokeWidth="2.8" strokeLinecap="round" opacity="0.65" />
          <path d="M134 50 C128 38, 142 30, 134 18" fill="none" stroke="#9CA3AF" strokeWidth="2.8" strokeLinecap="round" opacity="0.55" />

          {/* Golden wavy noodles lifted by chopsticks */}
          <path d="M116 40 C112 58, 120 70, 114 86" fill="none" stroke="#F59E0B" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M124 38 C128 56, 118 70, 124 86" fill="none" stroke="#FBBF24" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M132 42 C136 58, 128 72, 132 86" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />

          {/* Wooden chopsticks lifting noodles */}
          <line x1="106" y1="42" x2="206" y2="18" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="108" y1="48" x2="212" y2="32" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" />

          {/* Broth & toppings inside bowl rim */}
          <ellipse cx="116" cy="84" rx="58" ry="15" fill="#FDE68A" stroke="#B91C1C" strokeWidth="2.5" />
          {/* Poached egg half */}
          <ellipse cx="86" cy="83" rx="12" ry="7" fill="#FFFFFF" />
          <circle cx="88" cy="83" r="4.5" fill="#F97316" />
          {/* Green bok choy / scallions */}
          <ellipse cx="144" cy="82" rx="10" ry="5" fill="#16A34A" />
          <circle cx="106" cy="88" r="2.6" fill="#15803D" />
          <circle cx="132" cy="89" r="2.6" fill="#15803D" />
          <circle cx="120" cy="91" r="2.4" fill="#16A34A" />

          {/* Red & gold ceramic noodle bowl */}
          <path d="M58 84 C58 130, 174 130, 174 84 Z" fill="#B91C1C" />
          <path d="M68 96 Q116 108 164 96" fill="none" stroke="#FBBF24" strokeWidth="3" />
          <rect x="86" y="125" width="60" height="8" rx="3" fill="#7F1D1D" />

          {/* Small ceramic spoon on left */}
          <ellipse cx="36" cy="118" rx="11" ry="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.6" />
          <line x1="25" y1="117" x2="14" y2="108" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );

    case 'cooking-dumplings':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FDF8F0" />
          {/* Wooden table surface */}
          <rect y="94" width="240" height="56" fill="#E6CFAF" />

          {/* Bamboo steamer basket in back right */}
          <ellipse cx="182" cy="80" rx="38" ry="12" fill="#D4A373" stroke="#9C6644" strokeWidth="2" />
          <rect x="144" y="80" width="76" height="22" fill="#DDA15E" stroke="#9C6644" strokeWidth="2" />
          <ellipse cx="182" cy="102" rx="38" ry="12" fill="#C68B59" stroke="#9C6644" strokeWidth="2" />
          {/* Steam rising from bamboo steamer */}
          <path d="M168 62 C164 50, 174 44, 170 32" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
          <path d="M190 60 C186 48, 196 42, 192 28" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />

          {/* Large ceramic plate in foreground */}
          <ellipse cx="102" cy="108" rx="72" ry="25" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2.6" />
          <ellipse cx="102" cy="108" rx="58" ry="18" fill="#FEF2F2" />

          {/* Pleated crescent dumplings (Jiaozi) */}
          <g>
            <path d="M56 106 C60 80, 96 80, 100 106 Q78 112 56 106 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
            <path d="M64 92 Q78 82 92 92" fill="none" stroke="#D97706" strokeWidth="1.6" strokeDasharray="3 3" />
          </g>
          <g>
            <path d="M102 108 C106 82, 142 82, 146 108 Q124 114 102 108 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
            <path d="M110 94 Q124 84 138 94" fill="none" stroke="#D97706" strokeWidth="1.6" strokeDasharray="3 3" />
          </g>
          <g>
            <path d="M78 92 C82 66, 120 66, 124 92 Q101 98 78 92 Z" fill="#FFFBEB" stroke="#B45309" strokeWidth="2.4" />
            <path d="M86 78 Q101 68 116 78" fill="none" stroke="#B45309" strokeWidth="1.8" strokeDasharray="3 3" />
          </g>
          {/* Steam from hot dumplings */}
          <path d="M94 58 C90 48, 98 42, 94 32" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
          <path d="M112 56 C108 46, 116 40, 112 30" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />

          {/* Soy sauce dipping dish & chopsticks */}
          <ellipse cx="196" cy="126" rx="22" ry="9" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.8" />
          <ellipse cx="196" cy="126" rx="15" ry="5.5" fill="#451A03" />
          <line x1="20" y1="62" x2="72" y2="80" stroke="#78350F" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="16" y1="70" x2="70" y2="85" stroke="#92400E" strokeWidth="3.6" strokeLinecap="round" />
        </svg>
      );

    case 'family-four':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Warm home background & pitched roof */}
          <rect width="240" height="150" rx="10" fill="#FFFBF2" />
          <path d="M18 52 L120 12 L222 52" fill="none" stroke="#B91C1C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="52" width="180" height="86" fill="#FEF3C7" opacity="0.45" />
          {/* Cozy floor rug */}
          <ellipse cx="120" cy="134" rx="92" ry="10" fill="#E7D2B8" />

          {/* 1. Father (Tallest, left — navy sweater) */}
          <path d="M40 90 C40 72, 76 72, 76 90 L78 132 H38 Z" fill="#1E40AF" />
          <circle cx="58" cy="54" r="14" fill="#F8D2B4" />
          <path d="M44 52 C44 37, 72 37, 72 52 C66 45, 50 45, 44 52 Z" fill="#1C1917" />
          <circle cx="54" cy="54" r="1.5" fill="#1C1917" />
          <circle cx="62" cy="54" r="1.5" fill="#1C1917" />
          <path d="M55 60 Q58 63 61 60" fill="none" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

          {/* 2. Mother (Second, crimson dress) */}
          <path d="M84 94 C84 76, 118 76, 118 94 L122 132 H80 Z" fill="#B91C1C" />
          <path d="M86 54 C86 38, 116 38, 116 54 L118 72 L84 72 Z" fill="#3B2314" />
          <circle cx="101" cy="57" r="13" fill="#F8D2B4" />
          <circle cx="97" cy="57" r="1.5" fill="#1C1917" />
          <circle cx="105" cy="57" r="1.5" fill="#1C1917" />
          <path d="M98 63 Q101 66 104 63" fill="none" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

          {/* 3. Older Child (Jade shirt) */}
          <path d="M128 104 C128 90, 156 90, 156 104 L158 132 H126 Z" fill="#15803D" />
          <circle cx="142" cy="76" r="11.5" fill="#F8D2B4" />
          <path d="M131 74 C131 61, 153 61, 153 74 Z" fill="#1C1917" />
          <circle cx="138.5" cy="76" r="1.4" fill="#1C1917" />
          <circle cx="145.5" cy="76" r="1.4" fill="#1C1917" />
          <path d="M139 81 Q142 84 145 81" fill="none" stroke="#9A3412" strokeWidth="1.4" strokeLinecap="round" />

          {/* 4. Younger Child (Gold dress with pigtails) */}
          <path d="M168 108 C168 96, 194 96, 194 108 L197 132 H165 Z" fill="#D97706" />
          <circle cx="169" cy="80" r="5" fill="#292524" />
          <circle cx="193" cy="80" r="5" fill="#292524" />
          <circle cx="181" cy="83" r="10.5" fill="#F8D2B4" />
          <path d="M171 81 C171 70, 191 70, 191 81 Z" fill="#292524" />
          <circle cx="178" cy="83" r="1.3" fill="#1C1917" />
          <circle cx="184" cy="83" r="1.3" fill="#1C1917" />
          <path d="M178.5 87.5 Q181 90 183.5 87.5" fill="none" stroke="#9A3412" strokeWidth="1.3" strokeLinecap="round" />

          {/* Warm heart under roof peak */}
          <path d="M120 38 C120 33, 113 33, 113 38 C113 43, 120 47, 120 49 C120 47, 127 43, 127 38 C127 33, 120 33, 120 38 Z" fill="#EF4444" />
        </svg>
      );

    case 'two-children':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Sunny park sky & green grass */}
          <rect width="240" height="150" rx="10" fill="#E0F2FE" />
          <circle cx="204" cy="28" r="14" fill="#FBBF24" />
          <ellipse cx="52" cy="28" rx="20" ry="9" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="66" cy="24" rx="14" ry="8" fill="#FFFFFF" opacity="0.9" />
          <path d="M0 108 Q120 96 240 108 L240 150 L0 150 Z" fill="#86EFAC" />

          {/* Child 1 (Boy on left — green tee & blue overalls) */}
          <path d="M56 84 C56 70, 92 70, 92 84 L96 128 H52 Z" fill="#16A34A" />
          <rect x="60" y="96" width="28" height="32" rx="4" fill="#2563EB" />
          <circle cx="74" cy="54" r="15" fill="#F8D2B4" />
          <path d="M59 52 C59 35, 89 35, 89 52 C83 45, 65 45, 59 52 Z" fill="#1C1917" />
          <circle cx="69" cy="54" r="1.7" fill="#1C1917" />
          <circle cx="79" cy="54" r="1.7" fill="#1C1917" />
          <path d="M70 61 Q74 65 78 61" fill="none" stroke="#9A3412" strokeWidth="1.7" strokeLinecap="round" />

          {/* Child 2 (Girl on right — red dress with pigtails) */}
          <path d="M148 92 C148 78, 182 78, 182 92 L188 128 H142 Z" fill="#DC2626" />
          <circle cx="147" cy="58" r="6.5" fill="#3B2314" />
          <circle cx="183" cy="58" r="6.5" fill="#3B2314" />
          <circle cx="165" cy="60" r="14" fill="#F8D2B4" />
          <path d="M151 58 C151 43, 179 43, 179 58 Z" fill="#3B2314" />
          <circle cx="160.5" cy="60" r="1.6" fill="#1C1917" />
          <circle cx="169.5" cy="60" r="1.6" fill="#1C1917" />
          <path d="M161 66 Q165 70 169 66" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />

          {/* Colorful bouncing play ball between the two children */}
          <circle cx="120" cy="112" r="14" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M108 106 Q120 112 132 106" fill="none" stroke="#DC2626" strokeWidth="2.5" />
          <path d="M110 120 Q120 114 130 120" fill="none" stroke="#2563EB" strokeWidth="2.5" />
        </svg>
      );

    case 'calendar-sep8':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Warm desk background — strictly ZERO text/numbers */}
          <rect width="240" height="150" rx="10" fill="#FBF5EC" />
          <rect y="114" width="240" height="36" fill="#DFC39D" />

          {/* Wall / desk spiral calendar */}
          <rect x="62" y="20" width="116" height="106" rx="10" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.4" />
          <path d="M62 30 A10 10 0 0 1 72 20 H168 A10 10 0 0 1 178 30 V48 H62 Z" fill="#B91C1C" />
          {/* Metallic spiral binding rings */}
          <rect x="82" y="12" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="108" y="12" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="134" y="12" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="156" y="12" width="7" height="18" rx="3.5" fill="#475569" />
          {/* Header decorative bar */}
          <rect x="92" y="34" width="56" height="6" rx="3" fill="#FCA5A5" />

          {/* 5-column x 3-row visual calendar date grid with highlighted red circled day */}
          {[0, 1, 2, 3, 4].map((col) =>
            [0, 1, 2].map((row) => {
              const cx = 76 + col * 20;
              const cy = 60 + row * 20;
              const isHighlighted = col === 2 && row === 1;
              return (
                <g key={`${col}-${row}`}>
                  <rect
                    x={cx - 6}
                    y={cy - 6}
                    width="12"
                    height="12"
                    rx="3"
                    fill={isHighlighted ? '#B91C1C' : '#F3EDE3'}
                  />
                  {isHighlighted && (
                    <circle cx={cx} cy={cy} r="9.5" fill="none" stroke="#D97706" strokeWidth="2.2" />
                  )}
                </g>
              );
            })
          )}

          {/* Small analog desk clock on right */}
          <circle cx="206" cy="102" r="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.4" />
          <line x1="206" y1="102" x2="206" y2="91" stroke="#B91C1C" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="206" y1="102" x2="215" y2="105" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="206" cy="102" r="2.2" fill="#B91C1C" />

          {/* Autumn leaf accent on left */}
          <path d="M26 98 C22 84, 38 76, 44 90 C38 102, 28 104, 26 98 Z" fill="#EA580C" />
          <line x1="20" y1="106" x2="38" y2="88" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'calendar-sunday-rest':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Sunny weekend living room — zero text */}
          <rect width="240" height="150" rx="10" fill="#FEF9EF" />
          <rect y="114" width="240" height="36" fill="#E5D1B3" />

          {/* Window with bright golden Sunday sun */}
          <rect x="20" y="16" width="66" height="58" rx="5" fill="#BAE6FD" stroke="#A67C52" strokeWidth="3" />
          <circle cx="44" cy="36" r="12" fill="#FBBF24" />
          <line x1="20" y1="45" x2="86" y2="45" stroke="#A67C52" strokeWidth="2.2" />
          <line x1="53" y1="16" x2="53" y2="74" stroke="#A67C52" strokeWidth="2.2" />

          {/* Small wall calendar highlighting weekend column in red */}
          <rect x="176" y="18" width="44" height="44" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.8" />
          <rect x="176" y="18" width="44" height="11" rx="3" fill="#B91C1C" />
          <rect x="205" y="34" width="9" height="22" rx="2" fill="#FCA5A5" />
          <circle cx="209.5" cy="45" r="4" fill="#B91C1C" />

          {/* Plush green sofa */}
          <rect x="52" y="76" width="136" height="44" rx="12" fill="#15803D" />
          <rect x="44" y="88" width="18" height="34" rx="6" fill="#166534" />
          <rect x="178" y="88" width="18" height="34" rx="6" fill="#166534" />
          {/* Soft mustard pillow */}
          <rect x="64" y="82" width="24" height="18" rx="6" fill="#F59E0B" />

          {/* Relaxing person reclining on sofa with cozy blanket */}
          <circle cx="88" cy="76" r="13" fill="#F8D2B4" />
          <path d="M76 74 C76 62, 100 62, 100 74 Z" fill="#292524" />
          {/* Closed peaceful eyes */}
          <path d="M82 76 Q85 78 88 76" fill="none" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M90 76 Q93 78 96 76" fill="none" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M100 84 Q138 78 172 94 L172 112 H96 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.8" />

          {/* Dreamy floating clouds/stars (no Zzz text) */}
          <circle cx="114" cy="54" r="4" fill="#F59E0B" opacity="0.7" />
          <circle cx="128" cy="44" r="6" fill="#FBBF24" opacity="0.75" />
          <path d="M146 28 L148 34 L154 36 L148 38 L146 44 L144 38 L138 36 L144 34 Z" fill="#D97706" />
        </svg>
      );

    case 'china-landmark':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Warm sunrise sky & misty mountains */}
          <rect width="240" height="150" rx="10" fill="#FEF3C7" />
          <circle cx="194" cy="34" r="18" fill="#EF4444" opacity="0.75" />
          <path d="M0 112 Q50 70 105 104 Q165 62 240 108 L240 150 L0 150 Z" fill="#A7C4A0" opacity="0.65" />
          {/* Jade pond foreground */}
          <rect y="116" width="240" height="34" fill="#6EE7B7" opacity="0.55" />

          {/* Multi-tiered Chinese Temple / Pagoda */}
          {/* Top roof */}
          <path d="M92 38 Q120 18 148 38 Q138 42 120 42 Q102 42 92 38 Z" fill="#B91C1C" />
          <line x1="120" y1="16" x2="120" y2="27" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          {/* Upper floor */}
          <rect x="102" y="42" width="36" height="18" fill="#FEF2F2" stroke="#B91C1C" strokeWidth="2" />
          {/* Middle curved eaves roof */}
          <path d="M68 68 Q120 46 172 68 Q154 74 120 74 Q86 74 68 68 Z" fill="#D97706" />
          {/* Main hall & red pillars */}
          <rect x="82" y="74" width="76" height="42" fill="#FFF7ED" stroke="#B91C1C" strokeWidth="2" />
          <rect x="88" y="74" width="6" height="42" fill="#B91C1C" />
          <rect x="108" y="74" width="6" height="42" fill="#B91C1C" />
          <rect x="126" y="74" width="6" height="42" fill="#B91C1C" />
          <rect x="146" y="74" width="6" height="42" fill="#B91C1C" />
          {/* Stone terrace steps */}
          <rect x="66" y="114" width="108" height="10" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          {/* Red paper lanterns hanging from eaves */}
          <ellipse cx="76" cy="80" rx="5" ry="7" fill="#DC2626" />
          <ellipse cx="164" cy="80" rx="5" ry="7" fill="#DC2626" />
        </svg>
      );

    case 'doctor-hospital':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#EFF6FF" />
          <rect y="118" width="240" height="32" fill="#CBD5E1" />

          {/* Hospital building on right */}
          <rect x="108" y="24" width="110" height="96" rx="6" fill="#FFFFFF" stroke="#64748B" strokeWidth="2.2" />
          <rect x="155" y="34" width="16" height="42" rx="2" fill="#DC2626" />
          <rect x="142" y="47" width="42" height="16" rx="2" fill="#DC2626" />
          {/* Windows & entrance door */}
          <rect x="120" y="84" width="18" height="14" rx="2" fill="#93C5FD" />
          <rect x="188" y="84" width="18" height="14" rx="2" fill="#93C5FD" />
          <rect x="150" y="88" width="26" height="32" rx="2" fill="#3B82F6" opacity="0.45" />

          {/* Doctor figure on left in white coat & stethoscope */}
          <circle cx="58" cy="48" r="15" fill="#F8D2B4" />
          <path d="M43 46 C43 29, 73 29, 73 46 C67 38, 49 38, 43 46 Z" fill="#1C1917" />
          <circle cx="53" cy="48" r="1.6" fill="#1C1917" />
          <circle cx="63" cy="48" r="1.6" fill="#1C1917" />
          <path d="M54 55 Q58 58 62 55" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
          {/* White lab coat over teal scrubs */}
          <path d="M34 84 C34 66, 82 66, 82 84 L86 134 H30 Z" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
          <path d="M50 68 L58 96 L66 68 Z" fill="#0D9488" />
          {/* Stethoscope around neck */}
          <path d="M46 68 C42 86, 74 86, 70 68" fill="none" stroke="#334155" strokeWidth="2.8" />
          <circle cx="70" cy="88" r="4.5" fill="#94A3B8" stroke="#334155" strokeWidth="1.8" />
          {/* Clipboard in hand */}
          <rect x="76" y="88" width="18" height="24" rx="2" fill="#B45309" />
          <rect x="79" y="92" width="12" height="17" fill="#FFFFFF" />
        </svg>
      );

    case 'drinking-tea':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F6F7F0" />
          {/* Bamboo tea tray */}
          <rect x="24" y="102" width="192" height="26" rx="6" fill="#B6895B" stroke="#78502C" strokeWidth="2.2" />
          <line x1="36" y1="112" x2="204" y2="112" stroke="#8C5E35" strokeWidth="1.8" />

          {/* Traditional terracotta clay teapot on left pouring tea */}
          <ellipse cx="74" cy="76" rx="28" ry="22" fill="#B45309" stroke="#78350F" strokeWidth="2.2" />
          <ellipse cx="74" cy="54" rx="14" ry="5" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <circle cx="74" cy="48" r="4" fill="#92400E" />
          {/* Handle & spout */}
          <path d="M46 66 C28 66, 28 88, 48 86" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 72 L122 58" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
          {/* Golden-green pouring tea arc */}
          <path d="M123 59 Q142 64 148 84" fill="none" stroke="#65A30D" strokeWidth="4" strokeLinecap="round" />

          {/* Jade porcelain teacup on right */}
          <path d="M124 80 H182 L176 108 C174 114, 132 114, 130 108 Z" fill="#A7F3D0" stroke="#047857" strokeWidth="2.4" />
          <ellipse cx="153" cy="80" rx="29" ry="6" fill="#84CC16" opacity="0.6" stroke="#047857" strokeWidth="2" />
          <path d="M181 86 C196 86, 196 102, 178 102" fill="none" stroke="#047857" strokeWidth="3.5" />

          {/* Fragrant rising steam curls */}
          <path d="M144 64 C140 52, 150 44, 144 32" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M164 62 C160 50, 170 42, 164 28" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" />
          {/* Fresh tea leaves accent */}
          <ellipse cx="204" cy="96" rx="8" ry="4" transform="rotate(-25 204 96)" fill="#15803D" />
          <ellipse cx="212" cy="100" rx="7" ry="3.5" transform="rotate(20 212 100)" fill="#22C55E" />
        </svg>
      );

    case 'speaking-phone':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F5F3FF" />
          <rect y="120" width="240" height="30" fill="#DDD6FE" />

          {/* Smiling person holding phone to ear */}
          <path d="M62 88 C62 68, 126 68, 126 88 L132 138 H56 Z" fill="#2563EB" />
          <circle cx="94" cy="52" r="18" fill="#F8D2B4" />
          <path d="M76 50 C76 30, 112 30, 112 50 C105 40, 83 40, 76 50 Z" fill="#1E293B" />
          <circle cx="88" cy="52" r="1.8" fill="#1C1917" />
          <circle cx="100" cy="52" r="1.8" fill="#1C1917" />
          <path d="M89 59 Q94 64 99 59" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />

          {/* Arm raised holding smartphone to ear */}
          <path d="M120 92 L134 62" stroke="#2563EB" strokeWidth="11" strokeLinecap="round" />
          <rect x="114" y="42" width="16" height="30" rx="4" transform="rotate(14 122 57)" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="117" y="47" width="10" height="19" rx="1.5" transform="rotate(14 122 57)" fill="#38BDF8" />
          <circle cx="132" cy="60" r="5.5" fill="#F8D2B4" />

          {/* Vivid golden voice/signal waves */}
          <path d="M148 44 C158 50, 158 66, 148 72" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M162 34 C178 46, 178 70, 162 82" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <path d="M176 26 C196 42, 196 74, 176 90" fill="none" stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
        </svg>
      );

    case 'reading-book':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FDF6EC" />
          {/* Bookshelf in background */}
          <rect x="166" y="18" width="56" height="96" rx="4" fill="#A67C52" />
          <rect x="172" y="26" width="10" height="24" fill="#DC2626" />
          <rect x="184" y="30" width="8" height="20" fill="#2563EB" />
          <rect x="194" y="24" width="11" height="26" fill="#15803D" />
          <rect x="207" y="28" width="9" height="22" fill="#D97706" />
          <rect x="172" y="64" width="12" height="22" fill="#7C3AED" />
          <rect x="186" y="62" width="10" height="24" fill="#0D9488" />
          <rect x="198" y="66" width="14" height="20" fill="#B91C1C" />

          {/* Cozy armchair & reader holding open hardcover book */}
          <rect x="26" y="68" width="114" height="62" rx="14" fill="#D97706" />
          <circle cx="84" cy="46" r="15" fill="#F8D2B4" />
          <path d="M69 44 C69 27, 99 27, 99 44 Z" fill="#292524" />
          <path d="M56 84 C56 64, 112 64, 112 84 Z" fill="#15803D" />

          {/* Large open book in foreground */}
          <path d="M40 80 C62 72, 76 76, 84 86 V126 C76 118, 60 116, 40 122 Z" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2.4" />
          <path d="M128 80 C106 72, 92 76, 84 86 V126 C92 118, 108 116, 128 122 Z" fill="#FFFBEB" stroke="#B91C1C" strokeWidth="2.4" />
          <line x1="50" y1="92" x2="74" y2="95" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="50" y1="102" x2="74" y2="105" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="94" y1="95" x2="118" y2="92" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="94" y1="105" x2="118" y2="102" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          {/* Red ribbon bookmark */}
          <path d="M84 124 L80 138 L84 134 L88 138 Z" fill="#DC2626" />
        </svg>
      );

    case 'office-busy':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F1F5F9" />
          {/* Wall clock */}
          <circle cx="196" cy="34" r="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.4" />
          <line x1="196" y1="34" x2="196" y2="22" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="196" y1="34" x2="206" y2="38" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

          {/* Office worker at computer desk */}
          <circle cx="118" cy="48" r="15" fill="#F8D2B4" />
          <path d="M103 46 C103 30, 133 30, 133 46 Z" fill="#1E293B" />
          <path d="M90 100 C90 66, 146 66, 146 100 Z" fill="#334155" />
          <path d="M112 68 L118 84 L124 68 Z" fill="#FFFFFF" />
          <line x1="118" y1="74" x2="118" y2="92" stroke="#DC2626" strokeWidth="3.5" />

          {/* Desk */}
          <rect x="16" y="100" width="208" height="12" rx="3" fill="#94A3B8" />
          <rect x="28" y="112" width="12" height="34" fill="#64748B" />
          <rect x="200" y="112" width="12" height="34" fill="#64748B" />

          {/* Tall stacks of folders/papers on left */}
          <rect x="24" y="88" width="44" height="12" rx="2" fill="#F59E0B" />
          <rect x="28" y="76" width="42" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
          <rect x="22" y="64" width="44" height="12" rx="2" fill="#3B82F6" />
          <rect x="26" y="52" width="42" height="12" rx="2" fill="#EF4444" />

          {/* Desktop monitor in front */}
          <rect x="148" y="64" width="54" height="36" rx="4" fill="#1E293B" />
          <rect x="152" y="68" width="46" height="26" rx="2" fill="#DBEAFE" />
          <rect x="170" y="100" width="10" height="4" fill="#334155" />

          {/* Steaming coffee cup */}
          <rect x="82" y="84" width="14" height="16" rx="2" fill="#B91C1C" />
          <path d="M89 78 C87 72, 93 70, 90 64" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'birthday-cake':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FFF1F2" />
          {/* Floating party balloons */}
          <ellipse cx="42" cy="44" rx="16" ry="20" fill="#F43F5E" />
          <path d="M42 64 Q38 82 44 98" fill="none" stroke="#94A3B8" strokeWidth="1.6" />
          <ellipse cx="198" cy="42" rx="16" ry="20" fill="#3B82F6" />
          <path d="M198 62 Q202 80 196 98" fill="none" stroke="#94A3B8" strokeWidth="1.6" />
          {/* Confetti dots */}
          <circle cx="76" cy="26" r="3" fill="#F59E0B" />
          <circle cx="164" cy="24" r="3.5" fill="#10B981" />
          <circle cx="182" cy="76" r="3" fill="#F59E0B" />
          <circle cx="62" cy="74" r="3" fill="#8B5CF6" />

          {/* Cake stand */}
          <ellipse cx="120" cy="126" rx="64" ry="10" fill="#CBD5E1" />
          {/* Bottom tier */}
          <rect x="66" y="88" width="108" height="36" rx="7" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
          <path d="M66 98 Q80 108 93 98 Q106 108 120 98 Q134 108 147 98 Q160 108 174 98" fill="none" stroke="#F43F5E" strokeWidth="4" />
          {/* Top tier */}
          <rect x="84" y="60" width="72" height="28" rx="6" fill="#FECDD3" stroke="#E11D48" strokeWidth="2" />
          {/* Lit candles */}
          <rect x="98" y="38" width="6" height="22" rx="2" fill="#3B82F6" />
          <rect x="117" y="34" width="6" height="26" rx="2" fill="#10B981" />
          <rect x="136" y="38" width="6" height="22" rx="2" fill="#F59E0B" />
          <ellipse cx="101" cy="31" rx="4" ry="6" fill="#F97316" />
          <ellipse cx="120" cy="27" rx="4.5" ry="6.5" fill="#FBBF24" />
          <ellipse cx="139" cy="31" rx="4" ry="6" fill="#F97316" />
        </svg>
      );

    case 'tennis-sport':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Outdoor green tennis court & sky */}
          <rect width="240" height="150" rx="10" fill="#E0F2FE" />
          <rect y="82" width="240" height="68" fill="#15803D" />
          <line x1="0" y1="98" x2="240" y2="98" stroke="#FFFFFF" strokeWidth="2.5" />
          {/* White court net */}
          <rect x="16" y="72" width="208" height="16" fill="#FFFFFF" opacity="0.35" stroke="#FFFFFF" strokeWidth="1.6" />

          {/* Detailed strung tennis racket */}
          <g transform="rotate(-26 98 68)">
            <ellipse cx="98" cy="54" rx="26" ry="34" fill="#FEF3C7" fillOpacity="0.35" stroke="#B91C1C" strokeWidth="5" />
            <line x1="82" y1="30" x2="82" y2="78" stroke="#64748B" strokeWidth="1.2" />
            <line x1="92" y1="22" x2="92" y2="86" stroke="#64748B" strokeWidth="1.2" />
            <line x1="104" y1="22" x2="104" y2="86" stroke="#64748B" strokeWidth="1.2" />
            <line x1="114" y1="30" x2="114" y2="78" stroke="#64748B" strokeWidth="1.2" />
            <line x1="74" y1="42" x2="122" y2="42" stroke="#64748B" strokeWidth="1.2" />
            <line x1="72" y1="54" x2="124" y2="54" stroke="#64748B" strokeWidth="1.2" />
            <line x1="74" y1="66" x2="122" y2="66" stroke="#64748B" strokeWidth="1.2" />
            <rect x="93" y="88" width="10" height="44" rx="4" fill="#1E293B" />
          </g>

          {/* Neon tennis ball with motion arc */}
          <path d="M138 60 Q158 46 176 46" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="5 4" />
          <circle cx="182" cy="46" r="15" fill="#A3E635" stroke="#4D7C0F" strokeWidth="2" />
          <path d="M172 36 Q182 46 172 56" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M192 36 Q182 46 192 56" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );

    case 'writing-hanzi':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Traditional calligraphy desk */}
          <rect width="240" height="150" rx="10" fill="#EFE4D2" />
          {/* Rice paper scroll with grid & red seal (decorative abstract brush stroke, zero readable clue) */}
          <rect x="34" y="18" width="124" height="112" rx="4" fill="#FFFDF8" stroke="#B45309" strokeWidth="2.2" />
          <line x1="96" y1="18" x2="96" y2="130" stroke="#FCA5A5" strokeWidth="1.4" strokeDasharray="5 4" />
          <line x1="34" y1="74" x2="158" y2="74" stroke="#FCA5A5" strokeWidth="1.4" strokeDasharray="5 4" />
          {/* Decorative sweeping ink calligraphy swirl */}
          <path d="M58 54 C76 42, 114 42, 132 52 C110 66, 74 78, 62 96 C84 90, 116 92, 134 102" fill="none" stroke="#1C1917" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Traditional red seal stamp */}
          <rect x="44" y="102" width="14" height="14" rx="2" fill="#B91C1C" />

          {/* Black slate inkstone on right */}
          <rect x="174" y="88" width="44" height="32" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="196" cy="104" rx="14" ry="9" fill="#0F172A" />

          {/* Bamboo calligraphy brush */}
          <path d="M214 20 L166 86 L174 92 L222 26 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          <path d="M166 86 L154 104 L174 92 Z" fill="#1C1917" />
        </svg>
      );

    case 'friends-cafe':
    default:
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FEF7EE" />
          {/* Warm hanging pendant lamp */}
          <line x1="120" y1="0" x2="120" y2="24" stroke="#78350F" strokeWidth="2.5" />
          <path d="M102 36 Q120 18 138 36 Z" fill="#D97706" />
          <polygon points="104,36 136,36 164,96 76,96" fill="#FDE68A" opacity="0.22" />

          {/* Friend 1 (Left) */}
          <circle cx="56" cy="54" r="15" fill="#F8D2B4" />
          <path d="M41 52 C41 34, 71 34, 71 52 Z" fill="#1C1917" />
          <path d="M34 94 C34 72, 78 72, 78 94 L82 136 H30 Z" fill="#D97706" />

          {/* Friend 2 (Right) */}
          <circle cx="184" cy="54" r="15" fill="#F8D2B4" />
          <path d="M168 52 C168 34, 200 34, 200 52 L202 68 L166 68 Z" fill="#3B2314" />
          <path d="M162 94 C162 72, 206 72, 206 94 L210 136 H158 Z" fill="#B91C1C" />

          {/* Round cafe table with two steaming coffee cups */}
          <rect x="80" y="92" width="80" height="9" rx="4" fill="#8B5A2B" />
          <rect x="115" y="101" width="10" height="38" fill="#6D441F" />
          <rect x="96" y="136" width="48" height="6" rx="3" fill="#6D441F" />
          {/* Cups & pastry */}
          <rect x="88" y="78" width="14" height="14" rx="2" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="1.8" />
          <rect x="138" y="78" width="14" height="14" rx="2" fill="#FFFFFF" stroke="#15803D" strokeWidth="1.8" />
          <ellipse cx="120" cy="88" rx="10" ry="4" fill="#F59E0B" />
        </svg>
      );
  }
}
