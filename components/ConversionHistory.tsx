'use client'

import { Clock } from 'lucide-react'

export default function ConversionHistory() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 className="heading-cyber" style={{ fontSize: '1.3rem', marginBottom: 4 }}>Conversion History</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.8rem' }}>Track all your audio conversions and uploads</p>
      </div>

      <div className="card">
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: 16,
          padding: '12px 0',
          borderBottom: '1px solid var(--border)',
          marginBottom: 8,
        }}>
          {['Source', 'Status', 'Moderation', 'Date', 'Asset ID'].map(h => (
            <span key={h} style={{
              fontSize: '0.65rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.1em',
              color: 'var(--muted-fg)',
              textTransform: 'uppercase',
            }}>{h}</span>
          ))}
        </div>

        {/* Empty state */}
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted-fg)' }}>
          <Clock size={36} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6, color: 'var(--fg)' }}>
            No conversion history yet
          </p>
          <p style={{ fontSize: '0.8rem' }}>
            Your audio conversions will appear here once you start converting.
          </p>
        </div>
      </div>
    </div>
  )
}
