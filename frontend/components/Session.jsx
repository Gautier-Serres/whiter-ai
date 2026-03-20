import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Mic, MicOff, TrendingUp, Layers, Users, Target, Sparkles, Settings,
  X, RotateCcw, Send, ChevronRight, Check, Link2, Download,
  Minimize2, Maximize2, Square, Globe,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEEPGRAM_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

const CATEGORY_CONFIG = {
  Finance:    { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Product:    { icon: Layers,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
  Team:       { icon: Users,      color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30"  },
  Strategy:   { icon: Target,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   },
  Vision:     { icon: Sparkles,   color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/30"    },
  Operations: { icon: Settings,   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/30"   },
};

const TEMPLATES = {
  dark:      { name: "Dark",      color: "#6366F1", glow: "rgba(99,102,241,0.10)",  bg: "#0A0A0F" },
  corporate: { name: "Corporate", color: "#2563EB", glow: "rgba(37,99,235,0.10)",   bg: "#08101E" },
  forest:    { name: "Forest",    color: "#059669", glow: "rgba(5,150,105,0.10)",   bg: "#070F0A" },
  warm:      { name: "Warm",      color: "#D97706", glow: "rgba(217,119,6,0.10)",   bg: "#0F0B05" },
  rose:      { name: "Rose",      color: "#E11D48", glow: "rgba(225,29,72,0.10)",   bg: "#0F060A" },
};

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "fr",    label: "French"  },
  { code: "de",    label: "German"  },
  { code: "es",    label: "Spanish" },
  { code: "it",    label: "Italian" },
  { code: "pt",    label: "Portuguese" },
  { code: "nl",    label: "Dutch"   },
  { code: "pl",    label: "Polish"  },
];

// ─── Waveform ─────────────────────────────────────────────────────────────────

function Waveform({ active, color = "#6366F1" }) {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: color }}
          animate={active
            ? { height: ["3px", `${6 + Math.sin(i) * 10}px`, "3px"] }
            : { height: "3px" }}
          transition={{ duration: 0.4 + i * 0.03, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Fullscreen Slide (recording + audience) ──────────────────────────────────

function FullscreenSlide({ card, tmpl }) {
  const tpl = TEMPLATES[tmpl] || TEMPLATES.dark;
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  const Icon = config.icon;

  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center px-16"
      style={{ background: tpl.bg }}
    >
      {/* Category glow */}
      <div className={`absolute inset-0 ${config.bg} opacity-25 pointer-events-none`} />
      {/* Template glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 60% 30%, ${tpl.glow} 0%, transparent 65%)` }} />

      <div className="relative max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`inline-flex items-center gap-2 ${config.bg} ${config.color} text-sm font-heading font-semibold px-4 py-1.5 rounded-full mb-6 border ${config.border}`}
        >
          <Icon size={14} />
          {card.sub_category || card.category}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-heading font-bold text-white leading-tight mb-8"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          {card.title}
        </motion.h2>

        <ul className="space-y-5">
          {card.points.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${config.color.replace("text-", "bg-")} mt-3 flex-shrink-0`} />
              <span className="font-body text-slate-200 leading-relaxed" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
                {point}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-6 right-8 font-heading font-bold text-slate-800 text-sm select-none">
        Whiter<span style={{ color: `${tpl.color}40` }}>.</span>ai
      </div>
    </motion.div>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({ template, setTemplate, language, setLanguage, subject, setSubject, contextNotes, setContextNotes, onStart }) {
  const tpl = TEMPLATES[template];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <h2 className="font-heading font-bold text-white text-2xl mb-1">Set up your session</h2>
        <p className="font-body text-slate-500 text-sm mb-8">Configure once. Speak freely. Slides write themselves.</p>

        {/* Template picker */}
        <div className="mb-6">
          <label className="text-slate-400 text-xs font-heading font-semibold uppercase tracking-wider mb-3 block">Visual theme</label>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(TEMPLATES).map(([id, t]) => (
              <button
                key={id}
                onClick={() => setTemplate(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-heading font-semibold transition-all duration-200 ${
                  template === id
                    ? "border-white/30 bg-white/8 text-white"
                    : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="mb-6">
          <label className="text-slate-400 text-xs font-heading font-semibold uppercase tracking-wider mb-3 block">Language</label>
          <div className="relative">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-sm font-body pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-white/30 transition-colors appearance-none"
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="text-slate-400 text-xs font-heading font-semibold uppercase tracking-wider mb-3 block">
            Session subject <span className="text-slate-600 normal-case font-normal">— what's the talk about?</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Q1 strategy review, product launch, investor pitch…"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm font-body px-4 py-2.5 rounded-lg focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Context briefing */}
        <div className="mb-8">
          <label className="text-slate-400 text-xs font-heading font-semibold uppercase tracking-wider mb-3 block">
            Speaker briefing <span className="text-slate-600 normal-case font-normal">— optional, helps the AI</span>
          </label>
          <textarea
            value={contextNotes}
            onChange={(e) => setContextNotes(e.target.value)}
            placeholder={"Key points, names, metrics, terms the AI should know:\n• Our ARR target is €2M by Q4\n• We're launching v2 in April\n• Key risks: churn rate, hiring"}
            rows={5}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-700 text-sm font-body px-4 py-3 rounded-lg focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
          />
        </div>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-3 text-white font-heading font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
          style={{ background: `linear-gradient(135deg, ${tpl.color}, ${tpl.color}cc)` }}
        >
          <Mic size={16} />
          Start session
          <ChevronRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}

// ─── Recording HUD ────────────────────────────────────────────────────────────

function RecordingHUD({ active, fallback, generating, slideCount, minimized, tmpl, onToggleMinimize, onEnd }) {
  const tpl = TEMPLATES[tmpl] || TEMPLATES.dark;
  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3 backdrop-blur-md"
      style={{ background: "rgba(10,10,15,0.75)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-4">
        {active && !fallback && (
          <>
            <span className="flex items-center gap-1.5 text-xs font-heading font-semibold text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              REC
            </span>
            <Waveform active={active} color={tpl.color} />
          </>
        )}
        {fallback && (
          <span className="text-xs font-heading font-semibold text-slate-400">Demo mode</span>
        )}
        {generating && (
          <span className="flex items-center gap-1.5 text-xs font-body" style={{ color: tpl.color }}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-2.5 h-2.5 border border-current border-t-transparent rounded-full"
            />
            Generating…
          </span>
        )}
        {slideCount > 0 && (
          <span className="text-xs font-body text-slate-500">{slideCount} slide{slideCount !== 1 ? "s" : ""}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMinimize}
          title={minimized ? "Expand" : "Minimize"}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
        >
          {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
        </button>
        {slideCount > 0 && (
          <button
            onClick={onEnd}
            className="flex items-center gap-1.5 text-xs font-heading font-semibold px-3 py-1.5 rounded-lg transition-all text-slate-400 hover:text-white border border-white/10 hover:border-white/25"
          >
            <Square size={10} fill="currentColor" />
            End
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Gallery / Summary Screen ─────────────────────────────────────────────────

function GalleryCard({ card }) {
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  const Icon = config.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-dark/80 border ${config.border} rounded-xl p-5 backdrop-blur-sm`}
    >
      <div className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} text-xs font-heading font-semibold px-2.5 py-1 rounded-full mb-3`}>
        <Icon size={10} />
        {card.sub_category || card.category}
      </div>
      <h3 className="font-heading font-bold text-white text-base leading-tight mb-3">{card.title}</h3>
      <ul className="space-y-1.5">
        {card.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-sm text-slate-400">
            <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")} mt-1.5 flex-shrink-0`} />
            {pt}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function GalleryScreen({ cards, sessionId, subject, onNewSession, onClose }) {
  const [copied, setCopied] = useState(false);
  const summaryUrl = `${window.location.origin}/api/session/${sessionId}/summary`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(summaryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-white text-2xl">
              {subject || "Session summary"}
            </h2>
            <p className="font-body text-slate-500 text-sm mt-1">{cards.length} slide{cards.length !== 1 ? "s" : ""} generated</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportSession(cards, subject)}
              className="flex items-center gap-2 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white font-heading font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              <Download size={13} /> Export HTML
            </button>
            <button
              onClick={onNewSession}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              <RotateCcw size={13} /> New session
            </button>
          </div>
        </div>

        {/* QR code block */}
        {sessionId && (
          <div className="flex items-center gap-8 bg-white/3 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex-shrink-0 p-2 bg-white rounded-xl">
              <QRCodeSVG
                value={summaryUrl}
                size={120}
                bgColor="#ffffff"
                fgColor="#0a0a0f"
                level="M"
              />
            </div>
            <div className="flex-1">
              <p className="font-heading font-bold text-white text-base mb-1">Share the summary</p>
              <p className="font-body text-slate-400 text-sm leading-relaxed mb-4">
                Scan the QR code to open the full session summary on any device — or copy the link below to send it directly.
              </p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500 truncate max-w-xs">{summaryUrl}</span>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 text-primary text-xs font-heading font-semibold hover:underline flex-shrink-0"
                >
                  {copied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy link</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slides gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...cards].reverse().map((card) => (
            <GalleryCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Export helper ────────────────────────────────────────────────────────────

function exportSession(cards, subject) {
  const lines = cards.map((c) => `
    <div class="card">
      <div class="badge">${c.sub_category || c.category}</div>
      <h2>${c.title}</h2>
      <ul>${c.points.map(p => `<li>${p}</li>`).join("")}</ul>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Whiter.ai — ${subject || "Session Export"}</title>
<style>
  body { font-family: -apple-system, sans-serif; background:#f8f9fa; padding:40px; color:#1a1a1a; max-width:680px; margin:0 auto }
  h1 { font-size:1.5rem; margin-bottom:4px }
  .meta { color:#666; font-size:.85rem; margin-bottom:32px }
  .card { background:white; border:1px solid #e5e7eb; border-radius:12px; padding:20px 24px; margin-bottom:16px; page-break-inside:avoid }
  .badge { display:inline-block; background:#ede9fe; color:#7c3aed; font-size:.7rem; font-weight:700; padding:3px 10px; border-radius:999px; text-transform:uppercase; letter-spacing:.05em; margin-bottom:10px }
  h2 { font-size:1.1rem; margin:0 0 10px }
  ul { margin:0; padding-left:18px; color:#444 }
  li { margin-bottom:4px; font-size:.9rem }
  @media print { body { background:white; padding:20px } }
</style></head><body>
<h1>${subject || "Whiter.ai — Session Summary"}</h1>
<div class="meta">${new Date().toLocaleDateString()} · ${cards.length} slide${cards.length !== 1 ? "s" : ""}</div>
${lines}
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `whiter-session-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Session (main) ───────────────────────────────────────────────────────────

export function Session({ onClose }) {
  // Phase: "setup" | "recording" | "ended"
  const [phase, setPhase] = useState("setup");

  // Setup config
  const [template, setTemplate] = useState("dark");
  const [language, setLanguage] = useState("en-US");
  const [subject, setSubject] = useState("");
  const [contextNotes, setContextNotes] = useState("");

  // Recording state
  const [active, setActive]         = useState(false);
  const [fallback, setFallback]     = useState(false);
  const [fallbackInput, setFallbackInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [minimized, setMinimized]   = useState(false);
  const [error, setError]           = useState("");

  // Slide state
  const [cards, setCards]               = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [sessionId, setSessionId]       = useState(null);

  // Refs
  const deepgramRef     = useRef(null);
  const mediaStreamRef  = useRef(null);
  const cardsRef        = useRef(cards);
  const bufferRef       = useRef("");
  const debounceRef     = useRef(null);
  const sessionIdRef    = useRef(null);
  const contextRef      = useRef("");
  const subjectRef      = useRef("");
  cardsRef.current = cards;

  const SLIDE_PAUSE_MS = 3000;

  const generateCard = useCallback(async (transcript) => {
    if (!transcript.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          session_id: sessionIdRef.current,
          context: contextRef.current || undefined,
          subject: subjectRef.current || undefined,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();

      // Dedup: merge if same topic
      const last = cardsRef.current[0];
      if (last && last.topic_key === data.topic_key) {
        const merged = {
          ...last,
          points: [...new Set([...last.points, ...data.points])].slice(0, 3),
        };
        setCards((prev) => [merged, ...prev.slice(1)]);
        setCurrentSlide(merged);
      } else {
        const card = {
          ...data,
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setCards((prev) => [card, ...prev]);
        setCurrentSlide(card);
      }
    } catch {
      // silent
    } finally {
      setGenerating(false);
    }
  }, []);

  const startDeepgram = useCallback(async () => {
    if (!DEEPGRAM_KEY) { setFallback(true); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const params = new URLSearchParams({
        model: "nova-2",
        language,
        smart_format: "true",
        interim_results: "true",
        utterance_end_ms: "1200",
        encoding: "opus",
      });
      const ws = new WebSocket(`wss://api.deepgram.com/v1/listen?${params}`, ["token", DEEPGRAM_KEY]);

      ws.onopen = () => {
        setActive(true);
        setError("");
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus" : "audio/webm";
        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) ws.send(e.data);
        };
        recorder.start(250);
        deepgramRef.current = { ws, recorder };
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const alt = data.channel?.alternatives?.[0];
          if (!alt?.transcript) return;
          if (data.is_final && alt.transcript.trim().length > 3) {
            bufferRef.current = (bufferRef.current + " " + alt.transcript.trim()).trim();
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              const text = bufferRef.current.trim();
              bufferRef.current = "";
              if (text.length > 10) generateCard(text);
            }, SLIDE_PAUSE_MS);
          }
        } catch { /* ignore */ }
      };

      ws.onerror = () => { setFallback(true); setActive(false); };
      ws.onclose = (e) => { if (e.code !== 1000) { setFallback(true); setActive(false); } };

    } catch (err) {
      setError(err.message?.includes("Permission") ? "Microphone permission denied." : "Could not start mic.");
      setFallback(true);
    }
  }, [generateCard, language]);

  const stopListening = useCallback(() => {
    clearTimeout(debounceRef.current);
    const remaining = bufferRef.current.trim();
    bufferRef.current = "";
    if (remaining.length > 10) generateCard(remaining);
    if (deepgramRef.current) {
      deepgramRef.current.recorder?.stop();
      deepgramRef.current.ws?.close(1000);
      deepgramRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setActive(false);
  }, [generateCard]);

  const handleStart = async () => {
    // Store context in refs so generateCard can read them
    contextRef.current = contextNotes;
    subjectRef.current = subject;

    // Create backend session
    const sid = (await (await fetch("/api/session/new", { method: "POST" })).json()).session_id;
    sessionIdRef.current = sid;
    setSessionId(sid);

    setPhase("recording");
    await startDeepgram();
  };

  const endSession = () => {
    stopListening();
    setPhase("ended");
  };

  const newSession = () => {
    setCards([]);
    setCurrentSlide(null);
    setFallback(false);
    setActive(false);
    setError("");
    setFallbackInput("");
    setMinimized(false);
    setPhase("setup");
  };

  const submitFallback = async (e) => {
    e?.preventDefault();
    const text = fallbackInput.trim();
    if (!text) return;
    setFallbackInput("");
    await generateCard(text);
  };

  useEffect(() => () => stopListening(), []);

  const tpl = TEMPLATES[template] || TEMPLATES.dark;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: tpl.bg }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 py-4 z-20 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="font-heading font-bold text-white text-lg">
          Whiter<span style={{ color: tpl.color }}>.</span>ai
          {phase !== "setup" && (
            <span className="ml-3 text-slate-500 text-sm font-normal font-body">
              {phase === "recording" ? (subject || "Live session") : (subject || "Session summary")}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* ── Setup phase ── */}
      {phase === "setup" && (
        <SetupScreen
          template={template} setTemplate={setTemplate}
          language={language} setLanguage={setLanguage}
          subject={subject} setSubject={setSubject}
          contextNotes={contextNotes} setContextNotes={setContextNotes}
          onStart={handleStart}
        />
      )}

      {/* ── Recording phase ── */}
      {phase === "recording" && (
        <div className="flex-1 relative overflow-hidden">

          {/* HUD bar */}
          <RecordingHUD
            active={active} fallback={fallback} generating={generating}
            slideCount={cards.length} minimized={minimized} tmpl={template}
            onToggleMinimize={() => setMinimized((v) => !v)}
            onEnd={endSession}
          />

          {/* Slide area */}
          {!minimized && (
            <AnimatePresence mode="wait">
              {currentSlide ? (
                <FullscreenSlide key={currentSlide.id} card={currentSlide} tmpl={template} />
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                >
                  <div className="flex flex-col items-center gap-4">
                    {active ? (
                      <>
                        <Waveform active color={tpl.color} />
                        <p className="font-body text-slate-500 text-sm">Listening… first slide will appear shortly</p>
                      </>
                    ) : fallback ? (
                      <p className="font-body text-slate-500 text-sm">Demo mode — type below to generate slides</p>
                    ) : (
                      <p className="font-body text-slate-600 text-sm">Starting…</p>
                    )}
                  </div>

                  {/* Fallback demo input */}
                  {fallback && (
                    <form onSubmit={submitFallback} className="flex gap-2 w-full max-w-md px-4">
                      <input
                        type="text"
                        value={fallbackInput}
                        onChange={(e) => setFallbackInput(e.target.value)}
                        placeholder="Type what's being said…"
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm font-body px-3 py-2.5 rounded-lg focus:outline-none focus:border-white/25"
                      />
                      <button
                        type="submit"
                        disabled={!fallbackInput.trim() || generating}
                        className="flex items-center gap-1.5 text-white text-sm font-heading font-semibold px-4 py-2.5 rounded-lg disabled:opacity-40 transition-all"
                        style={{ background: tpl.color }}
                      >
                        <Send size={13} />
                      </button>
                    </form>
                  )}

                  {error && <p className="text-red-400 text-xs font-body">{error}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Minimized: compact fallback input */}
          {minimized && fallback && (
            <div className="flex-1 flex items-center justify-center pt-16">
              <form onSubmit={submitFallback} className="flex gap-2 w-full max-w-md px-6">
                <input
                  type="text"
                  value={fallbackInput}
                  onChange={(e) => setFallbackInput(e.target.value)}
                  placeholder="Type what's being said…"
                  className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm font-body px-3 py-2.5 rounded-lg focus:outline-none focus:border-white/25"
                />
                <button
                  type="submit"
                  disabled={!fallbackInput.trim() || generating}
                  className="flex items-center gap-1.5 text-white text-sm font-heading font-semibold px-4 py-2.5 rounded-lg disabled:opacity-40"
                  style={{ background: tpl.color }}
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── Gallery / ended phase ── */}
      {phase === "ended" && (
        <GalleryScreen
          cards={cards}
          sessionId={sessionId}
          subject={subject}
          onNewSession={newSession}
          onClose={onClose}
        />
      )}
    </div>
  );
}
