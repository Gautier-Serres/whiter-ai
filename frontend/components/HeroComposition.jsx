import { useCurrentFrame, interpolate, AbsoluteFill, Sequence } from "remotion";

const WORDS = ["Agile", "Roadmap", "Q4", "Strategy", "Vision", "Growth", "OKRs", "Pipeline"];
const SLIDES = [
  { title: "Q4 Strategy", bullets: ["Revenue +40%", "Launch v2.0", "Expand EU"] },
  { title: "Product Roadmap", bullets: ["AI features", "Mobile app", "API access"] },
  { title: "Growth Vision", bullets: ["10k users", "Series A", "Global reach"] },
];

function SpeechWave({ frame }) {
  const bars = Array.from({ length: 12 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 32 }}>
      {bars.map((_, i) => {
        const height = interpolate(
          Math.sin((frame * 0.15 + i * 0.7) % (2 * Math.PI)),
          [-1, 1],
          [4, 28],
        );
        return (
          <div
            key={i}
            style={{
              width: 4,
              height,
              borderRadius: 2,
              background: "linear-gradient(180deg, #A78BFA, #6366F1)",
            }}
          />
        );
      })}
    </div>
  );
}

function FloatingWord({ word, frame, delay, x, y }) {
  const opacity = interpolate(frame - delay, [0, 15, 60, 75], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame - delay, [0, 75], [0, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "rgba(99,102,241,0.15)",
        border: "1px solid rgba(99,102,241,0.4)",
        borderRadius: 6,
        padding: "4px 10px",
        color: "#A78BFA",
        fontSize: 13,
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {word}
    </div>
  );
}

function SlidePreview({ slide, frame, delay }) {
  const opacity = interpolate(frame - delay, [0, 20, 80, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame - delay, [0, 20], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: "rgba(15,15,25,0.95)",
        border: "1px solid rgba(99,102,241,0.5)",
        borderRadius: 12,
        padding: "20px 24px",
        width: 220,
        boxShadow: "0 0 30px rgba(99,102,241,0.2)",
      }}
    >
      <div
        style={{
          color: "#A78BFA",
          fontSize: 10,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Auto-generated
      </div>
      <div
        style={{
          color: "#fff",
          fontSize: 15,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {slide.title}
      </div>
      {slide.bullets.map((b, i) => (
        <div
          key={i}
          style={{
            color: "#94a3b8",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#6366F1",
              flexShrink: 0,
            }}
          />
          {b}
        </div>
      ))}
    </div>
  );
}

export function HeroComposition() {
  const frame = useCurrentFrame();
  const cycleLength = 60;
  const wordPositions = [
    { x: 20, y: 30 }, { x: 120, y: 80 }, { x: 60, y: 140 },
    { x: 160, y: 50 }, { x: 30, y: 190 }, { x: 140, y: 160 },
    { x: 80, y: 240 }, { x: 180, y: 220 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0A0F 0%, #0f0f1a 50%, #12101f 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "0 30px",
        fontFamily: "Space Grotesk, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Left: mic + speech viz */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          width: 260,
          height: 300,
        }}
      >
        {/* Mic icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #A78BFA)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 ${interpolate(frame % 30, [0, 15, 30], [20, 40, 20])}px rgba(99,102,241,0.6)`,
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" />
            <path d="M5 10a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Speech wave */}
        <div style={{ position: "absolute", top: 68, left: "50%", transform: "translateX(-50%)" }}>
          <SpeechWave frame={frame} />
        </div>

        {/* Floating words */}
        {WORDS.map((word, i) => {
          const delay = i * (cycleLength / WORDS.length);
          const pos = wordPositions[i];
          return (
            <FloatingWord
              key={word}
              word={word}
              frame={frame % (cycleLength * 2)}
              delay={delay % cycleLength}
              x={pos.x}
              y={pos.y + 110}
            />
          );
        })}
      </div>

      {/* Arrow */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div
          style={{
            color: "#6366F1",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          AI
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#6366F1",
                opacity: interpolate(
                  (frame + i * 8) % 24,
                  [0, 8, 16, 24],
                  [0.2, 1, 0.2, 0.2],
                ),
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: slide output */}
      <div style={{ position: "relative", width: 240, height: 300, display: "flex", alignItems: "center" }}>
        {SLIDES.map((slide, i) => {
          const cycleDuration = 100;
          const delay = i * cycleDuration;
          return (
            <div key={i} style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}>
              <SlidePreview
                slide={slide}
                frame={frame % (SLIDES.length * cycleDuration)}
                delay={delay}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
