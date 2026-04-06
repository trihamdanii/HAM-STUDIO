'use client'

import { TrendingUp, Crown, Music } from 'lucide-react'

interface StatsCardsProps {
  user: {
    name: string
    discordUsername: string
    plan: string
    totalConversions: number
    monthConversions: number
    robloxLinked: boolean
  }
}

export default function StatsCards({ user }: StatsCardsProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
    }}>
      {/* Discord Account */}
      <div className="card fade-in" style={{ animationDelay: '0.05s' }}>
        <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', color: 'var(--muted-fg)', textTransform: 'uppercase', marginBottom: 8 }}>
          Discord Account
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>{user.discordUsername}</p>
            <span className="badge badge-linked">Linked</span>
          </div>
          <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.1rem', border: '2px solid rgba(0,245,255,0.2)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Roblox Account */}
      <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
        <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', color: 'var(--muted-fg)', textTransform: 'uppercase', marginBottom: 8 }}>
          Roblox Account
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: user.robloxLinked ? 'var(--fg)' : 'var(--muted-fg)', marginBottom: 6 }}>
              {user.robloxLinked ? 'Connected' : 'Not linked'}
            </p>
            {!user.robloxLinked && (
              <span className="badge badge-secondary">Setup Required</span>
            )}
          </div>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--border)',
          }}>
            <Music size={22} color="var(--muted-fg)" />
          </div>
        </div>
      </div>

      {/* Total Conversions */}
      <div className="card fade-in" style={{ animationDelay: '0.15s' }}>
        <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', color: 'var(--muted-fg)', textTransform: 'uppercase', marginBottom: 8 }}>
          Total Conversions
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--fg)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {user.totalConversions}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', marginTop: 6 }}>
              {user.monthConversions} this month
            </p>
          </div>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'rgba(0,245,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendingUp size={22} color="var(--neon-cyan)" />
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
        <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', color: 'var(--muted-fg)', textTransform: 'uppercase', marginBottom: 8 }}>
          Current Plan
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--fg)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {user.plan}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', marginTop: 4 }}>Forever</p>
          </div>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'rgba(255,0,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Crown size={22} color="var(--neon-magenta)" />
          </div>
        </div>
        <button className="btn-outline" style={{ fontSize: '0.65rem' }}>
          ⚡ Upgrade Plan
        </button>
      </div>
    </div>
  )
}
