# NYC Tap — Claude Code Context

## What This Is

A daily geography guessing game focused on New York City. Players read a clue about a famous NYC location (landmark, restaurant, historical site, or film/TV location) and tap the map to guess where it is. Score is based on distance from the correct answer.

Inspired by MapTap (maptap.gg) but scoped entirely to NYC.

---

## Project Structure

```
nyc-tap/
├── src/
│   ├── App.jsx                        # Root — renders <NYCTap />
│   ├── NYCTap.jsx                     # Main game component + SplashScreen
│   ├── main.jsx                       # Vite entry point
│   ├── index.css                      # Global styles + design tokens
│   ├── components/
│   │   ├── MapCanvas.jsx              # Leaflet map + click handler
│   │   ├── ClueCard.jsx               # Clue display with category badge
│   │   ├── ScorePopup.jsx             # Post-guess score + Next button
│   │   └── ResultsScreen.jsx          # End-of-game summary
│   ├── data/
│   │   └── locations.js               # Location database (20 entries)
│   └── utils/
│       └── geo.js                     # haversine() + scoreFromDistance()
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## Location Data Format

```js
{
  id: 1,
  name: "Katz's Delicatessen",
  clue: "...",          // hint shown — never includes the name
  category: "food",     // "landmark" | "food" | "history" | "film"
  lat: 40.7223,
  lng: -73.9873,
}
```

### Category colors

| Category | Color            |
|----------|------------------|
| landmark | #F59E0B (amber)  |
| food     | #EF4444 (red)    |
| history  | #8B5CF6 (purple) |
| film     | #10B981 (green)  |

---

## Scoring Logic (`src/utils/geo.js`)

| Distance  | Points |
|-----------|--------|
| < 0.5 km  | 1000   |
| < 1 km    | 900    |
| < 2 km    | 750    |
| < 5 km    | 500    |
| < 10 km   | 250    |
| < 20 km   | 100    |
| ≥ 20 km   | 0      |

Max score per game: `ROUNDS × 1000` (currently 5 rounds = 5000)

---

## Map Implementation

Leaflet.js + OpenStreetMap tiles via react-leaflet.

- Start centered on NYC: `[40.73, -74.0]`, zoom `11`
- Click → blue marker placed (repositionable before Submit)
- Submit → gold dot at correct location + dashed amber polyline
- `fitBounds` zooms to show both markers after submission
- Map resets to NYC center between rounds

---

## Game Flow

```
Splash Screen
  ↓
[Round Loop: 1–5]
  ClueCard shown
  Player taps map → blue marker placed
  Player hits Submit
  Correct location revealed (gold dot + polyline)
  ScorePopup shown (pts + distance off)
  Player hits Next / Results
  ↓
ResultsScreen
  Per-round breakdown (name, pts, distance)
  Total / max score
  Play Again reloads state
```

---

## Design System

```css
--bg:           #0a0a0f   /* near-black base */
--surface:      #13131a   /* card / panel background */
--border:       #1a1a25   /* subtle borders */
--text:         #e8e0d0   /* warm off-white */
--muted:        #555      /* secondary text */
--gold:         #F59E0B   /* primary accent, score, CTAs */
--blue:         #3B82F6   /* player marker */
--font-display: 'Times New Roman', serif
--font-body:    'Georgia', serif
```

Dark, editorial aesthetic. No gradients. Typography-forward.

---

## Dev Commands

```bash
npm install      # install deps
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview production build
```

---

## Planned Features (priority order)

1. **Daily mode** — seed today's 5 locations using the date (no repeat days)
2. **Local storage** — persist streak, high score, played dates
3. **Expand database** — target 50+ locations across all 4 categories
4. **Difficulty tiers** — Easy (borough highlighted), Hard (no borough labels)
5. **Share card** — emoji grid score summary for social sharing (like Wordle)
6. **Leaderboard** — Supabase backend, optional username
