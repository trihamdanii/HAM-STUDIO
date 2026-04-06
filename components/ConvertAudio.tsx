'use client'

import { useState, useRef, useEffect } from 'react'
import { Music, Upload, Settings, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader, Clock, Copy, ExternalLink } from 'lucide-react'

interface ConvertAudioProps {
  robloxLinked: boolean
  plan: string
  onConversionStarted?: () => void
}

interface JobStatus {
  id: string
  status: string
  moderation?: string | null
  assetId?: string | null
  assetName?: string | null
  errorMsg?: string | null
  speed?: number
}

const STATUS_LABELS: Record<string, string> = {
  QUEUED: 'Queued — waiting to start',
  DOWNLOADING: 'Downloading audio...',
  PROCESSING: 'Processing with ffmpeg...',
  UPLOADING: 'Uploading to Roblox...',
  UPLOADED: 'Uploaded — awaiting moderation',
  COMPLETED: 'Completed & approved!',
  FAILED: 'Failed',
  UPLOAD_FAILED: 'Upload Failed',
  CANCELLED: 'Cancelled',
}

const TERMINAL = ['COMPLETED', 'FAILED', 'UPLOAD_FAILED', 'CANCELLED']

export default function ConvertAudio({ robloxLinked, plan, onConversionStarted }: ConvertAudioProps) {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [speed, setSpeed] = useState(2.3)
  const [amplify, setAmplify] = useState(-4)
  const [maxDuration, setMaxDuration] = useState(350)
  const [loading, setLoading] = useState(false)
  const [activeJob, setActiveJob] = useState<JobStatus | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!activeJob || TERMINAL.includes(activeJob.status)) return
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/convert/${activeJob.id}`)
        if (!res.ok) return
        const data: JobStatus = await res.json()
        setActiveJob(data)
        if (TERMINAL.includes(data.status)) {
          clearInterval(pollRef.current!)
          onConversionStarted?.()
        }
      } catch { /* ignore */ }
    }, 2500)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [activeJob?.id, activeJob?.status])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (loading) return
    const f = e.dataTransfer.files[0]
    if (f) { setFile(f); setUrl('') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setActiveJob(null)
    if (pollRef.current) clearInterval(pollRef.current)

    try {
      let res: Response
      if (file) {
        const form = new FormData()
        form.append('file', file)
        form.append('speed', speed.toString())
        form.append('amplify', amplify.toString())
        form.append('maxDuration', maxDuration.toString())
        res = await fetch('/api/convert', { method: 'POST', body: form })
      } else {
        res = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, speed, amplify, maxDuration }),
        })
      }

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 429) {
          setError(`Rate limit: ${data.remaining} conversions remaining. Resets in ${data.resetInMinutes} min.`)
        } else {
          setError(data.error || 'Conversion failed. Please try again.')
        }
        return
      }

      setActiveJob({ id: data.jobId, status: data.status })
      setUrl('')
      setFile(null)
      onConversionStarted?.()
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyAssetId = () => {
    if (activeJob?.assetId) {
      navigator.clipboard.writeText(activeJob.assetId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const maxMB = plan === 'FREE' ? 15 : 200
  const canSubmit = robloxLinked && (url.trim().length > 0 || file !== null) && !loading

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 className="heading-cyber" style={{ fontSize: '1.3rem', marginBottom: 4 }}>Convert Audio</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.8rem' }}>
          Upload MP3 files or paste YouTube / SoundCloud URLs
        </p>
      </div>

      <div className="card">
        {/* Active job banner */}
        {activeJob && <JobBanner job={activeJob} onCopy={copyAssetId} copied={copied} />}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,60,60,0.07)', border: '1px solid rgba(255,60,60,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <XCircle size={16} color="#ff4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '0.82rem', color: '#ff7777', lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* URL */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>
              YouTube or SoundCloud URL
            </label>
            <div style={{ position: 'relative' }}>
              <Music size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)', pointerEvents: 'none' }} />
              <input
                type="url"
                className="input"
                style={{ paddingLeft: 42 }}
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={e => { setUrl(e.target.value); setFile(null) }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ position: 'relative', margin: '4px 0 20px' }}>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--card)', padding: '0 14px', fontSize: '0.65rem', color: 'var(--muted-fg)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Or</span>
          </div>

          {/* File upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>
              Upload MP3 File
              <span style={{ fontWeight: 400, fontSize: '0.72rem', color: 'var(--muted-fg)' }}>max {maxMB}MB</span>
            </label>
            <div
              className="upload-area"
              style={{
                borderColor: dragging ? 'rgba(0,245,255,0.6)' : file ? 'rgba(0,245,255,0.35)' : undefined,
                background: dragging ? 'rgba(0,245,255,0.04)' : file ? 'rgba(0,245,255,0.02)' : undefined,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.55 : 1,
              }}
              onDragOver={e => { e.preventDefault(); if (!loading) setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/mp3,audio/wav"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setUrl('') } }}
                disabled={loading}
              />
              <div style={{ padding: '36px 24px', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: file ? 'rgba(0,245,255,0.1)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', transition: 'background 0.2s' }}>
                  <Upload size={22} color={file ? 'var(--neon-cyan)' : 'var(--muted-fg)'} />
                </div>
                {file ? (
                  <>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neon-cyan)', marginBottom: 3 }}>{file.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted-fg)' }}>{(file.size / 1048576).toFixed(2)} MB — click to change</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 3 }}>
                      {dragging ? 'Drop it here!' : 'Drag & drop your MP3 here'}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted-fg)' }}>or click to browse</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Advanced settings */}
          <div style={{ marginBottom: 20 }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setShowAdvanced(v => !v)}
              style={{ justifyContent: 'space-between' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={14} />
                <span style={{ fontSize: '0.7rem' }}>
                  Advanced Settings
                  {!showAdvanced && (
                    <span style={{ color: 'var(--muted-fg)', marginLeft: 8 }}>
                      Speed {speed}x · {amplify >= 0 ? '+' : ''}{amplify}dB · {maxDuration}s
                    </span>
                  )}
                </span>
              </span>
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAdvanced && (
              <div style={{ marginTop: 10, padding: '18px 20px', background: 'rgba(255,255,255,0.015)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ background: 'rgba(255,180,0,0.06)', border: '1px solid rgba(255,180,0,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 18 }}>
                  <p style={{ fontSize: '0.73rem', color: 'rgba(255,200,80,0.9)', lineHeight: 1.5 }}>
                    ⚠️ Only change these settings if your audio was rejected. Default values work best for most cases.
                  </p>
                </div>
                <SliderField label="Speed" value={speed} min={0.5} max={4} step={0.1} unit="x" onChange={setSpeed} />
                <SliderField label="Amplify" value={amplify} min={-20} max={20} step={1} unit=" dB" onChange={setAmplify} />
                <SliderField label="Max Duration" value={maxDuration} min={30} max={600} step={10} unit="s" onChange={setMaxDuration} />
                <button
                  type="button"
                  onClick={() => { setSpeed(2.3); setAmplify(-4); setMaxDuration(350) }}
                  style={{ fontSize: '0.7rem', color: 'var(--muted-fg)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Reset to defaults
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={!canSubmit}
            style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            {loading
              ? <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Starting conversion...</>
              : 'Convert Audio'}
          </button>

          {!robloxLinked && (
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,180,0,0.8)', marginTop: 10 }}>
              ⚠️ Link your Roblox account first (on the right panel)
            </p>
          )}

          {plan === 'FREE' && robloxLinked && (
            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--muted-fg)', marginTop: 10 }}>
              Free plan: 2 conversions per hour · <span style={{ color: 'var(--neon-magenta)', cursor: 'pointer' }}>Upgrade for unlimited</span>
            </p>
          )}
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function JobBanner({ job, onCopy, copied }: { job: JobStatus; onCopy: () => void; copied: boolean }) {
  const isRunning = !TERMINAL.includes(job.status)
  const isFailed = ['FAILED', 'UPLOAD_FAILED'].includes(job.status)
  const isDone = job.status === 'COMPLETED'
  const isUploaded = job.status === 'UPLOADED'
  const isRejected = job.moderation === 'REJECTED'

  const accent = isFailed || isRejected ? '#ff4444' : isDone ? 'var(--neon-cyan)' : isUploaded ? 'rgba(0,245,255,0.7)' : 'var(--muted-fg)'

  return (
    <div style={{
      background: isFailed || isRejected ? 'rgba(255,60,60,0.06)' : isDone || isUploaded ? 'rgba(0,245,255,0.05)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isFailed || isRejected ? 'rgba(255,60,60,0.25)' : isDone || isUploaded ? 'rgba(0,245,255,0.2)' : 'var(--border)'}`,
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flexShrink: 0 }}>
          {isFailed || isRejected ? <XCircle size={18} color="#ff4444" /> :
           isDone ? <CheckCircle size={18} color="var(--neon-cyan)" /> :
           isRunning ? <Loader size={18} color="var(--neon-cyan)" style={{ animation: 'spin 0.8s linear infinite' }} /> :
           <Clock size={18} color="var(--muted-fg)" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.83rem', fontWeight: 600, color: isFailed || isRejected ? '#ff7777' : 'var(--fg)', marginBottom: 2 }}>
            {STATUS_LABELS[job.status] || job.status}
            {job.moderation === 'ACCEPTED' && ' ✓'}
            {job.moderation === 'REJECTED' && ' — Rejected by Roblox'}
          </p>
          {job.assetId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted-fg)' }}>
                Asset ID: <span style={{ color: 'var(--neon-cyan)', fontFamily: 'monospace' }}>{job.assetId}</span>
              </p>
              <button
                onClick={onCopy}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--neon-cyan)' : 'var(--muted-fg)', padding: 0, display: 'flex' }}
                title="Copy Asset ID"
              >
                {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
              </button>
              <a
                href={`https://www.roblox.com/library/${job.assetId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--muted-fg)', display: 'flex' }}
                title="View on Roblox"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          )}
          {job.errorMsg && (
            <p style={{ fontSize: '0.72rem', color: '#ff9999', marginTop: 3 }}>{job.errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SliderField({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: '0.78rem', color: 'var(--fg)' }}>{label}</label>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)' }}>
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--neon-cyan)', cursor: 'pointer', height: 4 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--muted-fg)' }}>{min}{unit}</span>
        <span style={{ fontSize: '0.62rem', color: 'var(--muted-fg)' }}>{max}{unit}</span>
      </div>
    </div>
  )
}
