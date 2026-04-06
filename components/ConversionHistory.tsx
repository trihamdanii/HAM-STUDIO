'use client'

import { useState, useEffect } from 'react'
import { Clock, Trash2, ExternalLink, Copy, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Music } from 'lucide-react'

interface Job {
  id: string
  sourceUrl?: string | null
  sourceType: string
  fileName?: string | null
  speed: number
  amplify: number
  assetId?: string | null
  assetName?: string | null
  status: string
  moderation?: string | null
  errorMsg?: string | null
  createdAt: string
  completedAt?: string | null
}

const STATUS_COLOR: Record<string, string> = {
  QUEUED: 'var(--muted-fg)',
  DOWNLOADING: '#60a5fa',
  PROCESSING: '#a78bfa',
  UPLOADING: '#34d399',
  UPLOADED: 'var(--neon-cyan)',
  COMPLETED: '#4ade80',
  FAILED: '#f87171',
  UPLOAD_FAILED: '#f87171',
  CANCELLED: 'var(--muted-fg)',
}

const MOD_COLOR: Record<string, string> = {
  PENDING: '#fbbf24',
  ACCEPTED: '#4ade80',
  REJECTED: '#f87171',
}

export default function ConversionHistory() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchHistory = async (p = page, quiet = false) => {
    if (!quiet) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await fetch(`/api/history?page=${p}&limit=10`)
      if (!res.ok) return
      const data = await res.json()
      setJobs(data.jobs || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch { /* ignore */ }
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { fetchHistory(page) }, [page])

  const handleDelete = async (jobId: string) => {
    if (!confirm('Delete this conversion record?')) return
    setDeleting(jobId)
    try {
      await fetch(`/api/history?jobId=${jobId}`, { method: 'DELETE' })
      setJobs(prev => prev.filter(j => j.id !== jobId))
      setTotal(prev => prev - 1)
    } catch { /* ignore */ }
    finally { setDeleting(null) }
  }

  const copyId = (assetId: string) => {
    navigator.clipboard.writeText(assetId)
    setCopied(assetId)
    setTimeout(() => setCopied(null), 2000)
  }

  const getSourceLabel = (job: Job) => {
    if (job.fileName) return job.fileName
    if (job.sourceUrl) {
      try {
        const u = new URL(job.sourceUrl)
        const host = u.hostname.replace('www.', '')
        return `${host} — ${job.assetName || u.pathname.split('/').pop() || 'audio'}`
      } catch { return job.sourceUrl }
    }
    return 'Unknown source'
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const normalSpeed = (speed: number) => {
    const ns = (1 / speed)
    return ns.toFixed(2)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 className="heading-cyber" style={{ fontSize: '1.3rem', marginBottom: 4 }}>Conversion History</h2>
          <p style={{ color: 'var(--muted-fg)', fontSize: '0.8rem' }}>
            {total > 0 ? `${total} total conversion${total !== 1 ? 's' : ''}` : 'Track all your audio conversions and uploads'}
          </p>
        </div>
        <button
          onClick={() => fetchHistory(page, true)}
          disabled={refreshing}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: 'var(--muted-fg)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', transition: 'border-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-fg)' }}
        >
          <RefreshCw size={13} style={refreshing ? { animation: 'spin 0.8s linear infinite' } : {}} />
          Refresh
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted-fg)' }}>
            <RefreshCw size={24} style={{ margin: '0 auto 12px', display: 'block', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.85rem' }}>Loading history...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted-fg)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Clock size={26} style={{ opacity: 0.5 }} />
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>No conversions yet</p>
            <p style={{ fontSize: '0.8rem' }}>Your audio conversions will appear here once you start converting.</p>
          </div>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="history-header" style={{ display: 'grid', gridTemplateColumns: '2fr 120px 110px 130px 100px', gap: 0, padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
              {['Source', 'Status', 'Moderation', 'Date', 'Actions'].map(h => (
                <span key={h} style={{ fontSize: '0.62rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', color: 'var(--muted-fg)', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div>
              {jobs.map((job, idx) => (
                <div
                  key={job.id}
                  className="history-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 120px 110px 130px 100px',
                    gap: 0,
                    padding: '14px 20px',
                    borderBottom: idx < jobs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Source */}
                  <div style={{ minWidth: 0, paddingRight: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Music size={13} color="var(--muted-fg)" style={{ flexShrink: 0 }} />
                      <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getSourceLabel(job)}
                      </p>
                    </div>
                    {job.assetId && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 21 }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--muted-fg)', fontFamily: 'monospace' }}>
                          rbx:{job.assetId}
                        </span>
                        <button onClick={() => copyId(job.assetId!)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === job.assetId ? 'var(--neon-cyan)' : 'var(--muted-fg)', display: 'flex', padding: 0 }}>
                          {copied === job.assetId ? <CheckCircle size={11} /> : <Copy size={11} />}
                        </button>
                        <a href={`https://www.roblox.com/library/${job.assetId}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-fg)', display: 'flex' }}>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                    {job.speed !== 1 && (
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted-fg)', marginLeft: 21 }}>
                        🎵 Set in-game speed: <span style={{ color: 'var(--neon-cyan)' }}>{normalSpeed(job.speed)}x</span>
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: STATUS_COLOR[job.status] || 'var(--muted-fg)', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                      {job.status.replace('_', ' ')}
                    </span>
                    {job.errorMsg && (
                      <p style={{ fontSize: '0.65rem', color: '#f87171', marginTop: 2, lineHeight: 1.3 }} title={job.errorMsg}>
                        {job.errorMsg.slice(0, 40)}{job.errorMsg.length > 40 ? '...' : ''}
                      </p>
                    )}
                  </div>

                  {/* Moderation */}
                  <div>
                    {job.moderation ? (
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: MOD_COLOR[job.moderation] || 'var(--muted-fg)', fontFamily: 'var(--font-heading)' }}>
                        {job.moderation}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted-fg)' }}>—</span>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <p style={{ fontSize: '0.73rem', color: 'var(--fg)' }}>{formatDate(job.createdAt)}</p>
                    {job.completedAt && (
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted-fg)' }}>Done {formatDate(job.completedAt)}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {job.assetId && (
                      <a
                        href={`https://www.roblox.com/library/${job.assetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on Roblox"
                        style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-cyan)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,245,255,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,245,255,0.08)')}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deleting === job.id}
                      title="Delete"
                      style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,60,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,60,60,0.15)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,60,60,0.06)')}
                    >
                      {deleting === job.id
                        ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
                        : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--muted)', border: '1px solid var(--border)', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? 'var(--muted-fg)' : 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}
                >
                  <ChevronLeft size={14} />
                </button>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted-fg)' }}>
                  Page <span style={{ color: 'var(--fg)', fontWeight: 600 }}>{page}</span> of {pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--muted)', border: '1px solid var(--border)', cursor: page === pages ? 'not-allowed' : 'pointer', color: page === pages ? 'var(--muted-fg)' : 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === pages ? 0.4 : 1 }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .history-header { display: none !important; }
          .history-row { grid-template-columns: 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  )
}
