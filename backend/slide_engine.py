"""
Slide generation from speech transcript using Claude AI.
Falls back to heuristics if the API key is unavailable.
"""

import os
import json
import re
import anthropic

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if api_key:
            _client = anthropic.Anthropic(api_key=api_key)
    return _client


# ─── Claude-powered generation ────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a real-time meeting assistant. Your job is to extract the most important insight from a speech excerpt and turn it into a concise slide.

Return ONLY valid JSON with this exact structure:
{
  "title": "Short punchy title, max 5 words",
  "points": ["Key point 1", "Key point 2", "Key point 3"],
  "category": "one of: Finance | Product | Team | Strategy | Vision | Operations",
  "sub_category": "more specific label, e.g. Revenue, Hiring, Launch, Risk, Deadline",
  "layout": "one of: standard | highlight | metrics | actions",
  "topic_key": "category::2-3 core keywords joined by colons"
}

Rules:
- Title: capture the core subject, not just random words. Short and specific.
- Points: only what actually matters. Skip filler. Max 3 points, can be fewer.
- Use "highlight" layout when there is one single dominant insight.
- Use "metrics" layout when numbers/figures dominate.
- Use "actions" layout when the speech describes things to do.
- Use "standard" otherwise.
- topic_key helps detect duplicate topics — use the same key for similar topics."""


def generate_with_claude(transcript: str) -> dict | None:
    client = get_client()
    if not client:
        return None
    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": f"Speech excerpt:\n\"{transcript}\""}
            ],
        )
        raw = message.content[0].text.strip()
        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)

        # Ensure required fields exist
        return {
            "title": str(data.get("title", "Key Insight")),
            "points": list(data.get("points", []))[:3],
            "category": data.get("category", "Strategy"),
            "sub_category": data.get("sub_category", data.get("category", "Strategy")),
            "icon": CATEGORY_ICONS.get(data.get("category", "Strategy"), "Target"),
            "layout": data.get("layout", "standard"),
            "topic_key": data.get("topic_key", "strategy::insight"),
        }
    except Exception:
        return None


# ─── Fallback heuristics (used when no API key) ───────────────────────────────

CATEGORY_ICONS = {
    "Finance": "TrendingUp",
    "Product": "Layers",
    "Team": "Users",
    "Strategy": "Target",
    "Vision": "Sparkles",
    "Operations": "Settings",
}

CATEGORIES = {
    "Finance": {
        "keywords": ["revenue", "profit", "cost", "budget", "million", "billion", "euros", "dollars",
                     "percent", "%", "margin", "growth", "target", "forecast", "quarter", "q1", "q2",
                     "q3", "q4", "funding", "investment", "raise", "series", "valuation", "burn", "arr", "mrr"],
    },
    "Product": {
        "keywords": ["launch", "release", "feature", "app", "mobile", "api", "platform", "build",
                     "develop", "ship", "deploy", "version", "update", "roadmap", "beta", "integration",
                     "design", "ux", "bug", "fix"],
    },
    "Team": {
        "keywords": ["hire", "hiring", "team", "engineer", "developer", "manager", "lead", "promote",
                     "promotion", "onboard", "headcount", "recruit", "talent", "office", "remote",
                     "culture", "people", "staff", "employee"],
    },
    "Strategy": {
        "keywords": ["strategy", "strategic", "plan", "goal", "objective", "okr", "kpi", "priority",
                     "focus", "initiative", "partnership", "competitor", "market", "expand", "risk", "pivot"],
    },
    "Vision": {
        "keywords": ["vision", "mission", "purpose", "future", "dream", "aspire", "transform",
                     "impact", "believe", "inspire"],
    },
    "Operations": {
        "keywords": ["process", "workflow", "deadline", "timeline", "milestone", "delivery", "project",
                     "sprint", "agile", "schedule", "logistics", "legal", "compliance", "security"],
    },
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "from", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did",
    "will", "would", "could", "should", "may", "might", "that", "this", "it", "its", "we", "our",
    "they", "i", "my", "you", "your", "so", "just", "also", "not", "no", "get", "going",
}


def generate_fallback(transcript: str) -> dict:
    text = transcript.strip()
    lower = text.lower()

    # Category
    scores = {cat: sum(1 for kw in data["keywords"] if kw in lower) for cat, data in CATEGORIES.items()}
    category = max(scores, key=scores.get) if any(scores.values()) else "Strategy"

    # Title
    tokens = re.findall(r"\b[a-zA-Z][a-zA-Z0-9]*\b", text)
    meaningful = [w for w in tokens if w.lower() not in STOPWORDS and len(w) > 2]
    title = " ".join(w.title() for w in meaningful[:4]) if meaningful else f"{category} Update"

    # Points
    clauses = re.split(r"[,;]|\s+and\s+|\s+but\s+", text, flags=re.I)
    points = []
    for c in clauses:
        c = re.sub(r"^(we|i|our|the|a|an)\s+", "", c.strip(), flags=re.I).strip().rstrip(".")
        if len(c) > 8:
            points.append(c[0].upper() + c[1:])
        if len(points) == 3:
            break
    if not points:
        points = ["Key insight captured"]

    return {
        "title": title,
        "points": points,
        "category": category,
        "sub_category": category,
        "icon": CATEGORY_ICONS.get(category, "Target"),
        "layout": "standard",
        "topic_key": f"{category}::fallback",
    }


# ─── Main entry point ─────────────────────────────────────────────────────────

def generate_slide(transcript: str) -> dict:
    result = generate_with_claude(transcript)
    if result:
        return result
    return generate_fallback(transcript)
