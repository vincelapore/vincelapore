import Image from "next/image";

type Performance = {
    title: string;
    year: string;
    blurb: string;
    images: { src: string; alt: string }[];
};

const prehistoricShots = Array.from({ length: 6 }, (_, index) => {
    const frameNumber = index + 1;
    return {
        src: `/arts/prehistoric/image-${frameNumber}.png`,
        alt: `Prehistoric promo still ${frameNumber}`
    };
});

const performances: Performance[] = [
    {
        title: "Prehistoric",
        year: "2025",
        blurb: "Punk Brisbane play.",
        images: prehistoricShots
    },
    {
        title: "Future Fossils",
        year: "2024",
        blurb: "Immersive installation exploring eroded architecture. Swap in your own photos by updating the array below and placing files under public/arts/future-fossils/.",
        images: [
            {
                src: "/arts/future-fossils/image-1.jpg",
                alt: "Future Fossils 2024 light study"
            },
            {
                src: "/arts/future-fossils/image-2.jpg",
                alt: "Future Fossils 2024 resin cast detail"
            },
            {
                src: "/arts/future-fossils/image-3.jpg",
                alt: "Future Fossils 2024 gallery view"
            }
        ]
    }
];

export const metadata = {
    title: "Arts"
};

export default function ArtsPage() {
    return (
        <section>
            <div className='mb-12 space-y-4'>
                <h1 className='text-3xl font-semibold'>
                    Live Arts & Installations
                </h1>
                <p className='text-neutral-600 dark:text-neutral-400'>
                    Each project blends movement, sound, and digital
                    scenography. Browse recent performances below, then jump to
                    the code archive to see how the tech experiments come
                    together.
                </p>
            </div>

            <div className='space-y-16'>
                {performances.map((performance) => (
                    <article key={performance.title} className='space-y-6'>
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold tracking-tight'>
                                {performance.title} ({performance.year})
                            </h2>
                            <p className='text-neutral-600 dark:text-neutral-400'>
                                {performance.blurb}
                            </p>
                        </div>

                        <div className='-mx-4 overflow-x-auto pb-4'>
                            <div className='flex gap-4 px-4'>
                                {performance.images.map((image, index) => (
                                    <div
                                        key={image.src}
                                        className='relative h-64 w-48 flex-none overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 sm:h-72 sm:w-56'
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className='object-cover object-center'
                                            sizes='(min-width: 1024px) 224px, (min-width: 640px) 192px, 178px'
                                            priority={
                                                performance.title ===
                                                    "Prehistoric" && index < 2
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
