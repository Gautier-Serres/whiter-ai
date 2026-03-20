"""
Slide generation from speech transcript using Groq AI.
Falls back to heuristics if the API key is unavailable.
"""

import os
import json
import re
from groq import Groq

_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if api_key:
            _client = Groq(api_key=api_key)
    return _client


# ─── Groq-powered generation ──────────────────────────────────────────────────

BASE_SYSTEM_PROMPT = """You are a real-time meeting assistant. Extract the most important insight from a speech excerpt and return a concise slide as JSON.

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
- Title: capture the core subject specifically. Short and punchy.
- Points: only what actually matters. Skip filler. Max 3, can be fewer.
- "highlight" layout = one dominant insight. "metrics" = numbers dominate. "actions" = things to do. "standard" = default.
- topic_key helps detect duplicate topics — reuse the same key for similar topics."""


def build_system_prompt(context: str = None, subject: str = None) -> str:
    prompt = BASE_SYSTEM_PROMPT
    extras = []
    if subject:
        extras.append(f"Session topic: {subject}")
    if context:
        extras.append(
            f"Speaker's background briefing — for context ONLY. "
            f"Do NOT surface this as slide content unless the speaker explicitly mentions it in the excerpt below:\n{context}"
        )
    if extras:
        prompt += (
            "\n\nBackground context (use to understand terminology and relevance, "
            "but generate slide content ONLY from what the speaker actually says in the transcript):\n"
            + "\n".join(extras)
        )
    return prompt


def generate_with_groq(transcript: str, context: str = None, subject: str = None) -> dict | None:
    client = get_client()
    if not client:
        return None
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=300,
            temperature=0.3,
            messages=[
                {"role": "system", "content": build_system_prompt(context, subject)},
                {"role": "user", "content": f"Speech excerpt:\n\"{transcript}\""},
            ],
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)

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


# ─── Term lookup (for audience highlight feature) ─────────────────────────────

def lookup_term(term: str) -> str:
    client = get_client()
    if not client:
        return f"Definition unavailable — AI not configured."
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=120,
            temperature=0.1,
            messages=[{
                "role": "user",
                "content": (
                    f"In exactly 1-2 short sentences, explain what '{term}' means "
                    f"in a business or professional context. Be direct and factual."
                ),
            }],
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return "Definition unavailable."


# ─── Fallback heuristics ──────────────────────────────────────────────────────

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

    scores = {cat: sum(1 for kw in data["keywords"] if kw in lower) for cat, data in CATEGORIES.items()}
    category = max(scores, key=scores.get) if any(scores.values()) else "Strategy"

    tokens = re.findall(r"\b[a-zA-Z][a-zA-Z0-9]*\b", text)
    meaningful = [w for w in tokens if w.lower() not in STOPWORDS and len(w) > 2]
    title = " ".join(w.title() for w in meaningful[:4]) if meaningful else f"{category} Update"

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

def generate_slide(transcript: str, context: str = None, subject: str = None) -> dict:
    result = generate_with_groq(transcript, context=context, subject=subject)
    if result:
        return result
    return generate_fallback(transcript)
