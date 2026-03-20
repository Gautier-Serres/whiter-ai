# Phase 3: MVP — Live Meeting Whiteboard

Whiter.ai listens to the speaker, and every time they pause, a new slide card is generated and stacked on the board in real time.

## What the user sees

1. Click **"Start Session"** — microphone activates, board is empty
2. Speak naturally — a subtle waveform shows the mic is listening
3. On each sentence pause → a slide card animates in and stacks on the board
4. Cards accumulate as the meeting progresses, building a visual record

## Frontend

- New route/page: `/session` — full-screen whiteboard experience
- Left panel: speaker controls (mic button, live waveform, last transcript line)
- Right panel: stacking slide cards, newest at top
- Each card has: category badge + icon, title, 2-3 key bullet points, timestamp
- Card entrance animation: slides in from the right with a subtle fade
- Uses Web Speech API (`SpeechRecognition`) — Chrome only, no backend needed for transcription
- On sentence final result → POST to `/api/generate-slide` → animate new card in

## Backend

- `POST /api/generate-slide`
  - Input: `{ "transcript": "string" }`
  - Output: `{ "title": "string", "points": ["string"], "category": "string", "icon": "string" }`
  - Logic: smart text analysis — extract title, key points, detect category (Strategy, Finance, Product, Team, Vision, Operations)
  - No external API — pure Python heuristics

## What we're NOT building

- No user accounts or session persistence
- No real AI API calls (smart mock instead)
- No multi-device sync (single screen demo)
- No export or save functionality

## Demo script

1. Open `/session`, click "Start Session"
2. Say: *"Our Q4 revenue target is 2 million euros and we need to close 3 enterprise deals to get there"*
   → Card appears: **Finance** | "Q4 Revenue Target" | 2M€ goal · 3 enterprise deals · Q4 deadline
3. Say: *"The product team will launch the mobile app in October and the API in November"*
   → Card stacks: **Product** | "Upcoming Launches" | Mobile app · October · API · November
4. Say: *"We should promote Sarah to lead the Berlin office and hire two more engineers"*
   → Card stacks: **Team** | "Org Changes" | Sarah promotion · Berlin office · 2 engineer hires
