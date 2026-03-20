import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, TrendingUp, Layers, Users, Target, Sparkles, Settings,
  X, RotateCcw, Send, ChevronRight, LayoutGrid,
} from "lucide-react";
// ─── Config ───────────────────────────────────────────────────────────────────

const DEEPGRAM_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

const CATEGORY_CONFIG = {
  Finance:    { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-emerald-500/10" },
  Product:    { icon: Layers,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30",    glow: "shadow-blue-500/10"    },
  Team:       { icon: Users,      color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30",  glow: "shadow-violet-500/10"  },
  Strategy:   { icon: Target,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   glow: "shadow-amber-500/10"   },
  Vision:     { icon: Sparkles,   color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/30",    glow: "shadow-pink-500/10"    },
  Operations: { icon: Settings,   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/30",   glow: "shadow-slate-500/10"   },
};

// ─── Waveform ─────────────────────────────────────────────────────────────────

function Waveform({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-primary"
          animate={active ? { height: ["4px", `${8 + Math.sin(i) * 12}px`, "4px"] } : { height: "4px" }}
          transition={{ duration: 0.4 + i * 0.03, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Full-screen card overlay ─────────────────────────────────────────────────

function FullscreenCard({ card, onDismiss }) {
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [card.id]);

  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: "rgba(10,10,15,0.97)" }}
      onClick={onDismiss}
    >
      {/* Subtle category glow behind */}
      <div className={`absolute inset-0 ${config.bg} opacity-30 pointer-events-none`} />

      <div className="relative max-w-3xl w-full mx-8">
        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`inline-flex items-center gap-2 ${config.bg} ${config.color} text-sm font-heading font-semibold px-4 py-1.5 rounded-full mb-6 border ${config.border}`}
        >
          <Icon size={14} />
          {card.sub_category || card.category}
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-heading font-bold text-white leading-tight mb-8"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {card.title}
        </motion.h2>

        {/* Points */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          {card.points.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")} mt-2.5 flex-shrink-0`} />
              <span className="font-body text-slate-200 text-xl leading-relaxed">{point}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Tap to continue */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-slate-600 text-sm font-body flex items-center gap-1.5"
        >
          Tap anywhere to continue <ChevronRight size={14} />
        </motion.p>
      </div>

      {/* Whiter.ai watermark */}
      <div className="absolute bottom-6 right-8 font-heading font-bold text-slate-800 text-sm">
        Whiter<span className="text-primary/40">.</span>ai
      </div>
    </motion.div>
  );
}

// ─── Board card (compact) ─────────────────────────────────────────────────────

function BoardCard({ card, threadStart }) {
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-dark/90 border ${config.border} rounded-xl p-5 backdrop-blur-sm shadow-lg ${config.glow}
        ${card.layout === "highlight" ? "md:col-span-2" : ""}
      `}
    >
      {/* Thread indicator */}
      {threadStart && (
        <div className={`absolute left-0 top-4 bottom-4 w-0.5 ${config.color.replace("text-", "bg-")} rounded-full opacity-40`} />
      )}

      <div className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} text-xs font-heading font-semibold px-2.5 py-1 rounded-full mb-3`}>
        <Icon size={11} />
        {card.sub_category || card.category}
      </div>

      <h3 className={`font-heading font-bold text-white leading-tight mb-3 ${card.layout === "highlight" ? "text-2xl" : "text-lg"}`}>
        {card.title}
      </h3>

      {card.layout === "highlight" ? (
        <p className="font-body text-slate-300 text-base leading-relaxed">{card.points[0]}</p>
      ) : (
        <ul className="space-y-1.5">
          {card.points.map((point, i) => (
            <li key={i} className={`flex items-start gap-2 font-body text-sm ${card.layout === "metrics" ? "text-white font-semibold" : "text-slate-300"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")} mt-1.5 flex-shrink-0`} />
              {point}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-slate-600 text-xs font-body">{card.time}</div>
    </motion.div>
  );
}

// ─── Summary board ────────────────────────────────────────────────────────────

function SummaryBoard({ cards, onNewSession }) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-white text-2xl">Session summary</h2>
            <p className="font-body text-slate-500 text-sm mt-1">{cards.length} slides generated</p>
          </div>
          <button
            onClick={onNewSession}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            <RotateCcw size={14} /> New session
          </button>
        </div>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...cards].reverse().map((card, i, arr) => {
            const prev = arr[i - 1];
            const threadStart = prev && prev.category === card.category;
            return <BoardCard key={card.id} card={card} threadStart={threadStart} />;
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Session ──────────────────────────────────────────────────────────────────

export function Session({ onClose }) {
  const [active, setActive] = useState(false);
  const [ended, setEnded] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [fallbackInput, setFallbackInput] = useState("");
  const [cards, setCards] = useState([]);
  const [fullscreenCard, setFullscreenCard] = useState(null);
  const [lastTranscript, setLastTranscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const deepgramRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const cardsRef = useRef(cards);
  const bufferRef = useRef("");
  const debounceRef = useRef(null);
  cardsRef.current = cards;

  const SLIDE_PAUSE_MS = 3000; // generate a slide after 3s of silence

  const generateCard = useCallback(async (transcript) => {
    if (!transcript.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) return;
      const data = await res.json();

      // Deduplication: if last card has same topic_key, merge points
      const last = cardsRef.current[0];
      if (last && last.topic_key === data.topic_key) {
        const merged = {
          ...last,
          points: [...new Set([...last.points, ...data.points])].slice(0, 3),
        };
        setCards((prev) => [merged, ...prev.slice(1)]);
        setFullscreenCard(merged);
      } else {
        const card = {
          ...data,
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setCards((prev) => [card, ...prev]);
        setFullscreenCard(card);
      }
    } catch {
      // silent fail
    } finally {
      setGenerating(false);
    }
  }, []);

  const startDeepgram = useCallback(async () => {
    if (!DEEPGRAM_KEY) {
      setFallback(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const params = new URLSearchParams({
        model: "nova-2",
        language: "en-US",
        smart_format: "true",
        interim_results: "true",
        utterance_end_ms: "1200",
        encoding: "opus",
      });
      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params}`,
        ["token", DEEPGRAM_KEY],
      );

      ws.onopen = () => {
        setActive(true);
        setError("");

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";
        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };
        recorder.start(250);
        deepgramRef.current = { ws, recorder };
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const alt = data.channel?.alternatives?.[0];
          if (!alt?.transcript) return;

          setLastTranscript(alt.transcript);

          if (data.is_final && alt.transcript.trim().length > 3) {
            // Accumulate into buffer
            bufferRef.current = (bufferRef.current + " " + alt.transcript.trim()).trim();

            // Reset debounce — slide fires after SLIDE_PAUSE_MS of silence
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              const text = bufferRef.current.trim();
              bufferRef.current = "";
              if (text.length > 10) generateCard(text);
            }, SLIDE_PAUSE_MS);
          }
        } catch { /* ignore parse errors */ }
      };

      ws.onerror = () => {
        setFallback(true);
        setActive(false);
      };

      ws.onclose = (e) => {
        if (e.code !== 1000) {
          setFallback(true);
          setActive(false);
        }
      };

    } catch (err) {
      setError(err.message?.includes("Permission") ? "Microphone permission denied." : "Could not start mic.");
      setFallback(true);
    }
  }, [generateCard]);

  const stopListening = useCallback(() => {
    clearTimeout(debounceRef.current);
    // Flush any buffered transcript before stopping
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
    setLastTranscript("");
  }, [generateCard]);

  const submitFallback = async (e) => {
    e.preventDefault();
    const text = fallbackInput.trim();
    if (!text) return;
    setLastTranscript(text);
    setFallbackInput("");
    await generateCard(text);
  };

  const endSession = () => {
    stopListening();
    setEnded(true);
  };

  const newSession = () => {
    setCards([]);
    setFullscreenCard(null);
    setEnded(false);
    setFallback(false);
    setLastTranscript("");
    setError("");
  };

  useEffect(() => () => stopListening(), []);

  return (
    <div className="fixed inset-0 bg-dark z-50 flex flex-col">

      {/* Full-screen card overlay */}
      <AnimatePresence>
        {fullscreenCard && !ended && (
          <FullscreenCard
            card={fullscreenCard}
            onDismiss={() => setFullscreenCard(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 z-10">
        <div className="font-heading font-bold text-white text-lg">
          Whiter<span className="text-primary">.</span>ai
          <span className="ml-3 text-slate-500 text-sm font-normal">
            {ended ? "Session summary" : "Live Session"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {cards.length > 0 && !ended && (
            <button
              onClick={endSession}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white border border-white/15 hover:border-white/30 text-sm font-heading px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <LayoutGrid size={14} /> End session
            </button>
          )}
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors duration-200">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      {ended ? (
        <SummaryBoard cards={cards} onNewSession={newSession} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: controls */}
          <div className="w-72 border-r border-white/10 flex flex-col items-center justify-center gap-6 px-8 flex-shrink-0">

            {fallback ? (
              <>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                    <Mic size={24} className="text-primary" />
                  </div>
                  <p className="text-white text-sm font-heading font-semibold mb-1">Demo mode</p>
                  <p className="text-slate-500 text-xs font-body text-center leading-relaxed">
                    Type what's being said and press Enter.
                  </p>
                </div>
                <form onSubmit={submitFallback} className="w-full flex flex-col gap-2">
                  <textarea
                    value={fallbackInput}
                    onChange={(e) => setFallbackInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submitFallback(e); }}
                    placeholder="Our Q4 revenue target is 2 million euros…"
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-600 text-sm font-body px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50 resize-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!fallbackInput.trim() || generating}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white text-sm font-heading font-semibold px-4 py-2.5 rounded-lg transition-all"
                  >
                    <Send size={14} /> Generate slide
                  </button>
                </form>
                <button onClick={() => { setFallback(false); setError(""); }} className="text-slate-600 hover:text-slate-400 text-xs font-body transition-colors">
                  Try mic again
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={active ? stopListening : startDeepgram}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    active
                      ? "bg-red-500/20 border-2 border-red-500/60 hover:bg-red-500/30 shadow-lg shadow-red-500/20"
                      : "bg-primary/20 border-2 border-primary/60 hover:bg-primary/30 shadow-lg shadow-primary/20"
                  }`}
                >
                  {active ? <MicOff size={30} className="text-red-400" /> : <Mic size={30} className="text-primary" />}
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
                    <p className="text-slate-500 text-sm font-body text-center">Click to start listening</p>
                  )}
                </div>

                {error && <p className="text-red-400 text-xs font-body text-center">{error}</p>}

                <button onClick={() => setFallback(true)} className="text-slate-600 hover:text-slate-400 text-xs font-body transition-colors">
                  Switch to demo mode
                </button>
              </>
            )}

            {lastTranscript && (
              <div className="w-full bg-white/3 border border-white/10 rounded-lg p-3">
                <p className="text-slate-400 text-xs font-body leading-relaxed italic">"{lastTranscript}"</p>
              </div>
            )}

            {generating && (
              <div className="flex items-center gap-2 text-primary text-xs font-body">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-3 h-3 border border-primary border-t-transparent rounded-full" />
                Generating…
              </div>
            )}

            {cards.length > 0 && (
              <div className="text-slate-600 text-xs font-body">{cards.length} slide{cards.length !== 1 ? "s" : ""} generated</div>
            )}
          </div>

          {/* Right: board */}
          <div
            className="flex-1 overflow-y-auto p-8"
            style={{ background: "radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.04) 0%, transparent 60%)" }}
          >
            {cards.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Mic size={24} className="text-slate-600" />
                </div>
                <p className="font-heading text-slate-500 text-lg mb-2">Board is empty</p>
                <p className="font-body text-slate-600 text-sm">Start speaking — slides will appear here as you talk</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                <AnimatePresence>
                  {cards.map((card, i, arr) => {
                    const next = arr[i + 1];
                    const threadStart = next && next.category === card.category;
                    return <BoardCard key={card.id} card={card} threadStart={threadStart} />;
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
