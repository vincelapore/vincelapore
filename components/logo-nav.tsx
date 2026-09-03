'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { LogoMark } from '@/components/logo-mark'
import { useIntroReady } from '@/components/intro-loader'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
]

const SCROLL_THRESHOLD = 28

export function LogoNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const introReady = useIntroReady()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD)
  })

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="relative mx-auto w-full max-w-screen-sm px-4 pt-5 sm:pt-6">
          <div className="relative flex h-8 items-center">
            <motion.div
              className="absolute top-1/2 left-0"
              initial={false}
              animate={{
                left: scrolled ? '50%' : '0%',
                x: scrolled ? '-50%' : '0%',
                y: '-50%',
              }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 32,
                mass: 0.7,
              }}
            >
              <motion.div
                initial={false}
                animate={
                  introReady
                    ? { rotate: [0, -10, 9, -7, 5, -3, 0] }
                    : { rotate: 0 }
                }
                transition={{
                  duration: 0.85,
                  delay: 0.15,
                  ease: 'easeInOut',
                }}
              >
                <Link
                  href="/"
                  aria-label="Vince Lapore home"
                  className="block outline-none"
                >
                  <LogoMark
                    className="h-5 w-auto text-white sm:h-6"
                    fill="currentColor"
                  />
                </Link>
              </motion.div>
            </motion.div>

            <motion.nav
              className="ml-auto flex shrink-0 items-center justify-end gap-4 sm:gap-5"
              aria-label="Primary"
              aria-hidden={scrolled}
              initial={false}
              animate={{
                opacity: scrolled ? 0 : 1,
                x: scrolled ? 12 : 0,
                filter: scrolled ? 'blur(4px)' : 'blur(0px)',
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ pointerEvents: scrolled ? 'none' : 'auto' }}
            >
              {LINKS.map((link) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    tabIndex={scrolled ? -1 : undefined}
                    className={cn(
                      'text-sm lowercase text-white transition-opacity',
                      active ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </motion.nav>
          </div>
        </div>
      </header>

      {children}
    </>
  )
}
