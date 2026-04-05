'use client'

import { useState } from 'react'
import { Info, Shield, User, Users, ExternalLink } from 'lucide-react'

export default function RobloxAccount() {
  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal')
  const [userId, setUserId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    alert('Roblox account saved! (Demo mode)')
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 className="heading-cyber" style={{ fontSize: '1.1rem', marginBottom: 4 }}>Roblox Account</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.8rem' }}>Link your creator account</p>
      </div>

      <div className="card">
        {/* Description */}
        <p style={{ fontSize: '0.82rem', color: 'var(--muted-fg)', marginBottom: 14 }}>
          Follow the steps below to create an API key and connect your Roblox account.
        </p>
        <a
          href="https://create.roblox.com/dashboard/credentials"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.82rem',
            color: 'var(--fg)',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            marginBottom: 20,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-cyan)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}
        >
          Create API Key on Roblox Creator Hub
          <ExternalLink size={12} />
        </a>

        {/* Tabs */}
        <div className="tab-list" style={{ marginBottom: 20 }}>
          <button
            className={`tab-trigger ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
            type="button"
          >
            <User size={14} />
            Personal Account
          </button>
          <button
            className={`tab-trigger ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
            type="button"
          >
            <Users size={14} />
            Group Account
          </button>
        </div>

        {activeTab === 'personal' && (
          <div>
            {/* Tutorial */}
            <div className="info-box" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Info size={15} color="var(--neon-cyan)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)' }}>How to Get Your API Key</span>
              </div>
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Press the "Create API Key" button on the Roblox Creator Hub',
                  'Set a name for your API key (e.g., "CENZ STUDIO")',
                  'Create an API key with Assets:Read and Assets:Write permissions',
                  'Click "Save & Generate Key" button',
                  'Copy the generated API key (you won\'t be able to see it again)',
                  'Paste the API key into the form below and click "Save"',
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'rgba(208,208,240,0.85)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--neon-cyan)', flexShrink: 0 }}>{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>
                  Roblox User ID
                </label>
                <input
                  type="text"
                  className="input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="9217554647"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  required
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--muted-fg)', marginTop: 5 }}>Example: 9217554647</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>
                  API Key
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="Paste your API key here"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  autoComplete="new-password"
                  style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--muted-fg)', marginTop: 5 }}>
                  Leave empty if you don&apos;t want to change the stored key
                </p>
              </div>

              <div className="security-note" style={{ marginBottom: 16 }}>
                <Shield size={15} color="var(--muted-fg)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--muted-fg)' }}>
                  Your API key is encrypted and stored securely. We never share this data.
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ height: 42 }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'group' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-fg)', fontSize: '0.85rem' }}>
            <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>Group account integration coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
