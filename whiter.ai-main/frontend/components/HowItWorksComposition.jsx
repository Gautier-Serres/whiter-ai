import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const TEAL = "#0F766E";

const STEPS = [
  {
    number: "01",
    title: "Connect your meeting",
    desc: "Paste your meeting link or launch Whiter.ai directly. Compatible with all major video call platforms — no additional setup required.",
  },
  {
    number: "02",
    title: "Lead naturally",
    desc: "Run your meeting as you normally would. Whiter.ai listens in the background, processing speech in real time without any commands or interruptions.",
  },
  {
    number: "03",
    title: "Board builds live",
    desc: "A structured visual board appears for every attendee as you speak — key decisions, action items, and risks captured and organized automatically.",
  },
];

const STEP_DURATION = 100;

function Step({ step, opacity, translateY }) {
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 60px",
        position: "absolute",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: TEAL,
          letterSpacing: "0.12em",
          marginBottom: 14,
        }}
      >
        STEP {step.number}
      </div>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: TEAL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.01em",
        }}
      >
        {step.number}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#111827",
          marginBottom: 14,
          lineHeight: 1.2,
        }}
      >
        {step.title}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 1.65,
          maxWidth: 380,
        }}
      >
        {step.desc}
      </div>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        {STEPS.map((s, i) => (
          <div
            key={s.number}
            style={{
              width: i === STEPS.indexOf(step) ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === STEPS.indexOf(step) ? TEAL : "#E5E7EB",
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksComposition() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {STEPS.map((step, i) => {
        const start = i * STEP_DURATION;
        const end = start + STEP_DURATION;
        const fadeIn = interpolate(frame - start, [0, 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(frame - (end - 18), [0, 18], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = Math.min(fadeIn, fadeOut);
        const translateY = interpolate(opacity, [0, 1], [16, 0]);

        return <Step key={step.number} step={step} opacity={opacity} translateY={translateY} />;
      })}
    </AbsoluteFill>
  );
}
