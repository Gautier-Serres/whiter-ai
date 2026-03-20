import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Layers, Users, Target, Sparkles, Settings, X, Loader2 } from "lucide-react";

const CATEGORY_CONFIG = {
  Finance:    { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Product:    { icon: Layers,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
  Team:       { icon: Users,      color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30"  },
  Strategy:   { icon: Target,     color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   },
  Vision:     { icon: Sparkles,   color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/30"    },
  Operations: { icon: Settings,   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/30"   },
};

// ─── Fullscreen Slide ─────────────────────────────────────────────────────────

function FullscreenSlide({ card }) {
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  const Icon = config.icon;

  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center px-16"
      style={{ background: "rgba(10,10,15,0.98)" }}
    >
      <div className={`absolute inset-0 ${config.bg} opacity-20 pointer-events-none`} />
      <div className="relative max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
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
        Whiter<span className="text-primary/40">.</span>ai
      </div>
    </motion.div>
  );
}

// ─── Mini card strip ──────────────────────────────────────────────────────────

function MiniCard({ card }) {
  const config = CATEGORY_CONFIG[card.category] || CATEGORY_CONFIG.Strategy;
  return (
    <div className={`bg-dark/80 border ${config.border} rounded-lg p-3 flex-shrink-0 w-40`}>
      <div className={`text-xs font-heading font-semibold ${config.color} mb-1`}>{card.sub_category || card.category}</div>
      <div className="text-white text-xs font-heading font-bold leading-tight truncate">{card.title}</div>
    </div>
  );
}

// ─── Highlight Tooltip ────────────────────────────────────────────────────────

function HighlightTooltip({ tooltip, onClose }) {
  return (
    <AnimatePresence>
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
            zIndex: 100,
            marginTop: -12,
          }}
          className="bg-[#0e0e1a] border border-white/15 rounded-xl px-4 py-3 max-w-72 shadow-2xl backdrop-blur-sm"
        >
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0"
            style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.15)" }}
          />
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="text-primary font-heading font-bold text-xs truncate">{tooltip.text}</span>
            <button onClick={onClose} className="text-slate-600 hover:text-slate-400 flex-shrink-0 mt-0.5">
              <X size={11} />
            </button>
          </div>
          {tooltip.loading ? (
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Loader2 size={11} className="animate-spin" />
              Looking up…
            </div>
          ) : (
            <p className="text-slate-300 text-xs leading-relaxed">{tooltip.definition}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

export function Board({ sessionId }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tooltip, setTooltip] = useState(null); // { text, x, y, loading, definition }
  const knownIdsRef = useRef(new Set());

  // Poll for new cards
  useEffect(() => {
    if (!sessionId) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}/cards`);
        const data = await res.json();
        const newCards = data.filter(c => !knownIdsRef.current.has(c.title + c.points?.join()));
        if (newCards.length > 0) {
          newCards.forEach(c => knownIdsRef.current.add(c.title + c.points?.join()));
          setCards(prev => {
            const withIds = newCards.map(c => ({ ...c, id: Date.now() + Math.random() }));
            return [...prev, ...withIds];
          });
        }
      } catch { /* silent */ }
    };
    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Auto-advance to latest
  useEffect(() => {
    if (cards.length > 0) setCurrentIndex(cards.length - 1);
  }, [cards.length]);

  // Text highlight → lookup
  useEffect(() => {
    const handleMouseUp = async () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length < 2 || text.length > 100) return;

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - 8;

      setTooltip({ text, x, y, loading: true, definition: null });

      try {
        const res = await fetch(`/api/lookup?q=${encodeURIComponent(text)}`);
        const data = await res.json();
        setTooltip(prev =>
          prev?.text === text ? { ...prev, loading: false, definition: data.definition } : prev
        );
      } catch {
        setTooltip(prev =>
          prev?.text === text ? { ...prev, loading: false, definition: "Definition unavailable." } : prev
        );
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Close tooltip on click elsewhere
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (tooltip && !e.target.closest(".tooltip-anchor")) setTooltip(null);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [tooltip]);

  if (!sessionId) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center">
        <p className="text-slate-500 font-body">No session ID. Open this from the speaker view.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark overflow-hidden">

      {/* Highlight tooltip */}
      <HighlightTooltip tooltip={tooltip} onClose={() => setTooltip(null)} />

      {/* Main slide area */}
      <div className="relative h-full">
        {cards.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse mb-4" />
            <p className="text-slate-600 font-body text-sm">Waiting for the session to start…</p>
            <p className="text-slate-700 font-body text-xs mt-2">Select any text on a slide to look it up</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <FullscreenSlide key={cards[currentIndex]?.id} card={cards[currentIndex]} />
          </AnimatePresence>
        )}
      </div>

      {/* Bottom mini strip */}
      {cards.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur border-t border-white/10 px-6 py-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {cards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => setCurrentIndex(i)}
                className={`transition-opacity ${i === currentIndex ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              >
                <MiniCard card={card} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      {cards.length > 0 && (
        <div className="absolute bottom-20 right-4 text-slate-700 text-xs font-body">
          Select text to look it up
        </div>
      )}
    </div>
  );
}
