import { useState, useEffect, useRef } from "react";
import { RotateCcw, Circle } from "lucide-react";

const ATTENDEES = {
  RC: { name: "Rachel Chen",     role: "CEO",               initials: "RC" },
  JW: { name: "James Whitfield", role: "VP of Sales",       initials: "JW" },
  PN: { name: "Priya Nair",      role: "Head of SDR",       initials: "PN" },
  DO: { name: "David Okafor",    role: "Senior AE",         initials: "DO" },
  LC: { name: "Lisa Cortez",     role: "Head of Marketing", initials: "LC" },
  TR: { name: "Tom Reid",        role: "RevOps Lead",       initials: "TR" },
};

const AVATAR_COLORS = {
  RC: "#0F766E", JW: "#1D4ED8", PN: "#7C3AED",
  DO: "#B45309", LC: "#BE123C", TR: "#374151",
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
  { type: "Key Decision", text: "Shift to Account-Based Selling (ABS) — away from high-volume cold outreach", bg: "#CCFBF1", color: "#0F766E", border: "#99F6E4", appearsAt: 11500 },
  { type: "Key Decision", text: "Focus on 50 ICP-qualified target accounts", bg: "#CCFBF1", color: "#0F766E", border: "#99F6E4", appearsAt: 12200 },
  { type: "Action Item", text: "Priya Nair: redefine SDR KPIs — engagement quality & pipeline, not activity volume", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 19000 },
  { type: "Action Item", text: "Lisa Cortez: targeted content per account vertical (needs list by Friday)", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 26000 },
  { type: "Action Item", text: "James Whitfield: 50 ICP-qualified target accounts by Friday", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 32500 },
  { type: "Milestone",   text: "30-day cold outreach wind-down begins immediately", bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3", appearsAt: 33500 },
];

const TOTAL = 36000;

export default function LiveDemoEmbed() {
  const [lines, setLines]   = useState([]);
  const [cards, setCards]   = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone]     = useState(false);
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
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-md bg-white">
      {/* Bar */}
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {running && <Circle size={8} className="fill-red-400 text-red-400 animate-pulse" />}
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              {running ? "Live" : done ? "Complete" : "Ready"}
            </span>
          </div>
          <span className="text-xs text-gray-400">Sales Strategy Update · {Object.keys(ATTENDEES).length} attendees</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{formatTime(elapsed)} / {formatTime(TOTAL)}</span>
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <button onClick={start} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors">
            <RotateCcw size={12} /> Replay
          </button>
        </div>
      </div>

      {/* Split panels */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Transcript */}
        <div className="border-r border-gray-100">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transcript</span>
          </div>
          <div ref={transcriptRef} className="overflow-y-auto px-5 py-4 space-y-4" style={{ height: 320 }}>
            {lines.length === 0 && <p className="text-xs text-gray-300 italic">Meeting starting...</p>}
            {lines.map((line, i) => {
              const person = ATTENDEES[line.id];
              return (
                <div key={i} className="flex gap-2.5 items-start" style={{ animation: "fadeUp 0.3s ease-out" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: AVATAR_COLORS[line.id] }}>
                    {person.initials}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-gray-900">{person.name}</span>
                      <span className="text-xs text-gray-400">{person.role}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{line.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Board */}
        <div>
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Board</span>
            <span className="text-xs text-gray-400">{cards.length} item{cards.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="overflow-y-auto px-5 py-4 space-y-2.5" style={{ height: 320 }}>
            {cards.length === 0 && <p className="text-xs text-gray-300 italic">Board items will appear as the meeting progresses...</p>}
            {cards.map((card, i) => (
              <div key={i} className="rounded-lg px-3 py-2.5 border flex gap-2 items-start"
                style={{ background: card.bg, borderColor: card.border, animation: "slideIn 0.3s ease-out" }}>
                <span className="text-xs font-bold uppercase tracking-wider flex-shrink-0 whitespace-nowrap mt-0.5"
                  style={{ color: card.color }}>{card.type}</span>
                <p className="text-xs text-gray-700 leading-snug">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Object.entries(ATTENDEES).map(([id, a]) => (
            <div key={id} title={`${a.name} — ${a.role}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: AVATAR_COLORS[id] }}>
              {a.initials}
            </div>
          ))}
        </div>
        <a href="/demo" className="text-xs text-primary font-medium hover:underline">
          See It in Action →
        </a>
      </div>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
