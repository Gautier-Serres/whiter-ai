import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Twitter, Linkedin, Link2, Check } from "lucide-react";

const INTERESTS = [
  "Real-time slide generation",
  "Audience engagement tools",
  "Brand-aware templates",
];

function Confetti() {
  const particles = Array.from({ length: 40 });
  const colors = ["#6366F1", "#A78BFA", "#818CF8", "#C4B5FD", "#fff"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-8px",
            background: colors[i % colors.length],
            rotate: Math.random() * 360,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.6,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

function ShareButtons({ startup = "Whiter.ai" }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "https://whiter.ai";
  const message = `I just joined the waitlist for ${startup} — the whiteboard that writes itself. ${url}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-sm font-heading px-4 py-2 rounded-lg transition-all duration-200"
      >
        <Twitter size={15} /> Share on X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-sm font-heading px-4 py-2 rounded-lg transition-all duration-200"
      >
        <Linkedin size={15} /> Share on LinkedIn
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-sm font-heading px-4 py-2 rounded-lg transition-all duration-200"
      >
        {copied ? <Check size={15} className="text-green-400" /> : <Link2 size={15} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error
  const [position, setPosition] = useState(null);
  const [count, setCount] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  const validateEmail = (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, interest: interest || undefined }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
      } else if (data.success) {
        setPosition(data.position);
        setCount((c) => (c !== null ? c + 1 : null));
        setStatus("success");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="waitlist" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark to-accent/10" />
      <div className="absolute inset-0 bg-dark/60" />
      {showConfetti && <Confetti />}

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={14} className="text-accent" />
            <span className="text-accent text-xs font-heading font-semibold tracking-wide uppercase">
              Limited early access
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
            Be first to present
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              without a deck.
            </span>
          </h2>

          {count !== null && (
            <p className="font-body text-slate-400 text-base mb-3">
              Join <span className="text-white font-semibold">{count}+</span> others on the waitlist
            </p>
          )}

          <p className="font-body text-slate-400 text-lg mb-10">
            We're onboarding in small cohorts. Sign up to secure your spot.
          </p>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 border border-primary/40 rounded-xl p-8"
              >
                <div className="text-4xl mb-3">🎉</div>
                <div className="font-heading font-bold text-white text-2xl mb-2">You're on the list!</div>
                <div className="font-body text-slate-400 mb-2">
                  You're <span className="text-white font-semibold">#{position}</span> on the waitlist.
                  We'll reach out when your cohort opens.
                </div>
                <div className="font-body text-slate-500 text-sm mb-4">
                  Move up the list by sharing with your network
                </div>
                <ShareButtons />
              </motion.div>
            ) : status === "duplicate" ? (
              <motion.div
                key="duplicate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/15 rounded-xl p-6 text-slate-300 font-body"
              >
                Looks like you're already on the list! We'll be in touch.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-md mx-auto text-left"
              >
                <div>
                  <label className="block text-slate-400 text-sm font-body mb-1.5">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className={`w-full bg-white/5 border ${emailError ? "border-red-500/60" : "border-white/20"} text-white placeholder-slate-500 font-body px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary/60 transition-colors duration-200`}
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1.5 font-body">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-body mb-1.5">
                    Name <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 text-white placeholder-slate-500 font-body px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary/60 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-body mb-1.5">
                    What excites you most? <span className="text-slate-600">(optional)</span>
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/20 text-slate-300 font-body px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary/60 transition-colors duration-200 appearance-none"
                  >
                    <option value="">Select an option…</option>
                    {INTERESTS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm font-body text-center">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold px-7 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                  {status === "loading" ? (
                    <span className="animate-pulse">Joining…</span>
                  ) : (
                    <>Get early access <ArrowRight size={16} /></>
                  )}
                </button>

                <p className="text-slate-600 text-xs font-body text-center leading-relaxed">
                  We'll only use your email to notify you when we launch. No spam, unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
