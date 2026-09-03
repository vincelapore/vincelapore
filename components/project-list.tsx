'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useHoverVideoPreview } from '@/components/hover-video-preview'
import { PROJECTS } from '@/app/data'

function ProjectImage({
  src,
  srcLight,
  alt,
}: {
  src?: string
  srcLight?: string
  alt: string
}) {
  const [failed, setFailed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && resolvedTheme === 'light'
  const activeSrc = isLight && srcLight ? srcLight : src

  useEffect(() => {
    setFailed(false)
  }, [activeSrc])

  return (
    <div className="relative mb-3 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
      {activeSrc && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={activeSrc}
          src={activeSrc}
          alt={alt}
          onError={() => setFailed(true)}
          className="aspect-video h-auto w-full object-cover"
        />
      ) : (
        <div className="aspect-video" />
      )}
      {src && srcLight ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={isLight ? src : srcLight}
          alt=""
          aria-hidden
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      ) : null}
    </div>
  )
}

export function ProjectList() {
  const { showPreview, hidePreview, preview } = useHoverVideoPreview()

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            onMouseEnter={(event) => showPreview(project, event)}
            onMouseLeave={hidePreview}
          >
            <ProjectImage
              src={project.image}
              srcLight={project.imageLight}
              alt={project.name}
            />
            <span className="font-base relative inline-block font-[450] text-zinc-900 dark:text-zinc-50">
              {project.name}
            </span>
            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </a>
        ))}
      </div>
      {preview}
    </div>
  )
}
