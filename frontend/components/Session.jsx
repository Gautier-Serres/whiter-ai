import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, TrendingUp, Layers, Users, Target, Sparkles, Settings, X, RotateCcw, Send,
} from "lucide-react";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  Finance:    { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Product:    { icon: Layers,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30" },
  Team:       { icon: Users,      color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30" },
  Strategy:   { icon: Target,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30" },
  Vision:     { icon: Sparkles,   color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/30" },
  Operations: { icon: Settings,   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/30" },
};

// ─── Waveform ─────────────────────────────────────────────────────────────────

function Waveform({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-primary"
          animate={active ? {
            height: ["4px", `${8 + Math.random() * 16}px`, "4px"],
          } : { height: "4px" }}
          transition={{
            duration: 0.4 + Math.random() * 0.3,
            repeat: Infinity,
            delay: i * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Slide Card ───────────────────────────────────────────────────────────────

function SlideCard({ card, index }) {
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-dark/90 border ${config.border} rounded-xl p-5 backdrop-blur-sm shadow-xl`}
    >
      {/* Category badge */}
      <div className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} text-xs font-heading font-semibold px-2.5 py-1 rounded-full mb-3`}>
        <Icon size={11} />
        {card.category}
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-white text-lg leading-tight mb-3">
        {card.title}
      </h3>

      {/* Points */}
      <ul className="space-y-1.5">
        {card.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-300 text-sm font-body">
            <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")} mt-1.5 flex-shrink-0`} />
            {point}
          </li>
        ))}
      </ul>

      {/* Timestamp */}
      <div className="mt-3 text-slate-600 text-xs font-body">{card.time}</div>
    </motion.div>
  );
}

// ─── Session ──────────────────────────────────────────────────────────────────

export function Session({ onClose }) {
  const [active, setActive] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [fallbackInput, setFallbackInput] = useState("");
  const [cards, setCards] = useState([]);
  const [lastTranscript, setLastTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const boardRef = useRef(null);

  const generateCard = useCallback(async (transcript) => {
    if (!transcript.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const card = {
        ...data,
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setCards((prev) => [card, ...prev]);
      boardRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // silent fail — don't interrupt the speaker
    } finally {
      setGenerating(false);
    }
  }, [generating]);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition requires Chrome. Try Chrome to use the live mic.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text.length > 10) {
            setLastTranscript(text);
            generateCard(text);
          }
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) setLastTranscript(interim);
    };

    recognition.onerror = (e) => {
      if (e.error === "no-speech") return;
      // Network error = Google speech servers unreachable → switch to fallback
      if (e.error === "network") {
        stopListening();
        setFallback(true);
        setError("");
      } else {
        setError("Mic error: " + e.error);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still active
      if (recognitionRef.current === recognition && active) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setActive(true);
    setError("");
  }, [active, generateCard]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setActive(false);
    setLastTranscript("");
  }, []);

  const submitFallback = async (e) => {
    e.preventDefault();
    const text = fallbackInput.trim();
    if (!text) return;
    setLastTranscript(text);
    setFallbackInput("");
    await generateCard(text);
  };

  const reset = () => {
    stopListening();
    setCards([]);
    setLastTranscript("");
    setError("");
    setFallbackInput("");
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  const isChromeOrEdge = /Chrome|Edg/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 bg-dark z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="font-heading font-bold text-white text-lg">
          Whiter<span className="text-primary">.</span>ai
          <span className="ml-3 text-slate-500 text-sm font-normal">Live Session</span>
        </div>
        <div className="flex items-center gap-3">
          {cards.length > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm font-body transition-colors duration-200"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: controls */}
        <div className="w-72 border-r border-white/10 flex flex-col items-center justify-center gap-6 px-8 flex-shrink-0">

          {fallback ? (
            /* ── Fallback mode: type to simulate speech ── */
            <>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <Mic size={24} className="text-primary" />
                </div>
                <p className="text-white text-sm font-heading font-semibold mb-1">Demo mode</p>
                <p className="text-slate-500 text-xs font-body text-center leading-relaxed">
                  Type what's being said and press Enter — slides generate just like the live version.
                </p>
              </div>

              <form onSubmit={submitFallback} className="w-full flex flex-col gap-2">
                <textarea
                  value={fallbackInput}
                  onChange={(e) => setFallbackInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submitFallback(e); }}
                  placeholder="Our Q4 revenue target is 2 million euros…"
                  rows={3}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-600 text-sm font-body px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50 resize-none transition-colors duration-200"
                />
                <button
                  type="submit"
                  disabled={!fallbackInput.trim() || generating}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white text-sm font-heading font-semibold px-4 py-2.5 rounded-lg transition-all duration-200"
                >
                  <Send size={14} /> Generate slide
                </button>
              </form>

              <button
                onClick={() => { setFallback(false); setError(""); }}
                className="text-slate-600 hover:text-slate-400 text-xs font-body transition-colors duration-200"
              >
                Try mic again
              </button>
            </>
          ) : (
            /* ── Normal mode: mic button ── */
            <>
              <button
                onClick={active ? stopListening : startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  active
                    ? "bg-red-500/20 border-2 border-red-500/60 hover:bg-red-500/30 shadow-lg shadow-red-500/20"
                    : "bg-primary/20 border-2 border-primary/60 hover:bg-primary/30 shadow-lg shadow-primary/20"
                }`}
              >
                {active ? (
                  <MicOff size={30} className="text-red-400" />
                ) : (
                  <Mic size={30} className="text-primary" />
                )}
              </button>

              <div className="text-center">
                {active ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-body">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      Listening…
                    </div>
                    <Waveform active={active} />
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm font-body text-center">
                    {isChromeOrEdge
                      ? "Click to start listening"
                      : "Use Chrome for live mic support"}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-red-400 text-xs font-body text-center">{error}</p>
              )}

              {!isChromeOrEdge && (
                <button
                  onClick={() => setFallback(true)}
                  className="text-primary text-xs font-body hover:underline"
                >
                  Switch to demo mode
                </button>
              )}
            </>
          )}

          {/* Last transcript */}
          {lastTranscript && (
            <div className="w-full bg-white/3 border border-white/10 rounded-lg p-3">
              <p className="text-slate-400 text-xs font-body leading-relaxed italic">
                "{lastTranscript}"
              </p>
            </div>
          )}

          {generating && (
            <div className="flex items-center gap-2 text-primary text-xs font-body">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border border-primary border-t-transparent rounded-full"
              />
              Generating slide…
            </div>
          )}

          {cards.length > 0 && (
            <div className="text-slate-600 text-xs font-body">
              {cards.length} slide{cards.length !== 1 ? "s" : ""} generated
            </div>
          )}
        </div>

        {/* Right: board */}
        <div
          ref={boardRef}
          className="flex-1 overflow-y-auto p-8"
          style={{ background: "radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.05) 0%, transparent 60%)" }}
        >
          {cards.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Mic size={24} className="text-slate-600" />
              </div>
              <p className="font-heading text-slate-500 text-lg mb-2">Board is empty</p>
              <p className="font-body text-slate-600 text-sm">
                Start speaking — slides will appear here as you talk
              </p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
              <AnimatePresence>
                {cards.map((card, i) => (
                  <SlideCard key={card.id} card={card} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
