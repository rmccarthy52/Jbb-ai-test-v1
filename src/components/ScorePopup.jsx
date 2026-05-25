import React from 'react'

function distanceLabel(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(2)} km`
}

export default function ScorePopup({ pts, dist, onNext, isLast }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          color: 'var(--gold)',
          lineHeight: 1,
        }}>
          {pts.toLocaleString()}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          off by {distanceLabel(dist)}
        </div>
      </div>
      <button
        onClick={onNext}
        style={{
          background: 'var(--gold)',
          color: '#0a0a0f',
          border: 'none',
          borderRadius: 6,
          padding: '10px 22px',
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        {isLast ? 'Results' : 'Next'}
      </button>
    </div>
  )
}
