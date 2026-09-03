'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export const PAGE_VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export const PAGE_VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export const PAGE_TRANSITION_SECTION = {
  duration: 0.3,
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
