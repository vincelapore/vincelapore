'use client'
import { TextEffect } from '@/components/ui/text-effect'
import { useIntroReady } from '@/components/intro-loader'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const introReady = useIntroReady()
  const pathname = usePathname()

  if (pathname === '/about') {
    return null
  }

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          Vince Lapore
        </Link>
        {introReady ? (
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.15}
          >
            Junior Product Engineer
          </TextEffect>
        ) : (
          <p className="text-zinc-600 opacity-0 dark:text-zinc-500">
            Junior Product Engineer
          </p>
        )}
      </div>
    </header>
  )
}
