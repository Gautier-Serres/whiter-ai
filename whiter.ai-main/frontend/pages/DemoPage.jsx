import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, Circle } from "lucide-react";

const ATTENDEES = {
  RC: { name: "Rachel Chen",    role: "CEO",                      initials: "RC" },
  JW: { name: "James Whitfield", role: "VP of Sales",             initials: "JW" },
  PN: { name: "Priya Nair",     role: "Head of SDR",              initials: "PN" },
  DO: { name: "David Okafor",   role: "Senior Account Executive", initials: "DO" },
  LC: { name: "Lisa Cortez",    role: "Head of Marketing",        initials: "LC" },
  TR: { name: "Tom Reid",       role: "RevOps Lead",              initials: "TR" },
};

const MEETING_SCRIPT = [
  { id: "RC", text: "Team, Q3 pipeline numbers are in and they're not good. Cold outreach conversion dropped to 0.8% — down from 2.1% last year. We need to change how we approach new accounts, starting now.", delay: 800 },
  { id: "JW", text: "I've been analysing this for two weeks. The volume play is dead in our segment. Prospects are ignoring mass sequences. I want to propose a shift to account-based selling — 50 high-value targets, deeply researched, instead of blasting 5,000 contacts a month.", delay: 6500 },
  { id: "PN", text: "That's a significant structural change for the SDR team. Right now they're measured on call volume and email sends. We'd need to redefine their KPIs entirely — moving to engagement quality per account and pipeline generated, not activity counts.", delay: 13000 },
  { id: "DO", text: "From where I sit, this is long overdue. Half the leads I receive are unqualified and go nowhere. With account-based selling, I'd be working accounts that are pre-warmed and ICP-matched. Close rates should jump significantly.", delay: 20000 },
  { id: "LC", text: "Marketing can build this out. We'd create targeted content per account vertical — personalised decks, industry-specific case studies, custom landing pages. But I need the target account list by Friday to build the asset plan in time.", delay: 27500 },
  { id: "TR", text: "I'll need to restructure our Salesforce setup. ABS requires account-level tracking rather than lead-level. I can have new dashboards and workflows ready by Monday if James confirms the account criteria today.", delay: 34000 },
  { id: "RC", text: "James — you own the target account list. 50 accounts, fully ICP-qualified, by end of this week. No exceptions.", delay: 40000 },
  { id: "JW", text: "Understood. I'll prioritise it. I'll also put together an ABS pilot plan — timelines, ownership, success metrics — for leadership review by Thursday.", delay: 44500 },
  { id: "PN", text: "One thing we need to decide: do we cut cold outreach immediately or phase it out? We're mid-quarter. Cutting it now could create a short-term gap in the pipeline.", delay: 49500 },
  { id: "RC", text: "We phase it out. 30-day wind-down. That protects this quarter while we build the new motion. Priya, document the new SDR playbook — roles, KPIs, outreach cadence. James, ABS is your number one priority from today.", delay: 54500 },
];

const BOARD_ITEMS = [
  { type: "Key Decision", text: "Shift from high-volume cold outreach to Account-Based Selling (ABS)", bg: "#CCFBF1", color: "#0F766E", border: "#99F6E4", appearsAt: 12000 },
  { type: "Key Decision", text: "Focus on 50 ICP-qualified target accounts — not contact volume", bg: "#CCFBF1", color: "#0F766E", border: "#99F6E4", appearsAt: 12600 },
  { type: "Action Item", text: "James Whitfield: target account list (50 accounts, ICP-qualified) by Friday", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 21000 },
  { type: "Action Item", text: "Priya Nair: redefine SDR KPIs — engagement quality & pipeline, not activity volume", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 21800 },
  { type: "Action Item", text: "Lisa Cortez: targeted content per account vertical (needs account list by Friday)", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 29000 },
  { type: "Action Item", text: "Tom Reid: restructure Salesforce for account-level ABS tracking by Monday", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 35500 },
  { type: "Action Item", text: "James Whitfield: ABS pilot plan (timelines, ownership, metrics) for leadership review by Thursday", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 46000 },
  { type: "Risk", text: "Mid-quarter pipeline gap risk during transition — mitigated by 30-day phase-out", bg: "#FFFBEB", color: "#B45309", border: "#FDE68A", appearsAt: 51000 },
  { type: "Milestone", text: "30-day cold outreach wind-down begins immediately", bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3", appearsAt: 57500 },
  { type: "Action Item", text: "Priya Nair: document new SDR playbook — roles, KPIs, outreach cadence", bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE", appearsAt: 58500 },
];

const TYPE_COLORS = {
  "Key Decision": "#0F766E",
  "Action Item":  "#6D28D9",
  Risk:           "#B45309",
  Milestone:      "#BE123C",
};

const AVATAR_COLORS = {
  RC: "#0F766E",
  JW: "#1D4ED8",
  PN: "#7C3AED",
  DO: "#B45309",
  LC: "#BE123C",
  TR: "#374151",
};

const TOTAL_DURATION = 61000;

export default function DemoPage() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [running, setRunning]           = useState(false);
  const [done, setDone]                 = useState(false);
  const [elapsed, setElapsed]           = useState(0);
  const timersRef     = useRef([]);
  const startTimeRef  = useRef(null);
  const tickRef       = useRef(null);
  const transcriptRef = useRef(null);

  const clearAll = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    clearInterval(tickRef.current);
  };

  const start = () => {
    clearAll();
    setVisibleLines([]);
    setVisibleCards([]);
    setDone(false);
    setElapsed(0);
    setRunning(true);
    startTimeRef.current = Date.now();

    tickRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);

    MEETING_SCRIPT.forEach((line) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setTimeout(() => {
          transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
        }, 50);
      }, line.delay);
      timersRef.current.push(t);
    });

    BOARD_ITEMS.forEach((card) => {
      const t = setTimeout(() => {
        setVisibleCards((prev) => [...prev, card]);
      }, card.appearsAt);
      timersRef.current.push(t);
    });

    const endTimer = setTimeout(() => {
      setRunning(false);
      setDone(true);
      clearInterval(tickRef.current);
    }, TOTAL_DURATION);
    timersRef.current.push(endTimer);
  };

  useEffect(() => {
    start();
    return () => clearAll();
  }, []);

  const progress   = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} /> Back to home
          </a>
          <div className="h-4 w-px bg-gray-200" />
          <span className="font-black text-gray-900">
            Whiter<span className="text-primary">.</span>ai
          </span>
        </div>

        <div className="flex items-center gap-4">
          {running && (
            <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
              <Circle size={8} className="fill-red-500 animate-pulse" />
              Live
            </div>
          )}
          {done && <span className="text-sm text-gray-400">Session complete</span>}
          <button
            onClick={start}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:border-primary hover:text-primary transition-colors"
          >
            <RotateCcw size={14} /> Replay
          </button>
        </div>
      </div>

      {/* Meeting header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Sales Strategy Update</h1>
            <p className="text-sm text-gray-400 mt-1">
              Live demo · {Object.keys(ATTENDEES).length} attendees · {formatTime(TOTAL_DURATION)} session
            </p>
            {/* Attendee avatars */}
            <div className="flex items-center gap-2 mt-3">
              {Object.entries(ATTENDEES).map(([id, a]) => (
                <div key={id} title={`${a.name} — ${a.role}`}>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: AVATAR_COLORS[id] }}
                  >
                    {a.initials}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400 mb-2">
              {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
            </p>
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Transcript */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transcript</h2>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${running ? "bg-red-400 animate-pulse" : "bg-gray-300"}`} />
              <span className="text-xs text-gray-400">{running ? "Listening" : done ? "Stopped" : "Ready"}</span>
            </div>
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
            style={{ minHeight: 460, maxHeight: 540 }}
          >
            {visibleLines.length === 0 && (
              <p className="text-sm text-gray-300 italic">Meeting starting...</p>
            )}
            {visibleLines.map((line, i) => {
              const person = ATTENDEES[line.id];
              return (
                <div key={i} className="flex gap-3 items-start" style={{ animation: "fadeUp 0.3s ease-out" }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                    style={{ background: AVATAR_COLORS[line.id] }}
                  >
                    {person.initials}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{person.name}</span>
                      <span className="text-xs text-gray-400">{person.role}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{line.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Live Board */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Board</h2>
            <span className="text-xs text-gray-400">
              {visibleCards.length} item{visibleCards.length !== 1 ? "s" : ""} captured
            </span>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
            style={{ minHeight: 460, maxHeight: 540 }}
          >
            {visibleCards.length === 0 && (
              <p className="text-sm text-gray-300 italic">
                Board items will appear here as the meeting progresses...
              </p>
            )}
            {visibleCards.map((card, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3 border flex gap-3 items-start"
                style={{ background: card.bg, borderColor: card.border, animation: "slideIn 0.3s ease-out" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-wider mt-0.5 flex-shrink-0 whitespace-nowrap"
                  style={{ color: card.color }}
                >
                  {card.type}
                </span>
                <p className="text-sm text-gray-700 leading-snug">{card.text}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-gray-400">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
