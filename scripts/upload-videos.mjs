/**
 * Compress project hover-preview videos and upload them to Vercel Blob.
 *
 * Usage: node --env-file=.env.local scripts/upload-videos.mjs
 *
 * Requires BLOB_READ_WRITE_TOKEN and ffmpeg on PATH.
 */
import { put } from '@vercel/blob'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '../..')
const sourceDir = join(root, 'public/videos')
const outDir = join(root, '.tmp/videos')

/** Longest edge for hover previews — keeps files small while staying sharp at ~352px. */
const MAX_EDGE = 720

const VIDEOS = [
  { source: 'grademate.mov', key: 'projects/grademate.mp4' },
  { source: 'yorick.mp4', key: 'projects/yorick.mp4' },
  { source: 'eightysix.MP4', key: 'projects/eightysix.mp4' },
  {
    source: 'nic davidson recording.mp4',
    key: 'projects/nic-davidson.mp4',
  },
  { source: 'bartender.mov', key: 'projects/bartender.mp4' },
]

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function compress(sourcePath, outPath) {
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      sourcePath,
      '-an',
      '-vf',
      `scale='min(${MAX_EDGE},iw)':'min(${MAX_EDGE},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '28',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      outPath,
    ],
    { stdio: 'inherit' },
  )

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${basename(sourcePath)}`)
  }
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN (load .env.local)')
  }

  mkdirSync(outDir, { recursive: true })

  const uploaded = {}

  for (const video of VIDEOS) {
    const sourcePath = join(sourceDir, video.source)
    if (!existsSync(sourcePath)) {
      console.warn(`skip missing: ${video.source}`)
      continue
    }

    const outPath = join(outDir, basename(video.key))
    const before = statSync(sourcePath).size
    console.log(`\n→ ${video.source} (${formatBytes(before)})`)

    compress(sourcePath, outPath)

    const after = statSync(outPath).size
    console.log(`  compressed → ${formatBytes(after)}`)

    const blob = await put(video.key, readFileSync(outPath), {
      access: 'public',
      contentType: 'video/mp4',
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    uploaded[video.key] = blob.url
    console.log(`  uploaded → ${blob.url}`)
  }

  console.log('\nPaste into app/data.ts:\n')
  for (const [key, url] of Object.entries(uploaded)) {
    const id = basename(key, '.mp4')
    console.log(`  // ${id}`)
    console.log(`  video: '${url}',`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
