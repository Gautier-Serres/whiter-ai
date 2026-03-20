import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const TEAL = "#0F766E";

const CARDS = [
  { label: "Key Decision", icon: "✓", bg: "#CCFBF1", color: TEAL },
  { label: "Action Item", icon: "→", bg: "#E0F2FE", color: "#0369A1" },
  { label: "Risk Flagged", icon: "!", bg: "#FEF3C7", color: "#D97706" },
  { label: "Next Steps", icon: "▸", bg: "#F3E8FF", color: "#7C3AED" },
];

function BoardCard({ frame, startFrame, label, icon, bg, color }) {
  const progress = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
        background: bg,
        borderRadius: 8,
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <span style={{ color, fontWeight: 700, fontSize: 15 }}>{icon}</span>
      <span style={{ color, fontWeight: 600, fontSize: 13 }}>{label}</span>
    </div>
  );
}

export default function HeroComposition() {
  const frame = useCurrentFrame();

  const browserOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dot1 = 0.5 + 0.5 * Math.sin(frame * 0.25);
  const dot2 = 0.5 + 0.5 * Math.sin(frame * 0.25 + 1.2);
  const dot3 = 0.5 + 0.5 * Math.sin(frame * 0.25 + 2.4);
  const listeningOpacity = interpolate(frame, [140, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        style={{
          opacity: browserOpacity,
          width: 500,
          borderRadius: 14,
          border: "2px solid #E5E7EB",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            background: "#F3F4F6",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F87171" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FBBF24" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34D399" }} />
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 6,
              height: 22,
              marginLeft: 12,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            <span style={{ fontSize: 10, color: "#9CA3AF" }}>app.whiter.ai/board/q3-planning</span>
          </div>
        </div>

        {/* Board content */}
        <div style={{ background: "white", padding: 24, minHeight: 260 }}>
          <div style={{ opacity: titleOpacity, marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4, fontWeight: 600, letterSpacing: "0.08em" }}>
              LIVE BOARD
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#111827" }}>Q3 Planning Session</div>
          </div>

          {CARDS.map((card, i) => (
            <BoardCard key={card.label} frame={frame} startFrame={30 + i * 25} {...card} />
          ))}

          {/* Listening indicator */}
          <div
            style={{
              opacity: listeningOpacity,
              display: "flex",
              alignItems: "center",
              gap: 5,
              paddingTop: 10,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, opacity: dot1 }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, opacity: dot2 }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, opacity: dot3 }} />
            <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>Listening...</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
