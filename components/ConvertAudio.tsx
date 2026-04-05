'use client'

import { useState, useRef } from 'react'
import { Music, Upload, Settings, ChevronDown, ChevronUp } from 'lucide-react'

export default function ConvertAudio() {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [speed, setSpeed] = useState(2.3)
  const [amplify, setAmplify] = useState(-4)
  const [maxDuration, setMaxDuration] = useState(350)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Link Roblox account first to convert audio.')
  }

  const canSubmit = (url.trim() || file) && false // disabled without roblox

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 className="heading-cyber" style={{ fontSize: '1.3rem', marginBottom: 4 }}>Convert Audio</h2>
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.8rem' }}>Upload MP3 files or paste YouTube/SoundCloud URLs</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* URL Input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>
              YouTube or SoundCloud URL
            </label>
            <div style={{ position: 'relative' }}>
              <Music size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
              <input
                type="url"
                className="input"
                style={{ paddingLeft: 42 }}
                placeholder="Paste YouTube or SoundCloud URL..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Separator */}
          <div style={{ position: 'relative', margin: '20px 0' }}>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <span style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              background: 'var(--card)',
              padding: '0 12px',
              fontSize: '0.65rem',
              color: 'var(--muted-fg)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>Or</span>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>
              Upload MP3 File
            </label>
            <div
              className="upload-area"
              style={{
                background: dragging ? 'rgba(0,245,255,0.04)' : 'rgba(255,255,255,0.01)',
                borderColor: dragging ? 'rgba(0,245,255,0.5)' : file ? 'rgba(0,245,255,0.3)' : 'var(--border)',
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/mp3,audio/wav"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Upload size={24} color="var(--muted-fg)" />
                </div>
                {file ? (
                  <>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neon-cyan)', marginBottom: 4 }}>{file.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>
                      {dragging ? 'Drop your file here' : 'Drag & drop your MP3 file here'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)' }}>or click to browse (Max 15MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div style={{ marginBottom: 20 }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{ gap: 8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <Settings size={15} />
                <span>Advanced Settings</span>
                {!showAdvanced && (
                  <span style={{ color: 'var(--muted-fg)', fontSize: '0.65rem', marginLeft: 4 }}>
                    Speed: {speed}x · Amplify: {amplify}dB · Max: {maxDuration}s
                  </span>
                )}
              </div>
              {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {showAdvanced && (
              <div style={{
                marginTop: 12,
                padding: 20,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <SliderField
                  label="Speed"
                  value={speed}
                  min={0.5}
                  max={4}
                  step={0.1}
                  unit="x"
                  onChange={setSpeed}
                />
                <SliderField
                  label="Amplify"
                  value={amplify}
                  min={-20}
                  max={20}
                  step={1}
                  unit=" dB"
                  onChange={setAmplify}
                />
                <SliderField
                  label="Max Duration"
                  value={maxDuration}
                  min={30}
                  max={600}
                  step={10}
                  unit="s"
                  onChange={setMaxDuration}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary" disabled>
            Convert Audio
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--muted-fg)', marginTop: 10 }}>
            Link your Roblox account to start converting
          </p>
        </form>
      </div>
    </div>
  )
}

function SliderField({ label, value, min, max, step, unit, onChange }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ fontSize: '0.78rem', color: 'var(--fg)' }}>{label}</label>
        <span style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--neon-cyan)',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}
