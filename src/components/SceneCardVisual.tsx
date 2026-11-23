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
  | 'friends-cafe'
  | 'supermarket-shopping'
  | 'taxi-ride'
  | 'cinema-movie'
  | 'cat-under-table'
  | 'dog-playing'
  | 'apples-fruit'
  | 'clothing-shop'
  | 'driving-car'
  | 'sleeping-bed'
  | 'rainy-weather'
  | 'snowy-weather'
  | 'taking-medicine'
  | 'breakfast-bread-egg'
  | 'train-station'
  | 'airport-plane'
  | 'singing-song'
  | 'steamed-buns'
  | 'watching-tv';

interface SceneCardVisualProps {
  sceneId: HskSceneId;
  className?: string;
}

/**
 * Rich, storybook-grade, multi-element, full-color SVG illustrations for official HSK 3.0
 * Listening (Part 1 & Part 3) and Reading (Part 1) visual scene cards.
 * Strictly ZERO text, Chinese characters, letters, or numerals inside any illustration.
 */
export function SceneCardVisual({ sceneId, className = 'w-full h-32' }: SceneCardVisualProps) {
  switch (sceneId) {
    case 'greeting-wave':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="sky-greet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
            <linearGradient id="path-greet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E7D7BE" />
              <stop offset="100%" stopColor="#D6BE9B" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#sky-greet)" />
          {/* Distant courtyard pavilion archway & foliage */}
          <circle cx="204" cy="26" r="14" fill="#FBBF24" />
          <circle cx="26" cy="76" r="28" fill="#4D9064" opacity="0.7" />
          <circle cx="48" cy="84" r="20" fill="#6BB582" opacity="0.8" />
          <circle cx="216" cy="74" r="28" fill="#4D9064" opacity="0.7" />
          <path d="M80 108 V48 A40 30 0 0 1 160 48 V108" fill="#FFF7ED" stroke="#C09A72" strokeWidth="4" />
          <path d="M72 48 Q120 26 168 48" fill="none" stroke="#B91C1C" strokeWidth="5" strokeLinecap="round" />
          {/* Hanging courtyard lantern */}
          <line x1="120" y1="36" x2="120" y2="45" stroke="#78350F" strokeWidth="1.6" />
          <ellipse cx="120" cy="51" rx="6" ry="8" fill="#DC2626" />
          <rect y="106" width="240" height="44" fill="url(#path-greet)" />

          {/* Person 1 (Left — terracotta jacket, waving hand + warm handshake) */}
          <ellipse cx="76" cy="138" rx="28" ry="6" fill="#B59B78" />
          <rect x="62" y="118" width="11" height="20" rx="4" fill="#1E293B" />
          <rect x="78" y="118" width="11" height="20" rx="4" fill="#1E293B" />
          <path d="M54 84 C54 67, 98 67, 98 84 L100 124 H52 Z" fill="#C2410C" />
          <path d="M68 74 L76 96 L84 74 Z" fill="#FFF7ED" />
          {/* Left raised waving arm */}
          <path d="M58 84 L38 58" stroke="#C2410C" strokeWidth="9.5" strokeLinecap="round" />
          <circle cx="35" cy="53" r="6" fill="#F8D2B4" />
          <path d="M23 44 Q20 53 25 60" fill="none" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M16 40 Q13 53 19 64" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          {/* Head & joyful face */}
          <circle cx="76" cy="48" r="17.5" fill="#F8D2B4" />
          <path d="M58 46 C58 27, 94 27, 94 46 C87 37, 65 37, 58 46 Z" fill="#1C1917" />
          <circle cx="71" cy="48" r="2" fill="#1C1917" />
          <circle cx="82" cy="48" r="2" fill="#1C1917" />
          <path d="M71 55 Q76.5 60 82 55" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <circle cx="66" cy="52" r="2.8" fill="#F472B6" opacity="0.38" />
          <circle cx="86" cy="52" r="2.8" fill="#F472B6" opacity="0.38" />
          {/* Right arm reaching forward */}
          <path d="M92 88 L116 96" stroke="#C2410C" strokeWidth="9" strokeLinecap="round" />

          {/* Person 2 (Right — emerald cardigan & skirt, shaking hands) */}
          <ellipse cx="164" cy="138" rx="28" ry="6" fill="#B59B78" />
          <rect x="151" y="118" width="10" height="20" rx="4" fill="#334155" />
          <rect x="167" y="118" width="10" height="20" rx="4" fill="#334155" />
          <path d="M142 84 C142 67, 186 67, 186 84 L190 124 H138 Z" fill="#15803D" />
          <path d="M156 74 L164 96 L172 74 Z" fill="#FEF3C7" />
          <path d="M145 44 C145 25, 183 25, 183 44 L186 65 L142 65 Z" fill="#3B2314" />
          <circle cx="164" cy="48" r="17" fill="#F8D2B4" />
          <path d="M147 44 Q164 33 181 44" fill="#3B2314" />
          <circle cx="158" cy="48" r="2" fill="#1C1917" />
          <circle cx="170" cy="48" r="2" fill="#1C1917" />
          <path d="M159 55 Q164 60 169 55" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <circle cx="154" cy="52" r="2.8" fill="#F472B6" opacity="0.38" />
          <circle cx="173" cy="52" r="2.8" fill="#F472B6" opacity="0.38" />
          {/* Handshake clasp + friendly golden sparkle */}
          <path d="M148 88 L124 96" stroke="#15803D" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="120" cy="96" rx="10" ry="7" fill="#F3C19D" stroke="#9A3412" strokeWidth="1.5" />
          <path d="M120 71 L122.5 76.5 L128 79 L122.5 81.5 L120 87 L117.5 81.5 L112 79 L117.5 76.5 Z" fill="#F59E0B" />
        </svg>
      );

    case 'teacher-classroom':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="wall-class" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDF8F0" />
              <stop offset="100%" stopColor="#F3E7D4" />
            </linearGradient>
            <linearGradient id="board-class" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1B4D2E" />
              <stop offset="100%" stopColor="#143D23" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#wall-class)" />
          <rect y="114" width="240" height="36" fill="#D9BE98" />
          {/* Framed green chalkboard */}
          <rect x="82" y="14" width="144" height="82" rx="6" fill="#8B5A2B" />
          <rect x="88" y="20" width="132" height="70" rx="2" fill="url(#board-class)" />
          {/* Chalk diagrams (zero text) */}
          <circle cx="116" cy="46" r="12" fill="none" stroke="#FEF9C3" strokeWidth="2.4" />
          <polygon points="145,58 159,32 173,58" fill="none" stroke="#FDE68A" strokeWidth="2.4" />
          <rect x="184" y="34" width="24" height="22" rx="2" fill="none" stroke="#A7F3D0" strokeWidth="2.2" />
          <line x1="100" y1="74" x2="208" y2="74" stroke="#FFFFFF" strokeWidth="2.2" strokeDasharray="7 5" opacity="0.7" />
          {/* Chalk tray with chalk & eraser */}
          <rect x="114" y="94" width="76" height="5.5" rx="2" fill="#6D441F" />
          <rect x="124" y="90" width="16" height="4" rx="1.5" fill="#FFFFFF" />
          <rect x="148" y="88" width="22" height="6" rx="1.5" fill="#D97706" />

          {/* Female teacher with bun hair, glasses, crimson blazer & pointer */}
          <circle cx="49" cy="24" r="7.5" fill="#292524" />
          <path d="M31 44 C31 24, 67 24, 67 44 L69 64 L29 64 Z" fill="#292524" />
          <circle cx="49" cy="45" r="15.5" fill="#F8D2B4" />
          <circle cx="43" cy="45" r="4.3" fill="#FFFFFF" fillOpacity="0.35" stroke="#1C1917" strokeWidth="1.7" />
          <circle cx="55" cy="45" r="4.3" fill="#FFFFFF" fillOpacity="0.35" stroke="#1C1917" strokeWidth="1.7" />
          <line x1="47.3" y1="45" x2="50.7" y2="45" stroke="#1C1917" strokeWidth="1.6" />
          <circle cx="43" cy="45" r="1.4" fill="#1C1917" />
          <circle cx="55" cy="45" r="1.4" fill="#1C1917" />
          <path d="M44 53 Q49 57 54 53" fill="none" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
          {/* Blazer, blouse & skirt */}
          <path d="M26 78 C26 62, 72 62, 72 78 L76 138 H22 Z" fill="#991B1B" />
          <path d="M41 66 L49 94 L57 66 Z" fill="#FFFFFF" />
          <path d="M64 82 L84 68" stroke="#991B1B" strokeWidth="8.5" strokeLinecap="round" />
          <circle cx="86" cy="67" r="5" fill="#F8D2B4" />
          <line x1="88" y1="66" x2="132" y2="44" stroke="#D97706" strokeWidth="3.2" strokeLinecap="round" />

          {/* Teacher desk with books, globe & red apple */}
          <rect x="128" y="108" width="94" height="42" rx="3" fill="#B47B44" />
          <rect x="122" y="102" width="106" height="8" rx="2.5" fill="#8B5A2B" />
          <rect x="136" y="94" width="32" height="8" rx="1.5" fill="#2563EB" />
          <rect x="140" y="88" width="26" height="6" rx="1.5" fill="#DC2626" />
          {/* Mini classroom globe */}
          <circle cx="182" cy="88" r="10" fill="#38BDF8" stroke="#1E3A8A" strokeWidth="1.5" />
          <path d="M177 83 Q182 87 187 82 Q188 92 180 94 Z" fill="#22C55E" />
          <line x1="182" y1="98" x2="182" y2="102" stroke="#475569" strokeWidth="2.5" />
          {/* Shiny red apple */}
          <circle cx="206" cy="95" r="7" fill="#DC2626" />
          <path d="M206 88 Q210 83 213 86" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'student-desk':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="wall-stud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF5EC" />
              <stop offset="100%" stopColor="#EFE3D0" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#wall-stud)" />
          {/* Sunlit classroom/bedroom window */}
          <rect x="166" y="14" width="58" height="60" rx="4" fill="#BAE6FD" stroke="#A67C52" strokeWidth="3.2" />
          <circle cx="206" cy="30" r="9" fill="#FDE047" />
          <line x1="195" y1="14" x2="195" y2="74" stroke="#A67C52" strokeWidth="2.5" />
          <line x1="166" y1="44" x2="224" y2="44" stroke="#A67C52" strokeWidth="2.5" />
          {/* Potted plant on sill */}
          <polygon points="184,74 198,74 195,61 187,61" fill="#C2410C" />
          <ellipse cx="187" cy="56" rx="5.5" ry="7.5" transform="rotate(-24 187 56)" fill="#16A34A" />
          <ellipse cx="195" cy="56" rx="5.5" ry="7.5" transform="rotate(24 195 56)" fill="#15803D" />

          {/* Glowing study lamp */}
          <polygon points="44,54 96,98 16,98" fill="#FDE047" opacity="0.28" />
          <line x1="34" y1="98" x2="34" y2="62" stroke="#475569" strokeWidth="4.2" strokeLinecap="round" />
          <line x1="34" y1="62" x2="50" y2="52" stroke="#475569" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M38 50 L60 44 L64 56 L42 60 Z" fill="#D97706" />
          <rect x="22" y="94" width="24" height="6" rx="3" fill="#334155" />

          {/* Focused student writing in notebook */}
          <circle cx="114" cy="44" r="16.5" fill="#F8D2B4" />
          <path d="M97 42 C97 23, 131 23, 131 42 C124 34, 104 34, 97 42 Z" fill="#1C1917" />
          <circle cx="109" cy="45" r="1.8" fill="#1C1917" />
          <circle cx="119" cy="45" r="1.8" fill="#1C1917" />
          <path d="M110 52 Q114 55 118 52" fill="none" stroke="#9A3412" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M84 98 C84 63, 144 63, 144 98 Z" fill="#0F766E" />
          <path d="M106 66 L114 78 L122 66 Z" fill="#FFFFFF" />
          {/* Hands & yellow pencil writing on open book */}
          <circle cx="94" cy="94" r="5.5" fill="#F8D2B4" />
          <circle cx="132" cy="93" r="5.5" fill="#F8D2B4" />
          <line x1="126" y1="94" x2="140" y2="82" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />

          {/* Wooden study desk */}
          <rect x="18" y="98" width="204" height="12" rx="3" fill="#B47B44" />
          <rect x="32" y="110" width="11" height="36" fill="#8B5A2B" />
          <rect x="196" y="110" width="11" height="36" fill="#8B5A2B" />
          {/* Open textbook */}
          <path d="M82 98 L114 89 L114 100 L82 103 Z" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="1.8" />
          <path d="M146 98 L114 89 L114 100 L146 103 Z" fill="#FFFBEB" stroke="#B91C1C" strokeWidth="1.8" />
          {/* Pencil cup & stack of books */}
          <rect x="164" y="81" width="16" height="17" rx="2.5" fill="#2563EB" />
          <line x1="168" y1="81" x2="165" y2="69" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="176" y1="81" x2="179" y2="70" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          {/* Red student backpack hanging beside desk */}
          <rect x="192" y="114" width="26" height="30" rx="8" fill="#DC2626" />
          <rect x="197" y="124" width="16" height="12" rx="3" fill="#FCA5A5" />
        </svg>
      );

    case 'laptop-new':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="bg-lap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EFF6FF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="desk-lap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DFC097" />
              <stop offset="100%" stopColor="#C49E6E" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#bg-lap)" />
          <rect y="102" width="240" height="48" fill="url(#desk-lap)" />
          <line x1="0" y1="102" x2="240" y2="102" stroke="#A67C52" strokeWidth="2.4" />

          {/* Potted succulent on left */}
          <rect x="16" y="86" width="24" height="22" rx="3.5" fill="#C2410C" />
          <path d="M28 86 Q16 68 23 58 Q31 70 28 86 Z" fill="#15803D" />
          <path d="M28 86 Q40 66 34 56 Q26 70 28 86 Z" fill="#22C55E" />

          {/* Sleek metallic laptop with colorful dashboard UI (zero text) */}
          <rect x="56" y="20" width="128" height="80" rx="8" fill="#0F172A" />
          <rect x="63" y="27" width="114" height="66" rx="3" fill="#E0F2FE" />
          {/* Screen UI blocks */}
          <rect x="69" y="33" width="32" height="54" rx="3" fill="#FFFFFF" />
          <rect x="74" y="40" width="22" height="5" rx="2" fill="#64748B" />
          <rect x="74" y="50" width="18" height="4.5" rx="2" fill="#CBD5E1" />
          <rect x="74" y="59" width="20" height="4.5" rx="2" fill="#CBD5E1" />
          <rect x="74" y="68" width="15" height="4.5" rx="2" fill="#CBD5E1" />
          <rect x="107" y="33" width="64" height="25" rx="3" fill="#2563EB" />
          <circle cx="121" cy="45" r="7" fill="#93C5FD" />
          <rect x="134" y="40" width="28" height="5" rx="2" fill="#FFFFFF" opacity="0.85" />
          <rect x="134" y="48" width="20" height="4" rx="2" fill="#BFDBFE" />
          <rect x="107" y="63" width="30" height="24" rx="3" fill="#F59E0B" />
          <rect x="141" y="63" width="30" height="24" rx="3" fill="#10B981" />
          <circle cx="120" cy="23.5" r="1.7" fill="#64748B" />
          {/* Keyboard aluminum deck */}
          <path d="M42 100 H198 L208 116 H32 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          <rect x="62" y="103" width="116" height="5" rx="1.5" fill="#64748B" opacity="0.55" />
          <rect x="102" y="110" width="36" height="3.5" rx="1.5" fill="#94A3B8" />

          {/* Wireless mouse + steaming red coffee mug */}
          <ellipse cx="218" cy="118" rx="11" ry="6.5" fill="#FFFFFF" stroke="#475569" strokeWidth="1.6" />
          <line x1="218" y1="112" x2="218" y2="117" stroke="#475569" strokeWidth="1.5" />
          <rect x="200" y="76" width="22" height="24" rx="3" fill="#B91C1C" />
          <path d="M222 82 C230 82, 230 94, 222 94" fill="none" stroke="#B91C1C" strokeWidth="3.2" />

          {/* Golden brand-new shine stars */}
          <path d="M196 14 L199 24 L209 27 L199 30 L196 40 L193 30 L183 27 L193 24 Z" fill="#F59E0B" />
          <path d="M44 18 L46 24 L52 26 L46 28 L44 34 L42 28 L36 26 L42 24 Z" fill="#FBBF24" />
          <circle cx="210" cy="44" r="3.5" fill="#F59E0B" />
        </svg>
      );

    case 'cooking-noodles':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Warm tiled kitchen backdrop */}
          <rect width="240" height="150" rx="10" fill="#FFF7ED" />
          <line x1="0" y1="34" x2="240" y2="34" stroke="#FED7AA" strokeWidth="1.2" />
          <line x1="0" y1="68" x2="240" y2="68" stroke="#FED7AA" strokeWidth="1.2" />
          <rect y="102" width="240" height="48" fill="#DFC39D" />

          {/* Smiling home cook in red apron standing behind kitchen counter */}
          <circle cx="62" cy="36" r="15" fill="#F8D2B4" />
          <path d="M47 34 C47 18, 77 18, 77 34 C71 27, 53 27, 47 34 Z" fill="#292524" />
          <circle cx="57" cy="36" r="1.6" fill="#1C1917" />
          <circle cx="67" cy="36" r="1.6" fill="#1C1917" />
          <path d="M58 43 Q62 46 66 43" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M36 102 C36 56, 88 56, 88 102 Z" fill="#15803D" />
          {/* Striped kitchen apron */}
          <rect x="48" y="64" width="28" height="38" rx="4" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.8" />
          {/* Arm holding chopsticks over steaming noodle bowl */}
          <path d="M84 74 L126 54" stroke="#15803D" strokeWidth="8.5" strokeLinecap="round" />
          <circle cx="128" cy="53" r="5" fill="#F8D2B4" />

          {/* Rising steam ribbons */}
          <path d="M126 42 C121 31, 132 24, 126 12" fill="none" stroke="#9CA3AF" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
          <path d="M150 38 C145 27, 156 20, 150 8" fill="none" stroke="#9CA3AF" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
          <path d="M174 44 C169 33, 180 26, 174 14" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />

          {/* Golden wavy noodles lifted high with chopsticks */}
          <path d="M144 48 C140 64, 148 74, 142 90" fill="none" stroke="#F59E0B" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M152 46 C156 62, 146 74, 152 90" fill="none" stroke="#FBBF24" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M160 49 C164 64, 156 75, 160 90" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <line x1="126" y1="51" x2="212" y2="28" stroke="#78350F" strokeWidth="4.2" strokeLinecap="round" />
          <line x1="128" y1="57" x2="216" y2="40" stroke="#92400E" strokeWidth="4.2" strokeLinecap="round" />

          {/* Steaming ceramic noodle bowl on counter */}
          <ellipse cx="152" cy="90" rx="54" ry="14" fill="#FDE68A" stroke="#B91C1C" strokeWidth="2.4" />
          <ellipse cx="124" cy="89" rx="11" ry="6.5" fill="#FFFFFF" />
          <circle cx="126" cy="89" r="4" fill="#F97316" />
          <ellipse cx="178" cy="88" rx="9" ry="4.5" fill="#16A34A" />
          <circle cx="144" cy="94" r="2.4" fill="#15803D" />
          <circle cx="164" cy="95" r="2.4" fill="#15803D" />
          <path d="M98 90 C98 134, 206 134, 206 90 Z" fill="#B91C1C" />
          <path d="M108 103 Q152 114 196 103" fill="none" stroke="#FBBF24" strokeWidth="3" />
          <rect x="124" y="128" width="56" height="8" rx="3" fill="#7F1D1D" />
        </svg>
      );

    case 'cooking-dumplings':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FDF8F0" />
          {/* Warm kitchen table */}
          <rect y="92" width="240" height="58" fill="#E3C69E" />

          {/* Smiling person in apron making dumplings at table */}
          <circle cx="56" cy="36" r="14.5" fill="#F8D2B4" />
          <path d="M40 34 C40 17, 72 17, 72 34 L74 52 L38 52 Z" fill="#3B2314" />
          <circle cx="51" cy="36" r="1.5" fill="#1C1917" />
          <circle cx="61" cy="36" r="1.5" fill="#1C1917" />
          <path d="M52 43 Q56 46 60 43" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M32 92 C32 54, 80 54, 80 92 Z" fill="#B91C1C" />
          <rect x="44" y="62" width="24" height="30" rx="3" fill="#FFFBEB" />

          {/* Bamboo steamer basket with rising steam */}
          <ellipse cx="188" cy="76" rx="34" ry="11" fill="#D4A373" stroke="#9C6644" strokeWidth="2" />
          <rect x="154" y="76" width="68" height="22" fill="#DDA15E" stroke="#9C6644" strokeWidth="2" />
          <ellipse cx="188" cy="98" rx="34" ry="11" fill="#C68B59" stroke="#9C6644" strokeWidth="2" />
          <path d="M174 58 C170 47, 180 41, 176 30" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
          <path d="M196 56 C192 45, 202 39, 198 26" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />

          {/* Large ceramic plate overflowing with pleated crescent dumplings */}
          <ellipse cx="110" cy="112" rx="68" ry="23" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2.6" />
          <ellipse cx="110" cy="112" rx="54" ry="16" fill="#FEF2F2" />
          <g>
            <path d="M66 110 C70 84, 104 84, 108 110 Q87 116 66 110 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
            <path d="M74 96 Q87 86 100 96" fill="none" stroke="#D97706" strokeWidth="1.6" strokeDasharray="3 3" />
          </g>
          <g>
            <path d="M110 112 C114 86, 148 86, 152 112 Q131 118 110 112 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" />
            <path d="M118 98 Q131 88 144 98" fill="none" stroke="#D97706" strokeWidth="1.6" strokeDasharray="3 3" />
          </g>
          <g>
            <path d="M88 96 C92 70, 128 70, 132 96 Q110 102 88 96 Z" fill="#FFFBEB" stroke="#B45309" strokeWidth="2.4" />
            <path d="M96 82 Q110 72 124 82" fill="none" stroke="#B45309" strokeWidth="1.8" strokeDasharray="3 3" />
          </g>
          <path d="M104 62 C100 52, 108 46, 104 36" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
          <path d="M122 60 C118 50, 126 44, 122 34" fill="none" stroke="#9CA3AF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />

          {/* Soy dipping dish & wooden rolling pin */}
          <ellipse cx="202" cy="128" rx="20" ry="8.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.8" />
          <ellipse cx="202" cy="128" rx="14" ry="5" fill="#451A03" />
          <rect x="16" y="122" width="38" height="8" rx="4" transform="rotate(-14 35 126)" fill="#B47B44" stroke="#78350F" strokeWidth="1.5" />
        </svg>
      );

    case 'family-four':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="home-fam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#home-fam)" />
          {/* Warm pitched home roof & cozy living room wall */}
          <path d="M14 52 L120 10 L226 52" fill="none" stroke="#B91C1C" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="26" y="52" width="188" height="88" fill="#FFFFFF" fillOpacity="0.55" />
          <ellipse cx="120" cy="136" rx="96" ry="10" fill="#E3CBA9" />

          {/* 1. Father (Tallest, left — glasses & navy sweater) */}
          <path d="M36 90 C36 70, 74 70, 74 90 L76 134 H34 Z" fill="#1E40AF" />
          <path d="M48 73 L55 88 L62 73 Z" fill="#FFFFFF" />
          <circle cx="55" cy="52" r="14.5" fill="#F8D2B4" />
          <path d="M40 50 C40 34, 70 34, 70 50 C64 43, 46 43, 40 50 Z" fill="#1C1917" />
          <circle cx="50" cy="52" r="3.6" fill="none" stroke="#1C1917" strokeWidth="1.3" />
          <circle cx="60" cy="52" r="3.6" fill="none" stroke="#1C1917" strokeWidth="1.3" />
          <line x1="53.6" y1="52" x2="56.4" y2="52" stroke="#1C1917" strokeWidth="1.2" />
          <path d="M51 59 Q55 62 59 59" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />

          {/* 2. Mother (Crimson dress & warm bob hair) */}
          <path d="M82 94 C82 74, 118 74, 118 94 L122 134 H78 Z" fill="#B91C1C" />
          <path d="M84 52 C84 36, 116 36, 116 52 L118 72 L82 72 Z" fill="#3B2314" />
          <circle cx="100" cy="56" r="13.5" fill="#F8D2B4" />
          <circle cx="96" cy="56" r="1.6" fill="#1C1917" />
          <circle cx="104" cy="56" r="1.6" fill="#1C1917" />
          <path d="M96 63 Q100 66 104 63" fill="none" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />

          {/* 3. Older Child (Jade shirt) */}
          <path d="M128 104 C128 88, 158 88, 158 104 L160 134 H126 Z" fill="#15803D" />
          <circle cx="143" cy="75" r="12" fill="#F8D2B4" />
          <path d="M131 73 C131 60, 155 60, 155 73 Z" fill="#1C1917" />
          <circle cx="139" cy="75" r="1.5" fill="#1C1917" />
          <circle cx="147" cy="75" r="1.5" fill="#1C1917" />
          <path d="M139 81 Q143 84 147 81" fill="none" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />

          {/* 4. Younger Child (Gold dress & hair ribbons) */}
          <path d="M168 108 C168 95, 196 95, 196 108 L200 134 H164 Z" fill="#D97706" />
          <circle cx="169" cy="79" r="5.5" fill="#292524" />
          <circle cx="195" cy="79" r="5.5" fill="#292524" />
          <circle cx="171" cy="76" r="2.2" fill="#EF4444" />
          <circle cx="193" cy="76" r="2.2" fill="#EF4444" />
          <circle cx="182" cy="83" r="11" fill="#F8D2B4" />
          <path d="M171 81 C171 69, 193 69, 193 81 Z" fill="#292524" />
          <circle cx="178.5" cy="83" r="1.4" fill="#1C1917" />
          <circle cx="185.5" cy="83" r="1.4" fill="#1C1917" />
          <path d="M179 88 Q182 90.5 185 88" fill="none" stroke="#9A3412" strokeWidth="1.4" strokeLinecap="round" />

          {/* Heart emblem under roof peak */}
          <path d="M120 38 C120 32, 112 32, 112 38 C112 44, 120 48, 120 50 C120 48, 128 44, 128 38 C128 32, 120 32, 120 38 Z" fill="#EF4444" />
        </svg>
      );

    case 'two-children':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="sky-kids" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#sky-kids)" />
          <circle cx="204" cy="28" r="15" fill="#FBBF24" />
          <ellipse cx="48" cy="28" rx="22" ry="10" fill="#FFFFFF" opacity="0.92" />
          <ellipse cx="64" cy="24" rx="15" ry="9" fill="#FFFFFF" opacity="0.92" />
          <path d="M0 106 Q120 92 240 106 L240 150 L0 150 Z" fill="#4ADE80" />

          {/* Boy on left (red cap, green shirt, blue overalls) */}
          <path d="M52 84 C52 68, 92 68, 92 84 L96 130 H48 Z" fill="#16A34A" />
          <rect x="57" y="96" width="30" height="34" rx="4" fill="#2563EB" />
          <circle cx="72" cy="54" r="15.5" fill="#F8D2B4" />
          <path d="M56 48 C56 32, 88 32, 88 48 Z" fill="#DC2626" />
          <rect x="68" y="44" width="24" height="5" rx="2.5" fill="#B91C1C" />
          <circle cx="67" cy="55" r="1.8" fill="#1C1917" />
          <circle cx="77" cy="55" r="1.8" fill="#1C1917" />
          <path d="M68 62 Q72 66 76 62" fill="none" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />

          {/* Girl on right (yellow cardigan, red dress, pigtails) */}
          <path d="M148 92 C148 76, 184 76, 184 92 L190 130 H142 Z" fill="#DC2626" />
          <circle cx="147" cy="57" r="7" fill="#3B2314" />
          <circle cx="185" cy="57" r="7" fill="#3B2314" />
          <circle cx="166" cy="59" r="14.5" fill="#F8D2B4" />
          <path d="M151 57 C151 41, 181 41, 181 57 Z" fill="#3B2314" />
          <circle cx="161" cy="59" r="1.7" fill="#1C1917" />
          <circle cx="171" cy="59" r="1.7" fill="#1C1917" />
          <path d="M162 66 Q166 70 170 66" fill="none" stroke="#9A3412" strokeWidth="1.7" strokeLinecap="round" />

          {/* Colorful bouncing play ball + wildflowers */}
          <circle cx="120" cy="112" r="15" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.2" />
          <path d="M107 106 Q120 112 133 106" fill="none" stroke="#DC2626" strokeWidth="2.6" />
          <path d="M109 120 Q120 114 131 120" fill="none" stroke="#2563EB" strokeWidth="2.6" />
          <circle cx="24" cy="126" r="4" fill="#F43F5E" />
          <circle cx="216" cy="128" r="4" fill="#FACC15" />
        </svg>
      );

    case 'calendar-sep8':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Desk calendar scene — strictly ZERO text/numerals */}
          <defs>
            <linearGradient id="bg-cal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDF6EC" />
              <stop offset="100%" stopColor="#F4E4CE" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#bg-cal)" />
          <rect y="114" width="240" height="36" fill="#D5B48A" />

          {/* Calendar shadow & spiral-bound body */}
          <rect x="64" y="24" width="118" height="106" rx="10" fill="#B59B78" opacity="0.4" />
          <rect x="58" y="18" width="118" height="106" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M58 28 A10 10 0 0 1 68 18 H166 A10 10 0 0 1 176 28 V46 H58 Z" fill="#B91C1C" />
          {/* Curled bottom right calendar corner */}
          <path d="M156 124 L176 106 V114 A10 10 0 0 1 166 124 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          {/* Metal spiral rings */}
          <rect x="78" y="10" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="104" y="10" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="130" y="10" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="152" y="10" width="7" height="18" rx="3.5" fill="#475569" />
          <rect x="88" y="32" width="58" height="6" rx="3" fill="#FCA5A5" />

          {/* 5x3 date grid with bold red-circled target day */}
          {[0, 1, 2, 3, 4].map((col) =>
            [0, 1, 2].map((row) => {
              const cx = 74 + col * 21;
              const cy = 60 + row * 20;
              const isHighlighted = col === 2 && row === 1;
              return (
                <g key={`${col}-${row}`}>
                  <rect
                    x={cx - 6.5}
                    y={cy - 6.5}
                    width="13"
                    height="13"
                    rx="3"
                    fill={isHighlighted ? '#B91C1C' : col === 4 ? '#FEE2E2' : '#F3EDE3'}
                  />
                  {isHighlighted && (
                    <circle cx={cx} cy={cy} r="10" fill="none" stroke="#D97706" strokeWidth="2.5" />
                  )}
                </g>
              );
            })
          )}

          {/* Analog desk clock & autumn leaf */}
          <circle cx="206" cy="100" r="19" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <line x1="206" y1="100" x2="206" y2="88" stroke="#B91C1C" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="206" y1="100" x2="216" y2="104" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="206" cy="100" r="2.5" fill="#B91C1C" />
          <path d="M22 100 C18 84, 36 74, 44 90 C37 104, 25 106, 22 100 Z" fill="#EA580C" />
          <line x1="16" y1="108" x2="36" y2="88" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'calendar-sunday-rest':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          {/* Sunny weekend rest scene — strictly ZERO text */}
          <rect width="240" height="150" rx="10" fill="#FEF9EF" />
          <rect y="114" width="240" height="36" fill="#E3CBA9" />

          {/* Sunlit window with bright golden sun */}
          <rect x="18" y="14" width="68" height="60" rx="5" fill="#BAE6FD" stroke="#A67C52" strokeWidth="3.2" />
          <circle cx="44" cy="36" r="13" fill="#FBBF24" />
          <line x1="18" y1="44" x2="86" y2="44" stroke="#A67C52" strokeWidth="2.2" />
          <line x1="52" y1="14" x2="52" y2="74" stroke="#A67C52" strokeWidth="2.2" />

          {/* Wall calendar highlighting Sunday column */}
          <rect x="176" y="16" width="46" height="46" rx="5" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.8" />
          <rect x="176" y="16" width="46" height="11" rx="3" fill="#B91C1C" />
          <rect x="206" y="32" width="10" height="24" rx="2" fill="#FCA5A5" />
          <circle cx="211" cy="44" r="4.5" fill="#B91C1C" />

          {/* Plush emerald green sofa & cozy throw blanket */}
          <rect x="50" y="76" width="140" height="44" rx="13" fill="#15803D" />
          <rect x="42" y="88" width="18" height="34" rx="6" fill="#166534" />
          <rect x="180" y="88" width="18" height="34" rx="6" fill="#166534" />
          <rect x="62" y="82" width="26" height="19" rx="6" fill="#F59E0B" />

          {/* Person relaxing peacefully on sofa */}
          <circle cx="88" cy="76" r="13.5" fill="#F8D2B4" />
          <path d="M75 74 C75 61, 101 61, 101 74 Z" fill="#292524" />
          <path d="M82 76 Q85 78.5 88 76" fill="none" stroke="#1C1917" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M90 76 Q93 78.5 96 76" fill="none" stroke="#1C1917" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M100 84 Q140 78 176 94 L176 112 H96 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />

          {/* Floating golden rest bubbles & sparkle */}
          <circle cx="114" cy="54" r="4.5" fill="#F59E0B" opacity="0.75" />
          <circle cx="130" cy="44" r="6.5" fill="#FBBF24" opacity="0.8" />
          <path d="M148 26 L150.5 33 L157.5 35.5 L150.5 38 L148 45 L145.5 38 L138.5 35.5 L145.5 33 Z" fill="#D97706" />
        </svg>
      );

    case 'china-landmark':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="sky-cn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          <rect width="240" height="150" rx="10" fill="url(#sky-cn)" />
          <circle cx="196" cy="34" r="18" fill="#EF4444" opacity="0.8" />
          <path d="M0 112 Q52 68 106 102 Q166 60 240 106 L240 150 L0 150 Z" fill="#84B59F" opacity="0.72" />
          <rect y="116" width="240" height="34" fill="#34D399" opacity="0.48" />

          {/* Iconic Multi-Tiered Scarlet & Gold Chinese Pavilion */}
          <path d="M90 38 Q120 16 150 38 Q138 43 120 43 Q102 43 90 38 Z" fill="#B91C1C" />
          <line x1="120" y1="14" x2="120" y2="27" stroke="#D97706" strokeWidth="3.2" strokeLinecap="round" />
          <rect x="102" y="43" width="36" height="18" fill="#FFF7ED" stroke="#B91C1C" strokeWidth="2" />
          <path d="M64 68 Q120 44 176 68 Q154 75 120 75 Q86 75 64 68 Z" fill="#D97706" />
          <rect x="80" y="75" width="80" height="41" fill="#FFF7ED" stroke="#B91C1C" strokeWidth="2" />
          <rect x="87" y="75" width="6.5" height="41" fill="#B91C1C" />
          <rect x="107" y="75" width="6.5" height="41" fill="#B91C1C" />
          <rect x="126.5" y="75" width="6.5" height="41" fill="#B91C1C" />
          <rect x="146.5" y="75" width="6.5" height="41" fill="#B91C1C" />
          <rect x="64" y="114" width="112" height="10" rx="2.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.6" />
          {/* Hanging red lanterns & willow leaves */}
          <ellipse cx="74" cy="82" rx="5.5" ry="7.5" fill="#DC2626" />
          <ellipse cx="166" cy="82" rx="5.5" ry="7.5" fill="#DC2626" />
          <path d="M12 10 Q28 42 18 82" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
          <path d="M24 10 Q42 38 34 74" fill="none" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" opacity="0.65" />
        </svg>
      );

    case 'doctor-hospital':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#EFF6FF" />
          <rect y="118" width="240" height="32" fill="#CBD5E1" />

          {/* Hospital building with red cross emblem */}
          <rect x="106" y="20" width="114" height="100" rx="6" fill="#FFFFFF" stroke="#64748B" strokeWidth="2.4" />
          <rect x="155" y="30" width="16" height="42" rx="2.5" fill="#DC2626" />
          <rect x="142" y="43" width="42" height="16" rx="2.5" fill="#DC2626" />
          <rect x="118" y="82" width="18" height="14" rx="2" fill="#93C5FD" />
          <rect x="190" y="82" width="18" height="14" rx="2" fill="#93C5FD" />
          <rect x="150" y="88" width="26" height="32" rx="2" fill="#3B82F6" opacity="0.45" />

          {/* Doctor in crisp white coat & stethoscope */}
          <circle cx="56" cy="48" r="15.5" fill="#F8D2B4" />
          <path d="M40 46 C40 28, 72 28, 72 46 C66 38, 46 38, 40 46 Z" fill="#1C1917" />
          <circle cx="51" cy="48" r="1.7" fill="#1C1917" />
          <circle cx="61" cy="48" r="1.7" fill="#1C1917" />
          <path d="M52 55 Q56 59 60 55" fill="none" stroke="#9A3412" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M32 84 C32 66, 80 66, 80 84 L84 136 H28 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
          <path d="M48 68 L56 96 L64 68 Z" fill="#0D9488" />
          <path d="M44 68 C40 87, 72 87, 68 68" fill="none" stroke="#334155" strokeWidth="3" />
          <circle cx="68" cy="89" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="1.8" />
          <rect x="74" y="88" width="19" height="25" rx="2" fill="#B45309" />
          <rect x="77" y="92" width="13" height="18" fill="#FFFFFF" />
        </svg>
      );

    case 'drinking-tea':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F5F7EE" />
          <rect x="22" y="102" width="196" height="28" rx="6" fill="#B6895B" stroke="#78502C" strokeWidth="2.2" />
          <line x1="34" y1="113" x2="206" y2="113" stroke="#8C5E35" strokeWidth="2" />

          {/* Terracotta Yixing teapot pouring golden-green tea */}
          <ellipse cx="74" cy="76" rx="29" ry="22" fill="#B45309" stroke="#78350F" strokeWidth="2.4" />
          <ellipse cx="74" cy="54" rx="14" ry="5" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <circle cx="74" cy="48" r="4.5" fill="#92400E" />
          <path d="M45 66 C26 66, 26 88, 47 86" fill="none" stroke="#92400E" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M101 72 L124 57" stroke="#B45309" strokeWidth="7.5" strokeLinecap="round" />
          <path d="M125 58 Q144 64 150 84" fill="none" stroke="#65A30D" strokeWidth="4.2" strokeLinecap="round" />

          {/* Celadon porcelain teacup */}
          <path d="M124 80 H184 L178 109 C176 115, 132 115, 130 109 Z" fill="#A7F3D0" stroke="#047857" strokeWidth="2.5" />
          <ellipse cx="154" cy="80" rx="30" ry="6.5" fill="#84CC16" opacity="0.65" stroke="#047857" strokeWidth="2" />
          <path d="M183 86 C198 86, 198 103, 180 103" fill="none" stroke="#047857" strokeWidth="3.6" />

          <path d="M144 64 C140 52, 150 44, 144 30" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M164 62 C160 50, 170 42, 164 26" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="204" cy="96" rx="8.5" ry="4.5" transform="rotate(-25 204 96)" fill="#15803D" />
          <ellipse cx="213" cy="100" rx="7.5" ry="4" transform="rotate(20 213 100)" fill="#22C55E" />
        </svg>
      );

    case 'speaking-phone':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F5F3FF" />
          <rect y="120" width="240" height="30" fill="#DDD6FE" />

          <path d="M60 88 C60 66, 128 66, 128 88 L134 138 H54 Z" fill="#2563EB" />
          <circle cx="94" cy="52" r="18.5" fill="#F8D2B4" />
          <path d="M75 50 C75 29, 113 29, 113 50 C106 40, 82 40, 75 50 Z" fill="#1E293B" />
          <circle cx="88" cy="52" r="2" fill="#1C1917" />
          <circle cx="100" cy="52" r="2" fill="#1C1917" />
          <path d="M89 59 Q94 64 99 59" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />

          <path d="M120 92 L134 62" stroke="#2563EB" strokeWidth="11" strokeLinecap="round" />
          <rect x="114" y="40" width="17" height="32" rx="4" transform="rotate(14 122 56)" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.6" />
          <rect x="117" y="45" width="11" height="20" rx="1.5" transform="rotate(14 122 55)" fill="#38BDF8" />
          <circle cx="132" cy="60" r="6" fill="#F8D2B4" />

          <path d="M148 44 C158 50, 158 66, 148 72" fill="none" stroke="#F59E0B" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M162 34 C178 46, 178 70, 162 82" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <path d="M176 26 C196 42, 196 74, 176 90" fill="none" stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
        </svg>
      );

    case 'reading-book':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FDF6EC" />
          <rect x="164" y="16" width="58" height="100" rx="4" fill="#A67C52" />
          <rect x="170" y="24" width="10" height="24" fill="#DC2626" />
          <rect x="182" y="28" width="9" height="20" fill="#2563EB" />
          <rect x="193" y="22" width="11" height="26" fill="#15803D" />
          <rect x="206" y="26" width="10" height="22" fill="#D97706" />
          <rect x="170" y="62" width="12" height="24" fill="#7C3AED" />
          <rect x="184" y="60" width="11" height="26" fill="#0D9488" />
          <rect x="197" y="64" width="14" height="22" fill="#B91C1C" />

          <rect x="24" y="66" width="118" height="64" rx="14" fill="#D97706" />
          <circle cx="84" cy="45" r="15.5" fill="#F8D2B4" />
          <path d="M68 43 C68 25, 100 25, 100 43 Z" fill="#292524" />
          <path d="M54 84 C54 63, 114 63, 114 84 Z" fill="#15803D" />

          <path d="M38 80 C60 72, 76 76, 84 86 V126 C76 118, 58 116, 38 122 Z" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2.5" />
          <path d="M130 80 C108 72, 92 76, 84 86 V126 C92 118, 110 116, 130 122 Z" fill="#FFFBEB" stroke="#B91C1C" strokeWidth="2.5" />
          <line x1="48" y1="92" x2="74" y2="95" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="48" y1="102" x2="74" y2="105" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="94" y1="95" x2="120" y2="92" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="94" y1="105" x2="120" y2="102" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M84 124 L80 140 L84 135 L88 140 Z" fill="#DC2626" />
        </svg>
      );

    case 'office-busy':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F1F5F9" />
          <circle cx="196" cy="34" r="19" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          <line x1="196" y1="34" x2="196" y2="21" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="196" y1="34" x2="207" y2="38" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />

          <circle cx="118" cy="48" r="15.5" fill="#F8D2B4" />
          <path d="M102 46 C102 29, 134 29, 134 46 Z" fill="#1E293B" />
          <path d="M88 100 C88 64, 148 64, 148 100 Z" fill="#334155" />
          <path d="M111 68 L118 85 L125 68 Z" fill="#FFFFFF" />
          <line x1="118" y1="74" x2="118" y2="93" stroke="#DC2626" strokeWidth="3.8" />

          <rect x="14" y="100" width="212" height="12" rx="3" fill="#94A3B8" />
          <rect x="26" y="112" width="12" height="34" fill="#64748B" />
          <rect x="202" y="112" width="12" height="34" fill="#64748B" />

          <rect x="22" y="88" width="46" height="12" rx="2" fill="#F59E0B" />
          <rect x="26" y="76" width="44" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
          <rect x="20" y="64" width="46" height="12" rx="2" fill="#3B82F6" />
          <rect x="24" y="52" width="44" height="12" rx="2" fill="#EF4444" />

          <rect x="146" y="62" width="56" height="38" rx="4" fill="#1E293B" />
          <rect x="150" y="66" width="48" height="28" rx="2" fill="#DBEAFE" />
          <rect x="170" y="100" width="10" height="4" fill="#334155" />

          <rect x="82" y="84" width="15" height="16" rx="2" fill="#B91C1C" />
          <path d="M89 78 C87 72, 93 70, 90 63" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'birthday-cake':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FFF1F2" />
          <ellipse cx="42" cy="44" rx="17" ry="21" fill="#F43F5E" />
          <path d="M42 65 Q38 82 44 98" fill="none" stroke="#94A3B8" strokeWidth="1.8" />
          <ellipse cx="198" cy="42" rx="17" ry="21" fill="#3B82F6" />
          <path d="M198 63 Q202 80 196 98" fill="none" stroke="#94A3B8" strokeWidth="1.8" />
          <circle cx="76" cy="24" r="3.5" fill="#F59E0B" />
          <circle cx="164" cy="24" r="3.8" fill="#10B981" />
          <circle cx="182" cy="76" r="3.2" fill="#F59E0B" />
          <circle cx="62" cy="74" r="3.2" fill="#8B5CF6" />

          <ellipse cx="120" cy="126" rx="66" ry="10" fill="#CBD5E1" />
          <rect x="64" y="88" width="112" height="36" rx="7" fill="#FDE68A" stroke="#D97706" strokeWidth="2.2" />
          <path d="M64 98 Q78 108 92 98 Q106 108 120 98 Q134 108 148 98 Q162 108 176 98" fill="none" stroke="#F43F5E" strokeWidth="4.2" />
          <rect x="82" y="58" width="76" height="30" rx="6" fill="#FECDD3" stroke="#E11D48" strokeWidth="2.2" />
          <rect x="97" y="36" width="6.5" height="22" rx="2" fill="#3B82F6" />
          <rect x="117" y="32" width="6.5" height="26" rx="2" fill="#10B981" />
          <rect x="137" y="36" width="6.5" height="22" rx="2" fill="#F59E0B" />
          <ellipse cx="100" cy="29" rx="4.5" ry="6.5" fill="#F97316" />
          <ellipse cx="120" cy="25" rx="5" ry="7" fill="#FBBF24" />
          <ellipse cx="140" cy="29" rx="4.5" ry="6.5" fill="#F97316" />
        </svg>
      );

    case 'tennis-sport':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#E0F2FE" />
          <rect y="82" width="240" height="68" fill="#15803D" />
          <line x1="0" y1="98" x2="240" y2="98" stroke="#FFFFFF" strokeWidth="2.6" />
          <rect x="16" y="72" width="208" height="16" fill="#FFFFFF" opacity="0.35" stroke="#FFFFFF" strokeWidth="1.8" />

          <g transform="rotate(-26 98 68)">
            <ellipse cx="98" cy="54" rx="27" ry="35" fill="#FEF3C7" fillOpacity="0.35" stroke="#B91C1C" strokeWidth="5.2" />
            <line x1="82" y1="28" x2="82" y2="80" stroke="#64748B" strokeWidth="1.3" />
            <line x1="92" y1="20" x2="92" y2="88" stroke="#64748B" strokeWidth="1.3" />
            <line x1="104" y1="20" x2="104" y2="88" stroke="#64748B" strokeWidth="1.3" />
            <line x1="114" y1="28" x2="114" y2="80" stroke="#64748B" strokeWidth="1.3" />
            <line x1="72" y1="42" x2="124" y2="42" stroke="#64748B" strokeWidth="1.3" />
            <line x1="71" y1="54" x2="125" y2="54" stroke="#64748B" strokeWidth="1.3" />
            <line x1="72" y1="66" x2="124" y2="66" stroke="#64748B" strokeWidth="1.3" />
            <rect x="93" y="89" width="10" height="44" rx="4" fill="#1E293B" />
          </g>

          <path d="M138 60 Q158 46 176 46" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeDasharray="5 4" />
          <circle cx="184" cy="46" r="16" fill="#A3E635" stroke="#4D7C0F" strokeWidth="2.2" />
          <path d="M173 35 Q184 46 173 57" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
          <path d="M195 35 Q184 46 195 57" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
        </svg>
      );

    case 'writing-hanzi':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#EFE4D2" />
          <rect x="30" y="16" width="128" height="116" rx="4" fill="#FFFDF8" stroke="#B45309" strokeWidth="2.4" />
          <line x1="94" y1="16" x2="94" y2="132" stroke="#FCA5A5" strokeWidth="1.4" strokeDasharray="5 4" />
          <line x1="30" y1="74" x2="158" y2="74" stroke="#FCA5A5" strokeWidth="1.4" strokeDasharray="5 4" />
          <path d="M56 52 C74 40, 114 40, 134 52 C110 66, 72 78, 60 98 C82 90, 116 92, 136 104" fill="none" stroke="#1C1917" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="40" y="104" width="15" height="15" rx="2" fill="#B91C1C" />

          <rect x="174" y="88" width="46" height="34" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="197" cy="105" rx="15" ry="9.5" fill="#0F172A" />

          <path d="M216 18 L166 86 L174 92 L224 24 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.6" />
          <path d="M166 86 L154 106 L174 92 Z" fill="#1C1917" />
        </svg>
      );

    case 'supermarket-shopping':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#F0FDF4" />
          <rect y="114" width="240" height="36" fill="#DCFCE7" />
          {/* Supermarket shelves */}
          <rect x="18" y="16" width="120" height="86" rx="5" fill="#FFFFFF" stroke="#86EFAC" strokeWidth="2.4" />
          <line x1="18" y1="44" x2="138" y2="44" stroke="#CBD5E1" strokeWidth="3" />
          <line x1="18" y1="74" x2="138" y2="74" stroke="#CBD5E1" strokeWidth="3" />
          {/* Milk cartons & grocery boxes */}
          <rect x="28" y="23" width="16" height="20" rx="2" fill="#38BDF8" />
          <polygon points="28,23 36,18 44,23" fill="#0284C7" />
          <rect x="50" y="23" width="16" height="20" rx="2" fill="#38BDF8" />
          <polygon points="50,23 58,18 66,23" fill="#0284C7" />
          <circle cx="88" cy="34" r="8" fill="#EF4444" />
          <circle cx="106" cy="34" r="8" fill="#F59E0B" />
          <circle cx="122" cy="34" r="7" fill="#22C55E" />
          <rect x="28" y="52" width="22" height="20" rx="3" fill="#F97316" />
          <rect x="56" y="54" width="18" height="18" rx="3" fill="#EAB308" />
          <rect x="82" y="50" width="16" height="22" rx="3" fill="#EC4899" />
          <rect x="104" y="54" width="24" height="18" rx="3" fill="#14B8A6" />
          {/* Shopping cart */}
          <path d="M126 78 H198 L190 112 H136 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="2.6" strokeLinejoin="round" />
          <line x1="148" y1="78" x2="150" y2="112" stroke="#64748B" strokeWidth="1.8" />
          <line x1="168" y1="78" x2="168" y2="112" stroke="#64748B" strokeWidth="1.8" />
          <line x1="186" y1="78" x2="182" y2="112" stroke="#64748B" strokeWidth="1.8" />
          <line x1="130" y1="95" x2="194" y2="95" stroke="#64748B" strokeWidth="1.8" />
          {/* Items inside cart */}
          <rect x="140" y="62" width="18" height="22" rx="2" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <circle cx="170" cy="72" r="9" fill="#DC2626" />
          <path d="M170 63 Q174 58 178 61" fill="none" stroke="#15803D" strokeWidth="2" />
          <ellipse cx="186" cy="74" rx="8" ry="11" fill="#F59E0B" />
          {/* Cart handle & wheels */}
          <path d="M198 78 L208 62 H222" fill="none" stroke="#B91C1C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="144" cy="124" r="8" fill="#1E293B" />
          <circle cx="144" cy="124" r="3" fill="#CBD5E1" />
          <circle cx="184" cy="124" r="8" fill="#1E293B" />
          <circle cx="184" cy="124" r="3" fill="#CBD5E1" />
        </svg>
      );

    case 'taxi-ride':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#E0F2FE" />
          {/* City skyline silhouette */}
          <rect x="16" y="40" width="28" height="62" fill="#BAE6FD" />
          <rect x="50" y="24" width="34" height="78" fill="#93C5FD" />
          <rect x="158" y="34" width="32" height="68" fill="#BAE6FD" />
          <rect x="196" y="48" width="28" height="54" fill="#93C5FD" />
          {/* Asphalt road */}
          <rect y="102" width="240" height="48" fill="#334155" />
          <line x1="14" y1="128" x2="54" y2="128" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          <line x1="94" y1="128" x2="144" y2="128" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          <line x1="184" y1="128" x2="226" y2="128" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          {/* Taxi roof light */}
          <rect x="102" y="48" width="32" height="11" rx="3" fill="#FDE047" stroke="#92400E" strokeWidth="2" />
          {/* Taxi body */}
          <path d="M56 80 L76 58 H162 L184 80 H208 C216 80, 220 86, 220 94 V110 H24 V94 C24 85, 32 80, 42 80 Z" fill="#FACC15" stroke="#854D0E" strokeWidth="2.4" />
          {/* Windows */}
          <path d="M80 63 H116 V80 H64 Z" fill="#E0F2FE" stroke="#475569" strokeWidth="1.6" />
          <path d="M122 63 H158 L174 80 H122 Z" fill="#E0F2FE" stroke="#475569" strokeWidth="1.6" />
          {/* Checkered taxi stripe */}
          <rect x="52" y="92" width="12" height="7" fill="#1E293B" />
          <rect x="76" y="92" width="12" height="7" fill="#1E293B" />
          <rect x="100" y="92" width="12" height="7" fill="#1E293B" />
          <rect x="124" y="92" width="12" height="7" fill="#1E293B" />
          <rect x="148" y="92" width="12" height="7" fill="#1E293B" />
          <rect x="172" y="92" width="12" height="7" fill="#1E293B" />
          {/* Headlight & taillight */}
          <rect x="210" y="88" width="10" height="8" rx="2" fill="#FEF9C3" />
          <rect x="24" y="88" width="8" height="8" rx="2" fill="#DC2626" />
          {/* Wheels */}
          <circle cx="68" cy="112" r="15" fill="#0F172A" />
          <circle cx="68" cy="112" r="7" fill="#94A3B8" />
          <circle cx="176" cy="112" r="15" fill="#0F172A" />
          <circle cx="176" cy="112" r="7" fill="#94A3B8" />
        </svg>
      );

    case 'cinema-movie':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#1E1B4B" />
          {/* Cinema screen */}
          <rect x="26" y="14" width="188" height="74" rx="5" fill="#F8FAFC" stroke="#6366F1" strokeWidth="3" />
          {/* Animated landscape playing on screen */}
          <rect x="30" y="18" width="180" height="66" rx="3" fill="#38BDF8" />
          <circle cx="176" cy="36" r="10" fill="#FDE047" />
          <polygon points="30,84 82,42 134,84" fill="#15803D" />
          <polygon points="94,84 148,46 210,84" fill="#166534" />
          {/* Red curtains */}
          <path d="M18 10 H36 Q32 52 24 94 H18 Z" fill="#B91C1C" />
          <path d="M222 10 H204 Q208 52 216 94 H222 Z" fill="#B91C1C" />
          {/* Theater seats row */}
          <rect x="28" y="108" width="32" height="28" rx="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
          <rect x="68" y="108" width="32" height="28" rx="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
          <rect x="108" y="108" width="32" height="28" rx="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
          <rect x="148" y="108" width="32" height="28" rx="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
          <rect x="188" y="108" width="28" height="28" rx="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
          {/* Popcorn bucket silhouette */}
          <polygon points="104,104 114,104 112,120 106,120" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
          <circle cx="109" cy="102" r="4" fill="#FEF9C3" />
        </svg>
      );

    case 'cat-under-table':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FEFCE8" />
          <rect y="114" width="240" height="36" fill="#E7D7BE" />
          {/* Wooden table */}
          <rect x="26" y="46" width="188" height="14" rx="4" fill="#92400E" />
          <rect x="38" y="60" width="11" height="72" rx="2" fill="#78350F" />
          <rect x="191" y="60" width="11" height="72" rx="2" fill="#78350F" />
          {/* Small vase on top of table */}
          <ellipse cx="164" cy="36" rx="10" ry="12" fill="#38BDF8" />
          <circle cx="164" cy="20" r="6" fill="#F472B6" />
          {/* Cute orange cat sitting under the table */}
          <ellipse cx="118" cy="126" rx="34" ry="7" fill="#C4B094" />
          <path d="M142 114 Q166 106 164 90" fill="none" stroke="#F97316" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="116" cy="112" rx="26" ry="17" fill="#FB923C" />
          <circle cx="112" cy="86" r="19" fill="#FB923C" />
          {/* Cat ears */}
          <polygon points="96,76 94,58 108,70" fill="#EA580C" />
          <polygon points="128,76 130,58 116,70" fill="#EA580C" />
          {/* Cat face */}
          <circle cx="105" cy="85" r="2.8" fill="#1C1917" />
          <circle cx="119" cy="85" r="2.8" fill="#1C1917" />
          <polygon points="112,90 109,94 115,94" fill="#EC4899" />
          <line x1="86" y1="88" x2="99" y2="90" stroke="#7C2D12" strokeWidth="1.6" />
          <line x1="86" y1="94" x2="99" y2="94" stroke="#7C2D12" strokeWidth="1.6" />
          <line x1="125" y1="90" x2="138" y2="88" stroke="#7C2D12" strokeWidth="1.6" />
          <line x1="125" y1="94" x2="138" y2="94" stroke="#7C2D12" strokeWidth="1.6" />
          {/* Paws */}
          <ellipse cx="104" cy="126" rx="7" ry="4.5" fill="#FFEDD5" />
          <ellipse cx="122" cy="126" rx="7" ry="4.5" fill="#FFEDD5" />
        </svg>
      );

    case 'dog-playing':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#DBEAFE" />
          <circle cx="204" cy="28" r="15" fill="#FDE047" />
          <rect y="94" width="240" height="56" fill="#4ADE80" />
          <ellipse cx="102" cy="130" rx="44" ry="8" fill="#22C55E" />
          {/* Happy brown puppy */}
          <path d="M58 92 Q44 76 54 68" fill="none" stroke="#92400E" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="96" cy="100" rx="34" ry="20" fill="#B45309" />
          <rect x="70" y="110" width="11" height="22" rx="5" fill="#92400E" />
          <rect x="114" y="110" width="11" height="22" rx="5" fill="#92400E" />
          {/* Puppy head & floppy ears */}
          <circle cx="132" cy="72" r="21" fill="#D97706" />
          <ellipse cx="114" cy="76" rx="8" ry="15" fill="#78350F" />
          <ellipse cx="149" cy="76" rx="8" ry="15" fill="#78350F" />
          <ellipse cx="134" cy="80" rx="10" ry="7" fill="#FEF3C7" />
          <circle cx="126" cy="68" r="2.8" fill="#1C1917" />
          <circle cx="140" cy="68" r="2.8" fill="#1C1917" />
          <ellipse cx="134" cy="77" rx="4.2" ry="3" fill="#1C1917" />
          <path d="M130 84 Q134 89 138 84" fill="#EF4444" />
          {/* Red collar */}
          <rect x="112" y="88" width="26" height="6" rx="3" fill="#DC2626" />
          {/* Colorful ball */}
          <circle cx="186" cy="118" r="15" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          <path d="M174 110 Q186 118 198 110" fill="none" stroke="#FEF08A" strokeWidth="3" />
        </svg>
      );

    case 'apples-fruit':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FFF7ED" />
          <rect y="108" width="240" height="42" fill="#FED7AA" />
          {/* Woven fruit basket */}
          <path d="M46 84 H194 L176 130 H64 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.6" />
          <line x1="56" y1="100" x2="184" y2="100" stroke="#F59E0B" strokeWidth="2.4" />
          <line x1="60" y1="115" x2="180" y2="115" stroke="#F59E0B" strokeWidth="2.4" />
          {/* Bright red & green apples piled in basket */}
          <circle cx="84" cy="76" r="22" fill="#DC2626" />
          <circle cx="78" cy="68" r="5" fill="#FCA5A5" opacity="0.65" />
          <path d="M84 54 Q88 44 96 48" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="122" cy="68" r="24" fill="#EF4444" />
          <circle cx="115" cy="60" r="6" fill="#FCA5A5" opacity="0.65" />
          <ellipse cx="132" cy="44" rx="9" ry="4.5" fill="#22C55E" transform="rotate(-20 132 44)" />
          <circle cx="158" cy="76" r="22" fill="#B91C1C" />
          <circle cx="152" cy="68" r="5" fill="#FCA5A5" opacity="0.65" />
          <ellipse cx="166" cy="52" rx="8" ry="4" fill="#16A34A" transform="rotate(20 166 52)" />
          {/* Two apples resting on table */}
          <circle cx="40" cy="116" r="15" fill="#22C55E" />
          <circle cx="204" cy="116" r="16" fill="#EF4444" />
          <circle cx="199" cy="110" r="4" fill="#FCA5A5" opacity="0.7" />
        </svg>
      );

    case 'clothing-shop':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FDF2F8" />
          <rect y="122" width="240" height="28" fill="#FBCFE8" />
          {/* Clothing rack frame */}
          <line x1="24" y1="30" x2="216" y2="30" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
          <line x1="34" y1="30" x2="34" y2="128" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
          <line x1="206" y1="30" x2="206" y2="128" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
          {/* Shirt 1 (Blue jacket) */}
          <path d="M68 30 L52 46 L62 56 L66 50 V104 H94 V50 L98 56 L108 46 L92 30 Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2" />
          <line x1="80" y1="36" x2="80" y2="104" stroke="#93C5FD" strokeWidth="2" />
          {/* Shirt 2 (Red dress) */}
          <path d="M120 30 L108 46 L114 54 L110 112 H146 L142 54 L148 46 L136 30 Z" fill="#E11D48" stroke="#881337" strokeWidth="2" />
          <rect x="112" y="68" width="32" height="5" fill="#FDE047" />
          {/* Shirt 3 (Emerald sweater) */}
          <path d="M168 30 L152 46 L160 56 L164 50 V102 H190 V50 L194 56 L202 46 L186 30 Z" fill="#10B981" stroke="#065F46" strokeWidth="2" />
          <circle cx="177" cy="64" r="5" fill="#FEF3C7" />
        </svg>
      );

    case 'driving-car':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#DBEAFE" />
          <circle cx="42" cy="30" r="14" fill="#FBBF24" />
          <rect y="98" width="240" height="52" fill="#475569" />
          <line x1="16" y1="126" x2="72" y2="126" stroke="#FFFFFF" strokeWidth="3.5" strokeDasharray="16 14" />
          <line x1="110" y1="126" x2="224" y2="126" stroke="#FFFFFF" strokeWidth="3.5" strokeDasharray="16 14" />
          {/* Sedan car */}
          <path d="M52 80 L76 52 H154 L182 80 H206 C214 80, 218 86, 218 94 V108 H24 V94 C24 85, 32 80, 42 80 Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="2.4" />
          <path d="M82 58 H118 V80 H64 Z" fill="#E0F2FE" />
          <path d="M124 58 H150 L170 80 H124 Z" fill="#E0F2FE" />
          {/* Driver silhouette & steering wheel */}
          <circle cx="140" cy="67" r="7.5" fill="#F8D2B4" />
          <path d="M133 65 C133 58, 147 58, 147 65 Z" fill="#1C1917" />
          <line x1="154" y1="78" x2="162" y2="69" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="68" cy="110" r="15" fill="#0F172A" />
          <circle cx="68" cy="110" r="7" fill="#CBD5E1" />
          <circle cx="174" cy="110" r="15" fill="#0F172A" />
          <circle cx="174" cy="110" r="7" fill="#CBD5E1" />
        </svg>
      );

    case 'sleeping-bed':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#1E293B" />
          {/* Window with crescent moon & stars */}
          <rect x="158" y="16" width="60" height="52" rx="5" fill="#0F172A" stroke="#64748B" strokeWidth="3" />
          <circle cx="196" cy="34" r="10" fill="#FDE047" />
          <circle cx="201" cy="31" r="9" fill="#0F172A" />
          <circle cx="174" cy="30" r="2.2" fill="#FEF08A" />
          <circle cx="180" cy="48" r="1.8" fill="#FEF08A" />
          <circle cx="206" cy="52" r="2" fill="#FEF08A" />
          {/* Bed frame */}
          <rect x="22" y="74" width="12" height="58" rx="3" fill="#92400E" />
          <rect x="206" y="92" width="12" height="40" rx="3" fill="#92400E" />
          <rect x="22" y="108" width="196" height="14" rx="3" fill="#B45309" />
          {/* Pillow & sleeping person */}
          <ellipse cx="56" cy="96" rx="22" ry="11" fill="#F8FAFC" />
          <circle cx="62" cy="90" r="14" fill="#F8D2B4" />
          <path d="M48 88 C48 74, 76 74, 76 88 Z" fill="#1C1917" />
          <path d="M56 91 Q60 94 64 91" fill="none" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M67 91 Q70 94 73 91" fill="none" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cozy blue blanket */}
          <path d="M74 86 C112 78, 178 82, 206 96 V110 H74 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <path d="M74 86 H88 V110 H74 Z" fill="#BFDBFE" />
        </svg>
      );

    case 'rainy-weather':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#CBD5E1" />
          <rect y="118" width="240" height="32" fill="#94A3B8" />
          {/* Rain clouds */}
          <ellipse cx="70" cy="34" rx="34" ry="16" fill="#64748B" />
          <ellipse cx="102" cy="30" rx="26" ry="15" fill="#475569" />
          <ellipse cx="176" cy="34" rx="30" ry="15" fill="#64748B" />
          {/* Raindrops */}
          <line x1="48" y1="54" x2="42" y2="68" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="78" y1="58" x2="72" y2="72" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="158" y1="54" x2="152" y2="68" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="190" y1="56" x2="184" y2="70" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="210" y1="74" x2="204" y2="88" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="36" y1="86" x2="30" y2="100" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
          {/* Bright red umbrella */}
          <path d="M68 88 A52 38 0 0 1 172 88 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.2" />
          <path d="M96 88 A24 38 0 0 1 144 88 Z" fill="#EF4444" />
          <line x1="120" y1="88" x2="120" y2="126" stroke="#1E293B" strokeWidth="3.5" />
          <path d="M120 126 A7 7 0 0 1 108 126" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          {/* Puddle ripples */}
          <ellipse cx="178" cy="132" rx="24" ry="5" fill="#38BDF8" opacity="0.65" />
          <ellipse cx="64" cy="134" rx="20" ry="4.5" fill="#38BDF8" opacity="0.65" />
        </svg>
      );

    case 'snowy-weather':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#DBEAFE" />
          <path d="M0 112 Q70 96 140 110 T240 106 V150 H0 Z" fill="#FFFFFF" />
          {/* Snowy pine tree */}
          <polygon points="48,44 26,96 70,96" fill="#15803D" />
          <polygon points="48,44 38,66 58,66" fill="#F8FAFC" />
          <rect x="44" y="96" width="8" height="16" fill="#78350F" />
          {/* Cheerful snowman */}
          <circle cx="144" cy="108" r="22" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
          <circle cx="144" cy="78" r="16" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
          {/* Scarf & hat */}
          <rect x="130" y="90" width="28" height="6" rx="3" fill="#DC2626" />
          <rect x="150" y="94" width="6" height="15" rx="2" fill="#DC2626" />
          <rect x="132" y="54" width="24" height="10" rx="2" fill="#1E293B" />
          <rect x="126" y="62" width="36" height="4" rx="2" fill="#1E293B" />
          {/* Carrot nose & eyes */}
          <circle cx="139" cy="74" r="2" fill="#1E293B" />
          <circle cx="149" cy="74" r="2" fill="#1E293B" />
          <polygon points="144,78 156,81 144,83" fill="#F97316" />
          {/* Falling snowflakes */}
          <circle cx="28" cy="28" r="4" fill="#FFFFFF" />
          <circle cx="88" cy="24" r="4.5" fill="#FFFFFF" />
          <circle cx="114" cy="46" r="3.5" fill="#FFFFFF" />
          <circle cx="188" cy="28" r="4.5" fill="#FFFFFF" />
          <circle cx="212" cy="54" r="4" fill="#FFFFFF" />
          <circle cx="196" cy="84" r="3.5" fill="#FFFFFF" />
          <circle cx="86" cy="72" r="3.5" fill="#FFFFFF" />
        </svg>
      );

    case 'taking-medicine':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#ECFEFF" />
          <rect y="106" width="240" height="44" fill="#E2E8F0" />
          {/* Medicine bottle */}
          <rect x="44" y="42" width="46" height="68" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2.4" />
          <rect x="52" y="28" width="30" height="14" rx="3" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
          <rect x="46" y="60" width="42" height="30" fill="#FFFFFF" />
          {/* Red medical cross on label */}
          <rect x="64" y="66" width="6" height="18" rx="1" fill="#DC2626" />
          <rect x="58" y="72" width="18" height="6" rx="1" fill="#DC2626" />
          {/* Two capsules */}
          <rect x="104" y="100" width="24" height="11" rx="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <rect x="116" y="100" width="12" height="11" rx="5.5" fill="#FFFFFF" />
          <rect x="114" y="118" width="24" height="11" rx="5.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          <rect x="126" y="118" width="12" height="11" rx="5.5" fill="#FFFFFF" />
          {/* Glass of warm water with steam */}
          <polygon points="154,50 198,50 192,110 160,110" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.4" />
          <polygon points="157,68 195,68 191,108 161,108" fill="#38BDF8" opacity="0.65" />
          <path d="M168 42 Q164 32 170 24" fill="none" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M184 42 Q180 32 186 24" fill="none" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'breakfast-bread-egg':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FEF9C3" />
          <rect y="104" width="240" height="46" fill="#FDE68A" />
          {/* White breakfast plate */}
          <ellipse cx="104" cy="94" rx="74" ry="34" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          {/* Bread slice */}
          <path d="M56 76 C56 62, 102 62, 102 76 V104 H56 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="2.4" />
          <path d="M62 78 C62 68, 96 68, 96 78 V99 H62 Z" fill="#FEF3C7" />
          {/* Fried egg */}
          <ellipse cx="132" cy="94" rx="28" ry="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="132" cy="93" r="11" fill="#FACC15" stroke="#D97706" strokeWidth="1.6" />
          {/* Glass of milk */}
          <polygon points="184,42 220,42 215,108 189,108" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2.4" />
          <polygon points="186,58 218,58 214,106 190,106" fill="#F1F5F9" />
          <path d="M196 36 Q202 24 208 36" fill="none" stroke="#CBD5E1" strokeWidth="2.2" />
        </svg>
      );

    case 'train-station':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#E0F2FE" />
          <rect y="108" width="240" height="42" fill="#94A3B8" />
          {/* Railway tracks */}
          <line x1="0" y1="122" x2="240" y2="122" stroke="#334155" strokeWidth="4" />
          <line x1="0" y1="134" x2="240" y2="134" stroke="#334155" strokeWidth="4" />
          {/* High-speed sleek bullet train */}
          <path d="M18 60 H164 C194 60, 218 76, 224 98 V112 H18 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="2.4" />
          <path d="M18 92 H222 V102 H18 Z" fill="#DC2626" />
          {/* Train windows */}
          <rect x="30" y="70" width="24" height="16" rx="3" fill="#38BDF8" />
          <rect x="62" y="70" width="24" height="16" rx="3" fill="#38BDF8" />
          <rect x="94" y="70" width="24" height="16" rx="3" fill="#38BDF8" />
          <rect x="126" y="70" width="24" height="16" rx="3" fill="#38BDF8" />
          <path d="M160 70 H188 C196 74, 202 80, 206 86 H160 Z" fill="#0F172A" />
          {/* Overhead power line */}
          <line x1="0" y1="36" x2="240" y2="36" stroke="#64748B" strokeWidth="2" />
          <path d="M90 60 L104 46 L94 36" fill="none" stroke="#475569" strokeWidth="2.4" />
        </svg>
      );

    case 'airport-plane':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#BAE6FD" />
          {/* Soft clouds */}
          <ellipse cx="52" cy="36" rx="26" ry="11" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="192" cy="40" rx="28" ry="12" fill="#FFFFFF" opacity="0.9" />
          {/* Airport control tower & terminal */}
          <rect x="16" y="106" width="110" height="32" rx="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <rect x="26" y="114" width="90" height="14" rx="2" fill="#38BDF8" />
          <rect x="150" y="88" width="16" height="50" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <polygon points="140,88 176,88 170,74 146,74" fill="#38BDF8" stroke="#475569" strokeWidth="2" />
          <rect y="134" width="240" height="16" fill="#475569" />
          {/* Passenger airplane taking off */}
          <g transform="translate(36, 22) rotate(-14)">
            <ellipse cx="90" cy="48" rx="56" ry="11" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
            <polygon points="78,48 56,18 76,18 104,48" fill="#2563EB" />
            <polygon points="78,52 60,78 78,78 104,52" fill="#1D4ED8" />
            <polygon points="44,44 30,24 44,24 58,44" fill="#DC2626" />
            <circle cx="116" cy="46" r="3" fill="#38BDF8" />
            <circle cx="104" cy="46" r="3" fill="#38BDF8" />
            <circle cx="92" cy="46" r="3" fill="#38BDF8" />
            <circle cx="80" cy="46" r="3" fill="#38BDF8" />
          </g>
        </svg>
      );

    case 'singing-song':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FAF5FF" />
          <circle cx="120" cy="76" r="56" fill="#F3E8FF" />
          {/* Singer */}
          <circle cx="102" cy="54" r="18" fill="#F8D2B4" />
          <path d="M84 52 C84 32, 120 32, 120 52 L122 68 L82 68 Z" fill="#3B2314" />
          <circle cx="96" cy="54" r="2.2" fill="#1C1917" />
          <circle cx="108" cy="54" r="2.2" fill="#1C1917" />
          <ellipse cx="102" cy="62" rx="4.5" ry="3.5" fill="#BE123C" />
          <path d="M76 94 C76 74, 128 74, 128 94 L132 142 H72 Z" fill="#9333EA" />
          {/* Microphone */}
          <path d="M122 96 L142 78" stroke="#9333EA" strokeWidth="9" strokeLinecap="round" />
          <line x1="146" y1="74" x2="132" y2="88" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
          <circle cx="148" cy="72" r="8" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
          {/* Musical notes floating */}
          <circle cx="176" cy="44" r="6" fill="#EC4899" />
          <line x1="182" y1="44" x2="182" y2="20" stroke="#EC4899" strokeWidth="3" />
          <line x1="182" y1="20" x2="204" y2="26" stroke="#EC4899" strokeWidth="3.5" />
          <circle cx="198" cy="50" r="6" fill="#EC4899" />
          <line x1="204" y1="50" x2="204" y2="26" stroke="#EC4899" strokeWidth="3" />
          <circle cx="46" cy="48" r="5" fill="#8B5CF6" />
          <line x1="51" y1="48" x2="51" y2="28" stroke="#8B5CF6" strokeWidth="2.6" />
          <path d="M51 28 L62 32" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'steamed-buns':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FFFBEB" />
          <rect y="106" width="240" height="44" fill="#FDE68A" />
          {/* Bamboo steamer basket */}
          <ellipse cx="120" cy="112" rx="74" ry="22" fill="#B45309" />
          <rect x="46" y="84" width="148" height="28" fill="#D97706" stroke="#92400E" strokeWidth="2.2" />
          <ellipse cx="120" cy="84" rx="74" ry="22" fill="#F59E0B" stroke="#92400E" strokeWidth="2.4" />
          <ellipse cx="120" cy="84" rx="64" ry="17" fill="#FEF3C7" />
          {/* Fluffy white baozi steamed buns */}
          <ellipse cx="90" cy="82" rx="22" ry="15" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="90" cy="70" r="3" fill="#CBD5E1" />
          <ellipse cx="148" cy="82" rx="22" ry="15" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="148" cy="70" r="3" fill="#CBD5E1" />
          <ellipse cx="120" cy="90" rx="24" ry="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="120" cy="77" r="3.5" fill="#CBD5E1" />
          {/* Rising steam curls */}
          <path d="M88 52 Q82 38 90 24" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M120 48 Q114 32 122 18" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M152 52 Q146 38 154 24" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    case 'watching-tv':
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FEF3C7" />
          <rect y="112" width="240" height="38" fill="#D6BE9B" />
          {/* TV cabinet & glowing screen */}
          <rect x="64" y="20" width="112" height="68" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="70" y="26" width="100" height="54" rx="3" fill="#38BDF8" />
          <circle cx="148" cy="40" r="8" fill="#FDE047" />
          <polygon points="70,80 108,46 146,80" fill="#22C55E" />
          <rect x="110" y="88" width="20" height="10" fill="#334155" />
          <rect x="92" y="96" width="56" height="6" rx="2" fill="#334155" />
          <rect x="46" y="102" width="148" height="22" rx="4" fill="#92400E" />
          {/* Potted plant beside TV */}
          <rect x="14" y="100" width="22" height="24" rx="3" fill="#C2410C" />
          <circle cx="25" cy="88" r="14" fill="#16A34A" />
          {/* Cozy lamp on right */}
          <rect x="208" y="96" width="10" height="28" fill="#78350F" />
          <polygon points="198,96 228,96 222,74 204,74" fill="#F59E0B" />
        </svg>
      );

    case 'friends-cafe':
    default:
      return (
        <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
          <rect width="240" height="150" rx="10" fill="#FEF7EE" />
          <line x1="120" y1="0" x2="120" y2="24" stroke="#78350F" strokeWidth="2.6" />
          <path d="M100 36 Q120 16 140 36 Z" fill="#D97706" />
          <polygon points="102,36 138,36 168,96 72,96" fill="#FDE68A" opacity="0.25" />

          <circle cx="56" cy="54" r="15.5" fill="#F8D2B4" />
          <path d="M40 52 C40 33, 72 33, 72 52 Z" fill="#1C1917" />
          <path d="M32 94 C32 70, 80 70, 80 94 L84 138 H28 Z" fill="#D97706" />

          <circle cx="184" cy="54" r="15.5" fill="#F8D2B4" />
          <path d="M168 52 C168 33, 200 33, 200 52 L202 68 L166 68 Z" fill="#3B2314" />
          <path d="M160 94 C160 70, 208 70, 208 94 L212 138 H156 Z" fill="#B91C1C" />

          <rect x="78" y="92" width="84" height="9" rx="4" fill="#8B5A2B" />
          <rect x="115" y="101" width="10" height="38" fill="#6D441F" />
          <rect x="94" y="136" width="52" height="6" rx="3" fill="#6D441F" />
          <rect x="86" y="78" width="15" height="14" rx="2" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2" />
          <rect x="139" y="78" width="15" height="14" rx="2" fill="#FFFFFF" stroke="#15803D" strokeWidth="2" />
          <ellipse cx="120" cy="88" rx="11" ry="4.5" fill="#F59E0B" />
        </svg>
      );
  }
}
