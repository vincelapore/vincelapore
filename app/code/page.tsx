type Project = {
    title: string;
    timeframe: string;
    summary: string;
    stack: string[];
    highlights: string[];
    links?: { label: string; href: string }[];
};

const projects: Project[] = [
    {
        title: "CueBridge · real-time cue synchroniser",
        timeframe: "2025",
        summary:
            "Signal routing layer that keeps lighting, projection, and sound queues aligned across multiple operators during rehearsals.",
        stack: ["Next.js", "TypeScript", "WebSockets", "Redis"],
        highlights: [
            "Designed a latency budget and buffering strategy that keeps state in sync within 120 ms.",
            "Built a declarative cue editor so designers can rearrange whole scenes without touching code.",
            "Deployed a multi-stage preview workflow that mirrors the lighting desk safely."
        ],
        links: [
            {
                label: "Case study",
                href: "mailto:vince@lapore.studio?subject=CueBridge"
            }
        ]
    },
    {
        title: "Ledger Lines · music discovery analytics",
        timeframe: "2024",
        summary:
            "Aggregates streaming and ticketing data for independent artists, producing actionable reports on where to tour next.",
        stack: ["Next.js", "PostgreSQL", "Prisma", "Tailwind"],
        highlights: [
            "Implemented nightly ingestion pipelines with back-pressure aware batching to protect third-party APIs.",
            "Authored a scoring model that surfaces under-served cities using sell-through velocity rather than raw counts.",
            "Shipped a branded dashboard experience with exportable decks for artist managers."
        ],
        links: [
            {
                label: "Product walkthrough",
                href: "mailto:vince@lapore.studio?subject=Ledger%20Lines"
            }
        ]
    },
    {
        title: "Stagehand Toolkit · performer utilities",
        timeframe: "2023",
        summary:
            "Collection of lightweight command-line tools for theatre productions: prompt book diffing, rehearsal timers, and projection compressors.",
        stack: ["Node.js", "Rust", "pnpm workspaces"],
        highlights: [
            "Published four utilities to npm with zero-config installers for stage managers.",
            "Coordinated feedback loops with the production team to prioritise ergonomics over raw feature lists.",
            "Automated release packaging and changelog generation using GitHub Actions."
        ],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/vincelapore/stagehand-toolkit"
            }
        ]
    }
];

const toolbelt = [
    "TypeScript",
    "React & Next.js",
    "Node.js",
    "PostgreSQL",
    "Prisma",
    "Tailwind CSS",
    "Rust",
    "GitHub Actions",
    "Figma",
    "Ableton Live"
];

export const metadata = {
    title: "Code"
};

export default function CodePage() {
    return (
        <section>
            <div>
                <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
                    Code & Systems
                </h1>
                <p className='text-neutral-600 dark:text-neutral-400'>
                    I design and build digital tools that support rehearsal
                    rooms, touring crews, and independent artists. Below are a
                    few recent builds that show how the engineering practice
                    complements the stage work.
                </p>
            </div>

            <div className='space-y-16'>
                <section className='space-y-8'>
                    <h2 className='text-xl font-semibold tracking-tight'>
                        Featured builds
                    </h2>
                    <div className='space-y-10'>
                        {projects.map((project) => (
                            <article
                                key={project.title}
                                className='space-y-4 rounded-xl border border-neutral-200 p-6 transition hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700'
                            >
                                <header className='space-y-1'>
                                    <p className='text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400'>
                                        {project.timeframe}
                                    </p>
                                    <h3 className='text-2xl font-semibold tracking-tight'>
                                        {project.title}
                                    </h3>
                                </header>
                                <p className='text-neutral-600 dark:text-neutral-400'>
                                    {project.summary}
                                </p>

                                <ul className='list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-300'>
                                    {project.highlights.map((highlight) => (
                                        <li key={highlight}>{highlight}</li>
                                    ))}
                                </ul>

                                <div className='flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400'>
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className='rounded-full border border-neutral-300 px-3 py-1 dark:border-neutral-700'
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {project.links && (
                                    <div className='flex flex-wrap gap-3 text-sm font-medium'>
                                        {project.links.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                className='text-blue-600 transition hover:underline dark:text-blue-400'
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>

                <section className='space-y-4'>
                    <h2 className='text-xl font-semibold tracking-tight'>
                        Toolbelt
                    </h2>
                    <p className='text-neutral-600 dark:text-neutral-400'>
                        These are the languages, frameworks, and creative tools
                        I reach for when turning ideas into reliable systems.
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        {toolbelt.map((item) => (
                            <span
                                key={item}
                                className='rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </section>

                <section className='space-y-4'>
                    <h2 className='text-xl font-semibold tracking-tight'>
                        Collaboration notes
                    </h2>
                    <p className='text-neutral-600 dark:text-neutral-400'>
                        I thrive in cross-disciplinary rooms where designers,
                        writers, engineers, and performers iterate together. If
                        you have a production that needs custom tooling—or a
                        product that could use a dramaturg&apos;s eye—reach out
                        and let&apos;s trade notes.
                    </p>
                    <a
                        href='mailto:vince@lapore.studio'
                        className='inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800'
                    >
                        Email Vince
                    </a>
                </section>
            </div>
        </section>
    );
}
