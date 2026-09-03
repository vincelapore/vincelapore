import { PROJECTS, WORK_EXPERIENCE } from '@/app/data'

/** Unique hover-preview video URLs used across the site. */
export function getHoverVideoUrls() {
  const urls = new Set<string>()

  for (const project of PROJECTS) {
    if (project.video) urls.add(project.video.src)
  }

  for (const job of WORK_EXPERIENCE) {
    if (job.video) urls.add(job.video.src)
  }

  return [...urls]
}

const warmed = new Map<string, HTMLVideoElement>()

function getHost() {
  let host = document.getElementById('video-preload-host')
  if (!host) {
    host = document.createElement('div')
    host.id = 'video-preload-host'
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText =
      'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;left:-9999px;top:0'
    document.body.appendChild(host)
  }
  return host
}

export function getWarmedVideo(url: string) {
  return warmed.get(url) ?? null
}

/** Get or create a warmed video element for a URL (does not wait for buffer). */
export function ensureWarmedVideo(url: string) {
  const existing = warmed.get(url)
  if (existing) return existing

  const host = getHost()
  const video = document.createElement('video')
  video.preload = 'auto'
  video.muted = true
  video.defaultMuted = true
  video.loop = true
  video.playsInline = true
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  video.setAttribute('muted', '')
  video.src = url
  warmed.set(url, video)
  host.appendChild(video)
  video.load()
  return video
}

/** Park a warmed video back in the offscreen host after hover. */
export function parkWarmedVideo(video: HTMLVideoElement) {
  video.pause()
  try {
    video.currentTime = 0
  } catch {
    // ignore
  }
  video.className = ''
  video.removeAttribute('style')
  getHost().appendChild(video)
}

/** Warm + prime decoders so the first hover can play without a cold start. */
export function preloadVideos(urls: string[]) {
  if (typeof document === 'undefined' || urls.length === 0) {
    return Promise.resolve()
  }

  const host = getHost()

  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const existing = warmed.get(url)
          if (existing && existing.readyState >= 3) {
            resolve()
            return
          }

          const video = existing ?? document.createElement('video')
          video.preload = 'auto'
          video.muted = true
          video.defaultMuted = true
          video.loop = true
          video.playsInline = true
          video.setAttribute('playsinline', '')
          video.setAttribute('webkit-playsinline', '')
          video.setAttribute('muted', '')

          let settled = false
          const finish = () => {
            if (settled) return
            settled = true
            // Prime the decoder — preload alone often isn't enough for instant play().
            void video
              .play()
              .then(() => {
                video.pause()
                video.currentTime = 0
              })
              .catch(() => {})
              .finally(resolve)
          }

          video.addEventListener('canplaythrough', finish, { once: true })
          video.addEventListener('error', finish, { once: true })
          window.setTimeout(finish, 8000)

          if (!existing) {
            warmed.set(url, video)
            host.appendChild(video)
            video.src = url
          }

          video.load()
        }),
    ),
  ).then(() => undefined)
}
