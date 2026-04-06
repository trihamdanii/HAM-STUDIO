import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import crypto from 'crypto'

const execAsync = promisify(exec)

interface ProcessAudioOptions {
  inputPath: string
  speed?: number       // e.g. 2.3 = 2.3x speed
  amplify?: number     // dB, e.g. -4
  maxDuration?: number // seconds
}

interface ProcessAudioResult {
  outputPath: string
  duration: number
  size: number
}

/**
 * Process audio with ffmpeg: speed change, amplification, duration limit, convert to MP3
 * Returns path to processed temp file (caller must delete it)
 */
export async function processAudio(options: ProcessAudioOptions): Promise<ProcessAudioResult> {
  const { inputPath, speed = 2.3, amplify = -4, maxDuration = 350 } = options

  const tmpDir = os.tmpdir()
  const outName = `cenz_${crypto.randomBytes(8).toString('hex')}.mp3`
  const outputPath = path.join(tmpDir, outName)

  // Build ffmpeg filter chain
  const filters: string[] = []

  // Speed change using atempo (max 2.0 per filter, chain for higher)
  if (speed !== 1.0) {
    const atempoFilters = buildAtempoChain(speed)
    filters.push(...atempoFilters)
  }

  // Volume / amplify
  if (amplify !== 0) {
    filters.push(`volume=${amplify}dB`)
  }

  const filterStr = filters.length > 0 ? `-af "${filters.join(',')}"` : ''

  // Duration limit
  const durationStr = maxDuration > 0 ? `-t ${maxDuration}` : ''

  const cmd = [
    'ffmpeg',
    '-y',
    '-i', `"${inputPath}"`,
    durationStr,
    filterStr,
    '-acodec libmp3lame',
    '-b:a 128k',
    '-ar 44100',
    '-ac 1', // Mono (Roblox audio)
    `"${outputPath}"`,
  ].filter(Boolean).join(' ')

  await execAsync(cmd)

  // Get output stats
  const stat = await fs.stat(outputPath)
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`
  )
  const duration = parseFloat(stdout.trim()) || 0

  return { outputPath, duration, size: stat.size }
}

/**
 * Download audio from URL using yt-dlp
 */
export async function downloadAudio(url: string, maxDurationSeconds = 600): Promise<string> {
  const tmpDir = os.tmpdir()
  const outName = `dl_${crypto.randomBytes(8).toString('hex')}`
  const outputTemplate = path.join(tmpDir, `${outName}.%(ext)s`)

  const cmd = [
    'yt-dlp',
    '--no-playlist',
    '--extract-audio',
    '--audio-format mp3',
    '--audio-quality 0',
    `--match-filter "duration <= ${maxDurationSeconds}"`,
    '--no-warnings',
    '-o', `"${outputTemplate}"`,
    `"${url}"`,
  ].join(' ')

  await execAsync(cmd, { timeout: 120_000 })

  // Find the downloaded file
  const files = await fs.readdir(tmpDir)
  const downloaded = files.find(f => f.startsWith(outName))
  if (!downloaded) throw new Error('Download failed: output file not found')

  return path.join(tmpDir, downloaded)
}

/**
 * Get audio duration in seconds
 */
export async function getAudioDuration(filePath: string): Promise<number> {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  )
  return parseFloat(stdout.trim()) || 0
}

/**
 * Build ffmpeg atempo filter chain for speed > 2.0 or < 0.5
 * atempo only accepts 0.5 - 2.0, so chain them
 */
function buildAtempoChain(speed: number): string[] {
  const filters: string[] = []
  let remaining = speed

  if (speed > 1) {
    while (remaining > 2.0) {
      filters.push('atempo=2.0')
      remaining /= 2.0
    }
    if (remaining !== 1.0) filters.push(`atempo=${remaining.toFixed(4)}`)
  } else {
    while (remaining < 0.5) {
      filters.push('atempo=0.5')
      remaining /= 0.5
    }
    if (remaining !== 1.0) filters.push(`atempo=${remaining.toFixed(4)}`)
  }

  return filters
}

/**
 * Clean up temp files
 */
export async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch {
    // Ignore errors
  }
}
