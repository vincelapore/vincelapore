'use client'

import { Spotlight } from '@/components/ui/spotlight'
import { useHoverVideoPreview } from '@/components/hover-video-preview'
import { WORK_EXPERIENCE } from '@/app/data'

export function WorkExperienceList() {
  const { showPreview, hidePreview, preview } = useHoverVideoPreview()

  return (
    <div className="flex flex-col space-y-2">
      {WORK_EXPERIENCE.map((job) => {
        const body = (
          <>
            <Spotlight
              className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
              size={64}
            />
            <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
              <div className="relative flex w-full flex-row justify-between gap-4">
                <div>
                  <h4 className="font-normal dark:text-zinc-100">{job.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400">{job.company}</p>
                  {job.description ? (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {job.description}
                    </p>
                  ) : null}
                  {job.highlights?.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {job.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {job.start || job.end ? (
                  <p className="shrink-0 text-zinc-600 dark:text-zinc-400">
                    {job.start}
                    {job.start && job.end ? ' - ' : null}
                    {job.end}
                  </p>
                ) : null}
              </div>
            </div>
          </>
        )

        const className =
          'relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30'

        if (job.link) {
          return (
            <a
              key={job.id}
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              onMouseEnter={(event) => showPreview(job, event)}
              onMouseLeave={hidePreview}
            >
              {body}
            </a>
          )
        }

        return (
          <div
            key={job.id}
            className={className}
            onMouseEnter={(event) => showPreview(job, event)}
            onMouseLeave={hidePreview}
          >
            {body}
          </div>
        )
      })}
      {preview}
    </div>
  )
}
