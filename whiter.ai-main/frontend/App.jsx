import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Eye, Users, Quote, ArrowRight, ChevronDown, Menu, X, Globe, Puzzle, GitMerge, Sliders } from "lucide-react";
import { Player } from "@remotion/player";
import HeroComposition from "./components/HeroComposition";
import LiveDemoEmbed from "./components/LiveDemoEmbed";
import ContactModal from "./components/ContactModal";
import PresentAnywhere from "./components/illustrations/PresentAnywhere";
import ContentBuilds from "./components/illustrations/ContentBuilds";
import NotTranscription from "./components/illustrations/NotTranscription";

// Gracefully handle Remotion in test/non-browser environments
class PlayerBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) return this.props.fallback ?? null;
    return this.props.children;
  }
}

const FEATURES = [
  {
    icon: Zap,
    title: "Live Visual Boards",
    body: "AI listens to your meeting and builds structured visual boards in real time — no manual input, no post-meeting cleanup. The board simply appears as you speak.",
  },
  {
    icon: Eye,
    title: "Real-Time Comprehension",
    body: "Every attendee sees key points, decisions, and action items appear as they're spoken. No more losing the thread or leaving with a different understanding.",
  },
  {
    icon: Users,
    title: "Instant Engagement",
    body: "When people follow along visually, they ask sharper questions and leave every meeting aligned. Turn passive listeners into active participants.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Whiter.ai changed how our team runs standups. Everyone stays on the same page and we actually end on time.",
    name: "Marcus Reid",
    role: "Head of Product, Ramp.io",
  },
  {
    quote:
      "I used to spend 20 minutes after every strategy session writing up notes. Now the board is ready before the meeting even ends.",
    name: "Sofia Decker",
    role: "VP Engineering, Flowbase",
  },
  {
    quote:
      "Our board meetings used to be a mess of side conversations. With Whiter.ai, everyone can see where the discussion is going.",
    name: "James Okafor",
    role: "CEO, Parallel Labs",
  },
];

const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it Works" },
  { id: "schedule", label: "Schedule a Demo" },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-black text-xl text-gray-900 tracking-tight">
            Whiter<span className="text-primary">.</span>ai
          </span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => id === "schedule" ? setShowContact(true) : scrollTo(id)}
                className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {label}
              </button>
            ))}
            <a
              href="/team"
              className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
            >
              Our Team
            </a>
          </nav>

          <button
            onClick={() => setShowContact(true)}
            className="hidden md:flex items-center gap-2 bg-primary text-white text-sm px-5 py-2 rounded-xl hover:bg-teal-800 transition-colors duration-200"
          >
            Schedule a Demo <ArrowRight size={14} />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 pb-5 flex flex-col gap-4">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm text-gray-600 hover:text-primary transition-colors"
              >
                {label}
              </button>
            ))}
            <a href="/team" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Our Team
            </a>
            <button
              onClick={() => setShowContact(true)}
              className="bg-primary text-white text-sm px-5 py-2 rounded-xl w-fit"
            >
              Schedule a Demo
            </button>
          </div>
        )}
      </header>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <main>
        {/* HERO */}
        <section className="min-h-screen flex items-center bg-gradient-to-br from-white via-accent/30 to-teal-50 pt-16">
          <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-none mb-6"
              >
                Whiter<span className="text-primary">.</span>ai
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-xl lg:text-2xl font-semibold text-gray-700 mb-4 leading-snug"
              >
                Your meeting, visualized in real time.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg"
              >
                Whiter.ai listens to live speech and instantly generates visual boards — so every
                attendee follows along, stays engaged, and asks the right questions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => setShowContact(true)}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-teal-800 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Schedule a Demo <ArrowRight size={18} />
                </button>
                <a
                  href="/demo"
                  className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-base hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  See It in Action <ArrowRight size={18} />
                </a>
              </motion.div>
            </div>

            {/* Remotion hero player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white"
            >
              <PlayerBoundary
                fallback={
                  <div className="w-full aspect-video bg-gradient-to-br from-teal-50 to-accent flex items-center justify-center">
                    <span className="text-primary font-semibold">Whiter.ai in action</span>
                  </div>
                }
              >
                <Player
                  component={HeroComposition}
                  durationInFrames={180}
                  compositionWidth={640}
                  compositionHeight={400}
                  fps={30}
                  autoPlay
                  loop
                  controls={false}
                  style={{ width: "100%", display: "block" }}
                />
              </PlayerBoundary>
            </motion.div>
          </div>
        </section>

        {/* SOCIAL PROOF BAR */}
        <section className="bg-gray-50 border-y border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { stat: "500+", label: "Early signups" },
                { stat: "4.9 / 5", label: "Pilot satisfaction rating" },
                { stat: "3×", label: "Meeting engagement lift" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-primary">{stat}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THREE PILLARS */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6 space-y-20">
            {[
              {
                tag: "Presence",
                headline: "Present anywhere.\nDeliver any message.",
                body: "Whether you're in a boardroom, on a video call, or presenting to a hundred people — Whiter.ai adapts to your context. Your visual board appears wherever your audience is, making every message land with clarity.",
                reverse: false,
                Illustration: PresentAnywhere,
              },
              {
                tag: "Intelligence",
                headline: "Content that builds\nitself as you speak.",
                body: "No templates. No manual input. Whiter.ai listens to your natural speech and structures it in real time — pulling out the key points, decisions, and actions that matter. The board is ready before the meeting ends.",
                reverse: true,
                Illustration: ContentBuilds,
              },
              {
                tag: "Understanding",
                headline: "Not transcription.\nUnderstanding.",
                body: "Transcription captures words. Whiter.ai captures meaning. Our AI doesn't just record what was said — it understands context, identifies intent, and surfaces what actually matters to your team.",
                reverse: false,
                Illustration: NotTranscription,
              },
            ].map(({ tag, headline, body, reverse, Illustration }, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}
              >
                <div className={reverse ? "lg:[direction:ltr]" : ""}>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4 block">{tag}</span>
                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6 whitespace-pre-line">{headline}</h2>
                  <p className="text-lg text-gray-500 leading-relaxed">{body}</p>
                </div>
                <div className={`rounded-2xl overflow-hidden h-56 lg:h-72 ${reverse ? "lg:[direction:ltr]" : ""}`}>
                  <Illustration />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-black text-gray-900 mb-4">Built for meeting leaders</h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Everything you need to run meetings where every voice is heard and every decision
                lands.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default"
                >
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-5">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-black text-gray-900 mb-4">Built to fit your world</h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Whiter.ai works the way your team works — not the other way around.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Sliders,
                  title: "Fully personalizable",
                  body: "Adapt the board layout, output structure, and visual style to match your brand or meeting format. Every team is different — Whiter.ai adjusts to your needs.",
                },
                {
                  icon: Globe,
                  title: "Multilingual by default",
                  body: "Speak in English, French, German, Spanish, Italian, and more. Whiter.ai understands and structures content across languages without missing a beat.",
                },
                {
                  icon: Puzzle,
                  title: "Integrates with your tools",
                  body: "Connect Whiter.ai to Notion, Slack, Google Meet, Zoom, Microsoft Teams, and your CRM. Your board flows directly into the tools your team already uses.",
                },
                {
                  icon: GitMerge,
                  title: "Real-time collaboration",
                  body: "Every attendee sees the same live board simultaneously. Add comments, highlight decisions, and assign actions — all while the meeting is still happening.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-black text-gray-900 mb-4">How it works</h2>
              <p className="text-lg text-gray-500">
                Watch Whiter.ai build a live board from a real meeting, in real time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LiveDemoEmbed />
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-black text-gray-900 mb-4">Teams love it</h2>
              <p className="text-lg text-gray-500">From standups to boardrooms.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map(({ quote, name, role }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-xl border border-gray-100 shadow-sm"
                >
                  <Quote size={22} className="text-primary mb-4 opacity-50" />
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{quote}"</p>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-gray-400 text-xs mt-1">{role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-28 bg-gradient-to-br from-primary to-teal-800">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Ready to transform your meetings?
              </h2>
              <p className="text-lg text-teal-100 mb-10 max-w-xl mx-auto leading-relaxed">
                Be the first to access Whiter.ai. Get in touch and we'll set up a personalised demo for your team
                
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowContact(true)}
                  className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-base hover:bg-teal-50 transition-colors duration-200"
                >
                  Schedule a Demo →
                </button>
                <a
                  href="mailto:hello@whiter.ai"
                  className="border border-white/40 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/10 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-black text-white text-lg">
            Whiter<span className="text-primary">.</span>ai
          </span>
          <nav className="flex gap-6 text-sm">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-white transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </nav>
          <p className="text-sm">© {new Date().getFullYear()} Whiter.ai. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
