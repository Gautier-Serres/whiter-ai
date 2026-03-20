# Project Overview

## Your Startup

**Startup Name**: Whiter.ai
**Tagline**: AI-generated live visualization boards for meeting leaders
**Problem**: Attendees in B2B internal meetings struggle to follow free-form speech in real time — no visual structure means poor comprehension, disengagement, and missed opportunities to ask relevant questions.
**Solution**: Whiter.ai listens to live speech and instantly generates visual boards — summaries, key points, diagrams — that appear on screen in real time, so every attendee can follow along, stay engaged, and participate meaningfully.
**Target Customer**: B2B team leads and meeting organizers running internal company meetings (standups, planning sessions, strategy meetings) who need their teams to stay aligned and engaged.

## What You're Building

A landing page for your startup with:
1. A hero section that communicates your value proposition
2. A features/benefits section
3. A waiting list signup form that works (submits to a backend API)
4. A thank-you response after submission

This is a real, deployable website — not a mockup.

## Design Direction

### Archetype

**Archetype**: Corporate
**Heading Font**: Inter
**Body Font**: Inter
**Mode**: Light
**Primary Color**: #0F766E
**Accent Color**: #CCFBF1
**Border Radius**: soft (rounded-xl)
**Shadow Style**: subtle (shadow-sm)

### Inspiration

**Reference sites**: Revolut, Loom
**Design traits to borrow**:
- Bold, oversized capitalized headlines used as graphic design elements (Revolut)
- Generous whitespace and clean section-by-section structure (Loom)
- Teal primary (#0F766E) paired with mint accent (#CCFBF1) on a white/light-neutral (#F9FAFB) background
- Alternating section backgrounds for visual rhythm, deep neutrals (#F9FAFB) between white sections
- Video or animated demo embedded in the hero to show the product in action (Loom)
- Solid CTA button (primary teal) paired with ghost/outline secondary button hierarchy

## Tech Stack (Fixed)

- React + Tailwind CSS frontend (via Vite)
- Python + FastAPI backend
- pytest for API tests, Vitest + React Testing Library for frontend tests
- Auto-generated API docs at `/docs`
