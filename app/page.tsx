'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import StatsCards from '@/components/StatsCards'
import ConvertAudio from '@/components/ConvertAudio'
import RobloxAccount from '@/components/RobloxAccount'
import ConversionHistory from '@/components/ConversionHistory'

// Mock user data - replace with real auth
const mockUser = {
  name: 'm.trihamdani',
  discordUsername: 'm.trihamdani',
  image: null as string | null,
  plan: 'Free' as const,
  totalConversions: 0,
  monthConversions: 0,
  robloxLinked: false,
}

export default function DashboardPage() {
  const [user] = useState(mockUser)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header user={user} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div className="fade-in" style={{ marginBottom: 32 }}>
          <h1 className="heading-cyber" style={{ fontSize: '2rem', marginBottom: 6 }}>
            Welcome
          </h1>
          <p style={{ color: 'var(--muted-fg)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
            Convert and upload audio to Roblox instantly
          </p>
        </div>

        <StatsCards user={user} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: 32,
          marginTop: 40,
        }}
          className="main-grid"
        >
          <div style={{ minWidth: 0 }}>
            <ConvertAudio />
          </div>
          <div style={{ minWidth: 0 }}>
            <RobloxAccount />
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <ConversionHistory />
        </div>
      </main>

      <style jsx global>{`
        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
