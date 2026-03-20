import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Player } from "@remotion/player";
import { Mic, Zap, Monitor, Users, Quote, ArrowRight, Sparkles, Brain, LayoutTemplate } from "lucide-react";
import { HeroComposition } from "./components/HeroComposition";
import { HowItWorksComposition } from "./components/HowItWorksComposition";
import { Waitlist } from "./components/Waitlist";
import { Session } from "./components/Session";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onLaunchSession }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark/80 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-heading font-bold text-xl text-white tracking-tight">
          Whiter<span className="text-primary">.</span>ai
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-body">
          {["features", "how-it-works", "testimonials"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="hover:text-white transition-colors duration-200 capitalize"
            >
              {id.replace("-", " ")}
            </button>
          ))}
        </nav>
        <button
          onClick={() => scrollTo("waitlist")}
          className="bg-primary hover:bg-primary/90 text-white text-sm font-heading font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
        >
          Join waitlist
        </button>
        <button
          onClick={onLaunchSession}
          className="flex items-center gap-1.5 border border-white/20 text-white text-sm font-heading font-semibold px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-200"
        >
          <Mic size={14} /> Live demo
        </button>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onLaunchSession }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} className="text-accent" />
            <span className="text-accent text-xs font-heading font-semibold tracking-wide uppercase">
              AI-native presentation
            </span>
          </div>

          <h1 className="font-heading font-bold text-5xl md:text-6xl text-white leading-tight mb-4">
            The whiteboard
            <br />
            that{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              writes itself.
            </span>
          </h1>

          <p className="font-body text-lg text-slate-300 mb-3 leading-relaxed">
            Speak freely. Whiter.ai listens and instantly generates synchronized, contextual slides from your words — in real time.
          </p>
          <p className="font-body text-slate-400 mb-8 leading-relaxed">
            No prep. No friction. Your audience stays engaged because the visuals always match exactly what you're saying.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("waitlist")}
              className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Get early access <ArrowRight size={18} />
            </button>
            <button
              onClick={onLaunchSession}
              className="flex items-center gap-2 border border-primary/40 text-primary font-heading font-semibold px-8 py-4 rounded-xl hover:bg-primary/10 transition-all duration-200"
            >
              <Mic size={18} /> Try live demo
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="border border-white/20 text-white font-heading font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              See how it works
            </button>
          </div>
        </motion.div>

        {/* Right: Remotion player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10"
        >
          <Player
            component={HeroComposition}
            durationInFrames={180}
            compositionWidth={560}
            compositionHeight={320}
            fps={30}
            autoPlay
            loop
            controls={false}
            style={{ width: "100%" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Social Proof Bar ─────────────────────────────────────────────────────────
function SocialProof() {
  const stats = [
    { value: "500+", label: "Early signups" },
    { value: "< 200ms", label: "Slide generation latency" },
    { value: "92%", label: "Audience engagement lift" },
  ];

  return (
    <div className="bg-white/3 border-y border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-heading font-bold text-2xl text-white mb-1">{s.value}</div>
            <div className="font-body text-sm text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Mic size={24} className="text-primary" />,
      title: "Real-time transcription",
      desc: "Whiter.ai captures your speech with sub-200ms latency. Every word lands on screen as it leaves your mouth.",
    },
    {
      icon: <Brain size={24} className="text-accent" />,
      title: "Contextual AI generation",
      desc: "Our model doesn't just transcribe — it understands. It extracts key ideas and shapes them into clear visual narratives.",
    },
    {
      icon: <Monitor size={24} className="text-primary" />,
      title: "Synchronized across screens",
      desc: "Every participant sees the same slides at the same moment. No lag, no confusion, no one lost in the deck.",
    },
    {
      icon: <Zap size={24} className="text-accent" />,
      title: "Zero prep required",
      desc: "Walk into any room. Start speaking. Whiter.ai handles the visuals so you can focus on the conversation.",
    },
    {
      icon: <LayoutTemplate size={24} className="text-primary" />,
      title: "Brand-aware templates",
      desc: "Train Whiter.ai on your brand guidelines. Every generated slide matches your colors, fonts, and tone.",
    },
    {
      icon: <Users size={24} className="text-accent" />,
      title: "Audience engagement tools",
      desc: "Live polls, reaction tracking, and attention heatmaps built in — because a great presentation is a conversation.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-4xl text-white mb-4">
            Built for how people actually present
          </h2>
          <p className="font-body text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature is designed to get out of your way — and make your audience lean in.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white/3 border border-white/10 rounded-xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="font-heading font-semibold text-white text-lg mb-2">{f.title}</h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-dark via-[#0d0d18] to-dark">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-4xl text-white mb-4">How it works</h2>
          <p className="font-body text-slate-400 text-lg">Three steps. Zero friction.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10"
        >
          <Player
            component={HowItWorksComposition}
            durationInFrames={270}
            compositionWidth={480}
            compositionHeight={300}
            fps={30}
            autoPlay
            loop
            controls={false}
            style={{ width: "100%" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "I used to spend Sunday nights building slide decks. Now I just show up and talk. Whiter.ai does the rest — and honestly the slides look better than mine did.",
      name: "Marcus Reid",
      role: "VP of Product, Luminary",
    },
    {
      quote: "Our workshops went from 60% audience attention to near-total engagement. When slides match what the speaker is saying in real time, people can't look away.",
      name: "Yuki Tanaka",
      role: "Leadership Coach & Facilitator",
    },
    {
      quote: "This is what every investor pitch needs. I improvised half my last deck live and the visuals kept up perfectly. Closed the round.",
      name: "Ines Cavalcanti",
      role: "Founder, Arboris Labs",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-4xl text-white mb-4">
            What early users say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white/3 border border-white/10 rounded-xl p-6"
            >
              <Quote size={20} className="text-primary mb-4 opacity-60" />
              <p className="font-body text-slate-300 text-sm leading-relaxed mb-6">{t.quote}</p>
              <div>
                <div className="font-heading font-semibold text-white text-sm">{t.name}</div>
                <div className="font-body text-slate-500 text-xs mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-white/10 bg-dark py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-heading font-bold text-white text-lg">
          Whiter<span className="text-primary">.</span>ai
        </div>
        <nav className="flex gap-6 text-sm text-slate-500 font-body">
          {[
            { label: "Features", id: "features" },
            { label: "How it works", id: "how-it-works" },
            { label: "Waitlist", id: "waitlist" },
          ].map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="hover:text-slate-300 transition-colors duration-200">
              {l.label}
            </button>
          ))}
        </nav>
        <div className="font-body text-slate-600 text-sm">
          © {new Date().getFullYear()} Whiter.ai
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [sessionOpen, setSessionOpen] = useState(false);

  return (
    <div className="bg-dark text-white font-body min-h-screen">
      {sessionOpen && <Session onClose={() => setSessionOpen(false)} />}
      <Navbar onLaunchSession={() => setSessionOpen(true)} />
      <header>
        <Hero onLaunchSession={() => setSessionOpen(true)} />
      </header>
      <main>
        <SocialProof />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Waitlist />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
