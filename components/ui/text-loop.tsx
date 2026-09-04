'use client'
import { cn } from '@/lib/utils'
import {
  motion,
  AnimatePresence,
  Transition,
  Variants,
  AnimatePresenceProps,
} from 'motion/react'
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  Children,
} from 'react'

export type TextLoopProps = {
  children: React.ReactNode[]
  className?: string
  interval?: number
  transition?: Transition
  variants?: Variants
  onIndexChange?: (index: number) => void
  trigger?: boolean
  mode?: AnimatePresenceProps['mode']
}

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  variants,
  onIndexChange,
  trigger = true,
  mode = 'popLayout',
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState<number | 'auto'>('auto')
  const measureRef = useRef<HTMLSpanElement>(null)
  const items = Children.toArray(children)

  useEffect(() => {
    if (!trigger) return

    const intervalMs = interval * 1000
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length
        onIndexChange?.(next)
        return next
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [items.length, interval, onIndexChange, trigger])

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
  }, [currentIndex, items])

  const motionVariants: Variants = {
    initial: { y: 12, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -12, opacity: 0 },
  }

  return (
    <motion.div
      className={cn(
        'relative inline-block overflow-hidden whitespace-nowrap align-bottom',
        className,
      )}
      initial={false}
      animate={{ width }}
      transition={transition}
    >
      {/* Off-flow measure so width can animate without jumping */}
      <span
        ref={measureRef}
        className="invisible absolute left-0 top-0 whitespace-nowrap"
        aria-hidden
      >
        {items[currentIndex]}
      </span>
      <AnimatePresence mode={mode} initial={false}>
        <motion.div
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          variants={variants || motionVariants}
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
