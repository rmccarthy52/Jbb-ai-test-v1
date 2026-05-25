import React, { useState, useCallback, useMemo } from 'react'
import MapCanvas from './components/MapCanvas.jsx'
import ClueCard from './components/ClueCard.jsx'
import ScorePopup from './components/ScorePopup.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'
import { NYC_LOCATIONS } from './data/locations.js'
import { haversine, scoreFromDistance } from './utils/geo.js'

const ROUNDS = 5

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initialState() {
  return {
    locations: shuffled(NYC_LOCATIONS).slice(0, ROUNDS),
    currentIdx: 0,
    guess: null,      // { lat, lng }
    submitted: false,
    results: [],
    totalScore: 0,
    gameOver: false,
    started: false,
  }
}

export default function NYCTap() {
  const [state, setState] = useState(initialState)

  const location = state.locations[state.currentIdx]
  const maxScore = ROUNDS * 1000

  const handleGuess = useCallback((latLng) => {
    setState(s => s.submitted ? s : { ...s, guess: latLng })
  }, [])

  function handleSubmit() {
    if (!state.guess || state.submitted) return
    const { lat, lng } = state.guess
    const dist = haversine(lat, lng, location.lat, location.lng)
    const pts  = scoreFromDistance(dist)

    setState(s => ({
      ...s,
      submitted: true,
      results: [...s.results, { location, guess: s.guess, dist, pts }],
      totalScore: s.totalScore + pts,
    }))
  }

  function handleNext() {
    const isLast = state.currentIdx >= ROUNDS - 1
    if (isLast) {
      setState(s => ({ ...s, gameOver: true }))
    } else {
      setState(s => ({
        ...s,
        currentIdx: s.currentIdx + 1,
        guess: null,
        submitted: false,
      }))
    }
  }

  function handlePlayAgain() {
    setState(initialState())
  }

  if (!state.started) {
    return <SplashScreen onStart={() => setState(s => ({ ...s, started: true }))} />
  }

  if (state.gameOver) {
    return (
      <ResultsScreen
        results={state.results}
        totalScore={state.totalScore}
        maxScore={maxScore}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  const lastResult = state.results[state.results.length - 1]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',   /* dvh accounts for mobile browser chrome */
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          letterSpacing: '0.05em',
          color: 'var(--gold)',
        }}>
          NYC TAP
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>
          {state.totalScore.toLocaleString()} pts
        </span>
      </header>

      {/* Map — takes all remaining space above the panel */}
      <MapCanvas
        onGuess={handleGuess}
        guessLatLng={state.guess}
        correctLatLng={state.submitted ? { lat: location.lat, lng: location.lng } : null}
        submitted={state.submitted}
      />

      {/* Bottom panel — capped so it never crowds the map */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        maxHeight: '42vh',
        overflowY: 'auto',
      }}>
        <ClueCard
          location={location}
          currentIdx={state.currentIdx}
          total={ROUNDS}
          submitted={state.submitted}
        />

        {!state.submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!state.guess}
            style={{
              background: state.guess ? 'var(--blue)' : 'var(--border)',
              color: state.guess ? '#fff' : 'var(--muted)',
              border: 'none',
              borderRadius: 6,
              padding: '12px',
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.06em',
              transition: 'background 0.15s',
              cursor: state.guess ? 'pointer' : 'not-allowed',
            }}
          >
            {state.guess ? 'Submit Guess' : 'Tap the map to place a pin'}
          </button>
        ) : (
          <ScorePopup
            pts={lastResult.pts}
            dist={lastResult.dist}
            onNext={handleNext}
            isLast={state.currentIdx >= ROUNDS - 1}
          />
        )}
      </div>
    </div>
  )
}

function SplashScreen({ onStart }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      gap: 24,
      padding: 32,
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 52,
          color: 'var(--gold)',
          letterSpacing: '0.06em',
          lineHeight: 1,
        }}>
          NYC TAP
        </h1>
        <p style={{
          color: 'var(--muted)',
          marginTop: 10,
          fontSize: 15,
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.04em',
        }}>
          A daily geography game set in New York City
        </p>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '20px 24px',
        maxWidth: 360,
        lineHeight: 1.7,
        fontSize: 14,
        color: 'var(--text)',
      }}>
        <p>Read a clue about a famous NYC location. Tap the map where you think it is. Score up to 1,000 points per round based on how close you get.</p>
        <p style={{ marginTop: 12, color: 'var(--muted)' }}>5 rounds per game.</p>
      </div>

      <button
        onClick={onStart}
        style={{
          background: 'var(--gold)',
          color: '#0a0a0f',
          border: 'none',
          borderRadius: 6,
          padding: '14px 40px',
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        Play
      </button>
    </div>
  )
}
