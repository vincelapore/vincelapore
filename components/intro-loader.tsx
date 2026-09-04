'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { useTheme } from 'next-themes'
import { LogoMark } from '@/components/logo-mark'

const SESSION_KEY = 'vl-intro-seen-v10'

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
  const { resolvedTheme } = useTheme()
  const overlayRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLHeadingElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLSpanElement>(null)
  const vRef = useRef<HTMLSpanElement>(null)
  const inceRef = useRef<HTMLSpanElement>(null)
  const aporeRef = useRef<HTMLSpanElement>(null)
  const ranRef = useRef(false)

  const showOverlay = phase === 'pending' || phase === 'intro'
  const isDark =
    resolvedTheme === 'dark' ||
    (resolvedTheme == null &&
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'))
  const browserColor = isDark ? '#09090b' : '#ffffff'

  useEffect(() => {
    if (!showOverlay) return

    const metas = document.querySelectorAll('meta[name="theme-color"]')
    const previous = Array.from(metas).map((meta) => ({
      meta: meta as HTMLMetaElement,
      content: meta.getAttribute('content'),
      media: meta.getAttribute('media'),
    }))

    if (metas.length === 0) {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = browserColor
      document.head.appendChild(meta)
      return () => {
        meta.remove()
      }
    }

    metas.forEach((meta) => {
      meta.setAttribute('content', browserColor)
      meta.removeAttribute('media')
    })

    return () => {
      previous.forEach(({ meta, content, media }) => {
        if (content != null) meta.setAttribute('content', content)
        else meta.removeAttribute('content')
        if (media != null) meta.setAttribute('media', media)
        else meta.removeAttribute('media')
      })
    }
  }, [showOverlay, browserColor])

  useLayoutEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    if (prefersReducedMotion() || hasSeenIntro()) {
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

    // Hide the "v" so only "ince" contributes width while we measure.
    gsap.set(v, {
      opacity: 0,
      width: 0,
      overflow: 'hidden',
      display: 'inline-block',
    })
    gsap.set(mark, { opacity: 0, scale: 0.94 })

    // Measure full "ince" width, then clear for the typewriter reveal.
    const inceWidth = ince.offsetWidth
    ince.textContent = ''
    gsap.set(ince, { opacity: 1 })

    const logoWidth = mark.offsetWidth
    const tuck = Math.round(logoWidth * 0.34)
    // Park "ince" just past the logo's right edge, with the "i" slightly under it.
    const inceStartX = logoWidth + inceWidth - Math.round(logoWidth * 0.22)

    // `first` is right-anchored (right-full), so raw width growth expands left.
    // Shift x with the typed width so the left edge stays fixed and letters
    // grow rightward (i → in → inc → ince, center-outward).
    const typeX = (currentWidth: number) =>
      inceStartX - (inceWidth - currentWidth)

    // yPercent keeps vertical centering when GSAP owns the transform.
    gsap.set(first, { x: typeX(0), yPercent: -50, top: '50%' })
    gsap.set(apore, { opacity: 0, x: -tuck + 12, yPercent: -50, top: '50%' })

    let finished = false

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      // Beat structure: mark → type "ince" → assemble "vince" → "apore" → hold.
      // Tuned for ~3s total — confident, not leisurely. Employers shouldn't wait.
      intro
        .to(mark, {
          opacity: 1,
          scale: 1,
          duration: 0.32,
          ease: 'power2.out',
        })
        .to({}, { duration: 0.1 })

      for (const step of ['i', 'in', 'inc', 'ince'] as const) {
        intro
          .call(() => {
            ince.textContent = step
            gsap.set(first, { x: typeX(ince.offsetWidth) })
          })
          .to({}, { duration: 0.11 })
      }

      intro
        .to({}, { duration: 0.22 })
        .to(first, {
          x: tuck,
          duration: 0.85,
          ease: 'power3.inOut',
        })
        .to(
          v,
          {
            opacity: 1,
            width: 'auto',
            duration: 0.4,
            ease: 'power2.out',
          },
          '<0.3',
        )
        .to(
          apore,
          {
            opacity: 1,
            x: -tuck,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.15',
        )
        .to({}, { duration: 0.35 })

      void intro.then(() => {
        const exit = gsap.timeline({
          onComplete: () => {
            finished = true
            markIntroSeen()
            setPhase('done')
          },
        })

        // Blur the pieces themselves — never filter the <h1> parent.
        // Filtering a parent of mix-blend-difference flattens the blend
        // (invert vanishes / light-mode artifacts). Keep invert intact.
        exit
          .to([first, mark, apore], {
            opacity: 0,
            y: -8,
            filter: 'blur(6px)',
            duration: 0.4,
            ease: 'power2.inOut',
          })
          .to(
            overlay,
            {
              yPercent: -100,
              duration: 0.55,
              ease: 'power3.inOut',
            },
            '-=0.18',
          )
      })
    })

    return () => {
      ince.textContent = 'ince'
      if (finished) ctx.kill()
      else ctx.revert()
    }
  }, [phase])

  const ready = phase === 'done'

  return (
    <IntroReadyContext.Provider value={ready}>
      {showOverlay ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex isolate items-center justify-center bg-white dark:bg-zinc-950"
          aria-hidden={phase !== 'intro'}
          role={phase === 'intro' ? 'status' : undefined}
        >
          <h1
            ref={wordRef}
            className="relative inline-flex items-center text-[1.65rem] font-semibold tracking-tight text-white lowercase sm:text-[1.9rem]"
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
              <span
                ref={inceRef}
                className="inline-block will-change-transform"
              >
                ince
              </span>
            </span>

            <span
              ref={markRef}
              className="relative z-0 inline-flex text-zinc-950 will-change-transform dark:text-white"
            >
              <LogoMark className="h-12 w-auto sm:h-14" />
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
