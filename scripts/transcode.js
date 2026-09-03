/**
 * Transcode a local video into adaptive HLS (720p + 1080p).
 *
 * Usage:
 *   node --experimental-default-type=module scripts/transcode.js [input.mp4]
 *   node --experimental-default-type=module scripts/transcode.js   # all project videos
 *
 * Requires ffmpeg on PATH. Writes to ./output/<id>/{master.m3u8,720p/,1080p/}.
 */
import ffmpeg from 'fluent-ffmpeg'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '../..')
const sourceDir = join(root, 'public/videos')
const outputRoot = join(root, 'output')

/** Project + bartending sources used on the site. */
const DEFAULT_VIDEOS = [
  { source: 'grademate.mov', id: 'grademate' },
  { source: 'yorick.mp4', id: 'yorick' },
  { source: 'eightysix.MP4', id: 'eightysix' },
  { source: 'nic davidson recording.mp4', id: 'nic-davidson' },
  { source: 'bartender.mov', id: 'bartender' },
]

const VARIANTS = [
  {
    name: '720p',
    height: 720,
    videoBitrate: '2800k',
    audioBitrate: '128k',
    bandwidth: 2_800_000,
  },
  {
    name: '1080p',
    height: 1080,
    videoBitrate: '5000k',
    audioBitrate: '192k',
    bandwidth: 5_000_000,
  },
]

function probe(inputPath) {
  return new Promise((resolveProbe, reject) => {
    ffmpeg.ffprobe(inputPath, (err, data) => {
      if (err) reject(err)
      else resolveProbe(data)
    })
  })
}

function hasAudioStream(probeData) {
  return (probeData.streams ?? []).some((s) => s.codec_type === 'audio')
}

function videoStream(probeData) {
  return (probeData.streams ?? []).find((s) => s.codec_type === 'video')
}

function encodeVariant(inputPath, variantDir, variant, withAudio) {
  return new Promise((resolveEncode, reject) => {
    mkdirSync(variantDir, { recursive: true })

    const segmentPattern = join(variantDir, 'segment%03d.ts')
    const playlistPath = join(variantDir, 'index.m3u8')

    let command = ffmpeg(inputPath)
      .videoCodec('libx264')
      .outputOptions([
        '-preset',
        'veryfast',
        '-profile:v',
        'main',
        '-pix_fmt',
        'yuv420p',
        // Cap height; never upscale; keep even dimensions for yuv420p.
        '-vf',
        `scale=-2:'min(${variant.height},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
        '-b:v',
        variant.videoBitrate,
        '-maxrate',
        variant.videoBitrate,
        '-bufsize',
        String(Number.parseInt(variant.videoBitrate, 10) * 2) + 'k',
        '-g',
        '48',
        '-keyint_min',
        '48',
        '-sc_threshold',
        '0',
        '-hls_time',
        '2',
        '-hls_playlist_type',
        'vod',
        '-hls_segment_filename',
        segmentPattern,
        '-hls_flags',
        'independent_segments',
      ])

    if (withAudio) {
      command = command
        .audioCodec('aac')
        .audioBitrate(variant.audioBitrate)
        .outputOptions(['-ac', '2'])
    } else {
      command = command.noAudio()
    }

    command
      .output(playlistPath)
      .on('start', (cmd) => console.log(`  $ ${cmd}`))
      .on('progress', (p) => {
        if (p.percent != null) {
          process.stdout.write(
            `\r  ${variant.name}: ${Math.min(100, p.percent).toFixed(0)}%   `,
          )
        }
      })
      .on('end', () => {
        process.stdout.write('\n')
        resolveEncode({
          name: variant.name,
          bandwidth: variant.bandwidth,
          playlist: `${variant.name}/index.m3u8`,
        })
      })
      .on('error', reject)
      .run()
  })
}

function writeMasterPlaylist(outDir, variants, widthByName) {
  const lines = ['#EXTM3U', '#EXT-X-VERSION:3']

  for (const v of variants) {
    const res = widthByName[v.name]
    const resolution = res ? `,RESOLUTION=${res.width}x${res.height}` : ''
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${v.bandwidth},AVERAGE-BANDWIDTH=${v.bandwidth}${resolution}`,
    )
    lines.push(v.playlist)
  }

  writeFileSync(join(outDir, 'master.m3u8'), lines.join('\n') + '\n')
}

async function readVariantResolution(variantDir) {
  const files = readdirSync(variantDir).filter((f) => f.endsWith('.ts'))
  if (files.length === 0) return null
  const data = await probe(join(variantDir, files[0]))
  const stream = videoStream(data)
  if (!stream?.width || !stream?.height) return null
  return { width: stream.width, height: stream.height }
}

async function transcodeFile(inputPath, id) {
  const outDir = join(outputRoot, id)

  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true })
  }
  mkdirSync(outDir, { recursive: true })

  console.log(`\n→ ${basename(inputPath)} → output/${id}/`)

  const meta = await probe(inputPath)
  const withAudio = hasAudioStream(meta)
  const src = videoStream(meta)
  console.log(
    `  ${src?.width}x${src?.height}${withAudio ? ' + audio' : ' (no audio)'}`,
  )

  const encoded = []
  const widthByName = {}

  for (const variant of VARIANTS) {
    // Skip ladder rungs taller than the source.
    if (src?.height && src.height < variant.height * 0.9) {
      console.log(`  skip ${variant.name} (source shorter than target)`)
      continue
    }

    const variantDir = join(outDir, variant.name)
    const result = await encodeVariant(inputPath, variantDir, variant, withAudio)
    encoded.push(result)

    const res = await readVariantResolution(variantDir)
    if (res) widthByName[variant.name] = res
  }

  if (encoded.length === 0) {
    throw new Error(`No variants encoded for ${id}`)
  }

  writeMasterPlaylist(outDir, encoded, widthByName)
  console.log(`  wrote output/${id}/master.m3u8 (${encoded.length} variants)`)
  return outDir
}

function resolveJobs(argv) {
  if (argv.length === 0) {
    return DEFAULT_VIDEOS.map((v) => ({
      id: v.id,
      inputPath: join(sourceDir, v.source),
    }))
  }

  return argv.map((arg) => {
    const inputPath = resolve(arg)
    const id = basename(inputPath, extname(inputPath))
      .toLowerCase()
      .replace(/\s+/g, '-')
    return { id, inputPath }
  })
}

async function main() {
  const jobs = resolveJobs(process.argv.slice(2))
  mkdirSync(outputRoot, { recursive: true })

  for (const job of jobs) {
    if (!existsSync(job.inputPath)) {
      console.warn(`skip missing: ${job.inputPath}`)
      continue
    }
    await transcodeFile(job.inputPath, job.id)
  }

  console.log('\nDone. Upload with: npm run upload-hls')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
