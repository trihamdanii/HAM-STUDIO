'use client'

import { useState, useEffect } from 'react'
import { Info, Shield, User, Users, ExternalLink, CheckCircle, Trash2, RefreshCw } from 'lucide-react'

interface RobloxAccountProps {
  onSaved?: () => void
}

interface RobloxConfig {
  robloxUserId?: string | null
  robloxUsername?: string | null
  robloxGroupId?: string | null
  hasApiKey?: boolean
}

export default function RobloxAccount({ onSaved }: RobloxAccountProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal')
  const [config, setConfig] = useState<RobloxConfig>({})
  const [userId, setUserId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [groupId, setGroupId] = useState('')
  const [saving, setSaving] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/roblox')
      .then(r => r.json())
      .then(data => {
        setConfig(data)
        if (data.robloxUserId) setUserId(data.robloxUserId)
        if (data.robloxGroupId) setGroupId(data.robloxGroupId)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/roblox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          apiKey: apiKey || undefined,
          groupId: activeTab === 'group' ? groupId : undefined,
          type: activeTab,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save. Check your User ID and API key.')
        return
      }

      setConfig(prev => ({ ...prev, robloxUserId: userId, robloxUsername: data.username, hasApiKey: true }))
      setApiKey('')
      setSuccessMsg(data.message || 'Roblox account linked successfully!')
      onSaved?.()
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleUnlink = async () => {
    if (!confirm('Are you sure you want to unlink your Roblox account?')) return
    setUnlinking(true)
    try {
      await fetch('/api/roblox', { method: 'DELETE' })
      setConfig({})
      setUserId('')
      setApiKey('')
      setGroupId('')
      setSuccessMsg('')
      onSaved?.()
    } catch {
      setErrorMsg('Failed to unlink.')
    } finally {
      setUnlinking(false)
    }
  }

  const isLinked = !!config.robloxUserId && config.hasApiKey

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 className="heading-cyber" style={{ fontSize: '1.1rem', marginBottom: 4 }}>Roblox Account</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.8rem' }}>Link your creator account</p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-fg)', fontSize: '0.82rem' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Linked status banner */}
            {isLinked && (
              <div style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={16} color="var(--neon-cyan)" />
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)' }}>
                      Linked as <span style={{ color: 'var(--neon-cyan)' }}>{config.robloxUsername || config.robloxUserId}</span>
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted-fg)' }}>ID: {config.robloxUserId}</p>
                  </div>
                </div>
                <button
                  onClick={handleUnlink}
                  disabled={unlinking}
                  title="Unlink account"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-fg)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-fg)')}
                >
                  {unlinking ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={13} />}
                  Unlink
                </button>
              </div>
            )}

            {/* Success/error messages */}
            {successMsg && (
              <div style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} color="var(--neon-cyan)" />
                <p style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)' }}>{successMsg}</p>
              </div>
            )}
            {errorMsg && (
              <div style={{ background: 'rgba(255,60,60,0.07)', border: '1px solid rgba(255,60,60,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ fontSize: '0.78rem', color: '#ff7777' }}>{errorMsg}</p>
              </div>
            )}

            {/* Creator Hub link */}
            <a
              href="https://create.roblox.com/dashboard/credentials"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 4, marginBottom: 18, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-cyan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}
            >
              Open Roblox Creator Hub <ExternalLink size={12} />
            </a>

            {/* Tabs */}
            <div className="tab-list" style={{ marginBottom: 20 }}>
              <button className={`tab-trigger ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')} type="button">
                <User size={13} /> Personal
              </button>
              <button className={`tab-trigger ${activeTab === 'group' ? 'active' : ''}`} onClick={() => setActiveTab('group')} type="button">
                <Users size={13} /> Group
              </button>
            </div>

            {/* Tutorial */}
            <div className="info-box" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Info size={14} color="var(--neon-cyan)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>How to Get Your API Key</span>
              </div>
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  'Go to Roblox Creator Hub → Credentials',
                  'Click "Create API Key", name it "CENZ STUDIO"',
                  activeTab === 'personal'
                    ? 'Under Access Permissions, enable Assets:Read and Assets:Write'
                    : 'Select your Group and enable Assets:Read and Assets:Write',
                  'Click "Save & Generate Key"',
                  'Copy the key immediately (shown only once)',
                  'Paste below and click Save',
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.75rem', color: 'rgba(208,208,240,0.85)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--neon-cyan)', flexShrink: 0, minWidth: 16 }}>{i + 1}.</span>
                    <span style={{ lineHeight: 1.5 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSave}>
              {activeTab === 'group' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>
                    Group ID
                  </label>
                  <input
                    type="text"
                    className="input"
                    inputMode="numeric"
                    placeholder="e.g. 12345678"
                    value={groupId}
                    onChange={e => setGroupId(e.target.value)}
                    required={activeTab === 'group'}
                  />
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>
                  Roblox User ID
                </label>
                <input
                  type="text"
                  className="input"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 9217554647"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  required
                />
                <p style={{ fontSize: '0.68rem', color: 'var(--muted-fg)', marginTop: 4 }}>
                  Find it at roblox.com/users — click your profile
                </p>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>
                  API Key {isLinked && <span style={{ color: 'var(--muted-fg)', fontWeight: 400 }}>(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder={isLinked ? '••••••••••••••••' : 'Paste your API key here'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  autoComplete="new-password"
                  required={!isLinked}
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: apiKey ? '0.08em' : undefined }}
                />
              </div>

              <div className="security-note" style={{ marginBottom: 16 }}>
                <Shield size={14} color="var(--muted-fg)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.7rem', color: 'var(--muted-fg)', lineHeight: 1.5 }}>
                  Your API key is encrypted with AES-256-GCM before storage. We never log or share it.
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {saving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Validating...</> : isLinked ? 'Update Account' : 'Save & Link Account'}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
