from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import pptx.oxml.ns as nsmap
from lxml import etree

# ── Palette ───────────────────────────────────────────
C_DARK    = RGBColor(0x0A, 0x0A, 0x0F)
C_PRIMARY = RGBColor(0x63, 0x66, 0xF1)
C_ACCENT  = RGBColor(0xA7, 0x8B, 0xFA)
C_WHITE   = RGBColor(0xFF, 0xFF, 0xFF)
C_MUTED   = RGBColor(0x94, 0xA3, 0xB8)
C_CARD    = RGBColor(0x14, 0x14, 0x1E)
C_RED     = RGBColor(0xF8, 0x71, 0x71)
C_ORANGE  = RGBColor(0xFB, 0x92, 0x3C)
C_YELLOW  = RGBColor(0xFA, 0xCC, 0x15)
C_GREEN   = RGBColor(0x34, 0xD3, 0x99)

W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
blank = prs.slide_layouts[6]  # completely blank

# ── Helpers ───────────────────────────────────────────

def add_slide():
    s = prs.slides.add_slide(blank)
    # dark background
    bg = s.background.fill
    bg.solid()
    bg.fore_color.rgb = C_DARK
    return s

def txbox(slide, text, x, y, w, h,
          size=24, bold=False, color=C_WHITE,
          font="Calibri", align=PP_ALIGN.LEFT,
          wrap=True):
    tf = slide.shapes.add_textbox(x, y, w, h).text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.color.rgb = color
    run.font.name  = font
    return tf

def rect(slide, x, y, w, h, fill=C_CARD, alpha=None, radius=False):
    shape = slide.shapes.add_shape(
        pptx.enum.shapes.MSO_SHAPE_TYPE.AUTO_SHAPE if False else 1,  # rectangle
        x, y, w, h
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()  # no border
    return shape

def pill(slide, text, x, y, size=10, bg=C_PRIMARY, tc=C_WHITE):
    """Small rounded label."""
    w = Inches(1.8); h = Inches(0.32)
    r = rect(slide, x, y, w, h, fill=bg)
    tf = r.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = text.upper()
    run.font.size  = Pt(size)
    run.font.bold  = True
    run.font.color.rgb = tc
    run.font.name  = "Calibri"
    return r

def card(slide, x, y, w, h, label, label_color, title, body, title_size=18):
    r = rect(slide, x, y, w, h, fill=C_CARD)
    # label
    txbox(slide, label, x+Inches(.2), y+Inches(.2), w-Inches(.4), Inches(.3),
          size=9, bold=True, color=label_color)
    # title
    txbox(slide, title, x+Inches(.2), y+Inches(.55), w-Inches(.4), Inches(.45),
          size=title_size, bold=True, color=C_WHITE)
    # body
    txbox(slide, body, x+Inches(.2), y+Inches(1.05), w-Inches(.4), h-Inches(1.25),
          size=11, color=C_MUTED)

def watermark(slide):
    txbox(slide, "Whiter.ai", W-Inches(1.5), H-Inches(.5), Inches(1.4), Inches(.4),
          size=11, bold=True, color=RGBColor(0x25,0x25,0x35), align=PP_ALIGN.RIGHT)

def eyebrow(slide, text):
    pill(slide, text, Inches(.75), Inches(.55), size=9,
         bg=RGBColor(0x18,0x18,0x30), tc=C_ACCENT)

def note(slide, text):
    slide.notes_slide.notes_text_frame.text = text


# ═══════════════════════════════════════════════════════
# SLIDE 1 — COVER
# ═══════════════════════════════════════════════════════
s = add_slide()

# gradient-ish glow (large purple circle, low opacity via filled rect trick)
glow = rect(s, W-Inches(5), Inches(-1), Inches(6), Inches(6),
            fill=RGBColor(0x12,0x12,0x28))

eyebrow(s, "✦  ESMT SUSTAINABILITY BOOTCAMP 2026")

txbox(s, "The whiteboard that", Inches(.75), Inches(1.3), Inches(8), Inches(1.1),
      size=52, bold=True, color=C_WHITE, font="Calibri")
txbox(s, "writes itself.", Inches(.75), Inches(2.35), Inches(8), Inches(1.1),
      size=52, bold=True, color=C_PRIMARY, font="Calibri")

txbox(s,
      "Speak freely. Whiter.ai listens and instantly generates\n"
      "synchronized, contextual slides from your words — in real time,\n"
      "on every screen in the room.",
      Inches(.75), Inches(3.6), Inches(7.5), Inches(1.2),
      size=16, color=C_MUTED)

txbox(s, "⬤  Live demo running during this pitch",
      Inches(.75), Inches(5.1), Inches(5), Inches(.4),
      size=12, color=RGBColor(0x64,0x74,0x8B))

watermark(s)
note(s, "SPEAKER 1 (Gautier) — Start Whiter.ai session BEFORE stepping up. Put board URL on screen.")


# ═══════════════════════════════════════════════════════
# SLIDE 2 — PROBLEM
# ═══════════════════════════════════════════════════════
s = add_slide()
eyebrow(s, "THE PROBLEM")

txbox(s, "Slides were never the point.", Inches(.75), Inches(1.2), Inches(11), Inches(.85),
      size=38, bold=True, color=C_WHITE)
txbox(s, "Yet they eat all the time.", Inches(.75), Inches(2.0), Inches(11), Inches(.75),
      size=38, bold=True, color=C_PRIMARY)

CW = Inches(3.8)
CH = Inches(2.8)
GAP = Inches(0.22)
Y  = Inches(3.05)

card(s, Inches(.75),        Y, CW, CH,
     "TIME WASTED", C_RED,
     "2.5×",
     "Hours spent building a deck for every 1 hour spent presenting it.", 32)

card(s, Inches(.75)+CW+GAP, Y, CW, CH,
     "DISCONNECT", C_ORANGE,
     "Dead on arrival",
     "A static deck is outdated the moment you open your mouth. Words and slides are never in sync.")

card(s, Inches(.75)+2*(CW+GAP), Y, CW, CH,
     "NO SUPPORT", C_YELLOW,
     "Solo founders & SMEs",
     "No design team, no agency. The person with the best ideas spends Sunday nights on PowerPoint.")

watermark(s)
note(s, "SPEAKER 1 — Emphasise the last card. 'If you've been that person on a Sunday night, this is for you.'")


# ═══════════════════════════════════════════════════════
# SLIDE 3 — SOLUTION
# ═══════════════════════════════════════════════════════
s = add_slide()
eyebrow(s, "THE SOLUTION")

txbox(s, "Speak. AI listens.", Inches(.75), Inches(1.2), Inches(10), Inches(.8),
      size=40, bold=True, color=C_WHITE)
txbox(s, "Slides appear.", Inches(.75), Inches(1.95), Inches(10), Inches(.75),
      size=40, bold=True, color=C_PRIMARY)

steps = [
    ("1", "You speak — we transcribe in real time",
     "Deepgram nova-2 captures your speech with sub-200ms latency. Every word, every language."),
    ("2", "AI extracts what matters",
     "Groq + Llama 3.1 understands context, not just keywords. It surfaces metrics, decisions, insights — and discards filler."),
    ("3", "Slides push to every screen instantly",
     "Audience opens a URL. No app, no install. Cards appear synchronized with your speech — on any device in the room."),
]

for i, (num, title, body) in enumerate(steps):
    y = Inches(3.0) + i * Inches(1.2)
    # circle number
    circ = rect(s, Inches(.75), y+Inches(.05), Inches(.55), Inches(.55), fill=C_PRIMARY)
    txbox(s, num, Inches(.75), y, Inches(.55), Inches(.6),
          size=14, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
    txbox(s, title, Inches(1.45), y, Inches(5.5), Inches(.38),
          size=14, bold=True, color=C_WHITE)
    txbox(s, body, Inches(1.45), y+Inches(.38), Inches(10.5), Inches(.7),
          size=11, color=C_MUTED)

watermark(s)
note(s, "SPEAKER 2 — Keep it fast, you're setting up the demo.")


# ═══════════════════════════════════════════════════════
# SLIDE 4 — LIVE DEMO
# ═══════════════════════════════════════════════════════
s = add_slide()

# centre glow
rect(s, Inches(2.5), Inches(1), Inches(8), Inches(6), fill=RGBColor(0x0E,0x0E,0x22))

eyebrow(s, "LIVE DEMO")

txbox(s, "This is running right now.", Inches(.75), Inches(1.5), Inches(11.8), Inches(.9),
      size=44, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
txbox(s, "right now.", Inches(.75), Inches(2.35), Inches(11.8), Inches(.8),
      size=44, bold=True, color=C_PRIMARY, align=PP_ALIGN.CENTER)

txbox(s,
      "Open the URL below on your phone.\nWatch what happens as we keep talking.",
      Inches(.75), Inches(3.0), Inches(11.8), Inches(.8),
      size=16, color=C_MUTED, align=PP_ALIGN.CENTER)

box = rect(s, Inches(3.5), Inches(4.0), Inches(6.3), Inches(1.6), fill=C_CARD)
txbox(s, "⬤  Live session active",
      Inches(3.5), Inches(4.1), Inches(6.3), Inches(.4),
      size=11, color=RGBColor(0x64,0x74,0x8B), align=PP_ALIGN.CENTER)
txbox(s, "whiter.ai/?board=<replace-with-live-url>",
      Inches(3.5), Inches(4.5), Inches(6.3), Inches(.5),
      size=13, bold=True, color=C_ACCENT, align=PP_ALIGN.CENTER)
txbox(s, "← paste real URL here before presenting",
      Inches(3.5), Inches(5.0), Inches(6.3), Inches(.35),
      size=9, color=RGBColor(0x47,0x55,0x69), align=PP_ALIGN.CENTER)

watermark(s)
note(s, "SPEAKER 3 — Replace URL with real board URL before going on stage. PAUSE 5 seconds after showing it. Say nothing. Let the room open it.")


# ═══════════════════════════════════════════════════════
# SLIDE 5 — MARKET
# ═══════════════════════════════════════════════════════
s = add_slide()
eyebrow(s, "MARKET OPPORTUNITY")

txbox(s, "A $50B market", Inches(.75), Inches(1.2), Inches(10), Inches(.8),
      size=40, bold=True, color=C_WHITE)
txbox(s, "frozen in 1987.", Inches(.75), Inches(1.95), Inches(10), Inches(.75),
      size=40, bold=True, color=C_PRIMARY)

CW2 = Inches(3.8)
CH2 = Inches(2.5)
Y2  = Inches(3.05)

for i, (val, desc) in enumerate([
    ("300M+",  "Knowledge workers who present regularly"),
    ("$50B",   "Presentation software market — dominated by PowerPoint, unchanged since 1987"),
    ("Day 1",  "SME founders, consultants, coaches — solo presenters with no slide support"),
]):
    x = Inches(.75) + i * (CW2 + GAP)
    r = rect(s, x, Y2, CW2, CH2, fill=C_CARD)
    txbox(s, val, x+Inches(.2), Y2+Inches(.2), CW2-Inches(.4), Inches(.8),
          size=36, bold=True, color=C_PRIMARY)
    txbox(s, desc, x+Inches(.2), Y2+Inches(1.1), CW2-Inches(.4), CH2-Inches(1.2),
          size=11, color=C_MUTED)

txbox(s, "Beachhead → SME sales teams & consultants  ·  Expand → enterprise meeting rooms  ·  Platform → real-time knowledge capture",
      Inches(.75), H-Inches(1.1), Inches(11.8), Inches(.4),
      size=10, color=RGBColor(0x47,0x55,0x69))

watermark(s)
note(s, "SPEAKER 4 — Land the '1987' line hard. PowerPoint launched in 1987.")


# ═══════════════════════════════════════════════════════
# SLIDE 6 — BUSINESS MODEL
# ═══════════════════════════════════════════════════════
s = add_slide()
eyebrow(s, "BUSINESS MODEL")

txbox(s, "SaaS.  Simple pricing.", Inches(.75), Inches(1.2), Inches(10), Inches(.8),
      size=40, bold=True, color=C_WHITE)

tiers = [
    ("FREE",  "€0",    C_MUTED,   ["5 sessions / month", "Audience board", "Session export (HTML)"]),
    ("PRO ✦", "€29/mo", C_ACCENT, ["Unlimited sessions", "Custom branding", "8 languages", "PDF / HTML export"]),
    ("TEAM",  "€99/mo", C_WHITE,  ["Up to 10 seats", "Shared boards", "Analytics dashboard", "API access"]),
]

TW = Inches(3.8)
TH = Inches(3.8)
TY = Inches(2.3)

for i, (name, price, tc, features) in enumerate(tiers):
    x = Inches(.75) + i * (TW + GAP)
    bg = RGBColor(0x14,0x14,0x2A) if name == "PRO ✦" else C_CARD
    r = rect(s, x, TY, TW, TH, fill=bg)
    txbox(s, name, x+Inches(.2), TY+Inches(.2), TW-Inches(.4), Inches(.35),
          size=10, bold=True, color=tc)
    txbox(s, price, x+Inches(.2), TY+Inches(.55), TW-Inches(.4), Inches(.7),
          size=28, bold=True, color=C_WHITE if name != "PRO ✦" else C_PRIMARY)
    for j, feat in enumerate(features):
        txbox(s, f"→  {feat}", x+Inches(.2), TY+Inches(1.35)+j*Inches(.48),
              TW-Inches(.4), Inches(.45), size=11, color=C_MUTED)

watermark(s)
note(s, "SPEAKER 4 — 'Free gets them in. Pro pays the bills. Team is where the margin lives.'")


# ═══════════════════════════════════════════════════════
# SLIDE 7 — TRACTION
# ═══════════════════════════════════════════════════════
s = add_slide()
eyebrow(s, "TRACTION")

txbox(s, "Built in 48 hours.", Inches(.75), Inches(1.2), Inches(10), Inches(.75),
      size=40, bold=True, color=C_WHITE)
txbox(s, "Already working.", Inches(.75), Inches(1.9), Inches(10), Inches(.7),
      size=40, bold=True, color=C_PRIMARY)

# Left card — what we shipped
LW = Inches(5.8); LH = Inches(3.6); LY = Inches(2.9)
rect(s, Inches(.75), LY, LW, LH, fill=C_CARD)
txbox(s, "WHAT WE SHIPPED", Inches(.95), LY+Inches(.2), LW-Inches(.4), Inches(.3),
      size=9, bold=True, color=C_ACCENT)
shipped = [
    "Live transcription (Deepgram nova-2)",
    "AI slide generation (Groq / Llama 3.1)",
    "Real-time audience board (URL sharing)",
    "Session export (HTML download)",
    "8 languages + demo fallback mode",
    "Landing page + waitlist — live",
]
for j, item in enumerate(shipped):
    txbox(s, f"→  {item}", Inches(.95), LY+Inches(.6)+j*Inches(.48),
          LW-Inches(.4), Inches(.45), size=11, color=C_MUTED)

# Right card — next 90 days
RX = Inches(.75)+LW+GAP
rect(s, RX, LY, LW, LH, fill=C_CARD)
txbox(s, "NEXT 90 DAYS", RX+Inches(.2), LY+Inches(.2), LW-Inches(.4), Inches(.3),
      size=9, bold=True, color=C_GREEN)
next90 = [
    "10 pilot customers (consultants / coaches)",
    "Custom branding + team boards",
    "Mobile-optimised audience view",
    "First €1K MRR",
]
for j, item in enumerate(next90):
    txbox(s, f"→  {item}", RX+Inches(.2), LY+Inches(.6)+j*Inches(.48),
          LW-Inches(.4), Inches(.45), size=11, color=C_MUTED)

watermark(s)
note(s, "SPEAKER 5 — 'We built this in 48 hours. Imagine what 90 days with real users looks like.'")


# ═══════════════════════════════════════════════════════
# SLIDE 8 — TEAM
# ═══════════════════════════════════════════════════════
s = add_slide()
eyebrow(s, "THE TEAM")

txbox(s, "Five builders.", Inches(.75), Inches(1.2), Inches(10), Inches(.75),
      size=40, bold=True, color=C_WHITE)
txbox(s, "One shared obsession.", Inches(.75), Inches(1.9), Inches(10), Inches(.7),
      size=40, bold=True, color=C_PRIMARY)

members = [
    ("G", "Gautier",     "Product & Vision"),
    ("?", "Teammate 2",  "Add role"),
    ("?", "Teammate 3",  "Add role"),
    ("?", "Teammate 4",  "Add role"),
    ("?", "Teammate 5",  "Add role"),
]

MW = Inches(2.2); MH = Inches(2.4); MY = Inches(3.0)
for i, (initial, name, role) in enumerate(members):
    x = Inches(.75) + i * (MW + Inches(.22))
    r = rect(s, x, MY, MW, MH, fill=C_CARD)
    # avatar circle (rectangle as stand-in)
    circ = rect(s, x+Inches(.65), MY+Inches(.2), Inches(.9), Inches(.9), fill=C_PRIMARY)
    txbox(s, initial, x+Inches(.65), MY+Inches(.2), Inches(.9), Inches(.9),
          size=18, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
    txbox(s, name, x+Inches(.1), MY+Inches(1.25), MW-Inches(.2), Inches(.4),
          size=12, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
    txbox(s, role, x+Inches(.1), MY+Inches(1.65), MW-Inches(.2), Inches(.5),
          size=10, color=C_MUTED, align=PP_ALIGN.CENTER)

txbox(s, "Built at ESMT Berlin Sustainability Bootcamp · March 2026",
      Inches(.75), H-Inches(.95), Inches(11.8), Inches(.35),
      size=10, color=RGBColor(0x47,0x55,0x69))

watermark(s)
note(s, "EACH PERSON — say your name and one sentence about what you contributed.")


# ═══════════════════════════════════════════════════════
# SLIDE 9 — VISION / ASK
# ═══════════════════════════════════════════════════════
s = add_slide()

rect(s, Inches(-1), Inches(-1), Inches(8), Inches(9), fill=RGBColor(0x0C,0x0C,0x1A))

eyebrow(s, "THE VISION")

txbox(s, '"The future meeting', Inches(.75), Inches(1.4), Inches(11), Inches(.85),
      size=42, bold=True, color=C_WHITE)
txbox(s, 'has no deck.', Inches(.75), Inches(2.2), Inches(11), Inches(.85),
      size=42, bold=True, color=C_WHITE)
txbox(s, 'Just conversation."', Inches(.75), Inches(3.0), Inches(11), Inches(.85),
      size=42, bold=True, color=C_PRIMARY)

txbox(s,
      "We're looking for early pilot partners and people who present for a living.\n"
      "If that's you — talk to us after this.",
      Inches(.75), Inches(4.1), Inches(8), Inches(.9),
      size=15, color=C_MUTED)

# Ask boxes
for i, (label, val) in enumerate([
    ("WE WANT",    "10 pilot users by April"),
    ("TRY IT NOW", "whiter.ai — waitlist open"),
]):
    bx = Inches(.75) + i * Inches(3.2)
    r = rect(s, bx, Inches(5.25), Inches(3.0), Inches(1.0), fill=RGBColor(0x14,0x14,0x2A))
    txbox(s, label, bx+Inches(.2), Inches(5.3), Inches(2.7), Inches(.3),
          size=8, bold=True, color=C_ACCENT)
    txbox(s, val,   bx+Inches(.2), Inches(5.62), Inches(2.7), Inches(.45),
          size=13, bold=True, color=C_WHITE)

watermark(s)
note(s, "GAUTIER — Close it. Pause on 'no deck. Just conversation.' Then smile. Done.")


# ── Save ──────────────────────────────────────────────
out = "/Users/gautierserres/Downloads/launchpad-main/docs/Whiter_ai_Pitch.pptx"
prs.save(out)
print(f"Saved: {out}")
