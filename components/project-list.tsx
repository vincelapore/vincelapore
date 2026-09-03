'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { HoverPreview } from '@/components/hover-preview'
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
  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <HoverPreview
            key={project.id}
            preview={project.preview}
            label={`${project.name} preview`}
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group -mx-3 block rounded-md px-3 py-2 transition-colors duration-200 hover:bg-zinc-200/80 dark:hover:bg-zinc-800"
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
                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition-colors group-hover:bg-zinc-300/60 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </a>
          </HoverPreview>
        ))}
      </div>
    </div>
  )
}
