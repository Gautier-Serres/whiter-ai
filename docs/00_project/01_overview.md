# Project Overview

## Your Startup

**Startup Name**: Whiter.ai
**Tagline**: The whiteboard that writes itself.
**Problem**: Meeting leaders and speakers struggle to keep audiences engaged. Static slides prepared in advance can't keep up with the natural flow of a conversation, forcing speakers to either over-prepare or lose their audience's attention.
**Solution**: SlideMind listens to the speaker in real time and instantly generates synchronized, contextual slides from their spoken words — no prep, no friction, full engagement.
**Target Customer**: Meeting facilitators, keynote speakers, workshop leaders, educators, and team leads who present frequently and want to captivate their audience without the overhead of manual slide creation.

## What You're Building

A landing page for your startup with:
1. A hero section that communicates your value proposition
2. A features/benefits section
3. A waiting list signup form that works (submits to a backend API)
4. A thank-you response after submission

This is a real, deployable website — not a mockup.

## Design Direction

### Archetype

**Archetype**: Bold
**Heading Font**: Space Grotesk
**Body Font**: Inter
**Mode**: Dark
**Primary Color**: #6366F1 (indigo)
**Accent Color**: #A78BFA (violet — for highlights, badges, hover states)
**Border Radius**: soft (rounded-xl)
**Shadow Style**: strong (shadow-lg)

### Inspiration

**Reference site**: Linear.app, Vercel
**Design traits to borrow**:
- Color palette: deep dark background (#0A0A0F) with white text, indigo/violet gradients
- Typography: bold condensed headings, clean light body text
- Layout: full-bleed hero with animated demo, alternating sections, generous whitespace
- Visual style: subtle mesh gradients, glowing card borders, dark glassmorphism panels
- CTA style: indigo pill button with violet hover glow

## Tech Stack (Fixed)

- React + Tailwind CSS frontend (via Vite)
- Python + FastAPI backend
- pytest for API tests, Vitest + React Testing Library for frontend tests
- Auto-generated API docs at `/docs`
