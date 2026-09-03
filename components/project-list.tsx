'use client'

import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { PROJECTS } from '@/app/data'

type Project = (typeof PROJECTS)[number]

const PREVIEW_WIDTH = 352
const PREVIEW_HEIGHT = 198

export function ProjectList() {
  const [active, setActive] = useState<Project | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 280, damping: 28, mass: 0.6 })
  const springY = useSpring(mouseY, { stiffness: 280, damping: 28, mass: 0.6 })
  const x = useTransform(springX, (value) => value - PREVIEW_WIDTH / 2)
  const y = useTransform(springY, (value) => value - PREVIEW_HEIGHT / 2)

  const handleMove = (event: React.MouseEvent) => {
    mouseX.set(event.clientX)
    mouseY.set(event.clientY)
  }

  const showPreview = (project: Project, event: React.MouseEvent) => {
    if (!project.video) {
      setActive(null)
      return
    }
    mouseX.set(event.clientX)
    mouseY.set(event.clientY)
    setActive(project)
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {})
    })
  }

  return (
    <div onMouseMove={handleMove}>
      <div className="flex flex-col space-y-6">
        {PROJECTS.map((project) => (
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block px-1"
            onMouseEnter={(event) => showPreview(project, event)}
            onMouseLeave={() => {
              setActive(null)
              if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
              }
            }}
          >
            <span className="font-base relative inline-block font-[450] text-zinc-900 dark:text-zinc-50">
              {project.name}
              <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50" />
            </span>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
          </a>
        ))}
      </div>

      <AnimatePresence>
        {active?.video ? (
          <motion.div
            key={active.id}
            className="pointer-events-none fixed top-0 left-0 z-40 hidden overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10 md:block dark:ring-white/10"
            style={{ x, y, width: PREVIEW_WIDTH }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              ref={videoRef}
              key={active.video}
              src={active.video}
              muted
              loop
              playsInline
              preload="auto"
              className="aspect-video h-auto w-full bg-zinc-100 object-cover dark:bg-zinc-900"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
