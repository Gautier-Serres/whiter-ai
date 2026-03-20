import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ATTENDEES = {
  RC: { name: "Rachel Chen",     role: "CEO",                      initials: "RC" },
  JW: { name: "James Whitfield", role: "VP of Sales",              initials: "JW" },
  PN: { name: "Priya Nair",      role: "Head of SDR",              initials: "PN" },
  DO: { name: "David Okafor",    role: "Senior Account Executive",  initials: "DO" },
  LC: { name: "Lisa Cortez",     role: "Head of Marketing",        initials: "LC" },
  TR: { name: "Tom Reid",        role: "RevOps Lead",              initials: "TR" },
};

const AVATAR_COLORS = {
  RC: "#059669", JW: "#2563EB", PN: "#7C3AED",
  DO: "#D97706", LC: "#E11D48", TR: "#64748B",
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
  { type: "Key Decision", text: "Shift from high-volume cold outreach to Account-Based Selling (ABS)", bg: "rgba(5,150,105,0.12)", color: "#34d399", border: "rgba(5,150,105,0.25)", appearsAt: 12000 },
  { type: "Key Decision", text: "Focus on 50 ICP-qualified target accounts — not contact volume", bg: "rgba(5,150,105,0.12)", color: "#34d399", border: "rgba(5,150,105,0.25)", appearsAt: 12600 },
  { type: "Action Item",  text: "James Whitfield: target account list (50 accounts, ICP-qualified) by Friday", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 21000 },
  { type: "Action Item",  text: "Priya Nair: redefine SDR KPIs — engagement quality & pipeline, not activity volume", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 21800 },
  { type: "Action Item",  text: "Lisa Cortez: targeted content per account vertical (needs account list by Friday)", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 29000 },
  { type: "Action Item",  text: "Tom Reid: restructure Salesforce for account-level ABS tracking by Monday", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 35500 },
  { type: "Action Item",  text: "James Whitfield: ABS pilot plan (timelines, ownership, metrics) for leadership review by Thursday", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 46000 },
  { type: "Risk",         text: "Mid-quarter pipeline gap risk during transition — mitigated by 30-day phase-out", bg: "rgba(217,119,6,0.12)", color: "#fbbf24", border: "rgba(217,119,6,0.25)", appearsAt: 51000 },
  { type: "Milestone",    text: "30-day cold outreach wind-down begins immediately", bg: "rgba(244,63,94,0.12)", color: "#fb7185", border: "rgba(244,63,94,0.25)", appearsAt: 57500 },
  { type: "Action Item",  text: "Priya Nair: document new SDR playbook — roles, KPIs, outreach cadence", bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)", appearsAt: 58500 },
];

const TYPE_COLORS = {
  "Key Decision": "#34d399",
  "Action Item":  "#a78bfa",
  "Risk":         "#fbbf24",
  "Milestone":    "#fb7185",
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

  const progress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-dark font-body">

      {/* Top bar */}
      <div className="bg-dark/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="font-heading font-bold text-white">
            Whiter<span className="text-primary">.</span>ai
          </span>
        </div>

        <div className="flex items-center gap-4">
          {running && (
            <div className="flex items-center gap-2 text-xs font-heading font-semibold text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Live
            </div>
          )}
          {done && <span className="text-xs text-slate-500 font-body">Session complete</span>}
          <button
            onClick={start}
            className="flex items-center gap-2 text-xs text-slate-400 border border-white/15 hover:border-white/30 hover:text-white px-3 py-1.5 rounded-lg transition-all font-heading"
          >
            <RotateCcw size={12} /> Replay
          </button>
        </div>
      </div>

      {/* Meeting header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Sales Strategy Update</h1>
            <p className="text-sm text-slate-500 font-body mt-1">
              Live demo · {Object.keys(ATTENDEES).length} attendees · {formatTime(TOTAL_DURATION)} session
            </p>
            <div className="flex items-center gap-2 mt-3">
              {Object.entries(ATTENDEES).map(([id, a]) => (
                <div
                  key={id}
                  title={`${a.name} — ${a.role}`}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-heading font-bold"
                  style={{ background: AVATAR_COLORS[id] }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xs text-slate-500 font-body mb-2">
              {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
            </p>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT — Transcript */}
        <div className="bg-white/3 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xs font-heading font-bold text-slate-500 uppercase tracking-widest">Transcript</h2>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${running ? "bg-red-400 animate-pulse" : "bg-white/20"}`} />
              <span className="text-xs text-slate-600 font-body">
                {running ? "Listening" : done ? "Stopped" : "Ready"}
              </span>
            </div>
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            style={{ minHeight: 480, maxHeight: 560 }}
          >
            {visibleLines.length === 0 && (
              <p className="text-sm text-slate-700 italic font-body">Meeting starting…</p>
            )}
            {visibleLines.map((line, i) => {
              const person = ATTENDEES[line.id];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 items-start"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-heading font-bold"
                    style={{ background: AVATAR_COLORS[line.id] }}
                  >
                    {person.initials}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-heading font-semibold text-white">{person.name}</span>
                      <span className="text-xs text-slate-500 font-body">{person.role}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-body leading-relaxed">{line.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Live Board */}
        <div className="bg-white/3 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xs font-heading font-bold text-slate-500 uppercase tracking-widest">Live Board</h2>
            <span className="text-xs text-slate-600 font-body">
              {visibleCards.length} item{visibleCards.length !== 1 ? "s" : ""} captured
            </span>
          </div>

          <div
            className="flex-1 overflow-y-auto px-6 py-5 space-y-3"
            style={{ minHeight: 480, maxHeight: 560 }}
          >
            {visibleCards.length === 0 && (
              <p className="text-sm text-slate-700 italic font-body">
                Board items will appear as the meeting progresses…
              </p>
            )}
            <AnimatePresence>
              {visibleCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl px-4 py-3 border flex gap-3 items-start"
                  style={{ background: card.bg, borderColor: card.border }}
                >
                  <span
                    className="text-xs font-heading font-bold uppercase tracking-wider mt-0.5 flex-shrink-0 whitespace-nowrap"
                    style={{ color: card.color }}
                  >
                    {card.type}
                  </span>
                  <p className="text-sm text-slate-200 font-body leading-snug">{card.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-slate-500 font-body">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
