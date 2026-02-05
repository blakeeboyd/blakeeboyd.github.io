# Project Ideas

A collection of potential future tools and explorable explanations.

## Plus-Minus-Next

A reflection tool based on the "Plus Minus Next" framework from BJ Fogg's book *Tiny Habits*.

### How It Works
After completing a task, habit, or time period, the user reflects on three questions:
1. **Plus (+)**: What went well? What should I keep doing?
2. **Minus (-)**: What didn't work? What should I stop or change?
3. **Next**: What will I try next time? What's my iteration?

### Use Cases
- Daily reflection (end of day ritual)
- Post-project retrospective
- Habit tracking iteration
- Meeting debriefs
- Learning journal entries

### Features to Consider
- Simple three-column or three-section layout
- Optional timestamp for entries
- Export as markdown or plain text
- Local storage for history
- Pattern recognition across entries (what keeps showing up in minus?)

---

## Decision Journal

Track decisions and their outcomes over time to improve decision-making quality.

### Concept
- Record a decision before you know the outcome
- Note your reasoning, confidence level, alternatives considered
- Later: record the outcome and what you learned
- Over time: see patterns in your decision-making

---

## Weighted Criteria Matrix

An extension of Pairwise Matrix that adds weights to criteria.

### Difference from Pairwise
- Pairwise: "Is A better than B?" (binary, holistic)
- Weighted: "How does A score on criteria X, Y, Z?" (multi-factor, analytical)

### When to Use Which
- Pairwise: gut decisions, when you trust intuition, fewer than 10 items
- Weighted: analytical decisions, when you need to justify to others, complex tradeoffs

---

## Time Blocking Visualizer

See your calendar as blocks of focused time vs fragmented time.

### Concept
- Import calendar (iCal format) or manual entry
- Visualize: continuous blocks vs interrupted stretches
- Calculate: longest focus block, total fragmented time
- Suggest: which meetings could be moved to consolidate focus time

---

## Pomodoro with Purpose

Pomodoro timer that asks "why" before starting.

### Twist
- Before starting a pomodoro, user states: "I will work on X because Y"
- After pomodoro, quick reflection: "Did I stay focused? What distracted me?"
- Tracks focus quality over time, not just time elapsed

---

## Energy Mapping

Track energy levels throughout the day to find patterns.

### Concept
- Quick check-in: rate energy 1-5 at regular intervals
- Over days/weeks: visualize when energy peaks and dips
- Insight: schedule demanding tasks during natural high-energy times

---

## Language Learning Companion

A personalized language learning tool with AI-powered practice and spaced repetition.

### Problem
Traditional language learning apps lose effectiveness over time. Users struggle to maintain consistency, and generic curricula don't adapt to individual progress or interests.

### Concept
- AI designs a personalized learning program based on goals, current level, and available time
- Spaced repetition system (SRS) for vocabulary and grammar
- AI-generated audio for listening practice (text-to-speech or voice synthesis)
- Progress tracking with history of what's been learned
- Adaptive difficulty based on performance

### Features to Consider
- **Curriculum generation**: AI creates lesson plans tailored to user's goals (conversational, reading, business, etc.)
- **Vocabulary cards**: SRS-based flashcards with audio pronunciation
- **Listening exercises**: AI reads sentences/dialogues at appropriate difficulty
- **Speaking practice**: Record yourself, compare to native audio
- **Writing prompts**: Short exercises with AI feedback
- **Session history**: Track what was practiced, when, and how well
- **Streak/consistency tracking**: Gentle accountability without gamification overload

### Technical Possibilities
- **Gemini API integration**: Use existing Gemini subscription for generating lessons, providing feedback, and conversation practice
- **Web Speech API**: Browser-native speech synthesis for audio
- **IndexedDB/localStorage**: Store vocabulary, progress, and session history locally
- **Export/import**: Backup progress as JSON

### Initial Scope (Korean focus)
- Hangul reading/writing basics
- Core vocabulary with audio
- Simple sentence patterns
- Daily 5-10 minute sessions
