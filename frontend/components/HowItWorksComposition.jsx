import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

const STEPS = [
  {
    number: "01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="#6366F1" />
        <path d="M5 10a7 7 0 0014 0" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="19" x2="12" y2="22" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    heading: "Speak naturally",
    desc: "Start your meeting or presentation. Whiter.ai listens in real time — no scripts, no prep.",
    accent: "#6366F1",
  },
  {
    number: "02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#A78BFA" strokeWidth="2" />
        <path d="M8 12l2.5 2.5L16 9" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    heading: "AI understands context",
    desc: "Our model extracts key ideas, concepts, and structure from your words in milliseconds.",
    accent: "#A78BFA",
  },
  {
    number: "03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="14" rx="2" stroke="#818CF8" strokeWidth="2" />
        <path d="M7 8h10M7 12h6" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    heading: "Slides appear instantly",
    desc: "Synchronized visuals surface on every screen. Your audience follows along without missing a beat.",
    accent: "#818CF8",
  },
];

const STEP_DURATION = 90; // frames per step
const TRANSITION = 20;
const TOTAL = STEPS.length * STEP_DURATION;

function ProgressBar({ progress, color }) {
  return (
    <div
      style={{
        width: "100%",
        height: 3,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 2,
        overflow: "hidden",
        marginTop: 16,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${color}, #A78BFA)`,
          borderRadius: 2,
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
}

export function HowItWorksComposition() {
  const frame = useCurrentFrame();
  const loopFrame = frame % TOTAL;
  const stepIndex = Math.floor(loopFrame / STEP_DURATION);
  const stepFrame = loopFrame % STEP_DURATION;

  const step = STEPS[stepIndex];

  const opacity = interpolate(stepFrame, [0, TRANSITION, STEP_DURATION - TRANSITION, STEP_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(stepFrame, [0, TRANSITION], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progress = stepFrame / STEP_DURATION;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #0A0A0F 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 48px",
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {/* Step indicator dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stepIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === stepIndex ? step.accent : "rgba(255,255,255,0.2)",
                transition: "width 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* Number */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: step.accent,
            opacity: 0.15,
            lineHeight: 1,
            marginBottom: -20,
            letterSpacing: -2,
          }}
        >
          {step.number}
        </div>

        {/* Icon + heading */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `rgba(${step.accent === "#6366F1" ? "99,102,241" : step.accent === "#A78BFA" ? "167,139,250" : "129,140,248"},0.15)`,
              border: `1px solid ${step.accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {step.icon}
          </div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
            {step.heading}
          </div>
        </div>

        {/* Description */}
        <div style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
          {step.desc}
        </div>

        {/* Progress bar */}
        <ProgressBar progress={progress} color={step.accent} />
      </div>
    </AbsoluteFill>
  );
}
