/**
 * Upload HLS output (master .m3u8 + variant playlists + .ts segments) to Vercel Blob.
 *
 * Usage: node --env-file=.env.local --experimental-default-type=module scripts/upload.js
 *
 * Requires BLOB_READ_WRITE_TOKEN. Preserves relative paths under hls/<id>/ so
 * master.m3u8 can resolve 720p/index.m3u8 and segment URIs.
 */
import { put } from '@vercel/blob'
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs'
import { basename, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '../..')
const outputRoot = join(root, 'output')

/** Blob pathname prefix — keeps HLS trees grouped and relative-path safe. */
const BLOB_PREFIX = 'hls'

function contentTypeFor(filePath) {
  if (filePath.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl'
  if (filePath.endsWith('.ts')) return 'video/mp2t'
  return 'application/octet-stream'
}

function walkFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkFiles(full))
    } else if (entry.isFile()) {
      results.push(full)
    }
  }
  return results
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

async function uploadVideoDir(id) {
  const localDir = join(outputRoot, id)
  const files = walkFiles(localDir).sort((a, b) => {
    // Upload segments/playlists before master so the tree is complete when logged.
    const aMaster = basename(a) === 'master.m3u8'
    const bMaster = basename(b) === 'master.m3u8'
    if (aMaster === bMaster) return a.localeCompare(b)
    return aMaster ? 1 : -1
  })

  if (files.length === 0) {
    console.warn(`skip empty: output/${id}`)
    return null
  }

  console.log(`\n→ ${id} (${files.length} files)`)

  let masterUrl = null

  for (const filePath of files) {
    const rel = relative(localDir, filePath).split(sep).join('/')
    const pathname = `${BLOB_PREFIX}/${id}/${rel}`
    const size = statSync(filePath).size

    const blob = await put(pathname, createReadStream(filePath), {
      access: 'public',
      contentType: contentTypeFor(filePath),
      addRandomSuffix: false,
      allowOverwrite: true,
      multipart: size > 4.5 * 1024 * 1024,
    })

    console.log(`  ${rel} (${formatBytes(size)}) → ${blob.url}`)

    if (basename(filePath) === 'master.m3u8') {
      masterUrl = blob.url
    }
  }

  return masterUrl
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN (load .env.local)')
  }

  if (!existsSync(outputRoot)) {
    throw new Error('No ./output directory — run npm run transcode first')
  }

  const ids = readdirSync(outputRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  if (ids.length === 0) {
    throw new Error('./output is empty — run npm run transcode first')
  }

  const masters = {}

  for (const id of ids) {
    const url = await uploadVideoDir(id)
    if (url) masters[id] = url
  }

  console.log('\n── Public master playlist URLs ──')
  for (const [id, url] of Object.entries(masters)) {
    console.log(`${id}: ${url}`)
  }

  console.log('\nPaste into app/data.ts (src):\n')
  for (const [id, url] of Object.entries(masters)) {
    console.log(`  // ${id}`)
    console.log(`  video: { src: '${url}', width: …, height: … },`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
