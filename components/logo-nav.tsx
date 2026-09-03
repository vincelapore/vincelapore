'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { LogoMark } from '@/components/logo-mark'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/photos', label: 'photos' },
  { href: '/about', label: 'about' },
]

export function LogoNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="relative mx-auto flex w-full max-w-screen-sm items-center justify-between gap-4 px-4 pt-5 sm:pt-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 9, -7, 5, -3, 0] }}
            transition={{
              duration: 0.85,
              delay: 0.45,
              ease: 'easeInOut',
            }}
          >
            <Link href="/" aria-label="Vince Lapore home" className="block outline-none">
              <LogoMark className="h-9 w-auto sm:h-10" />
            </Link>
          </motion.div>

          <nav
            className="flex shrink-0 items-center justify-end gap-4 sm:gap-5"
            aria-label="Primary"
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
                  className={cn(
                    'text-sm lowercase text-white transition-opacity',
                    active ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {children}
    </>
  )
}
