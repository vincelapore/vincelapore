import Image from "next/image";
import { BlogPosts } from "app/components/posts";

// ------------------------------
// Data
// ------------------------------

type Featured = {
    title: string;
    blurb: string;
    role: string;
    meta: string;
    image: string;
    alt: string;
    cta: { label: string; href: string };
};

const featured: Featured[] = [
    {
        title: "Prehistoric (Lead: Pete)",
        blurb: "A wild, tender show about survival and memory.",
        role: "Actor",
        meta: "Stage • Voice • Movement",
        image: "/arts/prehistoric/image-1.png",
        alt: "Vince as Pete in Prehistoric under a warm spotlight",
        cta: { label: "Watch 30s reel", href: "/arts#prehistoric" }
    },
    {
        title: "Eighty Six — Spec Library SaaS",
        blurb: "SwiftUI MVP built fast; tested with real bar workflows.",
        role: "Founder / Dev",
        meta: "SwiftUI • Supabase",
        image: "/images/eighty-six.png",
        alt: "Screenshot of the Eighty Six iOS app spec library UI",
        cta: { label: "View case study", href: "/code/eighty-six" }
    },
    {
        title: "Yorick.live — Theatre discovery",
        blurb: "Map + listings to surface indie and student shows.",
        role: "Design / Dev",
        meta: "Next.js • Maps • Design system",
        image: "/images/yorick.png",
        alt: "Yorick.live prototype map with theatre pins",
        cta: { label: "See prototype", href: "/code/yorick" }
    }
];

// ------------------------------
// Components
// ------------------------------

function Hero() {
    return (
        <div>
            <section className='space-y-8'>
                <h1 className='text-2xl font-semibold tracking-tighter'>
                    Hello. I'm Vince.
                </h1>
                <p className='mb-4'>
                    I make software, theatre and music. Hopefully something
                    catches your eye. If not, there's been an error. Email me.
                </p>
            </section>
            <header className='space-y-4'>
                <div className='flex flex-wrap gap-3'>
                    <a
                        href='/arts#reel'
                        className='inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    >
                        Watch reel
                    </a>
                    <a
                        href='/code'
                        className='inline-flex items-center rounded-full bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700'
                    >
                        See projects
                    </a>
                </div>
            </header>
        </div>
    );
}

function FeaturedWork() {
    return (
        <section>
            <h2 className='mb-6 text-xl font-semibold tracking-tight'>
                Featured work
            </h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {featured.map((f) => (
                    <article
                        key={f.title}
                        className='group overflow-hidden rounded-lg border bg-white/50 shadow-sm transition hover:shadow-md dark:bg-neutral-900/50'
                    >
                        <div className='relative aspect-[16/10] overflow-hidden'>
                            <Image
                                src={f.image}
                                alt={f.alt}
                                fill
                                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                            />
                        </div>
                        <div className='p-4'>
                            <h3 className='text-base font-semibold leading-tight'>
                                {f.title}
                            </h3>
                            <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-300'>
                                {f.blurb}
                            </p>
                            <p className='mt-2 text-xs text-neutral-500'>
                                {f.role} • {f.meta}
                            </p>
                            <a
                                href={f.cta.href}
                                className='mt-3 inline-flex items-center text-sm underline underline-offset-2 hover:text-blue-600'
                            >
                                {f.cta.label} →
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function AboutContact() {
    return (
        <section>
            <h2 className='mb-4 text-xl font-semibold tracking-tight'>
                About & Contact
            </h2>
            <ul className='list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300 max-w-prose'>
                <li>
                    Actor & CS student blending performance with product design.
                </li>
                <li>Tools: SwiftUI, Next.js, Supabase, Figma, Ableton.</li>
                <li>
                    Brisbane-based; open to collaboration in theatre and
                    creative tech.
                </li>
            </ul>
            <div className='mt-3 flex flex-wrap gap-3'>
                <a
                    href='mailto:vincelapore@outlook.com'
                    className='underline hover:text-blue-600'
                >
                    Email me
                </a>
                <a
                    href='/Vince_Lapore_Resume.pdf'
                    className='underline hover:text-blue-600'
                >
                    Download CV
                </a>
                <a
                    href='https://github.com/vincelapore'
                    className='underline hover:text-blue-600'
                >
                    GitHub
                </a>
            </div>
        </section>
    );
}

function Updates() {
    return (
        <section>
            <h2 className='mb-4 text-xl font-semibold tracking-tight'>
                Now / Updates
            </h2>
            <div className='my-6'>
                <BlogPosts />
            </div>
        </section>
    );
}

// ------------------------------
// Page
// ------------------------------

export default function Page() {
    return (
        <section className='space-y-12'>
            <Hero />
            <FeaturedWork />
            <AboutContact />
            <Updates />
        </section>
    );
}
