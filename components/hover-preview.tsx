'use client'

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import type { HoverPreview as HoverPreviewData } from '@/app/data'

/** Longest side of the hover preview; aspect follows the GIF. */
const PREVIEW_MAX = 352
const OFFSET = 8
const PAD = 8

function getPreviewSize(width: number, height: number) {
  const scale = PREVIEW_MAX / Math.max(width, height)
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
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
  originX: number
  originY: number
  width: number
  height: number
}

type HoverPreviewProps = {
  preview?: HoverPreviewData
  label: string
  children: ReactElement<{
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
  }>
}

export function HoverPreview({ preview, label, children }: HoverPreviewProps) {
  const [active, setActive] = useState<ActivePreview | null>(null)
  const [mounted, setMounted] = useState(false)
  const sizeRef = useRef({ width: PREVIEW_MAX, height: PREVIEW_MAX })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!active) return

    const onMove = (event: MouseEvent) => {
      const { width, height } = sizeRef.current
      const next = getPreviewPosition(
        event.clientX,
        event.clientY,
        width,
        height,
      )
      x.set(next.x)
      y.set(next.y)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [active, x, y])

  if (!preview) {
    return children
  }

  const showPreview = (event: React.MouseEvent) => {
    const size = getPreviewSize(preview.width, preview.height)
    sizeRef.current = size

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
      originX,
      originY,
      width: size.width,
      height: size.height,
    })
  }

  const hidePreview = () => {
    setActive(null)
  }

  const reference = cloneElement(children, {
    onMouseEnter: (event: React.MouseEvent) => {
      children.props.onMouseEnter?.(event)
      showPreview(event)
    },
    onMouseLeave: (event: React.MouseEvent) => {
      children.props.onMouseLeave?.(event)
      hidePreview()
    },
  })

  if (!isValidElement(reference)) {
    return children
  }

  const portal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active ? (
          <motion.div
            key={label}
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
            <Image
              src={preview.src}
              width={active.width}
              height={active.height}
              alt={label}
              unoptimized
              className="h-full w-full object-cover"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    )

  return (
    <>
      {reference}
      {portal}
    </>
  )
}
