import React from 'react'

const CATEGORY_COLORS = {
  landmark: '#F59E0B',
  food:     '#EF4444',
  history:  '#8B5CF6',
  film:     '#10B981',
}

function distanceLabel(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(2)} km`
}

export default function ResultsScreen({ results, totalScore, maxScore, onPlayAgain }) {
  const pct = Math.round((totalScore / maxScore) * 100)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      gap: 32,
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 42,
          color: 'var(--gold)',
          letterSpacing: '0.04em',
        }}>
          {totalScore.toLocaleString()}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 15 }}>
          {pct}% of {maxScore.toLocaleString()} possible points
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {results.map((r, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {r.location.name}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                <span style={{
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: CATEGORY_COLORS[r.location.category] ?? '#888',
                  color: '#0a0a0f',
                  padding: '1px 6px',
                  borderRadius: 3,
                  fontWeight: 700,
                }}>
                  {r.location.category}
                </span>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {distanceLabel(r.dist)} away
                </span>
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              color: 'var(--gold)',
              whiteSpace: 'nowrap',
            }}>
              {r.pts.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        style={{
          background: 'var(--gold)',
          color: '#0a0a0f',
          border: 'none',
          borderRadius: 6,
          padding: '12px 32px',
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.06em',
          marginTop: 8,
        }}
      >
        Play Again
      </button>
    </div>
  )
}
