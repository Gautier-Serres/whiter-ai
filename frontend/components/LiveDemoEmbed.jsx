import { useState, useEffect, useRef } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ATTENDEES = {
  RC: { name: "Rachel Chen",     role: "CEO",               initials: "RC" },
  JW: { name: "James Whitfield", role: "VP of Sales",       initials: "JW" },
  PN: { name: "Priya Nair",      role: "Head of SDR",       initials: "PN" },
  DO: { name: "David Okafor",    role: "Senior AE",         initials: "DO" },
  LC: { name: "Lisa Cortez",     role: "Head of Marketing", initials: "LC" },
  TR: { name: "Tom Reid",        role: "RevOps Lead",       initials: "TR" },
};

const AVATAR_COLORS = {
  RC: "#059669", JW: "#2563EB", PN: "#7C3AED",
  DO: "#D97706", LC: "#E11D48", TR: "#64748B",
};

const SCRIPT = [
  { id: "RC", text: "Q3 pipeline numbers are in — cold outreach conversion dropped to 0.8%. We need to shift strategy. I'm proposing we move to account-based selling.", delay: 700 },
  { id: "JW", text: "Agreed. 50 high-value target accounts, deeply researched, instead of blasting 5,000 contacts. The volume play is dead in our segment.", delay: 6000 },
  { id: "PN", text: "That means restructuring SDR KPIs entirely — moving from call volume to engagement quality and pipeline generated per account.", delay: 12000 },
  { id: "DO", text: "From an AE perspective, this is long overdue. With ABS we'd be working pre-warmed, ICP-matched accounts. Close rates should jump significantly.", delay: 18500 },
  { id: "LC", text: "Marketing can build targeted content per account vertical. I need the target account list by Friday to build the asset plan.", delay: 25000 },
  { id: "RC", text: "James — own the target account list, 50 ICP-qualified accounts by Friday. We phase out cold outreach over 30 days. This is our new motion.", delay: 31000 },
];

const BOARD_ITEMS = [
  { type: "Key Decision", text: "Shift to Account-Based Selling (ABS) — away from high-volume cold outreach", bg: "rgba(5,150,105,0.12)", color: "#34d399", border: "rgba(5,150,105,0.25)", appearsAt: 11500 },
  { type: "Key Decision", text: "Focus on 50 ICP-qualified target accounts", bg: "rgba(5,150,105,0.12)", color: "#34d399", border: "rgba(5,150,105,0.25)", appearsAt: 12200 },
  { type: "Action Item",  text: "Priya Nair: redefine SDR KPIs — engagement quality & pipeline, not activity volume", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 19000 },
  { type: "Action Item",  text: "Lisa Cortez: targeted content per account vertical (needs list by Friday)", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 26000 },
  { type: "Action Item",  text: "James Whitfield: 50 ICP-qualified target accounts by Friday", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 32500 },
  { type: "Milestone",    text: "30-day cold outreach wind-down begins immediately", bg: "rgba(244,63,94,0.12)", color: "#fb7185", border: "rgba(244,63,94,0.25)", appearsAt: 33500 },
];

const TOTAL = 36000;

export default function LiveDemoEmbed() {
  const [lines, setLines]     = useState([]);
  const [cards, setCards]     = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone]       = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timers    = useRef([]);
  const tick      = useRef(null);
  const startTime = useRef(null);
  const transcriptRef = useRef(null);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    clearInterval(tick.current);
  };

  const start = () => {
    clearAll();
    setLines([]); setCards([]); setDone(false); setElapsed(0); setRunning(true);
    startTime.current = Date.now();

    tick.current = setInterval(() => setElapsed(Date.now() - startTime.current), 100);

    SCRIPT.forEach(({ id, text, delay }) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { id, text }]);
        setTimeout(() => transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" }), 50);
      }, delay);
      timers.current.push(t);
    });

    BOARD_ITEMS.forEach((card) => {
      const t = setTimeout(() => setCards((prev) => [...prev, card]), card.appearsAt);
      timers.current.push(t);
    });

    const end = setTimeout(() => { setRunning(false); setDone(true); clearInterval(tick.current); }, TOTAL);
    timers.current.push(end);
  };

  useEffect(() => { start(); return () => clearAll(); }, []);

  const progress = Math.min((elapsed / TOTAL) * 100, 100);
  const formatTime = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>

      {/* Bar */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center gap-3">
          {running && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
          <span className="text-xs font-heading font-semibold text-slate-500 uppercase tracking-widest">
            {running ? "Live" : done ? "Complete" : "Ready"}
          </span>
          <span className="text-xs text-slate-600 font-body">Sales Strategy Update · {Object.keys(ATTENDEES).length} attendees</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 font-body">{formatTime(elapsed)} / {formatTime(TOTAL)}</span>
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <button onClick={start} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors font-body">
            <RotateCcw size={11} /> Replay
          </button>
        </div>
      </div>

      {/* Split panels */}
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Transcript */}
        <div className="border-r border-white/10">
          <div className="px-5 py-3 border-b border-white/10">
            <span className="text-xs font-heading font-bold text-slate-600 uppercase tracking-widest">Transcript</span>
          </div>
          <div ref={transcriptRef} className="overflow-y-auto px-5 py-4 space-y-4" style={{ height: 300 }}>
            {lines.length === 0 && <p className="text-xs text-slate-700 italic font-body">Meeting starting…</p>}
            {lines.map((line, i) => {
              const person = ATTENDEES[line.id];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-2.5 items-start"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-heading font-bold flex-shrink-0"
                    style={{ background: AVATAR_COLORS[line.id] }}>
                    {person.initials}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-xs font-heading font-semibold text-white">{person.name}</span>
                      <span className="text-xs text-slate-500 font-body">{person.role}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-body leading-relaxed">{line.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live Board */}
        <div>
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-slate-600 uppercase tracking-widest">Live Board</span>
            <span className="text-xs text-slate-600 font-body">{cards.length} item{cards.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="overflow-y-auto px-5 py-4 space-y-2.5" style={{ height: 300 }}>
            {cards.length === 0 && <p className="text-xs text-slate-700 italic font-body">Board items will appear as the meeting progresses…</p>}
            <AnimatePresence>
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-lg px-3 py-2.5 border flex gap-2 items-start"
                  style={{ background: card.bg, borderColor: card.border }}
                >
                  <span className="text-xs font-heading font-bold uppercase tracking-wider flex-shrink-0 whitespace-nowrap mt-0.5"
                    style={{ color: card.color }}>{card.type}</span>
                  <p className="text-xs text-slate-200 font-body leading-snug">{card.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center gap-2">
          {Object.entries(ATTENDEES).map(([id, a]) => (
            <div key={id} title={`${a.name} — ${a.role}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-heading font-bold"
              style={{ background: AVATAR_COLORS[id] }}>
              {a.initials}
            </div>
          ))}
        </div>
        <a
          href="?demo"
          className="flex items-center gap-1.5 text-xs text-primary font-heading font-semibold hover:underline"
        >
          See full demo <ArrowRight size={11} />
        </a>
      </div>
    </div>
  );
}
