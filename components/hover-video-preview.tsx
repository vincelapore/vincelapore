'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import type { HoverVideo } from '@/app/data'
import { ensureWarmedVideo, parkWarmedVideo } from '@/lib/preload-videos'

/** Longest side of the hover preview; aspect follows the video file. */
const PREVIEW_MAX = 352
/** Matches Floating UI offset(8) + bottom-start on omarabdulrahim.com */
const OFFSET = 8
const PAD = 8

function getPreviewSize(videoWidth: number, videoHeight: number) {
  const scale = PREVIEW_MAX / Math.max(videoWidth, videoHeight)
  return {
    width: Math.round(videoWidth * scale),
    height: Math.round(videoHeight * scale),
  }
}

function getPreviewPosition(
  clientX: number,
  clientY: number,
  width: number,
  height: number,
) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  let x = clientX
  let y = clientY + OFFSET

  if (x + width > vw - PAD) {
    x = clientX - width
  }

  if (y + height > vh - PAD) {
    y = clientY - OFFSET - height
  }

  x = Math.min(Math.max(x, PAD), vw - PAD - width)
  y = Math.min(Math.max(y, PAD), vh - PAD - height)

  return { x, y }
}

type ActivePreview = {
  id: string
  video: HoverVideo
  originX: number
  originY: number
  width: number
  height: number
}

export function useHoverVideoPreview() {
  const [active, setActive] = useState<ActivePreview | null>(null)
  const [mounted, setMounted] = useState(false)
  const slotRef = useRef<HTMLDivElement>(null)
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)
  const sizeRef = useRef({ width: PREVIEW_MAX, height: PREVIEW_MAX })
  const pointerRef = useRef({ x: 0, y: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!active) return

    const onMove = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      const { width, height } = sizeRef.current
      const next = getPreviewPosition(event.clientX, event.clientY, width, height)
      x.set(next.x)
      y.set(next.y)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [active, x, y])

  // Move the already-buffered <video> into the preview — don't create a new one.
  useLayoutEffect(() => {
    if (!active) return

    const slot = slotRef.current
    const warmed = ensureWarmedVideo(active.video.src)
    if (!slot) return

    warmed.className = 'block h-full w-full object-cover'
    warmed.style.display = 'block'
    warmed.style.width = '100%'
    warmed.style.height = '100%'
    warmed.style.objectFit = 'cover'
    slot.replaceChildren(warmed)
    activeVideoRef.current = warmed

    const play = () => {
      try {
        warmed.currentTime = 0
      } catch {
        // ignore
      }
      void warmed.play().catch(() => {})
    }

    if (warmed.readyState >= 2) {
      play()
    } else {
      warmed.addEventListener('loadeddata', play, { once: true })
      warmed.addEventListener('canplay', play, { once: true })
    }

    return () => {
      activeVideoRef.current = null
      // Keep the node in the exiting preview for the leave animation, then park it.
      window.setTimeout(() => {
        parkWarmedVideo(warmed)
      }, 320)
    }
  }, [active])

  const showPreview = (
    item: { id: string; video?: HoverVideo },
    event: React.MouseEvent,
  ) => {
    if (!item.video) {
      setActive(null)
      return
    }

    const size = getPreviewSize(item.video.width, item.video.height)
    sizeRef.current = size
    pointerRef.current = { x: event.clientX, y: event.clientY }

    const next = getPreviewPosition(
      event.clientX,
      event.clientY,
      size.width,
      size.height,
    )
    x.set(next.x)
    y.set(next.y)

    const originX = Math.min(
      Math.max(event.clientX - next.x, 0),
      size.width,
    )
    const originY = Math.min(
      Math.max(event.clientY - next.y, 0),
      size.height,
    )

    setActive({
      id: item.id,
      video: item.video,
      originX,
      originY,
      width: size.width,
      height: size.height,
    })
  }

  const hidePreview = () => {
    setActive(null)
  }

  const preview =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active ? (
          <motion.div
            key={active.id}
            className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-md bg-zinc-100 shadow-lg ring-1 ring-black/10 md:block dark:bg-zinc-900 dark:ring-white/10"
            style={{
              left: x,
              top: y,
              width: active.width,
              height: active.height,
              transformOrigin: `${active.originX}px ${active.originY}px`,
            }}
            initial={{ opacity: 0, scaleX: 0.08, scaleY: 0.08 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleX: 0.08, scaleY: 0.08 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div ref={slotRef} className="h-full w-full" />
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    )

  return { showPreview, hidePreview, preview }
}
