import type { StaticImageData } from "next/image";

import imagePrehistoric1 from "../../public/arts/prehistoric/image-1.png";
import imagePrehistoric2 from "../../public/arts/prehistoric/image-2.png";
import imagePrehistoric4 from "../../public/arts/prehistoric/image-4.png";
import imagePrehistoric5 from "../../public/arts/prehistoric/image-5.png";
import imagePrehistoric6 from "../../public/arts/prehistoric/image-6.png";
import imagePrehistoric7 from "../../public/arts/prehistoric/image-7.png";
import imagePrehistoric8 from "../../public/arts/prehistoric/image-8.png";
import imagePrehistoric9 from "../../public/arts/prehistoric/image-9.png";
import imagePrehistoric10 from "../../public/arts/prehistoric/image-10.png";
import imagePrehistoric11 from "../../public/arts/prehistoric/image-11.png";
import imagePrehistoric12 from "../../public/arts/prehistoric/image-12.png";
import imagePrehistoric13 from "../../public/arts/prehistoric/image-13.png";

import { PerformanceGallery } from "../components/performance-gallery";

type Performance = {
    title: string;
    blurb: string;
    images: { src: StaticImageData | string; alt: string }[];
    previewCount?: number;
    priorityCount?: number;
};

const prehistoricShots = [
    { src: imagePrehistoric1, alt: "Prehistoric rehearsal still 1" },
    { src: imagePrehistoric2, alt: "Prehistoric rehearsal still 2" },
    { src: imagePrehistoric4, alt: "Prehistoric rehearsal still 3" },
    { src: imagePrehistoric5, alt: "Prehistoric rehearsal still 4" },
    { src: imagePrehistoric6, alt: "Prehistoric rehearsal still 5" },
    { src: imagePrehistoric7, alt: "Prehistoric rehearsal still 6" },
    { src: imagePrehistoric8, alt: "Prehistoric rehearsal still 7" },
    { src: imagePrehistoric9, alt: "Prehistoric rehearsal still 8" },
    { src: imagePrehistoric10, alt: "Prehistoric rehearsal still 9" },
    { src: imagePrehistoric11, alt: "Prehistoric rehearsal still 10" },
    { src: imagePrehistoric12, alt: "Prehistoric rehearsal still 11" },
    { src: imagePrehistoric13, alt: "Prehistoric rehearsal still 12" }
];

const performances: Performance[] = [
    {
        title: "Underground Theatre Company: Prehistoric (2025)",
        blurb: "As Pete. Punk Brisbane play.",
        images: prehistoricShots,
        priorityCount: 2
    },
    {
        title: "Shake & Stir: Hamlet; As You Like It",
        blurb: "As Osric and Touchstone. As part of the January Production, ShakeFest.",
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
            <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
                Projects
            </h1>
            <p className='mb-12'>
                Each project blends movement, sound, and digital scenography.
                Browse recent performances below, then jump to the code archive
                to see how the tech experiments come together.
            </p>

            <section>
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
            </section>
        </section>
    );
}
