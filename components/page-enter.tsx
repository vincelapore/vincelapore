'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export const PAGE_VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

export const PAGE_VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export const PAGE_TRANSITION_SECTION = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
}

type PageEnterProps = {
  children: React.ReactNode
  className?: string
}

export function PageEnter({ children, className }: PageEnterProps) {
  return (
    <motion.main
      className={cn(className)}
      variants={PAGE_VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.main>
  )
}

type PageSectionProps = {
  children: React.ReactNode
  className?: string
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <motion.section
      className={cn(className)}
      variants={PAGE_VARIANTS_SECTION}
      transition={PAGE_TRANSITION_SECTION}
    >
      {children}
    </motion.section>
  )
}
