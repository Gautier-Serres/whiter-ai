"""
Smart slide generation from speech transcript.
No external APIs — pure heuristics.
"""

import re

# ─── Category detection ───────────────────────────────────────────────────────

CATEGORIES = {
    "Finance": {
        "keywords": [
            "revenue", "profit", "cost", "budget", "million", "billion", "thousand",
            "euros", "dollars", "percent", "%", "margin", "growth", "target", "forecast",
            "quarter", "q1", "q2", "q3", "q4", "annual", "fiscal", "funding", "investment",
            "raise", "series", "valuation", "burn", "runway", "arr", "mrr",
        ],
        "icon": "TrendingUp",
    },
    "Product": {
        "keywords": [
            "launch", "release", "feature", "app", "mobile", "api", "platform",
            "build", "develop", "ship", "deploy", "version", "update", "roadmap",
            "beta", "integration", "design", "ux", "user", "interface", "bug", "fix",
        ],
        "icon": "Layers",
    },
    "Team": {
        "keywords": [
            "hire", "hiring", "team", "engineer", "developer", "manager", "lead",
            "promote", "promotion", "onboard", "headcount", "recruit", "talent",
            "office", "remote", "culture", "hr", "people", "staff", "employee",
        ],
        "icon": "Users",
    },
    "Strategy": {
        "keywords": [
            "strategy", "strategic", "plan", "goal", "objective", "okr", "kpi",
            "priority", "focus", "initiative", "partnership", "competitor", "market",
            "expand", "expansion", "opportunity", "risk", "pivot", "direction",
        ],
        "icon": "Target",
    },
    "Vision": {
        "keywords": [
            "vision", "mission", "purpose", "future", "dream", "aspire", "transform",
            "change", "impact", "world", "believe", "north star", "inspire", "movement",
        ],
        "icon": "Sparkles",
    },
    "Operations": {
        "keywords": [
            "process", "workflow", "deadline", "timeline", "milestone", "delivery",
            "project", "sprint", "agile", "meeting", "schedule", "logistics", "supply",
            "vendor", "contract", "legal", "compliance", "security", "infrastructure",
        ],
        "icon": "Settings",
    },
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "that",
    "this", "these", "those", "it", "its", "we", "our", "they", "their",
    "i", "my", "you", "your", "he", "she", "his", "her", "up", "out",
    "so", "if", "as", "than", "then", "just", "also", "not", "no",
}


def detect_category(text: str) -> tuple[str, str]:
    lower = text.lower()
    scores = {}
    for category, data in CATEGORIES.items():
        score = sum(1 for kw in data["keywords"] if kw in lower)
        if score > 0:
            scores[category] = score
    if not scores:
        return "Strategy", "Target"
    best = max(scores, key=scores.get)
    return best, CATEGORIES[best]["icon"]


# ─── Title extraction ─────────────────────────────────────────────────────────

def extract_title(text: str, category: str) -> str:
    # Look for quoted terms or capitalized phrases first
    quoted = re.findall(r'"([^"]+)"', text)
    if quoted:
        return quoted[0].title()

    # Extract meaningful tokens (non-stopword, length > 2)
    words = re.findall(r"\b[a-zA-Z][a-zA-Z0-9]*\b", text)
    meaningful = [w for w in words if w.lower() not in STOPWORDS and len(w) > 2]

    # Extract numbers with context (e.g. "2 million euros", "40 percent")
    numbers = re.findall(r"\d+[\.,]?\d*\s*(?:million|billion|thousand|percent|%|euros?|dollars?)?", text, re.I)

    # Build title from category + top content words
    if category == "Finance" and numbers:
        # Use first number + surrounding context
        num = numbers[0].strip()
        context_words = meaningful[:3]
        title_words = context_words[:2] + [num] if num not in " ".join(context_words) else context_words[:3]
        return " ".join(title_words[:4]).title()

    if meaningful:
        # Take the first 3-4 meaningful words as title
        title = " ".join(meaningful[:4]).title()
        return title

    return category + " Update"


# ─── Key points extraction ─────────────────────────────────────────────────────

def extract_points(text: str) -> list[str]:
    points = []

    # Split by conjunctions, commas, and semicolons into clauses
    clauses = re.split(r"\s+and\s+|\s+but\s+|\s+also\s+|,\s*|;\s*", text, flags=re.I)
    clauses = [c.strip() for c in clauses if len(c.strip()) > 8]

    for clause in clauses[:4]:
        # Remove filler words at start
        clause = re.sub(r"^(we|i|our|the|a|an)\s+", "", clause, flags=re.I)
        clause = clause.strip().rstrip(".")

        # Capitalize first letter
        if clause:
            clause = clause[0].upper() + clause[1:]
            points.append(clause)

    # Fallback: extract noun phrases with numbers
    if not points:
        numbers = re.findall(r"\d+[\.,]?\d*\s*(?:million|billion|thousand|percent|%|euros?|dollars?|engineers?|deals?)?", text, re.I)
        words = re.findall(r"\b[A-Z][a-zA-Z]+\b", text)
        if numbers:
            points.append(numbers[0].strip().title())
        if words:
            points.extend(words[:2])

    return points[:3] if points else ["Key insight captured"]


# ─── Main entry point ─────────────────────────────────────────────────────────

def generate_slide(transcript: str) -> dict:
    text = transcript.strip()
    category, icon = detect_category(text)
    title = extract_title(text, category)
    points = extract_points(text)

    return {
        "title": title,
        "points": points,
        "category": category,
        "icon": icon,
    }
