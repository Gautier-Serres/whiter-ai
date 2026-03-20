"""
Smart slide generation from speech transcript.
Improvements: smart titles, metric extraction, action detection,
sub-categories, variable layouts, topic keys for deduplication.
"""

import re

# ─── Category & sub-category config ──────────────────────────────────────────

CATEGORIES = {
    "Finance": {
        "icon": "TrendingUp",
        "sub": [
            ("Funding",  ["raise", "series", "investment", "investor", "runway", "burn", "valuation", "funded"]),
            ("Revenue",  ["revenue", "sales", "arr", "mrr", "churn", "ltv"]),
            ("Budget",   ["budget", "cost", "spend", "expense", "margin", "profit"]),
            ("Metrics",  ["percent", "%", "growth", "target", "forecast", "kpi", "quarter", "q1", "q2", "q3", "q4"]),
        ],
        "keywords": [
            "revenue", "profit", "cost", "budget", "million", "billion", "thousand",
            "euros", "dollars", "percent", "%", "margin", "growth", "target", "forecast",
            "quarter", "q1", "q2", "q3", "q4", "annual", "fiscal", "funding", "investment",
            "raise", "series", "valuation", "burn", "runway", "arr", "mrr", "sales",
        ],
    },
    "Product": {
        "icon": "Layers",
        "sub": [
            ("Launch",   ["launch", "release", "ship", "deploy", "go live", "rollout", "release"]),
            ("Roadmap",  ["roadmap", "milestone", "backlog", "sprint", "version", "v2", "v3"]),
            ("Tech",     ["api", "bug", "fix", "integration", "infrastructure", "backend", "frontend", "platform"]),
            ("Design",   ["design", "ux", "ui", "interface", "prototype", "wireframe"]),
        ],
        "keywords": [
            "launch", "release", "feature", "app", "mobile", "api", "platform",
            "build", "develop", "ship", "deploy", "version", "update", "roadmap",
            "beta", "integration", "design", "ux", "user", "interface", "bug", "fix",
        ],
    },
    "Team": {
        "icon": "Users",
        "sub": [
            ("Hiring",   ["hire", "hiring", "recruit", "headcount", "talent", "onboard", "interview"]),
            ("People",   ["promote", "promotion", "lead", "manager", "office", "remote", "culture"]),
        ],
        "keywords": [
            "hire", "hiring", "team", "engineer", "developer", "manager", "lead",
            "promote", "promotion", "onboard", "headcount", "recruit", "talent",
            "office", "remote", "culture", "hr", "people", "staff", "employee",
        ],
    },
    "Strategy": {
        "icon": "Target",
        "sub": [
            ("Risk",        ["risk", "threat", "challenge", "concern", "blocker", "issue", "problem"]),
            ("Partnership", ["partner", "partnership", "deal", "contract", "vendor", "agreement"]),
            ("Market",      ["market", "competitor", "expand", "expansion", "segment", "positioning"]),
            ("Goals",       ["goal", "objective", "okr", "priority", "focus", "initiative"]),
        ],
        "keywords": [
            "strategy", "strategic", "plan", "goal", "objective", "okr", "kpi",
            "priority", "focus", "initiative", "partnership", "competitor", "market",
            "expand", "expansion", "opportunity", "risk", "pivot", "direction",
        ],
    },
    "Vision": {
        "icon": "Sparkles",
        "sub": [],
        "keywords": [
            "vision", "mission", "purpose", "future", "dream", "aspire", "transform",
            "change", "impact", "world", "believe", "north star", "inspire", "movement",
        ],
    },
    "Operations": {
        "icon": "Settings",
        "sub": [
            ("Deadline", ["deadline", "timeline", "schedule", "due", "by end", "delivery"]),
            ("Legal",    ["legal", "compliance", "gdpr", "regulation", "security", "privacy"]),
            ("Process",  ["process", "workflow", "agile", "logistics", "supply"]),
        ],
        "keywords": [
            "process", "workflow", "deadline", "timeline", "milestone", "delivery",
            "project", "sprint", "agile", "meeting", "schedule", "logistics", "supply",
            "vendor", "contract", "legal", "compliance", "security", "infrastructure",
        ],
    },
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "that",
    "this", "these", "those", "it", "its", "we", "our", "they", "their",
    "i", "my", "you", "your", "he", "she", "his", "her", "up", "out",
    "so", "if", "as", "than", "then", "just", "also", "not", "no", "going",
    "going", "need", "want", "think", "know", "get", "make", "use",
}

ACTION_VERBS = {
    "launch", "hire", "build", "deploy", "ship", "promote", "expand",
    "close", "raise", "sign", "merge", "acquire", "partner", "release",
    "migrate", "redesign", "restructure", "invest", "reduce", "increase",
    "cut", "grow", "scale", "pivot", "deliver", "complete", "implement",
}

METRIC_PATTERN = re.compile(
    r"""
    (?:
        (?:\d+[\.,]?\d*\s*(?:million|billion|thousand|k|m|b)?\s*(?:euros?|dollars?|£|€|\$)?) |
        (?:€|\$|£)\s*\d+[\.,]?\d*\s*(?:million|billion|thousand|k|m|b)? |
        (?:\d+[\.,]?\d*\s*(?:percent|%)) |
        (?:\d+[\.,]?\d*\s*(?:users?|customers?|deals?|engineers?|people|employees?|months?|weeks?|days?|years?))
    )
    """,
    re.IGNORECASE | re.VERBOSE,
)

DATE_PATTERN = re.compile(
    r"\b(?:january|february|march|april|may|june|july|august|september|october|november|december|"
    r"jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|"
    r"q[1-4]|h[12]|monday|tuesday|wednesday|thursday|friday|"
    r"next\s+(?:week|month|quarter|year)|end\s+of\s+(?:month|quarter|year)|"
    r"20\d\d)\b",
    re.IGNORECASE,
)


# ─── Category detection ───────────────────────────────────────────────────────

def detect_category(text: str) -> tuple[str, str, str]:
    """Returns (category, sub_category, icon)."""
    lower = text.lower()
    scores = {}
    for cat, data in CATEGORIES.items():
        score = sum(1 for kw in data["keywords"] if kw in lower)
        if score > 0:
            scores[cat] = score

    category = max(scores, key=scores.get) if scores else "Strategy"
    icon = CATEGORIES[category]["icon"]

    # Detect sub-category
    sub_category = category
    for sub_name, sub_kws in CATEGORIES[category]["sub"]:
        if any(kw in lower for kw in sub_kws):
            sub_category = sub_name
            break

    return category, sub_category, icon


# ─── Title extraction ─────────────────────────────────────────────────────────

def extract_title(text: str, category: str, sub_category: str) -> str:
    """Extract a short, punchy title — max 4 words."""

    # Named entities: capitalized multi-word sequences (e.g. "Sarah Chen", "Berlin Office")
    named = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b", text)
    if named:
        candidate = named[0]
        # Add sub-category context if it adds meaning
        if sub_category != category and sub_category.lower() not in candidate.lower():
            return f"{candidate}"
        return candidate

    # Metrics + label (e.g. "€2M Target", "40% Growth")
    metrics = METRIC_PATTERN.findall(text)
    if metrics:
        metric = metrics[0].strip()
        # Find the noun closest to this metric
        words = re.findall(r"\b[a-zA-Z]{3,}\b", text)
        nouns = [w for w in words if w.lower() not in STOPWORDS][:2]
        if nouns:
            return f"{metric.title()} {nouns[0].title()}"[:32]
        return f"{sub_category}: {metric.title()}"[:32]

    # Action verb + object (e.g. "Launch Mobile App")
    words = text.split()
    for i, word in enumerate(words):
        if word.lower() in ACTION_VERBS and i + 1 < len(words):
            obj_words = [w for w in words[i+1:i+4] if w.lower() not in STOPWORDS]
            if obj_words:
                return f"{word.title()} {' '.join(w.title() for w in obj_words[:2])}"

    # Top meaningful words
    tokens = re.findall(r"\b[a-zA-Z][a-zA-Z0-9]*\b", text)
    meaningful = [w for w in tokens if w.lower() not in STOPWORDS and len(w) > 2]
    if meaningful:
        return " ".join(w.title() for w in meaningful[:3])

    return f"{sub_category} Update"


# ─── Points extraction ────────────────────────────────────────────────────────

def extract_points(text: str) -> tuple[list[str], str]:
    """Returns (points, layout_hint)."""
    points = []

    # 1. Metrics first — always surface numbers
    metrics = METRIC_PATTERN.findall(text)
    dates = DATE_PATTERN.findall(text)
    metric_points = []
    for m in metrics[:2]:
        m = m.strip()
        # Find context around the metric
        idx = text.lower().find(m.lower())
        context_start = max(0, idx - 20)
        context_end = min(len(text), idx + len(m) + 20)
        snippet = text[context_start:context_end].strip()
        snippet = re.sub(r"^[^a-zA-Z0-9€$£]*", "", snippet)
        snippet = snippet.rstrip(".,;").strip()
        if snippet and len(snippet) > len(m):
            metric_points.append(snippet[:60])
        else:
            metric_points.append(m.title())
    if dates and len(metric_points) < 2:
        metric_points.append(dates[0].title())
    points.extend(metric_points)

    # 2. Action extraction
    action_points = []
    sentences = re.split(r"[,;]|\s+and\s+|\s+but\s+|\s+also\s+", text, flags=re.I)
    for clause in sentences:
        clause = clause.strip()
        words = clause.split()
        for i, word in enumerate(words):
            if word.lower() in ACTION_VERBS:
                obj = " ".join(words[i:i+5])
                obj = re.sub(r"^(we|i|our|the|to)\s+", "", obj, flags=re.I)
                obj = obj.strip().rstrip(".")
                if len(obj) > 4 and obj not in " ".join(points):
                    action_points.append(obj[0].upper() + obj[1:])
                break

    # 3. Clause splitting fallback
    clause_points = []
    if not action_points:
        clauses = re.split(r"[,;]|\s+and\s+|\s+but\s+|\s+also\s+", text, flags=re.I)
        for clause in clauses:
            clause = re.sub(r"^(we|i|our|the|a|an|they|it)\s+", "", clause.strip(), flags=re.I)
            clause = clause.strip().rstrip(".,")
            if len(clause) > 8:
                clause_points.append(clause[0].upper() + clause[1:])

    # Merge, deduplicate, cap at 3
    all_points = points + action_points + clause_points
    seen = set()
    final = []
    for p in all_points:
        key = p.lower()[:20]
        if key not in seen and len(p) > 3:
            seen.add(key)
            final.append(p[:80])
        if len(final) == 3:
            break

    if not final:
        final = ["Key insight captured"]

    # Layout selection
    if len(final) == 1:
        layout = "highlight"
    elif len(metric_points) >= 2:
        layout = "metrics"
    elif len(action_points) >= 2:
        layout = "actions"
    else:
        layout = "standard"

    return final, layout


# ─── Topic key for deduplication ─────────────────────────────────────────────

def make_topic_key(category: str, sub_category: str, text: str) -> str:
    """Short key used by frontend to detect near-duplicate topics."""
    tokens = re.findall(r"\b[a-zA-Z]{4,}\b", text.lower())
    top = [t for t in tokens if t not in STOPWORDS][:3]
    return f"{sub_category}::{':'.join(sorted(top))}"


# ─── Main entry point ─────────────────────────────────────────────────────────

def generate_slide(transcript: str) -> dict:
    text = transcript.strip()
    category, sub_category, icon = detect_category(text)
    title = extract_title(text, category, sub_category)
    points, layout = extract_points(text)
    topic_key = make_topic_key(category, sub_category, text)

    return {
        "title": title,
        "points": points,
        "category": category,
        "sub_category": sub_category,
        "icon": icon,
        "layout": layout,
        "topic_key": topic_key,
    }
