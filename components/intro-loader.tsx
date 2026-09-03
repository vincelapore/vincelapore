'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { LogoMark } from '@/components/logo-mark'
import { getHoverVideoUrls, preloadVideos } from '@/lib/preload-videos'

const SESSION_KEY = 'vl-intro-seen-v5'

const IntroReadyContext = createContext(false)

export function useIntroReady() {
  return useContext(IntroReadyContext)
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // ignore
  }
}

export function IntroLoader({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'pending' | 'intro' | 'done'>('pending')
  const overlayRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLHeadingElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLSpanElement>(null)
  const vRef = useRef<HTMLSpanElement>(null)
  const inceRef = useRef<HTMLSpanElement>(null)
  const aporeRef = useRef<HTMLSpanElement>(null)
  const ranRef = useRef(false)

  useLayoutEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    const urls = getHoverVideoUrls()

    if (prefersReducedMotion() || hasSeenIntro()) {
      void preloadVideos(urls)
      setPhase('done')
      return
    }

    setPhase('intro')
  }, [])

  useLayoutEffect(() => {
    if (phase !== 'intro') return

    const overlay = overlayRef.current
    const word = wordRef.current
    const mark = markRef.current
    const first = firstRef.current
    const v = vRef.current
    const ince = inceRef.current
    const apore = aporeRef.current
    if (!overlay || !word || !mark || !first || !v || !ince || !apore) return

    const videosReady = preloadVideos(getHoverVideoUrls())

    // Hide the "v" so only "ince" contributes width while we measure.
    gsap.set(v, { opacity: 0, width: 0, overflow: 'hidden', display: 'inline-block' })
    gsap.set(ince, { opacity: 0 })
    gsap.set(mark, { opacity: 0, scale: 0.9 })

    const logoWidth = mark.offsetWidth
    const inceWidth = ince.offsetWidth
    const tuck = Math.round(logoWidth * 0.34)
    // Park "ince" just past the logo's right edge, with the "i" slightly under it.
    const inceStartX = logoWidth + inceWidth - Math.round(logoWidth * 0.22)

    // yPercent keeps vertical centering when GSAP owns the transform.
    gsap.set(first, { x: inceStartX, yPercent: -50, top: '50%' })
    gsap.set(apore, { opacity: 0, x: -tuck + 12, yPercent: -50, top: '50%' })

    let finished = false

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      intro
        .to(mark, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
        })
        .to(
          ince,
          {
            opacity: 1,
            duration: 0.4,
          },
          '-=0.12',
        )
        .to(
          first,
          {
            x: tuck,
            duration: 0.9,
            ease: 'power3.inOut',
          },
          '+=0.15',
        )
        .to(
          v,
          {
            opacity: 1,
            width: 'auto',
            duration: 0.35,
            ease: 'power2.out',
          },
          '<0.3',
        )
        .to(
          apore,
          {
            opacity: 1,
            x: -tuck,
            duration: 0.45,
          },
          '-=0.05',
        )
        .to({}, { duration: 0.45 })

      void intro.then(async () => {
        await Promise.race([
          videosReady,
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, 2500)
          }),
        ])

        const exit = gsap.timeline({
          onComplete: () => {
            finished = true
            markIntroSeen()
            setPhase('done')
          },
        })

        // Page (including fixed nav) stays fully painted underneath —
        // only the overlay exits, so the navbar doesn't fade/jump in.
        exit
          .to(word, {
            opacity: 0,
            y: -16,
            filter: 'blur(6px)',
            duration: 0.4,
            ease: 'power2.in',
          })
          .to(
            overlay,
            {
              yPercent: -100,
              duration: 0.75,
              ease: 'power4.inOut',
            },
            '-=0.1',
          )
      })
    })

    return () => {
      if (finished) ctx.kill()
      else ctx.revert()
    }
  }, [phase])

  const showOverlay = phase === 'pending' || phase === 'intro'
  const ready = phase === 'done'

  return (
    <IntroReadyContext.Provider value={ready}>
      {showOverlay ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950"
          aria-hidden={phase !== 'intro'}
          role={phase === 'intro' ? 'status' : undefined}
        >
          <h1
            ref={wordRef}
            className="relative inline-flex items-center text-[1.65rem] font-semibold tracking-tight lowercase text-white sm:text-[1.9rem]"
            style={phase === 'pending' ? { opacity: 0 } : undefined}
          >
            <span
              ref={firstRef}
              className="absolute right-full z-10 flex mix-blend-difference will-change-transform"
            >
              <span
                ref={vRef}
                className="inline-block will-change-[width,opacity]"
              >
                v
              </span>
              <span ref={inceRef} className="inline-block will-change-transform">
                ince
              </span>
            </span>

            <span ref={markRef} className="relative z-0 inline-flex will-change-transform">
              <LogoMark className="h-12 w-auto sm:h-14" fill="white" />
            </span>

            <span
              ref={aporeRef}
              className="absolute left-full z-10 mix-blend-difference will-change-transform"
            >
              apore
            </span>
          </h1>
        </div>
      ) : null}
      {children}
    </IntroReadyContext.Provider>
  )
}
