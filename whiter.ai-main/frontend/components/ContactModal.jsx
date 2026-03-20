import { useState } from "react";
import { X } from "lucide-react";

const EMPTY = { name: "", company: "", email: "", phone: "", message: "" };

export default function ContactModal({ onClose }) {
  const [form, setForm]       = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState(null);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Something went wrong.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">Schedule a Demo</h2>
            <p className="text-sm text-gray-400 mt-0.5">We'll be in touch within 24 hours.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="px-8 py-12 text-center">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl font-black">✓</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thanks, we'll be in touch!</h3>
            <p className="text-sm text-gray-500 mb-6">Our team will reach out within 24 hours to set up your demo.</p>
            <button onClick={onClose} className="bg-primary text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-teal-800 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name <span className="text-red-400">*</span></label>
                <input
                  name="name" value={form.name} onChange={update} required
                  placeholder="Laura Toffoli"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company <span className="text-red-400">*</span></label>
                <input
                  name="company" value={form.company} onChange={update} required
                  placeholder="Whiter.ai"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
              <input
                name="email" type="email" value={form.email} onChange={update} required
                placeholder="laura@whiter.ai"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone number</label>
              <input
                name="phone" type="tel" value={form.phone} onChange={update}
                placeholder="+49 30 123 456 78"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
              <textarea
                name="message" value={form.message} onChange={update} rows={3}
                placeholder="Tell us about your team and what you're looking for..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-4 py-2.5">
                Cancel
              </button>
              <button
                type="submit" disabled={submitting}
                className="bg-primary text-white px-8 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-800 transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
