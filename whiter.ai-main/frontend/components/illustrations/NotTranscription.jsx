export default function NotTranscription() {
  return (
    <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="480" height="300" fill="#F0FDFA" rx="16" />

      {/* ── LEFT — Raw transcript (greyed out) ── */}
      <rect x="40" y="60" width="160" height="180" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="56" y="78" width="128" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="90" width="110" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="102" width="128" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="114" width="90" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="126" width="120" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="138" width="100" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="150" width="128" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="162" width="80" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="174" width="118" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="186" width="96" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="198" width="128" height="6" rx="3" fill="#D1D5DB" />
      <rect x="56" y="210" width="72" height="6" rx="3" fill="#D1D5DB" />
      {/* Label */}
      <text x="120" y="256" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="0.06em">TRANSCRIPTION</text>
      {/* X mark */}
      <circle cx="120" cy="68" r="8" fill="#FEE2E2" />
      <path d="M116 64 L124 72 M124 64 L116 72" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />

      {/* ── Arrow with AI spark ── */}
      <path d="M208 148 H272" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      <path d="M266 142 L274 148 L266 154" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* AI label */}
      <rect x="222" y="132" width="36" height="18" rx="9" fill="#0F766E" />
      <text x="240" y="144" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Inter, sans-serif">AI</text>

      {/* ── RIGHT — Structured understanding ── */}
      <rect x="280" y="60" width="160" height="180" rx="12" fill="white" stroke="#CCFBF1" strokeWidth="2" />
      {/* Header */}
      <rect x="280" y="60" width="160" height="24" rx="12" fill="#0F766E" />
      <rect x="280" y="72" width="160" height="12" fill="#0F766E" />
      <rect x="294" y="67" width="80" height="8" rx="3" fill="white" opacity=".35" />

      {/* Key Decision block */}
      <rect x="292" y="94" width="58" height="16" rx="4" fill="#CCFBF1" />
      <text x="321" y="106" textAnchor="middle" fill="#0F766E" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">KEY DECISION</text>
      <rect x="292" y="114" width="136" height="6" rx="3" fill="#E5E7EB" />
      <rect x="292" y="124" width="100" height="6" rx="3" fill="#E5E7EB" />

      {/* Action item block */}
      <rect x="292" y="140" width="54" height="16" rx="4" fill="#EDE9FE" />
      <text x="319" y="152" textAnchor="middle" fill="#7C3AED" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">ACTION ITEM</text>
      <rect x="292" y="160" width="136" height="6" rx="3" fill="#E5E7EB" />
      <rect x="292" y="170" width="112" height="6" rx="3" fill="#E5E7EB" />

      {/* Risk block */}
      <rect x="292" y="186" width="34" height="16" rx="4" fill="#FEF3C7" />
      <text x="309" y="198" textAnchor="middle" fill="#B45309" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">RISK</text>
      <rect x="292" y="206" width="136" height="6" rx="3" fill="#E5E7EB" />
      <rect x="292" y="216" width="88" height="6" rx="3" fill="#E5E7EB" />

      {/* Check mark */}
      <circle cx="360" cy="68" r="8" fill="#CCFBF1" />
      <path d="M356 68 L359 71 L364 65" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Label */}
      <text x="360" y="256" textAnchor="middle" fill="#0F766E" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.06em">UNDERSTANDING</text>
    </svg>
  );
}
