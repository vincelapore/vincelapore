import { PerformanceGallery } from "../components/performance-gallery";

type Performance = {
    title: string;
    blurb: string;
    images: { src: string; alt: string }[];
    previewCount?: number;
    priorityCount?: number;
};

const prehistoricShots = Array.from({ length: 18 }, (_, index) => {
    const frameNumber = index + 1;
    return {
        src: `/arts/prehistoric/image-${frameNumber}.png`,
        alt: `Prehistoric promo still ${frameNumber}`
    };
});

const performances: Performance[] = [
    {
        title: "Underground Theatre Company: Prehistoric (2025)",
        blurb: "Punk Brisbane play.",
        images: prehistoricShots,
        priorityCount: 2
    }
    // {
    //     title: "Shake & Stir: Hamlet; As You Like It",
    //     blurb: "Immersive installation exploring eroded architecture. Swap in your own photos by updating the array below and placing files under public/arts/future-fossils/.",
    //     images: [
    //         {
    //             src: "/arts/future-fossils/image-1.jpg",
    //             alt: "Future Fossils 2024 light study"
    //         },
    //         {
    //             src: "/arts/future-fossils/image-2.jpg",
    //             alt: "Future Fossils 2024 resin cast detail"
    //         },
    //         {
    //             src: "/arts/future-fossils/image-3.jpg",
    //             alt: "Future Fossils 2024 gallery view"
    //         }
    //     ]
    // }
];

export const metadata = {
    title: "Arts"
};

export default function ArtsPage() {
    return (
        <section>
            <div className='mb-12 space-y-4'>
                <h1 className='text-3xl font-semibold'>Projects</h1>
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
                                {performance.title}
                            </h2>
                            <p className='text-neutral-600 dark:text-neutral-400'>
                                {performance.blurb}
                            </p>
                        </div>

                        <PerformanceGallery
                            title={performance.title}
                            images={performance.images}
                            previewCount={performance.previewCount}
                            priorityCount={performance.priorityCount}
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}
