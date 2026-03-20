export default function PresentAnywhere() {
  return (
    <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <rect width="480" height="300" fill="#F0FDFA" rx="16" />

      {/* ── Central laptop ── */}
      <rect x="140" y="60" width="200" height="130" rx="10" fill="#0F766E" />
      <rect x="148" y="68" width="184" height="110" rx="6" fill="#CCFBF1" />
      {/* Screen content – board rows */}
      <rect x="158" y="78" width="80" height="8" rx="3" fill="#0F766E" opacity=".25" />
      <rect x="158" y="92" width="164" height="7" rx="3" fill="#0F766E" opacity=".15" />
      <rect x="158" y="104" width="140" height="7" rx="3" fill="#0F766E" opacity=".15" />
      {/* Card chips */}
      <rect x="158" y="118" width="52" height="18" rx="4" fill="#0F766E" opacity=".2" />
      <rect x="216" y="118" width="52" height="18" rx="4" fill="#0D9488" opacity=".2" />
      <rect x="274" y="118" width="40" height="18" rx="4" fill="#14B8A6" opacity=".2" />
      {/* Laptop base */}
      <rect x="120" y="192" width="240" height="10" rx="5" fill="#0F766E" opacity=".3" />
      <rect x="200" y="190" width="80" height="4" rx="2" fill="#0F766E" opacity=".2" />

      {/* ── Left phone ── */}
      <rect x="52" y="100" width="64" height="110" rx="10" fill="#0F766E" />
      <rect x="58" y="108" width="52" height="86" rx="5" fill="#CCFBF1" />
      <rect x="64" y="116" width="40" height="6" rx="2" fill="#0F766E" opacity=".25" />
      <rect x="64" y="127" width="36" height="5" rx="2" fill="#0F766E" opacity=".15" />
      <rect x="64" y="137" width="30" height="5" rx="2" fill="#0F766E" opacity=".15" />
      <rect x="64" y="150" width="40" height="14" rx="3" fill="#0F766E" opacity=".15" />
      {/* Wifi dots */}
      <circle cx="84" cy="218" r="3" fill="#0F766E" opacity=".4" />

      {/* ── Right tablet ── */}
      <rect x="364" y="80" width="80" height="110" rx="10" fill="#0F766E" />
      <rect x="370" y="88" width="68" height="86" rx="5" fill="#CCFBF1" />
      <rect x="376" y="96" width="56" height="7" rx="2" fill="#0F766E" opacity=".25" />
      <rect x="376" y="108" width="50" height="5" rx="2" fill="#0F766E" opacity=".15" />
      <rect x="376" y="118" width="44" height="5" rx="2" fill="#0F766E" opacity=".15" />
      <rect x="376" y="130" width="56" height="18" rx="3" fill="#0F766E" opacity=".15" />

      {/* ── Connection lines ── */}
      <line x1="116" y1="148" x2="140" y2="148" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 3" opacity=".4" />
      <line x1="340" y1="135" x2="364" y2="135" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 3" opacity=".4" />

      {/* ── Signal dots ── */}
      <circle cx="128" cy="148" r="4" fill="#0F766E" opacity=".5" />
      <circle cx="352" cy="135" r="4" fill="#0F766E" opacity=".5" />

      {/* ── Label ── */}
      <rect x="176" y="222" width="128" height="24" rx="12" fill="#0F766E" opacity=".08" />
      <text x="240" y="238" textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.08em">PRESENT ANYWHERE</text>
    </svg>
  );
}
