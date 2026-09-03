export const metadata = {
  title: 'About',
  description: 'About Vince Lapore, Junior Product Engineer.',
}

export default function AboutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-lg font-medium">About</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        I&apos;m Vince Lapore, a Junior Product Engineer with a Computer Science
        background from the University of Queensland. I design and ship products
        end-to-end — from database and billing to UI, SEO, and growth.
      </p>
      <p className="text-zinc-600 dark:text-zinc-400">
        Based in Australia (relocating to Melbourne in 2026). Currently building
        Grademate and working with creative clients through Lamoise Studio.
      </p>
    </section>
  )
}
