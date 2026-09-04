import Link from 'next/link'
import { PageEnter, PageSection } from '@/components/page-enter'

export default function NotFound() {
  return (
    <PageEnter className="space-y-6">
      <PageSection>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">404</p>
        <h1 className="mt-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Page not found
        </h1>
      </PageSection>
      <PageSection>
        <p className="text-zinc-600 dark:text-zinc-400">
          This URL doesn&apos;t match anything on the site. It may have moved,
          or the link might be wrong.
        </p>
      </PageSection>
      <PageSection>
        <Link
          href="/"
          className="inline-flex text-zinc-900 underline underline-offset-4 decoration-zinc-300 transition-colors hover:decoration-zinc-900 dark:text-zinc-50 dark:decoration-zinc-600 dark:hover:decoration-zinc-200"
        >
          Back home
        </Link>
      </PageSection>
    </PageEnter>
  )
}
