'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

type HLSPlayerProps = {
  src: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  controls?: boolean
  poster?: string
}

/**
 * Streams an HLS master playlist (`.m3u8`) via hls.js, with a native
 * `<video>` fallback for Safari / iOS which play HLS without MSE.
 */
export function HLSPlayer({
  src,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  controls = true,
  poster,
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }

    return () => {
      if (hls) {
        hls.destroy()
        hls = null
      } else {
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      poster={poster}
    />
  )
}
