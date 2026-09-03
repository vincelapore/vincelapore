/**
 * Convert local project videos into hover-preview GIFs.
 *
 * Matches omarabdulrahim.com encoding: ~33 fps (100/3), 616px wide, ~8s.
 *
 * Usage: npm run convert-previews
 *
 * Requires ffmpeg on PATH. Writes to public/projects/previews/.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '../..')
const sourceDir = join(root, 'public/videos')
const outDir = join(root, 'public/projects/previews')

/** Same as Omar's GIFs: r_frame_rate=100/3 (~33.33 fps). */
const FPS = '100/3'
const DURATION = 8
const LANDSCAPE_WIDTH = 616
const PORTRAIT_WIDTH = 332

const VIDEOS = [
  { source: 'grademate.mov', output: 'grademate.gif', width: LANDSCAPE_WIDTH },
  { source: 'yorick.mp4', output: 'yorick.gif', width: LANDSCAPE_WIDTH },
  {
    source: 'nic davidson recording.mp4',
    output: 'nic-davidson.gif',
    width: LANDSCAPE_WIDTH,
  },
  { source: 'eightysix.MP4', output: 'eightysix.gif', width: PORTRAIT_WIDTH },
  { source: 'bartender.mov', output: 'bartender.gif', width: PORTRAIT_WIDTH },
]

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function convert({ source, output, width }) {
  const input = join(sourceDir, source)
  const outPath = join(outDir, output)

  if (!existsSync(input)) {
    console.warn(`skip missing: ${source}`)
    return
  }

  const scale = `scale=${width}:-1:flags=lanczos`
  const filter = `${scale},fps=${FPS},split[s0][s1];[s0]palettegen=stats_mode=diff:max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3`

  console.log(`→ ${output}`)
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-t',
      String(DURATION),
      '-i',
      input,
      '-vf',
      filter,
      '-loop',
      '0',
      outPath,
    ],
    { stdio: 'inherit' },
  )

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${source}`)
  }

  const probe = spawnSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height,avg_frame_rate,nb_frames,duration',
      '-of',
      'csv=p=0',
      outPath,
    ],
    { encoding: 'utf8' },
  )

  const [w, h, fps, frames, duration] = probe.stdout.trim().split(',')
  const size = statSync(outPath).size
  console.log(`  ${w}x${h} · ${fps} fps · ${frames} frames · ${formatBytes(size)}`)

  return { output, width: Number(w), height: Number(h), fps, duration }
}

mkdirSync(outDir, { recursive: true })

const sizes = VIDEOS.map(convert).filter(Boolean)
console.log('\nPaste into app/data.ts preview fields:\n')
for (const { output, width, height } of sizes) {
  const id = output.replace('.gif', '')
  console.log(`// ${id}`)
  console.log(`preview: { src: '/projects/previews/${output}', width: ${width}, height: ${height} },`)
}
