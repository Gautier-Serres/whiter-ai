export default function ContentBuilds() {
  return (
    <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="480" height="300" fill="#F0FDFA" rx="16" />

      {/* ── Microphone ── */}
      <rect x="80" y="90" width="44" height="72" rx="22" fill="#0F766E" opacity=".15" stroke="#0F766E" strokeWidth="2" />
      <rect x="90" y="100" width="24" height="52" rx="12" fill="#0F766E" opacity=".3" />
      {/* Stand */}
      <path d="M102 162 Q102 185 102 190" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 190 H118" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sound arcs */}
      <path d="M62 118 Q52 138 62 158" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" opacity=".3" fill="none" />
      <path d="M50 108 Q36 138 50 168" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" opacity=".15" fill="none" />

      {/* ── Audio waveform bars ── */}
      {[
        { x: 150, h: 20 }, { x: 162, h: 36 }, { x: 174, h: 52 }, { x: 186, h: 36 },
        { x: 198, h: 60 }, { x: 210, h: 44 }, { x: 222, h: 28 },
      ].map(({ x, h }, i) => (
        <rect key={i} x={x} y={150 - h / 2} width="8" height={h} rx="4"
          fill="#0F766E" opacity={0.15 + i * 0.08} />
      ))}

      {/* ── Arrow ── */}
      <path d="M238 138 H270" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      <path d="M264 132 L272 138 L264 144" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Board panel ── */}
      <rect x="284" y="60" width="150" height="180" rx="12" fill="white" stroke="#CCFBF1" strokeWidth="2" />
      {/* Header bar */}
      <rect x="284" y="60" width="150" height="28" rx="12" fill="#0F766E" />
      <rect x="284" y="76" width="150" height="12" fill="#0F766E" />
      <circle cx="300" cy="74" r="4" fill="white" opacity=".5" />
      <rect x="312" y="70" width="60" height="7" rx="3" fill="white" opacity=".4" />

      {/* Row 1 — Key Decision */}
      <rect x="296" y="100" width="56" height="16" rx="4" fill="#CCFBF1" />
      <rect x="296" y="101" width="56" height="14" rx="4" fill="#CCFBF1" />
      <text x="324" y="112" textAnchor="middle" fill="#0F766E" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">KEY DECISION</text>
      <rect x="296" y="120" width="118" height="6" rx="3" fill="#E5E7EB" />
      <rect x="296" y="130" width="90" height="6" rx="3" fill="#E5E7EB" />

      {/* Row 2 — Action Item */}
      <rect x="296" y="146" width="52" height="16" rx="4" fill="#EDE9FE" />
      <text x="322" y="158" textAnchor="middle" fill="#7C3AED" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">ACTION ITEM</text>
      <rect x="296" y="166" width="118" height="6" rx="3" fill="#E5E7EB" />
      <rect x="296" y="176" width="70" height="6" rx="3" fill="#E5E7EB" />

      {/* Row 3 — Risk (appearing / partial) */}
      <rect x="296" y="192" width="34" height="16" rx="4" fill="#FEF3C7" opacity=".8" />
      <text x="313" y="204" textAnchor="middle" fill="#B45309" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">RISK</text>
      <rect x="296" y="212" width="80" height="6" rx="3" fill="#E5E7EB" opacity=".5" />

      {/* Blinking cursor */}
      <rect x="378" y="212" width="2" height="10" rx="1" fill="#0F766E" opacity=".7" />

      {/* Label */}
      <rect x="158" y="255" width="164" height="24" rx="12" fill="#0F766E" opacity=".08" />
      <text x="240" y="271" textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.08em">BUILDS AS YOU SPEAK</text>
    </svg>
  );
}
