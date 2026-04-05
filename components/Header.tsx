'use client'

import { useState } from 'react'
import { Music, LogOut, User, Settings, Crown } from 'lucide-react'

interface HeaderProps {
  user: {
    name: string
    discordUsername: string
    image: string | null
    plan: string
  }
}

export default function Header({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid rgba(0,245,255,0.08)',
      background: 'rgba(6,6,15,0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Music size={18} color="#000" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--fg)',
          }}>
            CENZ STUDIO
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <button
              className="btn-ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8 }}
            >
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--fg)' }}>{user.discordUsername}</span>
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px',
                minWidth: 180,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                zIndex: 100,
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontFamily: 'var(--font-body)' }}>Signed in as</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', marginTop: 2 }}>{user.discordUsername}</p>
                </div>
                <MenuItem icon={<User size={14} />} label="Profile" />
                <MenuItem icon={<Settings size={14} />} label="Settings" />
                <MenuItem icon={<Crown size={14} />} label="Upgrade Plan" highlight />
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8 }}>
                  <MenuItem icon={<LogOut size={14} />} label="Sign Out" danger />
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

function MenuItem({ icon, label, highlight, danger }: {
  icon: React.ReactNode
  label: string
  highlight?: boolean
  danger?: boolean
}) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      width: '100%',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 6,
      color: danger ? '#ff4444' : highlight ? 'var(--neon-cyan)' : 'var(--fg)',
      fontSize: '0.83rem',
      fontFamily: 'var(--font-body)',
      textAlign: 'left',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--muted)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </button>
  )
}
