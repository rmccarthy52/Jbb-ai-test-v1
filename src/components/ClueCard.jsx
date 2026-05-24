import React from 'react'

const CATEGORY_COLORS = {
  landmark: '#F59E0B',
  food:     '#EF4444',
  history:  '#8B5CF6',
  film:     '#10B981',
}

export default function ClueCard({ location, currentIdx, total, submitted }) {
  const color = CATEGORY_COLORS[location.category] ?? '#888'

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 11,
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: color,
          color: '#0a0a0f',
          padding: '2px 8px',
          borderRadius: 4,
          fontWeight: 700,
        }}>
          {location.category}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>
          {currentIdx + 1} / {total}
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        lineHeight: 1.6,
        color: 'var(--text)',
      }}>
        {location.clue}
      </p>
      {submitted && (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          color: 'var(--gold)',
          marginTop: 4,
        }}>
          {location.name}
        </p>
      )}
    </div>
  )
}
